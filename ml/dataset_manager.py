import os
import json
import pandas as pd
import numpy as np
from ml import dataset_config

class DatasetIntegrityError(Exception):
    pass

def verify_and_load_csv(file_path: str, required_columns: list[str], numeric_ranges: dict | None = None) -> pd.DataFrame:
    """
    Verifies and loads a CSV dataset:
    - Checks file existence
    - Validates column presence
    - Computes missing data percentage
    - Validates numeric range bounds
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Dataset file missing: {file_path}")

    df = pd.read_csv(file_path)

    # Validate column presence
    missing_cols = [c for c in required_columns if c not in df.columns]
    if missing_cols:
        raise DatasetIntegrityError(f"Dataset at {file_path} is missing required columns: {missing_cols}")

    # Check missing data percentage
    total_missing = df[required_columns].isnull().sum().sum()
    missing_pct = (total_missing / (len(df) * len(required_columns))) * 100
    if missing_pct > 20.0:
        raise DatasetIntegrityError(f"Dataset at {file_path} exceeds allowable missing threshold: {missing_pct:.1f}%")

    # Range validation for numeric columns
    if numeric_ranges:
        for col, (min_val, max_val) in numeric_ranges.items():
            if col in df.columns:
                col_data = df[col].dropna()
                if (col_data < min_val).any() or (col_data > max_val).any():
                    invalid_count = ((col_data < min_val) | (col_data > max_val)).sum()
                    raise DatasetIntegrityError(
                        f"Dataset {file_path} contains {invalid_count} out-of-bound values in '{col}' "
                        f"(allowed range: [{min_val}, {max_val}])"
                    )

    return df

def get_hobos_dataset() -> pd.DataFrame:
    required = ["timestamp", "hive_id", "temperature_c", "humidity_pct", "weight_kg"]
    ranges = {"temperature_c": (10.0, 55.0), "humidity_pct": (10.0, 100.0), "weight_kg": (10.0, 100.0)}
    return verify_and_load_csv(dataset_config.HOBOS_DATASET_PATH, required, ranges)

def get_beehives_dataset() -> pd.DataFrame:
    required = ["timestamp", "hive_id", "temp_c", "humidity_pct"]
    ranges = {"temp_c": (10.0, 50.0), "humidity_pct": (10.0, 100.0)}
    return verify_and_load_csv(dataset_config.BEEHIVES_DATASET_PATH, required, ranges)

def get_hivetool_specs() -> dict:
    if not os.path.exists(dataset_config.HIVETOOL_DATASET_PATH):
        raise FileNotFoundError(f"HiveTool specs file missing: {dataset_config.HIVETOOL_DATASET_PATH}")
    with open(dataset_config.HIVETOOL_DATASET_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def get_urban_dataset() -> pd.DataFrame:
    required = ["sample_id", "hive_id", "acoustic_state", "fundamental_freq_hz"]
    ranges = {"fundamental_freq_hz": (50.0, 1000.0)}
    return verify_and_load_csv(dataset_config.URBAN_DATASET_PATH, required, ranges)

def get_nuhive_dataset() -> pd.DataFrame:
    required = ["clip_id", "hive_id", "duration_sec", "label"]
    ranges = {"duration_sec": (0.1, 60.0)}
    return verify_and_load_csv(dataset_config.NUHIVE_DATASET_PATH, required, ranges)

def get_usda_dataset() -> pd.DataFrame:
    required = ["state", "year", "num_colonies", "yield_per_colony", "total_production_lbs"]
    ranges = {"year": (1990, 2030), "num_colonies": (100, 10000000), "yield_per_colony": (1, 300)}
    return verify_and_load_csv(dataset_config.USDA_HONEY_DATASET_PATH, required, ranges)

def run_dataset_audit_suite() -> dict:
    """Executes verification and audit checks across all project datasets."""
    results = {}
    
    # 1. HOBOS
    hobos_df = get_hobos_dataset()
    results["HOBOS"] = {
        "status": "EXISTS + VERIFIED",
        "rows": len(hobos_df),
        "columns": list(hobos_df.columns),
        "hives_count": hobos_df["hive_id"].nunique()
    }
    
    # 2. Beehives
    beehives_df = get_beehives_dataset()
    results["Beehives"] = {
        "status": "EXISTS + VERIFIED",
        "rows": len(beehives_df),
        "columns": list(beehives_df.columns)
    }

    # 3. HiveTool
    hivetool_data = get_hivetool_specs()
    results["HiveTool"] = {
        "status": "EXISTS + VERIFIED",
        "specs_keys": list(hivetool_data.get("sensor_specifications", {}).keys())
    }

    # 4. UrBAN
    urban_df = get_urban_dataset()
    results["UrBAN"] = {
        "status": "EXISTS + VERIFIED",
        "rows": len(urban_df),
        "acoustic_states": list(urban_df["acoustic_state"].unique())
    }

    # 5. NU-Hive
    nuhive_df = get_nuhive_dataset()
    results["BeeTogether / NU-Hive"] = {
        "status": "EXISTS + VERIFIED",
        "rows": len(nuhive_df),
        "hives_count": nuhive_df["hive_id"].nunique()
    }

    # 6. USDA
    usda_df = get_usda_dataset()
    results["USDA Honey Production"] = {
        "status": "EXISTS + VERIFIED",
        "rows": len(usda_df),
        "years_span": f"{usda_df['year'].min()}-{usda_df['year'].max()}"
    }

    return results

if __name__ == "__main__":
    audit = run_dataset_audit_suite()
    print("=== HoneyChain Part 10 Dataset Audit Results ===")
    for ds_name, details in audit.items():
        print(f"[{ds_name}]: {details}")
