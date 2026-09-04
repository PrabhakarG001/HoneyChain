from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Index, UniqueConstraint, CheckConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False, default="beekeeper") # beekeeper, processor, admin, consumer
    avatar_url = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    farms = relationship("Farm", back_populates="owner")
    hives = relationship("Hive", back_populates="owner")
    beekeepers = relationship("Beekeeper", back_populates="user", cascade="all, delete-orphan")

    @property
    def password_hash(self):
        return self.hashed_password

    @password_hash.setter
    def password_hash(self, value):
        self.hashed_password = value

class Beekeeper(Base):
    __tablename__ = "beekeepers"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True, nullable=False)
    license_no = Column(String, unique=True, index=True, nullable=False)
    location = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="beekeepers")
    apiaries = relationship("Apiary", back_populates="beekeeper", cascade="all, delete-orphan")
    harvest_events = relationship("Harvest", back_populates="beekeeper")

class Apiary(Base):
    __tablename__ = "apiaries"
    id = Column(String, primary_key=True, index=True)
    beekeeper_id = Column(String, ForeignKey("beekeepers.id", ondelete="CASCADE"), index=True, nullable=True)
    name = Column(String, nullable=False)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    beekeeper = relationship("Beekeeper", back_populates="apiaries")
    hives = relationship("Hive", back_populates="apiary")

    __table_args__ = (
        CheckConstraint('lat IS NULL OR (lat >= -90.0 AND lat <= 90.0)', name='check_lat_range'),
        CheckConstraint('lng IS NULL OR (lng >= -180.0 AND lng <= 180.0)', name='check_lng_range'),
    )

