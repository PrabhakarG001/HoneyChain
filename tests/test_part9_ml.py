import pytest
import os
from datetime import datetime
from backend import models
from ml.inference.ml_engine import calculate_hybrid_risk, load_model
from ml.inference.yield_engine import predict_honey_yield
from ml.training.evaluate_models import evaluate_anomaly_model, evaluate_yield_model

# 1. Test Isolation Forest Anomaly Model Loading
def test_isolation_forest_model_loading():
    model = load_model()
    assert model is not None, "Isolation Forest joblib model should load successfully"

# 2. Test Enhanced Hybrid Risk Calculation & Diagnostic Explanations
def test_hybrid_risk_calculation_details():
    # Test Normal conditions
    normal_res = calculate_hybrid_risk(weight_delta=0.0, temp_dev=0.2, humidity_dev=0.5, sound_level_db=40.0)
    assert normal_res["status"] == "Normal"
    assert normal_res["score"] < 0.30
    assert "factor_breakdown" in normal_res
    assert "explanation" in normal_res
    assert "recommendation" in normal_res

    # Test High Risk conditions with temperature spike and acoustic disturbance
    high_risk_res = calculate_hybrid_risk(weight_delta=-4.5, temp_dev=9.0, humidity_dev=25.0, sound_level_db=60.0)
    assert high_risk_res["status"] == "High Risk"
    assert high_risk_res["score"] > 0.60
    assert high_risk_res["highest_contributor"] != "None"
    assert "temperature" in high_risk_res["explanation"].lower() or "weight" in high_risk_res["explanation"].lower()

# 3. Test Honey Yield Forecasting Model Engine
def test_yield_forecaster_engine():
    res = predict_honey_yield(
        temp_avg=31.5,
        humidity_avg=55.0,
        hive_weight=42.0,
        brood_count=25000,
        active_days=60,
        historical_yield_avg=30.0
    )
    assert "predicted_yield_kg" in res
    assert res["predicted_yield_kg"] > 10.0
    assert "confidence_score_pct" in res
    assert "optimal_harvest_window" in res
    assert "start_date" in res["optimal_harvest_window"]
    assert "end_date" in res["optimal_harvest_window"]

# 4. Test Model Evaluation Suite Execution
def test_model_evaluation_metrics():
    anomaly_eval = evaluate_anomaly_model()
    assert "precision" in anomaly_eval
    assert "recall" in anomaly_eval
    assert "f1_score" in anomaly_eval

    yield_eval = evaluate_yield_model()
    assert "mae_kg" in yield_eval
    assert "rmse_kg" in yield_eval
    assert "r2_score" in yield_eval
    assert yield_eval["r2_score"] >= 0.70

# 5. Test API Endpoints for Anomaly, Yield, & Evaluation
def test_ml_api_endpoints(client, db, beekeeper_auth_headers, test_beekeeper_user):
    hive = models.Hive(id="HV_ML_001", owner_id=test_beekeeper_user.id, name="ML Test Hive")
    db.add(hive)
    db.commit()

    reading = models.SensorReading(
        hive_id="HV_ML_001",
        timestamp=datetime.utcnow(),
        temperature_c=36.5,
        humidity_pct=52.0,
        weight_kg=38.0,
        sound_level_db=42.0
    )
    db.add(reading)
    db.commit()

    # Hive Analysis endpoint
    analysis_resp = client.get("/analysis/hive/HV_ML_001")
    assert analysis_resp.status_code == 200
    data = analysis_resp.json()
    assert data["hive_id"] == "HV_ML_001"
    assert "status" in data
    assert "score" in data

    # Yield Forecast endpoint
    yield_resp = client.get("/analysis/yield-forecast/HV_ML_001")
    assert yield_resp.status_code == 200
    y_data = yield_resp.json()
    assert "predicted_yield_kg" in y_data
    assert "optimal_harvest_window" in y_data

    # Models evaluation endpoint
    eval_resp = client.get("/analysis/models/eval")
    assert eval_resp.status_code == 200
    e_data = eval_resp.json()
    assert e_data["status"] == "Success"
    assert "anomaly_detection_metrics" in e_data
    assert "yield_forecaster_metrics" in e_data

    # Hive router integration endpoints
    h_analysis = client.get("/hives/HV_ML_001/analysis", headers=beekeeper_auth_headers)
    assert h_analysis.status_code == 200

    h_yield = client.get("/hives/HV_ML_001/yield-forecast", headers=beekeeper_auth_headers)
    assert h_yield.status_code == 200
