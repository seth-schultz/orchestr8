---
id: mlops-kubeflow-pipeline
category: example
tags: [mlops, kubeflow, pipeline, orchestration]
capabilities:
  - Kubeflow pipeline component definition
  - Multi-stage ML workflow orchestration
  - Conditional deployment based on metrics
  - Data preprocessing and model training integration
useWhen:
  - Building end-to-end ML training pipelines
  - Orchestrating multi-step ML workflows
  - Implementing conditional model deployment
  - Automating ML training and evaluation processes
estimatedTokens: 1200
relatedResources:
  - orchestr8://agents/mlops-specialist
  - orchestr8://skills/ml-hyperparameter-tuning
---

# Kubeflow ML Pipeline Orchestration

Complete Kubeflow pipeline with preprocessing, training, evaluation, and conditional deployment.

## Overview

Production-ready Kubeflow pipeline demonstrating component-based architecture, data flow, and conditional deployment based on model performance metrics.

## Implementation

```python
from kfp import dsl, compiler
from kfp.dsl import Input, Output, Dataset, Model, Metrics
import kfp.components as comp

# Component: Data preprocessing
@dsl.component(
    base_image='python:3.9',
    packages_to_install=['pandas', 'scikit-learn']
)
def preprocess_data(
    raw_data: Input[Dataset],
    processed_data: Output[Dataset],
    test_split: float = 0.2
):
    import pandas as pd
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import StandardScaler

    # Load data
    df = pd.read_csv(raw_data.path)

    # Feature engineering
    # ... preprocessing logic ...

    # Split
    train, test = train_test_split(df, test_size=test_split, random_state=42)

    # Save
    train.to_csv(processed_data.path, index=False)

# Component: Model training
@dsl.component(
    base_image='python:3.9',
    packages_to_install=['pandas', 'scikit-learn', 'mlflow']
)
def train_model(
    training_data: Input[Dataset],
    model_output: Output[Model],
    metrics_output: Output[Metrics],
    n_estimators: int = 100,
    max_depth: int = 10
):
    import pandas as pd
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.metrics import accuracy_score, f1_score
    import mlflow
    import pickle

    # Load data
    df = pd.read_csv(training_data.path)
    X = df.drop('target', axis=1)
    y = df['target']

    # Train
    model = RandomForestClassifier(
        n_estimators=n_estimators,
        max_depth=max_depth,
        random_state=42
    )
    model.fit(X, y)

    # Evaluate
    predictions = model.predict(X)
    accuracy = accuracy_score(y, predictions)
    f1 = f1_score(y, predictions, average='weighted')

    # Log metrics
    metrics_output.log_metric('accuracy', accuracy)
    metrics_output.log_metric('f1_score', f1)

    # Save model
    with open(model_output.path, 'wb') as f:
        pickle.dump(model, f)

# Component: Model evaluation
@dsl.component(
    base_image='python:3.9',
    packages_to_install=['pandas', 'scikit-learn']
)
def evaluate_model(
    model: Input[Model],
    test_data: Input[Dataset],
    metrics_output: Output[Metrics],
    threshold: float = 0.85
) -> bool:
    import pandas as pd
    import pickle
    from sklearn.metrics import accuracy_score

    # Load
    with open(model.path, 'rb') as f:
        model = pickle.load(f)

    df = pd.read_csv(test_data.path)
    X = df.drop('target', axis=1)
    y = df['target']

    # Evaluate
    predictions = model.predict(X)
    accuracy = accuracy_score(y, predictions)

    metrics_output.log_metric('test_accuracy', accuracy)

    # Check threshold
    return accuracy >= threshold

# Component: Deploy model
@dsl.component(
    base_image='python:3.9',
    packages_to_install=['boto3']
)
def deploy_model(
    model: Input[Model],
    endpoint_name: str,
    instance_type: str = 'ml.t2.medium'
):
    import boto3
    import sagemaker

    # Deploy to SageMaker
    # ... deployment logic ...
    pass

# Pipeline definition
@dsl.pipeline(
    name='ml-training-pipeline',
    description='End-to-end ML training pipeline'
)
def ml_pipeline(
    data_path: str,
    n_estimators: int = 100,
    max_depth: int = 10,
    deploy_threshold: float = 0.85
):
    # Preprocess
    preprocess_task = preprocess_data(raw_data=data_path)

    # Train
    train_task = train_model(
        training_data=preprocess_task.outputs['processed_data'],
        n_estimators=n_estimators,
        max_depth=max_depth
    )

    # Evaluate
    eval_task = evaluate_model(
        model=train_task.outputs['model_output'],
        test_data=preprocess_task.outputs['processed_data'],
        threshold=deploy_threshold
    )

    # Conditional deployment
    with dsl.Condition(eval_task.output == True, name='deploy-condition'):
        deploy_task = deploy_model(
            model=train_task.outputs['model_output'],
            endpoint_name='churn-model-prod'
        )

# Compile pipeline
compiler.Compiler().compile(
    pipeline_func=ml_pipeline,
    package_path='ml_pipeline.yaml'
)

# Run pipeline
from kfp import Client

client = Client(host='http://kubeflow-pipelines:8080')

run = client.create_run_from_pipeline_func(
    ml_pipeline,
    arguments={
        'data_path': 's3://bucket/data.csv',
        'n_estimators': 200,
        'max_depth': 15,
        'deploy_threshold': 0.85
    }
)
```

## Usage Notes

- Define reusable components for pipeline stages
- Use typed inputs/outputs for data flow validation
- Implement conditional logic for deployment gates
- Log metrics at each stage for observability
- Compile pipelines before execution
- Version pipeline YAML artifacts for reproducibility
