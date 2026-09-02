from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas
from ..auth import require_role
from ..services.contract_client import contract_client
import hashlib

router = APIRouter(prefix="/harvests", tags=["Harvests"])

@router.post("/")
def ingest_harvest(harvest: schemas.HarvestCreate, db: Session = Depends(get_db), current_user = Depends(require_role(["beekeeper", "admin"]))):
    # Execute real on-chain transaction
    harvest_id = f"HV_{harvest.hive_id}_{int(harvest.timestamp.timestamp())}"
    try:
        tx_hash = contract_client.create_harvest(harvest.hive_id, harvest_id, int(harvest.timestamp.timestamp()), int(harvest.weight_kg))
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Blockchain service unavailable: {e}")
    
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
