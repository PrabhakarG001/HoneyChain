from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str
    role: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class HiveCreate(BaseModel):
    id: str
    name: str
    location: str

class HarvestCreate(BaseModel):
    hive_id: str
    weight_kg: float
    timestamp: datetime

class BatchMerge(BaseModel):
    parent_harvest_ids: List[str]
    document_hash: str

class MQTTPayload(BaseModel):
    hive_id: str
    timestamp: datetime
    temperature_c: float
    humidity_pct: float
    weight_kg: float
    sound_level_db: float

class MLAnalysisResponse(BaseModel):
    hive_id: str
    timestamp: datetime
    risk_score: Optional[float]
    status: str
    highest_contributor: str
    model_version: str

    class Config:
        from_attributes = True

class VerificationResponse(BaseModel):
    id: str
    batch_id: str
    tx_hash: str
    created_at: datetime
    status: str

    class Config:
        from_attributes = True

class BatchResponse(BaseModel):
    id: str
    created_at: datetime
    is_merged: bool
    document_hash: Optional[str] = None
    status: str
    verification_id: Optional[str] = None
    tx_hash: Optional[str] = None

    class Config:
        from_attributes = True
