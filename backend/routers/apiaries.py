from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
import logging
from ..database import get_db
from .. import models, schemas
from ..auth import require_role, get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/apiaries", tags=["Apiaries"])

@router.post("", response_model=schemas.ApiaryResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=schemas.ApiaryResponse, status_code=status.HTTP_201_CREATED)
def create_apiary(
    apiary_req: schemas.ApiaryCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role(["beekeeper", "admin"]))
):
    """Create a new physical apiary site with lat/lng validation."""
    if apiary_req.lat is not None and not (-90.0 <= apiary_req.lat <= 90.0):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Latitude must be between -90.0 and 90.0 degrees")
    if apiary_req.lng is not None and not (-180.0 <= apiary_req.lng <= 180.0):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Longitude must be between -180.0 and 180.0 degrees")

    beekeeper_id = apiary_req.beekeeper_id
    if not beekeeper_id and (current_user.role or "").lower() == "beekeeper":
        bk = db.query(models.Beekeeper).filter(models.Beekeeper.user_id == current_user.id).first()
        if bk:
            beekeeper_id = bk.id

    apiary_id = apiary_req.id or f"APIARY_{str(uuid.uuid4())[:8].upper()}"
    existing = db.query(models.Apiary).filter(models.Apiary.id == apiary_id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Apiary '{apiary_id}' already exists")

    new_apiary = models.Apiary(
        id=apiary_id,
        beekeeper_id=beekeeper_id,
        name=apiary_req.name,
        lat=apiary_req.lat,
        lng=apiary_req.lng
    )
    db.add(new_apiary)
    db.commit()
    db.refresh(new_apiary)

    # Also map/create farm record for backward compatibility
    farm = db.query(models.Farm).filter(models.Farm.id == apiary_id).first()
    if not farm:
        farm = models.Farm(
            id=apiary_id,
            owner_id=current_user.id,
            name=apiary_req.name,
            location=f"{apiary_req.lat},{apiary_req.lng}" if apiary_req.lat else "Unknown",
            status="Active"
        )
        db.add(farm)
        db.commit()

    logger.info(f"Apiary '{apiary_id}' created successfully.")
    return new_apiary

@router.get("", response_model=List[schemas.ApiaryResponse])
@router.get("/", response_model=List[schemas.ApiaryResponse])
def get_apiaries(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """List all apiaries."""
    query = db.query(models.Apiary)
    if (current_user.role or "").lower() == "beekeeper":
        bk = db.query(models.Beekeeper).filter(models.Beekeeper.user_id == current_user.id).first()
        if bk:
            query = query.filter(models.Apiary.beekeeper_id == bk.id)
    return query.all()

@router.get("/{apiary_id}", response_model=schemas.ApiaryResponse)
def get_apiary(
    apiary_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Retrieve specific apiary details."""
    apiary = db.query(models.Apiary).filter(models.Apiary.id == apiary_id).first()
    if not apiary:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Apiary '{apiary_id}' not found")
    return apiary
