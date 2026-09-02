import pytest
from unittest.mock import MagicMock, patch
from backend.services.contract_client import ContractClient

def test_contract_client_offline_behavior():
    client = ContractClient()
    client.contract = None  # Force offline

    with pytest.raises(RuntimeError) as exc_info:
        client.create_batch("BATCH_001", ["H1", "H2"])
    assert "Blockchain contract unavailable" in str(exc_info.value)

    # verify_product should return error payload when offline
    result = client.verify_product("PROD_001")
    assert result == {"error": "Web3 offline"}

def test_contract_client_tx_execution_with_mocked_contract(db):
    client = ContractClient()
    
    # Mock Web3 contract
    mock_contract = MagicMock()
    mock_func = MagicMock()
    mock_func.transact.return_value = b"\x12\x34\x56\x78\x9a\xbc\xde\xf0"
    mock_contract.functions.createBatch.return_value = mock_func
    
    client.contract = mock_contract
    client.account = MagicMock()
    client.account.address = "0x1111111111111111111111111111111111111111"
    client.w3 = MagicMock()
    client.w3.to_hex.return_value = "0x123456789abcdef0"

    with patch("backend.services.contract_client.SessionLocal", return_value=db):
        tx_hash = client.create_batch("BATCH_MOCK_1", ["H1", "H2"])
        assert tx_hash == "0x123456789abcdef0"

    # Verify transaction saved in database
    from backend.models import BlockchainTransaction
    record = db.query(BlockchainTransaction).filter_by(tx_hash="0x123456789abcdef0").first()
    assert record is not None
    assert record.action_type == "CREATE_BATCH"
