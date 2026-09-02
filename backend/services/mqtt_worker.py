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
            
            # Trigger ML inference
            import sys
            import os
            # Ensure ml module is accessible
            backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            root_dir = os.path.dirname(backend_dir)
            if root_dir not in sys.path:
                sys.path.insert(0, root_dir)
            
            from ml.inference.ml_engine import calculate_hybrid_risk
            from ..models import MLAnalysis
            
            weight_delta = 0.0
            temp_dev = validated_data.temperature_c - 35.0
            hum_dev = validated_data.humidity_pct - 50.0
            
            risk_result = calculate_hybrid_risk(weight_delta, temp_dev, hum_dev)
            analysis = MLAnalysis(
                hive_id=validated_data.hive_id,
                timestamp=validated_data.timestamp,
                risk_score=risk_result.get("score"),
                status=risk_result.get("status"),
                highest_contributor=risk_result.get("highest_contributor"),
                model_version="if_v1.0"
            )
            db.add(analysis)
            db.commit()
            
            db.close()
            logger.debug(f"Saved reading and ML analysis for {validated_data.hive_id}")
            
            # Broadcast to WebSocket clients
            from ..services.pubsub import pubsub_manager
            ws_payload = {
                "hive_id": validated_data.hive_id,
                "timestamp": validated_data.timestamp.isoformat(),
                "temperature": validated_data.temperature_c,
                "humidity": validated_data.humidity_pct,
                "weight": validated_data.weight_kg,
                "risk_analysis": risk_result
            }
            
            # Use run_coroutine_threadsafe to schedule async publish from the MQTT thread
            if hasattr(self, 'loop') and self.loop:
                asyncio.run_coroutine_threadsafe(
                    pubsub_manager.publish(f"hives/{validated_data.hive_id}/telemetry", ws_payload),
                    self.loop
                )
            
        except Exception as e:
            logger.error(f"Error processing MQTT message: {e}")

    def start(self):
        try:
            self.loop = asyncio.get_running_loop()
        except RuntimeError:
            self.loop = None
            
        try:
            self.client.connect(settings.MQTT_BROKER, settings.MQTT_PORT, 60)
            self.client.loop_start()
        except Exception as e:
            logger.error(f"Could not start MQTT worker: {e}")

    def stop(self):
        self.client.loop_stop()
        self.client.disconnect()

mqtt_worker = MQTTWorker()
