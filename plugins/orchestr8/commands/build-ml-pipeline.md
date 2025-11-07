---
description: Build complete ML pipeline from data ingestion, preprocessing, training, evaluation, to production deployment with MLOps
argument-hint: [ml-problem-description]
model: claude-opus-4-1-20250805
---

# Build ML Pipeline Workflow

Autonomous end-to-end ML pipeline development from raw data to production deployment.

## Intelligence Database Integration

```bash

# Initialize workflow

echo "🚀 Starting Build ML Pipeline Workflow"
echo "ML Problem: $1"
echo "Workflow ID: $workflow_id"

# Query similar ML pipeline patterns
```

---

## Phase 1: Requirements & Design (0-20%)

**Objective**: Understand ML problem and design solution architecture

**⚡ EXECUTE TASK TOOL:**
```
subagent_type: "ai-ml-engineering:ml-engineer"
description: "Analyze ML requirements and design pipeline architecture"
prompt: "Analyze ML requirements and design complete pipeline architecture:

ML Problem: $1

Tasks:
1. **Analyze ML Requirements**
   - Problem type (classification, regression, clustering, time series, NLP, CV)
   - Business metrics and success criteria
   - Data sources and availability (databases, APIs, S3, Kafka)
   - Performance requirements (latency, throughput, accuracy)
   - Compliance requirements (GDPR, model explainability, fairness)

2. **Design ML Architecture**
   - Data pipeline architecture (batch vs streaming)
   - Feature engineering strategy
   - Model selection approach (traditional ML vs deep learning)
   - Training infrastructure (local, cloud, distributed)
   - Deployment strategy (real-time API, batch predictions, edge)
   - Monitoring and retraining triggers
   - MLOps tooling (MLflow, Kubeflow, Airflow)

3. **Define Success Metrics**
   - ML metrics (accuracy, precision, recall, F1, AUC-ROC, RMSE, MAE)
   - Business metrics (conversion rate, revenue impact, cost savings)
   - Operational metrics (latency p95, throughput, uptime)
   - Data quality metrics (completeness, freshness, drift)

4. **Tech Stack Selection**
   - Data processing: Pandas, Spark, Dask
   - ML frameworks: scikit-learn, XGBoost, TensorFlow, PyTorch
   - Feature store: Feast, Tecton, custom
   - Experiment tracking: MLflow, Weights & Biases
   - Orchestration: Airflow, Prefect, Kubeflow
   - Deployment: FastAPI, TensorFlow Serving, Seldon
   - Monitoring: Prometheus, Grafana, Evidently AI

Expected outputs:
- .orchestr8/docs/requirements/ml-requirements.md with problem analysis
- .orchestr8/docs/design/ml-architecture.md with architecture diagram
- .orchestr8/docs/design/tech-stack.md with technology selections
- project-plan.md with milestones
"
```

**Expected Outputs:**
- `.orchestr8/docs/requirements/ml-requirements.md` - Problem type, metrics, data sources, requirements
- `.orchestr8/docs/design/ml-architecture.md` - End-to-end architecture design
- `.orchestr8/docs/design/tech-stack.md` - Technology stack selections
- `project-plan.md` - Implementation milestones

**Quality Gate: Requirements Validation**
```bash
# Validate requirements document
if [ ! -f "ml-requirements.md" ]; then
  echo "❌ ML requirements not documented"
  exit 1
fi

# Validate architecture document
if [ ! -f "ml-architecture.md" ]; then
  echo "❌ Architecture not designed"
  exit 1
fi

# Validate metrics defined
if ! grep -qE "accuracy|precision|recall|rmse|mae" ml-requirements.md; then
  echo "❌ ML metrics not defined"
  exit 1
fi

echo "✅ Requirements and architecture validated"
```

**Track Progress:**
```bash
TOKENS_USED=5000

# Store architecture decisions
  "ML pipeline architecture design" \
  "$(head -n 50 ml-architecture.md)"
```

---

## Phase 2: Data Pipeline Development (20-45%)

**Objective**: Build robust data ingestion and feature engineering pipelines

