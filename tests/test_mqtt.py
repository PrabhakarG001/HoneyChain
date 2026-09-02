import pytest
import json
from unittest.mock import MagicMock, patch
from datetime import datetime
from backend.services.mqtt_worker import MQTTWorker
from backend.schemas import MQTTPayload
from backend import models

def test_mqtt_payload_schema_validation():
    valid_payload = {
        "hive_id": "HV-MQTT-001",
        "timestamp": "2026-08-20T12:00:00Z",
        "temperature_c": 34.5,
        "humidity_pct": 52.0,
        "weight_kg": 40.2,
        "sound_level_db": 38.0
    }
    parsed = MQTTPayload(**valid_payload)
    assert parsed.hive_id == "HV-MQTT-001"
    assert parsed.temperature_c == 34.5

    # Missing required field
    invalid_payload = {
        "hive_id": "HV-MQTT-001",
        "temperature_c": 34.5
    }
    with pytest.raises(Exception):
        MQTTPayload(**invalid_payload)

def test_mqtt_worker_on_message_processing(db):
    worker = MQTTWorker()
    
    # Mock message
    msg = MagicMock()
    payload_data = {
        "hive_id": "HV-WORKER-01",
        "timestamp": "2026-08-20T14:30:00Z",
        "temperature_c": 36.1,
        "humidity_pct": 49.0,
        "weight_kg": 45.0,
        "sound_level_db": 41.5
    }
    msg.payload = json.dumps(payload_data).encode("utf-8")

    # Seed hive
    hive = models.Hive(id="HV-WORKER-01", name="Worker Hive")
    db.add(hive)
    db.commit()

    # Trigger on_message with SessionLocal overridden
    with patch("backend.services.mqtt_worker.SessionLocal", return_value=db):
        worker.on_message(None, None, msg)

    # Verify SensorReading saved to DB
    reading = db.query(models.SensorReading).filter_by(hive_id="HV-WORKER-01").first()
    assert reading is not None
    assert reading.temperature_c == 36.1
    assert reading.weight_kg == 45.0

    # Verify MLAnalysis created
    analysis = db.query(models.MLAnalysis).filter_by(hive_id="HV-WORKER-01").first()
    assert analysis is not None
    assert analysis.status in ["Normal", "Attention Required", "High Risk"]

def test_mqtt_worker_invalid_json_payload(db):
    worker = MQTTWorker()
    msg = MagicMock()
    msg.payload = b"NOT_VALID_JSON_STRING"

    # Should log error gracefully without crashing worker
    with patch("backend.services.mqtt_worker.logger") as mock_logger:
        worker.on_message(None, None, msg)
        assert mock_logger.error.called
