import logging
import json
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from jose import JWTError, jwt
from ..services.pubsub import pubsub_manager
from ..config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ws", tags=["WebSocket"])

def authenticate_ws_token(token: Optional[str]) -> Optional[dict]:
    """Helper to decode JWT token for WebSocket connections."""
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None

@router.websocket("/telemetry")
async def websocket_telemetry_hub(websocket: WebSocket, token: Optional[str] = Query(None)):
    """
    Production Hybrid WebSocket Hub.
    Handles dynamic hive subscriptions, ping-pong heartbeats, and live sensor broadcasts.
    Protocol Messages:
      - Client -> Server: {"type": "subscribe", "hiveId": "HIVE_001"}
      - Client -> Server: {"type": "unsubscribe", "hiveId": "HIVE_001"}
      - Client -> Server: {"type": "ping"}
      - Server -> Client: {"type": "subscription_success", "hiveId": "HIVE_001"}
      - Server -> Client: {"type": "sensor_update", "hiveId": "HIVE_001", "data": {...}}
      - Server -> Client: {"type": "pong", "timestamp": "..."}
    """
    await websocket.accept()
    user_payload = authenticate_ws_token(token)
    user_id = user_payload.get("sub") if user_payload else "anonymous"
    
    # By default, subscribe to global telemetry stream
    default_topic = "hives/all/telemetry"
    await pubsub_manager.subscribe(default_topic, websocket)
    
    logger.info(f"WebSocket client '{user_id}' connected to telemetry hub.")
    
    # Send connection confirmation frame
    await websocket.send_json({
        "type": "connection_established",
        "message": "Connected to HoneyChain Real-Time Telemetry Hub",
        "authenticated": user_payload is not None,
        "timestamp": datetime.utcnow().isoformat()
    })

    try:
        while True:
            raw_data = await websocket.receive_text()
            if not raw_data:
                continue

            try:
                msg = json.loads(raw_data)
            except Exception:
                await websocket.send_json({
                    "type": "error",
                    "message": "Invalid JSON format"
                })
                continue

            msg_type = msg.get("type")

            if msg_type == "ping":
                await websocket.send_json({
                    "type": "pong",
                    "timestamp": datetime.utcnow().isoformat()
                })

            elif msg_type == "subscribe":
                hive_id = msg.get("hiveId") or msg.get("hive_id")
                if not hive_id:
                    await websocket.send_json({
                        "type": "error",
                        "message": "Missing 'hiveId' field for subscription"
                    })
                    continue

                topic = f"hives/{hive_id}/telemetry"
                await pubsub_manager.subscribe(topic, websocket)
                await websocket.send_json({
                    "type": "subscription_success",
                    "hiveId": hive_id,
                    "timestamp": datetime.utcnow().isoformat()
                })

            elif msg_type == "unsubscribe":
                hive_id = msg.get("hiveId") or msg.get("hive_id")
                if hive_id:
                    topic = f"hives/{hive_id}/telemetry"
                    await pubsub_manager.unsubscribe(topic, websocket)
                    await websocket.send_json({
                        "type": "unsubscribe_success",
                        "hiveId": hive_id
                    })

            else:
                logger.debug(f"Received custom message from client '{user_id}': {msg}")

    except WebSocketDisconnect:
        await pubsub_manager.unsubscribe_all(websocket)
        logger.info(f"WebSocket client '{user_id}' disconnected cleanly.")
    except Exception as e:
        logger.error(f"WebSocket error for client '{user_id}': {e}")
        await pubsub_manager.unsubscribe_all(websocket)


@router.websocket("/telemetry/{hive_id}")
async def websocket_telemetry_hive(websocket: WebSocket, hive_id: str, token: Optional[str] = Query(None)):
    """Direct URL WebSocket subscription to a specific hive telemetry stream."""
    await websocket.accept()
    topic = f"hives/{hive_id}/telemetry"
    await pubsub_manager.subscribe(topic, websocket)
    logger.info(f"Direct WebSocket client connected to hive '{hive_id}' stream.")
    
    await websocket.send_json({
        "type": "subscription_success",
        "hiveId": hive_id,
        "timestamp": datetime.utcnow().isoformat()
    })

    try:
        while True:
            raw_data = await websocket.receive_text()
            try:
                msg = json.loads(raw_data)
                if msg.get("type") == "ping":
                    await websocket.send_json({"type": "pong", "timestamp": datetime.utcnow().isoformat()})
            except Exception:
                pass
    except WebSocketDisconnect:
        await pubsub_manager.unsubscribe_all(websocket)
        logger.info(f"Direct WebSocket client disconnected from hive '{hive_id}' stream.")
    except Exception as e:
        logger.error(f"WebSocket error on hive '{hive_id}' stream: {e}")
        await pubsub_manager.unsubscribe_all(websocket)