**⚡ EXECUTE TASK TOOL:**
```
subagent_type: "ai-ml-engineering:data-engineer"
description: "Build data ingestion and feature engineering pipelines"
prompt: "Build complete data pipeline based on architecture:

Architecture: ml-architecture.md
Requirements: ml-requirements.md

Tasks:
1. **Data Ingestion**
   - Set up data sources (databases, APIs, S3, Kafka)
   - Implement data validation (schema checks, completeness)
   - Create data versioning (DVC, Delta Lake)
   - Schedule data refresh (Airflow DAGs)
   - Handle incremental vs full refresh
   - Error handling and retry logic

2. **Feature Engineering**
   - Exploratory data analysis (EDA) notebooks
   - Feature creation and transformations
   - Feature selection and importance analysis
   - Handle missing values and outliers
   - Scaling and normalization
   - Create train/validation/test splits
   - Feature store integration (if applicable)

3. **Data Quality Framework**
   - Implement data quality checks (Great Expectations)
   - Monitor data drift detection (Evidently AI)
   - Create data quality dashboards
   - Set up alerting for data issues
   - Data profiling and statistics

4. **Orchestration**
   - Create Airflow DAGs for data pipeline
   - Schedule and dependency management
   - Monitoring and alerting
   - Backfill capabilities

Code Examples:
\`\`\`python
# Airflow DAG for data pipeline
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

dag = DAG(
    'ml_data_pipeline',
    schedule_interval='0 2 * * *',
    catchup=False,
    default_args={
        'retries': 2,
        'retry_delay': timedelta(minutes=5)
    }
)

extract_task = PythonOperator(
    task_id='extract_data',
    python_callable=extract_from_sources,
    dag=dag
)

validate_task = PythonOperator(
    task_id='validate_data',
    python_callable=validate_data_quality,
    dag=dag
)

feature_task = PythonOperator(
    task_id='create_features',
    python_callable=engineer_features,
    dag=dag
)

extract_task >> validate_task >> feature_task
\`\`\`

Expected outputs:
- data_ingestion/ directory with ingestion scripts
- feature_engineering/ directory with feature code
- airflow_dags/ directory with DAG definitions
- data_quality/ directory with quality checks
- eda_notebooks/ directory with EDA notebooks
- All data pipeline tests passing
"
```

**Expected Outputs:**
- `data_ingestion/` - Data ingestion scripts and connectors
- `feature_engineering/` - Feature engineering code
- `airflow_dags/` - Orchestration DAGs
- `data_quality/` - Quality check implementations
- `eda_notebooks/` - Exploratory data analysis notebooks

**Quality Gate: Data Pipeline Validation**
```bash
# Validate data ingestion exists
if [ ! -d "data_ingestion" ]; then
  echo "❌ Data ingestion not implemented"
  exit 1
fi

# Validate feature engineering exists
if [ ! -d "feature_engineering" ]; then
  echo "❌ Feature engineering not implemented"
  exit 1
fi

# Validate Airflow DAGs exist
if [ ! -d "airflow_dags" ]; then
  echo "❌ Airflow DAGs not created"
  exit 1
fi

# Run data pipeline tests
if [ -f "tests/test_data_pipeline.py" ]; then
  if ! python -m pytest tests/test_data_pipeline.py; then
    echo "❌ Data pipeline tests failing"
    exit 1
  fi
fi

echo "✅ Data pipeline validated"
```

**Track Progress:**
```bash
TOKENS_USED=8000

# Store data pipeline patterns
  "Data pipeline implementation patterns" \
  "$(find data_ingestion -name '*.py' -exec head -20 {} \; | head -100)"
```

---

## Phase 3: Model Training & Experimentation (45-70%)

**Objective**: Train and optimize ML models with experiment tracking

