---
id: mlops-model-serving
category: example
tags: [mlops, fastapi, docker, kubernetes, model-serving]
capabilities:
  - FastAPI REST API for model serving
  - Docker containerization for ML models
  - Kubernetes deployment with autoscaling
  - Health checks and batch prediction endpoints
useWhen:
  - Deploying ML models as REST APIs
  - Containerizing model serving applications
  - Setting up Kubernetes deployments for ML services
  - Implementing scalable model inference endpoints
estimatedTokens: 1100
relatedResources:
  - orchestr8://agents/mlops-specialist
  - orchestr8://skills/kubernetes-deployment-patterns
---

# FastAPI Model Serving with Docker & Kubernetes

Production-ready model serving with REST API, containerization, and orchestration.

## Overview

Complete implementation of ML model serving using FastAPI, Docker, and Kubernetes with health checks, batch prediction, and horizontal autoscaling.

## API Implementation

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import mlflow.pyfunc
import numpy as np
import uvicorn

# Load model
model = mlflow.pyfunc.load_model("models:/customer_churn_model/Production")

app = FastAPI(title="ML Model API", version="1.0.0")

# Request/response models
class PredictionRequest(BaseModel):
    features: list[list[float]]

class PredictionResponse(BaseModel):
    predictions: list[float]
    model_version: str

# Health check
@app.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": model is not None}

# Prediction endpoint
@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    try:
        # Convert to numpy
        features = np.array(request.features)

        # Predict
        predictions = model.predict(features)

        return PredictionResponse(
            predictions=predictions.tolist(),
            model_version="1.0.0"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Batch prediction
@app.post("/batch_predict")
async def batch_predict(requests: list[PredictionRequest]):
    # Process in batches for efficiency
    all_features = np.vstack([np.array(r.features) for r in requests])
    predictions = model.predict(all_features)

    return {"predictions": predictions.tolist()}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## Docker Configuration

```dockerfile
# Dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .
COPY model/ ./model/

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Kubernetes Deployment

```yaml
# Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ml-model-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ml-model-api
  template:
    metadata:
      labels:
        app: ml-model-api
    spec:
      containers:
      - name: ml-api
        image: myregistry/ml-model-api:1.0.0
        ports:
        - containerPort: 8000
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "2000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ml-model-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
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
```

## Usage Notes

- Use Pydantic for request/response validation
- Implement health check endpoints for orchestration
- Set appropriate resource limits in Kubernetes
- Configure HPA based on CPU/memory metrics
- Use batch endpoints for high-throughput scenarios
- Monitor prediction latency and throughput
- Version API and model separately
