import paho.mqtt.client as mqtt
import json
import logging
import asyncio
from datetime import datetime
from typing import List, Dict, Any
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
        self.buffer: List[Dict[str, Any]] = []
        self.buffer_lock = asyncio.Lock() if hasattr(asyncio, 'Lock') else None
        self.is_connected = False
        self.is_started = False
        
    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            if not self.is_connected:
                logger.info("Connected to MQTT Broker!")
                self.is_connected = True
            client.subscribe(settings.MQTT_TOPIC)
        else:
            self.is_connected = False
            logger.error(f"Failed to connect to MQTT broker, return code {rc}")

    def process_sensor_reading(self, validated_data: MQTTPayload):
        """Processes sensor data: saves to DB and broadcasts live WebSocket frame."""
        # 1. Save to Database
        db = SessionLocal()
        try:
            reading = SensorReading(
                hive_id=validated_data.hive_id,
                timestamp=validated_data.timestamp,
                temperature_c=validated_data.temperature_c,
                humidity_pct=validated_data.humidity_pct,
                weight_kg=validated_data.weight_kg,
                sound_level_db=validated_data.sound_level_db,
                battery_pct=validated_data.battery_pct,
                lat=validated_data.lat,
                lng=validated_data.lng
            )
            db.add(reading)
            db.commit()
            
            # 2. ML Inference
            import sys
            import os
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
            
            logger.debug(f"Saved sensor reading and ML analysis for hive '{validated_data.hive_id}'")
        except Exception as err:
            logger.error(f"Failed to save sensor reading to DB: {err}")
            db.rollback()
        finally:
            db.close()

        # 3. Broadcast to WebSocket Subscribers in Standard Format
        from ..services.pubsub import pubsub_manager
        ws_payload = {
            "type": "sensor_update",
            "hiveId": validated_data.hive_id,
            "data": {
                "hive_id": validated_data.hive_id,
                "timestamp": validated_data.timestamp.isoformat(),
                "temperature": validated_data.temperature_c,
                "humidity": validated_data.humidity_pct,
                "weight": validated_data.weight_kg,
                "sound_level": validated_data.sound_level_db,
                "battery_pct": validated_data.battery_pct,
                "lat": validated_data.lat,
                "lng": validated_data.lng,
                "risk_analysis": risk_result
            }
        }

        if hasattr(self, 'loop') and self.loop:
            asyncio.run_coroutine_threadsafe(
                pubsub_manager.publish(f"hives/{validated_data.hive_id}/telemetry", ws_payload),
                self.loop
            )
            asyncio.run_coroutine_threadsafe(
                pubsub_manager.publish("hives/all/telemetry", ws_payload),
                self.loop
            )

    def on_message(self, client, userdata, msg):
        try:
            payload = json.loads(msg.payload.decode())
            validated_data = MQTTPayload(**payload)
            self.process_sensor_reading(validated_data)
        except Exception as e:
            logger.error(f"Error processing MQTT message: {e}")

    def start(self):
        if self.is_started:
            return
        try:
            self.loop = asyncio.get_running_loop()
        except RuntimeError:
            self.loop = None
            
        try:
            self.client.connect(settings.MQTT_BROKER, settings.MQTT_PORT, 60)
            self.client.loop_start()
            self.is_started = True
        except Exception as e:
            logger.error(f"Could not start MQTT worker: {e}")

    def stop(self):
        if self.is_started:
            self.client.loop_stop()
            self.client.disconnect()
            self.is_started = False
            self.is_connected = False

mqtt_worker = MQTTWorker()

