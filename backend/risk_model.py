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


def synthesize_target(df: pd.DataFrame) -> pd.Series:
    """
    Synthesize a heuristic risk target for the Random Forest to predict.
    WARNING: Since we do not have real ground-truth risk labels, we define a synthetic
    target based on the intentionally injected patterns in data_generator.py.

    Target generation:
    Score = (is_night * 0.4) + (is_weekend * 0.3) + (is_summer * 0.3) + noise

    This target is mathematically derived from the predictors. Therefore, this model
    evaluates only the architectural pipeline, and its metrics must NOT be interpreted
    as evidence of genuine real-world crime prediction.
    """
    np.random.seed(42)
    is_summer = df["month"].isin([6, 7, 8]).astype(float)
    is_night = df["is_night"].astype(float)
    is_weekend = df["is_weekend"].astype(float)

    # Base score [0, 1]
    score = (is_night * 0.4) + (is_weekend * 0.3) + (is_summer * 0.3)

    # Add noise to prevent perfect deterministic prediction
    noise = np.random.normal(0, 0.1, size=len(df))
    final_score = score + noise

    # Map to quantiles
    quantiles = np.quantile(final_score, [0.25, 0.5, 0.75])

    def classify(s):
        if s <= quantiles[0]:
            return "Low"
        elif s <= quantiles[1]:
            return "Moderate"
        elif s <= quantiles[2]:
            return "High"
        else:
            return "Critical"

    return pd.Series(final_score).apply(classify)


def run_risk_prediction_pipeline(crimes_data: list[dict[str, Any]]) -> dict[str, Any]:
    """
    Full pipeline: Preprocessing -> Split -> Train -> Evaluate.
    To prevent data leakage, we chronologically split the data (train on past, test on future).
    """
    df = pd.DataFrame(crimes_data)

    # Preprocessing
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values("date").reset_index(drop=True)

    # Feature Engineering
    # We use cyclical encoding for hour and month to preserve temporal continuity
    df["hour_sin"] = np.sin(2 * np.pi * df["hour"] / 24)
    df["hour_cos"] = np.cos(2 * np.pi * df["hour"] / 24)
    df["month_sin"] = np.sin(2 * np.pi * df["month"] / 12)
    df["month_cos"] = np.cos(2 * np.pi * df["month"] / 12)
    df["is_weekend_int"] = df["is_weekend"].astype(int)
    df["is_night_int"] = df["is_night"].astype(int)

    features = [
        "lat",
        "lng",
        "hour_sin",
        "hour_cos",
        "month_sin",
        "month_cos",
        "is_weekend_int",
        "is_night_int",
    ]

    # Synthesize target
    df["risk_class"] = synthesize_target(df)

    X = df[features]
    y = df["risk_class"]

    # Chronological Split (80% train, 20% test)
    split_idx = int(len(df) * 0.8)
    X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
    y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]

    # Model Training
    clf = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    clf.fit(X_train, y_train)

    # Untouched Test Evaluation
    y_pred = clf.predict(X_test)
    y_prob = clf.predict_proba(X_test)

    # Metrics
    # Using macro average for multi-class
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, average="macro", zero_division=0)
    rec = recall_score(y_test, y_pred, average="macro", zero_division=0)
    f1 = f1_score(y_test, y_pred, average="macro", zero_division=0)

    # ROC-AUC requires one-vs-rest for multiclass
    roc_auc = roc_auc_score(y_test, y_prob, multi_class="ovr", average="macro")

    # Get feature importances
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
