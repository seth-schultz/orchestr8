---
id: security-secrets-management
category: skill
tags: [security, secrets, vault, encryption, environment-variables, kms]
capabilities:
  - Secret storage and retrieval strategies
  - Environment variable security best practices
  - Secret rotation and key management
  - Vault and cloud secret manager integration
  - Encryption at rest for sensitive data
relatedResources:
  - orchestr8://examples/security/secrets-management-implementation
  - orchestr8://skills/security-owasp-top10
  - orchestr8://skills/security-authentication-jwt
  - orchestr8://skills/security-authentication-oauth
  - orchestr8://skills/security-api-security
estimatedTokens: 300
useWhen:
  - Implementing secrets management with AWS Secrets Manager for database credentials and API keys in production
  - Building secure environment variable handling with dotenv for local development and encrypted secrets in CI/CD
  - Designing secret rotation strategy with automatic credential updates and zero-downtime deployment
  - Creating secrets access control with IAM roles and policies restricting secret retrieval to authorized services
  - Implementing secret scanning with git-secrets preventing accidental credential commits to version control
---

# Secrets Management Security

## Overview

Secrets management is critical for protecting sensitive credentials, API keys, and encryption keys. This skill covers strategies for secure storage, rotation, and access control of secrets.

For complete implementation code, see: `orchestr8://examples/security/secrets-management-implementation`

## Core Concepts

### What Are Secrets?
- **Credentials**: Database passwords, API keys, service accounts
- **Certificates**: TLS/SSL certificates, private keys
- **Tokens**: JWT secrets, OAuth client secrets
- **Encryption Keys**: Data encryption keys, key encryption keys
- **Configuration**: Sensitive config values (connection strings)

### Secret Management Goals
1. **Confidentiality**: Only authorized access
2. **Integrity**: Prevent tampering
3. **Availability**: Access when needed
4. **Auditability**: Track all access
5. **Rotation**: Regular credential updates

## Environment Variables Strategy

### Development (Local)
- **Use .env files**: Load with dotenv package
- **Validate on startup**: Use Zod or similar schema validator
- **Fail fast**: Exit if required secrets missing
- **Example file**: Commit .env.example with placeholders
- **Gitignore**: Never commit actual .env files

### Production Considerations
- **Don't use .env in production**: Use proper secret managers
- **Container environment**: Set via orchestration (K8s secrets, ECS task definitions)
- **Cloud platforms**: Use native secret services
- **Validate early**: Check all required variables on app startup

## Secret Encryption at Rest

### Why Encrypt Secrets
- **Defense in depth**: Even if database compromised, secrets protected
- **Compliance**: Many regulations require encryption at rest
- **Principle of least privilege**: Attackers need encryption key + database access

### Encryption Best Practices
- **Algorithm**: AES-256-GCM (provides authentication)
- **Key management**: Store encryption key separately (environment variable, KMS)
- **IV (Initialization Vector)**: Generate random IV for each encryption
- **Auth tag**: GCM mode provides integrity verification
- **Storage**: Store encrypted value, IV, and auth tag

### When to Encrypt
- User API keys and tokens
- OAuth refresh tokens
- External service credentials
- Sensitive user data (SSN, credit cards)
- Backup encryption keys

## Secret Management Solutions

### HashiCorp Vault
**Best for**: Multi-cloud, on-premises, hybrid environments

#### Features
- **Dynamic secrets**: Generate credentials on-demand
- **Lease management**: Automatic expiration and renewal
- **Encryption as a service**: Centralized encryption operations
- **Audit logging**: Complete audit trail
- **Access policies**: Fine-grained access control
- **Secret engines**: Multiple backend support (AWS, databases, PKI)

#### Use Cases
- Database credential rotation
- PKI/Certificate management
- Encryption key management
- Multi-cloud deployments

### AWS Secrets Manager
**Best for**: AWS-native applications