**⚡ EXECUTE TASK TOOL:**
```
subagent_type: "ai-ml-engineering:ml-engineer"
description: "Train ML models with experimentation and tracking"
prompt: "Train and optimize ML models with comprehensive experiment tracking:

Architecture: ml-architecture.md
Requirements: ml-requirements.md
Data: feature_engineering/

Tasks:
1. **Baseline Model**
   - Implement simple baseline (mean/median predictor, random classifier)
   - Establish baseline performance metrics
   - Create evaluation framework
   - Document baseline in MLflow

2. **Model Development**
   - Train multiple model types (linear, tree-based, neural networks)
   - Hyperparameter optimization (Optuna, GridSearch, RandomSearch)
   - Cross-validation and evaluation
   - Feature importance analysis
   - Model ensembling if beneficial

3. **Experiment Tracking**
   - Track all experiments with MLflow
   - Log parameters, metrics, artifacts
   - Compare model performance
   - Version control for models
   - Track data versioning

4. **Model Interpretability**
   - SHAP values for global interpretability
   - LIME for local explanations
   - Feature importance visualization
   - Model cards documentation
   - Fairness and bias analysis

Code Examples:
\`\`\`python
import mlflow
import optuna
from sklearn.metrics import f1_score
from xgboost import XGBClassifier

def objective(trial):
    params = {
        'n_estimators': trial.suggest_int('n_estimators', 100, 500),
        'max_depth': trial.suggest_int('max_depth', 3, 15),
        'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3)
    }

    with mlflow.start_run(nested=True):
        mlflow.log_params(params)

        model = XGBClassifier(**params)
        model.fit(X_train, y_train)

        score = f1_score(y_val, model.predict(X_val))
        mlflow.log_metric('f1_score', score)
        mlflow.sklearn.log_model(model, 'model')

    return score

study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials=100)
\`\`\`

Expected outputs:
- models/ directory with training scripts
- experiments/ directory with experiment results
- MLflow tracking server configured
- model_cards/ directory with model documentation
- interpretability/ directory with SHAP/LIME analysis
- best_model.pkl or saved model artifacts
- Model evaluation report
"
```

**Expected Outputs:**
- `models/` - Model training scripts
- `experiments/` - Experiment configurations and results
- `model_cards/` - Model documentation
- `interpretability/` - SHAP/LIME analysis
- MLflow tracking with all experiments logged
- Best model selected and documented

**Quality Gate: Model Training Validation**
```bash
# Validate models directory exists
if [ ! -d "models" ]; then
  echo "❌ Model training not implemented"
  exit 1
fi

# Validate MLflow tracking
if ! grep -q "mlflow" models/*.py; then
  echo "❌ MLflow experiment tracking not implemented"
  exit 1
fi

# Validate model card exists
if [ ! -d "model_cards" ]; then
  echo "❌ Model cards not created"
  exit 1
fi

# Run model training tests
if [ -f "tests/test_models.py" ]; then
  if ! python -m pytest tests/test_models.py; then
    echo "❌ Model tests failing"
    exit 1
  fi
fi

echo "✅ Model training validated"
```

**Track Progress:**
```bash
TOKENS_USED=10000

# Store model architecture patterns
  "Model training and experimentation patterns" \
  "$(head -n 50 models/train_model.py 2>/dev/null || echo 'Model training completed')"
```

---

## Phase 4: MLOps & Deployment (70-85%)

**Objective**: Deploy model to production with CI/CD and monitoring

