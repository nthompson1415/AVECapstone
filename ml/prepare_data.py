#!/usr/bin/env python3

import argparse
import json
import os
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler


def parse_args():
    parser = argparse.ArgumentParser(description="Prepare per-option dataset for modeling.")
    parser.add_argument("--input", type=Path, default=Path("data/option_rows.csv"), help="CSV file with option rows")
    parser.add_argument("--outdir", type=Path, default=Path("ml/processed"), help="Directory for processed artifacts")
    parser.add_argument("--val-size", type=float, default=0.15, help="Validation fraction")
    parser.add_argument("--test-size", type=float, default=0.15, help="Test fraction")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for splits")
    return parser.parse_args()


def split_ids(ids, val_size, test_size, seed):
    train_ids, temp_ids = train_test_split(ids, test_size=val_size + test_size, random_state=seed, shuffle=True)
    relative_test = test_size / (val_size + test_size)
    val_ids, test_ids = train_test_split(temp_ids, test_size=relative_test, random_state=seed + 1, shuffle=True)
    return train_ids, val_ids, test_ids


def build_preprocessor(numeric_cols, categorical_cols):
    numeric_transformer = StandardScaler()
    categorical_transformer = OneHotEncoder(handle_unknown="ignore", sparse_output=False)

    return ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, numeric_cols),
            ("cat", categorical_transformer, categorical_cols),
        ],
        remainder="drop",
    )


def save_dataset(path, features, labels, ids):
    np.savez_compressed(path, X=features.astype(np.float32), y=labels.astype(np.float32), scenario_ids=ids)


def main():
    args = parse_args()
    df = pd.read_csv(args.input)

    feature_cols = [
        "include_controversial",
        "include_extended",
        "include_network",
        "occupants",
        "occupant_age",
        "occupant_pregnant",
        "pedestrians",
        "pedestrian_age",
        "pedestrian_pregnant",
        "certainty",
        "total_people",
        "life_years_lost",
    ]

    categorical_cols = [
        "option",
        "connectedness",
        "occupant_job",
        "occupant_health",
        "occupant_criminal",
        "occupant_legal_fault",
        "occupant_risk",
        "occupant_species",
        "occupant_network",
        "pedestrian_job",
        "pedestrian_health",
        "pedestrian_criminal",
        "pedestrian_legal_fault",
        "pedestrian_risk",
        "pedestrian_species",
        "pedestrian_network",
        "severity",
    ]

    target_col = "expected_harm"
    id_col = "scenario_id"

    scenario_ids = df[id_col].unique()
    train_ids, val_ids, test_ids = split_ids(scenario_ids, args.val_size, args.test_size, args.seed)

    splits = {
        "train": df[df[id_col].isin(train_ids)],
        "val": df[df[id_col].isin(val_ids)],
        "test": df[df[id_col].isin(test_ids)],
    }

    preprocessor = build_preprocessor(feature_cols, categorical_cols)
    preprocessor.fit(splits["train"][feature_cols + categorical_cols])

    os.makedirs(args.outdir, exist_ok=True)

    feature_names = preprocessor.get_feature_names_out()
    joblib.dump(preprocessor, args.outdir / "preprocessor.joblib")

    metadata = {
        "numeric_features": feature_cols,
        "categorical_features": categorical_cols,
        "feature_names_out": feature_names.tolist(),
        "target": target_col,
        "splits": {name: len(df_split) for name, df_split in splits.items()},
    }
    with open(args.outdir / "metadata.json", "w", encoding="utf-8") as fh:
        json.dump(metadata, fh, indent=2)

    for split_name, split_df in splits.items():
        transformed = preprocessor.transform(split_df[feature_cols + categorical_cols])
        labels = split_df[target_col].to_numpy()
        ids = split_df[id_col].to_numpy()
        save_dataset(args.outdir / f"{split_name}.npz", transformed, labels, ids)
        print(f"{split_name.capitalize()} set: {transformed.shape[0]} rows, {transformed.shape[1]} features")


if __name__ == "__main__":
    main()
