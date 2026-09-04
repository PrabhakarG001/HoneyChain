import pytest
import os
import pandas as pd
from ml import dataset_config, dataset_manager

# 1. Test HOBOS Dataset Loading & Range Sanity
def test_hobos_dataset_loading_and_range_validation():
    df = dataset_manager.get_hobos_dataset()
    assert isinstance(df, pd.DataFrame)
    assert len(df) >= 10
    assert "temperature_c" in df.columns
    assert "humidity_pct" in df.columns
    assert "weight_kg" in df.columns
    assert (df["temperature_c"] >= 10.0).all() and (df["temperature_c"] <= 55.0).all()
    assert (df["humidity_pct"] >= 10.0).all() and (df["humidity_pct"] <= 100.0).all()

# 2. Test Beehives Supplementary Dataset
def test_beehives_dataset_loading():
    df = dataset_manager.get_beehives_dataset()
    assert isinstance(df, pd.DataFrame)
    assert "temp_c" in df.columns
    assert "humidity_pct" in df.columns
    assert len(df) >= 5

# 3. Test HiveTool Sensor Specs Reference
def test_hivetool_sensor_specifications():
    specs = dataset_manager.get_hivetool_specs()
    assert "sensor_specifications" in specs
    sensors = specs["sensor_specifications"]
    assert "temperature" in sensors
    assert "humidity" in sensors
    assert "weight" in sensors
    assert "acoustics" in sensors
    assert sensors["temperature"]["optimal_min_c"] == 32.0

# 4. Test UrBAN Acoustic Phenotypes Dataset
def test_urban_acoustic_phenotypes_dataset():
    df = dataset_manager.get_urban_dataset()
    assert isinstance(df, pd.DataFrame)
    assert "acoustic_state" in df.columns
    assert "fundamental_freq_hz" in df.columns
    states = set(df["acoustic_state"].unique())
    assert "Calm" in states
    assert "Agitated/Piping" in states
    assert "Queenless Swarming" in states

# 5. Test NU-Hive Acoustic Dataset & Hive-Aware Split Compatibility
def test_nuhive_acoustic_features_hive_aware_split():
    df = dataset_manager.get_nuhive_dataset()
    assert isinstance(df, pd.DataFrame)
    assert "clip_id" in df.columns
    assert "hive_id" in df.columns
    assert "label" in df.columns
    # Ensure hive-aware grouping capability
    hive_counts = df.groupby("hive_id")["clip_id"].count()
    assert (hive_counts >= 1).all()

# 6. Test USDA Honey Production Dataset
def test_usda_honey_production_dataset():
    df = dataset_manager.get_usda_dataset()
    assert isinstance(df, pd.DataFrame)
    assert "state" in df.columns
    assert "year" in df.columns
    assert "yield_per_colony" in df.columns
    assert "total_production_lbs" in df.columns
    assert (df["year"] >= 1995).all()

# 7. Test Full Dataset Audit Suite Execution
def test_full_dataset_audit_suite_execution():
    audit_results = dataset_manager.run_dataset_audit_suite()
    assert len(audit_results) == 6
    for name, data in audit_results.items():
        assert data["status"] == "EXISTS + VERIFIED"

# 8. Test Offline ML Data Path Resolution
def test_offline_ml_dataset_and_inference_integrity():
    assert os.path.exists(dataset_config.HOBOS_DATASET_PATH)
    assert os.path.exists(dataset_config.USDA_HONEY_DATASET_PATH)
    assert os.path.exists(dataset_config.PROCESSED_ANOMALY_PATH)
    assert os.path.exists(dataset_config.PROCESSED_YIELD_PATH)
    assert os.path.exists(dataset_config.PROCESSED_AUDIO_PATH)
