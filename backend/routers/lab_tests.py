from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
import logging
from ..database import get_db
from .. import models, schemas
from ..auth import require_role, get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/lab-tests", tags=["Lab Tests"])

@router.post("/", response_model=schemas.LabTestResponse, status_code=status.HTTP_201_CREATED)
def create_lab_test(
    test_req: schemas.LabTestCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role(["processor", "admin"]))
):
    """Attach structured laboratory purity/quality test results to a honey batch."""
    batch = db.query(models.Batch).filter(models.Batch.id == test_req.batch_id).first()
    if not batch:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Honey batch '{test_req.batch_id}' not found")

    test_id = f"LT_{str(uuid.uuid4())[:8].upper()}"
    new_test = models.LabTest(
        id=test_id,
        batch_id=batch.id,
        test_type=test_req.test_type,
        result=test_req.result,
        lab_name=test_req.lab_name
    )
    batch.status = "TESTED"
    db.add(new_test)
    db.commit()
    db.refresh(new_test)
    logger.info(f"Lab test '{test_id}' attached to batch '{batch.id}' by '{current_user.username}'.")
    return new_test

@router.get("/", response_model=List[schemas.LabTestResponse])
def get_lab_tests(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """List all lab test records."""
    return db.query(models.LabTest).order_by(models.LabTest.created_at.desc()).all()

@router.get("/batch/{batch_id}", response_model=List[schemas.LabTestResponse])
def get_lab_tests_by_batch(
    batch_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get all lab test results for a specific batch."""
    return db.query(models.LabTest).filter(models.LabTest.batch_id == batch_id).all()
