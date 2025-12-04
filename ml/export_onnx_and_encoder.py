#!/usr/bin/env python3

import argparse
import json
from pathlib import Path

import joblib
import numpy as np
import torch
from train_option_scorer import OptionRegressor


def parse_args():
    parser = argparse.ArgumentParser(description="Export ONNX model and encoder metadata for browser inference.")
    parser.add_argument("--data-dir", type=Path, default=Path("ml/processed"), help="Directory containing trained artifacts")
    parser.add_argument("--output-dir", type=Path, default=Path("public/models"), help="Directory to write ONNX and encoder files")
    parser.add_argument("--onnx-name", type=str, default="option_scorer.onnx", help="Output ONNX filename")
    parser.add_argument("--encoder-name", type=str, default="encoder.json", help="Output encoder metadata filename")
    parser.add_argument("--opset", type=int, default=17, help="ONNX opset version")
    return parser.parse_args()


def ensure_dir(path: Path):
    path.mkdir(parents=True, exist_ok=True)


def load_metadata(metadata_path: Path):
    with open(metadata_path, "r", encoding="utf-8") as fh:
        return json.load(fh)


def to_serializable_categories(categories):
    serialized = []
    for value in categories:
        if isinstance(value, (np.integer, np.floating)):
            serialized.append(value.item())
        else:
            serialized.append(value)
    return serialized


def main():
    args = parse_args()
    metadata = load_metadata(args.data_dir / "metadata.json")

    preprocessor = joblib.load(args.data_dir / "preprocessor.joblib")
    model_state = torch.load(args.data_dir / "option_scorer.pt", map_location="cpu")

    input_dim = model_state["input_dim"]
    hidden_dims = model_state["hidden_dims"]
    dropout = model_state["dropout"]

    model = OptionRegressor(input_dim, hidden_dims, dropout)
    model.load_state_dict(model_state["state_dict"])
    model.eval()

    dummy = torch.zeros(1, input_dim)
    ensure_dir(args.output_dir)
    onnx_path = args.output_dir / args.onnx_name

    torch.onnx.export(
        model,
        dummy,
        onnx_path.as_posix(),
        input_names=["features"],
        output_names=["expected_harm"],
        dynamic_axes={"features": {0: "batch_size"}, "expected_harm": {0: "batch_size"}},
        opset_version=args.opset,
    )

    num_scaler = preprocessor.named_transformers_["num"]
    cat_encoder = preprocessor.named_transformers_["cat"]

    encoder_metadata = {
        "input_dim": input_dim,
        "numeric": {
            "features": metadata["numeric_features"],
            "mean": num_scaler.mean_.tolist(),
            "scale": num_scaler.scale_.tolist(),
        },
        "categorical": [
            {
                "feature": feature_name,
                "categories": to_serializable_categories(categories.tolist()),
            }
            for feature_name, categories in zip(metadata["categorical_features"], cat_encoder.categories_)
        ],
    }

    encoder_path = args.output_dir / args.encoder_name
    with open(encoder_path, "w", encoding="utf-8") as fh:
        json.dump(encoder_metadata, fh, indent=2)

    print(f"Exported ONNX model to {onnx_path}")
    print(f"Wrote encoder metadata to {encoder_path}")


if __name__ == "__main__":
    main()
