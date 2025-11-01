# Claude Code Enterprise Orchestration System

> Transform Claude Code into an autonomous software engineering organization capable of delivering enterprise-grade software from requirements to production.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Compatible-green.svg)](https://claude.ai)

**The most comprehensive, enterprise-grade orchestration system for Claude Code** — featuring 72+ specialized agents, 13 autonomous workflows, enterprise compliance (FedRAMP, ISO 27001, SOC2, GDPR, PCI-DSS), ML/data pipelines, API design (GraphQL/gRPC), message queues (Kafka/RabbitMQ), search (Elasticsearch/Algolia), multi-cloud (AWS/Azure/GCP), and observability (Prometheus/ELK).

## 🎯 What Makes This Different

While other projects provide agent collections, this system delivers a **complete autonomous software engineering organization**:

| Feature | This System | Other Solutions |
|---------|-------------|-----------------|
| **Complete Project Lifecycle** | ✅ Requirements → Deployment | ❌ Agent collections only |
| **Meta-Orchestration** | ✅ Hierarchical coordination | ❌ Flat agent lists |
| **Quality Gates** | ✅ Built-in (security, testing, perf) | ❌ Manual or missing |
| **Enterprise Standards** | ✅ SOC2, GDPR, OWASP built-in | ❌ DIY |
| **All Major Languages** | ✅ Python, TS, Java, Go, Rust, etc. | ⚠️ Limited coverage |
| **Cloud & Infrastructure** | ✅ AWS, K8s, Terraform | ⚠️ Partial |
| **End-to-End Workflows** | ✅ `/new-project`, `/add-feature` | ❌ Manual orchestration |
| **Testing Strategy** | ✅ 80%+ coverage requirement | ❌ Optional |

---

## 📚 Table of Contents

- [Quick Start](#-quick-start)
- [System Overview](#-system-overview)
- [Usage Guide](#-usage-guide)
- [Extending the System](#-extending-the-system)
- [Examples](#-real-world-examples)
- [Best Practices](#-best-practices)
- [Troubleshooting](#-troubleshooting)
- [Architecture](#-architecture-deep-dive)
- [Contributing](#-contributing)

---

## 🚀 Quick Start

### Prerequisites

- [Claude Code](https://claude.ai/code) installed and configured
- Git
- Basic understanding of your project's technology stack

### Installation

#### Option 1: For Existing Project

```bash
# Navigate to your project
cd your-project

# Clone into .claude directory
git clone https://github.com/your-org/claude-orchestration .claude

# Verify installation
ls .claude/
# Should see: CLAUDE.md, agents/, skills/, commands/, etc.
```

#### Option 2: For New Project

```bash
# Create new project directory
mkdir my-awesome-project
cd my-awesome-project

# Clone orchestration system
git clone https://github.com/your-org/claude-orchestration .claude

# Initialize git (if needed)
git init
```

### First Steps

1. **Start Claude Code:**
   ```bash
   claude-code
   ```

2. **Try your first workflow:**
   ```bash
   /new-project "Build a task management API with user authentication, CRUD operations for tasks, and deadline notifications"
   ```

3. **Watch the magic happen:**
   - ✅ Requirements analyzed
   - ✅ Architecture designed (you'll approve)
   - ✅ Project implemented
   - ✅ Tests written (80%+ coverage)
   - ✅ Security audited
   - ✅ Documentation generated
   - ✅ CI/CD configured
   - ✅ Deployed to staging

**That's it!** Your project is production-ready in hours, not weeks.

---

## 📋 System Overview

### The 4-Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 4: Workflows                                          │
│ /new-project, /add-feature, /security-audit, etc.          │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: Skills (Auto-Activated)                           │
│ TDD, Security, Performance, Language Expertise             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: Specialized Agents (72+)                          │
│ Dev, API, Testing, Messaging, SRE, DBs, Search, Cloud      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: Meta-Orchestrators                                │
│ project-orchestrator, feature-orchestrator                  │
└─────────────────────────────────────────────────────────────┘
```

### Available Agents

<details>
<summary><b>🎭 Meta-Orchestrators (3)</b> - Strategic coordination</summary>

- **project-orchestrator** - End-to-end project creation
- **feature-orchestrator** - Complete feature lifecycle
- **workflow-coordinator** - Cross-agent coordination

</details>

<details>
<summary><b>💻 Development Agents (16)</b> - Code implementation</summary>

**Language Specialists:**
- `python-developer` - Django, FastAPI, Flask, data science, ML/AI
- `typescript-developer` - Node.js, React, Next.js, full-stack
- `java-developer` - Spring Boot, Jakarta EE, microservices
- `go-developer` - Microservices, cloud-native, concurrent systems
- `rust-developer` - Systems programming, high-performance, WebAssembly
- `csharp-developer` - .NET 8, ASP.NET Core, Azure, enterprise apps
- `swift-developer` - SwiftUI, iOS/macOS, Combine, async/await
- `kotlin-developer` - Jetpack Compose, Android, Coroutines, Flow
- `ruby-developer` - Rails 7+, RSpec, ActiveRecord, Sidekiq
- `php-developer` - Laravel 10+, WordPress, modern PHP 8.2+
- `cpp-developer` - Modern C++20/23, game dev, systems programming
- `c-developer` - Embedded systems, kernel development, low-level programming

**Full-Stack:**
- `fullstack-developer` - End-to-end feature ownership
- `architect` - System design, technology selection
- `frontend-developer` - React, Vue, modern frontend
- `backend-developer` - APIs, services, business logic

</details>

<details>
<summary><b>🎨 Frontend Framework Specialists (4)</b> - Modern web frameworks</summary>

- `react-specialist` - React 18+, hooks, performance optimization, Zustand/Redux, Server Components
- `nextjs-specialist` - Next.js 14+ App Router, Server Actions, ISR, SSR, SSG, full-stack React
- `vue-specialist` - Vue 3 Composition API, Pinia state management, Vite, reactive patterns
- `angular-specialist` - Angular 17+ standalone components, signals, RxJS, TypeScript

</details>

<details>
<summary><b>📱 Mobile Development Specialists (2)</b> - Native mobile apps</summary>

- `swiftui-specialist` - SwiftUI for iOS/macOS, async/await, SwiftData, modern Swift patterns
- `compose-specialist` - Jetpack Compose for Android, Material Design 3, Kotlin Coroutines, Room

</details>

<details>
<summary><b>✅ Quality Assurance Agents (6)</b> - Quality enforcement</summary>

- `code-reviewer` - Best practices, SOLID principles, clean code
- `test-engineer` - Unit, integration, E2E tests (80%+ coverage)
- `security-auditor` - OWASP Top 10, vulnerability scanning
- `debugger` - Production bugs, race conditions, memory leaks
- `performance-analyzer` - Load testing, optimization
- `accessibility-expert` - WCAG 2.1 AA/AAA compliance

</details>

<details>
<summary><b>🔐 Compliance Specialists (5)</b> - Enterprise compliance</summary>

- `fedramp-specialist` - FedRAMP Low/Moderate/High (NIST SP 800-53, 3PAO audit)
- `iso27001-specialist` - ISO/IEC 27001:2022 ISMS (93 Annex A controls)
- `soc2-specialist` - SOC 2 Type I/II (Trust Service Criteria, TSC)
- `gdpr-specialist` - EU GDPR (data subject rights, 72-hour breach notification)
- `pci-dss-specialist` - PCI DSS 4.0 (12 requirements, quarterly ASV scans)

</details>

<details>
<summary><b>🚀 DevOps & Infrastructure (5)</b> - Deployment</summary>

- `aws-specialist` - Serverless, ECS, EKS
- `terraform-specialist` - Infrastructure as Code
- `ci-cd-engineer` - Pipeline automation
- `docker-specialist` - Containerization
- `kubernetes-expert` - K8s orchestration

</details>

<details>
<summary><b>🗄️ Database Specialists (3)</b> - Data storage & optimization</summary>

- `postgresql-specialist` - Query optimization, pgvector for AI embeddings, replication, partitioning, EXPLAIN analysis
- `mongodb-specialist` - Aggregation pipelines, sharding, replication sets, Atlas Vector Search, change streams
- `redis-specialist` - Caching strategies, pub/sub, rate limiting, session management, clustering

</details>

<details>
<summary><b>🤖 Data & ML Engineering (3)</b> - Machine Learning pipelines</summary>

- `data-engineer` - Apache Spark, Airflow, dbt, ETL/ELT pipelines, data quality (Great Expectations), CDC
- `ml-engineer` - PyTorch, TensorFlow/Keras, scikit-learn, hyperparameter tuning (Optuna), SHAP/LIME interpretability
- `mlops-specialist` - MLflow, Kubeflow pipelines, model serving, A/B testing, continuous training, model monitoring

</details>

<details>
<summary><b>📊 Site Reliability & Observability (2)</b> - Production excellence</summary>

- `sre-specialist` - SLOs/SLIs, error budgets, incident response, on-call procedures, chaos engineering, toil automation
- `observability-specialist` - Prometheus, Grafana, OpenTelemetry, distributed tracing, ELK stack, APM, alerting

</details>

<details>
<summary><b>🔌 API Design Specialists (3)</b> - Modern API architectures</summary>

- `graphql-specialist` - GraphQL schema design, Apollo Server/Client, subscriptions, DataLoader, federation
- `grpc-specialist` - Protocol Buffers, gRPC services, streaming patterns, interceptors, cross-language RPC
- `openapi-specialist` - REST API design, OpenAPI 3.1 specs, validation, Swagger/ReDoc, code generation

</details>

<details>
<summary><b>📨 Message Queue Specialists (2)</b> - Async messaging</summary>

- `kafka-specialist` - Apache Kafka producers/consumers, Kafka Streams, event-driven architecture, schema registry
- `rabbitmq-specialist` - RabbitMQ exchanges, routing patterns, work queues, pub/sub, RPC patterns

</details>

<details>
<summary><b>🧪 Advanced Testing Specialists (2)</b> - Quality assurance</summary>

- `playwright-specialist` - E2E testing, browser automation, visual regression, Page Object Model, cross-browser
- `load-testing-specialist` - k6, Locust, stress testing, capacity planning, performance benchmarking

</details>

<details>
<summary><b>🔍 Search Infrastructure (2)</b> - Full-text search and discovery</summary>

- `elasticsearch-specialist` - Full-text search, aggregations, analyzers, distributed search, log analytics with Elasticsearch
- `algolia-specialist` - Hosted search-as-a-service, instant search UI, typo tolerance, personalization, A/B testing

</details>

<details>
<summary><b>⚡ Caching Infrastructure (2)</b> - High-performance caching</summary>

- `redis-cache-specialist` - Distributed caching, cache-aside/write-through patterns, rate limiting, session management
- `cdn-specialist` - Cloudflare, CloudFront edge caching, DDoS protection, edge computing, global content delivery

</details>

<details>
<summary><b>☁️ Multi-Cloud Providers (2)</b> - Azure and GCP deployments</summary>

- `azure-specialist` - Azure Functions, App Service, Cosmos DB, AKS, Service Bus, Azure DevOps, enterprise integrations
- `gcp-specialist` - Cloud Functions, Cloud Run, Firestore, BigQuery, Pub/Sub, GKE, data analytics

</details>

<details>
<summary><b>📈 Monitoring & Logging (2)</b> - Observability and operational intelligence</summary>

- `prometheus-grafana-specialist` - Prometheus metrics, PromQL queries, Grafana dashboards, alerting, SLI/SLO tracking
- `elk-stack-specialist` - Elasticsearch, Logstash, Kibana for centralized logging, log analysis, operational intelligence

</details>

<details>
<summary><b>📚 Documentation & Analysis (6)</b> - Knowledge</summary>

- `technical-writer` - README, guides
- `api-documenter` - API reference
- `architecture-documenter` - System design docs
- `requirements-analyzer` - Requirements extraction
- `dependency-analyzer` - Dependency management
- `code-archaeologist` - Legacy code analysis

</details>

---

## 📖 Usage Guide

### Using Workflows (Slash Commands)

Workflows are the easiest way to accomplish complex tasks.

#### 1. Create New Project: `/new-project`

**Syntax:**
```bash
/new-project "Project description with requirements"
```

**Example:**
```bash
/new-project "Build an e-commerce API with:
- User authentication (OAuth2 + JWT)
- Product catalog with search and filters
- Shopping cart and checkout
- Payment integration (Stripe)
- Order management
- Admin dashboard
- Email notifications"
```

**What Happens:**
1. Requirements analyzed → architecture designed → **you approve**
2. Project structure initialized
3. Backend, frontend, database implemented (parallel)
4. Comprehensive tests written (80%+ coverage)
5. Security audit, performance check
6. CI/CD pipeline configured
7. Documentation generated
8. Deployed to staging → production

**When to Use:**
- Starting a new project from scratch
- Need complete, production-ready application
- Want autonomous end-to-end development

---

#### 2. Add Feature: `/add-feature`

**Syntax:**
```bash
/add-feature "Feature description with acceptance criteria"
```

**Example:**
```bash
/add-feature "Add two-factor authentication with:
- SMS verification option
- Authenticator app (TOTP) option
- Backup codes (10 codes)
- Remember device for 30 days
- Force 2FA for admin users"
```

**What Happens:**
1. Feature requirements analyzed
2. Database schema updated (if needed)
3. Backend API implemented
4. Frontend UI implemented
5. Integration tests written
6. All quality gates passed (security, code review, tests)
7. Documentation updated
8. Deployed to production

**When to Use:**
- Adding functionality to existing project
- Implementing user stories
- Feature spans multiple components

---

#### 3. Security Audit: `/security-audit`

**Syntax:**
```bash
/security-audit
```

**What Happens:**
1. OWASP Top 10 vulnerability scan
2. Hardcoded secrets detection
3. Dependency CVE check
4. Authentication/authorization review
5. Input validation audit
6. Encryption verification
7. Comprehensive report generated
8. Critical issues auto-fixed (with approval)

**When to Use:**
- Before production deployment
- After major changes to auth/security
- Regular security assessments
- Compliance requirements

---

#### 4. Optimize Performance: `/optimize-performance`

**Syntax:**
```bash
/optimize-performance [target]
```

**Example:**
```bash
/optimize-performance "API response times are slow, especially /products endpoint"
```

**What Happens:**
1. Performance profiling
2. Bottleneck identification
3. Optimization recommendations
4. Implementation of fixes
5. Before/after benchmarks
6. Regression testing

**When to Use:**
- Slow response times
- High resource usage
- Scaling issues
- Regular performance reviews

---

#### 5. Refactor: `/refactor`

**Syntax:**
```bash
/refactor "Description of refactoring goal"
```

**Example:**
```bash
/refactor "Extract authentication logic into reusable AuthService with proper error handling"
```

**What Happens:**
1. Current code analyzed
2. Refactoring strategy designed
3. Tests verified (or written if missing)
4. Code refactored incrementally
5. All tests kept passing
6. No behavior changes verified
7. Documentation updated

**When to Use:**
- Code smells or technical debt
- Improving maintainability
- Extracting reusable components
- Simplifying complex code

---

#### 6. Fix Bug: `/fix-bug`

**Syntax:**
```bash
/fix-bug "Bug description and reproduction steps"
```

**Example:**
```bash
/fix-bug "Users can't login after password reset. Steps: 1) Request password reset 2) Click reset link 3) Enter new password 4) Login fails with 401 error"
```

**What Happens:**
1. **Bug Triage** - Reproduce bug, create failing test
2. **Root Cause Analysis** - Debug with profiler, logs, traces
3. **Implementation** - Fix root cause (not symptom)
4. **Comprehensive Testing** - Regression tests, all quality gates
5. **Documentation & Deployment** - Deploy with monitoring

**When to Use:**
- Production bugs
- User-reported issues
- Regression bugs
- Performance bugs

---

#### 7. Deploy: `/deploy`

**Syntax:**
```bash
/deploy [environment] [strategy]
```

**Example:**
```bash
/deploy "production" "blue-green"
```

**Deployment Strategies:**
- **Blue-Green**: Zero-downtime with instant rollback
- **Rolling**: Gradual instance replacement
- **Canary**: Incremental traffic shift (5% → 100%)

**What Happens:**
1. Pre-deployment validation (tests, security, build)
2. Staging deployment and smoke tests
3. Production deployment with chosen strategy
4. Post-deployment monitoring
5. Automatic rollback if issues detected

**When to Use:**
- Production deployments
- Staging releases
- Hotfix deployments

---

#### 8. Test Web UI: `/test-web-ui`

**Syntax:**
```bash
/test-web-ui [url] [options]
```

**Example:**
```bash
/test-web-ui "http://localhost:3000" --fix-issues --generate-tests
```

**What Happens:**
1. **Visual Testing** - Screenshot comparison, responsive design
2. **Functional Testing** - User flows, forms, interactions
3. **Accessibility Testing** - WCAG 2.1 AA/AAA compliance with axe-core
4. **Performance Testing** - Core Web Vitals (LCP, FID, CLS)
5. **Browser DevTools Integration** - Console errors, network failures
6. **Auto-Fix Issues** - Missing alt text, ARIA labels, contrast
7. **Generate Test Suite** - Playwright/Cypress tests from interactions

**What It Tests:**
- Visual regression (< 0.5% pixel difference)
- Mobile/tablet/desktop responsiveness
- Form validation and submission
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader compatibility (ARIA labels)
- Color contrast ratios (4.5:1 for text)
- JavaScript coverage
- Loading performance

**When to Use:**
- Before production deployment
- After UI changes
- Accessibility compliance audits
- Visual regression testing
- Automated test generation

---

#### 9. Build ML Pipeline: `/build-ml-pipeline`

**Syntax:**
```bash
/build-ml-pipeline "ML problem description with data sources and requirements"
```

**Example:**
```bash
/build-ml-pipeline "Build customer churn prediction model. Data in PostgreSQL. Need real-time predictions via API. Weekly retraining."
```

**What Happens:**
1. **Requirements & Design** - Problem type, architecture design, success metrics
2. **Data Pipeline** - Ingestion, feature engineering, data quality checks (Great Expectations)
3. **Model Training** - Multiple models, hyperparameter tuning (Optuna), experiment tracking (MLflow)
4. **MLOps Deployment** - Model registry, FastAPI serving, Kubernetes deployment, A/B testing
5. **Monitoring** - Prediction monitoring, data drift detection, performance tracking
6. **Continuous Training** - Automated retraining triggers, canary deployment

**Deliverables:**
- Airflow data pipelines
- Trained models with MLflow tracking
- Containerized API (FastAPI + Docker)
- Kubernetes deployment with auto-scaling
- Grafana dashboards for model metrics
- Automated retraining pipeline

**When to Use:**
- Building ML systems from scratch
- Deploying ML models to production
- Need automated ML lifecycle
- Data science → production gap

---

#### 10. Setup Monitoring: `/setup-monitoring`

**Syntax:**
```bash
/setup-monitoring [system-description]
```

**Example:**
```bash
/setup-monitoring "Kubernetes cluster with 20 microservices. Need metrics, logs, traces, and SLO monitoring with PagerDuty."
```

**What Happens:**
1. **Requirements & Architecture** - Analyze system, define SLOs, design monitoring stack
2. **Metrics Infrastructure** - Deploy Prometheus, Grafana, exporters
3. **Application Instrumentation** - Add metrics, structured logging, distributed tracing
4. **Logging Infrastructure** - Deploy Loki/ELK stack, log aggregation, retention policies
5. **Distributed Tracing** - Deploy Tempo/Jaeger, OpenTelemetry collector
6. **Dashboards** - Infrastructure, application, SLO, database dashboards
7. **Alerting** - Configure Alertmanager, PagerDuty, Slack, runbooks
8. **Performance Optimization** - HA setup, long-term storage, query optimization

**Deliverables:**
- Prometheus + Grafana stack
- Loki/ELK for log aggregation
- Tempo/Jaeger for distributed tracing
- Comprehensive dashboards
- Alert rules with PagerDuty/Slack integration
- SLO tracking and error budgets
- On-call runbooks

**When to Use:**
- New production deployments
- Replacing legacy monitoring
- Implementing SRE practices
- Compliance requirements (SOC2, ISO27001)

---

#### 11. Modernize Legacy: `/modernize-legacy`

**Syntax:**
```bash
/modernize-legacy "Description of legacy system and modernization goals"
```

**Example:**
```bash
/modernize-legacy "Django 2.2 app to Django 4.2. PostgreSQL with 10M+ records. Zero downtime required."
```

**What Happens:**
1. **Assessment** - Analyze legacy codebase, dependencies, risks, create migration strategy
2. **Test Coverage** - Establish comprehensive test suite (characterization tests, integration, E2E)
3. **Incremental Migration** - Use Strangler Fig or Branch by Abstraction patterns for safe migration
4. **Data Migration** - Dual-write strategy for zero data loss, schema migration
5. **Performance** - Benchmark and optimize, ensure modern code performs better
6. **Documentation** - Technical docs, migration guides, runbooks
7. **Deployment** - Blue-green or canary deployment with monitoring and rollback

**Modernization Patterns:**
- **Strangler Fig**: New implementation alongside legacy, gradual traffic shift
- **Branch by Abstraction**: Extract interface, swap implementations
- **Parallel Run**: Run both, compare results, switch when confident

**Deliverables:**
- Modernized codebase
- 80%+ test coverage
- Zero downtime migration
- Performance improvements
- Complete documentation
- Rollback plan

**When to Use:**
- Python 2 → 3, Java 8 → 17 upgrades
- Framework migrations (Django, React, Angular versions)
- Monolith → microservices transformation
- Legacy tech stack modernization

---

#### 12. Optimize Costs: `/optimize-costs`

**Syntax:**
```bash
/optimize-costs "Cloud environment description and cost reduction goals"
```

**Example:**
```bash
/optimize-costs "AWS spending $50k/month. Microservices on EKS, RDS, S3 storage. Need 40% reduction."
```

**What Happens:**
1. **Cost Analysis** - Break down spend by service, identify waste, top cost drivers
2. **Right-Sizing** - Analyze CPU/memory utilization, recommend instance type changes
3. **Storage Optimization** - S3 lifecycle policies, remove unattached volumes, gp2→gp3
4. **Reserved Capacity** - Calculate RI/Savings Plan recommendations, spot instance opportunities
5. **Auto-Scaling** - Configure ASGs, scheduled scaling for dev/test environments
6. **Networking** - VPC endpoints, CloudFront CDN, load balancer consolidation
7. **FinOps Monitoring** - Cost anomaly detection, budgets, tagging enforcement, showback/chargeback

**Typical Savings:**
- **Compute**: 30-50% (right-sizing, reserved instances, spot, auto-scaling)
- **Storage**: 20-40% (lifecycle policies, intelligent tiering, volume optimization)
- **Database**: 20-40% (right-sizing, reserved instances, Aurora Serverless)
- **Networking**: 10-30% (VPC endpoints, CDN, load balancer consolidation)

**Deliverables:**
- Cost breakdown and waste analysis
- Right-sizing recommendations
- Implemented optimizations
- FinOps monitoring dashboards
- 30-60% cost reduction achieved

**When to Use:**
- Cloud bill optimization
- Cost reduction initiatives
- Budget constraints
- FinOps implementation
- Quarterly cost reviews

---

### Using Agents Directly

For more control, invoke agents directly in your conversation.

#### Syntax

```
Use the [agent-name] agent to [task description]
```

#### Examples

**Architecture Design:**
```
Use the architect agent to design a microservices architecture for a social media platform with 1M users
```

**Code Review:**
```
Use the code-reviewer agent to review the authentication implementation in src/auth/
```

**Security Check:**
```
Use the security-auditor agent to audit the payment processing code for vulnerabilities
```

**Test Implementation:**
```
Use the test-engineer agent to write comprehensive tests for the UserService class
```

**Language-Specific Development:**
```
Use the python-developer agent to implement a FastAPI endpoint for file uploads with validation

Use the typescript-developer agent to create a React component for real-time notifications with WebSocket

Use the go-developer agent to implement a high-performance message queue consumer
```

---

### Quality Gates

Every change goes through validation:

```
Code Written
    ↓
Code Review ✅ (Best practices, SOLID, clean code)
    ↓
Tests ✅ (80%+ coverage, all passing)
    ↓
Security ✅ (OWASP, no vulnerabilities)
    ↓
Performance ✅ (Response times, no N+1 queries)
    ↓
Accessibility ✅ (WCAG 2.1 AA for UI)
    ↓
Deploy 🚀
```

**All gates must pass.** No exceptions.

---

## 🛠️ Extending the System

### Creating Custom Agents

Agents are defined as Markdown files with YAML frontmatter.

#### Agent File Structure

```
.claude/agents/[category]/my-agent.md
```

**Categories:**
- `orchestration/` - Meta-orchestrators
- `development/` - Development agents
- `quality/` - QA agents
- `devops/` - DevOps agents
- `documentation/` - Documentation agents
- `analysis/` - Analysis agents

#### Example: Create a Mobile Developer Agent

**File:** `.claude/agents/development/mobile-developer.md`

```markdown
---
name: mobile-developer
description: Expert mobile developer specializing in iOS (Swift), Android (Kotlin), and React Native. Use for mobile app development, native features, app store deployment, and mobile-specific optimization.
model: claude-sonnet-4-5
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
---

# Mobile Developer Agent

You are an expert mobile developer with mastery of iOS, Android, and cross-platform development.

## Core Competencies

- **iOS**: Swift, SwiftUI, UIKit, Xcode
- **Android**: Kotlin, Jetpack Compose, Android Studio
- **Cross-Platform**: React Native, Flutter
- **Mobile APIs**: Camera, GPS, Push Notifications, Biometrics
- **App Store**: Deployment, TestFlight, Play Console
- **Testing**: XCTest, Espresso, Detox

## iOS Development (Swift)

### SwiftUI View Example

\```swift
import SwiftUI

struct TaskListView: View {
    @StateObject private var viewModel = TaskListViewModel()

    var body: some View {
        NavigationView {
            List(viewModel.tasks) { task in
                TaskRow(task: task)
            }
            .navigationTitle("Tasks")
            .toolbar {
                Button(action: viewModel.addTask) {
                    Image(systemName: "plus")
                }
            }
        }
        .onAppear {
            viewModel.loadTasks()
        }
    }
}
\```

### Networking with async/await

\```swift
actor TaskService {
    func fetchTasks() async throws -> [Task] {
        let url = URL(string: "https://api.example.com/tasks")!
        let (data, _) = try await URLSession.shared.data(from: url)
        return try JSONDecoder().decode([Task].self, from: data)
    }
}
\```

## Android Development (Kotlin)

### Jetpack Compose UI

\```kotlin
@Composable
fun TaskListScreen(viewModel: TaskListViewModel = viewModel()) {
    val tasks by viewModel.tasks.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Tasks") })
        },
        floatingActionButton = {
            FloatingActionButton(onClick = { viewModel.addTask() }) {
                Icon(Icons.Default.Add, contentDescription = "Add")
            }
        }
    ) { padding ->
        LazyColumn(modifier = Modifier.padding(padding)) {
            items(tasks) { task ->
                TaskItem(task = task)
            }
        }
    }
}
\```

### Coroutines and Flow

\```kotlin
class TaskRepository(private val api: TaskApi) {
    fun getTasks(): Flow<List<Task>> = flow {
        val tasks = api.fetchTasks()
        emit(tasks)
    }.flowOn(Dispatchers.IO)
}
\```

## Best Practices

### DO
✅ Follow platform design guidelines (HIG for iOS, Material for Android)
✅ Implement offline-first architecture
✅ Optimize battery and network usage
✅ Handle different screen sizes and orientations
✅ Implement proper error handling
✅ Use dependency injection
✅ Write UI and unit tests

### DON'T
❌ Block the main thread
❌ Ignore memory management
❌ Skip accessibility features
❌ Hardcode API URLs or secrets
❌ Ignore app lifecycle events
❌ Skip App Store guidelines

Your deliverables should be production-ready, optimized, accessible mobile applications.
```

#### Using Your Custom Agent

```
Use the mobile-developer agent to create an iOS app for task management with SwiftUI
```

---

### Creating Custom Skills

Skills provide reusable expertise that Claude automatically activates when relevant.

#### Skill File Structure

```
.claude/skills/[category]/[skill-name]/SKILL.md
```

**Categories:**
- `languages/` - Programming languages
- `frameworks/` - Frameworks (React, Django, etc.)
- `tools/` - Tools (Git, Docker, etc.)
- `practices/` - Best practices (TDD, DDD, etc.)
- `domains/` - Domain expertise (ML, blockchain, etc.)

#### Example: Create a GraphQL Skill

**File:** `.claude/skills/tools/graphql/SKILL.md`

```markdown
---
name: graphql
description: Expertise in GraphQL API design, schema definition, resolvers, queries, mutations, subscriptions, and performance optimization. Activate when building or consuming GraphQL APIs.
---

# GraphQL Skill

Expert knowledge in GraphQL for building type-safe, efficient APIs.

## GraphQL Schema Design

### Best Practices

**DO:**
- Use descriptive names for types and fields
- Implement pagination (cursor-based preferred)
- Use enums for fixed sets of values
- Add descriptions to all schema elements
- Version with field deprecation, not endpoints

**DON'T:**
- Use verbs in query names (get, fetch, etc.)
- Return null when empty list is better
- Over-nest types (keep schema flat)
- Ignore N+1 query problems

### Schema Example

\```graphql
"""
A user in the system
"""
type User {
  id: ID!
  email: String!
  name: String!
  posts(first: Int, after: String): PostConnection!
  createdAt: DateTime!
}

"""
A blog post
"""
type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  published: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
}

"""
Paginated post results
"""
type PostConnection {
  edges: [PostEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type PostEdge {
  node: Post!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Query {
  user(id: ID!): User
  posts(first: Int, after: String): PostConnection!
  post(id: ID!): Post
}

type Mutation {
  createPost(input: CreatePostInput!): CreatePostPayload!
  updatePost(input: UpdatePostInput!): UpdatePostPayload!
  deletePost(id: ID!): DeletePostPayload!
}

input CreatePostInput {
  title: String!
  content: String!
  published: Boolean = false
}

type CreatePostPayload {
  post: Post!
  errors: [Error!]
}
\```

## Resolver Implementation

### Node.js with TypeScript

\```typescript
import { GraphQLResolvers } from './generated/graphql';
import DataLoader from 'dataloader';

export const resolvers: GraphQLResolvers = {
  Query: {
    user: async (_, { id }, { dataSources }) => {
      return dataSources.users.findById(id);
    },

    posts: async (_, { first, after }, { dataSources }) => {
      return dataSources.posts.findMany({ first, after });
    },
  },

  Mutation: {
    createPost: async (_, { input }, { dataSources, user }) => {
      if (!user) throw new Error('Authentication required');

      const post = await dataSources.posts.create({
        ...input,
        authorId: user.id,
      });

      return { post, errors: [] };
    },
  },

  User: {
    posts: async (user, { first, after }, { dataSources }) => {
      // Avoid N+1: use DataLoader
      return dataSources.posts.findByAuthorId(user.id, { first, after });
    },
  },

  Post: {
    author: async (post, _, { loaders }) => {
      // DataLoader batches and caches
      return loaders.user.load(post.authorId);
    },
  },
};
\```

### DataLoader for N+1 Prevention

\```typescript
import DataLoader from 'dataloader';

export function createLoaders(dataSources) {
  return {
    user: new DataLoader(async (ids: readonly number[]) => {
      const users = await dataSources.users.findByIds(ids);
      const userMap = new Map(users.map(u => [u.id, u]));
      return ids.map(id => userMap.get(id));
    }),
  };
}
\```

## Client Usage

### Apollo Client (React)

\```typescript
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_POSTS = gql\`
  query GetPosts($first: Int!, $after: String) {
    posts(first: $first, after: $after) {
      edges {
        node {
          id
          title
          author {
            name
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
\`;

function PostList() {
  const { data, loading, fetchMore } = useQuery(GET_POSTS, {
    variables: { first: 20 },
  });

  const loadMore = () => {
    fetchMore({
      variables: {
        after: data.posts.pageInfo.endCursor,
      },
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {data.posts.edges.map(({ node }) => (
        <PostCard key={node.id} post={node} />
      ))}
      {data.posts.pageInfo.hasNextPage && (
        <button onClick={loadMore}>Load More</button>
      )}
    </div>
  );
}
\```

## Performance Optimization

### Techniques

1. **DataLoader**: Batch and cache database queries
2. **Field-level caching**: Cache expensive resolvers
3. **Query complexity limits**: Prevent expensive queries
4. **Depth limiting**: Limit query nesting
5. **Persisted queries**: Pre-approve queries
6. **Automatic batching**: Batch requests from client

### Example: Query Complexity

\```typescript
import { GraphQLSchema } from 'graphql';
import { createComplexityLimitRule } from 'graphql-validation-complexity';

const complexityLimit = createComplexityLimitRule(1000, {
  onCost: (cost) => console.log('Query cost:', cost),
});

const schema = new GraphQLSchema({
  query: QueryType,
  validationRules: [complexityLimit],
});
\```

## Testing

\```typescript
import { graphql } from 'graphql';
import { schema } from './schema';

describe('Post mutations', () => {
  it('should create post', async () => {
    const mutation = \`
      mutation {
        createPost(input: {
          title: "Test Post"
          content: "Test content"
        }) {
          post {
            id
            title
          }
          errors
        }
      }
    \`;

    const result = await graphql({
      schema,
      source: mutation,
      contextValue: { user: { id: 1 } },
    });

    expect(result.data.createPost.post.title).toBe('Test Post');
    expect(result.data.createPost.errors).toHaveLength(0);
  });
});
\```

Use this skill when building GraphQL APIs to ensure type safety, performance, and best practices.
```

#### Skills Auto-Activate

Skills are automatically activated when Claude detects they're relevant to the task. No explicit invocation needed!

---

### Creating Custom Workflows

Workflows orchestrate multiple agents to complete complex tasks.

#### Workflow File Structure

```
.claude/commands/my-workflow.md
```

#### Example: Create a Bug Fix Workflow

**File:** `.claude/commands/fix-bug.md`

```markdown
---
description: Reproduce, fix, and validate bugs with regression tests
argumentHint: "[bug-description]"
---

# Bug Fix Workflow

You are orchestrating a comprehensive bug fix from reproduction to deployment.

## Workflow Steps

### Step 1: Bug Reproduction (10%)

1. **Understand the Bug**
   - Read bug description carefully
   - Identify affected components
   - Determine reproduction steps
   - Gather error messages/logs

2. **Reproduce Locally**
   Use appropriate agent to reproduce:
   - Frontend bug → `frontend-developer`
   - Backend bug → `backend-developer` or language-specific
   - Integration bug → `fullstack-developer`

3. **Write Failing Test**
   Use `test-engineer` agent to:
   - Write test that reproduces bug
   - Verify test fails consistently
   - Document expected vs actual behavior

**CHECKPOINT:** Bug successfully reproduced with failing test

### Step 2: Root Cause Analysis (20%)

1. **Analyze Code**
   Use `code-archaeologist` if:
   - Legacy/unfamiliar code
   - Complex codebase
   - Unclear bug source

2. **Identify Root Cause**
   - Examine stack trace
   - Review related code
   - Check recent changes (git blame)
   - Identify exact cause

3. **Design Fix**
   - Determine minimal fix
   - Consider side effects
   - Plan refactoring if needed
   - Document approach

### Step 3: Implementation (30%)

1. **Implement Fix**
   Use appropriate development agent:
   - Keep changes minimal
   - Fix root cause, not symptoms
   - Maintain code quality
   - Add comments if complex

2. **Verify Test Passes**
   - Run failing test → should pass
   - Run all related tests
   - No new failures introduced

3. **Add Edge Case Tests**
   Use `test-engineer` to:
   - Test boundary conditions
   - Test error handling
   - Prevent similar bugs

### Step 4: Quality Validation (30%)

Run quality gates in parallel:

1. **Code Review** - `code-reviewer`:
   - Verify fix is correct
   - No code smells introduced
   - Best practices followed

2. **Security Check** - `security-auditor`:
   - No new vulnerabilities
   - Input validation if relevant
   - No security regressions

3. **Performance Check** - `performance-analyzer`:
   - No performance degradation
   - No N+1 queries introduced
   - Benchmarks if performance-critical

### Step 5: Documentation & Deployment (10%)

1. **Update Documentation**
   - Add comments to complex fixes
   - Update README if behavior changed
   - Document known limitations

2. **Create Commit**
   ```
   fix: [component] brief description

   Fixes #123

   Root cause: [explanation]
   Solution: [explanation]
   Testing: [how it was tested]
   ```

3. **Deploy**
   - Deploy to staging
   - Verify fix in staging
   - Deploy to production
   - Monitor for issues

## Success Criteria

Bug fix is complete when:
- ✅ Bug reproduced with failing test
- ✅ Root cause identified and documented
- ✅ Fix implemented and test passes
- ✅ All quality gates passed
- ✅ No new bugs introduced
- ✅ Documentation updated
- ✅ Deployed and verified

## Example Usage

\```
/fix-bug "Users can't upload files larger than 5MB. Getting 500 error.
Error log shows 'Request Entity Too Large'. Should support up to 50MB."
\```

## Anti-Patterns

❌ Don't fix symptoms, fix root cause
❌ Don't skip writing regression test
❌ Don't ignore quality gates
❌ Don't deploy without verification
❌ Don't forget to document complex fixes

## Notes

- Always write regression test first
- Keep fixes minimal and focused
- Test thoroughly before deploying
- Monitor after deployment
- Document lessons learned
```

#### Using Your Custom Workflow

```bash
/fix-bug "Users getting timeout error when uploading large files"
```

---

## 🌟 Real-World Examples

### Example 1: SaaS Application

**Goal:** Build a complete SaaS application for team collaboration

```bash
/new-project "Build a team collaboration SaaS with:
- Multi-tenant architecture (separate data per team)
- User authentication (OAuth2, Google/GitHub login)
- Real-time chat and notifications (WebSocket)
- File sharing and document collaboration
- Team management (invite, roles, permissions)
- Subscription billing (Stripe integration)
- Admin dashboard with analytics
- Email notifications
- 99.9% uptime requirement
- Support 10,000 teams"
```

**Result:**
- Complete microservices architecture
- React + TypeScript frontend
- Node.js + TypeScript backend
- PostgreSQL database with proper multi-tenancy
- Redis for caching and sessions
- WebSocket for real-time features
- Stripe integration for billing
- AWS deployment (ECS Fargate)
- CI/CD with GitHub Actions
- Comprehensive test suite (85% coverage)
- Security audit passed
- Full documentation

**Time:** 2-3 days for complete, production-ready application

---

### Example 2: Add Advanced Feature

**Goal:** Add AI-powered content moderation

```bash
/add-feature "Implement AI content moderation with:
- Automatic detection of inappropriate content (text, images)
- Content flagging with confidence scores
- Manual review queue for moderators
- Configurable moderation rules per team
- Appeal system for false positives
- Audit log of all moderation actions
- Integration with OpenAI Moderation API"
```

**Implementation:**
1. Database schema for moderation (flags, rules, appeals)
2. Backend service for AI integration
3. Queue system for async processing
4. Admin UI for review queue
5. User-facing appeal system
6. Comprehensive tests including AI mock responses
7. Security audit (API key management)
8. Performance testing (handle 1000 items/minute)

**Time:** 4-6 hours for complete feature

---

### Example 3: Migration Project

**Goal:** Migrate legacy PHP application to modern stack

```bash
/new-project "Migrate legacy PHP application to modern architecture:

Current State:
- Monolithic PHP application (10 years old)
- MySQL database (100GB data)
- jQuery frontend
- No tests
- Manual deployment

Target State:
- Microservices architecture
- Python (FastAPI) backend
- React + TypeScript frontend
- PostgreSQL database
- Comprehensive test coverage
- CI/CD automated deployment
- Zero downtime migration"
```

**Orchestration Strategy:**
1. Architect designs phased migration approach
2. Code archaeologist analyzes legacy codebase
3. Database specialist designs migration strategy
4. Implement new services incrementally (strangler pattern)
5. Test extensively at each phase
6. Gradual traffic cutover
7. Legacy system decommissioning

---

## 💡 Best Practices

### For Users

#### 1. Write Clear Requirements

**❌ Bad:**
```
/new-project "Build a website"
```

**✅ Good:**
```
/new-project "Build an e-commerce website with:
- User registration and authentication
- Product catalog with 10,000+ items
- Search with filters (price, category, ratings)
- Shopping cart with guest checkout
- Stripe payment integration
- Order tracking and history
- Admin panel for inventory management
- Mobile-responsive design
- Support 1000 concurrent users"
```

#### 2. Review Architecture Early

When prompted for architecture approval:
- ✅ Review technology choices
- ✅ Check scalability approach
- ✅ Verify security considerations
- ✅ Confirm deployment strategy
- ❌ Don't skip this step!

#### 3. Trust the Quality Gates

Quality gates exist to prevent production issues:
- ✅ Let all gates run
- ✅ Address failures properly
- ❌ Don't try to skip gates
- ❌ Don't ignore warnings

#### 4. Provide Feedback

Help agents improve by:
- Clarifying when they misunderstand
- Providing additional context when needed
- Confirming when results are correct

---

### For Developers

#### 1. Choose the Right Agent

| Task | Agent |
|------|-------|
| System design | `architect` |
| Python API | `python-developer` |
| React frontend | `typescript-developer` or `frontend-developer` |
| Full-stack feature | `fullstack-developer` |
| Code review | `code-reviewer` |
| Security check | `security-auditor` |
| Writing tests | `test-engineer` |
| AWS deployment | `aws-specialist` |

#### 2. Let Agents Work in Parallel

```
✅ Good:
Use backend-developer and frontend-developer in parallel
to implement user dashboard feature

❌ Bad:
Use backend-developer, wait for completion,
then use frontend-developer
```

#### 3. Write Comprehensive Agent Prompts

**❌ Vague:**
```
Use python-developer to add authentication
```

**✅ Specific:**
```
Use python-developer to implement JWT-based authentication with:
- Login endpoint (email + password)
- Token refresh endpoint
- Password hashing with bcrypt (cost factor 12)
- Token expiration (access: 1 hour, refresh: 7 days)
- Rate limiting (5 attempts per minute)
- Comprehensive tests
- OpenAPI documentation
```

---

## 🔧 Troubleshooting

### Common Issues

#### Issue: Agent Not Found

**Error:**
```
Agent 'my-agent' not found
```

**Solution:**
1. Check agent file exists: `.claude/agents/[category]/my-agent.md`
2. Verify filename matches agent name in frontmatter
3. Ensure YAML frontmatter is valid
4. Restart Claude Code to reload agents

---

#### Issue: Workflow Not Working

**Error:**
```
Slash command '/my-workflow' not found
```

**Solution:**
1. Check workflow file exists: `.claude/commands/my-workflow.md`
2. Verify YAML frontmatter has `description` field
3. Restart Claude Code
4. Use correct syntax: `/my-workflow` not `/my_workflow`

---

#### Issue: Quality Gate Failing

**Error:**
```
Security audit failed: Hardcoded API key found in config.py
```

**Solution:**
1. Read the failure message carefully
2. Fix the identified issue
3. Re-run the quality gate
4. Don't try to skip the gate
5. If you disagree with the finding, consult with the team

---

#### Issue: Agent Producing Incorrect Code

**Problem:**
Agent is implementing feature incorrectly

**Solution:**
1. Provide more specific requirements
2. Include examples of desired behavior
3. Specify technology stack explicitly
4. Review and correct agent output
5. Consider using a different agent
6. Update agent definition if pattern repeats

---

#### Issue: Slow Performance

**Problem:**
Workflows taking too long

**Solution:**
1. Use parallel execution where possible
2. Check if agents are running sequentially when they could be parallel
3. Reduce scope of tasks (break into smaller steps)
4. Use specific agents instead of general-purpose
5. Check network connectivity (for external API calls)

---

### Getting Help

**Documentation:**
- `ARCHITECTURE.md` - System design details
- Agent markdown files - Individual agent capabilities
- Skill markdown files - Skill expertise areas

**Community:**
- GitHub Issues - Bug reports and feature requests
- GitHub Discussions - Questions and discussions

---

## 🏛️ Architecture Deep Dive

### Orchestration Patterns

#### Pattern 1: Hierarchical (Project Creation)

```
project-orchestrator (Opus 4 - Strategic)
    ↓
    ├─→ architect (Design)
    ↓
    ├─→ python-developer (Backend)
    ├─→ typescript-developer (Frontend) [Parallel]
    ├─→ database-specialist (Schema)
    ↓
    ├─→ code-reviewer
    ├─→ security-auditor [Parallel Quality Gates]
    ├─→ test-engineer
    ↓
    └─→ aws-specialist (Deploy)
```

#### Pattern 2: Feature Pipeline

```
feature-orchestrator
    ↓
Analyze → Design → Implement → Test → Review → Deploy
           ↓
       [Split]
    Backend (parallel)
    Frontend (parallel)
    Database (parallel)
           ↓
      [Merge]
    Integration
```

#### Pattern 3: Quality Diamond

```
         Code Written
              ↓
        [Fork 5 ways]
    ┌──────┬──────┬──────┬──────┐
    ↓      ↓      ↓      ↓      ↓
  Review Security Tests Perf  A11y
    └──────┴──────┴──────┴──────┘
              ↓
          [All Pass]
              ↓
           Deploy
```

### Context Management

**Problem:** Long conversations degrade performance

**Solution:** Context forking

```
Main Agent (50k tokens - high-level only)
    ↓
    ├─→ Subagent A (20k tokens - forked, focused)
    ├─→ Subagent B (20k tokens - forked, focused)
    └─→ Subagent C (20k tokens - forked, focused)
```

**Benefits:**
- Main agent stays focused
- Subagents get clean context
- Parallel execution possible
- Total context: 50k + 3×20k = 110k (distributed)

---

## 🤝 Contributing

We welcome contributions! Here's how:

### Adding an Agent

1. Create agent file: `.claude/agents/[category]/agent-name.md`
2. Follow existing agent format (frontmatter + markdown)
3. Include comprehensive examples
4. Test thoroughly
5. Submit PR with:
   - Agent file
   - Documentation updates
   - Example usage

### Adding a Skill

1. Create skill directory: `.claude/skills/[category]/skill-name/`
2. Create `SKILL.md` with frontmatter
3. Add supporting files if needed (examples, templates)
4. Test auto-activation
5. Submit PR

### Adding a Workflow

1. Create workflow file: `.claude/commands/workflow-name.md`
2. Include YAML frontmatter with description
3. Document all steps clearly
4. Specify which agents to use
5. Include examples
6. Submit PR

### Contribution Guidelines

- Follow existing patterns and conventions
- Write clear, comprehensive documentation
- Include practical examples
- Test thoroughly before submitting
- One feature per PR
- Update README if needed

---

## 📊 Project Stats

- **72+ Agents** across 4 layers
- **12,000+ Lines** of documentation and agent definitions
- **11 Languages** with specialized developers (Python, TypeScript, Java, Go, Rust, C#, Swift, Kotlin, Ruby, PHP, C++)
- **5 Quality Gates** for enterprise standards
- **13 Workflow** commands for autonomous operations
- **100%** Autonomous operation from requirements to production

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

Built on research and inspiration from:
- **VoltAgent/awesome-claude-code-subagents** - Comprehensive agent collection
- **wshobson/agents** - Production-ready patterns
- **Anthropic's Claude Code** - Best practices and capabilities
- **Industry Standards** - OWASP, WCAG, SOC2, GDPR
- **Enterprise Patterns** - Microservices, event-driven, cloud-native

---

## 📞 Support & Community

- **Documentation**: [ARCHITECTURE.md](ARCHITECTURE.md) for deep dive
- **Issues**: [GitHub Issues](https://github.com/your-org/repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/repo/discussions)
- **Website**: [Your Website]
- **Twitter**: [@YourHandle]

---

**Ready to transform your development workflow?**

```bash
git clone https://github.com/your-org/claude-orchestration .claude
claude-code
/new-project "Your amazing idea here"
```

**Welcome to autonomous software engineering.** 🚀

---

<div align="center">

**Built with ❤️ for the Claude Code community**

[⭐ Star this repo](https://github.com/your-org/repo) • [🐛 Report Bug](https://github.com/your-org/repo/issues) • [💡 Request Feature](https://github.com/your-org/repo/issues)

</div>
