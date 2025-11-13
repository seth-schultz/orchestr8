---
name: setup-cicd
description: Configure CI/CD pipeline for automated testing and deployment
arguments:
  - name: task
    description: CI/CD platform and pipeline requirements
    required: true
---

# Setup CI/CD: {{task}}

**Request:** {{task}}

## Your Role

You are setting up a CI/CD pipeline to automate testing, building, and deployment.

## Phase 1: Requirements & Planning (0-20%)

**→ Load:** orchestr8://skills/match?query=cicd+pipeline+planning&mode=index&maxResults=5

**Activities:**
- Assess current setup and gaps
- Define pipeline stages (build, test, deploy)
- Choose CI/CD platform (GitHub Actions, GitLab CI, CircleCI)
- Plan integration with existing tools
- Define environments (dev, staging, production)
- Plan secrets management strategy
- Define success criteria

**→ Checkpoint:** Plan approved, platform chosen

## Phase 2: Build & Test Pipeline (20-50%)

**→ Load:** orchestr8://match?query={{task}}+build+test+automation&categories=skill,guide,example&mode=index&maxResults=8

**Activities:**
- Configure build steps (compile, bundle, optimize)
- Set up test automation (unit, integration, E2E)
- Add linting and code formatting checks
- Configure security scanning (SAST, dependency scan)
- Set up code coverage reporting
- Configure build caching for speed
- Add build notifications

**→ Checkpoint:** Build and test pipeline working

## Phase 3: Deployment Pipeline (50-80%)

**→ Load:** orchestr8://match?query={{task}}+deployment+automation&categories=skill,guide,example&mode=index&maxResults=8

**Activities:**
- Configure deployment stages (staging, production)
- Set up environment-specific configurations
- Implement approval gates (manual/automatic)
- Configure secrets management (vault, env vars)
- Set up deployment strategies (blue-green, canary)
- Add rollback capabilities
- Configure deployment notifications

**→ Checkpoint:** Deployment pipeline functional

## Phase 4: Monitoring & Optimization (80-100%)

**→ Load:** orchestr8://skills/match?query=cicd+monitoring+optimization&mode=index&maxResults=3

**Activities:**
- Add pipeline monitoring and metrics
- Optimize build times (parallel jobs, caching)
- Set up alerting for pipeline failures
- Document pipeline architecture
- Create troubleshooting guide
- Train team on pipeline usage
- Plan continuous improvements

**→ Checkpoint:** Pipeline optimized, documented, team trained

## Success Criteria

✅ Automated build and test pipeline
✅ Linting and security scanning integrated
✅ Deployment automation configured
✅ Secrets managed securely
✅ Approval gates in place
✅ Rollback capability implemented
✅ Documentation complete
✅ Team trained on usage
