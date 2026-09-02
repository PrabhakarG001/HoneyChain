import os
import joblib
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.model_selection import train_test_split

def train_and_save_model():
    dataset_path = os.path.join(os.path.dirname(__file__), 'dataset.csv')
    
    if not os.path.exists(dataset_path):
        print(f"Dataset not found at {dataset_path}. Please provide a valid CSV dataset.")
        print("Expected format: hive_id, timestamp, weight_delta, temp_dev, humidity_dev")
        print("Skipping ML training. Inference will be unavailable until a model is trained.")
        return

    print("Loading dataset...")
    df = pd.read_csv(dataset_path)
    
    # Expected Features
    features = ['weight_delta', 'temp_dev', 'humidity_dev']
    if not all(col in df.columns for col in features):
        print(f"Dataset is missing required columns. Expected: {features}")
        return

    X = df[features].dropna()
    
    print(f"Dataset loaded. Total samples: {len(X)}")
    X_train, X_test = train_test_split(X, test_size=0.2, random_state=42)

    print("Training Isolation Forest model...")
    model = IsolationForest(contamination=0.1, random_state=42)
    model.fit(X_train)
    
    # Save the model
    models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    model_path = os.path.join(models_dir, 'isolation_forest.joblib')
    joblib.dump(model, model_path)
    print(f"Model trained successfully and saved to {model_path}")

if __name__ == "__main__":
    train_and_save_model()
