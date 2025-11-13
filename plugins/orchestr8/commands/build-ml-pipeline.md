---
description: Build complete ML pipeline from data ingestion, preprocessing, training,
  evaluation, to production deployment with MLOps
argument-hint:
- ml-problem-description
allowed-tools:
- Bash
- Edit
- Glob
- Grep
- Read
- SlashCommand
- TodoWrite
- Write
---

# Build ML Pipeline: $ARGUMENTS

**Request:** $ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "plugin:orchestr8:orchestr8-resources"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **ML Engineer** responsible for building end-to-end ML pipelines from raw data to production deployment.

## Phase 1: Requirements & Design (0-20%)

**→ Load:** orchestr8://match?query=machine+learning+requirements+design&categories=agent,skill&mode=index&maxResults=5

**Activities:**
- Understand ML problem type (classification, regression, NLP, CV, etc.)
- Define business metrics and success criteria
- Identify data sources and availability
- Design ML architecture (batch vs streaming)
- Plan feature engineering strategy
- Select model approach (traditional ML vs deep learning)

**→ Checkpoint:** ML architecture designed

## Phase 2: Data Pipeline (20-40%)

**→ Load:** orchestr8://match?query=data+pipeline+ingestion+preprocessing&categories=agent,skill,example&mode=index&maxResults=5

**Activities:**
- Build data ingestion pipeline
- Implement data validation and quality checks
- Create preprocessing and feature engineering
- Handle missing data and outliers
- Create train/validation/test splits
- Implement data versioning

**→ Checkpoint:** Data pipeline operational

## Phase 3: Model Development (40-60%)

**→ Load:** orchestr8://workflows/workflow-build-ml-pipeline

**Activities:**
- Implement baseline model
- Develop feature engineering pipeline
- Train multiple model candidates
- Perform hyperparameter tuning
- Validate models on holdout set
- Select best performing model

**→ Checkpoint:** Model trained and validated

## Phase 4: Model Evaluation & Testing (60-75%)

**→ Load:** orchestr8://match?query=model+evaluation+metrics+testing&categories=agent,skill&mode=index&maxResults=5

**Activities:**
- Evaluate model performance (accuracy, precision, recall, F1, AUC)
- Test for bias and fairness
- Validate on edge cases
- Perform error analysis
- Create model cards and documentation
- Benchmark against requirements

**→ Checkpoint:** Model evaluated and documented

## Phase 5: Production Deployment (75-90%)

**→ Load:** orchestr8://match?query=mlops+deployment+serving&categories=agent,skill,guide&mode=index&maxResults=5

**Activities:**
- Containerize model for deployment
- Set up model serving infrastructure
- Implement API endpoints
- Configure auto-scaling
- Set up A/B testing framework
- Deploy to staging and validate
- Deploy to production with monitoring

**→ Checkpoint:** Model deployed to production

## Phase 6: MLOps & Monitoring (90-100%)

**→ Load:** orchestr8://match?query=mlops+monitoring+retraining&categories=agent,skill,guide&mode=index&maxResults=5

**Activities:**
- Set up model performance monitoring
- Configure data drift detection
- Implement model drift detection
- Create retraining pipeline
- Set up alerting for degradation
- Establish CI/CD for ML

**→ Checkpoint:** MLOps monitoring operational

## Success Criteria

✅ ML problem clearly defined
✅ Data pipeline operational
✅ Feature engineering implemented
✅ Model trained and validated
✅ Performance meets requirements
✅ Bias and fairness validated
✅ Model deployed to production
✅ API serving requests
✅ Monitoring and alerting active
✅ Retraining pipeline established
✅ Complete documentation
