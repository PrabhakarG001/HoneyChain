import pytest
import asyncio
from fastapi.testclient import TestClient
from fastapi.websockets import WebSocket
from datetime import datetime
from backend.main import app
from backend.database import Base, get_db
from tests.conftest import engine, TestingSessionLocal
from backend import models, auth

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    
    def _override_get_db():
        session = TestingSessionLocal()
        try:
            yield session
        finally:
            session.close()

    app.dependency_overrides[get_db] = _override_get_db

    db = TestingSessionLocal()
    try:
        user = db.query(models.User).filter(models.User.username == "test_beekeeper@honeychain.dev").first()
        if not user:
            user = models.User(
                name="Test Beekeeper",
                username="test_beekeeper@honeychain.dev",
                hashed_password=auth.get_password_hash("password123"),
                role="beekeeper"
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        hive = db.query(models.Hive).filter(models.Hive.id == "HIVE_TEST_001").first()
        if not hive:
            hive = models.Hive(
                id="HIVE_TEST_001",
                name="Alpha Test Hive",
                location="Zone A",
                owner_id=user.id
            )
            db.add(hive)
            db.commit()
    finally:
        db.close()

    yield
    app.dependency_overrides.clear()

def get_auth_token():
    response = client.post("/auth/login", data={
        "username": "test_beekeeper@honeychain.dev",
        "password": "password123"
    })
    assert response.status_code == 200, response.text
    return response.json()["access_token"]

def test_rest_harvest_creation():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    payload = {
        "hive_id": "HIVE_TEST_001",
        "weight_kg": 35.8,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    response = client.post("/api/harvests", json=payload, headers=headers)
    assert response.status_code == 201, response.text
    data = response.json()
    assert data["success"] is True
    assert data["data"]["hiveId"] == "HIVE_TEST_001"
    assert data["data"]["weightKg"] == 35.8
    assert "harvestId" in data["data"]
    assert "batchId" in data["data"]

def test_rest_historical_readings():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.get("/api/hives/HIVE_TEST_001/readings?range=24h&limit=10", headers=headers)
    assert response.status_code == 200, response.text
    assert isinstance(response.json(), list)

def test_rest_consumer_verification():
    # First record a harvest to get a batch
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    payload = {
        "hive_id": "HIVE_TEST_001",
        "weight_kg": 20.0,
        "timestamp": datetime.utcnow().isoformat()
    }
    h_res = client.post("/api/harvests", json=payload, headers=headers)
    batch_id = h_res.json()["data"]["batchId"]

    # Test public consumer verification without auth
    v_res = client.get(f"/api/verify/{batch_id}")
    assert v_res.status_code == 200, v_res.text
    v_data = v_res.json()
    assert v_data["success"] is True
    assert v_data["batch_id"] == batch_id
    assert v_data["status"] == "Verified"

def test_websocket_telemetry_hub():
    token = get_auth_token()
    with client.websocket_connect(f"/ws/telemetry?token={token}") as websocket:
        # Check initial connection message
        data = websocket.receive_json()
        assert data["type"] == "connection_established"
        
        # Test ping / pong
        websocket.send_json({"type": "ping"})
        pong = websocket.receive_json()
        assert pong["type"] == "pong"
        
        # Test subscribe to hive
        websocket.send_json({"type": "subscribe", "hiveId": "HIVE_TEST_001"})
        sub_res = websocket.receive_json()
        assert sub_res["type"] == "subscription_success"
        assert sub_res["hiveId"] == "HIVE_TEST_001"
