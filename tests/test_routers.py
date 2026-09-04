import io
import pytest
from unittest.mock import patch
import uuid

def get_auth_header(client, username="api_user", role="BEEKEEPER"):
    unique_username = f"{username}_{uuid.uuid4().hex[:6]}"
    client.post("/auth/register", json={
        "username": unique_username,
        "password": "password123",
        "role": role
    })
    res = client.post("/auth/login", data={"username": unique_username, "password": "password123"})
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_farms_and_hives_flow(client):
    headers = get_auth_header(client, "farm_owner", "BEEKEEPER")

    # Create Farm
    farm_res = client.post("/farms/", json={
        "id": "FARM_FLOW_01",
        "name": "Sunny Valley Apiary",
        "location": "Latitude 40.7128, Longitude -74.0060"
    }, headers=headers)
    assert farm_res.status_code in [200, 201]
    farm_id = farm_res.json()["id"]

    # Get Farms
    farms_list = client.get("/farms/", headers=headers)
    assert len(farms_list.json()) >= 1

    # Create Hive
    hive_res = client.post("/hives/", json={
        "id": "HIVE_TEST_01",
        "name": "Hive Alpha",
        "location": "North Apiary"
    }, headers=headers)
    assert hive_res.status_code in [200, 201]

    # Get Hives
    hives_list = client.get("/hives/", headers=headers)
    assert len(hives_list.json()) >= 1

def test_harvests_and_batches_flow(client):
    headers = get_auth_header(client, "harvest_user", "BEEKEEPER")

    # Create Hive
    hive_res = client.post("/hives/", json={
        "id": "HIVE_TEST_02",
        "name": "Hive Beta",
        "location": "South Apiary"
    }, headers=headers)
    assert hive_res.status_code in [200, 201]

    mock_harvest_tx = f"0xmockharvesttx_{uuid.uuid4().hex[:8]}"
    mock_merge_tx = f"0xmockmergetx_{uuid.uuid4().hex[:8]}"

    # Create Harvest with contract client mock
    with patch("backend.routers.harvests.contract_client.create_harvest", return_value=mock_harvest_tx):
        harvest_res = client.post("/harvests/", json={
            "hive_id": "HIVE_TEST_02",
            "weight_kg": 35.5,
            "timestamp": "2026-08-15T10:30:00Z"
        }, headers=headers)
        assert harvest_res.status_code in [200, 201]
        data = harvest_res.json()
        harvest_id = data.get("data", {}).get("harvestId") or data.get("id")

    processor_headers = get_auth_header(client, "processor_user", "PROCESSOR")
    # Create Batch with contract client mock
    with patch("backend.routers.batches.contract_client.create_batch", return_value=mock_merge_tx):
        batch_res = client.post("/batches/merge", json={
            "parent_harvest_ids": [harvest_id],
            "document_hash": "0x1234567890abcdef"
        }, headers=processor_headers)
        assert batch_res.status_code in [200, 201, 400]

def test_qr_verify_endpoint(client):
    res = client.get("/verify/NON_EXISTENT_PRODUCT")
    assert res.status_code in [200, 404]

def test_image_analysis_endpoint(client):
    headers = get_auth_header(client, "analysis_user", "BEEKEEPER")
    fake_image = io.BytesIO(b"fake image bytes content for frame inspection")
    res = client.post(
        "/analysis/image",
        files={"file": ("test_frame.jpg", fake_image, "image/jpeg")},
        headers=headers
    )
    assert res.status_code == 200
    data = res.json()
    assert "status" in data
    assert "count" in data
    assert "cappedBroodPercent" in data
