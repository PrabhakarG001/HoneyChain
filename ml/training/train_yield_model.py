import os
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def train_and_save_yield_model():
    """
    Trains a Random Forest Regressor to forecast seasonal honey extraction yields (kg).
    Features: temp_avg, humidity_avg, hive_weight, brood_count, active_days, historical_yield_avg
    Target: predicted_yield_kg
    """
    dataset_path = os.path.join(os.path.dirname(__file__), 'yield_dataset.csv')

    # Synthetic training dataset generation if CSV missing
    if not os.path.exists(dataset_path):
        print("Generating synthetic honey yield dataset...")
        np.random.seed(42)
        n_samples = 500
        
        temp_avg = np.random.uniform(25.0, 38.0, n_samples)
        humidity_avg = np.random.uniform(40.0, 75.0, n_samples)
        hive_weight = np.random.uniform(20.0, 50.0, n_samples)
        brood_count = np.random.randint(5000, 35000, n_samples)
        active_days = np.random.randint(15, 120, n_samples)
        historical_yield_avg = np.random.uniform(10.0, 45.0, n_samples)
        
        # Target formula with non-linear relationships & noise
        yield_kg = (
            (hive_weight * 0.45) + 
            (historical_yield_avg * 0.35) + 
            (brood_count / 1500.0) + 
            (active_days * 0.08) - 
            (np.abs(temp_avg - 32.0) * 0.5) + 
            np.random.normal(0, 2.0, n_samples)
        )
        yield_kg = np.clip(yield_kg, 5.0, 60.0)
        
        df = pd.DataFrame({
            "temp_avg": temp_avg,
            "humidity_avg": humidity_avg,
            "hive_weight": hive_weight,
            "brood_count": brood_count,
            "active_days": active_days,
            "historical_yield_avg": historical_yield_avg,
            "yield_kg": yield_kg
        })
        df.to_csv(dataset_path, index=False)
        print(f"Dataset generated at {dataset_path}")
    else:
        df = pd.read_csv(dataset_path)

    features = ['temp_avg', 'humidity_avg', 'hive_weight', 'brood_count', 'active_days', 'historical_yield_avg']
    X = df[features]
    y = df['yield_kg']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training Random Forest Yield Regressor...")
    model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate
    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    rmse = np.sqrt(mean_squared_error(y_test, preds))
    r2 = r2_score(y_test, preds)

    print(f"Model Evaluation -> MAE: {mae:.2f} kg, RMSE: {rmse:.2f} kg, R^2 Score: {r2:.3f}")

    models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
    os.makedirs(models_dir, exist_ok=True)

    model_path = os.path.join(models_dir, 'yield_forecaster.joblib')
    joblib.dump(model, model_path)
    print(f"Yield Forecasting model saved to {model_path}")

if __name__ == "__main__":
    train_and_save_yield_model()
