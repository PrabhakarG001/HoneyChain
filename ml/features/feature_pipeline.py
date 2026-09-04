import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Any, Union

def engineer_hive_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Feature engineering pipeline for hive IoT sensor time-series.
    Calculates:
    - temperature_c, humidity_pct, weight_kg
    - weight_delta_5min (short-term weight change)
    - hour_of_day (diurnal cycle feature 0-23)
    - temp_deviation_from_7day_avg (hive-specific temperature baseline deviation)
    - humidity_deviation_from_7day_avg (hive-specific humidity baseline deviation)
    - rolling_weight_mean & rolling_weight_std
    """
    if df.empty:
        return df

    data = df.copy()

    # Ensure timestamp column is datetime and sorted chronologically
    if 'timestamp' in data.columns:
        data['timestamp'] = pd.to_datetime(data['timestamp'])
        data = data.sort_values(by=['hive_id', 'timestamp'] if 'hive_id' in data.columns else 'timestamp')

    # Hour of day (0-23)
    if 'timestamp' in data.columns:
        data['hour_of_day'] = data['timestamp'].dt.hour
    else:
        data['hour_of_day'] = 12

    # Standard feature names alignment
    temp_col = 'temperature_c' if 'temperature_c' in data.columns else ('temp' if 'temp' in data.columns else None)
    hum_col = 'humidity_pct' if 'humidity_pct' in data.columns else ('humidity' if 'humidity' in data.columns else None)
    weight_col = 'weight_kg' if 'weight_kg' in data.columns else ('weight' if 'weight' in data.columns else None)

    if temp_col:
        data['temperature_c'] = data[temp_col].astype(float)
    else:
        data['temperature_c'] = 35.0

    if hum_col:
        data['humidity_pct'] = data[hum_col].astype(float)
    else:
        data['humidity_pct'] = 50.0

    if weight_col:
        data['weight_kg'] = data[weight_col].astype(float)
    else:
        data['weight_kg'] = 30.0

    # Group by hive_id if available to prevent cross-hive contamination
    if 'hive_id' in data.columns:
        grouped = data.groupby('hive_id')
        data['weight_delta_5min'] = grouped['weight_kg'].diff().fillna(0.0)
        
        # 7-day (or rolling 100-sample) baseline averages per hive
        temp_7d_avg = grouped['temperature_c'].transform(lambda x: x.rolling(window=100, min_periods=1).mean())
        hum_7d_avg = grouped['humidity_pct'].transform(lambda x: x.rolling(window=100, min_periods=1).mean())
        
        data['rolling_weight_mean'] = grouped['weight_kg'].transform(lambda x: x.rolling(window=10, min_periods=1).mean())
        data['rolling_weight_std'] = grouped['weight_kg'].transform(lambda x: x.rolling(window=10, min_periods=1).std()).fillna(0.0)
    else:
        data['weight_delta_5min'] = data['weight_kg'].diff().fillna(0.0)
        temp_7d_avg = data['temperature_c'].rolling(window=100, min_periods=1).mean()
        hum_7d_avg = data['humidity_pct'].rolling(window=100, min_periods=1).mean()
        data['rolling_weight_mean'] = data['weight_kg'].rolling(window=10, min_periods=1).mean()
        data['rolling_weight_std'] = data['weight_kg'].rolling(window=10, min_periods=1).std().fillna(0.0)

    data['temp_deviation_from_7day_avg'] = data['temperature_c'] - temp_7d_avg
    data['humidity_deviation_from_7day_avg'] = data['humidity_pct'] - hum_7d_avg

    # Fill any remaining NaNs cleanly
    data['temp_deviation_from_7day_avg'] = data['temp_deviation_from_7day_avg'].fillna(0.0)
    data['humidity_deviation_from_7day_avg'] = data['humidity_deviation_from_7day_avg'].fillna(0.0)
    data['weight_delta_5min'] = data['weight_delta_5min'].fillna(0.0)

    return data

def extract_single_reading_features(
    temperature_c: float,
    humidity_pct: float,
    weight_kg: float,
    prev_weight_kg: float = None,
    avg_temp_7d: float = 35.0,
    avg_hum_7d: float = 50.0,
    timestamp: datetime = None
) -> pd.DataFrame:
    """Extracts engineered feature vector for a single incoming IoT reading."""
    ts = timestamp or datetime.utcnow()
    hour = ts.hour
    weight_delta = (weight_kg - prev_weight_kg) if prev_weight_kg is not None else 0.0
    temp_dev = temperature_c - avg_temp_7d
    hum_dev = humidity_pct - avg_hum_7d

    feature_dict = {
        'temperature_c': [temperature_c],
        'humidity_pct': [humidity_pct],
        'weight_kg': [weight_kg],
        'weight_delta_5min': [weight_delta],
        'hour_of_day': [hour],
        'temp_deviation_from_7day_avg': [temp_dev],
        'humidity_deviation_from_7day_avg': [hum_dev]
    }
    return pd.DataFrame(feature_dict)
