import logging
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta
from contextlib import asynccontextmanager

from . import models, schemas
from .database import engine, get_db
from .auth import create_access_token, get_password_hash
from .config import settings

# Routers
from .routers import hives, harvests, batches, verify

# Services
from .services.mqtt_worker import mqtt_worker
from .services.replay_mode import start_replay_mode

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create DB tables
models.Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up FastAPI application...")
    mqtt_worker.start()
    if settings.REPLAY_MODE:
        start_replay_mode()
    
    yield
    
    # Shutdown
    logger.info("Shutting down...")
    mqtt_worker.stop()


app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(hives.router)
app.include_router(harvests.router)
app.include_router(batches.router)
app.include_router(verify.router)


@app.post("/auth/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = models.User(username=user.username, role=user.role, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    from .auth import verify_password
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/")
def read_root():
    return {"message": "Welcome to ApiVera Backend", "replay_mode": settings.REPLAY_MODE}
