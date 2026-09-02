import os

class Settings:
    PROJECT_NAME: str = "HoneyChain Backend"
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./honeychain.db"
    SECRET_KEY: str = "supersecretkey_change_in_prod"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    
    # MQTT
    MQTT_BROKER: str = "test.mosquitto.org"
    MQTT_PORT: int = 1883
    MQTT_TOPIC: str = "hivechain/+/telemetry"
    
    # ML
    MODEL_PATH: str = "isolation_forest.joblib"
    
    # Demo
    REPLAY_MODE: bool = os.getenv("REPLAY_MODE", "False").lower() in ("true", "1", "t")

settings = Settings()
