import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock
from backend.services.pubsub import PubSubManager

@pytest.mark.asyncio
async def test_pubsub_manager_subscribe_publish_unsubscribe():
    pubsub = PubSubManager()
    topic = "hives/HV-WS-001/telemetry"
    
    mock_ws = AsyncMock()
    
    # Subscribe
    await pubsub.subscribe(topic, mock_ws)
    assert topic in pubsub.topics
    assert mock_ws in pubsub.topics[topic]
    
    # Publish message
    message = {"hive_id": "HV-WS-001", "temperature": 35.0, "humidity": 50.0}
    await pubsub.publish(topic, message)
    mock_ws.send_json.assert_called_once_with(message)
    
    # Unsubscribe
    await pubsub.unsubscribe(topic, mock_ws)
    assert topic not in pubsub.topics

@pytest.mark.asyncio
async def test_pubsub_manager_handles_closed_websocket():
    pubsub = PubSubManager()
    topic = "hives/HV-WS-002/telemetry"
    
    failing_ws = AsyncMock()
    failing_ws.send_json.side_effect = Exception("WebSocket closed")
    
    await pubsub.subscribe(topic, failing_ws)
    assert failing_ws in pubsub.topics[topic]
    
    # Publish should catch exception and unsubscribe failing_ws
    await pubsub.publish(topic, {"data": "test"})
    assert topic not in pubsub.topics

def test_websocket_hive_live_stream_connect(client):
    hive_id = "HV-TEST-WS"
    with client.websocket_connect(f"/hives/{hive_id}/live") as websocket:
        # Connection accepted successfully
        assert websocket is not None
