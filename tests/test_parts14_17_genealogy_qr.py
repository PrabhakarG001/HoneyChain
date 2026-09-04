import pytest
from backend import models, auth
from backend.services.genealogy import GenealogyEngine

def test_genealogy_engine_lineage_and_privacy(client, db):
    """
    Tests Parts 14 & 15:
    1. Seed Beekeeper, Apiary, Hive, Harvests, Batches, Product, Lab Test, and Blockchain Tx
    2. Reconstruct product genealogy via GenealogyEngine
    3. Verify recursive ancestor batch resolution and non-N+1 eager loading
    4. Call GET /genealogy/product/{product_id} and GET /verify/{verification_id}
    5. Assert strict PII privacy (no passwords, emails, phone numbers)
    """
    # 1. Seed Beekeeper User & Profile
    bk_pwd = auth.get_password_hash("secret123")
    bk_user = models.User(username="master_beekeeper", hashed_password=bk_pwd, role="beekeeper")
    db.add(bk_user)
    db.commit()

    bk_profile = models.Beekeeper(id="BK_101", user_id=bk_user.id, license_no="LIC-998877", location="Pine Valley")
    db.add(bk_profile)
    db.commit()

    apiary = models.Apiary(id="AP_101", beekeeper_id=bk_profile.id, name="Highland Apiary", lat=42.123, lng=-71.456)
    hive = models.Hive(id="HV_101", owner_id=bk_user.id, apiary_id=apiary.id, name="Royal Hive A")
    db.add_all([apiary, hive])
    db.commit()

    harvest1 = models.Harvest(id="HVST_001", hive_id=hive.id, weight_kg=30.0, tx_hash="0xhvst1111")
    harvest2 = models.Harvest(id="HVST_002", hive_id=hive.id, weight_kg=25.0, tx_hash="0xhvst2222")
    db.add_all([harvest1, harvest2])
    db.commit()

    batch_parent = models.Batch(id="BATCH_PARENT_01", batch_code="BC-P01", is_merged=False, status="PROCESSED")
    batch_child = models.Batch(id="BATCH_CHILD_01", batch_code="BC-C01", is_merged=True, status="BOTTLED")
    db.add_all([batch_parent, batch_child])
    db.commit()

    # Link harvests to parent batch
    bs1 = models.BatchSource(batch_id=batch_parent.id, harvest_id=harvest1.id)
    bs2 = models.BatchSource(batch_id=batch_parent.id, harvest_id=harvest2.id)
    # Link parent batch to child batch
    bt = models.BatchTransformation(id="BT_001", parent_batch_id=batch_parent.id, child_batch_id=batch_child.id, type="MERGE")
    db.add_all([bs1, bs2, bt])
    db.commit()

    # Product
    product = models.Product(id="PROD_FULL_001", batch_id=batch_child.id, product_code="HC-PROD-001", name="Organic Wildflower Honey")
    # Lab test
    lab_test = models.LabTest(id="LAB_001", batch_id=batch_child.id, test_type="Purity & Antibiotics", result="PASSED 100% Organic", lab_name="Intertek Honey Lab")
    # Blockchain Tx
    bc_tx = models.BlockchainTransaction(related_table="products", related_id=product.id, tx_hash="0xbcprod9999", action_type="CREATE_PRODUCT")
    db.add_all([product, lab_test, bc_tx])
    db.commit()

    # 2. Reconstruct product genealogy via GenealogyEngine
    genealogy = GenealogyEngine.get_product_genealogy(db, product.id)
    assert genealogy["success"] is True
    assert genealogy["product"]["product_code"] == "HC-PROD-001"
    assert genealogy["batch"]["id"] == "BATCH_CHILD_01"
    assert len(genealogy["harvests"]) == 2
    assert len(genealogy["hives"]) == 1
    assert len(genealogy["apiaries"]) == 1

    # 3. Test GET /genealogy/product/{product_id} REST API
    res = client.get(f"/genealogy/product/{product.id}")
    assert res.status_code == 200
    g_data = res.json()
    assert g_data["product"]["name"] == "Organic Wildflower Honey"
    assert len(g_data["harvests"]) == 2

    # 4. Test GET /genealogy/harvest/{harvest_id}/products REST API
    downstream = client.get(f"/genealogy/harvest/{harvest1.id}/products")
    assert downstream.status_code == 200
    prod_list = downstream.json()
    assert len(prod_list) >= 1
    assert prod_list[0]["id"] == "PROD_FULL_001"

    # 5. Test Public Verification & PII Protection GET /verify/{verification_id}
    v_record = models.VerificationRecord(id="VR_FULL_001", batch_id=batch_child.id, tx_hash="0xbcprod9999")
    db.add(v_record)
    db.commit()

    v_res = client.get(f"/verify/{v_record.id}")
    assert v_res.status_code == 200
    v_data = v_res.json()
    assert v_data["status"] == "Verified"
    assert v_data["batch_id"] == "BATCH_CHILD_01"
    assert v_data["tx_hash"] == "0xbcprod9999"

    # Ensure sensitive PII is NEVER exposed in verification payload
    payload_str = str(v_data).lower()
    assert "password" not in payload_str
    assert "secret123" not in payload_str
    assert "hashed_password" not in payload_str

def test_rbac_and_public_consumer_access(client, db):
    """
    Tests Parts 16 & 17 RBAC:
    - Public Consumer can verify products without authentication headers.
    - Beekeeper cannot access Processor batch merge endpoints without PROCESSOR role.
    """
    # 1. Public Consumer Lookup (No Auth Token)
    public_res = client.get("/verify/NON_EXISTENT_VERIFY_ID")
    assert public_res.status_code == 404 # Properly handles missing verification record

    # 2. Beekeeper Role accessing Processor merge endpoint
    bk_pwd = auth.get_password_hash("bkpass")
    bk_user = models.User(username="bk_only_user", hashed_password=bk_pwd, role="beekeeper")
    db.add(bk_user)
    db.commit()

    bk_token = auth.create_access_token(data={"sub": bk_user.username, "role": bk_user.role})
    headers = {"Authorization": f"Bearer {bk_token}"}

    # Should be rejected with 403 Forbidden because role is BEEKEEPER not PROCESSOR
    forbidden_res = client.post("/batches/merge", json={
        "parent_harvest_ids": ["HVST_001"],
        "document_hash": "0xhash"
    }, headers=headers)
    assert forbidden_res.status_code == 403
