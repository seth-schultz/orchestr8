---
id: iac-gitops-workflows
category: skill
tags: [iac, gitops, cicd, automation, terraform, pulumi, github-actions, atlantis]
capabilities:
  - GitOps workflows for infrastructure changes
  - Automated plan/preview and apply with CI/CD
  - Pull request-based infrastructure reviews
  - Version pinning and tagging strategies
useWhen:
  - Implementing GitOps workflow for IaC with PR-based review and automated deployment pipeline
  - Building infrastructure CI/CD with GitHub Actions running plan on PR and apply on merge to main
  - Designing Git-based infrastructure change management with code review, approval gates, and audit trail
  - Creating automated infrastructure deployment workflow with drift detection, rollback capability, and notifications
  - Implementing infrastructure peer review process with automated cost estimation and security scanning
estimatedTokens: 680
---

# GitOps Workflows for IaC

Implement GitOps practices for infrastructure with automated planning, review, and deployment through pull requests.

## GitOps Principles for Infrastructure

**Key Concepts:**
- **Git as single source of truth** - All infrastructure defined in version control
- **Declarative configuration** - Describe desired state, not imperative steps
- **Automated deployment** - CI/CD applies changes automatically
- **Continuous reconciliation** - Detect and fix drift automatically

## Terraform GitOps

### Version Pinning

```terraform
terraform {
  required_version = "~> 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
```

### Tagging Strategy

```terraform
locals {
  common_tags = {
    Project     = "MyApp"
    Environment = var.environment
    ManagedBy   = "Terraform"
    CostCenter  = var.cost_center
    Owner       = var.team_email
  }
}

resource "aws_instance" "app" {
  tags = merge(local.common_tags, {
    Name = "app-server"
    Role = "application"
  })
}
```

### Standard Workflow

```markdown
1. Developer creates branch
2. Modify Terraform code
3. Open pull request
4. CI runs:
   - terraform fmt -check
   - terraform validate
   - terraform plan
5. Plan posted as PR comment
6. Team reviews plan
7. Merge to main
8. CI runs terraform apply
9. Infrastructure updated
```

### GitHub Actions Example

```yaml
# .github/workflows/terraform-pr.yml
name: Terraform PR

on:
  pull_request:
    paths:
      - 'terraform/**'

jobs:
  plan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: hashicorp/setup-terraform@v2

      - name: Terraform Init
        run: terraform init
        working-directory: ./terraform/production

      - name: Terraform Plan
        id: plan
        run: terraform plan -no-color
        continue-on-error: true

      - uses: actions/github-script@v6
        with:
          script: |
            const output = `#### Terraform Plan 📋
            \`\`\`
            ${{ steps.plan.outputs.stdout }}
            \`\`\`

            *Pusher: @${{ github.actor }}, Action: \`${{ github.event_name }}\`*`;

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: output
            })
```

### Atlantis Integration

```yaml
# atlantis.yaml
version: 3
projects:
  - name: production
    dir: terraform/production
    workflow: production
    autoplan:
      when_modified: ["*.tf", "*.tfvars"]
      enabled: true

workflows:
  production:
    plan:
      steps:
        - init
        - plan
    apply:
      steps:
        - apply

# Pull request commands:
# atlantis plan - Run plan
# atlantis apply - Apply changes (after approval)
```

## Pulumi GitOps

### GitHub Actions for Pulumi

```yaml
# .github/workflows/pulumi.yml
name: Pulumi
on:
  pull_request:
    paths: ['pulumi/**']
  push:
    branches: [main]

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Pulumi Preview
        uses: pulumi/actions@v4
        with:
          command: preview
          stack-name: production
        env:
          PULUMI_ACCESS_TOKEN: ${{ secrets.PULUMI_ACCESS_TOKEN }}

  update:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Pulumi Up
        uses: pulumi/actions@v4
        with:
          command: up
          stack-name: production
```

### Pulumi Deployments (Hosted)

Pulumi Cloud provides built-in GitOps with:
- Automatic PR previews
- Click-to-deploy from UI
- Deployment history and rollbacks
- RBAC and approval workflows

## Common Pitfalls

❌ **Avoid:**
- State file in Git
- Hardcoded credentials
- No state locking
- Large monolithic configs
- No versioning
- Ignoring drift
- Manual infrastructure changes

✅ **Best Practices:**
- Remote state with locking
- Environment variables for secrets
- Modular infrastructure
- Pin versions strictly
- Regular drift checks
- Automated testing in CI
- Require PR approvals
- Use deployment gates

## Related IaC Skills

**Tool-Specific Implementation:**
- orchestr8://skills/iac-terraform-modules - Terraform module development
- orchestr8://skills/iac-pulumi-programming - Pulumi infrastructure programming

**Related Practices:**
- orchestr8://skills/iac-state-management - State management for GitOps
- orchestr8://skills/iac-testing-validation - Automated testing in CI/CD pipelines
