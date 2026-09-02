import pytest
from ml.inference.ml_engine import calculate_hybrid_risk

def test_ml_inference_normal_reading():
    result = calculate_hybrid_risk(weight_delta=0.0, temp_dev=0.1, humidity_dev=-0.5)
    assert "score" in result
    assert "status" in result
    assert result["status"] == "Normal"

def test_ml_inference_anomalous_reading():
    result = calculate_hybrid_risk(weight_delta=-4.8, temp_dev=8.5, humidity_dev=25.0)
    assert "score" in result
    assert result["status"] == "High Risk"
    assert result["highest_contributor"] != "None"
