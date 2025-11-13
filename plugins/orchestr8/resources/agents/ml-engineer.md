---
id: ml-engineer
category: agent
tags: [ai, ml, data, machine-learning]
capabilities:

useWhen:
  - Expert in building, training, and optimizing machine learning models using TensorFlow, PyTorch, and scikit-learn.
estimatedTokens: 75
---



# ML Engineer

Expert in building, training, and optimizing machine learning models using TensorFlow, PyTorch, and scikit-learn.

## PyTorch - Deep Learning

Build production-ready PyTorch models with Lightning:
- Transformer architectures with attention mechanisms
- Custom datasets and data loaders
- Training with callbacks, early stopping, and checkpointing
- Mixed precision training and gradient accumulation

**Example:** `orchestr8://examples/ml/pytorch-transformer-classifier`

## TensorFlow/Keras - Production Models

Multi-input Keras models with functional API:
- Custom attention layers for sequence processing
- Multiple input branches (text + numeric features)
- Advanced callbacks and learning rate scheduling
- TensorFlow Serving deployment format

**Example:** `orchestr8://examples/ml/tensorflow-keras-multi-input`

## Scikit-learn - Classical ML

```python
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import GridSearchCV, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.feature_selection import SelectKBest, f_classif
import numpy as np

# Feature engineering pipeline
numeric_features = ['age', 'income', 'credit_score']
categorical_features = ['country', 'occupation', 'education']

preprocessor = ColumnTransformer(
    transformers=[
        ('num', Pipeline([
            ('scaler', StandardScaler()),
            ('selector', SelectKBest(f_classif, k=10))
        ]), numeric_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
    ]
)

# Full pipeline
pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(random_state=42))
])

# Hyperparameter tuning
param_grid = {
    'preprocessor__num__selector__k': [5, 10, 15],
    'classifier__n_estimators': [100, 200, 300],
    'classifier__max_depth': [10, 20, 30, None],
    'classifier__min_samples_split': [2, 5, 10],
    'classifier__min_samples_leaf': [1, 2, 4],
    'classifier__max_features': ['sqrt', 'log2']
}

grid_search = GridSearchCV(
    pipeline,
    param_grid,
    cv=5,
    scoring='f1_macro',
    n_jobs=-1,
    verbose=2
)

grid_search.fit(X_train, y_train)

print(f"Best params: {grid_search.best_params_}")
print(f"Best F1 score: {grid_search.best_score_:.3f}")

# Ensemble methods
from sklearn.ensemble import VotingClassifier, StackingClassifier

# Voting ensemble
voting_clf = VotingClassifier(
    estimators=[
        ('rf', RandomForestClassifier(n_estimators=200)),
        ('gb', GradientBoostingClassifier(n_estimators=200)),
        ('xgb', xgboost.XGBClassifier(n_estimators=200))
    ],
    voting='soft',
    weights=[2, 1, 1]
)

# Stacking ensemble
stacking_clf = StackingClassifier(
    estimators=[
        ('rf', RandomForestClassifier(n_estimators=200)),
        ('gb', GradientBoostingClassifier(n_estimators=200)),
        ('xgb', xgboost.XGBClassifier(n_estimators=200))
    ],
    final_estimator=LogisticRegression(),
    cv=5
)

# Cross-validation
cv_scores = cross_val_score(
    stacking_clf,
    X_train,
    y_train,
    cv=5,
    scoring='f1_macro',
    n_jobs=-1
)

print(f"CV F1 scores: {cv_scores}")
print(f"Mean: {cv_scores.mean():.3f} (+/- {cv_scores.std() * 2:.3f})")
```

## Feature Engineering

```python
import pandas as pd
import numpy as np
from sklearn.preprocessing import PowerTransformer, QuantileTransformer

def engineer_features(df):
    """Comprehensive feature engineering"""

    # Temporal features
    df['hour'] = df['timestamp'].dt.hour
    df['day_of_week'] = df['timestamp'].dt.dayofweek
    df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
    df['month'] = df['timestamp'].dt.month
    df['quarter'] = df['timestamp'].dt.quarter

    # Cyclical encoding for time features
    df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
    df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)
    df['day_sin'] = np.sin(2 * np.pi * df['day_of_week'] / 7)
    df['day_cos'] = np.cos(2 * np.pi * df['day_of_week'] / 7)

    # Aggregation features
    df['user_total_purchases'] = df.groupby('user_id')['purchase_amount'].transform('sum')
    df['user_avg_purchase'] = df.groupby('user_id')['purchase_amount'].transform('mean')
    df['user_purchase_count'] = df.groupby('user_id')['purchase_id'].transform('count')

    # Interaction features
    df['income_to_age_ratio'] = df['income'] / (df['age'] + 1)
    df['purchase_frequency'] = df['user_purchase_count'] / df['days_since_signup']

    # Statistical features (rolling windows)
    df = df.sort_values(['user_id', 'timestamp'])
    df['rolling_mean_7d'] = df.groupby('user_id')['purchase_amount'].transform(
        lambda x: x.rolling(7, min_periods=1).mean()
    )
    df['rolling_std_7d'] = df.groupby('user_id')['purchase_amount'].transform(
        lambda x: x.rolling(7, min_periods=1).std()
    )

    # Categorical encoding with target statistics
    category_means = df.groupby('category')['target'].mean()
    df['category_target_mean'] = df['category'].map(category_means)

    # Text features (TF-IDF)
    from sklearn.feature_extraction.text import TfidfVectorizer

    tfidf = TfidfVectorizer(max_features=100, ngram_range=(1, 2))
    text_features = tfidf.fit_transform(df['description'])

    # Power transformation for skewed features
    pt = PowerTransformer(method='yeo-johnson')
    df['income_transformed'] = pt.fit_transform(df[['income']])

    return df

# Automated feature selection
from sklearn.feature_selection import RFECV

selector = RFECV(
    estimator=RandomForestClassifier(n_estimators=100),
    step=1,
    cv=5,
    scoring='f1_macro',
    n_jobs=-1
)

selector.fit(X_train, y_train)
selected_features = X_train.columns[selector.support_]

print(f"Selected {len(selected_features)} features: {selected_features.tolist()}")
```

