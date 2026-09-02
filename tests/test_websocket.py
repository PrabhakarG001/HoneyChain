import pytest
import asyncio
from fastapi.testclient import TestClient

def test_websocket_telemetry_stream(client):
    with client.websocket_connect("/ws/telemetry") as websocket:
        # Test sending a ping or text to server over websocket connection
        websocket.send_text("ping")
        assert websocket is not None

def test_websocket_hive_telemetry_stream(client):
    with client.websocket_connect("/ws/telemetry/HV-UP-001") as websocket:
        websocket.send_text("hello hive")
        assert websocket is not None
