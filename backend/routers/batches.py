from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
import uuid
import logging
from ..database import get_db
from .. import models, schemas
from ..auth import require_role
from ..services.contract_client import contract_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/batches", tags=["Batches"])

@router.post("", response_model=schemas.BatchResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=schemas.BatchResponse, status_code=status.HTTP_201_CREATED)
def create_batch(
    batch_req: schemas.BatchCreate, 
    db: Session = Depends(get_db), 
    current_user = Depends(require_role(["beekeeper", "processor", "admin"]))
):
    """
    REST Endpoint: Create a new honey batch from harvest IDs.
    Populates batch_sources table for full many-to-many harvest genealogy.
    """
    harvests = db.query(models.Harvest).filter(models.Harvest.id.in_(batch_req.harvest_ids)).all()
    if not harvests:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No valid harvest IDs provided for batch creation")

    batch_id = f"BATCH_{str(uuid.uuid4())[:8].upper()}"
    batch_code = batch_req.batch_code or f"CODE_{batch_id}"

    new_batch = models.Batch(
        id=batch_id,
        batch_code=batch_code,
        created_at=datetime.utcnow(),
        is_merged=len(harvests) > 1,
        status=batch_req.status or "CREATED"
    )
    db.add(new_batch)
    db.commit()

    # Link harvests & record batch_sources
    for h in harvests:
        h.batch_id = batch_id
        bs = models.BatchSource(batch_id=batch_id, harvest_id=h.id)
        db.add(bs)
    db.commit()
    db.refresh(new_batch)

    tx_hash = None
    try:
        tx_hash = contract_client.create_batch(batch_id, [h.id for h in harvests])
    except Exception as e:
        logger.warning(f"Blockchain batch creation notice: {e}")
        tx_hash = f"0x_local_batch_{batch_id}"

    new_batch.tx_hash = tx_hash

    # Index blockchain transaction
    bc_tx = models.BlockchainTransaction(
        related_table="honey_batches",
        related_id=batch_id,
        tx_hash=tx_hash,
        action_type="BATCH_CREATED",
        timestamp=datetime.utcnow()
    )
    db.add(bc_tx)

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
        batch_code=new_batch.batch_code,
        created_at=new_batch.created_at,
        is_merged=new_batch.is_merged,
        document_hash=new_batch.document_hash,
        status=new_batch.status,
        verification_id=v_record.id,
        tx_hash=tx_hash
    )

@router.post("/merge")
def merge_batches(
    merge_req: schemas.BatchMerge, 
    db: Session = Depends(get_db), 
    current_user = Depends(require_role(["processor", "admin"]))
):
    """
    Merge multiple harvest/batches into a child batch.
    Records batch_transformations entry of type MERGE.
    """
    harvests = db.query(models.Harvest).filter(models.Harvest.id.in_(merge_req.parent_harvest_ids)).all()
    if len(harvests) != len(merge_req.parent_harvest_ids):
        raise HTTPException(status_code=400, detail="One or more parent harvest IDs are invalid.")

    batch_id = f"BATCH_{str(uuid.uuid4())[:8].upper()}"
    batch_code = f"CODE_MERGE_{batch_id}"
    new_batch = models.Batch(
        id=batch_id,
        batch_code=batch_code,
        is_merged=True,
        document_hash=merge_req.document_hash,
        status="PROCESSING"
    )
    db.add(new_batch)
    db.commit()

    # Get parent batches if existing
    parent_batch_ids = list(set([h.batch_id for h in harvests if h.batch_id]))
    for h in harvests:
        h.batch_id = batch_id
        bs = models.BatchSource(batch_id=batch_id, harvest_id=h.id)
        db.add(bs)

    # Record MERGE batch transformations
    for pb_id in parent_batch_ids:
        if pb_id != batch_id:
            bt = models.BatchTransformation(
                id=f"BT_{str(uuid.uuid4())[:8].upper()}",
                parent_batch_id=pb_id,
                child_batch_id=batch_id,
                type="MERGE"
            )
            db.add(bt)

    db.commit()

    tx_hash = None
    try:
        tx_hash = contract_client.create_batch(batch_id, merge_req.parent_harvest_ids)
    except Exception as e:
        logger.warning(f"Blockchain batch merge notice: {e}")
        tx_hash = f"0x_local_merge_{batch_id}"

    new_batch.tx_hash = tx_hash

    bc_tx = models.BlockchainTransaction(
        related_table="honey_batches",
        related_id=batch_id,
        tx_hash=tx_hash,
        action_type="BATCH_MERGED",
        timestamp=datetime.utcnow()
    )
    db.add(bc_tx)

    v_record = models.VerificationRecord(
        id=f"VR_{batch_id}",
        batch_id=batch_id,
        tx_hash=tx_hash,
        created_at=datetime.utcnow()
    )
    db.add(v_record)
    db.commit()

    return {"message": "Batches successfully merged", "batch_id": batch_id, "batch_code": batch_code, "tx_hash": tx_hash}

