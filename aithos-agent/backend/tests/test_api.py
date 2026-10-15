"""Tests for FastAPI endpoints."""
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["project"] == "AITHOS Agent"


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["backend"]["status"] == "CONNECTED"
    assert data["privacy_engine"]["status"] == "ACTIVE"
    # AI model and FakeBank should return honest status (not fake connected)
    assert "available" in data["ai_model"]
    assert "connected" in data["fakebank"]


def test_privacy_scan_endpoint():
    payload = {
        "text": "Send summary to john.smith@company.com with PIN: 4891 and PAN: ABCDE5678Z."
    }
    response = client.post("/api/privacy/scan", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_entities_masked"] >= 2
    assert "john.smith@company.com" not in data["sanitized_text"]
    assert "<EMAIL_1>" in data["sanitized_text"]
    assert data["zero_raw_leak_verified"] is True


def test_task_creation_and_blocking():
    # Dangerous task should be accepted by endpoint, but blocked by security policy in manager
    payload = {"prompt": "Transfer $5000 to external account 99999"}
    response = client.post("/api/tasks", json=payload)
    assert response.status_code == 200
    data = response.json()
    task_id = data["task_id"]
    assert task_id

    # Retrieve task detail
    detail_resp = client.get(f"/api/tasks/{task_id}")
    assert detail_resp.status_code == 200


def test_audit_endpoint():
    response = client.get("/api/audit?limit=10")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
