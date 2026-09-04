import os

# Base Directories
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_DIR = os.getenv("HONEYCHAIN_DATA_DIR", os.path.join(BASE_DIR, "data"))
RAW_DATA_DIR = os.path.join(DATA_DIR, "raw")
PROCESSED_DATA_DIR = os.path.join(DATA_DIR, "processed")

# Raw Dataset Paths
HOBOS_DATASET_PATH = os.getenv("HOBOS_DATASET_PATH", os.path.join(RAW_DATA_DIR, "hobos", "hobos_hive_metrics_2017_2019.csv"))
BEEHIVES_DATASET_PATH = os.getenv("BEEHIVES_DATASET_PATH", os.path.join(RAW_DATA_DIR, "beehives", "beehives_temp_humidity.csv"))
HIVETOOL_DATASET_PATH = os.getenv("HIVETOOL_DATASET_PATH", os.path.join(RAW_DATA_DIR, "hivetool", "hivetool_sensor_specs.json"))
URBAN_DATASET_PATH = os.getenv("URBAN_DATASET_PATH", os.path.join(RAW_DATA_DIR, "audio", "urban_acoustic_phenotypes.csv"))
NUHIVE_DATASET_PATH = os.getenv("NUHIVE_DATASET_PATH", os.path.join(RAW_DATA_DIR, "audio", "nuhive_acoustic_features.csv"))
USDA_HONEY_DATASET_PATH = os.getenv("USDA_HONEY_DATASET_PATH", os.path.join(RAW_DATA_DIR, "usda", "usda_honey_production_1995_2021.csv"))

# Processed Dataset Paths
PROCESSED_ANOMALY_PATH = os.getenv("PROCESSED_ANOMALY_PATH", os.path.join(PROCESSED_DATA_DIR, "anomaly", "processed_anomaly_features.csv"))
PROCESSED_YIELD_PATH = os.getenv("PROCESSED_YIELD_PATH", os.path.join(PROCESSED_DATA_DIR, "yield", "processed_yield_forecast.csv"))
PROCESSED_AUDIO_PATH = os.getenv("PROCESSED_AUDIO_PATH", os.path.join(PROCESSED_DATA_DIR, "audio", "processed_audio_features.csv"))
