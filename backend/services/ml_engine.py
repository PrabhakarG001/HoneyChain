import os
import joblib
import numpy as np
from sklearn.ensemble import IsolationForest
from ..config import settings
import logging

logger = logging.getLogger(__name__)

def setup_dummy_model():
    if not os.path.exists(settings.MODEL_PATH):
        logger.info(f"Training dummy IsolationForest model and saving to {settings.MODEL_PATH}")
        # Create some dummy training data
        # Features: weight_delta, temp_dev, humidity_dev
        X_train = np.random.normal(loc=0.0, scale=1.0, size=(100, 3))
        
        clf = IsolationForest(random_state=42, contamination=0.1)
        clf.fit(X_train)
        joblib.dump(clf, settings.MODEL_PATH)

# Ensure model exists
setup_dummy_model()

try:
    if_model = joblib.load(settings.MODEL_PATH)
except Exception as e:
    logger.error(f"Failed to load ML model: {e}")
    if_model = None

def calculate_hybrid_risk(weight_delta: float, temp_dev: float, humidity_dev: float) -> dict:
    """
    Score = (0.4 * norm(temp_dev)) + (0.3 * norm(humidity_dev)) + (0.2 * norm(weight_anomaly)) + (0.1 * norm(IF_score))
    < 0.3: Normal
    0.3 - 0.6: Attention Required
    > 0.6: High Risk
    """
    # Normalize features (dummy normalization for demo)
    norm_temp = min(abs(temp_dev) / 10.0, 1.0)
    norm_hum = min(abs(humidity_dev) / 30.0, 1.0)
    norm_weight = min(abs(weight_delta) / 5.0, 1.0)
    
    # Get IF score if model loaded
    if_score_norm = 0.0
    if if_model:
        # predict returns 1 for inlier, -1 for outlier. We want anomaly score.
        score = if_model.decision_function(np.array([[weight_delta, temp_dev, humidity_dev]]))
        # score is between -0.5 and 0.5 roughly. Lower is more anomalous.
        if_score_norm = max(0.0, min(0.5 - score[0], 1.0))
        
    hybrid_score = (0.4 * norm_temp) + (0.3 * norm_hum) + (0.2 * norm_weight) + (0.1 * if_score_norm)
    
    if hybrid_score < 0.3:
        status = "Normal"
    elif hybrid_score <= 0.6:
        status = "Attention Required"
    else:
        status = "High Risk"
        
    # Determine highest contributor
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
