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
    return {"message": "Batches successfully merged", "batch_id": batch_id}
