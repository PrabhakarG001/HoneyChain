from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from ..database import get_db
from .. import models, schemas
from ..services.genealogy import GenealogyEngine
from ..auth import get_current_user

router = APIRouter(prefix="/genealogy", tags=["Genealogy"])

@router.get("/product/{product_id}", response_model=schemas.GenealogyResponse)
def get_product_genealogy(product_id: str, db: Session = Depends(get_db)):
    """
    Public / Authenticated Endpoint: Full supply chain genealogy for a product.
    Answers: "Where did this product come from?"
    """
    res = GenealogyEngine.get_product_genealogy(db, product_id)
    if not res.get("success"):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=res.get("error", "Genealogy not found"))
    return res

@router.get("/harvest/{harvest_id}/products", response_model=List[schemas.ProductResponse])
def get_harvest_downstream_products(harvest_id: str, db: Session = Depends(get_db)):
    """
    Traceability Endpoint: Finds all consumer products derived from a specific harvest event.
    Answers: "Which products originated from this harvest?"
    """
    harvest = db.query(models.Harvest).filter(models.Harvest.id == harvest_id).first()
    if not harvest:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Harvest event '{harvest_id}' not found")
    return GenealogyEngine.get_harvest_downstream_products(db, harvest_id)

@router.get("/batch/{batch_id}")
def get_batch_genealogy_details(batch_id: str, db: Session = Depends(get_db)):
    """
    Genealogy Endpoint: Returns ancestor harvests, parent batches, and child batches for a honey batch.
    """
    batch = db.query(models.Batch).filter(models.Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Batch '{batch_id}' not found")

    harvests = GenealogyEngine.get_batch_harvests(db, batch_id)
    parent_batches = GenealogyEngine.get_parent_batches(db, batch_id)
    child_batches = GenealogyEngine.get_child_batches(db, batch_id)

    return {
        "batch_id": batch.id,
        "batch_code": batch.batch_code or batch.id,
        "status": batch.status,
        "harvests_count": len(harvests),
        "harvests": [h.id for h in harvests],
        "parent_batches": [pb.id for pb in parent_batches],
        "child_batches": [cb.id for cb in child_batches]
    }
