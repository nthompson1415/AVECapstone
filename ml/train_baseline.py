#!/usr/bin/env python3

import argparse
import json
from pathlib import Path

import joblib
import numpy as np
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


def parse_args():
    parser = argparse.ArgumentParser(description="Train a baseline Ridge regressor on processed data.")
    parser.add_argument("--data-dir", type=Path, default=Path("ml/processed"), help="Directory with *.npz splits")
    parser.add_argument("--alpha", type=float, default=1.0, help="Ridge regularization strength")
    parser.add_argument("--output", type=Path, default=Path("ml/processed/baseline_ridge.joblib"), help="Model output path")
    return parser.parse_args()


def load_split(path: Path):
    with np.load(path, allow_pickle=True) as data:
        return data["X"], data["y"]


def evaluate(model, X, y):
    preds = model.predict(X)
    mae = mean_absolute_error(y, preds)
    rmse = np.sqrt(mean_squared_error(y, preds))
    r2 = r2_score(y, preds)
    return {"mae": float(mae), "rmse": float(rmse), "r2": float(r2)}


def main():
    args = parse_args()
    train_X, train_y = load_split(args.data_dir / "train.npz")
    val_X, val_y = load_split(args.data_dir / "val.npz")
    test_X, test_y = load_split(args.data_dir / "test.npz")

    model = Ridge(alpha=args.alpha)
    model.fit(train_X, train_y)

    metrics = {
        "val": evaluate(model, val_X, val_y),
        "test": evaluate(model, test_X, test_y),
    }

    joblib.dump(model, args.output)
    with open(args.output.with_suffix(".metrics.json"), "w", encoding="utf-8") as fh:
        json.dump(metrics, fh, indent=2)

    print("Validation metrics:", metrics["val"])
    print("Test metrics:", metrics["test"])


if __name__ == "__main__":
    main()