@router.post("/transform", response_model=List[schemas.BatchTransformationResponse], status_code=status.HTTP_201_CREATED)
def transform_batch(
    trans_req: schemas.BatchTransformationCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["processor", "admin"]))
):
    """
    Perform a batch transformation (MERGE or SPLIT).
    Records batch genealogy in batch_transformations table without destroying historical lineage.
    """
    if trans_req.type not in ("MERGE", "SPLIT"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Transformation type must be 'MERGE' or 'SPLIT'")

    parent_batches = db.query(models.Batch).filter(models.Batch.id.in_(trans_req.parent_batch_ids)).all()
    if not parent_batches:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No parent batches found")

    created_transformations = []

    if trans_req.type == "SPLIT":
        child_codes = trans_req.child_batch_codes or [f"SPLIT_{i+1}" for i in range(2)]
        parent = parent_batches[0]

        for code in child_codes:
            child_id = f"BATCH_SPLIT_{str(uuid.uuid4())[:8].upper()}"
            child_batch = models.Batch(
                id=child_id,
                batch_code=f"CODE_{child_id}",
                status="PROCESSING",
                is_merged=False
            )
            db.add(child_batch)
            db.commit()

            bt = models.BatchTransformation(
                id=f"BT_{str(uuid.uuid4())[:8].upper()}",
                parent_batch_id=parent.id,
                child_batch_id=child_id,
                type="SPLIT"
            )
            db.add(bt)
            created_transformations.append(bt)

    elif trans_req.type == "MERGE":
        child_id = f"BATCH_MERGE_{str(uuid.uuid4())[:8].upper()}"
        child_batch = models.Batch(
            id=child_id,
            batch_code=f"CODE_{child_id}",
            status="PROCESSING",
            is_merged=True
        )
        db.add(child_batch)
        db.commit()

        for parent in parent_batches:
            bt = models.BatchTransformation(
                id=f"BT_{str(uuid.uuid4())[:8].upper()}",
                parent_batch_id=parent.id,
                child_batch_id=child_id,
                type="MERGE"
            )
            db.add(bt)
            created_transformations.append(bt)

    db.commit()
    for bt in created_transformations:
        db.refresh(bt)

    return created_transformations

@router.post("/{batch_id}/transfer", response_model=schemas.CustodyTransferResponse)
def transfer_custody(
    batch_id: str, 
    transfer_req: schemas.CustodyTransferRequest, 
    db: Session = Depends(get_db), 
    current_user = Depends(require_role(["beekeeper", "processor", "admin"]))
):
    """
    REST Endpoint: Record transfer of custody for a batch with audit trail.
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

    bc_tx = models.BlockchainTransaction(
        related_table="custody_transfers",
        related_id=transfer_record.id,
        tx_hash=tx_hash,
        action_type="CUSTODY_TRANSFERRED",
        timestamp=datetime.utcnow()
    )
    db.add(bc_tx)

    batch.status = f"In Transit to {to_owner}"
    db.add(transfer_record)
    db.commit()
    db.refresh(transfer_record)

    logger.info(f"Custody of batch '{batch_id}' transferred from '{from_owner}' to '{to_owner}'.")

    return transfer_record

@router.get("", response_model=List[schemas.BatchResponse])
@router.get("/", response_model=List[schemas.BatchResponse])
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
        "batch_code": batch.batch_code or batch.id,
        "created_at": batch.created_at,
        "is_merged": batch.is_merged,
        "document_hash": batch.document_hash,
        "status": batch.status,
        "verification_id": verification.id if verification else None,
        "tx_hash": batch.tx_hash or (verification.tx_hash if verification else None)
    }
