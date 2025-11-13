---
id: mlops-mlflow-tracking
category: example
tags: [mlops, mlflow, experiment-tracking, model-registry]
capabilities:
  - MLflow experiment tracking and metrics logging
  - Model signature inference and versioning
  - Model registry management and stage transitions
  - Feature importance tracking and visualization
useWhen:
  - Setting up MLflow experiment tracking for ML projects
  - Implementing model registry workflows
  - Tracking model performance metrics and artifacts
  - Managing model versions and production deployments
estimatedTokens: 950
relatedResources:
  - orchestr8://agents/mlops-specialist
  - orchestr8://skills/ml-model-evaluation
---

# MLflow Experiment Tracking & Model Registry

Complete implementation of MLflow tracking, model registry, and artifact management.

## Overview

Demonstrates production-ready MLflow setup with experiment tracking, model versioning, and registry management for transitioning models through staging to production.

## Implementation

```python
import mlflow
import mlflow.sklearn
from mlflow.tracking import MlflowClient
from mlflow.models.signature import infer_signature
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
import matplotlib.pyplot as plt
from sklearn.metrics import ConfusionMatrixDisplay
import pandas as pd

# Setup
mlflow.set_tracking_uri("http://mlflow-server:5000")
mlflow.set_experiment("customer_churn_prediction")

# Training with MLflow
with mlflow.start_run(run_name="rf_baseline") as run:
    # Log parameters
    params = {
        'n_estimators': 200,
        'max_depth': 10,
        'min_samples_split': 5,
        'random_state': 42
    }
    mlflow.log_params(params)

    # Train model
    model = RandomForestClassifier(**params)
    model.fit(X_train, y_train)

    # Predictions
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)

    # Log metrics
    metrics = {
        'accuracy': accuracy_score(y_test, y_pred),
        'precision': precision_score(y_test, y_pred, average='weighted'),
        'recall': recall_score(y_test, y_pred, average='weighted'),
        'f1': f1_score(y_test, y_pred, average='weighted'),
        'roc_auc': roc_auc_score(y_test, y_proba, multi_class='ovr')
    }
    mlflow.log_metrics(metrics)

    # Log confusion matrix
    fig, ax = plt.subplots(figsize=(10, 8))
    ConfusionMatrixDisplay.from_predictions(y_test, y_pred, ax=ax)
    plt.savefig('confusion_matrix.png')
    mlflow.log_artifact('confusion_matrix.png')

    # Log model with signature
    signature = infer_signature(X_train, model.predict(X_train))
    mlflow.sklearn.log_model(
        model,
        "model",
        signature=signature,
        input_example=X_train.iloc[:5],
        pip_requirements="requirements.txt"
    )

    # Log feature importance
    feature_importance = pd.DataFrame({
        'feature': X_train.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    feature_importance.to_csv('feature_importance.csv', index=False)
    mlflow.log_artifact('feature_importance.csv')

    run_id = run.info.run_id

# Model Registry
client = MlflowClient()

# Register model
model_uri = f"runs:/{run_id}/model"
model_details = mlflow.register_model(model_uri, "customer_churn_model")

# Transition to production
client.transition_model_version_stage(
    name="customer_churn_model",
    version=model_details.version,
    stage="Production",
    archive_existing_versions=True
)

# Add model description and tags
client.update_model_version(
    name="customer_churn_model",
    version=model_details.version,
    description="Random Forest model trained on 2024 Q1 data"
)

client.set_model_version_tag(
    name="customer_churn_model",
    version=model_details.version,
    key="deployment_date",
    value="2024-01-15"
)

# Load production model
production_model = mlflow.pyfunc.load_model(
    model_uri="models:/customer_churn_model/Production"
)

predictions = production_model.predict(new_data)
```

## Usage Notes

- Use consistent experiment names across team
- Always log model signatures for inference validation
- Track feature importance for model interpretability
- Version models in registry before production deployment
- Archive previous versions when promoting new models
- Use tags for metadata like deployment dates and data versions
