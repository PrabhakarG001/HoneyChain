import pytest
from backend import models

def test_qr_verification_success(client, db):
    # Seed batch, tx, and verification record
    batch = models.Batch(id="BATCH_QR_001", is_merged=True, status="Bottled")
    tx = models.BlockchainTransaction(related_table="honey_batches", related_id="BATCH_QR_001", tx_hash="0xqr1234567890abcdef", action_type="MERGE_BATCHES")
    db.add_all([batch, tx])
    db.commit()

    v_record = models.VerificationRecord(
        id="VERIFY_QR_001",
        batch_id=batch.id,
        tx_hash=tx.tx_hash
    )
    db.add(v_record)
    db.commit()

    response = client.get("/verify/VERIFY_QR_001")
    assert response.status_code == 200
    data = response.json()
    assert data["batch_id"] == "BATCH_QR_001"
    assert data["status"] == "Verified"
    
    # Ensure PII protection (no user/owner fields exposed)
    assert "owner" not in data
    assert "username" not in data
    assert "password" not in data

def test_qr_verification_not_found(client):
    response = client.get("/verify/NONEXISTENT_QR_ID")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()
