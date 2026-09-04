"""
HoneyChain — Demo Telemetry Replay Worker (Part 20 & Part 24 Demo Resilience)

Simulates live ESP32 IoT sensor telemetry streaming for hackathons, testing,
and offline demonstration fallback. Generates realistic telemetry streams:
1. Normal operating conditions (Hive temperature 35.0 C, Humidity 52%, Weight 42kg)
2. Heat spike / Temperature anomaly trigger (Temp 41.5 C -> triggers Isolation Forest & Hybrid Risk)
3. Sudden weight loss / Swarming anomaly trigger (Weight drop 42kg -> 36kg -> triggers high risk alert)

Usage:
  python scripts/demo_telemetry_replay.py --hive-id HV_E2E_01 --interval 2
"""

import time
import json
import argparse
import requests
import datetime

DEFAULT_API_URL = "http://127.0.0.1:8000"

REPLAY_SEQUENCE = [
    {"phase": "NORMAL", "temperature_c": 34.8, "humidity_pct": 51.5, "weight_kg": 42.0, "sound_level_db": 38.5},
    {"phase": "NORMAL", "temperature_c": 35.2, "humidity_pct": 50.8, "weight_kg": 42.1, "sound_level_db": 39.0},
    {"phase": "TEMP_HEAT_SPIKE", "temperature_c": 41.5, "humidity_pct": 68.0, "weight_kg": 42.0, "sound_level_db": 55.0}, # High temp anomaly
    {"phase": "SWARMING_WEIGHT_DROP", "temperature_c": 36.5, "humidity_pct": 55.0, "weight_kg": 35.5, "sound_level_db": 62.0}, # Sudden weight drop
    {"phase": "RECOVERY", "temperature_c": 35.0, "humidity_pct": 52.0, "weight_kg": 35.6, "sound_level_db": 40.0},
]

def run_replay(hive_id: str, api_url: str, interval: int):
    print(f"==================================================")
    print(f"🐝 HoneyChain Demo Telemetry Replay Worker")
    print(f"Target Hive ID: {hive_id}")
    print(f"API Backend: {api_url}")
    print(f"Replay Interval: {interval} seconds")
    print(f"==================================================")

    for idx, step in enumerate(REPLAY_SEQUENCE, 1):
        payload = {
            "hive_id": hive_id,
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "temperature_c": step["temperature_c"],
            "humidity_pct": step["humidity_pct"],
            "weight_kg": step["weight_kg"],
            "sound_level_db": step["sound_level_db"]
        }

        print(f"\n[Step {idx}/{len(REPLAY_SEQUENCE)}] Phase: {step['phase']}")
        print(f"Payload: Temp={step['temperature_c']}C, Humidity={step['humidity_pct']}%, Weight={step['weight_kg']}kg, Sound={step['sound_level_db']}dB")

        # Post reading to backend /hives/{hive_id}/readings
        try:
            url = f"{api_url}/hives/{hive_id}/readings"
            resp = requests.post(url, json=payload, timeout=5)
            if resp.status_code in [200, 201]:
                data = resp.json()
                print(f"--> Posted to DB & ML Pipeline: {data.get('message', 'Success')}")
            else:
                print(f"--> Notice: HTTP {resp.status_code}: {resp.text}")
        except Exception as err:
            print(f"--> Replay Mode Local Execution Notice: {err}")

        # Fetch updated AI risk score
        try:
            analysis_url = f"{api_url}/analysis/hive/{hive_id}"
            a_resp = requests.get(analysis_url, timeout=5)
            if a_resp.status_code == 200:
                a_data = a_resp.json()
                print(f"--> AI Risk Score: {a_data.get('score')} | Status: {a_data.get('status')} | Contributor: {a_data.get('highest_contributor')}")
        except Exception:
            pass

        time.sleep(interval)

    print("\n✅ Telemetry Replay Sequence Complete!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="HoneyChain Telemetry Replay Worker")
    parser.add_argument("--hive-id", default="HV_E2E_01", help="Target Hive ID for replay stream")
    parser.add_argument("--api-url", default=DEFAULT_API_URL, help="FastAPI backend base URL")
    parser.add_argument("--interval", type=int, default=2, help="Seconds between telemetry emissions")
    args = parser.parse_args()

    run_replay(args.hive_id, args.api_url, args.interval)
