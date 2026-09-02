from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List
import asyncio
from ..database import get_db
from .. import models, schemas
from ..auth import require_role
from ..services.ml_engine import calculate_hybrid_risk
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

@router.websocket("/{hive_id}/live")
async def hive_live_stream(websocket: WebSocket, hive_id: str, db: Session = Depends(get_db)):
    await websocket.accept()
    try:
        while True:
            # Fetch latest reading
            latest_reading = db.query(models.SensorReading).filter(
                models.SensorReading.hive_id == hive_id
            ).order_by(models.SensorReading.timestamp.desc()).first()
            
            if latest_reading:
                # Calculate risk
                # Mock historical delta for demo:
                weight_delta = 0.0 # Calculate actual 5-min rolling delta here in prod
                temp_dev = latest_reading.temperature_c - 35.0 # Assume 35 is ideal brood temp
                hum_dev = latest_reading.humidity_pct - 50.0
                
                risk = calculate_hybrid_risk(weight_delta, temp_dev, hum_dev)
                
                payload = {
                    "hive_id": hive_id,
                    "timestamp": latest_reading.timestamp.isoformat(),
                    "temperature": latest_reading.temperature_c,
                    "humidity": latest_reading.humidity_pct,
                    "weight": latest_reading.weight_kg,
                    "risk_analysis": risk
                }
                await websocket.send_json(payload)
            
            await asyncio.sleep(5) # Poll every 5 seconds
    except WebSocketDisconnect:
        print(f"Client disconnected from hive {hive_id} stream")
