from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas
from ..auth import require_role

router = APIRouter(prefix="/customer", tags=["Customer Portal"])

@router.get("/profile")
def get_customer_profile(db: Session = Depends(get_db), current_user = Depends(require_role(["customer", "admin"]))):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "role": current_user.role,
        "portal": "Customer Transparency Hub",
        "verified_scans": 12,
        "favorite_farms": ["Sunny Valley Apiary", "Highland Organic Apiaries"]
    }

@router.get("/orders")
def get_customer_orders(db: Session = Depends(get_db), current_user = Depends(require_role(["customer", "admin"]))):
    return [
        {
            "order_id": "ORD-2026-8801",
            "product_name": "Raw Wildflower Honey (500g)",
            "batch_id": "BATCH_A1B2C3D4",
            "farm_name": "Sunny Valley Apiary",
            "status": "Delivered",
            "date": "2026-08-28"
        },
        {
            "order_id": "ORD-2026-8802",
            "product_name": "Monofloral Acacia Honey (1kg)",
            "batch_id": "BATCH_E5F6G7H8",
            "farm_name": "Highland Organic Apiaries",
            "status": "In Transit",
            "date": "2026-09-01"
        }
    ]

@router.post("/orders")
def create_customer_order(payload: dict, db: Session = Depends(get_db), current_user = Depends(require_role(["customer", "admin"]))):
    import time
    order_id = f"ORD-{int(time.time())}"
    return {
        "order_id": order_id,
        "status": "Confirmed",
        "date": "2026-09-05",
        "customer": current_user.username,
        "details": payload
    }

@router.post("/tips")
def tip_beekeeper(payload: dict, db: Session = Depends(get_db), current_user = Depends(require_role(["customer", "admin"]))):
    amount = payload.get("amount")
    beekeeper_id = payload.get("beekeeper_id", "beekeeper_001")
    if not amount or amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid tip amount")
    return {
        "message": f"Successfully tipped {amount} MATIC to beekeeper {beekeeper_id}",
        "customer": current_user.username,
        "tx_hash": "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba"
    }