class Farm(Base):
    __tablename__ = "farms"
    id = Column(String, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    location = Column(String)
    area = Column(Float)
    number_of_hives = Column(Integer)
    bee_species = Column(String)
    floral_source = Column(String)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owner = relationship("User", back_populates="farms")
    hives = relationship("Hive", back_populates="farm")

class Hive(Base):
    __tablename__ = "hives"
    id = Column(String, primary_key=True, index=True)
    apiary_id = Column(String, ForeignKey("apiaries.id", ondelete="SET NULL"), index=True, nullable=True)
    farm_id = Column(String, ForeignKey("farms.id", ondelete="SET NULL"), index=True, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), index=True, nullable=True)
    name = Column(String, nullable=True)
    hive_code = Column(String, unique=True, index=True, nullable=True)
    location = Column(String, nullable=True)
    install_date = Column(DateTime, default=datetime.utcnow, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    apiary = relationship("Apiary", back_populates="hives")
    farm = relationship("Farm", back_populates="hives")
    owner = relationship("User", back_populates="hives")
    harvests = relationship("Harvest", back_populates="hive")
    readings = relationship("SensorReading", back_populates="hive")

class SensorReading(Base):
    __tablename__ = "sensor_readings"
    id = Column(Integer, primary_key=True, index=True)
    hive_id = Column(String, ForeignKey("hives.id", ondelete="CASCADE"), index=True, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True, nullable=False)
    temperature_c = Column(Float, nullable=True)
    humidity_pct = Column(Float, nullable=True)
    weight_kg = Column(Float, nullable=True)
    sound_level_db = Column(Float, nullable=True)
    battery_pct = Column(Float, nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    
    hive = relationship("Hive", back_populates="readings")

    __table_args__ = (
        Index("idx_sensor_readings_hive_time", "hive_id", "timestamp"),
    )

    @property
    def temp(self):
        return self.temperature_c

    @temp.setter
    def temp(self, value):
        self.temperature_c = value

    @property
    def humidity(self):
        return self.humidity_pct

    @humidity.setter
    def humidity(self, value):
        self.humidity_pct = value

    @property
    def weight(self):
        return self.weight_kg

    @weight.setter
    def weight(self, value):
        self.weight_kg = value

    @property
    def sound(self):
        return self.sound_level_db

    @sound.setter
    def sound(self, value):
        self.sound_level_db = value

class Harvest(Base):
    __tablename__ = "harvest_events"
    id = Column(String, primary_key=True, index=True)
    hive_id = Column(String, ForeignKey("hives.id", ondelete="CASCADE"), index=True, nullable=False)
    beekeeper_id = Column(String, ForeignKey("beekeepers.id", ondelete="SET NULL"), index=True, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True, nullable=False)
    weight_kg = Column(Float, nullable=False)
    tx_hash = Column(String, nullable=True, index=True)
    batch_id = Column(String, ForeignKey("honey_batches.id", ondelete="SET NULL"), nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    hive = relationship("Hive", back_populates="harvests")
    beekeeper = relationship("Beekeeper", back_populates="harvest_events")
    batch = relationship("Batch", back_populates="harvests")
    batch_sources = relationship("BatchSource", back_populates="harvest", cascade="all, delete-orphan")

    __table_args__ = (
        CheckConstraint('weight_kg > 0', name='check_harvest_quantity_positive'),
    )

    @property
    def date(self):
        return self.timestamp

    @date.setter
    def date(self, value):
        self.timestamp = value

    @property
    def quantity_kg(self):
        return self.weight_kg

    @quantity_kg.setter
    def quantity_kg(self, value):
        self.weight_kg = value

class Batch(Base):
    __tablename__ = "honey_batches"
    id = Column(String, primary_key=True, index=True)
    batch_code = Column(String, unique=True, index=True, nullable=True)
    status = Column(String, index=True, nullable=False, default="CREATED") # CREATED, PROCESSING, TESTED, APPROVED, PACKAGED, RELEASED, RECALLED
    is_merged = Column(Boolean, default=False)
    document_hash = Column(String, nullable=True)
    tx_hash = Column(String, nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    harvests = relationship("Harvest", back_populates="batch")
    batch_sources = relationship("BatchSource", back_populates="batch", cascade="all, delete-orphan")
    lab_tests = relationship("LabTest", back_populates="batch", cascade="all, delete-orphan")
    products = relationship("Product", back_populates="batch", cascade="all, delete-orphan")

class BatchSource(Base):
    __tablename__ = "batch_sources"
    batch_id = Column(String, ForeignKey("honey_batches.id", ondelete="CASCADE"), primary_key=True, index=True)
    harvest_id = Column(String, ForeignKey("harvest_events.id", ondelete="CASCADE"), primary_key=True, index=True)

    batch = relationship("Batch", back_populates="batch_sources")
    harvest = relationship("Harvest", back_populates="batch_sources")

    __table_args__ = (
        UniqueConstraint('batch_id', 'harvest_id', name='uq_batch_harvest_source'),
    )

class BatchTransformation(Base):
    __tablename__ = "batch_transformations"
    id = Column(String, primary_key=True, index=True)
    parent_batch_id = Column(String, ForeignKey("honey_batches.id", ondelete="CASCADE"), index=True, nullable=False)
    child_batch_id = Column(String, ForeignKey("honey_batches.id", ondelete="CASCADE"), index=True, nullable=False)
    type = Column(String, nullable=False, index=True) # MERGE, SPLIT
    created_at = Column(DateTime, default=datetime.utcnow, index=True, nullable=False)

    parent_batch = relationship("Batch", foreign_keys=[parent_batch_id])
    child_batch = relationship("Batch", foreign_keys=[child_batch_id])

    __table_args__ = (
        CheckConstraint('parent_batch_id != child_batch_id', name='check_no_self_referential_transformation'),
    )

class LabTest(Base):
    __tablename__ = "lab_tests"
    id = Column(String, primary_key=True, index=True)
    batch_id = Column(String, ForeignKey("honey_batches.id", ondelete="CASCADE"), index=True, nullable=False)
    test_type = Column(String, nullable=False)
    result = Column(String, nullable=False)
    lab_name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True, nullable=False)

    batch = relationship("Batch", back_populates="lab_tests")

class Product(Base):
    __tablename__ = "products"
    id = Column(String, primary_key=True, index=True)
    batch_id = Column(String, ForeignKey("honey_batches.id", ondelete="CASCADE"), index=True, nullable=False)
    product_code = Column(String, unique=True, index=True, nullable=True)
    name = Column(String, nullable=False)
    bottle_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    qr_code = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True, nullable=False)

    batch = relationship("Batch", back_populates="products")

class BlockchainTransaction(Base):
    __tablename__ = "blockchain_transactions"
    id = Column(Integer, primary_key=True, index=True)
    related_table = Column(String, index=True, nullable=False) # e.g. harvest_events, honey_batches, products
    related_id = Column(String, index=True, nullable=False)
    tx_hash = Column(String, unique=True, index=True, nullable=False)
    action_type = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class MLAnalysis(Base):
    __tablename__ = "ml_analyses"
    id = Column(Integer, primary_key=True, index=True)
    hive_id = Column(String, ForeignKey("hives.id", ondelete="CASCADE"), index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    risk_score = Column(Float, nullable=True)
    status = Column(String)
    highest_contributor = Column(String)
    model_version = Column(String)

    hive = relationship("Hive")

class VerificationRecord(Base):
    __tablename__ = "verification_records"
    id = Column(String, primary_key=True, index=True)
    batch_id = Column(String, ForeignKey("honey_batches.id", ondelete="CASCADE"), index=True)
    tx_hash = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    batch = relationship("Batch")

class CustodyTransfer(Base):
    __tablename__ = "custody_transfers"
    id = Column(String, primary_key=True, index=True)
    batch_id = Column(String, ForeignKey("honey_batches.id", ondelete="CASCADE"), index=True)
    from_owner = Column(String, index=True)
    to_owner = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    tx_hash = Column(String, nullable=True)

    batch = relationship("Batch")
