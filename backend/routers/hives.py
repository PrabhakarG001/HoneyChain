from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import logging
from ..database import get_db
from .. import models, schemas
from ..auth import require_role, get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/hives", tags=["Hives"])

@router.get("/", response_model=List[schemas.HiveResponse])
def get_hives(
    apiary_id: Optional[str] = None,
    farm_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role(["beekeeper", "admin"]))
):
    """Retrieve all hives accessible to current beekeeper/admin user."""
    query = db.query(models.Hive)
    if (current_user.role or "").lower() == "beekeeper":
        query = query.filter(models.Hive.owner_id == current_user.id)
    if apiary_id:
        query = query.filter(models.Hive.apiary_id == apiary_id)
    if farm_id:
        query = query.filter(models.Hive.farm_id == farm_id)
    return query.all()

@router.post("/", response_model=schemas.HiveResponse, status_code=status.HTTP_201_CREATED)
def create_hive(
    hive_req: schemas.HiveCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role(["beekeeper", "admin"]))
):
    """Create a new hive linked to an apiary or farm."""
    existing = db.query(models.Hive).filter(models.Hive.id == hive_req.id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Hive '{hive_req.id}' already exists")

    hive_code = hive_req.hive_code or f"HC-{hive_req.id}"
    code_check = db.query(models.Hive).filter(models.Hive.hive_code == hive_code).first()
    if code_check:
        hive_code = f"HC-{hive_req.id}-{int(datetime.utcnow().timestamp())}"

    apiary_id = hive_req.apiary_id
    if not apiary_id and hive_req.farm_id:
        apiary_id = hive_req.farm_id

    new_hive = models.Hive(
        id=hive_req.id,
        apiary_id=apiary_id,
        farm_id=hive_req.farm_id or apiary_id,
        owner_id=current_user.id,
        name=hive_req.name or f"Hive {hive_req.id}",
        hive_code=hive_code,
        location=hive_req.location,
        install_date=hive_req.install_date or datetime.utcnow()
    )
    db.add(new_hive)
    db.commit()
    db.refresh(new_hive)
    logger.info(f"Hive '{hive_req.id}' created with hive_code '{hive_code}'.")
    return new_hive

@router.get("/{id}", response_model=schemas.HiveResponse)
def get_hive(id: str, db: Session = Depends(get_db), current_user: models.User = Depends(require_role(["beekeeper", "admin"]))):
    hive = db.query(models.Hive).filter(models.Hive.id == id).first()
    if not hive:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Hive '{id}' not found")
    return hive

@router.get("/{id}/readings", response_model=List[schemas.SensorReadingResponse])
def get_hive_readings(
    id: str,
    range: str = Query("24h", description="Time range: 1h, 24h, 7d, 30d, all"),
    limit: int = Query(100, ge=1, le=1000, description="Max readings to return (capped at 1000)"),
    offset: int = Query(0, ge=0, description="Pagination offset"),
    db: Session = Depends(get_db)
):
    """
    REST Endpoint: Fetch historical time-series sensor readings for a hive.
    Uses index-backed queries with time-range windowing and pagination to prevent memory overhead.
    """
    hive = db.query(models.Hive).filter(models.Hive.id == id).first()
    if not hive:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Hive '{id}' not found")

    query = db.query(models.SensorReading).filter(models.SensorReading.hive_id == id)

    now = datetime.utcnow()
    if range == "1h":
        query = query.filter(models.SensorReading.timestamp >= now - timedelta(hours=1))
    elif range == "24h":
        query = query.filter(models.SensorReading.timestamp >= now - timedelta(days=1))
    elif range == "7d":
        query = query.filter(models.SensorReading.timestamp >= now - timedelta(days=7))
    elif range == "30d":
        query = query.filter(models.SensorReading.timestamp >= now - timedelta(days=30))

    readings = query.order_by(models.SensorReading.timestamp.desc())\
        .offset(offset)\
        .limit(limit)\
        .all()

    return readings
