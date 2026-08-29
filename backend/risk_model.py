from typing import Any

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)


def build_grid_prediction_dataset(df: pd.DataFrame) -> pd.DataFrame:
    """
    Aggregates incident records into spatial grid cells (~1km x 1km) and builds 
    a supervised dataset for risk prediction based on historical density.
    """
    # Create ~1km spatial grid (0.01 degrees)
    grid_size = 0.01
    df["grid_lat"] = np.round(df["lat"] / grid_size) * grid_size
    df["grid_lng"] = np.round(df["lng"] / grid_size) * grid_size
    df["grid_id"] = df["grid_lat"].round(3).astype(str) + "_" + df["grid_lng"].round(3).astype(str)

    # We assume 'Property' and 'Violent' are loosely identifiable from primary_type
    # This is a heuristic mapping for demonstration; ideally driven by a master config
    violent_types = ["BATTERY", "ASSAULT", "ROBBERY", "HOMICIDE", "CRIM SEXUAL ASSAULT"]
    
    df["is_violent"] = df["primary_type"].isin(violent_types).astype(int)
    df["is_night_int"] = df["is_night"].astype(int)
    df["is_weekend_int"] = df["is_weekend"].astype(int)

    grid_summary = df.groupby(["grid_id", "grid_lat", "grid_lng"]).agg(
        total_crimes=("id", "count"),
        violent_crimes=("is_violent", "sum"),
        night_crimes=("is_night_int", "sum"),
        weekend_crimes=("is_weekend_int", "sum")
    ).reset_index()

    # Ratios
    grid_summary["violent_ratio"] = grid_summary["violent_crimes"] / (grid_summary["total_crimes"] + 1e-5)
    grid_summary["night_ratio"] = grid_summary["night_crimes"] / (grid_summary["total_crimes"] + 1e-5)
    grid_summary["weekend_ratio"] = grid_summary["weekend_crimes"] / (grid_summary["total_crimes"] + 1e-5)

    # Target Labeling based on historical quantiles
    q33 = grid_summary["total_crimes"].quantile(0.33)
    q66 = grid_summary["total_crimes"].quantile(0.66)

    def assign_risk(count):
        if count >= q66:
            return "High Risk"
        elif count >= q33:
            return "Medium Risk"
        else:
            return "Low Risk"

    grid_summary["risk_class"] = grid_summary["total_crimes"].apply(assign_risk)
    
    return grid_summary


def run_risk_prediction_pipeline(crimes_data: list[dict[str, Any]]) -> dict[str, Any]:
    """
    Full pipeline: Preprocessing -> Grid Aggregation -> Split -> Train -> Evaluate.
    """
    df = pd.DataFrame(crimes_data)

    if df.empty:
        raise ValueError("Cannot run prediction on empty dataset.")

    # 1. Build Grid Dataset
    grid_df = build_grid_prediction_dataset(df)
    
    # 2. Features and Target
    features = [
        "grid_lat",
        "grid_lng",
        "total_crimes",
        "violent_ratio",
        "night_ratio",
        "weekend_ratio"
    ]
    
    X = grid_df[features]
    y = grid_df["risk_class"]

    # Simple 80/20 train/test split on the grid cells
    # Since these are aggregated summaries across time, chronological split doesn't apply directly to the rows anymore.
    # We will do a random split, stratified by risk class.
    from sklearn.model_selection import train_test_split
    
    # Stratification requires at least 2 samples per class
    stratify_col = y if all(y.value_counts() > 1) else None
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=stratify_col
    )

    # 3. Model Training
    clf = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    clf.fit(X_train, y_train)

    # 4. Evaluation
    y_pred = clf.predict(X_test)
    y_prob = clf.predict_proba(X_test)

    # Metrics
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, average="macro", zero_division=0)
    rec = recall_score(y_test, y_pred, average="macro", zero_division=0)
    f1 = f1_score(y_test, y_pred, average="macro", zero_division=0)

    # ROC-AUC
    # Fallback to 0 if there are issues with probability dimensions (e.g. only 1 class in test set)
    try:
        roc_auc = roc_auc_score(y_test, y_prob, multi_class="ovr", average="macro")
    except ValueError:
        roc_auc = 0.0

    importances = dict(zip(features, clf.feature_importances_))

    return {
        "metrics": {
            "accuracy": float(acc),
            "precision": float(prec),
            "recall": float(rec),
            "f1": float(f1),
            "roc_auc": float(roc_auc),
        },
        "feature_importances": {k: float(v) for k, v in importances.items()},
        "split_ratio": 0.8,
        "classes": clf.classes_.tolist(),
    }
