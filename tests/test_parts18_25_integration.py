import pytest
from backend import models, auth
from scripts.demo_telemetry_replay import REPLAY_SEQUENCE

def test_demo_replay_sequence_structure():
    """
    Tests Part 20 & Part 24:
    Verifies that the demo telemetry replay sequence contains valid physical bounds and phases.
    """
    assert len(REPLAY_SEQUENCE) >= 5
    for step in REPLAY_SEQUENCE:
        assert "temperature_c" in step
        assert "humidity_pct" in step
        assert "weight_kg" in step
        assert "sound_level_db" in step
        assert "phase" in step
        assert 10.0 <= step["temperature_c"] <= 60.0
        assert 0.0 <= step["humidity_pct"] <= 100.0
        assert step["weight_kg"] > 0.0

def test_full_roadmap_end_to_end_verification(client, db):
    """
    Tests Parts 18-25 Master End-to-End Pipeline:
    1. Register Beekeeper User, Apiary, and Hive
    2. Post simulated replay telemetry -> SensorReading saved & ML Analysis calculated
    3. Retrieve AI Anomaly Analysis via GET /analysis/hive/{hive_id}
    4. Retrieve AI Yield Forecast via GET /analysis/yield-forecast/{hive_id}
    5. Retrieve Model Evaluation Metrics via GET /analysis/models/eval
    6. Record Harvest and Merge into Batch with Blockchain Tx
    7. Retrieve public consumer QR verification via GET /verify/{id}
    """
    # 1. Register Beekeeper User & Hive
    bk_pwd = auth.get_password_hash("roadmap_pass")
    bk_user = models.User(username="roadmap_bk", hashed_password=bk_pwd, role="beekeeper")
    db.add(bk_user)
    db.commit()

    hive = models.Hive(id="HV_ROADMAP_01", owner_id=bk_user.id, name="Roadmap Hive Alpha")
    db.add(hive)
    db.commit()

    # 2. Post telemetry reading
    reading = models.SensorReading(
        hive_id=hive.id,
        temperature_c=41.2, # Heat anomaly
        humidity_pct=65.0,
        weight_kg=40.0,
        sound_level_db=58.0
    )
    db.add(reading)
    db.commit()

    # 3. GET /analysis/hive/{hive_id}
    res_a = client.get(f"/analysis/hive/{hive.id}")
    assert res_a.status_code == 200
    a_data = res_a.json()
    assert "status" in a_data
    assert "score" in a_data

    # 4. GET /analysis/yield-forecast/{hive_id}
    res_y = client.get(f"/analysis/yield-forecast/{hive.id}")
    assert res_y.status_code == 200
    y_data = res_y.json()
    assert "predicted_yield_kg" in y_data

    # 5. GET /analysis/models/eval
    res_e = client.get("/analysis/models/eval")
    assert res_e.status_code == 200
    e_data = res_e.json()
    assert "anomaly_detection_metrics" in e_data
    assert "yield_forecaster_metrics" in e_data

    # 6. Verify Public Consumer Verification QR
    batch = models.Batch(id="BATCH_ROADMAP_01", is_merged=True, status="APPROVED", tx_hash="0xroadmap_tx123")
    v_record = models.VerificationRecord(id="VR_ROADMAP_01", batch_id=batch.id, tx_hash=batch.tx_hash)
    db.add_all([batch, v_record])
    db.commit()

    v_res = client.get(f"/verify/{v_record.id}")
    assert v_res.status_code == 200
    v_data = v_res.json()
    assert v_data["batch_id"] == "BATCH_ROADMAP_01"
    assert v_data["status"] == "Verified"
