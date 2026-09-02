from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String) # beekeeper, processor, admin, consumer

class Hive(Base):
    __tablename__ = "hives"
    id = Column(String, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    location = Column(String)
    
    harvests = relationship("Harvest", back_populates="hive")
    readings = relationship("SensorReading", back_populates="hive")

class Harvest(Base):
    __tablename__ = "harvests"
    id = Column(String, primary_key=True, index=True)
    hive_id = Column(String, ForeignKey("hives.id"))
    weight_kg = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
    tx_hash = Column(String, nullable=True)
    
    hive = relationship("Hive", back_populates="harvests")
    batch_id = Column(String, ForeignKey("batches.id"), nullable=True)

class Batch(Base):
    __tablename__ = "batches"
    id = Column(String, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_merged = Column(Boolean, default=False)
    document_hash = Column(String, nullable=True)
    status = Column(String) # Created, Processing, Bottled

    harvests = relationship("Harvest")

class SensorReading(Base):
    __tablename__ = "sensor_readings"
    id = Column(Integer, primary_key=True, index=True)
    hive_id = Column(String, ForeignKey("hives.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    temperature_c = Column(Float)
    humidity_pct = Column(Float)
    weight_kg = Column(Float)
    sound_level_db = Column(Float)
    
    hive = relationship("Hive", back_populates="readings")

class BlockchainTransaction(Base):
    __tablename__ = "blockchain_transactions"
    id = Column(Integer, primary_key=True, index=True)
    tx_hash = Column(String, unique=True, index=True)
    action_type = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

