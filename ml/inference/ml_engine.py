import os
import joblib
import numpy as np
import logging

logger = logging.getLogger(__name__)

# The model path should be loaded from env or config
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'isolation_forest.joblib')

def load_model():
    global if_model
    if os.path.exists(MODEL_PATH):
        try:
            if_model = joblib.load(MODEL_PATH)
            return if_model
        except Exception as e:
            logger.warning(f"Error loading ML model: {e}")
    return None

try:
    if_model = load_model()
    if if_model:
        logger.info("ML Anomaly Detection Model loaded successfully.")
except Exception as e:
    logger.warning(f"ML Model not found at {MODEL_PATH}. Inference will return 'AI analysis unavailable'.")
    if_model = None

def calculate_hybrid_risk(weight_delta: float, temp_dev: float, humidity_dev: float) -> dict:
    global if_model
    if if_model is None:
        if_model = load_model()

    if not if_model:
        return {
            "score": None,
            "status": "AI analysis unavailable",
            "highest_contributor": "None"
        }
        
    """
    Score = (0.4 * norm(temp_dev)) + (0.3 * norm(humidity_dev)) + (0.2 * norm(weight_anomaly)) + (0.1 * norm(IF_score))
    < 0.3: Normal
    0.3 - 0.6: Attention Required
    > 0.6: High Risk
    """
    norm_temp = min(abs(temp_dev) / 10.0, 1.0)
    norm_hum = min(abs(humidity_dev) / 30.0, 1.0)
    norm_weight = min(abs(weight_delta) / 5.0, 1.0)
    
    score = if_model.decision_function(np.array([[weight_delta, temp_dev, humidity_dev]]))
    if_score_norm = max(0.0, min(0.5 - score[0], 1.0))
        
    hybrid_score = (0.4 * norm_temp) + (0.3 * norm_hum) + (0.2 * norm_weight) + (0.1 * if_score_norm)
    
    if hybrid_score < 0.3:
        status = "Normal"
    elif hybrid_score <= 0.6:
        status = "Attention Required"
    else:
        status = "High Risk"
        
    factors = {
        "Temperature Deviation": 0.4 * norm_temp,
        "Humidity Deviation": 0.3 * norm_hum,
        "Weight Anomaly": 0.2 * norm_weight,
        "ML Isolation Score": 0.1 * if_score_norm
    }
    highest_factor = max(factors, key=factors.get)
    
    return {
        "score": round(hybrid_score, 2),
        "status": status,
        "highest_contributor": highest_factor if hybrid_score >= 0.3 else "None"
    }
