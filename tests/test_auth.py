import pytest

def test_register_and_login(client):
    # Register new user
    register_res = client.post("/auth/register", json={
        "username": "testbeekeeper",
        "password": "securepassword123",
        "role": "BEEKEEPER"
    })
    assert register_res.status_code == 200
    data = register_res.json()
    assert data["username"] == "testbeekeeper"
    assert data["role"] == "BEEKEEPER"

    # Login
    login_res = client.post("/auth/login", data={
        "username": "testbeekeeper",
        "password": "securepassword123"
    })
    assert login_res.status_code == 200
    token_data = login_res.json()
    assert "access_token" in token_data
    token = token_data["access_token"]

    # Test /users/me
    me_res = client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["username"] == "testbeekeeper"

    # Test token refresh
    refresh_res = client.post("/auth/refresh", headers={"Authorization": f"Bearer {token}"})
    assert refresh_res.status_code == 200
    assert "access_token" in refresh_res.json()

def test_invalid_login(client):
    res = client.post("/auth/login", data={
        "username": "testbeekeeper",
        "password": "wrongpassword"
    })
    assert res.status_code == 401
