from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas
from ..auth import require_role
import uuid

router = APIRouter(prefix="/farms", tags=["Farms"])

@router.post("/")
def create_farm(farm_data: dict, db: Session = Depends(get_db), current_user = Depends(require_role(["beekeeper", "admin"]))):
    farm_id = farm_data.get("id") or f"farm-{uuid.uuid4().hex[:8]}"
    db_farm = models.Farm(
        id=farm_id,
        owner_id=current_user.id,
        name=farm_data.get("name"),
        location=farm_data.get("location"),
        area=farm_data.get("area"),
        number_of_hives=farm_data.get("number_of_hives") or farm_data.get("numberOfHives"),
        bee_species=farm_data.get("bee_species") or farm_data.get("beeSpecies"),
        floral_source=farm_data.get("floral_source") or farm_data.get("floralSource"),
        status=farm_data.get("status") or "ACTIVE"
    )
    db.add(db_farm)
    db.commit()
    db.refresh(db_farm)
    return db_farm

@router.get("/")
def get_farms(db: Session = Depends(get_db), current_user = Depends(require_role(["beekeeper", "admin"]))):
    return db.query(models.Farm).filter(models.Farm.owner_id == current_user.id).all()

@router.get("/{farm_id}")
def get_farm(farm_id: str, db: Session = Depends(get_db), current_user = Depends(require_role(["beekeeper", "admin"]))):
    farm = db.query(models.Farm).filter(models.Farm.id == farm_id, models.Farm.owner_id == current_user.id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    return farm

@router.get("/{farm_id}/hives")
def get_hives_for_farm(farm_id: str, db: Session = Depends(get_db), current_user = Depends(require_role(["beekeeper", "admin"]))):
    farm = db.query(models.Farm).filter(models.Farm.id == farm_id, models.Farm.owner_id == current_user.id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found or unauthorized")
    return db.query(models.Hive).filter(models.Hive.farm_id == farm_id).all()