#### Features
- **Automatic rotation**: Built-in for RDS, Redshift, DocumentDB
- **IAM integration**: Use IAM roles and policies
- **VPC endpoints**: Private access without internet
- **CloudTrail logging**: Audit all access
- **Cross-region replication**: Disaster recovery
- **Versioning**: Track secret changes

#### Use Cases
- RDS database credentials
- API keys for external services
- Application configuration
- Lambda function secrets

### Azure Key Vault
**Best for**: Azure-native applications

#### Features
- **Managed HSM**: Hardware security module support
- **Certificate management**: Automated renewal
- **Soft delete**: Recover deleted secrets
- **Access policies**: RBAC and vault access policies
- **Private endpoints**: Network isolation

### Google Cloud Secret Manager
**Best for**: GCP-native applications

#### Features
- **Automatic replication**: Multi-region support
- **IAM integration**: Fine-grained permissions
- **Audit logging**: Cloud Audit Logs
- **Versioning**: Multiple versions with aliases
- **Rotation**: Automated with Cloud Scheduler

### Kubernetes Secrets
**Best for**: Container orchestration platforms

#### Features
- **Native integration**: Mount as volumes or env vars
- **Namespaced**: Isolation per namespace
- **RBAC**: Role-based access control
- **External Secrets Operator**: Sync from external providers
- **Sealed Secrets**: Encrypt secrets in Git

#### Limitations
- **Base64 encoded**: Not encrypted by default
- **etcd encryption**: Enable encryption at rest
- **Use external secrets**: For production (Vault, cloud providers)

## Secret Rotation Strategies

### Why Rotate Secrets
- **Reduce blast radius**: Limit damage from compromised credentials
- **Compliance**: Many standards require regular rotation (90 days)
- **Insider threat**: Mitigate risk from former employees
- **Detection time**: Assume breach, rotate before exploitation

### Rotation Approaches

#### 1. **Manual Rotation**
- Admin generates new secret
- Update secret in manager
- Deploy apps with new secret
- **Downside**: Requires downtime or careful coordination

#### 2. **Automatic Rotation (Zero-Downtime)**
- Secret manager generates new credential
- Update database/service with new credential
- **Grace period**: Support both old and new (1 hour)
- Gradually roll out new credential
- Revoke old credential after grace period

#### 3. **Versioned Secrets**
- Maintain multiple versions (current, previous)
- Apps try current first, fall back to previous
- Rotate by creating new version
- Remove old versions after rollout complete

### Rotation Frequency
| Secret Type | Rotation Frequency | Reason |
|-------------|-------------------|--------|
| Database passwords | 90 days | Compliance, best practice |
| API keys | 180 days | Balance security and ops |
| JWT secrets | Never (versioned) | Use key rotation instead |
| Encryption keys | Annual | Cryptographic lifecycle |
| Certificates | Before expiry | Automated renewal |
| Service accounts | 90 days | Compliance requirement |

## Access Control Patterns

### Principle of Least Privilege
- **Service-specific secrets**: Each service gets only needed secrets
- **Read-only access**: Most apps only need read, not write
- **Time-bound access**: Temporary credentials for debugging
- **Just-in-time access**: Request approval for production secrets

### IAM Policies (AWS Example)
```yaml
# Allow specific service to read specific secrets
Policy:
  Effect: Allow
  Action: secretsmanager:GetSecretValue
  Resource: arn:aws:secretsmanager:region:account:secret:app/*
  Condition:
    StringEquals:
      aws:PrincipalTag/Service: app-backend
```

### Vault Policies (HashiCorp Example)
```hcl
# Read-only access to database secrets
path "secret/data/database/*" {
  capabilities = ["read", "list"]
}

# Write access for automation
path "secret/data/automation/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}
```

## Best Practices Summary

