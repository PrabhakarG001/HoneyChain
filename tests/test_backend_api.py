import pytest
from backend import models

def test_create_and_get_farms(client, beekeeper_auth_headers, test_beekeeper_user):
    payload = {
        "id": "FARM_001",
        "name": "Valley Honey Farm",
        "location": "North Apiary",
        "area": 5.5,
        "number_of_hives": 10,
        "bee_species": "Apis mellifera",
        "floral_source": "Wildflower",
        "status": "Active"
    }
    response = client.post("/farms/", json=payload, headers=beekeeper_auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "FARM_001"
    assert data["name"] == "Valley Honey Farm"

    # Get all farms for user
    get_resp = client.get("/farms/", headers=beekeeper_auth_headers)
    assert get_resp.status_code == 200
    farms = get_resp.json()
    assert len(farms) == 1
    assert farms[0]["id"] == "FARM_001"

def test_create_and_get_hive(client, beekeeper_auth_headers, db, test_beekeeper_user):
    # Setup farm first
    farm = models.Farm(id="FARM_002", owner_id=test_beekeeper_user.id, name="Test Farm")
    db.add(farm)
    db.commit()

    hive_payload = {
        "id": "HV-TEST-001",
        "name": "Hive Alpha",
        "location": "Sector 1"
    }
    response = client.post("/hives/", json=hive_payload, headers=beekeeper_auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "HV-TEST-001"

    # Get hive details
    get_resp = client.get("/hives/HV-TEST-001", headers=beekeeper_auth_headers)
    assert get_resp.status_code == 200
    assert get_resp.json()["name"] == "Hive Alpha"

def test_get_nonexistent_hive(client, beekeeper_auth_headers):
    response = client.get("/hives/NONEXISTENT_HIVE", headers=beekeeper_auth_headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "Hive not found"

def test_create_harvest(client, beekeeper_auth_headers, db, test_beekeeper_user):
    hive = models.Hive(id="HV-HARVEST-01", owner_id=test_beekeeper_user.id, name="Harvest Hive")
    db.add(hive)
    db.commit()

    harvest_payload = {
        "hive_id": "HV-HARVEST-01",
        "weight_kg": 24.5,
        "timestamp": "2026-08-15T10:30:00Z"
    }
    response = client.post("/harvests/", json=harvest_payload, headers=beekeeper_auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["hive_id"] == "HV-HARVEST-01"
    assert data["weight_kg"] == 24.5

def test_create_harvest_invalid_hive(client, beekeeper_auth_headers):
    harvest_payload = {
        "hive_id": "INVALID_HIVE_ID",
        "weight_kg": 15.0,
        "timestamp": "2026-08-15T10:30:00Z"
    }
    response = client.post("/harvests/", json=harvest_payload, headers=beekeeper_auth_headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "Hive not found"

def test_batch_merge_invalid_harvest_ids(client, processor_auth_headers):
    merge_payload = {
        "parent_harvest_ids": ["NON_EXISTENT_HARVEST_1", "NON_EXISTENT_HARVEST_2"],
        "document_hash": "0xabc123"
    }
    response = client.post("/batches/merge", json=merge_payload, headers=processor_auth_headers)
    assert response.status_code == 400
    assert "invalid" in response.json()["detail"].lower()

def test_get_nonexistent_batch(client):
    response = client.get("/batches/NONEXISTENT_BATCH")
    assert response.status_code == 404
    assert response.json()["detail"] == "Batch not found"
