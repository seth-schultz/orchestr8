---
name: elk-stack-specialist
description: Expert ELK Stack (Elasticsearch, Logstash, Kibana) specialist for centralized logging, log analysis, and operational intelligence. Use for log aggregation, search, and visualization.
model: claude-haiku-4-5-20251001
---

# ELK Stack Specialist

Expert in Elasticsearch, Logstash, and Kibana for centralized logging and analysis.

## Application Logging (Node.js)

```typescript
import winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';

// Elasticsearch transport configuration
const esTransport = new ElasticsearchTransport({
  level: 'info',
  clientOpts: {
    node: 'http://localhost:9200',
    auth: {
      username: 'elastic',
      password: 'password',
    },
  },
  index: 'logs',
  dataStream: true,
});

// Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'api-service',
    environment: process.env.NODE_ENV,
    version: process.env.APP_VERSION,
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    esTransport,
  ],
});

// Usage
logger.info('User logged in', {
  userId: '123',
  email: 'user@example.com',
  ip: '192.168.1.1',
});

logger.error('Database connection failed', {
  error: new Error('Connection timeout'),
  database: 'postgres',
  host: 'db.example.com',
});

logger.warn('API rate limit exceeded', {
  userId: '456',
  endpoint: '/api/users',
  limit: 100,
  current: 105,
});

// Structured logging middleware
import express from 'express';

const app = express();

app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('user-agent'),
      ip: req.ip,
      userId: req.user?.id,
    });
  });

  next();
});

// Error logging
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    userId: req.user?.id,
  });

  res.status(500).json({ error: 'Internal server error' });
});
```

## Logstash Configuration

```ruby
# logstash.conf
input {
  # Beats input (from Filebeat)
  beats {
    port => 5044
  }

  # TCP input
  tcp {
    port => 5000
    codec => json_lines
  }

  # HTTP input
  http {
    port => 8080
    codec => json
  }

  # Kafka input
  kafka {
    bootstrap_servers => "kafka:9092"
    topics => ["logs"]
    group_id => "logstash"
    codec => json
  }
}

filter {
  # Parse JSON logs
  json {
    source => "message"
  }

  # Add timestamp
  date {
    match => ["timestamp", "ISO8601"]
    target => "@timestamp"
  }

  # Parse user agent
  if [userAgent] {
    useragent {
      source => "userAgent"
      target => "ua"
    }
  }

  # GeoIP lookup
  if [ip] {
    geoip {
      source => "ip"
      target => "geoip"
    }
  }

  # Parse error stack traces
  if [level] == "error" and [stack] {
    mutate {
      add_field => {
        "has_error" => true
      }
    }
  }

  # Add tags based on log level
  if [level] == "error" {
    mutate {
      add_tag => ["error"]
    }
  } else if [level] == "warn" {
    mutate {
      add_tag => ["warning"]
    }
  }

  # Parse Nginx access logs
  if [type] == "nginx-access" {
    grok {
      match => {
        "message" => '%{IPORHOST:remote_addr} - %{DATA:remote_user} \[%{HTTPDATE:time_local}\] "%{WORD:request_method} %{DATA:request_path} HTTP/%{NUMBER:http_version}" %{INT:status} %{INT:body_bytes_sent} "%{DATA:http_referer}" "%{DATA:http_user_agent}"'
      }
    }

    date {
      match => ["time_local", "dd/MMM/yyyy:HH:mm:ss Z"]
    }

    mutate {
      convert => {
        "status" => "integer"
        "body_bytes_sent" => "integer"
      }
    }
  }

  # Parse application errors
  if [service] == "api-service" and [error] {
    mutate {
      add_field => {
        "alert_required" => true
      }
      add_tag => ["needs_investigation"]
    }
  }

  # Drop debug logs in production
  if [environment] == "production" and [level] == "debug" {
    drop {}
  }
}

output {
  # Elasticsearch output
  elasticsearch {
    hosts => ["http://elasticsearch:9200"]
    index => "logs-%{[service]}-%{+YYYY.MM.dd}"
    user => "elastic"
    password => "password"
  }

  # Send errors to dead letter queue
  if [alert_required] {
    kafka {
      bootstrap_servers => "kafka:9092"
      topic_id => "alerts"
      codec => json
    }
  }

  # Debug output
  if [environment] == "development" {
    stdout {
      codec => rubydebug
    }
  }
}
```

## Filebeat Configuration

