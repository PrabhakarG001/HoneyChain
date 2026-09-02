import asyncio
import json
import logging
from typing import Dict, Set
from fastapi import WebSocket

logger = logging.getLogger(__name__)

class PubSubManager:
    def __init__(self):
        # Maps a topic name (e.g., "hives/HIVE_001/telemetry") to a set of WebSockets
        self.topics: Dict[str, Set[WebSocket]] = {}

    async def subscribe(self, topic: str, websocket: WebSocket):
        if topic not in self.topics:
            self.topics[topic] = set()
        self.topics[topic].add(websocket)
        logger.info(f"WebSocket subscribed to topic: {topic}")

    async def unsubscribe(self, topic: str, websocket: WebSocket):
        if topic in self.topics:
            self.topics[topic].discard(websocket)
            if not self.topics[topic]:
                del self.topics[topic]
        logger.info(f"WebSocket unsubscribed from topic: {topic}")

    async def publish(self, topic: str, message: dict):
        if topic in self.topics:
            websockets = self.topics[topic].copy()
            for ws in websockets:
                try:
                    await ws.send_json(message)
                except Exception as e:
                    logger.error(f"Error sending message to WebSocket on topic {topic}: {e}")
                    await self.unsubscribe(topic, ws)

pubsub_manager = PubSubManager()
