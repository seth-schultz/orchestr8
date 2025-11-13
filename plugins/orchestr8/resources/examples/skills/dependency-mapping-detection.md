---
id: dependency-mapping-detection
category: example
tags: [dependency-mapping, code-analysis, service-discovery, typescript]
capabilities:
  - Service-to-service call detection
  - Database connection identification
  - Message queue dependency tracking
  - External API integration discovery
useWhen:
  - Building dependency analysis tools
  - Automating service discovery
  - Creating architecture documentation
estimatedTokens: 480
relatedResources:
  - orchestr8://skills/service-dependency-mapping
---

# Dependency Mapping: Detection Implementations

TypeScript implementations for detecting various types of service dependencies through code analysis.

## Database Dependency Detection

```typescript
interface DatabaseDependency {
  service: string
  database: {
    name: string
    type: 'SQL Server' | 'PostgreSQL' | 'MySQL' | 'MongoDB' | 'Cosmos' | 'DynamoDB'
    operations: ('Read' | 'Write' | 'Delete')[]
    connectionString?: string  // sanitized
  }
}

async function detectDatabaseDependencies(servicePath: string): Promise<DatabaseDependency[]> {
  // 1. Find connection strings in config files
  const configs = await glob(`${servicePath}/**/appsettings*.json`)

  // 2. Identify database type from connection string
  const dbType = inferDatabaseType(connectionString)

  // 3. Analyze code for CRUD operations
  const operations = await analyzeOperations(servicePath)

  return [{
    service: getServiceName(servicePath),
    database: {
      name: extractDatabaseName(connectionString),
      type: dbType,
      operations: operations
    }
  }]
}

function inferDatabaseType(connectionString: string): string {
  if (connectionString.includes('Server=') || connectionString.includes('Data Source=')) {
    return 'SQL Server';
  } else if (connectionString.includes('postgresql://') || connectionString.includes('postgres://')) {
    return 'PostgreSQL';
  } else if (connectionString.includes('mongodb://') || connectionString.includes('mongodb+srv://')) {
    return 'MongoDB';
  } else if (connectionString.includes('mysql://')) {
    return 'MySQL';
  }
  return 'Unknown';
}
```

## Service-to-Service Call Detection

```typescript
interface ServiceCall {
  from: string
  to: string
  endpoints: string[]
  protocol: 'HTTP' | 'gRPC' | 'SOAP'
  authentication?: string
}

async function detectServiceCalls(servicePath: string): Promise<ServiceCall[]> {
  // 1. Find all HttpClient usages
  const httpCalls = await grep(servicePath, 'HttpClient\\..*Async\\(')

  // 2. Extract URLs or configuration keys
  const endpoints = extractEndpoints(httpCalls)

  // 3. Resolve configuration to actual service names
  const targetServices = await resolveServiceNames(endpoints)

  return targetServices.map(target => ({
    from: getServiceName(servicePath),
    to: target.serviceName,
    endpoints: target.endpoints,
    protocol: 'HTTP'
  }))
}

interface ServiceReference {
  serviceName: string;
  endpoints: string[];
}

function resolveServiceNames(endpoints: string[]): ServiceReference[] {
  // Handle different patterns:
  // - "http://user-service/api/users" → user-service
  // - "${USER_SERVICE_URL}/api/users" → user-service
  // - config.services.user.url → user-service

  return endpoints.map(endpoint => {
    if (endpoint.includes('://')) {
      const hostname = new URL(endpoint).hostname
      return { serviceName: hostname, endpoints: [endpoint] }
    } else {
      // Configuration variable, try to resolve
      return resolveFromConfig(endpoint)
    }
  })
}
```

## Message Queue Dependency Detection

```typescript
interface MessageQueueDependency {
  service: string
  queue: {
    name: string
    type: 'RabbitMQ' | 'Azure Service Bus' | 'AWS SQS' | 'Kafka'
    operations: ('Publish' | 'Subscribe')[]
    messages: string[]  // message types
  }
}

async function detectQueueDependencies(servicePath: string): Promise<MessageQueueDependency[]> {
  // 1. Find queue client initialization
  const queueClients = await grep(servicePath, 'ServiceBusClient|ConnectionFactory')

  // 2. Find publish operations
  const publishes = await grep(servicePath, 'SendMessageAsync|basicPublish')

  // 3. Find subscribe operations
  const subscribes = await grep(servicePath, 'ReceiveMessagesAsync|BasicConsume')

  // 4. Extract queue names and message types
  return extractQueueInfo(queueClients, publishes, subscribes)
}

function extractQueueInfo(clients: string[], publishes: string[], subscribes: string[]): MessageQueueDependency[] {
  const operations: ('Publish' | 'Subscribe')[] = [];

  if (publishes.length > 0) operations.push('Publish');
  if (subscribes.length > 0) operations.push('Subscribe');

  return [{
    service: 'current-service',
    queue: {
      name: extractQueueName(clients[0]),
      type: inferQueueType(clients[0]),
      operations,
      messages: extractMessageTypes(publishes.concat(subscribes))
    }
  }];
}
```

## External API Detection

```typescript
interface ExternalAPI {
  name: string;
  domain: string;
  purpose: string;
}

const externalAPIs: Record<string, string> = {
  'stripe.com': 'Stripe',
  'api.sendgrid.com': 'SendGrid',
  'graph.microsoft.com': 'Microsoft Graph',
  'api.twilio.com': 'Twilio',
  'maps.googleapis.com': 'Google Maps',
  'api.github.com': 'GitHub'
};

async function detectExternalAPIs(servicePath: string): Promise<ExternalAPI[]> {
  // 1. Grep for HTTP calls to external domains
  const httpCalls = await grep(servicePath, 'http(s)?://')

  // 2. Extract domains
  const domains = httpCalls.map(call => {
    const match = call.match(/https?:\/\/([^\/]+)/)
    return match ? match[1] : null
  }).filter(Boolean)

  // 3. Classify as internal vs external
  const external = domains.filter(domain => !isInternalDomain(domain))

  // 4. Identify known APIs
  return external.map(domain => ({
    name: identifyAPI(domain),
    domain: domain,
    purpose: inferPurpose(domain)
  }))
}

function isInternalDomain(domain: string): boolean {
  // Check if domain is internal (localhost, .local, private IPs, etc.)
  return domain.includes('localhost') ||
         domain.includes('.local') ||
         domain.match(/^10\.|^172\.(1[6-9]|2[0-9]|3[01])\.|^192\.168\./) !== null;
}

function identifyAPI(domain: string): string {
  for (const [key, name] of Object.entries(externalAPIs)) {
    if (domain.includes(key)) {
      return name;
    }
  }
  return domain;
}
```