**⚡ EXECUTE TASK TOOL:**
```
subagent_type: "ai-ml-engineering:mlops-specialist"
description: "Deploy ML model with MLOps best practices"
prompt: "Deploy ML model to production with complete MLOps setup:

Best Model: (from MLflow registry)
Architecture: ml-architecture.md
Requirements: ml-requirements.md

Tasks:
1. **Model Registry**
   - Register best model in MLflow
   - Version management
   - Model staging (dev → staging → production)
   - Model metadata and lineage tracking

2. **Model Serving**
   - Create prediction API (FastAPI/Flask)
   - Containerize with Docker
   - Input validation and preprocessing
   - Error handling and logging
   - Health check endpoints
   - Batch prediction support (if needed)

3. **Kubernetes Deployment**
   - Deploy to Kubernetes cluster
   - Set up auto-scaling (HPA)
   - Configure load balancing
   - Resource limits and requests
   - Liveness and readiness probes
   - Rolling updates

4. **CI/CD Pipeline**
   - Automated testing (unit, integration)
   - Model validation on hold-out set
   - Performance regression tests
   - Automated deployment to staging
   - Manual approval gate for production
   - Rollback mechanisms

5. **A/B Testing Setup**
   - Implement traffic splitting
   - Statistical significance testing
   - Automated rollback on degradation
   - Experiment tracking

Code Examples:
\`\`\`python
# FastAPI model serving
from fastapi import FastAPI, HTTPException
import mlflow.pyfunc
from pydantic import BaseModel

app = FastAPI()
model = mlflow.pyfunc.load_model(\"models:/customer_churn/Production\")

class PredictionRequest(BaseModel):
    features: list

@app.post(\"/predict\")
async def predict(request: PredictionRequest):
    try:
        predictions = model.predict([request.features])
        return {\"predictions\": predictions.tolist()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get(\"/health\")
async def health():
    return {\"status\": \"healthy\", \"model_version\": \"v1.0\"}
\`\`\`

\`\`\`yaml
# Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ml-model-api
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: model-api
        image: myregistry/ml-model:v1.0
        resources:
          requests:
            memory: \"1Gi\"
            cpu: \"500m\"
          limits:
            memory: \"2Gi\"
            cpu: \"1000m\"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ml-model-hpa
spec:
  scaleTargetRef:
    kind: Deployment
    name: ml-model-api
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
\`\`\`

Expected outputs:
- deployment/api/ directory with FastAPI code
- deployment/docker/ directory with Dockerfile
- deployment/k8s/ directory with Kubernetes manifests
- .github/workflows/ or .gitlab-ci.yml with CI/CD
- ab_testing/ directory with A/B testing framework
- .orchestr8/docs/deployment/guide.md
"
```

**Expected Outputs:**
- `deployment/api/` - Model serving API
- `deployment/docker/` - Containerization files
- `deployment/k8s/` - Kubernetes manifests
- `.github/workflows/` or `.gitlab-ci.yml` - CI/CD pipeline
- `ab_testing/` - A/B testing framework
- `.orchestr8/docs/deployment/guide.md` - Deployment documentation

**Quality Gate: Deployment Validation**
```bash
# Validate API implementation
if [ ! -d "deployment/api" ]; then
  echo "❌ Model API not implemented"
  exit 1
fi

# Validate Dockerfile exists
if [ ! -f "deployment/docker/Dockerfile" ]; then
  echo "❌ Dockerfile not created"
  exit 1
fi

# Validate Kubernetes manifests
if [ ! -d "deployment/k8s" ]; then
  echo "❌ Kubernetes manifests not created"
  exit 1
fi

# Run deployment tests
if [ -f "tests/test_api.py" ]; then
  if ! python -m pytest tests/test_api.py; then
    echo "❌ API tests failing"
    exit 1
  fi
fi

echo "✅ Deployment validated"
```

**Track Progress:**
```bash
TOKENS_USED=9000

# Store deployment patterns
  "MLOps deployment patterns" \
  "$(head -n 50 deployment/api/main.py 2>/dev/null || echo 'Deployment configured')"
```

---

## Phase 5: Monitoring & Observability (85-95%)

**Objective**: Comprehensive monitoring for ML models in production

