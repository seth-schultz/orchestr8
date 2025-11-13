---
id: mlops-monitoring-ab-testing
category: example
tags: [mlops, monitoring, ab-testing, prometheus, evidently]
capabilities:
  - Prometheus metrics for ML model monitoring
  - Data drift detection with Evidently
  - A/B testing with consistent hashing
  - Continuous training pipeline triggers
useWhen:
  - Monitoring ML model performance in production
  - Detecting data drift and model degradation
  - Running A/B tests for model versions
  - Implementing continuous training workflows
estimatedTokens: 1400
relatedResources:
  - orchestr8://agents/mlops-specialist
  - orchestr8://skills/observability-metrics-prometheus
---

# ML Model Monitoring & A/B Testing

Production monitoring, data drift detection, and A/B testing for ML models.

## Model Monitoring with Prometheus

```python
import prometheus_client
from prometheus_client import Counter, Histogram, Gauge
import time
from evidently import ColumnMapping
from evidently.metric_preset import DataDriftPreset
from evidently.report import Report

# Prometheus metrics
prediction_counter = Counter(
    'model_predictions_total',
    'Total number of predictions',
    ['model_name', 'model_version']
)

prediction_latency = Histogram(
    'model_prediction_latency_seconds',
    'Prediction latency in seconds',
    ['model_name'],
    buckets=[0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1.0]
)

feature_drift = Gauge(
    'model_feature_drift',
    'Feature drift score',
    ['feature_name']
)

prediction_confidence = Histogram(
    'model_prediction_confidence',
    'Prediction confidence scores',
    ['model_name']
)

# Instrumented prediction
@app.post("/predict")
async def predict(request: PredictionRequest):
    start_time = time.time()

    try:
        # Predict
        predictions = model.predict(np.array(request.features))
        confidence = np.max(predictions, axis=1)

        # Log metrics
        prediction_counter.labels(
            model_name='churn_model',
            model_version='1.0.0'
        ).inc()

        latency = time.time() - start_time
        prediction_latency.labels(model_name='churn_model').observe(latency)

        for conf in confidence:
            prediction_confidence.labels(model_name='churn_model').observe(conf)

        return {"predictions": predictions.tolist()}

    except Exception as e:
        error_counter.labels(model_name='churn_model').inc()
        raise HTTPException(status_code=500, detail=str(e))

# Data drift detection
def check_data_drift(reference_data, current_data):
    """Check for data drift using Evidently"""

    report = Report(metrics=[DataDriftPreset()])

    report.run(
        reference_data=reference_data,
        current_data=current_data,
        column_mapping=ColumnMapping()
    )

    # Get drift score
    drift_results = report.as_dict()

    for feature, metrics in drift_results['metrics'][0]['result']['drift_by_columns'].items():
        drift_score = metrics['drift_score']
        feature_drift.labels(feature_name=feature).set(drift_score)

        if metrics['drift_detected']:
            print(f"ALERT: Data drift detected in {feature}")
            # Send alert to Slack/PagerDuty

# Model performance monitoring
def log_prediction_for_monitoring(features, prediction, actual=None):
    """Log predictions for monitoring and retraining"""

    from datetime import datetime
    import json

    log_entry = {
        'timestamp': datetime.utcnow().isoformat(),
        'features': features.tolist(),
        'prediction': prediction.tolist(),
        'actual': actual.tolist() if actual is not None else None,
        'model_version': '1.0.0'
    }

    # Write to Kafka for streaming monitoring
    producer.send('model_predictions', json.dumps(log_entry))

    # Store in database for batch analysis
    db.predictions.insert_one(log_entry)
```

## A/B Testing

