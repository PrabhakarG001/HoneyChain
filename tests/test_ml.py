import os
import pytest
from ml.inference import ml_engine
from ml.training import train_anomaly_model

def test_ml_model_training_and_saving(tmp_path):
    # Verify trained model file exists
    assert os.path.exists(ml_engine.MODEL_PATH)
    assert ml_engine.if_model is not None

def test_calculate_hybrid_risk_normal():
    # Normal temperature (dev=0), normal humidity (dev=0), normal weight (delta=0)
    result = ml_engine.calculate_hybrid_risk(weight_delta=0.0, temp_dev=0.0, humidity_dev=0.0)
    assert "score" in result
    assert "status" in result
    assert "highest_contributor" in result
    assert result["status"] in ["Normal", "Attention Required"]
    assert result["score"] is not None

def test_calculate_hybrid_risk_high_risk():
    # Large temperature deviation (+10C), humidity deviation (+30%), weight drop (-5kg)
    result = ml_engine.calculate_hybrid_risk(weight_delta=-5.0, temp_dev=10.0, humidity_dev=30.0)
    assert result["status"] == "High Risk"
    assert result["score"] > 0.6
    assert result["highest_contributor"] != "None"

def test_calculate_hybrid_risk_missing_model(monkeypatch):
    # Simulate missing ML model
    monkeypatch.setattr(ml_engine, "if_model", None)
    monkeypatch.setattr(ml_engine, "load_model", lambda: None)
    result = ml_engine.calculate_hybrid_risk(weight_delta=0.0, temp_dev=0.0, humidity_dev=0.0)
    assert result["score"] is None
    assert result["status"] == "AI analysis unavailable"
    assert result["highest_contributor"] == "None"