**⚡ EXECUTE TASK TOOL:**
```
subagent_type: "orchestr8:infrastructure:observability-specialist"
description: "Set up ML model monitoring and observability"
prompt: "Implement comprehensive monitoring for ML model in production:

Deployment: deployment/
Architecture: ml-architecture.md

Tasks:
1. **Prediction Monitoring**
   - Log all predictions with features and outputs
   - Track prediction latency (p50, p95, p99)
   - Monitor prediction confidence scores
   - Alert on anomalous predictions
   - Track prediction volume

2. **Model Performance Monitoring**
   - Track online metrics vs offline metrics
   - Monitor for model drift and degradation
   - Compare A/B test variants
   - Alert on performance drops
   - Track prediction accuracy over time

3. **Data Drift Detection**
   - Monitor input feature distributions
   - Detect covariate shift
   - Concept drift detection
   - Alert on significant drift
   - Feature importance tracking

4. **Dashboards & Alerting**
   - Grafana dashboards for model metrics
   - Prometheus alerts for degradation
   - PagerDuty/Slack integration for critical issues
   - Weekly performance reports
   - SLO/SLI tracking

Code Examples:
\`\`\`python
# Prometheus metrics for ML
from prometheus_client import Counter, Histogram, Gauge

prediction_counter = Counter(
    'ml_predictions_total',
    'Total predictions',
    ['model_version', 'prediction_class']
)

prediction_latency = Histogram(
    'ml_prediction_latency_seconds',
    'Prediction latency',
    buckets=[0.001, 0.01, 0.05, 0.1, 0.5, 1.0]
)

prediction_confidence = Histogram(
    'ml_prediction_confidence',
    'Prediction confidence scores',
    buckets=[0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 0.99]
)

model_accuracy = Gauge(
    'ml_model_accuracy',
    'Current model accuracy',
    ['model_version']
)

# Monitor predictions
@app.post(\"/predict\")
async def predict(request: PredictionRequest):
    start = time.time()

    predictions = model.predict(request.features)
    confidence = np.max(predictions, axis=1)

    # Log metrics
    prediction_latency.observe(time.time() - start)
    prediction_counter.labels(
        model_version='v1.0',
        prediction_class=str(predictions[0])
    ).inc()
    prediction_confidence.observe(confidence[0])

    return {\"predictions\": predictions.tolist()}
\`\`\`

Expected outputs:
- monitoring/prometheus/ directory with Prometheus config
- monitoring/grafana/ directory with dashboard definitions
- monitoring/alerts/ directory with alert rules
- monitoring/drift_detection/ directory with drift monitoring
- monitoring-guide.md
"
```

**Expected Outputs:**
- `monitoring/prometheus/` - Prometheus configuration
- `monitoring/grafana/` - Grafana dashboards
- `monitoring/alerts/` - Alert rule definitions
- `monitoring/drift_detection/` - Drift detection implementation
- `monitoring-guide.md` - Monitoring documentation

**Quality Gate: Monitoring Validation**
```bash
# Validate monitoring directory exists
if [ ! -d "monitoring" ]; then
  echo "❌ Monitoring not implemented"
  exit 1
fi

# Validate Prometheus metrics in API
if ! grep -q "prometheus_client" deployment/api/*.py; then
  echo "❌ Prometheus metrics not instrumented"
  exit 1
fi

# Validate Grafana dashboards exist
if [ ! -d "monitoring/grafana" ]; then
  echo "❌ Grafana dashboards not created"
  exit 1
fi

echo "✅ Monitoring validated"
```

**Track Progress:**
```bash
TOKENS_USED=7000

# Store monitoring patterns
  "ML monitoring and observability patterns" \
  "$(find monitoring -name '*.yaml' -o -name '*.json' | head -5 | xargs head -20)"
```

---

## Phase 6: Continuous Training (95-100%)

**Objective**: Automated model retraining and deployment

