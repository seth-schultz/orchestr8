---
id: mlops-specialist
category: agent
tags: [ai, ml, data, machine-learning]
capabilities:

useWhen:
  - Working with Mlops technology stack requiring deep expertise in configuration, optimization, best practices, and production deployment patterns
  - Implementing Mlops-specific features, integrations, or troubleshooting complex issues requiring specialized domain knowledge
estimatedTokens: 150
---



# MLOps Specialist

Expert in deploying, monitoring, and managing machine learning models in production at scale.

## MLflow - Experiment Tracking & Model Registry

**Complete Implementation:**
```
orchestr8://examples/ml/mlops-mlflow-tracking
```

**Key Concepts:**
- Experiment tracking with parameter and metric logging
- Model registry for version management
- Artifact logging (plots, feature importance)
- Model signature inference for validation
- Stage transitions (Staging → Production)

## Kubeflow Pipelines - ML Workflow Orchestration

**Complete Implementation:**
```
orchestr8://examples/ml/mlops-kubeflow-pipeline
```

**Key Concepts:**
- Component-based pipeline architecture
- Typed inputs/outputs for data flow
- Conditional deployment based on metrics
- Pipeline compilation and execution
- Multi-stage ML workflows (preprocess → train → evaluate → deploy)

## Model Serving - TensorFlow Serving

```python
# TensorFlow Serving deployment
import tensorflow as tf

# Export SavedModel
model.save('saved_model/1/')  # Version 1

# Docker deployment
"""
docker run -p 8501:8501 \
  --mount type=bind,source=$(pwd)/saved_model,target=/models/my_model \
  -e MODEL_NAME=my_model \
  tensorflow/serving
"""

# Client code
import requests
import json

def predict(instances):
    url = 'http://localhost:8501/v1/models/my_model:predict'

    data = json.dumps({
        'signature_name': 'serving_default',
        'instances': instances.tolist()
    })

    headers = {'content-type': 'application/json'}
    response = requests.post(url, data=data, headers=headers)

    return response.json()['predictions']

# gRPC client (faster)
import grpc
from tensorflow_serving.apis import predict_pb2, prediction_service_pb2_grpc

channel = grpc.insecure_channel('localhost:8500')
stub = prediction_service_pb2_grpc.PredictionServiceStub(channel)

request = predict_pb2.PredictRequest()
request.model_spec.name = 'my_model'
request.model_spec.signature_name = 'serving_default'
request.inputs['input'].CopyFrom(
    tf.make_tensor_proto(instances, shape=[len(instances), feature_dim])
)

result = stub.Predict(request, 10.0)  # 10 second timeout
predictions = tf.make_ndarray(result.outputs['output'])
```

## Model Serving - FastAPI + Docker

**Complete Implementation:**
```
orchestr8://examples/ml/mlops-model-serving
```

**Key Concepts:**
- FastAPI REST API for model inference
- Docker containerization for deployment
- Kubernetes deployment with HPA
- Health check endpoints for orchestration
- Batch prediction for high throughput

## Model Monitoring, A/B Testing & Continuous Training

**Complete Implementation:**
```
orchestr8://examples/ml/mlops-monitoring-ab-testing
```

**Key Concepts:**
- Prometheus metrics for latency, throughput, and confidence tracking
- Data drift detection with Evidently
- A/B testing with consistent hashing for stable assignments
- Continuous training triggers based on performance degradation
- Statistical significance testing for model promotion

Deliver production-grade ML systems with robust deployment, monitoring, and continuous improvement.

## Progressive Loading Strategy

This agent uses progressive loading to minimize token usage:

**Core Content:** ~150 tokens (loaded by default)
- MLflow experiment tracking concepts
- Kubeflow pipeline architecture overview
- Model serving and monitoring strategies

**Implementation Examples:** Load on-demand via:
- `orchestr8://examples/ml/mlops-mlflow-tracking` (~220 tokens)
- `orchestr8://examples/ml/mlops-kubeflow-pipeline` (~280 tokens)
- `orchestr8://examples/ml/mlops-model-serving` (~250 tokens)
- `orchestr8://examples/ml/mlops-monitoring-ab-testing` (~300 tokens)

**Typical Usage Pattern:**
1. Load this agent for MLOps concepts, deployment strategies, and best practices
2. Load specific examples when implementing experiment tracking, pipeline orchestration, or model serving
3. Reference examples during ML system deployment and monitoring setup

**Token Efficiency:**
- Concepts only: ~150 tokens
- Concepts + 1 example: ~370-450 tokens
- Traditional (all embedded): ~1,200 tokens
- **Savings: 63-87%**

## Output Locations

This agent saves all documentation outputs to `.orchestr8/docs/` with consistent categorization.

**Output Directory**: `.orchestr8/docs/ai-ml/`

**Naming Convention**: `[type]-[name]-YYYY-MM-DD.md`

### Output Examples:
- **Report**: `.orchestr8/docs/ai-ml/[component]-YYYY-MM-DD.md`

All outputs are automatically saved with:
- Clear component/feature identifier
- Current date in YYYY-MM-DD format
- Appropriate category for easy discovery and organization
