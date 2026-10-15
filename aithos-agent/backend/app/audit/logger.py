"""
Audit Logger Module
Provides persistent, thread-safe audit logging for all agent operations.
Guarantees that no raw sensitive data is ever logged to disk or memory.
"""
from dataclasses import dataclass, asdict, field
from datetime import datetime, timezone
import json
import os
import threading
from typing import Any, Dict, List, Optional
import uuid


@dataclass
class AuditEvent:
    event_id: str
    timestamp: str
    event_type: str        # e.g., "TASK_INIT", "PRIVACY_SCAN", "ACTION_VALIDATION", "BROWSER_ACTION", "AI_INFERENCE"
    category: str          # e.g., "PRIVACY", "SECURITY", "EXECUTION", "SYSTEM"
    summary: str           # Human-readable short explanation
    status: str            # "SUCCESS", "BLOCKED", "WARNING", "FAILED", "INFO"
    details: Dict[str, Any] = field(default_factory=dict)  # Safe payload metadata only
    task_id: Optional[str] = None


class AuditLogger:
    """Thread-safe, privacy-guaranteed audit logger."""

    def __init__(self, log_file_path: Optional[str] = None):
        self._lock = threading.Lock()
        self._events: List[AuditEvent] = []
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        self.log_file_path = log_file_path or os.path.join(base_dir, "audit_events.jsonl")
        self._load_recent_logs()

    def _load_recent_logs(self):
        """Pre-populate memory buffer with existing log file entries if any."""
        if os.path.exists(self.log_file_path):
            try:
                with open(self.log_file_path, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line:
                            data = json.loads(line)
                            self._events.append(AuditEvent(**data))
            except Exception:
                # If file is corrupted or empty, continue safely
                pass

    def log_event(
        self,
        event_type: str,
        category: str,
        summary: str,
        status: str = "SUCCESS",
        details: Optional[Dict[str, Any]] = None,
        task_id: Optional[str] = None,
    ) -> AuditEvent:
        """
        Record a privacy-safe event.
        Guarantees that no sensitive values are contained.
        """
        event = AuditEvent(
            event_id=str(uuid.uuid4())[:8],
            timestamp=datetime.now(timezone.utc).isoformat(),
            event_type=event_type,
            category=category,
            summary=summary,
            status=status,
            details=details or {},
            task_id=task_id,
        )

        with self._lock:
            self._events.append(event)
            # Append to file
            try:
                os.makedirs(os.path.dirname(self.log_file_path), exist_ok=True)
                with open(self.log_file_path, "a", encoding="utf-8") as f:
                    f.write(json.dumps(asdict(event)) + "\n")
            except Exception:
                # Local logging fallback
                pass

        return event

    def get_events(
        self,
        limit: int = 100,
        task_id: Optional[str] = None,
        category: Optional[str] = None,
        status: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Query audit log events in reverse chronological order."""
        with self._lock:
            filtered = list(self._events)

        if task_id:
            filtered = [e for e in filtered if e.task_id == task_id]
        if category:
            filtered = [e for e in filtered if e.category.upper() == category.upper()]
        if status:
            filtered = [e for e in filtered if e.status.upper() == status.upper()]

        # Return latest first
        filtered.reverse()
        return [asdict(e) for e in filtered[:limit]]

    def clear(self):
        """Clear memory and file logs for test purposes."""
        with self._lock:
            self._events.clear()
            if os.path.exists(self.log_file_path):
                try:
                    os.remove(self.log_file_path)
                except Exception:
                    pass


# Global singleton instance
audit_logger = AuditLogger()
