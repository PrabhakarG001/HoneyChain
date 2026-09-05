from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Any, Dict
from datetime import datetime

# ==================== User Schemas ====================
class UserBase(BaseModel):
    username: str
    role: str
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None

class UserResponse(UserBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class GoogleAuthRequest(BaseModel):
    email: str
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    photo_url: Optional[str] = None
    role: Optional[str] = "CUSTOMER"
    google_id: Optional[str] = None

# ==================== Beekeeper Schemas ====================
class BeekeeperCreate(BaseModel):
    license_no: str
    location: Optional[str] = None

class BeekeeperResponse(BaseModel):
    id: str
    user_id: int
    license_no: str
    location: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

# ==================== Apiary Schemas ====================
class ApiaryCreate(BaseModel):
    id: Optional[str] = None
    name: str
    beekeeper_id: Optional[str] = None
    lat: Optional[float] = Field(None, ge=-90.0, le=90.0)
    lng: Optional[float] = Field(None, ge=-180.0, le=180.0)

class ApiaryResponse(BaseModel):
    id: str
    beekeeper_id: Optional[str] = None
    name: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

# ==================== Hive Schemas ====================
class HiveCreate(BaseModel):
    id: str
    name: Optional[str] = None
    hive_code: Optional[str] = None
    location: Optional[str] = None
    apiary_id: Optional[str] = None
    farm_id: Optional[str] = None
    install_date: Optional[datetime] = None

class HiveResponse(BaseModel):
    id: str
    name: Optional[str] = None
    hive_code: Optional[str] = None
    location: Optional[str] = None
    apiary_id: Optional[str] = None
    farm_id: Optional[str] = None
    owner_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

# ==================== Harvest Schemas ====================
class HarvestCreate(BaseModel):
    hive_id: str
    weight_kg: float = Field(..., gt=0, description="Harvest weight in kilograms (must be positive)")
    timestamp: Optional[datetime] = None
    batch_id: Optional[str] = None
    beekeeper_id: Optional[str] = None

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

class HarvestDetailResponse(BaseModel):
    id: str
    hive_id: str
    beekeeper_id: Optional[str] = None
    timestamp: datetime
    weight_kg: float
    tx_hash: Optional[str] = None
    batch_id: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# ==================== Batch Schemas ====================
class BatchCreate(BaseModel):
    harvest_ids: List[str]
    status: Optional[str] = "CREATED"
    batch_code: Optional[str] = None

class BatchMerge(BaseModel):
    parent_harvest_ids: List[str]
    document_hash: str

class BatchTransformationCreate(BaseModel):
    parent_batch_ids: List[str]
    type: str # MERGE or SPLIT
    child_batch_codes: Optional[List[str]] = None

class BatchTransformationResponse(BaseModel):
    id: str
    parent_batch_id: str
    child_batch_id: str
    type: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class BatchResponse(BaseModel):
    id: str
    batch_code: Optional[str] = None
    created_at: datetime
    is_merged: bool
    document_hash: Optional[str] = None
    status: str
    verification_id: Optional[str] = None
    tx_hash: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class BatchSourceResponse(BaseModel):
    batch_id: str
    harvest_id: str
    model_config = ConfigDict(from_attributes=True)

# ==================== Lab Test Schemas ====================
class LabTestCreate(BaseModel):
    batch_id: str
    test_type: str
    result: str
    lab_name: str

class LabTestResponse(BaseModel):
    id: str
    batch_id: str
    test_type: str
    result: str
    lab_name: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# ==================== Product & Custody Schemas ====================
class ProductCreate(BaseModel):
    batch_id: str
    name: str
    product_code: Optional[str] = None
    bottle_date: Optional[datetime] = None

class ProductResponse(BaseModel):
    id: str
    batch_id: str
    product_code: Optional[str] = None
    name: str
    bottle_date: Optional[datetime] = None
    qr_code: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class CustodyTransferRequest(BaseModel):
    to_owner: str

class CustodyTransferResponse(BaseModel):
    id: str
    batch_id: str
    from_owner: str
    to_owner: str
    timestamp: datetime
    tx_hash: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

# ==================== Sensor & ML Schemas ====================
class MQTTPayload(BaseModel):
    hive_id: str
    timestamp: datetime
    temperature_c: float
    humidity_pct: float
    weight_kg: float
    sound_level_db: float
    battery_pct: Optional[float] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    is_simulated: Optional[bool] = False

class SensorReadingResponse(BaseModel):
    id: int
    hive_id: str
    timestamp: datetime
    temperature_c: Optional[float] = None
    humidity_pct: Optional[float] = None
    weight_kg: Optional[float] = None
    sound_level_db: Optional[float] = None
    battery_pct: Optional[float] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    model_config = ConfigDict(from_attributes=True)

class MLAnalysisResponse(BaseModel):
    hive_id: str
    timestamp: datetime
    risk_score: Optional[float]
    status: str
    highest_contributor: str
    model_version: str
    model_config = ConfigDict(from_attributes=True)

# ==================== Blockchain Transaction Schemas ====================
class BlockchainTransactionResponse(BaseModel):
    id: int
    related_table: str
    related_id: str
    tx_hash: str
    action_type: Optional[str] = None
    timestamp: datetime
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# ==================== Verification & Genealogy Schemas ====================
class VerificationResponse(BaseModel):
    success: bool = True
    id: str
    batch_id: str
    tx_hash: str
    created_at: datetime
    status: str = "Verified"
    details: Optional[Dict[str, Any]] = None
    model_config = ConfigDict(from_attributes=True)

class GenealogyNode(BaseModel):
    type: str # Product, Batch, Harvest, Hive, Apiary, Beekeeper
    id: str
    details: Dict[str, Any]

class GenealogyResponse(BaseModel):
    success: bool = True
    product: Optional[Dict[str, Any]] = None
    batch: Optional[Dict[str, Any]] = None
    harvests: List[Dict[str, Any]] = []
    hives: List[Dict[str, Any]] = []
    apiaries: List[Dict[str, Any]] = []
    beekeepers: List[Dict[str, Any]] = []
    parent_batches: List[Dict[str, Any]] = []
    child_batches: List[Dict[str, Any]] = []
    lab_tests: List[Dict[str, Any]] = []
    blockchain_records: List[Dict[str, Any]] = []
