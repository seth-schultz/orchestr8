# Secrets Management

Enterprise-grade secrets management for Claude Code Orchestration System.

## Overview

This system supports multiple secrets management backends for secure credential storage.

## Supported Backends

### 1. HashiCorp Vault

**Best for:** Multi-cloud, hybrid environments, secrets rotation

#### Setup
```bash
vault server -dev
export VAULT_ADDR='http://127.0.0.1:8200'
export VAULT_TOKEN='your-token'
```

#### Store Secrets
```bash
vault kv put secret/claude/api claude_api_key="sk-ant-..."
```

#### Python Integration
```python
import hvac
client = hvac.Client(url='http://127.0.0.1:8200', token='token')
secret = client.secrets.kv.v2.read_secret_version(path='claude/api')
api_key = secret['data']['data']['claude_api_key']
```

### 2. AWS Secrets Manager

**Best for:** AWS-native applications

#### Store Secrets
```bash
aws secretsmanager create-secret \
  --name claude/api \
  --secret-string '{"claude_api_key":"sk-ant-..."}'
```

#### Python Integration
```python
import boto3, json
client = boto3.client('secretsmanager')
response = client.get_secret_value(SecretId='claude/api')
secret = json.loads(response['SecretString'])
```

### 3. Azure Key Vault

**Best for:** Azure-native applications

#### Store Secrets
```bash
az keyvault secret set \
  --vault-name my-vault \
  --name claude-api-key \
  --value "sk-ant-..."
```

#### Python Integration
```python
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

credential = DefaultAzureCredential()
client = SecretClient(vault_url="https://vault.azure.net", credential=credential)
secret = client.get_secret("claude-api-key")
```

## Best Practices

1. **Never commit secrets** - Add to .gitignore
2. **Use least privilege** - Minimal permissions
3. **Rotate regularly** - API keys every 90 days
4. **Audit access** - Enable logging
5. **Environment-specific** - Separate dev/staging/prod

## Security Checklist

- [ ] Never commit secrets to version control
- [ ] Use secrets manager (Vault, AWS, Azure)
- [ ] Implement least privilege access
- [ ] Enable audit logging
- [ ] Rotate secrets regularly
- [ ] Use environment-specific secrets
