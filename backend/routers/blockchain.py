from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/blockchain", tags=["Blockchain Transactions"])

@router.get("/transactions", response_model=List[schemas.BlockchainTransactionResponse])
def get_blockchain_transactions(
    related_table: Optional[str] = None,
    related_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Off-chain index lookup for blockchain transactions."""
    query = db.query(models.BlockchainTransaction)
    if related_table:
        query = query.filter(models.BlockchainTransaction.related_table == related_table)
    if related_id:
        query = query.filter(models.BlockchainTransaction.related_id == related_id)
    return query.order_by(models.BlockchainTransaction.timestamp.desc()).all()

@router.get("/transactions/{tx_hash}", response_model=schemas.BlockchainTransactionResponse)
def get_blockchain_transaction_by_hash(tx_hash: str, db: Session = Depends(get_db)):
    """Lookup a single blockchain transaction record by its hash."""
    tx = db.query(models.BlockchainTransaction).filter(models.BlockchainTransaction.tx_hash == tx_hash).first()
    if not tx:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Transaction hash '{tx_hash}' not found in index")
    return tx
