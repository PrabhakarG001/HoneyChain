import os
import json
import hashlib
import logging
from web3 import Web3
try:
    from web3.middleware import construct_sign_and_send_raw_middleware
except ImportError:
    try:
        from web3.middleware import SignAndSendRawMiddlewareBuilder
        construct_sign_and_send_raw_middleware = SignAndSendRawMiddlewareBuilder
    except ImportError:
        construct_sign_and_send_raw_middleware = None

from ..database import SessionLocal
from ..models import BlockchainTransaction

logger = logging.getLogger(__name__)

# Defaults for local testing if env vars missing
DEFAULT_RPC = "http://127.0.0.1:8545"
POLYGON_AMOY_RPC = "https://rpc-amoy.polygon.technology"

BLOCKCHAIN_MODE = os.getenv("BLOCKCHAIN_MODE", "auto").lower() # 'polygon', 'local', 'auto'
PRIVATE_KEY = os.getenv("WEB3_PRIVATE_KEY", "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS", "0x0000000000000000000000000000000000000000")

# Minimal ABI for the 9 core smart contract functions
MINIMAL_ABI = json.loads('''[
    {"inputs":[{"internalType":"string","name":"hiveId","type":"string"},{"internalType":"bytes32","name":"apiaryHash","type":"bytes32"}],"name":"registerHive","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"string","name":"hiveId","type":"string"},{"internalType":"string","name":"harvestId","type":"string"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint256","name":"quantityKg","type":"uint256"}],"name":"createHarvest","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"string","name":"batchId","type":"string"},{"internalType":"string[]","name":"harvestIds","type":"string[]"}],"name":"createBatch","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"string","name":"batchId","type":"string"},{"internalType":"address","name":"toOwner","type":"address"}],"name":"transferCustody","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"string","name":"newBatchId","type":"string"},{"internalType":"string[]","name":"parentBatchIds","type":"string[]"}],"name":"mergeBatches","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"string","name":"batchId","type":"string"},{"internalType":"bytes32","name":"processStepHash","type":"bytes32"}],"name":"recordProcessing","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"string","name":"batchId","type":"string"},{"internalType":"bytes32","name":"labTestHash","type":"bytes32"},{"internalType":"bool","name":"passed","type":"bool"}],"name":"recordLabTest","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"string","name":"productId","type":"string"},{"internalType":"string","name":"batchId","type":"string"}],"name":"createProduct","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"string","name":"productId","type":"string"}],"name":"verifyProduct","outputs":[{"internalType":"string","name":"batchId","type":"string"},{"internalType":"bytes32","name":"processStepHash","type":"bytes32"},{"internalType":"bytes32","name":"labTestHash","type":"bytes32"},{"internalType":"bool","name":"labPassed","type":"bool"}],"stateMutability":"view","type":"function"}
]''')

def hash_document(content: bytes | str) -> bytes:
    """Computes a 32-byte SHA-256 hash of an off-chain document (PDF, image, text) for on-chain verification."""
    if isinstance(content, str):
        content = content.encode('utf-8')
    return hashlib.sha256(content).digest()