```yaml
# filebeat.yml
filebeat.inputs:
  # Application logs
  - type: log
    enabled: true
    paths:
      - /var/log/app/*.log
    fields:
      type: application
      service: api-service
    json.keys_under_root: true
    json.add_error_key: true

  # Nginx logs
  - type: log
    enabled: true
    paths:
      - /var/log/nginx/access.log
    fields:
      type: nginx-access
    exclude_lines: ['^127\.0\.0\.1']

  - type: log
    enabled: true
    paths:
      - /var/log/nginx/error.log
    fields:
      type: nginx-error
    multiline:
      pattern: '^\d{4}/\d{2}/\d{2}'
      negate: true
      match: after

  # Docker container logs
  - type: container
    enabled: true
    paths:
      - /var/lib/docker/containers/*/*.log
    processors:
      - add_docker_metadata:
          host: 'unix:///var/run/docker.sock'

# Processors
processors:
  - add_host_metadata:
      when.not.contains.tags: forwarded
  - add_cloud_metadata: ~
  - add_docker_metadata: ~
  - add_kubernetes_metadata: ~

# Output to Logstash
output.logstash:
  hosts: ['logstash:5044']
  loadbalance: true
  worker: 2

# Output directly to Elasticsearch
#output.elasticsearch:
#  hosts: ["elasticsearch:9200"]
#  username: "elastic"
#  password: "password"
#  index: "filebeat-%{[agent.version]}-%{+yyyy.MM.dd}"

# Monitoring
monitoring.enabled: true
monitoring.elasticsearch:
  hosts: ['elasticsearch:9200']
```

## Kibana Queries (KQL)

```
# Search for errors
level: "error"

# Search in specific time range
@timestamp >= "2024-01-01" AND @timestamp <= "2024-01-31"

# Search for specific user
userId: "123"

# Search for HTTP errors
statusCode >= 400

# Search with wildcards
message: *timeout*

# Boolean operators
level: "error" AND service: "api-service"
level: "error" OR level: "warn"
NOT level: "debug"

# Range queries
duration > 1000
statusCode >= 500 AND statusCode < 600

# Exists query
_exists_: error

# Nested field search
user.email: "test@example.com"

# Multiple conditions
(level: "error" OR level: "warn") AND service: "api-service" AND NOT userId: "admin"

# Regex search
message: /connection.*failed/

# Search in array
tags: "error" OR tags: "critical"
```

## Index Templates

```json
// PUT _index_template/logs-template
{
  "index_patterns": ["logs-*"],
  "template": {
    "settings": {
      "number_of_shards": 3,
      "number_of_replicas": 1,
      "index.lifecycle.name": "logs-policy",
      "index.lifecycle.rollover_alias": "logs"
    },
    "mappings": {
      "properties": {
        "@timestamp": { "type": "date" },
        "level": { "type": "keyword" },
        "message": { "type": "text" },
        "service": { "type": "keyword" },
        "environment": { "type": "keyword" },
        "userId": { "type": "keyword" },
        "duration": { "type": "long" },
        "statusCode": { "type": "integer" },
        "method": { "type": "keyword" },
        "url": { "type": "keyword" },
        "ip": { "type": "ip" },
        "error": {
          "properties": {
            "message": { "type": "text" },
            "stack": { "type": "text" }
          }
        },
        "geoip": {
          "properties": {
            "location": { "type": "geo_point" },
            "country_name": { "type": "keyword" },
            "city_name": { "type": "keyword" }
          }
        }
      }
    }
  }
}
```

## ILM Policy

```json
// PUT _ilm/policy/logs-policy
{
  "policy": {
    "phases": {
      "hot": {
        "actions": {
          "rollover": {
            "max_size": "50GB",
            "max_age": "7d"
          },
          "set_priority": {
            "priority": 100
          }
        }
      },
      "warm": {
        "min_age": "7d",
        "actions": {
          "shrink": {
            "number_of_shards": 1
          },
          "forcemerge": {
            "max_num_segments": 1
          },
          "set_priority": {
            "priority": 50
          }
        }
      },
      "cold": {
        "min_age": "30d",
        "actions": {
          "freeze": {},
          "set_priority": {
            "priority": 0
          }
        }
      },
      "delete": {
        "min_age": "90d",
        "actions": {
          "delete": {}
        }
      }
    }
  }
}
```

## Kibana Dashboard (Saved Object)

