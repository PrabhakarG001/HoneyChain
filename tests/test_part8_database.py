import pytest
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import uuid

from backend.database import Base
from backend import models, schemas
from backend.services.genealogy import GenealogyEngine
from backend.auth import get_password_hash, verify_password

# Setup isolated in-memory SQLite database for testing
TEST_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# 1. User Creation & Authentication Test
def test_user_creation_and_auth(db_session):
    password = "SecretPassword123!"
    hashed = get_password_hash(password)
    user = models.User(
        username="bk_john",
        name="John Beekeeper",
        role="beekeeper",
        hashed_password=hashed
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    assert user.id is not None
    assert user.username == "bk_john"
    assert verify_password("SecretPassword123!", user.hashed_password) is True
    assert verify_password("WrongPass", user.hashed_password) is False

# 2. Beekeeper Creation & Uniqueness Test
def test_beekeeper_creation(db_session):
    user = models.User(username="bk_test", hashed_password="pwd", role="beekeeper")
    db_session.add(user)
    db_session.commit()

    bk = models.Beekeeper(
        id="BK_001",
        user_id=user.id,
        license_no="LIC-HONEY-99",
        location="Oregon Apiaries"
    )
    db_session.add(bk)
    db_session.commit()

    saved_bk = db_session.query(models.Beekeeper).filter(models.Beekeeper.id == "BK_001").first()
    assert saved_bk is not None
    assert saved_bk.license_no == "LIC-HONEY-99"

# 3. Apiary Creation & Lat/Lng Validation
def test_apiary_creation_and_coords(db_session):
    user = models.User(username="bk_apiary", hashed_password="pwd", role="beekeeper")
    db_session.add(user)
    db_session.commit()

    bk = models.Beekeeper(id="BK_002", user_id=user.id, license_no="LIC-002")
    db_session.add(bk)
    db_session.commit()

    apiary = models.Apiary(
        id="APIARY_NORTH",
        beekeeper_id=bk.id,
        name="North Clover Field",
        lat=45.5152,
        lng=-122.6784
    )
    db_session.add(apiary)
    db_session.commit()

    saved_apiary = db_session.query(models.Apiary).filter(models.Apiary.id == "APIARY_NORTH").first()
    assert saved_apiary.name == "North Clover Field"
    assert saved_apiary.lat == 45.5152

# 4. Hive Creation & Hive Code Test
def test_hive_creation(db_session):
    hive = models.Hive(
        id="HIVE_101",
        hive_code="HC-HIVE-101",
        name="Alpha Queen Hive",
        install_date=datetime.utcnow()
    )
    db_session.add(hive)
    db_session.commit()

    saved_hive = db_session.query(models.Hive).filter(models.Hive.id == "HIVE_101").first()
    assert saved_hive.hive_code == "HC-HIVE-101"

# 5. Sensor Readings & Time-Series Windowing
def test_sensor_readings_query(db_session):
    hive = models.Hive(id="HIVE_202", hive_code="HC-202")
    db_session.add(hive)
    db_session.commit()

    now = datetime.utcnow()
    readings = [
        models.SensorReading(hive_id="HIVE_202", timestamp=now - timedelta(hours=2), temperature_c=34.5, humidity_pct=55.0, weight_kg=25.0, sound_level_db=40.0),
        models.SensorReading(hive_id="HIVE_202", timestamp=now - timedelta(minutes=30), temperature_c=35.0, humidity_pct=54.0, weight_kg=25.2, sound_level_db=42.0),
        models.SensorReading(hive_id="HIVE_202", timestamp=now, temperature_c=35.2, humidity_pct=53.0, weight_kg=25.5, sound_level_db=41.0),
    ]
    db_session.add_all(readings)
    db_session.commit()

    # Query last 1 hour
    recent = db_session.query(models.SensorReading).filter(
        models.SensorReading.hive_id == "HIVE_202",
        models.SensorReading.timestamp >= now - timedelta(hours=1)
    ).all()
    assert len(recent) == 2

# 6. Harvest Event & Batch Source Mapping
def test_harvest_and_batch_sources(db_session):
    hive = models.Hive(id="HIVE_303", hive_code="HC-303")
    db_session.add(hive)
    db_session.commit()

    harvest = models.Harvest(
        id="HV_303_1",
        hive_id="HIVE_303",
        weight_kg=15.5,
        timestamp=datetime.utcnow()
    )
    db_session.add(harvest)

    batch = models.Batch(
        id="BATCH_303",
        batch_code="CODE_B303",
        status="CREATED"
    )
    db_session.add(batch)
    db_session.commit()

    bs = models.BatchSource(batch_id="BATCH_303", harvest_id="HV_303_1")
    db_session.add(bs)
    db_session.commit()

    genealogy_harvests = GenealogyEngine.get_batch_harvests(db_session, "BATCH_303")
    assert len(genealogy_harvests) == 1
    assert genealogy_harvests[0].id == "HV_303_1"

# 7. Batch Transformations (Merge & Split)
def test_batch_transformations(db_session):
    b1 = models.Batch(id="BATCH_A", batch_code="CODE_A", status="CREATED")
    b2 = models.Batch(id="BATCH_B", batch_code="CODE_B", status="CREATED")
    child = models.Batch(id="BATCH_C", batch_code="CODE_C", status="PROCESSING", is_merged=True)
    db_session.add_all([b1, b2, child])
    db_session.commit()

    t1 = models.BatchTransformation(id="BT_1", parent_batch_id="BATCH_A", child_batch_id="BATCH_C", type="MERGE")
    t2 = models.BatchTransformation(id="BT_2", parent_batch_id="BATCH_B", child_batch_id="BATCH_C", type="MERGE")
    db_session.add_all([t1, t2])
    db_session.commit()

    parents = GenealogyEngine.get_parent_batches(db_session, "BATCH_C")
    assert len(parents) == 2
    parent_ids = {p.id for p in parents}
    assert parent_ids == {"BATCH_A", "BATCH_B"}

# 8. Lab Test Attachment
def test_lab_test_attachment(db_session):
    batch = models.Batch(id="BATCH_LAB", batch_code="CODE_LAB", status="CREATED")
    db_session.add(batch)
    db_session.commit()

    test = models.LabTest(
        id="LT_999",
        batch_id="BATCH_LAB",
        test_type="Moisture & HMF Purity",
        result='{"moisture_pct": 16.5, "hmf_mg_kg": 12.0, "status": "PASSED"}',
        lab_name="Eurofins Agroscience"
    )
    db_session.add(test)
    db_session.commit()

    saved_test = db_session.query(models.LabTest).filter(models.LabTest.batch_id == "BATCH_LAB").first()
    assert saved_test.lab_name == "Eurofins Agroscience"

# 9. Product & QR Verification
def test_product_and_qr(db_session):
    batch = models.Batch(id="BATCH_PROD", batch_code="CODE_PROD", status="PACKAGED")
    db_session.add(batch)
    db_session.commit()

    prod = models.Product(
        id="PROD_888",
        batch_id="BATCH_PROD",
        product_code="HC-PROD-888",
        name="Wildflower Honey 500g",
        bottle_date=datetime.utcnow(),
        qr_code="https://honeychain.org/verify/PROD_888"
    )
    db_session.add(prod)
    db_session.commit()

    res = GenealogyEngine.get_product_genealogy(db_session, "PROD_888")
    assert res["success"] is True
    assert res["product"]["product_code"] == "HC-PROD-888"
    assert res["batch"]["id"] == "BATCH_PROD"

# 10. Complete E2E Supply Chain Provenance Integration Test
def test_full_supply_chain_genealogy(db_session):
    # 1. User & Beekeeper
    user = models.User(username="master_bk", hashed_password="pwd", role="beekeeper")
    db_session.add(user)
    db_session.commit()

    bk = models.Beekeeper(id="BK_MASTER", user_id=user.id, license_no="LIC-MASTER-01")
    db_session.add(bk)

    # 2. Apiary & Hive
    apiary = models.Apiary(id="APIARY_EAST", beekeeper_id=bk.id, name="East Valley Meadow", lat=40.7128, lng=-74.0060)
    db_session.add(apiary)

    hive = models.Hive(id="HIVE_E1", apiary_id=apiary.id, owner_id=user.id, hive_code="HC-E1")
    db_session.add(hive)
    db_session.commit()

    # 3. Sensor Reading
    sensor = models.SensorReading(hive_id=hive.id, temperature_c=35.1, humidity_pct=52.0, weight_kg=30.0)
    db_session.add(sensor)

    # 4. Harvest Event
    harvest = models.Harvest(id="HV_E1_2026", hive_id=hive.id, beekeeper_id=bk.id, weight_kg=20.0, tx_hash="0x_harvest_e1")
    db_session.add(harvest)
    db_session.commit()

    # 5. Batch & Batch Source
    batch = models.Batch(id="BATCH_RAW_1", batch_code="CODE_RAW_1", status="TESTED")
    db_session.add(batch)
    db_session.commit()

    bs = models.BatchSource(batch_id=batch.id, harvest_id=harvest.id)
    db_session.add(bs)

    # 6. Lab Test
    lab = models.LabTest(id="LT_E1", batch_id=batch.id, test_type="Purity", result="GRADE_A", lab_name="Intertek")
    db_session.add(lab)

    # 7. Product & QR
    prod = models.Product(id="PROD_JAR_1", batch_id=batch.id, product_code="HC-JAR-1", name="Organic Meadow Honey 250g")
    db_session.add(prod)

    # 8. Blockchain Transaction Index
    tx = models.BlockchainTransaction(related_table="products", related_id=prod.id, tx_hash="0x_chain_verified_jar1", action_type="PRODUCT_CREATED")
    db_session.add(tx)
    db_session.commit()

    # Verify complete chain recovery
    genealogy = GenealogyEngine.get_product_genealogy(db_session, "PROD_JAR_1")
    assert genealogy["success"] is True
    assert genealogy["product"]["product_code"] == "HC-JAR-1"
    assert genealogy["batch"]["id"] == "BATCH_RAW_1"
    assert len(genealogy["harvests"]) == 1
    assert genealogy["harvests"][0]["id"] == "HV_E1_2026"
    assert len(genealogy["hives"]) == 1
    assert genealogy["hives"][0]["id"] == "HIVE_E1"
    assert len(genealogy["apiaries"]) == 1
    assert genealogy["apiaries"][0]["name"] == "East Valley Meadow"
    assert len(genealogy["beekeepers"]) == 1
    assert genealogy["beekeepers"][0]["license_no"] == "LIC-MASTER-01"
    assert len(genealogy["lab_tests"]) == 1
    assert genealogy["lab_tests"][0]["lab_name"] == "Intertek"
    assert len(genealogy["blockchain_records"]) == 1
    assert genealogy["blockchain_records"][0]["tx_hash"] == "0x_chain_verified_jar1"
