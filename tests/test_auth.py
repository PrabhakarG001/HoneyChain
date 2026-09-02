import pytest

def test_register_and_login_beekeeper(client):
    # 1. Register Beekeeper
    reg_res = client.post("/auth/register", json={
        "username": "beekeeper_test",
        "password": "Password123!",
        "role": "BEEKEEPER"
    })
    assert reg_res.status_code == 200
    user_data = reg_res.json()
    assert user_data["username"] == "beekeeper_test"
    assert user_data["role"] == "BEEKEEPER"

    # 2. Login Beekeeper
    login_res = client.post("/auth/login", data={
        "username": "beekeeper_test",
        "password": "Password123!"
    })
    assert login_res.status_code == 200
    token_data = login_res.json()
    assert "access_token" in token_data
    token = token_data["access_token"]

    headers = {"Authorization": f"Bearer {token}"}

    # 3. Read profile
    me_res = client.get("/users/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["username"] == "beekeeper_test"
    assert me_res.json()["role"] == "BEEKEEPER"

    # 4. Access Beekeeper Protected Route (Create Farm & Hive)
    farm_res = client.post("/farms/", json={"id": "FARM-BK-01", "name": "Beekeeper Apiary"}, headers=headers)
    assert farm_res.status_code == 200

    hive_res = client.post("/hives/", json={"id": "HV-BK-001", "name": "Alpha Hive", "location": "Sector A"}, headers=headers)
    assert hive_res.status_code == 200

    # 5. Attempt Customer-only protected API -> must return 403 Forbidden
    cust_res = client.get("/customer/orders", headers=headers)
    assert cust_res.status_code == 403
    assert cust_res.json()["detail"] == "Not enough permissions"

def test_register_and_login_customer(client):
    # 1. Register Customer
    reg_res = client.post("/auth/register", json={
        "username": "customer_test",
        "password": "Password123!",
        "role": "CUSTOMER"
    })
    assert reg_res.status_code == 200
    user_data = reg_res.json()
    assert user_data["username"] == "customer_test"
    assert user_data["role"] == "CUSTOMER"

    # 2. Login Customer
    login_res = client.post("/auth/login", data={
        "username": "customer_test",
        "password": "Password123!"
    })
    assert login_res.status_code == 200
    token_data = login_res.json()
    assert "access_token" in token_data
    token = token_data["access_token"]

    headers = {"Authorization": f"Bearer {token}"}

    # 3. Read Profile
    me_res = client.get("/users/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["username"] == "customer_test"
    assert me_res.json()["role"] == "CUSTOMER"

    # 4. Access Customer Protected Route
    cust_orders = client.get("/customer/orders", headers=headers)
    assert cust_orders.status_code == 200
    assert len(cust_orders.json()) >= 1

    cust_tip = client.post("/customer/tips", json={"amount": 5.0, "beekeeper_id": "BK_001"}, headers=headers)
    assert cust_tip.status_code == 200

    # 5. Attempt Beekeeper-only protected APIs -> must return 403 Forbidden
    bk_farm_res = client.post("/farms/", json={"id": "FARM-FAIL", "name": "Illegal Farm"}, headers=headers)
    assert bk_farm_res.status_code == 403
    assert bk_farm_res.json()["detail"] == "Not enough permissions"

    bk_hives_res = client.get("/hives/", headers=headers)
    assert bk_hives_res.status_code == 403
    assert bk_hives_res.json()["detail"] == "Not enough permissions"

def test_invalid_credentials_rejected(client):
    # Nonexistent user
    res1 = client.post("/auth/login", data={"username": "ghost_user", "password": "any"})
    assert res1.status_code == 401

    # Wrong password
    client.post("/auth/register", json={"username": "real_user", "password": "CorrectPassword", "role": "CUSTOMER"})
    res2 = client.post("/auth/login", data={"username": "real_user", "password": "WrongPassword"})
    assert res2.status_code == 401

def test_unauthenticated_requests_rejected(client):
    assert client.get("/farms/").status_code == 401
    assert client.get("/hives/").status_code == 401
    assert client.get("/customer/orders").status_code == 401
    assert client.get("/users/me").status_code == 401
