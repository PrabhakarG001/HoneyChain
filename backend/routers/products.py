from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
import uuid
import logging
from ..database import get_db
from .. import models, schemas
from ..auth import require_role
from ..services.contract_client import contract_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("/", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    prod_req: schemas.ProductCreate, 
    db: Session = Depends(get_db), 
    current_user = Depends(require_role(["processor", "admin"]))
):
    """
    REST Endpoint: Generate a consumer product associated with a honey batch.
    Links product -> batch -> harvest -> hive and generates QR code payload URL.
    """
    batch = db.query(models.Batch).filter(models.Batch.id == prod_req.batch_id).first()
    if not batch:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Batch '{prod_req.batch_id}' not found")

    product_id = f"PROD_{str(uuid.uuid4())[:8].upper()}"
    qr_payload = f"honeychain://verify/{product_id}"

    new_product = models.Product(
        id=product_id,
        batch_id=batch.id,
        name=prod_req.name,
        qr_code=qr_payload,
        created_at=datetime.utcnow()
    )
    db.add(new_product)

    # Link product in blockchain smart contract
    try:
        contract_client.create_product(product_id, batch.id)
    except Exception as e:
        logger.warning(f"Blockchain product creation notice: {e}")

    # Ensure verification record exists for product
    v_rec = db.query(models.VerificationRecord).filter(models.VerificationRecord.batch_id == batch.id).first()
    if not v_rec:
        v_rec = models.VerificationRecord(
            id=f"VR_{product_id}",
            batch_id=batch.id,
            tx_hash=f"0x_product_{product_id}",
            created_at=datetime.utcnow()
        )
        db.add(v_rec)

    db.commit()
    db.refresh(new_product)

    logger.info(f"Product '{product_id}' ('{prod_req.name}') created and linked to batch '{batch.id}'.")

    return new_product

@router.get("/")
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).order_by(models.Product.created_at.desc()).all()

@router.get("/{product_id}", response_model=schemas.ProductResponse)
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found")
    return product