## Hyperparameter Optimization

Automated hyperparameter tuning with Optuna:
- Define search spaces for all hyperparameters
- Prune unpromising trials early
- Visualize optimization progress and parameter importance
- Integration with PyTorch Lightning

**Example:** `orchestr8://examples/ml/hyperparameter-optimization-optuna`

## Model Interpretability

```python
import shap
import lime
from lime.lime_tabular import LimeTabularExplainer

# SHAP values
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

# Summary plot
shap.summary_plot(shap_values, X_test, feature_names=feature_names)

# Force plot for single prediction
shap.force_plot(
    explainer.expected_value[1],
    shap_values[1][0],
    X_test.iloc[0],
    feature_names=feature_names
)

# LIME for local interpretability
lime_explainer = LimeTabularExplainer(
    X_train.values,
    feature_names=feature_names,
    class_names=['Class 0', 'Class 1'],
    mode='classification'
)

# Explain single prediction
exp = lime_explainer.explain_instance(
    X_test.iloc[0].values,
    model.predict_proba,
    num_features=10
)

exp.show_in_notebook()
exp.save_to_file('explanation.html')

# Feature importance
import matplotlib.pyplot as plt

feature_importance = pd.DataFrame({
    'feature': feature_names,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

plt.figure(figsize=(10, 6))
plt.barh(feature_importance['feature'][:20], feature_importance['importance'][:20])
plt.xlabel('Importance')
plt.title('Top 20 Feature Importances')
plt.tight_layout()
plt.savefig('feature_importance.png')
```

## Experiment Tracking

```python
import mlflow
import mlflow.pytorch

# MLflow experiment
mlflow.set_experiment("text_classification")

with mlflow.start_run(run_name="transformer_v1"):
    # Log parameters
    mlflow.log_params({
        'model_type': 'transformer',
        'num_layers': 6,
        'embedding_dim': 256,
        'learning_rate': 1e-4,
        'batch_size': 64
    })

    # Train model
    trainer.fit(model, train_loader, val_loader)

    # Log metrics
    mlflow.log_metrics({
        'train_acc': train_acc,
        'val_acc': val_acc,
        'val_f1': val_f1,
        'val_loss': val_loss
    })

    # Log model
    mlflow.pytorch.log_model(model, "model")

    # Log artifacts
    mlflow.log_artifact('confusion_matrix.png')
    mlflow.log_artifact('training_curves.png')

    # Log dataset
    mlflow.log_input(mlflow.data.from_pandas(train_df), context="training")

# Compare runs
runs = mlflow.search_runs(experiment_names=["text_classification"])
best_run = runs.sort_values('metrics.val_f1', ascending=False).iloc[0]

print(f"Best run: {best_run['run_id']}")
print(f"Best F1: {best_run['metrics.val_f1']:.3f}")
```

Deliver state-of-the-art ML models with robust training pipelines and comprehensive experimentation.

## Progressive Loading Strategy

This agent uses progressive loading to minimize token usage:

**Core Content:** ~75 tokens (loaded by default)
- PyTorch and TensorFlow framework concepts
- Scikit-learn classical ML patterns
- Feature engineering and model interpretability principles

**Implementation Examples:** Load on-demand via:
- `orchestr8://examples/ml/pytorch-transformer-classifier` (~280 tokens)
- `orchestr8://examples/ml/tensorflow-keras-multi-input` (~260 tokens)
- `orchestr8://examples/ml/hyperparameter-optimization-optuna` (~240 tokens)

**Typical Usage Pattern:**
1. Load this agent for ML framework concepts, feature engineering strategies, and best practices
2. Load specific examples when implementing deep learning models, hyperparameter tuning, or experiment tracking
3. Reference examples during model training and evaluation

**Token Efficiency:**
- Concepts only: ~75 tokens
- Concepts + 1 example: ~315-355 tokens
- Traditional (all embedded): ~1,020 tokens
- **Savings: 65-93%**

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
