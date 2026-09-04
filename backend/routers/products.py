from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
import uuid
import logging
from ..database import get_db
from .. import models, schemas
from ..auth import require_role

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    prod_req: schemas.ProductCreate, 
    db: Session = Depends(get_db), 
    current_user = Depends(require_role(["processor", "admin"]))
):
    """
    REST Endpoint: Create sellable product from a honey batch.
    Generates product_code, bottle_date, and QR payload URL for consumer verification.
    """
    batch = db.query(models.Batch).filter(models.Batch.id == prod_req.batch_id).first()
    if not batch:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Batch '{prod_req.batch_id}' not found")

    product_id = f"PROD_{str(uuid.uuid4())[:8].upper()}"
    product_code = prod_req.product_code or f"HC-{product_id}"

    # Verify uniqueness of product_code
    existing = db.query(models.Product).filter(models.Product.product_code == product_code).first()
    if existing:
        product_code = f"HC-{product_id}-{int(datetime.utcnow().timestamp())}"

    qr_payload = f"https://honeychain.org/verify/{product_id}"
    bottle_date = prod_req.bottle_date or datetime.utcnow()

    new_product = models.Product(
        id=product_id,
        batch_id=batch.id,
        product_code=product_code,
        name=prod_req.name,
        bottle_date=bottle_date,
        qr_code=qr_payload,
        created_at=datetime.utcnow()
    )
    batch.status = "PACKAGED"
    db.add(new_product)

    # Blockchain transaction index
    tx_hash = f"0x_product_created_{product_id}"
    bc_tx = models.BlockchainTransaction(
        related_table="products",
        related_id=product_id,
        tx_hash=tx_hash,
        action_type="PRODUCT_CREATED",
        timestamp=datetime.utcnow()
    )
    db.add(bc_tx)

    db.commit()
    db.refresh(new_product)

    logger.info(f"Product '{product_id}' (code: {product_code}) created for batch '{batch.id}'.")

    return new_product

@router.get("", response_model=List[schemas.ProductResponse])
@router.get("/", response_model=List[schemas.ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).order_by(models.Product.created_at.desc()).all()

@router.get("/{product_id}", response_model=schemas.ProductResponse)
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(
        (models.Product.id == product_id) | (models.Product.product_code == product_id)
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found")
    return product
