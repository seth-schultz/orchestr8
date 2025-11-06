# Quick Start Guide

Get started with the Claude Code Orchestration System in 5 minutes!

---

## Installation (Choose One)

### Option 1: Plugin Marketplace (Easiest)

```bash
/plugin marketplace add orchestr8
```

That's it! Skip to [First Steps](#first-steps).

### Option 2: Git Clone

```bash
# Navigate to your project
cd your-project

# Clone the orchestration system
git clone https://github.com/your-org/orchestr8 .claude

# Verify installation
ls .claude/
```

---

## Prerequisites

**Required:**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) - For infrastructure services

**Optional (based on your stack):**
- [Node.js](https://nodejs.org/) 18+ - For TypeScript/JavaScript projects
- [Python](https://www.python.org/) 3.11+ - For Python projects

**Platform-Specific:**
- **Windows:** Enable WSL2 (`wsl --install`)
- **macOS:** Xcode Command Line Tools (`xcode-select --install`)
- **Linux:** Docker installed (`curl -fsSL https://get.docker.com | sh`)

---

## First Steps

### 1. Start Infrastructure (Optional)

If you need databases, caches, or message queues:

```bash
cd .claude
docker-compose up -d
```

This starts:
- PostgreSQL (port 5432)
- MongoDB (port 27017)
- Redis (port 6379)
- Kafka (port 9092)
- And more...

### 2. Try Your First Workflow

**Create a New Project:**

```bash
/new-project "Build a REST API for task management with:
- User authentication (JWT)
- CRUD operations for tasks
- PostgreSQL database
- Comprehensive tests
- Docker deployment"
```

The system will:
1. ✅ Analyze requirements
2. ✅ Design architecture (you approve)
3. ✅ Implement backend
4. ✅ Write tests (80%+ coverage)
5. ✅ Security audit
6. ✅ Generate documentation
7. ✅ Create Docker setup
8. ✅ All done!

**Add a Feature:**

```bash
/add-feature "Add email notifications when tasks are due"
```

**Fix a Bug:**

```bash
/fix-bug "Users can't login after password reset"
```

**Security Audit:**

```bash
/security-audit
```

### 3. Use Agents Directly

For more control, invoke agents directly:

```bash
Use the python-developer agent to implement a FastAPI endpoint for file uploads with validation

Use the architect agent to design a microservices architecture for an e-commerce platform

Use the security-auditor agent to audit the authentication implementation

Use the test-engineer agent to write comprehensive tests for the UserService class
```

---

## Common Workflows

### Create a New SaaS Application

```bash
/new-project "Multi-tenant SaaS for team collaboration with:
- Real-time chat (WebSocket)
- File sharing
- Team management
- Stripe billing
- React frontend
- Node.js backend
- PostgreSQL database
- Redis caching
- 99.9% uptime"
```

**Time:** 2-3 days for complete, production-ready application

### Add Authentication

```bash
/add-feature "Implement OAuth2 authentication with:
- Google and GitHub login
- JWT tokens
- Refresh token rotation
- Rate limiting
- Session management"
```

**Time:** 2-4 hours

### Deploy to Production

```bash
/deploy production blue-green
```

**Time:** 15-30 minutes with monitoring

### Optimize Performance

```bash
/optimize-performance "API response times are slow"
```

**Time:** 1-2 hours with benchmarks

### Setup Monitoring

```bash
/setup-monitoring "Kubernetes cluster with 20 microservices"
```

**Time:** 2-3 hours for complete observability stack

---

## Agent Quick Reference

### Development

| Agent | Use When |
|-------|----------|
| `python-developer` | Python/Django/FastAPI development |
| `typescript-developer` | Node.js/React/Next.js development |
| `java-developer` | Spring Boot/enterprise Java |
| `go-developer` | Microservices/concurrent systems |
| `rust-developer` | Systems programming/high performance |
| `react-specialist` | React state management/optimization |
| `nextjs-specialist` | Next.js SSR/SSG/Server Actions |

### Infrastructure

| Agent | Use When |
|-------|----------|
| `aws-specialist` | AWS deployments/serverless |
| `azure-specialist` | Azure infrastructure |
| `gcp-specialist` | Google Cloud deployments |
| `terraform-specialist` | Infrastructure as Code |
| `kubernetes-expert` | K8s orchestration |
| `docker-specialist` | Container optimization |

### Databases & Data

| Agent | Use When |
|-------|----------|
| `postgresql-specialist` | Query optimization/pgvector |
| `mongodb-specialist` | NoSQL/aggregation pipelines |
| `redis-specialist` | Caching strategies |
| `data-engineer` | ETL pipelines/Spark/Airflow |
| `ml-engineer` | Model training/PyTorch |
| `mlops-specialist` | ML deployment/MLflow |

### Quality & Testing

| Agent | Use When |
|-------|----------|
| `code-reviewer` | Code quality review |
| `test-engineer` | Test strategies/implementation |
| `security-auditor` | Security scanning/OWASP |
| `playwright-specialist` | E2E testing/browser automation |
| `performance-analyzer` | Performance optimization |

### Orchestration

| Agent | Use When |
|-------|----------|
| `project-orchestrator` | End-to-end project creation |
| `feature-orchestrator` | Complete feature development |
| `architect` | System design/architecture |

---

## Workflow Quick Reference

| Workflow | Description | Time |
|----------|-------------|------|
| `/new-project` | Create complete project from scratch | 2-3 days |
| `/add-feature` | Implement feature end-to-end | 2-6 hours |
| `/fix-bug` | Reproduce, fix, test bug | 1-2 hours |
| `/refactor` | Safe code refactoring | 2-4 hours |
| `/security-audit` | Complete security scan | 1-2 hours |
| `/optimize-performance` | Performance profiling & fixes | 1-3 hours |
| `/deploy` | Production deployment | 15-30 min |
| `/test-web-ui` | UI testing & validation | 30-60 min |
| `/build-ml-pipeline` | ML pipeline creation | 4-8 hours |
| `/setup-monitoring` | Complete monitoring stack | 2-3 hours |
| `/modernize-legacy` | Legacy code transformation | 1-2 weeks |
| `/optimize-costs` | Cloud cost reduction | 4-8 hours |
| `/setup-cicd` | CI/CD pipeline creation | 2-4 hours |

---

## Examples

### Example 1: Build a Blog

```bash
/new-project "Create a modern blog with:
- Markdown support
- Code syntax highlighting
- SEO optimization
- RSS feed
- Comments
- Next.js frontend
- PostgreSQL database
- Deploy to Vercel"
```

**Result:** Complete blog ready to deploy

### Example 2: Add Stripe Payments

```bash
/add-feature "Integrate Stripe payments with:
- Subscription plans (Basic $9, Pro $29, Enterprise $99)
- Webhook handling
- Invoice generation
- Payment history
- Cancel/upgrade flows"
```

**Result:** Full payment system integrated

### Example 3: Migrate to TypeScript

```bash
/refactor "Migrate JavaScript codebase to TypeScript with strict mode"
```

**Result:** TypeScript migration with no behavior changes

### Example 4: Setup Production Monitoring

```bash
/setup-monitoring "Production Kubernetes cluster with:
- API metrics (latency, errors, throughput)
- Database monitoring
- Log aggregation
- Alerting to PagerDuty
- Grafana dashboards"
```

**Result:** Complete observability stack

---

## Tips & Best Practices

### Writing Good Requirements

**❌ Vague:**
```bash
/new-project "Build a website"
```

**✅ Specific:**
```bash
/new-project "Build an e-commerce website with:
- Product catalog (10K+ items)
- Search with filters
- Shopping cart
- Stripe payments
- Order tracking
- Admin panel
- Mobile-responsive
- Support 1000 concurrent users"
```

### Trust the Quality Gates

The system runs automatic quality gates:
- ✅ Code review
- ✅ Tests (80%+ coverage)
- ✅ Security audit
- ✅ Performance check
- ✅ Accessibility (for UI)

**Don't skip them!** They prevent production issues.

### Review Architecture

When prompted for architecture approval:
- ✅ Review technology choices
- ✅ Check scalability approach
- ✅ Verify security considerations
- ✅ Confirm deployment strategy

### Use Appropriate Agents

| Task Type | Best Agent |
|-----------|------------|
| System design | `architect` |
| Python API | `python-developer` |
| React UI | `react-specialist` or `typescript-developer` |
| Full feature | `feature-orchestrator` or `fullstack-developer` |
| Code review | `code-reviewer` |
| Security check | `security-auditor` |
| AWS deployment | `aws-specialist` |

### Parallel Execution

For faster results, agents work in parallel:

```
✅ Good: Backend and frontend developers work simultaneously
❌ Bad: Wait for backend to finish before starting frontend
```

The orchestrators handle this automatically!

---

## Troubleshooting

### Issue: Agent Not Found

```
Error: Agent 'example-agent' not found
```

**Solution:**
1. Check agent exists: `ls .claude/agents/*/example-agent.md`
2. Verify agent name matches file
3. Restart Claude Code

### Issue: Workflow Not Working

```
Error: Slash command '/example' not found
```

**Solution:**
1. Check workflow exists: `ls .claude/commands/example.md`
2. Use correct syntax: `/example` not `/example-workflow`
3. Restart Claude Code

### Issue: Docker Services Not Starting

```
Error: Cannot connect to PostgreSQL
```

**Solution:**
1. Start services: `docker-compose up -d`
2. Check status: `docker-compose ps`
3. View logs: `docker-compose logs postgres`
4. Restart: `docker-compose restart postgres`

### Issue: Quality Gate Failing

```
Error: Security audit failed
```

**Solution:**
1. Read the failure message
2. Fix the identified issue
3. Re-run the quality gate
4. Don't try to skip it!

---

## Getting Help

### Documentation

- **README.md** - System overview
- **CLAUDE.md** - Core principles
- **.claude/docs/** - Detailed guides
- **Agent files** - Individual capabilities

### Community

- **GitHub Issues** - Bug reports
- **GitHub Discussions** - Questions
- **Discord** - Real-time chat (coming soon)

### Learning Resources

1. **Start small** - Try `/new-project` with simple app
2. **Read examples** - See real-world usage
3. **Experiment** - Try different agents and workflows
4. **Read agents** - See what each agent can do
5. **Contribute** - Create custom agents

---

## Next Steps

### Learn More

1. Read [Architecture](./ARCHITECTURE.md) - System design
2. Read [Cross-Platform Guide](./docs/CROSS_PLATFORM.md) - Platform setup
3. Explore agents in `.claude/agents/`
4. Try workflows in `.claude/commands/`

### Customize

1. Create custom agents - See [Agent Creation Guide](./docs/AGENT_CREATION_GUIDE.md)
2. Create custom workflows - Follow existing examples
3. Configure for your stack - Update Docker Compose

### Contribute

1. Report bugs - GitHub Issues
2. Suggest features - GitHub Discussions
3. Share agents - Pull requests
4. Write tutorials - Blog posts

---

## Success Checklist

- [ ] Installed orchestration system
- [ ] Started Docker services
- [ ] Ran first workflow (`/new-project`)
- [ ] Used agent directly
- [ ] Reviewed documentation
- [ ] Joined community

**You're ready to build amazing things!** 🚀

---

## Quick Command Reference

```bash
# Installation
/plugin marketplace add orchestr8

# Workflows
/new-project "Your project idea"
/add-feature "Feature description"
/fix-bug "Bug description"
/security-audit
/deploy production

# Infrastructure
docker-compose up -d              # Start services
docker-compose ps                 # Check status
docker-compose logs -f postgres   # View logs

# Updates
/plugin marketplace update orchestr8
```

---

**Need help?** Ask Claude Code:
```
How do I use the architect agent?
Show me examples of using /add-feature
What agents are available for Python?
```

**Happy building!** 🎉
