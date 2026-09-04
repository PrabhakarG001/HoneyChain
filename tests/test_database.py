import pytest
from sqlalchemy.exc import IntegrityError
from datetime import datetime
from backend import models

def test_user_farm_hive_relationships(db):
    user = models.User(username="farmer_joe", hashed_password="hashed_pwd", role="beekeeper")
    db.add(user)
    db.commit()

    farm = models.Farm(
        id="FARM_J1",
        owner_id=user.id,
        name="Joe's Honey Farm",
        location="County Road 5",
        area=12.0,
        number_of_hives=5
    )
    db.add(farm)
    db.commit()

    hive = models.Hive(id="HV_J1", owner_id=user.id, farm_id=farm.id, name="Hive One", location="East Field")
    db.add(hive)
    db.commit()

    # Query relationships
    queried_user = db.query(models.User).filter_by(username="farmer_joe").first()
    assert len(queried_user.farms) == 1
    assert queried_user.farms[0].name == "Joe's Honey Farm"

    queried_farm = db.query(models.Farm).filter_by(id="FARM_J1").first()
    assert len(queried_farm.hives) == 1
    assert queried_farm.hives[0].id == "HV_J1"

def test_unique_username_constraint(db):
    user1 = models.User(username="unique_user", hashed_password="pwd1", role="beekeeper")
    db.add(user1)
    db.commit()

    user2 = models.User(username="unique_user", hashed_password="pwd2", role="processor")
    db.add(user2)
    with pytest.raises(IntegrityError):
        db.commit()
    db.rollback()

def test_sensor_reading_and_ml_analysis_models(db, test_beekeeper_user):
    hive = models.Hive(id="HV_SENSOR_1", owner_id=test_beekeeper_user.id, name="Sensor Hive")
    db.add(hive)
    db.commit()

    reading = models.SensorReading(
        hive_id=hive.id,
        timestamp=datetime.utcnow(),
        temperature_c=35.2,
        humidity_pct=48.5,
        weight_kg=42.0,
        sound_level_db=40.0
    )
    db.add(reading)

    analysis = models.MLAnalysis(
        hive_id=hive.id,
        timestamp=datetime.utcnow(),
        risk_score=0.15,
        status="Normal",
        highest_contributor="None",
        model_version="if_v1.0"
    )
    db.add(analysis)
    db.commit()

    saved_reading = db.query(models.SensorReading).filter_by(hive_id=hive.id).first()
    assert saved_reading.temperature_c == 35.2
    assert saved_reading.hive.name == "Sensor Hive"

    saved_analysis = db.query(models.MLAnalysis).filter_by(hive_id=hive.id).first()
    assert saved_analysis.status == "Normal"
    assert saved_analysis.risk_score == 0.15

def test_verification_record_batch_relationship(db):
    batch = models.Batch(id="BATCH_V1", is_merged=True, status="Bottled")
    tx = models.BlockchainTransaction(related_table="honey_batches", related_id=batch.id, tx_hash="0x123456789abcdef", action_type="MERGE_BATCHES")
    db.add_all([batch, tx])
    db.commit()

    verification = models.VerificationRecord(id="VERIFY_V1", batch_id=batch.id, tx_hash=tx.tx_hash)
    db.add(verification)
    db.commit()

    saved_v = db.query(models.VerificationRecord).filter_by(id="VERIFY_V1").first()
    assert saved_v.batch.status == "Bottled"
    assert saved_v.tx_hash == "0x123456789abcdef"
