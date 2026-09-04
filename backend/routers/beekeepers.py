from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
import logging
from ..database import get_db
from .. import models, schemas
from ..auth import require_role, get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/beekeepers", tags=["Beekeepers"])

@router.post("/", response_model=schemas.BeekeeperResponse, status_code=status.HTTP_201_CREATED)
def create_beekeeper(
    bk_req: schemas.BeekeeperCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role(["beekeeper", "admin"]))
):
    """Create or link a beekeeper profile for the current user."""
    existing = db.query(models.Beekeeper).filter(models.Beekeeper.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Beekeeper profile already exists for this user")

    lic_check = db.query(models.Beekeeper).filter(models.Beekeeper.license_no == bk_req.license_no).first()
    if lic_check:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"License number '{bk_req.license_no}' is already registered")

    beekeeper_id = f"BK_{str(uuid.uuid4())[:8].upper()}"
    new_bk = models.Beekeeper(
        id=beekeeper_id,
        user_id=current_user.id,
        license_no=bk_req.license_no,
        location=bk_req.location
    )
    db.add(new_bk)
    db.commit()
    db.refresh(new_bk)
    logger.info(f"Beekeeper profile '{beekeeper_id}' created for user '{current_user.username}'.")
    return new_bk

@router.get("/", response_model=List[schemas.BeekeeperResponse])
def get_beekeepers(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Retrieve all beekeeper profiles."""
    return db.query(models.Beekeeper).all()

@router.get("/{beekeeper_id}", response_model=schemas.BeekeeperResponse)
def get_beekeeper(
    beekeeper_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Retrieve specific beekeeper profile by ID."""
    bk = db.query(models.Beekeeper).filter(models.Beekeeper.id == beekeeper_id).first()
    if not bk:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Beekeeper '{beekeeper_id}' not found")
    return bk
