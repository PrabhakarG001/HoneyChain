from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas
from ..auth import require_role
import uuid

router = APIRouter(prefix="/batches", tags=["Batches"])

@router.post("/merge")
def merge_batches(merge_req: schemas.BatchMerge, db: Session = Depends(get_db), current_user = Depends(require_role(["processor", "admin"]))):
    # Verify all harvests exist
    harvests = db.query(models.Harvest).filter(models.Harvest.id.in_(merge_req.parent_harvest_ids)).all()
    if len(harvests) != len(merge_req.parent_harvest_ids):
        raise HTTPException(status_code=400, detail="One or more harvest IDs are invalid.")
    
    # Create new Batch
    batch_id = f"BATCH_{str(uuid.uuid4())[:8].upper()}"
    new_batch = models.Batch(
        id=batch_id,
        is_merged=True,
        document_hash=merge_req.document_hash,
        status="Processing"
    )
    db.add(new_batch)
    
    # Link harvests
    for h in harvests:
        h.batch_id = batch_id
        
    db.commit()
    
    # Store blockchain transaction securely
    try:
        from ..services.contract_client import contract_client
        tx_hash = contract_client.create_batch(batch_id, merge_req.parent_harvest_ids)
        
        # Link verification record
        v_record = models.VerificationRecord(
            id=str(uuid.uuid4()),
            batch_id=batch_id,
            tx_hash=tx_hash
        )
        db.add(v_record)
        db.commit()
    except Exception as e:
        # Blockchain is down or failed, rollback or store failure state
        db.rollback()
        raise HTTPException(status_code=503, detail="Blockchain transaction failed: " + str(e))
        
    return {"message": "Batches successfully merged on blockchain", "batch_id": batch_id, "tx_hash": tx_hash}

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
