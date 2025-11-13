---
id: sqlserver-security-features
category: example
tags: [sql-server, security, encryption, authentication, row-level-security, tde]
capabilities:
  - Row-level security implementation
  - Transparent Data Encryption (TDE)
  - Always Encrypted for column-level encryption
  - Dynamic Data Masking for PII protection
  - Audit configuration
useWhen:
  - Implementing multi-tenant row-level security
  - Encrypting databases at rest with TDE
  - Protecting sensitive columns with Always Encrypted
  - Masking PII data for non-privileged users
  - Setting up compliance auditing
estimatedTokens: 850
relatedResources:
  - orchestr8://agents/sqlserver-specialist
---

# SQL Server Security Features

## Overview
Comprehensive security features for SQL Server including row-level security, encryption at rest and in columns, data masking, and auditing.

## Implementation

```sql
-- Create login and user
CREATE LOGIN AppUser WITH PASSWORD = 'StrongP@ssw0rd!';
USE MyDB;
CREATE USER AppUser FOR LOGIN AppUser;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::dbo TO AppUser;

-- Row-level security
CREATE FUNCTION dbo.fn_TenantSecurityPredicate(@TenantID INT)
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN SELECT 1 as result
WHERE @TenantID = CAST(SESSION_CONTEXT(N'TenantID') AS INT);
GO

CREATE SECURITY POLICY TenantFilter
ADD FILTER PREDICATE dbo.fn_TenantSecurityPredicate(TenantID) ON dbo.Users,
ADD BLOCK PREDICATE dbo.fn_TenantSecurityPredicate(TenantID) ON dbo.Users;
GO

-- Set tenant context
EXEC sp_set_session_context @key = N'TenantID', @value = 123;

-- Transparent Data Encryption (TDE)
USE master;
GO
CREATE MASTER KEY ENCRYPTION BY PASSWORD = 'MasterKeyP@ssw0rd!';
GO
CREATE CERTIFICATE TDECert WITH SUBJECT = 'TDE Certificate';
GO

USE MyDB;
GO
CREATE DATABASE ENCRYPTION KEY
WITH ALGORITHM = AES_256
ENCRYPTION BY SERVER CERTIFICATE TDECert;
GO

ALTER DATABASE MyDB SET ENCRYPTION ON;
GO

-- Always Encrypted
CREATE COLUMN MASTER KEY CMK_Auto
WITH (
    KEY_STORE_PROVIDER_NAME = 'MSSQL_CERTIFICATE_STORE',
    KEY_PATH = 'CurrentUser/My/<thumbprint>'
);

CREATE COLUMN ENCRYPTION KEY CEK_Auto
WITH VALUES (
    COLUMN_MASTER_KEY = CMK_Auto,
    ALGORITHM = 'RSA_OAEP',
    ENCRYPTED_VALUE = 0x...
);

-- Encrypt existing column
ALTER TABLE Users
ALTER COLUMN SSN VARCHAR(11)
ENCRYPTED WITH (
    COLUMN_ENCRYPTION_KEY = CEK_Auto,
    ENCRYPTION_TYPE = DETERMINISTIC,
    ALGORITHM = 'AEAD_AES_256_CBC_HMAC_SHA_256'
);

-- Dynamic Data Masking
ALTER TABLE Users
ALTER COLUMN Email ADD MASKED WITH (FUNCTION = 'email()');

ALTER TABLE Users
ALTER COLUMN Phone ADD MASKED WITH (FUNCTION = 'partial(0,"XXX-XXX-",4)');

-- Audit
CREATE SERVER AUDIT MyAudit
TO FILE (FILEPATH = 'C:\Audit\');

CREATE SERVER AUDIT SPECIFICATION MyServerAudit
FOR SERVER AUDIT MyAudit
ADD (FAILED_LOGIN_GROUP);

CREATE DATABASE AUDIT SPECIFICATION MyDatabaseAudit
FOR SERVER AUDIT MyAudit
ADD (SELECT, INSERT, UPDATE, DELETE ON SCHEMA::dbo BY public);

ALTER SERVER AUDIT MyAudit WITH (STATE = ON);
```

## Usage Notes

**Row-Level Security:**
- Use `SESSION_CONTEXT` to store user-specific filters
- `FILTER PREDICATE` - Filters SELECT queries automatically
- `BLOCK PREDICATE` - Prevents INSERT/UPDATE/DELETE violations
- Ideal for multi-tenant SaaS applications

**Transparent Data Encryption (TDE):**
- Encrypts entire database at rest
- Transparent to applications (no code changes)
- Backup master key and certificate to separate location
- Minimal performance impact (~3-5%)

**Always Encrypted:**
- Column-level encryption with keys in client
- **DETERMINISTIC** - Allows equality searches, reveals patterns
- **RANDOMIZED** - Maximum security, no server-side operations
- Requires application code changes for encryption/decryption

**Dynamic Data Masking:**
- **email()** - Shows first character and domain (e.g., jXXX@XXXX.com)
- **partial(n, "padding", m)** - Shows first n and last m characters
- **default()** - Masks entire value with XXXX
- Only masks data for non-privileged users

**Audit:**
- Track database access and changes for compliance
- Server-level audit (logins, permissions)
- Database-level audit (data access, modifications)
- Store audit logs to file, Windows Event Log, or Application Log
