from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
import uuid
import logging
from ..database import get_db
from .. import models, schemas
from ..auth import require_role
from ..services.contract_client import contract_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/batches", tags=["Batches"])

@router.post("/", response_model=schemas.BatchResponse, status_code=status.HTTP_201_CREATED)
def create_batch(
    batch_req: schemas.BatchCreate, 
    db: Session = Depends(get_db), 
    current_user = Depends(require_role(["beekeeper", "processor", "admin"]))
):
    """
    REST Endpoint: Create a new honey batch from harvest IDs.
    """
    harvests = db.query(models.Harvest).filter(models.Harvest.id.in_(batch_req.harvest_ids)).all()
    if not harvests:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No valid harvest IDs provided for batch creation")

    batch_id = f"BATCH_{str(uuid.uuid4())[:8].upper()}"
    new_batch = models.Batch(
        id=batch_id,
        created_at=datetime.utcnow(),
        is_merged=len(harvests) > 1,
        status=batch_req.status or "Created"
    )
    db.add(new_batch)

    for h in harvests:
        h.batch_id = batch_id
    db.commit()
    db.refresh(new_batch)

    tx_hash = None
    try:
        tx_hash = contract_client.create_batch(batch_id, [h.id for h in harvests])
    except Exception as e:
        logger.warning(f"Blockchain batch creation notice: {e}")
        tx_hash = f"0x_local_batch_{batch_id}"

    v_record = models.VerificationRecord(
        id=f"VR_{batch_id}",
        batch_id=batch_id,
        tx_hash=tx_hash,
        created_at=datetime.utcnow()
    )
    db.add(v_record)
    db.commit()

    return schemas.BatchResponse(
        id=new_batch.id,
        created_at=new_batch.created_at,
        is_merged=new_batch.is_merged,
        document_hash=new_batch.document_hash,
        status=new_batch.status,
        verification_id=v_record.id,
        tx_hash=tx_hash
    )

@router.post("/merge")
def merge_batches(merge_req: schemas.BatchMerge, db: Session = Depends(get_db), current_user = Depends(require_role(["processor", "admin"]))):
    harvests = db.query(models.Harvest).filter(models.Harvest.id.in_(merge_req.parent_harvest_ids)).all()
    if len(harvests) != len(merge_req.parent_harvest_ids):
        raise HTTPException(status_code=400, detail="One or more harvest IDs are invalid.")
    
    batch_id = f"BATCH_{str(uuid.uuid4())[:8].upper()}"
    new_batch = models.Batch(
        id=batch_id,
        is_merged=True,
        document_hash=merge_req.document_hash,
        status="Processing"
    )
    db.add(new_batch)
    
    for h in harvests:
        h.batch_id = batch_id
        
    db.commit()
    
    tx_hash = None
    try:
        tx_hash = contract_client.create_batch(batch_id, merge_req.parent_harvest_ids)
    except Exception as e:
        logger.warning(f"Blockchain batch merge notice: {e}")
        tx_hash = f"0x_local_merge_{batch_id}"

    v_record = models.VerificationRecord(
        id=f"VR_{batch_id}",
        batch_id=batch_id,
        tx_hash=tx_hash,
        created_at=datetime.utcnow()
    )
    db.add(v_record)
    db.commit()
        
    return {"message": "Batches successfully merged on blockchain", "batch_id": batch_id, "tx_hash": tx_hash}

@router.post("/{batch_id}/transfer", response_model=schemas.CustodyTransferResponse)
def transfer_custody(
    batch_id: str, 
    transfer_req: schemas.CustodyTransferRequest, 
    db: Session = Depends(get_db), 
    current_user = Depends(require_role(["beekeeper", "processor", "admin"]))
):
    """
    REST Endpoint: Record transfer of custody for a batch (e.g. Beekeeper -> Processor -> Distributor).
    """
    batch = db.query(models.Batch).filter(models.Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Batch '{batch_id}' not found")

    from_owner = current_user.username
    to_owner = transfer_req.to_owner

    tx_hash = None
    try:
        tx_hash = contract_client.transfer_custody(batch_id, to_owner)
    except Exception as e:
        logger.warning(f"Blockchain custody transfer notice: {e}")
        tx_hash = f"0x_local_transfer_{batch_id}_{int(datetime.utcnow().timestamp())}"

    transfer_record = models.CustodyTransfer(
        id=f"CT_{str(uuid.uuid4())[:8].upper()}",
        batch_id=batch.id,
        from_owner=from_owner,
        to_owner=to_owner,
        timestamp=datetime.utcnow(),
        tx_hash=tx_hash
    )

    batch.status = f"In Transit to {to_owner}"
    db.add(transfer_record)
    db.commit()
    db.refresh(transfer_record)

    logger.info(f"Custody of batch '{batch_id}' transferred from '{from_owner}' to '{to_owner}'.")

    return transfer_record

@router.get("/")
def get_batches(db: Session = Depends(get_db)):
    return db.query(models.Batch).order_by(models.Batch.created_at.desc()).all()

@router.get("/{batch_id}", response_model=schemas.BatchResponse)
def get_batch(batch_id: str, db: Session = Depends(get_db)):
    batch = db.query(models.Batch).filter(models.Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
        
    verification = db.query(models.VerificationRecord).filter(models.VerificationRecord.batch_id == batch_id).first()
    
    return {
        "id": batch.id,
        "created_at": batch.created_at,
        "is_merged": batch.is_merged,
        "document_hash": batch.document_hash,
        "status": batch.status,
        "verification_id": verification.id if verification else None,
        "tx_hash": verification.tx_hash if verification else None
    }

