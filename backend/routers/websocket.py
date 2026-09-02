import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from ..services.pubsub import pubsub_manager

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ws", tags=["WebSocket"])

@router.websocket("/telemetry")
async def websocket_telemetry_all(websocket: WebSocket):
    """
    Connect to global real-time telemetry stream across all hives.
    """
    await websocket.accept()
    topic = "hives/all/telemetry"
    await pubsub_manager.subscribe(topic, websocket)
    logger.info("Client connected to global telemetry WebSocket stream.")
    
    try:
        while True:
            # Keep connection open and listen for any client messages or pings
            data = await websocket.receive_text()
            logger.debug(f"Received message from WebSocket client: {data}")
    except WebSocketDisconnect:
        await pubsub_manager.unsubscribe(topic, websocket)
        logger.info("Client disconnected from global telemetry WebSocket stream.")
    except Exception as e:
        logger.error(f"WebSocket error on global telemetry stream: {e}")
        await pubsub_manager.unsubscribe(topic, websocket)


@router.websocket("/telemetry/{hive_id}")
async def websocket_telemetry_hive(websocket: WebSocket, hive_id: str):
    """
    Connect to real-time telemetry stream for a specific hive.
    """
    await websocket.accept()
    topic = f"hives/{hive_id}/telemetry"
    await pubsub_manager.subscribe(topic, websocket)
    logger.info(f"Client connected to telemetry WebSocket stream for hive {hive_id}.")
    
    try:
        while True:
            data = await websocket.receive_text()
            logger.debug(f"Received message from client for hive {hive_id}: {data}")
    except WebSocketDisconnect:
        await pubsub_manager.unsubscribe(topic, websocket)
        logger.info(f"Client disconnected from telemetry WebSocket stream for hive {hive_id}.")
    except Exception as e:
        logger.error(f"WebSocket error on hive {hive_id} stream: {e}")
        await pubsub_manager.unsubscribe(topic, websocket)
