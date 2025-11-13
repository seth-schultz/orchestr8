---
id: iac-terraform-modules
category: skill
tags: [iac, terraform, modules, infrastructure, hcl, reusable-components]
capabilities:
  - Terraform module structure and organization
  - Module variables, outputs, and versioning
  - Reusable infrastructure components with Terraform
  - Module composition and dependency management
useWhen:
  - Creating reusable Terraform modules for multi-environment AWS infrastructure with VPC, EKS, and RDS components
  - Building standardized Terraform module library for microservices deployment with consistent tagging and security policies
  - Designing modular infrastructure code for SaaS platform with environment-specific variable files and remote state backends
  - Implementing Terraform workspace strategy for dev, staging, production environments with DRY principles and input validation
  - Organizing large-scale Terraform codebase with module composition patterns for networking, compute, and database layers
estimatedTokens: 720
---

# Terraform Modules

Create reusable, well-structured Terraform modules for consistent infrastructure provisioning across environments.

## Module Structure

```
terraform/
├── modules/
│   ├── vpc/
│   │   ├── main.tf           # Resources
│   │   ├── variables.tf      # Input variables
│   │   ├── outputs.tf        # Output values
│   │   ├── versions.tf       # Provider versions
│   │   └── README.md         # Documentation
│   ├── compute/
│   └── database/
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── terraform.tfvars  # Variable values
│   │   └── backend.tf        # Remote state config
│   ├── staging/
│   └── production/
└── .terraform-version         # Pin Terraform version
```

## Module Example

```terraform
# modules/vpc/main.tf
resource "aws_vpc" "main" {
  cidr_block           = var.cidr_block
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(
    var.tags,
    {
      Name = "${var.environment}-vpc"
    }
  )
}

resource "aws_subnet" "public" {
  count             = length(var.public_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.public_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "${var.environment}-public-${count.index + 1}"
    Type = "public"
  }
}

# modules/vpc/variables.tf
variable "environment" {
  description = "Environment name"
  type        = string
}

variable "cidr_block" {
  description = "VPC CIDR block"
  type        = string
  validation {
    condition     = can(cidrhost(var.cidr_block, 0))
    error_message = "Must be a valid IPv4 CIDR block"
  }
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDR blocks"
  type        = list(string)
}

variable "tags" {
  description = "Additional tags"
  type        = map(string)
  default     = {}
}

# modules/vpc/outputs.tf
output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = aws_subnet.public[*].id
}
```

## Using Modules

```terraform
# environments/production/main.tf
module "vpc" {
  source = "../../modules/vpc"

  environment          = "production"
  cidr_block          = "10.0.0.0/16"
  public_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  availability_zones  = ["us-east-1a", "us-east-1b", "us-east-1c"]

  tags = {
    Project   = "MyApp"
    ManagedBy = "Terraform"
  }
}

module "compute" {
  source = "../../modules/compute"

  vpc_id    = module.vpc.vpc_id
  subnet_ids = module.vpc.public_subnet_ids

  # ... other variables
}
```

## Dynamic Blocks

```terraform
resource "aws_security_group" "app" {
  name   = "app-sg"
  vpc_id = var.vpc_id

  dynamic "ingress" {
    for_each = var.ingress_rules
    content {
      from_port   = ingress.value.from_port
      to_port     = ingress.value.to_port
      protocol    = ingress.value.protocol
      cidr_blocks = ingress.value.cidr_blocks
    }
  }
}

# Variable
variable "ingress_rules" {
  type = list(object({
    from_port   = number
    to_port     = number
    protocol    = string
    cidr_blocks = list(string)
  }))
  default = [
    {
      from_port   = 80
      to_port     = 80
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    },
    {
      from_port   = 443
      to_port     = 443
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  ]
}
```

## Best Practices

✅ **Clear structure** - Separate main.tf, variables.tf, outputs.tf
✅ **Input validation** - Use validation blocks for variables
✅ **Descriptive outputs** - Include description for all outputs
✅ **Version constraints** - Pin provider versions
✅ **Tagging strategy** - Merge common tags with resource-specific tags
✅ **Documentation** - Include README with module usage

## Related IaC Skills

**Alternative Tool:**
- orchestr8://skills/iac-pulumi-programming - Infrastructure as code with programming languages

**Cross-Cutting Concepts:**
- orchestr8://skills/iac-state-management - Remote state, locking, and drift detection
- orchestr8://skills/iac-testing-validation - Testing infrastructure code with Terratest
- orchestr8://skills/iac-gitops-workflows - GitOps workflows for infrastructure deployment
