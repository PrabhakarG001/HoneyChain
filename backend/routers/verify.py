from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models

router = APIRouter(prefix="/verify", tags=["Verification"])

@router.get("/{product_id}")
def verify_product(product_id: str, db: Session = Depends(get_db)):
    """
    Public endpoint. Strips all private beekeeper PII.
    """
    # In a fully implemented system, we'd traverse: Product -> Batch -> Harvests -> Hives
    # For now, return mock structured public data
    return {
        "product_id": product_id,
        "authenticity_score": 98,
        "blockchain_hash": "0x8f4e2b19238479d1a3c...",
        "timeline": [
            {"event": "Harvested", "date": "2026-10-15"},
            {"event": "Processed", "date": "2026-10-18"},
            {"event": "Bottled", "date": "2026-10-20"}
        ],
        "origin": {
            "region": "Nilgiris Biosphere Cluster",
            "botanical": "Wildflower & Eucalyptus",
            "total_hives": 2,
            "total_harvests": 2
        },
        "lab_results": {
            "moisture_pct": 17.5,
            "pollen_purity": "A+",
            "fssai_compliant": True,
            "certificate_hash": "8f4e2b9d1a3c"
        }
    }