```python
import random
from enum import Enum
import hashlib
import numpy as np
from scipy import stats

class ModelVersion(Enum):
    CONTROL = "v1.0"
    TREATMENT = "v2.0"

# Load both models
model_v1 = mlflow.pyfunc.load_model("models:/churn_model/1")
model_v2 = mlflow.pyfunc.load_model("models:/churn_model/2")

# A/B test configuration
AB_TEST_CONFIG = {
    'enabled': True,
    'treatment_percentage': 0.2,  # 20% get new model
    'user_hash_seed': 'ab_test_2024'
}

def get_model_version(user_id: str) -> ModelVersion:
    """Assign user to model version (consistent hashing)"""

    if not AB_TEST_CONFIG['enabled']:
        return ModelVersion.CONTROL

    # Consistent hashing for same user
    hash_input = f"{user_id}_{AB_TEST_CONFIG['user_hash_seed']}"
    hash_value = int(hashlib.md5(hash_input.encode()).hexdigest(), 16)
    percentage = (hash_value % 100) / 100

    if percentage < AB_TEST_CONFIG['treatment_percentage']:
        return ModelVersion.TREATMENT
    return ModelVersion.CONTROL

@app.post("/predict")
async def predict(request: PredictionRequest, user_id: str):
    # Determine model version
    version = get_model_version(user_id)

    # Select model
    if version == ModelVersion.TREATMENT:
        model = model_v2
        model_name = "v2.0"
    else:
        model = model_v1
        model_name = "v1.0"

    # Predict
    predictions = model.predict(np.array(request.features))

    # Log for A/B analysis
    ab_test_logger.log({
        'user_id': user_id,
        'model_version': model_name,
        'prediction': predictions.tolist(),
        'timestamp': datetime.utcnow()
    })

    return {
        'predictions': predictions.tolist(),
        'model_version': model_name
    }

# A/B test analysis
def analyze_ab_test():
    """Analyze A/B test results"""

    # Get metrics for both groups
    control_metrics = db.ab_test_results.find({'model_version': 'v1.0'})
    treatment_metrics = db.ab_test_results.find({'model_version': 'v2.0'})

    control_conversion = [m['converted'] for m in control_metrics]
    treatment_conversion = [m['converted'] for m in treatment_metrics]

    # Statistical test
    statistic, p_value = stats.ttest_ind(control_conversion, treatment_conversion)

    print(f"Control conversion rate: {np.mean(control_conversion):.3f}")
    print(f"Treatment conversion rate: {np.mean(treatment_conversion):.3f}")
    print(f"P-value: {p_value:.4f}")

    if p_value < 0.05:
        print("Statistically significant difference detected!")
        if np.mean(treatment_conversion) > np.mean(control_conversion):
            print("Treatment model is BETTER - promote to production")
        else:
            print("Treatment model is WORSE - keep control")
```

## Continuous Training

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

def check_model_performance():
    """Check if model needs retraining"""
    from sklearn.metrics import accuracy_score

    # Get recent predictions and actuals
    recent_data = db.predictions.find({
        'timestamp': {'$gte': datetime.utcnow() - timedelta(days=7)},
        'actual': {'$ne': None}
    })

    y_true = [d['actual'] for d in recent_data]
    y_pred = [d['prediction'] for d in recent_data]

    current_accuracy = accuracy_score(y_true, y_pred)

    # Compare to baseline
    baseline_accuracy = 0.85

    if current_accuracy < baseline_accuracy - 0.05:
        print(f"Model degradation detected: {current_accuracy:.3f} < {baseline_accuracy:.3f}")
        return True
    return False

def trigger_retraining():
    """Trigger Kubeflow pipeline for retraining"""
    from kfp import Client

    client = Client(host='http://kubeflow:8080')
    client.create_run_from_pipeline_func(
        ml_pipeline,
        arguments={'retrain': True}
    )

# Continuous training DAG
dag = DAG(
    'continuous_training',
    default_args={'owner': 'mlops'},
    schedule_interval='0 2 * * 0',  # Weekly
    start_date=datetime(2024, 1, 1)
)

check_task = PythonOperator(
    task_id='check_performance',
    python_callable=check_model_performance,
    dag=dag
)

retrain_task = PythonOperator(
    task_id='trigger_retraining',
    python_callable=trigger_retraining,
    dag=dag
)

check_task >> retrain_task
```

## Usage Notes

- Monitor prediction latency and throughput with Prometheus
- Set up alerts for data drift detection
- Use consistent hashing for stable A/B test assignments
- Implement statistical significance testing before model promotion
- Automate retraining triggers based on performance degradation
- Log all predictions for offline analysis and model improvement
