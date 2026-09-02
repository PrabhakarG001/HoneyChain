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
