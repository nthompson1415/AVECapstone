#!/usr/bin/env python3

import argparse
import json
from pathlib import Path

import numpy as np
import torch
from torch import nn
from torch.utils.data import DataLoader, TensorDataset


def parse_args():
    parser = argparse.ArgumentParser(description="Train a neural network option scorer.")
    parser.add_argument("--data-dir", type=Path, default=Path("ml/processed"), help="Directory with processed .npz splits")
    parser.add_argument("--epochs", type=int, default=200, help="Maximum number of training epochs")
    parser.add_argument("--batch-size", type=int, default=256, help="Batch size")
    parser.add_argument("--lr", type=float, default=1e-3, help="Learning rate")
    parser.add_argument("--weight-decay", type=float, default=1e-4, help="L2 weight decay")
    parser.add_argument("--dropout", type=float, default=0.2, help="Dropout rate")
    parser.add_argument("--hidden-dims", type=str, default="256,128,64", help="Comma-separated hidden layer sizes")
    parser.add_argument("--patience", type=int, default=15, help="Early stopping patience (epochs)")
    parser.add_argument("--output", type=Path, default=Path("ml/processed/option_scorer.pt"), help="Path for best model weights")
    return parser.parse_args()


def load_split(path: Path):
    with np.load(path, allow_pickle=True) as data:
        X = torch.from_numpy(data["X"]).float()
        y = torch.from_numpy(data["y"]).float()
    return X, y


class OptionRegressor(nn.Module):
    def __init__(self, input_dim, hidden_dims, dropout):
        super().__init__()
        layers = []
        prev_dim = input_dim
        for hidden in hidden_dims:
            layers.append(nn.Linear(prev_dim, hidden))
            layers.append(nn.ReLU())
            layers.append(nn.Dropout(dropout))
            prev_dim = hidden
        layers.append(nn.Linear(prev_dim, 1))
        self.network = nn.Sequential(*layers)

    def forward(self, x):
        return self.network(x).squeeze(-1)


def make_loader(X, y, batch_size, shuffle):
    dataset = TensorDataset(X, y)
    return DataLoader(dataset, batch_size=batch_size, shuffle=shuffle)


@torch.no_grad()
def evaluate(model, loader, device):
    criterion = nn.MSELoss()
    total_loss = 0.0
    total_count = 0
    preds = []
    targets = []
    for features, labels in loader:
        features = features.to(device)
        labels = labels.to(device)
        outputs = model(features)
        loss = criterion(outputs, labels)
        total_loss += loss.item() * labels.size(0)
        total_count += labels.size(0)
        preds.append(outputs.cpu())
        targets.append(labels.cpu())

    preds = torch.cat(preds).numpy()
    targets = torch.cat(targets).numpy()
    mae = float(np.mean(np.abs(preds - targets)))
    rmse = float(np.sqrt(np.mean((preds - targets) ** 2)))
    r2 = float(1.0 - np.sum((preds - targets) ** 2) / np.sum((targets - targets.mean()) ** 2))
    return total_loss / total_count, {"mae": mae, "rmse": rmse, "r2": r2}


def main():
    args = parse_args()
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    train_X, train_y = load_split(args.data_dir / "train.npz")
    val_X, val_y = load_split(args.data_dir / "val.npz")
    test_X, test_y = load_split(args.data_dir / "test.npz")

    input_dim = train_X.shape[1]
    hidden_dims = [int(x) for x in args.hidden_dims.split(",") if x.strip()]

    model = OptionRegressor(input_dim, hidden_dims, args.dropout).to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=args.lr, weight_decay=args.weight_decay)
    criterion = nn.MSELoss()

    train_loader = make_loader(train_X, train_y, args.batch_size, shuffle=True)
    val_loader = make_loader(val_X, val_y, args.batch_size, shuffle=False)
    test_loader = make_loader(test_X, test_y, args.batch_size, shuffle=False)

    best_val_loss = float("inf")
    patience_counter = 0
    best_state = None
    history = []

    for epoch in range(1, args.epochs + 1):
        model.train()
        epoch_loss = 0.0
        for features, labels in train_loader:
            features = features.to(device)
            labels = labels.to(device)

            optimizer.zero_grad()
            outputs = model(features)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            epoch_loss += loss.item() * labels.size(0)

        train_loss = epoch_loss / len(train_loader.dataset)
        val_loss, val_metrics = evaluate(model, val_loader, device)
        history.append({"epoch": epoch, "train_loss": train_loss, "val_loss": val_loss, **val_metrics})
        print(f"Epoch {epoch:03d}: train_loss={train_loss:.4f} val_loss={val_loss:.4f} val_mae={val_metrics['mae']:.4f}")

        if val_loss < best_val_loss:
            best_val_loss = val_loss
            patience_counter = 0
            best_state = model.state_dict()
        else:
            patience_counter += 1
            if patience_counter >= args.patience:
                print("Early stopping triggered.")
                break

    if best_state is None:
        best_state = model.state_dict()

    torch.save({"state_dict": best_state, "input_dim": input_dim, "hidden_dims": hidden_dims, "dropout": args.dropout}, args.output)

    model.load_state_dict(best_state)
    val_loss, val_metrics = evaluate(model, val_loader, device)
    test_loss, test_metrics = evaluate(model, test_loader, device)

    metrics = {
        "val": {"loss": val_loss, **val_metrics},
        "test": {"loss": test_loss, **test_metrics},
        "device": str(device),
        "history": history,
    }

    with open(args.output.with_suffix(".metrics.json"), "w", encoding="utf-8") as fh:
        json.dump(metrics, fh, indent=2)

    print("Final validation metrics:", metrics["val"])
    print("Final test metrics:", metrics["test"])


if __name__ == "__main__":
    main()
