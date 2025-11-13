---
id: hyperparameter-optimization-optuna
category: example
tags: [ml, hyperparameter-tuning, optuna, optimization, automl]
capabilities:
  - Automated hyperparameter search with Optuna
  - Pruning of unpromising trials
  - Visualization of optimization results
  - Integration with PyTorch Lightning
useWhen:
  - Need to find optimal model hyperparameters
  - Want to automate model selection
  - Exploring hyperparameter search spaces
  - Reducing manual tuning effort
estimatedTokens: 650
relatedResources:
  - orchestr8://agents/ml-engineer
---

# Hyperparameter Optimization with Optuna

## Overview
Automated hyperparameter tuning using Optuna with pruning and visualization capabilities.

## Implementation

```python
import optuna
from optuna.integration import PyTorchLightningPruningCallback

# Optuna for hyperparameter tuning
def objective(trial):
    # Hyperparameter search space
    params = {
        'learning_rate': trial.suggest_float('learning_rate', 1e-5, 1e-2, log=True),
        'batch_size': trial.suggest_categorical('batch_size', [16, 32, 64, 128]),
        'num_layers': trial.suggest_int('num_layers', 2, 8),
        'hidden_dim': trial.suggest_categorical('hidden_dim', [128, 256, 512]),
        'dropout': trial.suggest_float('dropout', 0.1, 0.5),
        'weight_decay': trial.suggest_float('weight_decay', 1e-6, 1e-3, log=True)
    }

    # Create model with suggested parameters
    model = TransformerClassifier(
        vocab_size=50000,
        num_layers=params['num_layers'],
        embedding_dim=params['hidden_dim'],
        dropout=params['dropout']
    )

    # Train
    trainer = pl.Trainer(
        max_epochs=20,
        callbacks=[PyTorchLightningPruningCallback(trial, monitor='val_acc')],
        enable_progress_bar=False
    )

    trainer.fit(model, train_loader, val_loader)

    return trainer.callback_metrics['val_acc'].item()

# Run optimization
study = optuna.create_study(
    direction='maximize',
    pruner=optuna.pruners.MedianPruner(n_startup_trials=5, n_warmup_steps=10)
)

study.optimize(objective, n_trials=100, timeout=3600)

print(f"Best trial: {study.best_trial.params}")
print(f"Best accuracy: {study.best_value:.3f}")

# Visualization
import optuna.visualization as vis

vis.plot_optimization_history(study).show()
vis.plot_param_importances(study).show()
vis.plot_parallel_coordinate(study).show()
```

## Usage Notes

**Search Space Definition:**
- `suggest_float`: Continuous parameters (learning rate, dropout)
- `suggest_int`: Integer parameters (num_layers)
- `suggest_categorical`: Discrete choices (batch_size, hidden_dim)
- `log=True`: Logarithmic scale for wide-range parameters

**Pruning:**
- `MedianPruner`: Stop unpromising trials early
- `n_startup_trials`: Number of trials before pruning starts
- `n_warmup_steps`: Steps to run before evaluating pruning
- Saves compute by stopping bad trials

**Study Configuration:**
- `direction='maximize'`: Optimize for higher values (accuracy)
- `n_trials`: Maximum number of trials
- `timeout`: Maximum optimization time in seconds
- Can resume studies across multiple runs

**Visualizations:**
- `optimization_history`: Track improvement over trials
- `param_importances`: Identify most influential parameters
- `parallel_coordinate`: Compare trials across dimensions
- `slice`: Analyze parameter-performance relationships

**Best Practices:**
- Start with wide search spaces, then narrow
- Use pruning to save compute
- Run longer studies for complex search spaces
- Consider Bayesian optimization (TPE sampler) for efficiency
