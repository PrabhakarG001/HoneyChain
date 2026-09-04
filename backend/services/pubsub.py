import asyncio
import json
import logging
from typing import Dict, Set
from fastapi import WebSocket

logger = logging.getLogger(__name__)

class PubSubManager:
    def __init__(self):
        # Maps topic (e.g. "hives/HIVE_001/telemetry") -> set of WebSockets
        self.topics: Dict[str, Set[WebSocket]] = {}
        # Maps WebSocket -> set of topics subscribed
        self.client_subscriptions: Dict[WebSocket, Set[str]] = {}

    async def subscribe(self, topic: str, websocket: WebSocket):
        if topic not in self.topics:
            self.topics[topic] = set()
        self.topics[topic].add(websocket)

        if websocket not in self.client_subscriptions:
            self.client_subscriptions[websocket] = set()
        self.client_subscriptions[websocket].add(topic)

        logger.info(f"WebSocket client subscribed to topic: '{topic}' (total subscribers: {len(self.topics[topic])})")

    async def unsubscribe(self, topic: str, websocket: WebSocket):
        if topic in self.topics:
            self.topics[topic].discard(websocket)
            if not self.topics[topic]:
                del self.topics[topic]
        
        if websocket in self.client_subscriptions:
            self.client_subscriptions[websocket].discard(topic)
            if not self.client_subscriptions[websocket]:
                del self.client_subscriptions[websocket]

        logger.info(f"WebSocket client unsubscribed from topic: '{topic}'")

    async def unsubscribe_all(self, websocket: WebSocket):
        if websocket in self.client_subscriptions:
            topics_to_remove = list(self.client_subscriptions[websocket])
            for topic in topics_to_remove:
                await self.unsubscribe(topic, websocket)
            logger.info("Cleaned up all WebSocket subscriptions for disconnected client.")

    async def publish(self, topic: str, message: dict):
        if topic in self.topics:
            websockets = list(self.topics[topic])
            for ws in websockets:
                try:
                    await ws.send_json(message)
                except Exception as e:
                    logger.error(f"Error sending message to WebSocket on topic '{topic}': {e}")
                    await self.unsubscribe_all(ws)

    def get_subscriber_count(self, topic: str) -> int:
        return len(self.topics.get(topic, set()))

pubsub_manager = PubSubManager()