### Essential Security Measures
1. **Never hardcode secrets**: Use environment variables, secret managers, or KMS
2. **Encrypt at rest**: AES-256-GCM for secrets stored in databases
3. **Rotate regularly**: Automated rotation with 90-180 day cycles
4. **Use secret managers**: Vault for multi-cloud, native services for cloud
5. **Validate on startup**: Fail fast if required secrets missing
6. **Least privilege**: Service-specific IAM roles and policies
7. **Audit everything**: Log all secret access with CloudTrail/audit logs
8. **Grace periods**: Support old + new secrets during rotation
9. **Separate environments**: Distinct secrets per environment (dev/staging/prod)
10. **Secret scanning**: Pre-commit hooks to prevent credential leaks

### Secret Storage Hierarchy
| Environment | Storage Method | Example |
|-------------|---------------|---------|
| Local Dev | .env files (gitignored) | dotenv package |
| CI/CD | Encrypted variables | GitHub Secrets, GitLab CI/CD |
| Staging | Cloud secret manager | AWS Secrets Manager |
| Production | Cloud secret manager + KMS | AWS Secrets Manager + KMS encryption |
| Kubernetes | External Secrets Operator | Sync from Vault/cloud provider |

### Secret Scanning Tools
- **git-secrets**: Prevent commits with secrets (AWS)
- **TruffleHog**: Scan git history for secrets
- **detect-secrets**: Yelp's secret detection (pre-commit hook)
- **GitGuardian**: SaaS secret detection and alerting
- **GitHub Secret Scanning**: Built-in for public/enterprise repos

## Common Pitfalls to Avoid

### Critical Mistakes
- ❌ **Hardcoding secrets**: Secrets in source code, committed to Git
- ❌ **Committing .env files**: Accidentally pushing credentials
- ❌ **Logging secrets**: Writing secrets to application logs
- ❌ **Client-side secrets**: API keys exposed in frontend JavaScript
- ❌ **Base64 != encryption**: Base64 is encoding, not encryption
- ❌ **Weak encryption**: Using ECB mode or inadequate key sizes
- ❌ **Shared secrets**: Same secret across environments
- ❌ **No rotation**: Credentials used indefinitely
- ❌ **Overly permissive**: All services access all secrets

### Remediation Steps
1. **Immediate**: Rotate compromised secrets
2. **Audit**: Check logs for unauthorized access
3. **Revoke**: Invalidate all instances of leaked secret
4. **Investigate**: Determine how secret was exposed
5. **Prevent**: Add secret scanning to CI/CD pipeline

## Related Security Skills

### Parent Skills
- **OWASP Top 10**: `orchestr8://skills/security-owasp-top10`
  - Maps to A02:2021 Cryptographic Failures
  - General secrets and credential security principles

### Authentication Skills
- **JWT Authentication**: `orchestr8://skills/security-authentication-jwt`
  - JWT signing key management and rotation
  - Refresh token encryption at rest
  - Secret storage for token generation

- **OAuth 2.0**: `orchestr8://skills/security-authentication-oauth`
  - OAuth client secret storage and rotation
  - Access and refresh token encryption
  - Provider API key management

### Related Domain Skills
- **API Security**: `orchestr8://skills/security-api-security`
  - API key generation and management
  - Secure storage of API credentials
  - Key rotation strategies for API keys

## Compliance and Standards

### Regulatory Requirements
- **PCI DSS**:
  - 3.4 Cryptographic key management
  - 3.5 Protect keys against disclosure
  - 3.6 Document key management procedures
- **SOC 2**:
  - CC6.1 Logical and physical access controls
  - CC6.6 Logical access protection
  - CC6.7 Restriction of access rights
- **GDPR**:
  - Article 32 Security of processing (encryption)
  - Article 25 Data protection by design
- **HIPAA**:
  - 164.312(a)(2)(iv) Encryption and decryption
  - 164.308(a)(3) Workforce security
- **NIST**:
  - SP 800-57 Key Management Recommendations
  - SP 800-175B Cryptographic Standards

### Industry Standards
- **OWASP**: A02:2021 Cryptographic Failures
- **CIS Controls**: Control 3 (Data Protection)
- **ISO 27001**: A.10.1 Cryptographic controls
- **FedRAMP**: Moderate/High baseline requirements
