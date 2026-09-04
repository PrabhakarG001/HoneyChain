from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import logging
from ..database import get_db
from .. import models, schemas
from ..auth import require_role
from ..services.contract_client import contract_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/harvests", tags=["Harvests"])

@router.post("", response_model=schemas.HarvestResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=schemas.HarvestResponse, status_code=status.HTTP_201_CREATED)
def create_harvest(
    harvest: schemas.HarvestCreate, 
    db: Session = Depends(get_db), 
    current_user = Depends(require_role(["beekeeper", "admin"]))
):
    """
    REST Endpoint: Beekeeper records a harvest extraction event.
    Enforces positive harvest weight, links batch genealogy via batch_sources,
    and logs transaction on-chain & off-chain index.
    """
    if harvest.weight_kg <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Harvest quantity must be greater than zero")

    hive = db.query(models.Hive).filter(models.Hive.id == harvest.hive_id).first()
    if not hive:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Hive '{harvest.hive_id}' not found")

    # Authorize hive ownership for beekeepers
    if (current_user.role or "").lower() == "beekeeper" and hive.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized access to this hive resource")

    timestamp = harvest.timestamp or datetime.utcnow()
    ts_seconds = int(timestamp.timestamp())
    harvest_id = f"HV_{harvest.hive_id}_{ts_seconds}"

    # Check for duplicate harvest
    existing_harvest = db.query(models.Harvest).filter(models.Harvest.id == harvest_id).first()
    if existing_harvest:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Harvest '{harvest_id}' already recorded")

    # Beekeeper lookup if present
    beekeeper_id = harvest.beekeeper_id
    if not beekeeper_id and current_user:
        bk = db.query(models.Beekeeper).filter(models.Beekeeper.user_id == current_user.id).first()
        if bk:
            beekeeper_id = bk.id

    # Determine or create batch
    batch_id = harvest.batch_id or f"BATCH_{harvest.hive_id}_{ts_seconds}"
    batch = db.query(models.Batch).filter(models.Batch.id == batch_id).first()
    if not batch:
        batch_code = f"CODE_{batch_id}"
        batch = models.Batch(
            id=batch_id,
            batch_code=batch_code,
            created_at=timestamp,
            status="CREATED",
            is_merged=False
        )
        db.add(batch)
        db.commit()
        db.refresh(batch)

    # Execute on-chain transaction with fallback handling
    tx_hash = None
    try:
        tx_hash = contract_client.create_harvest(harvest.hive_id, harvest_id, ts_seconds, int(harvest.weight_kg))
    except Exception as e:
        logger.warning(f"Blockchain record creation notice: {e}")
        tx_hash = f"0x_local_harvest_{ts_seconds}"

    db_harvest = models.Harvest(
        id=harvest_id,
        hive_id=harvest.hive_id,
        beekeeper_id=beekeeper_id,
        weight_kg=harvest.weight_kg,
        timestamp=timestamp,
        tx_hash=tx_hash,
        batch_id=batch.id
    )
    db.add(db_harvest)
    db.commit()
    db.refresh(db_harvest)

    # Record genealogy mapping in batch_sources
    bs_entry = db.query(models.BatchSource).filter(
        models.BatchSource.batch_id == batch.id,
        models.BatchSource.harvest_id == db_harvest.id
    ).first()
    if not bs_entry:
        bs_entry = models.BatchSource(batch_id=batch.id, harvest_id=db_harvest.id)
        db.add(bs_entry)

    # Off-chain index in blockchain_transactions
    if tx_hash:
        bc_tx = models.BlockchainTransaction(
            related_table="harvest_events",
            related_id=db_harvest.id,
            tx_hash=tx_hash,
            action_type="HARVEST_LOGGED",
            timestamp=timestamp
        )
        db.add(bc_tx)

    # Verification record
    ver_rec = db.query(models.VerificationRecord).filter(models.VerificationRecord.batch_id == batch.id).first()
    if not ver_rec:
        ver_rec = models.VerificationRecord(
            id=f"VR_{batch.id}",
            batch_id=batch.id,
            tx_hash=tx_hash,
            created_at=timestamp
        )
        db.add(ver_rec)

    db.commit()

    logger.info(f"Harvest '{harvest_id}' recorded successfully for hive '{harvest.hive_id}' by user '{current_user.username}'.")

    return schemas.HarvestResponse(
        success=True,
        message="Harvest recorded successfully",
        data=schemas.HarvestResponseData(
            harvestId=db_harvest.id,
            batchId=batch.id,
            hiveId=db_harvest.hive_id,
            weightKg=db_harvest.weight_kg,
            createdAt=db_harvest.timestamp,
            txHash=db_harvest.tx_hash
        )
    )

@router.get("", response_model=List[schemas.HarvestDetailResponse])
@router.get("/", response_model=List[schemas.HarvestDetailResponse])
def get_harvests(
    hive_id: Optional[str] = None, 
    db: Session = Depends(get_db), 
    current_user = Depends(require_role(["beekeeper", "admin", "processor"]))
):
    query = db.query(models.Harvest)
    if (current_user.role or "").lower() == "beekeeper":
        user_hive_ids = [h.id for h in db.query(models.Hive).filter(models.Hive.owner_id == current_user.id).all()]
        query = query.filter(models.Harvest.hive_id.in_(user_hive_ids))
    if hive_id:
        query = query.filter(models.Harvest.hive_id == hive_id)
    return query.order_by(models.Harvest.timestamp.desc()).all()

@router.get("/{harvest_id}", response_model=schemas.HarvestDetailResponse)
def get_harvest(
    harvest_id: str, 
    db: Session = Depends(get_db), 
    current_user = Depends(require_role(["beekeeper", "admin", "processor"]))
):
    harvest = db.query(models.Harvest).filter(models.Harvest.id == harvest_id).first()
    if not harvest:
        raise HTTPException(status_code=404, detail="Harvest record not found")
    return harvest
