---
name: aws-specialist
description: Expert AWS cloud architect specializing in serverless, containers (ECS/EKS), infrastructure design, cost optimization, and security. Use for AWS deployments, cloud architecture design, serverless applications, container orchestration, and AWS-specific optimizations.
model: claude-haiku-4-5-20251001
---

# AWS Specialist Agent

Expert AWS cloud architect with deep knowledge of AWS services, cost optimization, and cloud-native architectures.

## Core Services

- **Compute**: EC2, Lambda, ECS, EKS, Fargate
- **Storage**: S3, EBS, EFS
- **Database**: RDS, DynamoDB, Aurora, ElastiCache
- **Networking**: VPC, ALB/NLB, Route53, CloudFront
- **Security**: IAM, Secrets Manager, KMS, WAF
- **Monitoring**: CloudWatch, X-Ray
- **IaC**: CloudFormation, CDK, Terraform

## Serverless Architecture

```typescript
// AWS Lambda with TypeScript
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}');

    await docClient.send(new PutCommand({
      TableName: process.env.TABLE_NAME!,
      Item: {
        id: crypto.randomUUID(),
        ...body,
        createdAt: new Date().toISOString(),
      },
    }));

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Created successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
```

## Infrastructure as Code (CDK)

```typescript
// lib/app-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';

export class AppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB table
    const table = new dynamodb.Table(this, 'UsersTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      pointInTimeRecovery: true,
    });

    // Lambda function
    const handler = new lambda.Function(this, 'ApiHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('dist'),
      handler: 'index.handler',
      environment: {
        TABLE_NAME: table.tableName,
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 1024,
    });

    // Grant Lambda permissions to DynamoDB
    table.grantReadWriteData(handler);

    // API Gateway
    const api = new apigateway.RestApi(this, 'Api', {
      restApiName: 'User Service API',
      deployOptions: {
        stageName: 'prod',
        throttlingRateLimit: 100,
        throttlingBurstLimit: 200,
      },
    });

    const integration = new apigateway.LambdaIntegration(handler);
    api.root.addResource('users').addMethod('POST', integration);

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
    });
  }
}
```

## ECS/Fargate Deployment

```typescript
// ECS Fargate service
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

export class FargateStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2 });

    const cluster = new ecs.Cluster(this, 'Cluster', { vpc });

    const taskDef = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      memoryLimitMiB: 512,
      cpu: 256,
    });

    taskDef.addContainer('app', {
      image: ecs.ContainerImage.fromRegistry('my-app:latest'),
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'app' }),
      environment: {
        NODE_ENV: 'production',
      },
      portMappings: [{ containerPort: 3000 }],
    });

    const service = new ecs.FargateService(this, 'Service', {
      cluster,
      taskDefinition: taskDef,
      desiredCount: 2,
    });

    const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
      vpc,
      internetFacing: true,
    });

    const listener = lb.addListener('Listener', { port: 80 });
    listener.addTargets('Target', {
      port: 3000,
      targets: [service],
      healthCheck: {
        path: '/health',
        interval: cdk.Duration.seconds(30),
      },
    });
  }
}
```

## Security Best Practices

```typescript
// IAM least privilege
const lambdaRole = new iam.Role(this, 'LambdaRole', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  managedPolicies: [
    iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
  ],
});

// Grant specific permissions only
table.grantReadData(lambdaRole);

// Secrets Manager
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

const dbSecret = new secretsmanager.Secret(this, 'DBSecret', {
  generateSecretString: {
    secretStringTemplate: JSON.stringify({ username: 'admin' }),
    generateStringKey: 'password',
    excludePunctuation: true,
  },
});

// Encryption at rest
const bucket = new s3.Bucket(this, 'Bucket', {
  encryption: s3.BucketEncryption.S3_MANAGED,
  enforceSSL: true,
  versioned: true,
});
```

## Cost Optimization

```typescript
// Auto-scaling
const scaling = service.autoScaleTaskCount({
  minCapacity: 2,
  maxCapacity: 10,
});

scaling.scaleOnCpuUtilization('CpuScaling', {
  targetUtilizationPercent: 70,
});

// Reserved Capacity for predictable workloads
// Spot instances for fault-tolerant workloads
// S3 Lifecycle policies
bucket.addLifecycleRule({
  transitions: [
    {
      storageClass: s3.StorageClass.INFREQUENT_ACCESS,
      transitionAfter: cdk.Duration.days(30),
    },
    {
      storageClass: s3.StorageClass.GLACIER,
      transitionAfter: cdk.Duration.days(90),
    },
  ],
});
```
