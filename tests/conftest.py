import os
import sys
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add root directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app
from backend.database import Base, get_db
import backend.database as backend_db
from backend import models
from backend.auth import get_password_hash, create_access_token

TEST_DATABASE_URL = "sqlite:///./test_honeychain.db"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    # Override engine in backend.database and backend.main so all operations use test_db
    backend_db.engine = engine
    backend_db.SessionLocal = TestingSessionLocal
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    if os.path.exists("./test_honeychain.db"):
        try:
            os.remove("./test_honeychain.db")
        except Exception:
            pass

@pytest.fixture
def db():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    yield session
    session.close()

@pytest.fixture
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

@pytest.fixture
def test_beekeeper_user(db):
    user = db.query(models.User).filter(models.User.username == "test_bk").first()
    if not user:
        user = models.User(username="test_bk", hashed_password=get_password_hash("pass"), role="BEEKEEPER")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

@pytest.fixture
def beekeeper_auth_headers(test_beekeeper_user):
    token = create_access_token(data={"sub": test_beekeeper_user.username, "role": test_beekeeper_user.role})
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def test_processor_user(db):
    user = db.query(models.User).filter(models.User.username == "test_proc").first()
    if not user:
        user = models.User(username="test_proc", hashed_password=get_password_hash("pass"), role="PROCESSOR")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

@pytest.fixture
def processor_auth_headers(test_processor_user):
    token = create_access_token(data={"sub": test_processor_user.username, "role": test_processor_user.role})
    return {"Authorization": f"Bearer {token}"}
