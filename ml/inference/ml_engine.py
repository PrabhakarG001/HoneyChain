import os
import joblib
import numpy as np
import pandas as pd
import logging

logger = logging.getLogger(__name__)

# Model path definition
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
    logger.warning(f"ML Model not found at {MODEL_PATH}. Inference will fallback to rule engine.")
    if_model = None

def calculate_hybrid_risk(
    weight_delta: float = 0.0, 
    temp_dev: float = 0.0, 
    humidity_dev: float = 0.0,
    sound_level_db: float = 40.0
) -> dict:
    """
    Enhanced Hybrid Anomaly Risk Engine.
    Combines Isolation Forest ML anomaly scoring with domain-specific physical rules,
    factor contribution breakdown, diagnostic explanations, and actionable recommendations.
    """
    global if_model
    if if_model is None:
        if_model = load_model()

    # Rule-based metric normalization
    norm_temp = min(abs(temp_dev) / 10.0, 1.0)
    norm_hum = min(abs(humidity_dev) / 30.0, 1.0)
    norm_weight = min(abs(weight_delta) / 5.0, 1.0)
    sound_dev = max(0.0, sound_level_db - 45.0) / 30.0 # Elevated sound > 45 dB indicates disturbance
    norm_sound = min(sound_dev, 1.0)

    # ML Isolation Forest inference
    if_score_norm = 0.0
    if if_model:
        try:
            input_df = pd.DataFrame([[weight_delta, temp_dev, humidity_dev]], columns=['weight_delta', 'temp_dev', 'humidity_dev'])
            score = if_model.decision_function(input_df)
            if_score_norm = max(0.0, min(0.5 - score[0], 1.0))
        except Exception as err:
            logger.warning(f"Isolation Forest inference notice: {err}")
            if_score_norm = max(norm_temp, norm_weight)

    # Weighted Hybrid Score calculation
    hybrid_score = (0.35 * norm_temp) + (0.25 * norm_hum) + (0.20 * norm_weight) + (0.10 * norm_sound) + (0.10 * if_score_norm)
    hybrid_score = round(min(1.0, max(0.0, hybrid_score)), 2)

    # Determine status level
    if hybrid_score < 0.30:
        status = "Normal"
    elif hybrid_score <= 0.60:
        status = "Attention Required"
    else:
        status = "High Risk"

    # Factor contribution breakdown
    factors = {
        "Temperature Deviation": round(0.35 * norm_temp, 3),
        "Humidity Deviation": round(0.25 * norm_hum, 3),
        "Weight Anomaly": round(0.20 * norm_weight, 3),
        "Acoustic Disturbance": round(0.10 * norm_sound, 3),
        "ML Isolation Score": round(0.10 * if_score_norm, 3)
    }
    highest_factor = max(factors, key=factors.get) if hybrid_score >= 0.30 else "None"

    # Generate diagnostic explanations & recommendations
    explanations = []
    recommendations = []

    if abs(temp_dev) > 3.0:
        explanations.append(f"Temperature is deviating by {temp_dev:+.1f}°C from optimal target (35.0°C).")
        recommendations.append("Inspect hive ventilation and shade coverage.")

    if abs(weight_delta) > 2.0:
        explanations.append(f"Sudden weight change of {weight_delta:+.1f} kg detected.")
        if weight_delta < -2.0:
            recommendations.append("Possible swarm event or honey robbing. Perform immediate frame inspection.")
        else:
            recommendations.append("Significant nectar flow in progress. Prepare additional honey supers.")

    if sound_level_db > 55.0:
        explanations.append(f"Elevated acoustic frequency level ({sound_level_db:.1f} dB).")
        recommendations.append("Check for queenlessness piping or colony agitation.")

    if not explanations:
        explanations.append("All physical metrics and ML isolation scores are within normal optimal parameters.")
        recommendations.append("Routine hive maintenance schedules apply.")

    return {
        "score": hybrid_score,
        "status": status,
        "highest_contributor": highest_factor,
        "factor_breakdown": factors,
        "explanation": " ".join(explanations),
        "recommendation": " ".join(recommendations),
        "metrics_summary": {
            "weight_delta_kg": weight_delta,
            "temp_dev_c": temp_dev,
            "humidity_dev_pct": humidity_dev,
            "sound_level_db": sound_level_db
        }
    }
