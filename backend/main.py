import logging
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta
from contextlib import asynccontextmanager

from . import models, schemas
from .database import engine, get_db
from .auth import create_access_token, get_password_hash, get_current_user
from .config import settings

# Routers
from .routers import (
    farms, hives, harvests, batches, products, verify, 
    websocket, analysis, customer, beekeepers, apiaries, 
    lab_tests, genealogy, blockchain
)

# Services
from .services.mqtt_worker import mqtt_worker

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up FastAPI application...")
    from .database import engine as db_engine
    models.Base.metadata.create_all(bind=db_engine)
    mqtt_worker.start()
    
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

# Include Routers (Direct & /api Prefixed)
app.include_router(farms.router)
app.include_router(farms.router, prefix="/api")

app.include_router(beekeepers.router)
app.include_router(beekeepers.router, prefix="/api")

app.include_router(apiaries.router)
app.include_router(apiaries.router, prefix="/api")

app.include_router(hives.router)
app.include_router(hives.router, prefix="/api")

app.include_router(harvests.router)
app.include_router(harvests.router, prefix="/api")

app.include_router(batches.router)
app.include_router(batches.router, prefix="/api")

app.include_router(lab_tests.router)
app.include_router(lab_tests.router, prefix="/api")

app.include_router(products.router)
app.include_router(products.router, prefix="/api")

app.include_router(verify.router)
app.include_router(verify.router, prefix="/api")

app.include_router(genealogy.router)
app.include_router(genealogy.router, prefix="/api")

app.include_router(blockchain.router)
app.include_router(blockchain.router, prefix="/api")

app.include_router(websocket.router)
app.include_router(websocket.router, prefix="/api")

app.include_router(analysis.router)
app.include_router(analysis.router, prefix="/api")

app.include_router(customer.router)
app.include_router(customer.router, prefix="/api")


@app.post("/auth/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
@app.post("/api/auth/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: schemas.UserCreate, db = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username, 
        name=user.name or user.username,
        role=user.role, 
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Auto-create Beekeeper profile if role is beekeeper
    if (user.role or "").lower() == "beekeeper":
        import uuid
        bk_id = f"BK_{str(uuid.uuid4())[:8].upper()}"
        lic_no = f"LIC_{str(uuid.uuid4())[:8].upper()}"
        bk = models.Beekeeper(id=bk_id, user_id=db_user.id, license_no=lic_no, location="General Area")
        db.add(bk)
        db.commit()

    return db_user

@app.post("/auth/login", response_model=schemas.Token)
@app.post("/api/auth/login", response_model=schemas.Token)
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

@app.post("/auth/refresh", response_model=schemas.Token)
@app.post("/api/auth/refresh", response_model=schemas.Token)
def refresh_token(current_user: models.User = Depends(get_current_user)):
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": current_user.username, "role": current_user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.UserResponse)
@app.get("/api/users/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.get("/")
def read_root():
    return {"message": "Welcome to HoneyChain Backend"}