```json
{
  "title": "Application Logs Dashboard",
  "description": "Real-time application monitoring",
  "panels": [
    {
      "title": "Log Level Distribution",
      "type": "visualization",
      "query": {
        "query": "service: api-service",
        "language": "kuery"
      },
      "visualization": {
        "type": "pie",
        "field": "level.keyword"
      }
    },
    {
      "title": "Error Rate Over Time",
      "type": "visualization",
      "query": {
        "query": "level: error",
        "language": "kuery"
      },
      "visualization": {
        "type": "line",
        "field": "@timestamp",
        "interval": "5m"
      }
    },
    {
      "title": "Top Errors",
      "type": "visualization",
      "query": {
        "query": "level: error",
        "language": "kuery"
      },
      "visualization": {
        "type": "table",
        "fields": ["@timestamp", "message", "service", "error.message"],
        "size": 10
      }
    },
    {
      "title": "Request Duration Heatmap",
      "type": "visualization",
      "query": {
        "query": "_exists_: duration",
        "language": "kuery"
      },
      "visualization": {
        "type": "heatmap",
        "x_field": "@timestamp",
        "y_field": "url.keyword",
        "value_field": "duration"
      }
    },
    {
      "title": "Geographic Distribution",
      "type": "visualization",
      "query": {
        "query": "_exists_: geoip.location",
        "language": "kuery"
      },
      "visualization": {
        "type": "map",
        "field": "geoip.location"
      }
    }
  ],
  "timeRestore": true,
  "timeFrom": "now-24h",
  "timeTo": "now"
}
```

## Alerting (Watcher)

```json
// PUT _watcher/watch/high-error-rate
{
  "trigger": {
    "schedule": {
      "interval": "5m"
    }
  },
  "input": {
    "search": {
      "request": {
        "indices": ["logs-*"],
        "body": {
          "query": {
            "bool": {
              "must": [
                { "term": { "level": "error" } },
                {
                  "range": {
                    "@timestamp": {
                      "gte": "now-5m"
                    }
                  }
                }
              ]
            }
          },
          "aggs": {
            "error_count": {
              "value_count": {
                "field": "_id"
              }
            }
          }
        }
      }
    }
  },
  "condition": {
    "compare": {
      "ctx.payload.aggregations.error_count.value": {
        "gt": 100
      }
    }
  },
  "actions": {
    "send_email": {
      "email": {
        "to": "sre@example.com",
        "subject": "High error rate detected",
        "body": "Error count in last 5 minutes: {{ctx.payload.aggregations.error_count.value}}"
      }
    },
    "send_slack": {
      "webhook": {
        "scheme": "https",
        "host": "hooks.slack.com",
        "port": 443,
        "method": "post",
        "path": "/services/YOUR/WEBHOOK/URL",
        "body": "{\"text\":\"🚨 High error rate: {{ctx.payload.aggregations.error_count.value}} errors in 5 minutes\"}"
      }
    }
  }
}
```

## Docker Compose

```yaml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - 'ES_JAVA_OPTS=-Xms512m -Xmx512m'
    volumes:
      - elasticsearch-data:/usr/share/elasticsearch/data
    ports:
      - '9200:9200'
    networks:
      - elk

  logstash:
    image: docker.elastic.co/logstash/logstash:8.11.0
    container_name: logstash
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    ports:
      - '5000:5000/tcp'
      - '5044:5044'
      - '8080:8080'
    depends_on:
      - elasticsearch
    networks:
      - elk

  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    container_name: kibana
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - '5601:5601'
    depends_on:
      - elasticsearch
    networks:
      - elk

  filebeat:
    image: docker.elastic.co/beats/filebeat:8.11.0
    container_name: filebeat
    user: root
    volumes:
      - ./filebeat.yml:/usr/share/filebeat/filebeat.yml:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /var/log:/var/log:ro
    command: filebeat -e -strict.perms=false
    depends_on:
      - logstash
    networks:
      - elk

volumes:
  elasticsearch-data:

networks:
  elk:
    driver: bridge
```

Build centralized logging and operational intelligence with the ELK Stack.

## Output Locations

This agent saves all documentation outputs to `.orchestr8/docs/` with consistent categorization.

**Output Directory**: `.orchestr8/docs/infrastructure/`

**Naming Convention**: `[type]-[name]-YYYY-MM-DD.md`

### Output Examples:
- **Report**: `.orchestr8/docs/infrastructure/[component]-YYYY-MM-DD.md`

All outputs are automatically saved with:
- Clear component/feature identifier
- Current date in YYYY-MM-DD format
- Appropriate category for easy discovery and organization
