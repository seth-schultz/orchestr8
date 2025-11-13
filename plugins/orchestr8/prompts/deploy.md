---
name: deploy
description: Deployment automation with staging validation and production rollout
arguments:
  - name: task
    description: Deployment target and strategy (staging, production, rollback)
    required: true
---

# Deploy: {{task}}

**Request:** {{task}}

## Your Role

You are orchestrating a deployment with proper validation, rollout strategy, and monitoring.

## Phase 1: Pre-deployment (0-20%)

**→ Load:** orchestr8://skills/match?query=deployment+preparation+validation&mode=index&maxResults=5

**Activities:**
- Run full test suite (unit, integration, E2E)
- Build production artifacts
- Generate deployment plan
- Check prerequisites (dependencies, configs)
- Review recent changes and risks
- Prepare rollback strategy
- Notify stakeholders

**→ Checkpoint:** Tests pass, artifacts ready, plan approved

## Phase 2: Staging Deployment (20-50%)

**→ Load:** orchestr8://match?query={{task}}+staging+validation&categories=skill,guide&mode=index&maxResults=8

**Activities:**
- Deploy to staging environment
- Run smoke tests on staging
- Validate functionality (critical paths)
- Performance testing on staging
- Security scan on staging
- Database migration validation (if applicable)
- Fix any staging issues before production

**→ Checkpoint:** Staging healthy, all validations pass

## Phase 3: Production Deployment (50-80%)

**→ Load:** orchestr8://skills/match?query=production+deployment+strategy&mode=index&maxResults=8

**Activities:**
- Execute deployment strategy (blue-green, canary, rolling)
- Monitor health checks during rollout
- Watch error rates and metrics
- Gradual traffic shift (if canary/rolling)
- Database migrations (with rollback plan)
- Verify critical functionality
- Keep rollback option ready

**→ Checkpoint:** Production deployment complete, healthy

## Phase 4: Post-deployment (80-100%)

**→ Load:** orchestr8://skills/match?query=monitoring+observability+validation&mode=index&maxResults=3

**Activities:**
- Monitor production health (15-30 minutes)
- Verify error rates within SLA
- Check performance metrics (latency, throughput)
- Validate critical user flows
- Update deployment documentation
- Notify stakeholders of success
- Close deployment tickets

**→ Checkpoint:** Production stable, metrics good

## Success Criteria

✅ All tests passed pre-deployment
✅ Staging validation successful
✅ Production deployment completed
✅ No critical errors or incidents
✅ Performance metrics within SLA
✅ Rollback plan available
✅ Stakeholders notified