class ContractClient:
    def __init__(self):
        self.network_name = "Offline Local Hash"
        self.chain_id = 0
        self.w3 = None
        self.contract = None
        self.account = None

        # Determine target RPC provider based on BLOCKCHAIN_MODE
        target_rpc = POLYGON_AMOY_RPC if BLOCKCHAIN_MODE == "polygon" else os.getenv("WEB3_PROVIDER_URI", DEFAULT_RPC)
        
        try:
            self.w3 = Web3(Web3.HTTPProvider(target_rpc, request_kwargs={'timeout': 2}))
            if not self.w3.is_connected() and BLOCKCHAIN_MODE == "auto":
                logger.warning(f"Could not connect to primary RPC {target_rpc}, attempting fallback to {DEFAULT_RPC}")
                self.w3 = Web3(Web3.HTTPProvider(DEFAULT_RPC, request_kwargs={'timeout': 2}))
        except Exception as err:
            logger.warning(f"Web3 initialization notice: {err}")

        if self.w3 and self.w3.is_connected() and CONTRACT_ADDRESS != "0x0000000000000000000000000000000000000000":
            try:
                self.chain_id = self.w3.eth.chain_id
                self.network_name = "Polygon Amoy Testnet" if self.chain_id == 80002 else f"Local Hardhat Node (Chain ID {self.chain_id})"
                logger.info(f"Connected to Web3 provider on {self.network_name}.")
                
                self.account = self.w3.eth.account.from_key(PRIVATE_KEY)
                if construct_sign_and_send_raw_middleware:
                    try:
                        mw = construct_sign_and_send_raw_middleware(self.account)
                        self.w3.middleware_onion.add(mw)
                    except Exception as mw_err:
                        logger.warning(f"Signing middleware note: {mw_err}")
                        
                self.contract = self.w3.eth.contract(address=self.w3.to_checksum_address(CONTRACT_ADDRESS), abi=MINIMAL_ABI)
            except Exception as e:
                logger.error(f"Failed to setup Web3 account/contract: {e}")
                self.contract = None
        else:
            logger.info("Web3 provider offline or contract address unconfigured. Contract client operating in offline mode.")
            self.contract = None

    def get_network_info(self) -> dict:
        return {
            "mode": BLOCKCHAIN_MODE,
            "network_name": self.network_name,
            "chain_id": self.chain_id,
            "is_connected": self.contract is not None,
            "contract_address": CONTRACT_ADDRESS
        }

    def _execute_tx(self, func_call, action_type: str, related_table: str = "blockchain", related_id: str = "tx") -> str:
        if not self.contract:
            logger.info(f"Contract client offline or unconfigured. Generating local proof hash for {action_type}.")
            raise RuntimeError(f"Blockchain contract unavailable for {action_type}.")
            
        try:
            tx_hash = func_call.transact({"from": self.account.address})
            hex_hash = self.w3.to_hex(tx_hash)
            
            # Save to DB
            db = SessionLocal()
            record = BlockchainTransaction(
                related_table=related_table,
                related_id=related_id,
                tx_hash=hex_hash,
                action_type=action_type
            )
            db.add(record)
            db.commit()
            db.close()
            
            logger.info(f"Broadcasted {action_type} tx: {hex_hash} on {self.network_name}")
            return hex_hash
        except Exception as e:
            logger.error(f"Transaction failed for {action_type}: {e}")
            raise

    # ------------------ Contract Wrappers ------------------

    def register_hive(self, hive_id: str, apiary_hash: bytes):
        if not self.contract:
            raise RuntimeError("Blockchain contract unavailable for REGISTER_HIVE.")
        return self._execute_tx(self.contract.functions.registerHive(hive_id, apiary_hash), "REGISTER_HIVE", "hives", hive_id)

    def create_harvest(self, hive_id: str, harvest_id: str, timestamp: int, quantity_kg: int):
        if not self.contract:
            raise RuntimeError("Blockchain contract unavailable for CREATE_HARVEST.")
        return self._execute_tx(self.contract.functions.createHarvest(hive_id, harvest_id, timestamp, quantity_kg), "CREATE_HARVEST", "harvest_events", harvest_id)

    def create_batch(self, batch_id: str, harvest_ids: list[str]):
        if not self.contract:
            raise RuntimeError("Blockchain contract unavailable for CREATE_BATCH.")
        return self._execute_tx(self.contract.functions.createBatch(batch_id, harvest_ids), "CREATE_BATCH", "honey_batches", batch_id)

    def transfer_custody(self, batch_id: str, to_owner: str):
        if not self.contract:
            raise RuntimeError("Blockchain contract unavailable for TRANSFER_CUSTODY.")
        return self._execute_tx(self.contract.functions.transferCustody(batch_id, self.w3.to_checksum_address(to_owner)), "TRANSFER_CUSTODY", "custody_transfers", batch_id)

    def merge_batches(self, new_batch_id: str, parent_batch_ids: list[str]):
        if not self.contract:
            raise RuntimeError("Blockchain contract unavailable for MERGE_BATCHES.")
        return self._execute_tx(self.contract.functions.mergeBatches(new_batch_id, parent_batch_ids), "MERGE_BATCHES", "honey_batches", new_batch_id)

    def record_processing(self, batch_id: str, process_step_hash: bytes):
        if not self.contract:
            raise RuntimeError("Blockchain contract unavailable for RECORD_PROCESSING.")
        return self._execute_tx(self.contract.functions.recordProcessing(batch_id, process_step_hash), "RECORD_PROCESSING", "honey_batches", batch_id)

    def record_lab_test(self, batch_id: str, lab_test_hash: bytes, passed: bool):
        if not self.contract:
            raise RuntimeError("Blockchain contract unavailable for RECORD_LAB_TEST.")
        return self._execute_tx(self.contract.functions.recordLabTest(batch_id, lab_test_hash, passed), "RECORD_LAB_TEST", "lab_tests", batch_id)

    def create_product(self, product_id: str, batch_id: str):
        if not self.contract:
            raise RuntimeError("Blockchain contract unavailable for CREATE_PRODUCT.")
        return self._execute_tx(self.contract.functions.createProduct(product_id, batch_id), "CREATE_PRODUCT", "products", product_id)

    def verify_product(self, product_id: str):
        if not self.contract:
            return {"error": "Web3 offline", "network": self.network_name}
        try:
            # call() executes locally, zero gas
            result = self.contract.functions.verifyProduct(product_id).call()
            return {
                "batchId": result[0],
                "processStepHash": self.w3.to_hex(result[1]),
                "labTestHash": self.w3.to_hex(result[2]),
                "labPassed": result[3],
                "network": self.network_name
            }
        except Exception as e:
            logger.error(f"Read failed for verifyProduct: {e}")
            raise

contract_client = ContractClient()
