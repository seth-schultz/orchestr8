---
id: iac-testing-validation
category: skill
tags: [iac, terraform, pulumi, testing, terratest, validation, linting, security-scanning]
capabilities:
  - Infrastructure code testing frameworks
  - IaC validation and formatting checks
  - Security scanning for infrastructure code
  - Cost estimation and policy enforcement
useWhen:
  - Testing Terraform modules with Terratest validating infrastructure correctness before production deployment
  - Implementing IaC CI/CD pipeline with automated plan, validation, and security scanning
  - Building pre-commit hooks for IaC code quality checking formatting, security misconfigurations, and cost estimation
  - Creating test suites for infrastructure modules verifying VPC networking, security group rules, and IAM permissions
  - Validating infrastructure configuration with automated policy checks for encryption, public access, and compliance
estimatedTokens: 640
---

# Infrastructure Testing & Validation

Test and validate infrastructure code with automated testing, security scanning, and cost analysis before deployment.

## Testing Philosophy

Infrastructure code should be tested like application code:
- **Unit tests** - Test individual modules/components
- **Integration tests** - Test infrastructure provisioning end-to-end
- **Policy tests** - Validate compliance and security rules
- **Cost tests** - Estimate and cap infrastructure costs

## Terraform Testing

### Terratest (Go)

```go
package test

import (
    "testing"
    "github.com/gruntwork-io/terratest/modules/terraform"
    "github.com/stretchr/testify/assert"
)

func TestVPCCreation(t *testing.T) {
    t.Parallel()

    terraformOptions := &terraform.Options{
        TerraformDir: "../modules/vpc",
        Vars: map[string]interface{}{
            "environment":          "test",
            "cidr_block":          "10.0.0.0/16",
            "public_subnet_cidrs": []string{"10.0.1.0/24"},
        },
    }

    defer terraform.Destroy(t, terraformOptions)
    terraform.InitAndApply(t, terraformOptions)

    vpcId := terraform.Output(t, terraformOptions, "vpc_id")
    assert.NotEmpty(t, vpcId)
}
```

### Validation & Linting

```bash
# Terraform validate
terraform validate

# Format check
terraform fmt -check -recursive

# Security scanning
tfsec .
checkov -d .

# Cost estimation
infracost breakdown --path .
```

### Policy as Code (OPA)

```rego
# Open Policy Agent
package terraform.analysis

deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_s3_bucket"
    not resource.change.after.versioning[_].enabled
    msg := sprintf("S3 bucket %s must have versioning enabled", [resource.address])
}

deny[msg] {
    resource := input.resource_changes[_]
    resource.type == "aws_instance"
    resource.change.after.instance_type == "t3.large"
    msg := "Production instances must be t3.xlarge or larger"
}
```

## Pulumi Testing

### Python Unit Tests

```python
import unittest
import pulumi

class TestInfrastructure(unittest.TestCase):
    @pulumi.runtime.test
    def test_vpc_creation(self):
        def check_vpc(args):
            vpc_id, subnets = args
            self.assertIsNotNone(vpc_id)
            self.assertEqual(len(subnets), 3)

        return pulumi.Output.all(vpc.id, public_subnets).apply(check_vpc)
```

### TypeScript Testing

```typescript
import * as pulumi from "@pulumi/pulumi";
import "mocha";

describe("Infrastructure", () => {
    it("VPC should have correct CIDR", (done) => {
        pulumi.all([vpc.cidrBlock]).apply(([cidr]) => {
            assert.equal(cidr, "10.0.0.0/16");
            done();
        });
    });
});
```

### Policy as Code (CrossGuard)

```typescript
// Pulumi policy
new PolicyPack("aws-policies", {
    policies: [{
        name: "s3-encryption-required",
        description: "S3 buckets must be encrypted",
        enforcementLevel: "mandatory",
        validateResource: validateResourceOfType(aws.s3.Bucket, (bucket, args, reportViolation) => {
            if (!bucket.serverSideEncryptionConfiguration) {
                reportViolation("S3 bucket must have encryption enabled");
            }
        }),
    }],
});
```

## Best Practices

✅ **Automated testing** - Test infrastructure code like application code
✅ **Security scanning** - Run tfsec/Checkov/CrossGuard in CI
✅ **Validation first** - Always validate before plan/preview
✅ **Format enforcement** - Use formatting tools in CI
✅ **Cost awareness** - Review cost estimates before apply
✅ **Policy enforcement** - Use OPA/CrossGuard for compliance rules
✅ **Test environments** - Use temporary test stacks for integration tests

## Related IaC Skills

**Tool-Specific Implementation:**
- orchestr8://skills/iac-terraform-modules - Terraform module development
- orchestr8://skills/iac-pulumi-programming - Pulumi infrastructure programming

**Related Practices:**
- orchestr8://skills/iac-state-management - State management and drift detection
- orchestr8://skills/iac-gitops-workflows - CI/CD pipelines for IaC (includes testing workflows)