**⚡ EXECUTE TASK TOOL:**
```
subagent_type: "ai-ml-engineering:mlops-specialist"
description: "Set up continuous training and automated retraining"
prompt: "Implement continuous training pipeline with automated retraining:

Architecture: ml-architecture.md
Deployment: deployment/
Monitoring: monitoring/

Tasks:
1. **Retraining Triggers**
   - Schedule-based retraining (weekly/monthly)
   - Performance-based triggers (accuracy drop > 5%)
   - Data drift triggers (distribution shift detected)
   - Manual triggers via API
   - Volume-based triggers (new data threshold)

2. **Automated Retraining Pipeline**
   - Fetch latest training data
   - Retrain model with same pipeline
   - Evaluate on validation set
   - Compare with current production model
   - Register new model version
   - A/B test new vs current model

3. **Automated Deployment**
   - Canary deployment (5% traffic)
   - Monitor performance for 24h
   - Gradual rollout (5% → 25% → 50% → 100%)
   - Automated rollback on degradation
   - Shadow mode testing

4. **Governance**
   - Model approval workflow
   - Audit trail for model changes
   - Performance tracking across versions
   - Compliance checks

Code Examples:
\`\`\`python
# Airflow DAG for continuous training
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

def check_retraining_needed():
    \"\"\"Check if model needs retraining\"\"\"
    current_performance = get_current_f1_score()
    baseline_performance = 0.85

    drift_detected = check_data_drift()

    if current_performance < baseline_performance - 0.05 or drift_detected:
        return True
    return False

def trigger_retraining():
    \"\"\"Trigger Kubeflow pipeline for retraining\"\"\"
    from kfp import Client
    client = Client(host='http://kubeflow:8080')
    run = client.create_run_from_pipeline_func(
        ml_training_pipeline,
        arguments={'data_version': 'latest'}
    )
    return run.id

def deploy_canary(model_version):
    \"\"\"Deploy new model version as canary\"\"\"
    # Update K8s deployment with canary
    pass

dag = DAG(
    'continuous_ml_training',
    schedule_interval='0 2 * * 0',  # Weekly
    catchup=False,
    default_args={
        'retries': 2,
        'retry_delay': timedelta(minutes=5)
    }
)

check_task = PythonOperator(
    task_id='check_performance',
    python_callable=check_retraining_needed,
    dag=dag
)

retrain_task = PythonOperator(
    task_id='trigger_retraining',
    python_callable=trigger_retraining,
    dag=dag
)

deploy_task = PythonOperator(
    task_id='deploy_canary',
    python_callable=deploy_canary,
    dag=dag
)

check_task >> retrain_task >> deploy_task
\`\`\`

Expected outputs:
- continuous_training/ directory with retraining pipeline
- airflow_dags/continuous_training.py DAG
- canary_deployment/ directory with canary scripts
- rollback/ directory with rollback procedures
- continuous-training-guide.md
"
```

**Expected Outputs:**
- `continuous_training/` - Retraining pipeline implementation
- `airflow_dags/continuous_training.py` - Continuous training DAG
- `canary_deployment/` - Canary deployment scripts
- `rollback/` - Rollback procedures
- `continuous-training-guide.md` - Documentation

**Quality Gate: Continuous Training Validation**
```bash
# Validate continuous training pipeline
if [ ! -d "continuous_training" ]; then
  echo "❌ Continuous training not implemented"
  exit 1
fi

# Validate retraining DAG exists
if [ ! -f "airflow_dags/continuous_training.py" ]; then
  echo "❌ Continuous training DAG not created"
  exit 1
fi

# Validate rollback procedures
if [ ! -d "rollback" ]; then
  echo "❌ Rollback procedures not documented"
  exit 1
fi

echo "✅ Continuous training validated"
```

**Track Progress:**
```bash
TOKENS_USED=6000

# Store continuous training patterns
  "Continuous training and automated retraining patterns" \
  "$(head -n 50 continuous_training/retrain.py 2>/dev/null || echo 'Continuous training configured')"
```

---

## Workflow Complete

```bash
# Complete workflow tracking
WORKFLOW_END=$(date +%s)

  "ML pipeline built and deployed: $1"

echo "
✅ BUILD ML PIPELINE COMPLETE

ML Problem: $1

Pipeline Components:
✅ Data ingestion and feature engineering
✅ Model training with experiment tracking
✅ MLOps deployment with Kubernetes
✅ Monitoring and observability
✅ Continuous training and retraining

Deliverables:
- End-to-end data pipeline
- Trained and optimized model
- Production API deployment
- Monitoring dashboards
- Continuous training pipeline

Next Steps:
1. Review ml-requirements.md and ml-architecture.md
2. Test data pipeline: python data_ingestion/run_pipeline.py
3. Review MLflow experiments: mlflow ui
4. Test API locally: uvicorn deployment.api.main:app --reload
5. Deploy to staging: kubectl apply -f deployment/k8s/staging/
6. Monitor dashboards: http://grafana:3000
7. Trigger manual retraining: airflow trigger_dag continuous_ml_training

Documentation:
- .orchestr8/docs/requirements/ml-requirements.md
- .orchestr8/docs/design/ml-architecture.md
- .orchestr8/docs/deployment/guide.md
- monitoring-guide.md
- continuous-training-guide.md
"

# Display metrics
```

