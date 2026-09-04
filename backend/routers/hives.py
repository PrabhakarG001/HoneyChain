from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import logging
from ..database import get_db
from .. import models, schemas
from ..auth import require_role, get_current_user
from ml.inference.ml_engine import calculate_hybrid_risk
from ml.inference.yield_engine import predict_honey_yield

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/hives", tags=["Hives"])

@router.get("", response_model=List[schemas.HiveResponse])
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

@router.post("", response_model=schemas.HiveResponse, status_code=status.HTTP_201_CREATED)
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

@router.get("/{id}/analysis")
def get_hive_analysis(id: str, db: Session = Depends(get_db)):
    """
    REST Endpoint: Return latest ML anomaly analysis and risk diagnostic breakdown for a hive.
    """
    hive = db.query(models.Hive).filter(models.Hive.id == id).first()
    if not hive:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Hive '{id}' not found")

    latest_analysis = db.query(models.MLAnalysis).filter(models.MLAnalysis.hive_id == id)\
        .order_by(models.MLAnalysis.timestamp.desc()).first()

    reading = db.query(models.SensorReading).filter(models.SensorReading.hive_id == id)\
        .order_by(models.SensorReading.timestamp.desc()).first()

    temp_dev = ((reading.temperature_c or 35.0) - 35.0) if reading else 0.0
    hum_dev = ((reading.humidity_pct or 50.0) - 50.0) if reading else 0.0
    sound_db = (reading.sound_level_db or 40.0) if reading else 40.0

    risk_res = calculate_hybrid_risk(0.0, temp_dev, hum_dev, sound_db)

    return {
        "hive_id": id,
        "timestamp": (latest_analysis.timestamp if latest_analysis else datetime.utcnow()).isoformat(),
        "risk_score": latest_analysis.risk_score if latest_analysis and latest_analysis.risk_score is not None else risk_res.get("score"),
        "status": latest_analysis.status if latest_analysis else risk_res.get("status"),
        "highest_contributor": latest_analysis.highest_contributor if latest_analysis else risk_res.get("highest_contributor"),
        "model_version": latest_analysis.model_version if latest_analysis else "if_v1.0",
        "factor_breakdown": risk_res.get("factor_breakdown"),
        "explanation": risk_res.get("explanation"),
        "recommendation": risk_res.get("recommendation")
    }

@router.get("/{id}/yield-forecast")
def get_hive_yield_forecast(id: str, db: Session = Depends(get_db)):
    """
    REST Endpoint: Return ML seasonal yield forecast for a hive.
    """
    hive = db.query(models.Hive).filter(models.Hive.id == id).first()
    if not hive:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Hive '{id}' not found")

    reading = db.query(models.SensorReading).filter(models.SensorReading.hive_id == id)\
        .order_by(models.SensorReading.timestamp.desc()).first()

    current_weight = reading.weight_kg if reading and reading.weight_kg else 35.0
    temp_avg = reading.temperature_c if reading and reading.temperature_c else 32.0
    hum_avg = reading.humidity_pct if reading and reading.humidity_pct else 55.0

    forecast = predict_honey_yield(
        temp_avg=temp_avg,
        humidity_avg=hum_avg,
        hive_weight=current_weight,
        brood_count=22000,
        active_days=60,
        historical_yield_avg=28.0
    )
    forecast["hive_id"] = id
    return forecast

@router.get("/{id}/telemetry")
def get_hive_telemetry(id: str, db: Session = Depends(get_db)):
    """
    REST Endpoint: Return latest telemetry reading for a hive.
    """
    reading = db.query(models.SensorReading).filter(models.SensorReading.hive_id == id)\
        .order_by(models.SensorReading.timestamp.desc()).first()
    if not reading:
        return {
            "hive_id": id,
            "timestamp": datetime.utcnow().isoformat(),
            "temperature_c": 35.0,
            "humidity_pct": 50.0,
            "weight_kg": 30.0,
            "sound_level_db": 40.0,
            "battery_pct": 100.0,
            "status": "Normal"
        }
    return reading

