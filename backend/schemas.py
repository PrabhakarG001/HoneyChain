from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
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
    farm_id: Optional[str] = None

class HarvestCreate(BaseModel):
    hive_id: str
    weight_kg: float = Field(..., gt=0, description="Harvest weight in kilograms")
    timestamp: Optional[datetime] = None
    batch_id: Optional[str] = None

class HarvestResponseData(BaseModel):
    harvestId: str
    batchId: str
    hiveId: str
    weightKg: float
    createdAt: datetime
    txHash: Optional[str] = None

class HarvestResponse(BaseModel):
    success: bool = True
    message: str = "Harvest recorded successfully"
    data: HarvestResponseData

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

class SensorReadingResponse(BaseModel):
    id: int
    hive_id: str
    timestamp: datetime
    temperature_c: float
    humidity_pct: float
    weight_kg: float
    sound_level_db: float

    class Config:
        from_attributes = True

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
    success: bool = True
    id: str
    batch_id: str
    tx_hash: str
    created_at: datetime
    status: str = "Verified"
    details: Optional[Dict[str, Any]] = None

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

