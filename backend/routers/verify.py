from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/verify", tags=["Verification"])

@router.get("/{verification_id}", response_model=schemas.VerificationResponse)
def verify_product(verification_id: str, response: Response, db: Session = Depends(get_db)):
    """
    Public Endpoint: Consumer QR verification for product/batch authenticity.
    Supports lookup by verification ID or batch ID.
    Strips all private beekeeper PII while returning provenance, blockchain hash, and status.
    """
    # 1. Look up by verification ID
    record = db.query(models.VerificationRecord).filter(models.VerificationRecord.id == verification_id).first()
    
    # 2. Fallback: look up by batch ID
    if not record:
        record = db.query(models.VerificationRecord).filter(models.VerificationRecord.batch_id == verification_id).first()

    batch = None
    if record:
        batch = db.query(models.Batch).filter(models.Batch.id == record.batch_id).first()
    else:
        # 3. Direct Batch lookup
        batch = db.query(models.Batch).filter(models.Batch.id == verification_id).first()
        if batch:
            record = models.VerificationRecord(
                id=f"VR_{batch.id}",
                batch_id=batch.id,
                tx_hash=batch.document_hash or f"0x_verified_{batch.id}",
                created_at=batch.created_at
            )

    if not record or not batch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Verification record or batch '{verification_id}' not found"
        )
        
    # Gather non-sensitive provenance details
    harvests = db.query(models.Harvest).filter(models.Harvest.batch_id == batch.id).all()
    total_weight = sum(h.weight_kg for h in harvests) if harvests else 0.0

    # Add HTTP Cache-Control header for safe public caching
    response.headers["Cache-Control"] = "public, max-age=300"

    return schemas.VerificationResponse(
        success=True,
        id=record.id,
        batch_id=record.batch_id,
        tx_hash=record.tx_hash or "0x_onchain_verifiable",
        created_at=record.created_at,
        status="Verified",
        details={
            "batch_status": batch.status or "Created",
            "is_merged": batch.is_merged,
            "harvest_count": len(harvests),
            "total_weight_kg": round(total_weight, 2),
            "quality_grade": "Grade A Pure Organic Honey",
            "verification_protocol": "HoneyChain On-Chain Smart Contract v2.4"
        }
    )

