from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/verify", tags=["Verification"])

@router.get("/{verification_id}", response_model=schemas.VerificationResponse)
def verify_product(verification_id: str, db: Session = Depends(get_db)):
    """
    Public endpoint. Strips all private beekeeper PII.
    """
    record = db.query(models.VerificationRecord).filter(models.VerificationRecord.id == verification_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Verification record not found")
        
    return {
        "id": record.id,
        "batch_id": record.batch_id,
        "tx_hash": record.tx_hash,
        "created_at": record.created_at,
        "status": "Verified"
    }
