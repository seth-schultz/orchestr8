---
id: iac-pulumi-programming
category: skill
tags: [iac, pulumi, typescript, python, infrastructure, programming, component-resources]
capabilities:
  - Pulumi infrastructure with TypeScript/Python
  - Component resource creation and reuse
  - Infrastructure with full programming language features
  - Pulumi stack and configuration management
useWhen:
  - Implementing infrastructure-as-code with Pulumi using TypeScript for type-safe cloud resource definitions
  - Building complex infrastructure logic with Pulumi leveraging programming constructs for conditionals and loops
  - Creating reusable Pulumi component resources for standardized application stacks with input validation
  - Migrating from Terraform to Pulumi for multi-cloud infrastructure requiring shared code libraries and strong typing
  - Designing Pulumi automation API for dynamic infrastructure provisioning triggered by application events
estimatedTokens: 700
---

# Pulumi (Programming Languages)

Define infrastructure using TypeScript, Python, Go, or C# with full programming language features and type safety.

## TypeScript Example

```typescript
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// Configuration
const config = new pulumi.Config();
const environment = pulumi.getStack();
const instanceType = config.get("instanceType") || "t3.micro";

// VPC
const vpc = new aws.ec2.Vpc("main", {
    cidrBlock: "10.0.0.0/16",
    enableDnsHostnames: true,
    tags: {
        Name: `${environment}-vpc`,
        Environment: environment
    }
});

// Subnets with real programming logic
const azs = aws.getAvailabilityZones({ state: "available" });
const publicSubnets = azs.then(azs =>
    azs.names.slice(0, 3).map((az, i) =>
        new aws.ec2.Subnet(`public-${i}`, {
            vpcId: vpc.id,
            cidrBlock: `10.0.${i}.0/24`,
            availabilityZone: az,
            mapPublicIpOnLaunch: true,
            tags: {
                Name: `${environment}-public-${i}`,
                Type: "public"
            }
        })
    )
);

// Component Resource (reusable)
class WebServer extends pulumi.ComponentResource {
    public readonly instance: aws.ec2.Instance;
    public readonly publicIp: pulumi.Output<string>;

    constructor(name: string, args: WebServerArgs, opts?: pulumi.ComponentResourceOptions) {
        super("custom:web:Server", name, {}, opts);

        // Security group
        const securityGroup = new aws.ec2.SecurityGroup(`${name}-sg`, {
            vpcId: args.vpcId,
            ingress: [
                { protocol: "tcp", fromPort: 80, toPort: 80, cidrBlocks: ["0.0.0.0/0"] },
                { protocol: "tcp", fromPort: 443, toPort: 443, cidrBlocks: ["0.0.0.0/0"] }
            ],
            egress: [
                { protocol: "-1", fromPort: 0, toPort: 0, cidrBlocks: ["0.0.0.0/0"] }
            ]
        }, { parent: this });

        // Instance
        this.instance = new aws.ec2.Instance(`${name}-instance`, {
            ami: args.ami,
            instanceType: args.instanceType,
            subnetId: args.subnetId,
            vpcSecurityGroupIds: [securityGroup.id],
            tags: {
                Name: name,
                ...args.tags
            }
        }, { parent: this });

        this.publicIp = this.instance.publicIp;
        this.registerOutputs({
            instance: this.instance,
            publicIp: this.publicIp
        });
    }
}

// Use component
const webServer = new WebServer("app", {
    vpcId: vpc.id,
    subnetId: publicSubnets.then(s => s[0].id),
    ami: "ami-0c55b159cbfafe1f0",
    instanceType: instanceType,
    tags: { Environment: environment }
});

// Exports
export const vpcId = vpc.id;
export const webServerIp = webServer.publicIp;
```

## Python Example

```python
import pulumi
import pulumi_aws as aws

# Configuration
config = pulumi.Config()
environment = pulumi.get_stack()
instance_type = config.get("instanceType") or "t3.micro"

# VPC
vpc = aws.ec2.Vpc("main",
    cidr_block="10.0.0.0/16",
    enable_dns_hostnames=True,
    tags={
        "Name": f"{environment}-vpc",
        "Environment": environment
    }
)

# Subnets with Python list comprehension
azs = aws.get_availability_zones(state="available")
public_subnets = [
    aws.ec2.Subnet(f"public-{i}",
        vpc_id=vpc.id,
        cidr_block=f"10.0.{i}.0/24",
        availability_zone=azs.names[i],
        map_public_ip_on_launch=True,
        tags={
            "Name": f"{environment}-public-{i}",
            "Type": "public"
        }
    )
    for i in range(min(3, len(azs.names)))
]

# Export outputs
pulumi.export("vpc_id", vpc.id)
pulumi.export("subnet_ids", [subnet.id for subnet in public_subnets])
```

## Best Practices

✅ **Type safety** - Leverage TypeScript/Python type checking
✅ **Component resources** - Create reusable components
✅ **Programming logic** - Use loops, conditionals, functions
✅ **Configuration** - Use Pulumi Config for environment-specific values
✅ **Stack management** - Separate stacks for dev/staging/prod
✅ **IDE support** - Get autocomplete and inline docs

## Related IaC Skills

**Alternative Tool:**
- orchestr8://skills/iac-terraform-modules - Infrastructure as code with Terraform

**Cross-Cutting Concepts:**
- orchestr8://skills/iac-state-management - State management patterns (applies to Pulumi state)
- orchestr8://skills/iac-testing-validation - Testing infrastructure code (tools work with Pulumi)
- orchestr8://skills/iac-gitops-workflows - GitOps workflows for infrastructure deployment
