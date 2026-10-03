import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "HEALTHY"
    assert data["models"]["supervised_classifier"] is True
    assert data["models"]["deep_autoencoder"] is True

def test_triage_queue():
    res = client.get("/api/v1/queue")
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert len(data["items"]) > 0
    assert "summary" in data
    assert data["summary"]["total"] >= 18

def test_application_dossier():
    res = client.get("/api/v1/applications/APP-10293")
    assert res.status_code == 200
    data = res.json()
    assert data["application_ref"] == "APP-10293"
    assert "analytics_report" in data
    assert "evidence_items" in data
    assert "relationships" in data

def test_copilot_grounded_query():
    res = client.post("/api/v1/copilot/query", json={
        "question": "Why was this application flagged?",
        "application_ref": "APP-10293",
        "persona": "bank"
    })
    assert res.status_code == 200
    data = res.json()
    assert "reply" in data
    assert "Risk Analysis" in data["reply"] or "Score" in data["reply"]
    assert data["sop_citation"] is not None

def test_sop_endpoints():
    res = client.get("/api/v1/sops")
    assert res.status_code == 200
    sops = res.json()["sops"]
    assert len(sops) >= 5

def test_record_analyst_decision():
    res = client.post("/api/v1/cases/action", json={
        "application_ref": "APP-10293",
        "decision": "UNDER_REVIEW",
        "reason_code": "RC_SHARED_DEVICE_INVESTIGATION",
        "rationale": "Initiating 3-way telephonic verification for shared device syndicate.",
        "analyst_name": "Test Analyst",
        "analyst_role": "FRAUD_ANALYST"
    })
    assert res.status_code == 200
    assert res.json()["status"] == "SUCCESS"
