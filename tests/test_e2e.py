import pytest
import json
from unittest.mock import MagicMock, patch
from backend.services.mqtt_worker import MQTTWorker
from backend import models, auth

def test_e2e_sensor_to_qr_pipeline(client, db):
    """
    End-to-End Test:
    1. Register Beekeeper User & Farm
    2. Register Hive
    3. Simulate ESP32 MQTT Telemetry publication -> Worker saves SensorReading & triggers MLAnalysis
    4. Create Harvest from Hive
    5. Processor Merges Harvests into Batch -> Blockchain transaction created & VerificationRecord created
    6. Consumer scans QR code -> Public Verification endpoint retrieves verified batch status
    """
    # 1. Register Beekeeper User & Farm
    beekeeper_pwd = auth.get_password_hash("bk_password")
    beekeeper = models.User(username="e2e_beekeeper", hashed_password=beekeeper_pwd, role="beekeeper")
    db.add(beekeeper)
    db.commit()

    farm = models.Farm(id="FARM_E2E", owner_id=beekeeper.id, name="E2E Apiary")
    db.add(farm)
    db.commit()

    # 2. Register Hive
    hive = models.Hive(id="HV_E2E_01", owner_id=beekeeper.id, farm_id=farm.id, name="E2E Hive Alpha")
    db.add(hive)
    db.commit()

    # 3. Simulate ESP32 MQTT Telemetry
    worker = MQTTWorker()
    msg = MagicMock()
    telemetry_data = {
        "hive_id": "HV_E2E_01",
        "timestamp": "2026-08-25T10:00:00Z",
        "temperature_c": 35.5,
        "humidity_pct": 51.0,
        "weight_kg": 44.0,
        "sound_level_db": 39.0
    }
    msg.payload = json.dumps(telemetry_data).encode("utf-8")

    with patch("backend.services.mqtt_worker.SessionLocal", return_value=db):
        worker.on_message(None, None, msg)

    # Verify Telemetry & ML in DB
    reading = db.query(models.SensorReading).filter_by(hive_id="HV_E2E_01").first()
    assert reading is not None
    assert reading.temperature_c == 35.5

    analysis = db.query(models.MLAnalysis).filter_by(hive_id="HV_E2E_01").first()
    assert analysis is not None
    assert analysis.status in ["Normal", "Attention Required", "High Risk"]

    # 4. Create Harvest
    harvest = models.Harvest(id="HARVEST_E2E_1", hive_id="HV_E2E_01", weight_kg=25.0)
    db.add(harvest)
    db.commit()

    # 5. Processor Merges Batch (with contract client mocked for active Web3 RPC)
    processor_pwd = auth.get_password_hash("proc_password")
    processor = models.User(username="e2e_processor", hashed_password=processor_pwd, role="processor")
    db.add(processor)
    db.commit()

    proc_token = auth.create_access_token(
        data={"sub": processor.username, "role": processor.role}
    )
    headers = {"Authorization": f"Bearer {proc_token}"}

    merge_payload = {
        "parent_harvest_ids": ["HARVEST_E2E_1"],
        "document_hash": "0xe2edochash12345"
    }

    with patch("backend.services.contract_client.contract_client.create_batch", return_value="0xe2etxhash9999"):
        resp = client.post("/batches/merge", json=merge_payload, headers=headers)
        assert resp.status_code == 200
        result = resp.json()
        assert "batch_id" in result
        batch_id = result["batch_id"]
        assert result["tx_hash"] == "0xe2etxhash9999"

    # 6. Consumer Scans QR Code
    verification = db.query(models.VerificationRecord).filter_by(batch_id=batch_id).first()
    assert verification is not None

    qr_resp = client.get(f"/verify/{verification.id}")
    assert qr_resp.status_code == 200
    qr_data = qr_resp.json()
    assert qr_data["id"] == verification.id
    assert qr_data["batch_id"] == batch_id
    assert qr_data["tx_hash"] == "0xe2etxhash9999"
    assert qr_data["status"] == "Verified"
