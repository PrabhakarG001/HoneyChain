import os
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.model_selection import train_test_split
from ml.features.feature_pipeline import engineer_hive_features

def train_and_save_anomaly_model():
    """
    Trains an Isolation Forest anomaly detection model on engineered sensor features:
    temperature_c, humidity_pct, weight_kg, weight_delta_5min, hour_of_day, 
    temp_deviation_from_7day_avg, humidity_deviation_from_7day_avg
    """
    dataset_path = os.path.join(os.path.dirname(__file__), 'dataset.csv')
    
    # Generate synthetic time-series if dataset CSV does not contain all columns
    if os.path.exists(dataset_path):
        df_raw = pd.read_csv(dataset_path)
    else:
        df_raw = pd.DataFrame()

    if df_raw.empty or 'temperature_c' not in df_raw.columns:
        print("Generating comprehensive HOBOS-aligned sensor time-series dataset...")
        np.random.seed(42)
        n_samples = 1000
        timestamps = pd.date_range(end=pd.Timestamp.now(), periods=n_samples, freq='5min')
        
        # Base physical sensor metrics with periodic daily thermal cycles
        hours = np.array(timestamps.hour)
        temp_base = 35.0 + 2.0 * np.sin(2 * np.pi * hours / 24.0)
        temp_noise = np.random.normal(0, 0.5, n_samples)
        temperature_c = np.array(temp_base + temp_noise, dtype=float)
        
        hum_base = 50.0 - 5.0 * np.sin(2 * np.pi * hours / 24.0)
        humidity_pct = np.array(hum_base + np.random.normal(0, 1.0, n_samples), dtype=float)
        
        weight_kg = np.array(30.0 + np.cumsum(np.random.normal(0.01, 0.05, n_samples)), dtype=float)
        
        # Inject 3% physical anomalies (swarming weight drops, thermal distress spikes)
        anomaly_indices = np.random.choice(n_samples, size=int(0.03 * n_samples), replace=False)
        for idx in anomaly_indices:
            if idx % 2 == 0:
                temperature_c[idx] += np.random.uniform(7.0, 12.0)
                weight_kg[idx] -= np.random.uniform(3.0, 6.0) # Swarming drop
            else:
                humidity_pct[idx] += np.random.uniform(20.0, 35.0) # Moisture collapse

        df_raw = pd.DataFrame({
            'hive_id': 'HIVE_MODEL_01',
            'timestamp': timestamps,
            'temperature_c': temperature_c,
            'humidity_pct': humidity_pct,
            'weight_kg': weight_kg
        })
        df_raw.to_csv(dataset_path, index=False)
        print(f"Dataset generated and saved to {dataset_path}")

    # Run feature engineering pipeline
    df_engineered = engineer_hive_features(df_raw)

    feature_cols = [
        'temperature_c', 'humidity_pct', 'weight_kg', 
        'weight_delta_5min', 'hour_of_day', 
        'temp_deviation_from_7day_avg', 'humidity_deviation_from_7day_avg'
    ]
    
    X = df_engineered[feature_cols].dropna()
    print(f"Feature engineering complete. Total training samples: {len(X)}")

    X_train, X_test = train_test_split(X, test_size=0.2, random_state=42)

    print("Training IsolationForest(contamination=0.03, random_state=42)...")
    model = IsolationForest(contamination=0.03, random_state=42)
    model.fit(X_train)

    # Save trained model to predictable paths
    models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    path_primary = os.path.join(models_dir, 'hive_anomaly_model.joblib')
    path_secondary = os.path.join(models_dir, 'isolation_forest.joblib')
    
    joblib.dump(model, path_primary)
    joblib.dump(model, path_secondary)
    print(f"Model successfully saved to {path_primary} and {path_secondary}")

if __name__ == "__main__":
    train_and_save_anomaly_model()
