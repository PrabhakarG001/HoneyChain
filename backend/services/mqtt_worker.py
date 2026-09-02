import paho.mqtt.client as mqtt
import json
import logging
import asyncio
from datetime import datetime
from ..config import settings
from ..schemas import MQTTPayload
from ..database import SessionLocal
from ..models import SensorReading

logger = logging.getLogger(__name__)

class MQTTWorker:
    def __init__(self):
        self.client = mqtt.Client(client_id="honeychain_backend_worker")
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        
    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            logger.info("Connected to MQTT Broker!")
            client.subscribe(settings.MQTT_TOPIC)
        else:
            logger.error(f"Failed to connect to MQTT broker, return code {rc}")

    def on_message(self, client, userdata, msg):
        try:
            payload = json.loads(msg.payload.decode())
            validated_data = MQTTPayload(**payload)
            
            # Save to database
            db = SessionLocal()
            reading = SensorReading(
                hive_id=validated_data.hive_id,
                timestamp=validated_data.timestamp,
                temperature_c=validated_data.temperature_c,
                humidity_pct=validated_data.humidity_pct,
                weight_kg=validated_data.weight_kg,
                sound_level_db=validated_data.sound_level_db
            )
            db.add(reading)
            db.commit()
            db.close()
            logger.debug(f"Saved reading for {validated_data.hive_id}")
            
        except Exception as e:
            logger.error(f"Error processing MQTT message: {e}")

    def start(self):
        try:
            self.client.connect(settings.MQTT_BROKER, settings.MQTT_PORT, 60)
            self.client.loop_start()
        except Exception as e:
            logger.error(f"Could not start MQTT worker: {e}")

    def stop(self):
        self.client.loop_stop()
        self.client.disconnect()

mqtt_worker = MQTTWorker()
