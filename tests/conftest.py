import os
import sys
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Ensure project root is in sys.path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from backend.database import Base, get_db
from backend.main import app
from backend import models, auth
from datetime import timedelta

# Test in-memory SQLite database
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):
    def _override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def test_beekeeper_user(db):
    hashed_pwd = auth.get_password_hash("beekeeperpass123")
    user = models.User(username="test_beekeeper", hashed_password=hashed_pwd, role="beekeeper")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture(scope="function")
def test_processor_user(db):
    hashed_pwd = auth.get_password_hash("processorpass123")
    user = models.User(username="test_processor", hashed_password=hashed_pwd, role="processor")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture(scope="function")
def test_admin_user(db):
    hashed_pwd = auth.get_password_hash("adminpass123")
    user = models.User(username="test_admin", hashed_password=hashed_pwd, role="admin")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture(scope="function")
def beekeeper_auth_headers(test_beekeeper_user):
    token = auth.create_access_token(
        data={"sub": test_beekeeper_user.username, "role": test_beekeeper_user.role},
        expires_delta=timedelta(minutes=30)
    )
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="function")
def processor_auth_headers(test_processor_user):
    token = auth.create_access_token(
        data={"sub": test_processor_user.username, "role": test_processor_user.role},
        expires_delta=timedelta(minutes=30)
    )
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="function")
def admin_auth_headers(test_admin_user):
    token = auth.create_access_token(
        data={"sub": test_admin_user.username, "role": test_admin_user.role},
        expires_delta=timedelta(minutes=30)
    )
    return {"Authorization": f"Bearer {token}"}
