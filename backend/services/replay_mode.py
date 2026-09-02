import threading
import time
import json
import random
import paho.mqtt.publish as publish
from datetime import datetime
from ..config import settings
import logging

logger = logging.getLogger(__name__)

def demo_replay_loop():
    logger.info("Starting Demo Replay Mode (synthetic data generator)")
    start_time = time.time()
    hive_id = "demo_hive_001"
    base_weight = 50.0
    
    while True:
        elapsed = time.time() - start_time
        
        # Simulate a weight drop anomaly after 60 seconds
        if elapsed > 60:
            current_weight = base_weight - 15.0 - random.uniform(0, 2)
            logger.warning("REPLAY MODE: Simulating massive weight drop anomaly!")
        else:
            current_weight = base_weight + random.uniform(-0.5, 0.5)
            
        payload = {
            "hive_id": hive_id,
            "timestamp": datetime.utcnow().isoformat(),
            "temperature_c": 34.5 + random.uniform(-1, 1),
            "humidity_pct": 55.0 + random.uniform(-5, 5),
            "weight_kg": current_weight,
            "sound_level_db": 45.0 + random.uniform(-3, 3)
        }
        
        try:
            publish.single(
                f"hivechain/{hive_id}/telemetry",
                payload=json.dumps(payload),
                hostname=settings.MQTT_BROKER,
                port=settings.MQTT_PORT
            )
            logger.info(f"Published demo reading: {payload['weight_kg']} kg")
        except Exception as e:
            logger.error(f"Failed to publish demo data: {e}")
            
        time.sleep(10) # Publish every 10 seconds

def start_replay_mode():
    if settings.REPLAY_MODE:
        thread = threading.Thread(target=demo_replay_loop, daemon=True)
        thread.start()
