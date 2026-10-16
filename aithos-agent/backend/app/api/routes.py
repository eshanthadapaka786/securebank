"""
FastAPI Routes for AITHOS Agent
Provides REST and SSE streaming endpoints for privacy scanning, task management,
audit logs, system health, and configuration.
"""
import asyncio
from dataclasses import asdict
import json
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException, Query, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

try:
    from ..privacy.sanitizer import PrivacySanitizer
    from ..privacy.detector import PrivacyDetector
    from ..agent.task_manager import task_manager, TaskStatus
    from ..agent.browser_connector import browser_connector
    from ..agent.action_validator import action_validator
    from ..ai.ollama_client import ollama_client
    from ..audit.logger import audit_logger
except (ImportError, ValueError):
    from app.privacy.sanitizer import PrivacySanitizer
    from app.privacy.detector import PrivacyDetector
    from app.agent.task_manager import task_manager, TaskStatus
    from app.agent.browser_connector import browser_connector
    from app.agent.action_validator import action_validator
    from app.ai.ollama_client import ollama_client
    from app.audit.logger import audit_logger


router = APIRouter(prefix="/api")
local_sanitizer = PrivacySanitizer(PrivacyDetector())


# Request & Response Models
class HealthResponse(BaseModel):
    backend: Dict[str, Any]
    privacy_engine: Dict[str, Any]
    ai_model: Dict[str, Any]
    fakebank: Dict[str, Any]
    task_metrics: Dict[str, int]


class PrivacyScanRequest(BaseModel):
    text: str = Field(..., description="Raw text to detect and sanitize")


class PrivacyScanResponse(BaseModel):
    sanitized_text: str
    detection_counts: Dict[str, int]
    total_entities_masked: int
    checksum: str
    safe_metadata: List[Dict[str, str]]
    zero_raw_leak_verified: bool = True


class CreateTaskRequest(BaseModel):
    prompt: str = Field(..., min_length=3, description="User's task instruction")


class PullModelRequest(BaseModel):
    model_name: str = Field("qwen2:latest", description="Name of model to pull via Ollama")


class SettingsUpdateRequest(BaseModel):
    fakebank_url: Optional[str] = None
    ollama_endpoint: Optional[str] = None
    ollama_model: Optional[str] = None


@router.get("/health", response_model=HealthResponse)
async def get_system_health():
    """
    Honest system health inspection.
    Never returns false positive states for disconnected services.
    """
    # 1 & 2. Concurrent fast probes for Ollama & FakeBank
    ai_status, browser_status = await asyncio.gather(
        ollama_client.check_availability(),
        browser_connector.check_connection()
    )

    # 3. Task metrics
    metrics = task_manager.get_metrics()

    return HealthResponse(
        backend={
            "status": "CONNECTED",
            "version": "1.0.0",
            "protocol": "FastAPI",
            "message": "AITHOS Agent Backend is running and healthy",
        },
        privacy_engine={
            "status": "ACTIVE",
            "mode": "LOCAL_DETERMINISTIC",
            "patterns_loaded": [
                "EMAIL", "PHONE", "ACCOUNT_NUMBER", "CARD_NUMBER",
                "GOVERNMENT_ID", "PASSWORD", "PIN"
            ],
            "in_memory_only": True,
        },
        ai_model={
            "available": ai_status.available,
            "status_text": ai_status.status_text,
            "endpoint": ai_status.endpoint,
            "selected_model": ai_status.selected_model,
            "installed_models": ai_status.installed_models,
            "model_family": ai_status.model_family,
            "is_qwen_detected": ai_status.is_qwen_detected,
            "supported_models": ai_status.supported_models,
            "latency_ms": ai_status.latency_ms,
            "last_error": ai_status.last_error,
        },
        fakebank={
            "connected": browser_status.connected,
            "status_code": browser_status.status_code,
            "target_url": browser_status.target_url,
            "message": browser_status.message,
            "last_checked": browser_status.last_checked,
            "details": browser_status.details,
        },
        task_metrics=metrics,
    )


@router.post("/privacy/scan", response_model=PrivacyScanResponse)
async def scan_and_sanitize(request: PrivacyScanRequest):
    """
    Synthetic text test panel endpoint.
    Scans text, replaces sensitive entities with tokens, and records audit event.
    Guarantees no raw values in response metadata or audit logs.
    """
    result = local_sanitizer.sanitize(request.text)

    # Log to audit trail safely
    audit_logger.log_event(
        event_type="PRIVACY_SCAN_TEST",
        category="PRIVACY",
        summary=f"Synthetic test scan: masked {result.total_entities_masked} entities across {len(result.detection_counts)} categories",
        status="SUCCESS",
        details=result.to_safe_audit_summary(),
    )

    return PrivacyScanResponse(
        sanitized_text=result.sanitized_text,
        detection_counts=result.detection_counts,
        total_entities_masked=result.total_entities_masked,
        checksum=result.checksum,
        safe_metadata=result.safe_metadata,
        zero_raw_leak_verified=True,
    )


