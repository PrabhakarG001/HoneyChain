from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List, Optional
import asyncio
from ..database import get_db
from .. import models, schemas
from ..auth import require_role
from ml.inference.ml_engine import calculate_hybrid_risk
from datetime import datetime, timedelta

router = APIRouter(prefix="/hives", tags=["Hives"])

@router.post("/", response_model=schemas.HiveCreate)
def create_hive(hive: schemas.HiveCreate, db: Session = Depends(get_db), current_user = Depends(require_role(["beekeeper", "admin"]))):
    db_hive = models.Hive(id=hive.id, name=hive.name, location=hive.location, owner_id=current_user.id)
    db.add(db_hive)
    db.commit()
    db.refresh(db_hive)
    return db_hive

@router.get("/")
def get_hives(db: Session = Depends(get_db), current_user = Depends(require_role(["beekeeper", "admin"]))):
    return db.query(models.Hive).filter(models.Hive.owner_id == current_user.id).all()

from ..services.pubsub import pubsub_manager

@router.websocket("/{hive_id}/live")
async def hive_live_stream(websocket: WebSocket, hive_id: str):
    await websocket.accept()
    topic = f"hives/{hive_id}/telemetry"
    await pubsub_manager.subscribe(topic, websocket)
    try:
        while True:
            # Keep the connection open and listen for disconnects
            await websocket.receive_text()
    except WebSocketDisconnect:
        await pubsub_manager.unsubscribe(topic, websocket)
        print(f"Client disconnected from hive {hive_id} stream")

@router.get("/{hive_id}")
def get_hive(hive_id: str, db: Session = Depends(get_db), current_user = Depends(require_role(["beekeeper", "admin"]))):
    hive = db.query(models.Hive).filter(models.Hive.id == hive_id, models.Hive.owner_id == current_user.id).first()
    if not hive:
        raise HTTPException(status_code=404, detail="Hive not found")
    return hive

@router.get("/{hive_id}/readings")
@router.get("/{hive_id}/telemetry")
def get_hive_readings(
    hive_id: str, 
    range: Optional[str] = "24h",
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db), 
    current_user = Depends(require_role(["beekeeper", "admin", "processor", "customer"]))
):
    """
    REST Endpoint: Bounded historical sensor data query.
    Supports range (1h, 24h, 7d, 30d, all), limit, and pagination offset.
    """
    hive = db.query(models.Hive).filter(models.Hive.id == hive_id).first()
    if not hive:
        raise HTTPException(status_code=404, detail=f"Hive '{hive_id}' not found")
        
    # Check ownership for beekeepers
    if (current_user.role or "").lower() == "beekeeper" and hive.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized access to this hive's sensor readings")

    # Enforce safe upper bound on limit to prevent unbounded memory allocation
    capped_limit = max(1, min(limit, 1000))

    query = db.query(models.SensorReading).filter(models.SensorReading.hive_id == hive_id)

    # Time range filtering
    now = datetime.utcnow()
    if range == "1h":
        query = query.filter(models.SensorReading.timestamp >= now - timedelta(hours=1))
    elif range == "24h":
        query = query.filter(models.SensorReading.timestamp >= now - timedelta(hours=24))
    elif range == "7d":
        query = query.filter(models.SensorReading.timestamp >= now - timedelta(days=7))
    elif range == "30d":
        query = query.filter(models.SensorReading.timestamp >= now - timedelta(days=30))

    readings = query.order_by(models.SensorReading.timestamp.asc()).offset(offset).limit(capped_limit).all()
    return readings


@router.get("/{hive_id}/analysis", response_model=schemas.MLAnalysisResponse)
def get_hive_analysis(hive_id: str, db: Session = Depends(get_db), current_user = Depends(require_role(["beekeeper", "admin"]))):
    hive = db.query(models.Hive).filter(models.Hive.id == hive_id, models.Hive.owner_id == current_user.id).first()
    if not hive:
        raise HTTPException(status_code=404, detail="Hive not found")
        
    analysis = db.query(models.MLAnalysis).filter(models.MLAnalysis.hive_id == hive_id).order_by(models.MLAnalysis.timestamp.desc()).first()
    if not analysis:
        # Return a safe default instead of 404 so UI doesn't crash if no telemetry yet
        return schemas.MLAnalysisResponse(
            hive_id=hive_id,
            timestamp=datetime.utcnow(),
            risk_score=None,
            status="No Data",
            highest_contributor="None",
            model_version="N/A"
        )
    return analysis
