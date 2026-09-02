import pytest
from datetime import timedelta
from jose import jwt
from backend import auth, models
from backend.config import settings

def test_password_hashing():
    password = "SecretPassword123!"
    hashed = auth.get_password_hash(password)
    assert hashed != password
    assert auth.verify_password(password, hashed) is True
    assert auth.verify_password("WrongPassword", hashed) is False

def test_register_user(client):
    payload = {
        "username": "new_beekeeper",
        "password": "Password123!",
        "role": "beekeeper"
    }
    response = client.post("/auth/register", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "new_beekeeper"
    assert data["role"] == "beekeeper"
    assert "id" in data

def test_register_duplicate_username(client, test_beekeeper_user):
    payload = {
        "username": test_beekeeper_user.username,
        "password": "Password123!",
        "role": "beekeeper"
    }
    response = client.post("/auth/register", json=payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "Username already registered"

def test_login_success(client, test_beekeeper_user):
    form_data = {
        "username": test_beekeeper_user.username,
        "password": "beekeeperpass123"
    }
    response = client.post("/auth/login", data=form_data)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_credentials(client, test_beekeeper_user):
    form_data = {
        "username": test_beekeeper_user.username,
        "password": "WrongPassword!"
    }
    response = client.post("/auth/login", data=form_data)
    assert response.status_code == 401
    assert "Incorrect username or password" in response.json()["detail"]

def test_jwt_validation_and_expiration(client, test_beekeeper_user):
    # Valid token
    token = auth.create_access_token(
        data={"sub": test_beekeeper_user.username, "role": test_beekeeper_user.role},
        expires_delta=timedelta(minutes=5)
    )
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    assert payload["sub"] == test_beekeeper_user.username
    assert payload["role"] == test_beekeeper_user.role

    # Expired token
    expired_token = auth.create_access_token(
        data={"sub": test_beekeeper_user.username, "role": test_beekeeper_user.role},
        expires_delta=timedelta(seconds=-10)
    )
    headers = {"Authorization": f"Bearer {expired_token}"}
    response = client.get("/users/me", headers=headers)
    assert response.status_code == 401
    assert "Could not validate credentials" in response.json()["detail"]

def test_refresh_token(client, beekeeper_auth_headers, test_beekeeper_user):
    response = client.post("/auth/refresh", headers=beekeeper_auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_protected_users_me(client, beekeeper_auth_headers, test_beekeeper_user):
    response = client.get("/users/me", headers=beekeeper_auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == test_beekeeper_user.username
    assert data["role"] == "beekeeper"

def test_unauthorized_access(client):
    response = client.get("/users/me")
    assert response.status_code == 401
    assert "Not authenticated" in response.json()["detail"]

def test_role_based_authorization(client, beekeeper_auth_headers, processor_auth_headers):
    # Beekeeper trying processor route (/batches/merge) should be forbidden (403)
    merge_payload = {
        "parent_harvest_ids": ["H1"],
        "document_hash": "0x123"
    }
    resp = client.post("/batches/merge", json=merge_payload, headers=beekeeper_auth_headers)
    assert resp.status_code == 403
    assert "Not enough permissions" in resp.json()["detail"]

    # Processor attempting merge without valid harvest should pass auth check (400 validation instead of 403)
    resp_processor = client.post("/batches/merge", json=merge_payload, headers=processor_auth_headers)
    assert resp_processor.status_code == 400