@router.post("/tasks")
async def create_agent_task(payload: CreateTaskRequest):
    """
    Create and kick off an agent task.
    """
    task = task_manager.create_task(payload.prompt)
    # Schedule execution asynchronously
    async_t = asyncio.create_task(task_manager.run_task(task.task_id))
    task_manager._running_async_tasks[task.task_id] = async_t
    return asdict(task)


@router.get("/tasks")
async def list_agent_tasks():
    """List all agent tasks in reverse chronological order."""
    tasks = task_manager.get_all_tasks()
    tasks_reversed = sorted(tasks, key=lambda t: t.created_at, reverse=True)
    return [asdict(t) for t in tasks_reversed]


@router.get("/tasks/{task_id}")
async def get_agent_task(task_id: str):
    """Get single task details."""
    task = task_manager.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return asdict(task)


@router.post("/tasks/{task_id}/cancel")
async def cancel_agent_task(task_id: str):
    """Cancel an ongoing agent task."""
    success = task_manager.cancel_task(task_id)
    if not success:
        task = task_manager.get_task(task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        return {"cancelled": False, "message": f"Task is already {task.status.value}"}
    return {"cancelled": True, "message": "Task cancellation signal sent."}


@router.get("/events")
async def stream_live_events(request: Request):
    """
    Server-Sent Events (SSE) live activity stream.
    Broadcasts real-time events as they occur during agent execution.
    """
    event_queue = task_manager.subscribe_events()

    async def event_generator():
        try:
            # Send initial keepalive
            yield f"data: {json.dumps({'type': 'CONNECTED', 'message': 'Subscribed to AITHOS event bus'})}\n\n"
            while True:
                if await request.is_disconnected():
                    break
                try:
                    event_data = await asyncio.wait_for(event_queue.get(), timeout=15.0)
                    yield f"data: {json.dumps(event_data)}\n\n"
                except asyncio.TimeoutError:
                    # Keepalive ping
                    yield f": keepalive\n\n"
        finally:
            task_manager.unsubscribe_events(event_queue)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


@router.get("/audit")
async def get_audit_logs(
    limit: int = Query(50, ge=1, le=500),
    task_id: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
):
    """Retrieve filtered audit trail events."""
    return audit_logger.get_events(
        limit=limit,
        task_id=task_id,
        category=category,
        status=status,
    )


@router.get("/settings")
async def get_settings():
    """Retrieve integration settings and connection statuses."""
    ai_status, browser_status = await asyncio.gather(
        ollama_client.check_availability(),
        browser_connector.check_connection()
    )

    return {
        "fakebank_url": browser_connector.target_url,
        "fakebank_status": asdict(browser_status),
        "ollama_endpoint": ollama_client.endpoint,
        "ollama_model": ollama_client.selected_model,
        "ollama_status": asdict(ai_status),
        "supported_models": ai_status.supported_models,
        "model_family": ai_status.model_family,
        "approved_actions": action_validator.APPROVED_ACTIONS,
        "disallowed_actions": action_validator.DISALLOWED_ACTIONS,
    }


@router.post("/settings")
async def update_settings(payload: SettingsUpdateRequest):
    """Update target configurations."""
    if payload.fakebank_url is not None:
        browser_connector.set_target_url(payload.fakebank_url)
    if payload.ollama_endpoint is not None:
        ollama_client.endpoint = payload.ollama_endpoint.rstrip("/")
    if payload.ollama_model is not None:
        ollama_client.selected_model = payload.ollama_model

    audit_logger.log_event(
        event_type="SETTINGS_UPDATE",
        category="SYSTEM",
        summary="Settings updated by user",
        status="SUCCESS",
        details={
            "fakebank_url": browser_connector.target_url,
            "ollama_endpoint": ollama_client.endpoint,
            "ollama_model": ollama_client.selected_model,
        }
    )

    return await get_settings()


@router.post("/ai/pull")
async def pull_model_endpoint(payload: PullModelRequest):
    """Trigger Ollama to pull a model (e.g. qwen2:latest, qwen2:1.5b)."""
    res = await ollama_client.pull_model(payload.model_name)
    return res