---

## Quality Gates Summary

**Data Pipeline Quality Gate**:
- ✅ Data validation passing (100% schema compliance)
- ✅ Data quality checks passing (>95% completeness)
- ✅ Feature engineering tested
- ✅ Pipeline can run end-to-end

**Model Training Quality Gate**:
- ✅ Model performance exceeds baseline by >10%
- ✅ Cross-validation scores consistent (std < 0.05)
- ✅ Model explainability artifacts generated
- ✅ All experiments tracked in MLflow

**Deployment Quality Gate**:
- ✅ Model API tests passing (unit + integration)
- ✅ Latency requirements met (p95 < 100ms)
- ✅ Load testing passed (1000 req/s)
- ✅ Security scan clean (no vulnerabilities)

**Monitoring Quality Gate**:
- ✅ All metrics instrumented
- ✅ Dashboards created and validated
- ✅ Alerts configured and tested
- ✅ On-call runbook created

---

## Success Criteria

The ML pipeline is complete when:

1. **Functional**:
   - ✅ End-to-end pipeline runs automatically
   - ✅ Model serves predictions in production
   - ✅ Continuous training working
   - ✅ Data ingestion scheduled and running
   - ✅ Feature engineering automated

2. **Performance**:
   - ✅ Model meets accuracy targets
   - ✅ API latency < requirements
   - ✅ System handles required throughput
   - ✅ No performance regressions

3. **Operational**:
   - ✅ Monitoring dashboards live
   - ✅ Alerts firing correctly
   - ✅ On-call runbook documented
   - ✅ Data quality checks automated
   - ✅ Rollback procedures tested

4. **Maintained**:
   - ✅ Code in version control
   - ✅ CI/CD pipelines operational
   - ✅ Documentation complete
   - ✅ Team trained on system
   - ✅ Model registry maintained

---

## Rollback Plan

If issues detected:

1. **Immediate**: Route traffic to previous model version
2. **Investigate**: Check logs, metrics, traces
3. **Fix**: Correct issue in development
4. **Validate**: Test fix in staging environment
5. **Deploy**: Gradual rollout with monitoring

```bash
# Rollback script
kubectl set image deployment/ml-model-api \
  model-api=myregistry/ml-model:v1.0-previous

# Update MLflow model stage
mlflow.client.transition_model_version_stage(
    name="customer_churn",
    version=previous_version,
    stage="Production"
)
```

---

## Example Invocation

```bash
# User request
"Build an ML pipeline to predict customer churn. We have user activity data in PostgreSQL,
need real-time predictions via API, and want automated retraining weekly."

# Workflow executes:
# 1. Analyzes requirements (classification, real-time API, weekly retraining)
# 2. Designs architecture (Airflow + Spark + MLflow + Kubernetes)
# 3. Builds data pipeline (PostgreSQL → feature engineering → training data)
# 4. Trains models (XGBoost, Random Forest, Neural Network)
# 5. Deploys best model (FastAPI + Docker + Kubernetes)
# 6. Sets up monitoring (Prometheus + Grafana + Evidently AI)
# 7. Implements continuous training (Airflow weekly DAG with drift detection)
# 8. Creates canary deployment with automated rollback
```

---

## Post-Deployment

After deployment:
- Monitor model performance for 7 days
- Conduct A/B test analysis
- Schedule postmortem/retrospective
- Document lessons learned
- Plan next iteration improvements
- Train team on operational procedures

---

## Agent Coordination

This workflow orchestrates:
- **ml-engineer** - ML architecture, model training and experimentation
- **data-engineer** - Data pipelines and feature engineering
- **mlops-specialist** - Deployment and continuous training
- **observability-specialist** - Monitoring and alerting
- **kubernetes-expert** - Container orchestration (as needed)
- **security-auditor** - Security review (as needed)

All agents work together to deliver production-grade ML systems autonomously with comprehensive quality gates and observability.
