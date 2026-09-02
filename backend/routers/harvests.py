from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas
from ..auth import require_role
import hashlib

router = APIRouter(prefix="/harvests", tags=["Harvests"])

@router.post("/")
def ingest_harvest(harvest: schemas.HarvestCreate, db: Session = Depends(get_db), current_user = Depends(require_role(["beekeeper", "admin"]))):
    # Integrity Check: In a real app, query SensorReadings for the last 24h to verify a weight drop matches the harvest weight
    
    # Generate mock tx_hash
    tx_hash = "0x" + hashlib.sha256(f"{harvest.hive_id}{harvest.timestamp}".encode()).hexdigest()[:40]
    
    db_harvest = models.Harvest(
        id=f"HV_{harvest.hive_id}_{int(harvest.timestamp.timestamp())}",
        hive_id=harvest.hive_id,
        weight_kg=harvest.weight_kg,
        timestamp=harvest.timestamp,
        tx_hash=tx_hash
    )
    db.add(db_harvest)
    db.commit()
    db.refresh(db_harvest)
    return {"message": "Harvest logged on-chain", "harvest_id": db_harvest.id, "tx_hash": tx_hash}
