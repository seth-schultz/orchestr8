---
id: security-input-validation
category: skill
tags: [security, validation, sanitization, xss, sql-injection, input-validation]
capabilities:
  - Input validation and sanitization strategies
  - SQL injection prevention patterns
  - XSS attack prevention techniques
  - Command injection prevention methods
  - Schema validation design principles
relatedResources:
  - orchestr8://examples/security/input-validation-implementation
  - orchestr8://skills/security-owasp-top10
  - orchestr8://skills/security-api-security
estimatedTokens: 280
useWhen:
  - Implementing input validation with Zod schema validation preventing injection attacks and malformed data
  - Building sanitization layer for user input escaping HTML, SQL, and command injection vectors
  - Creating comprehensive validation strategy checking data types, lengths, formats, and business rules
  - Designing whitelist-based input validation rejecting unexpected fields and enforcing strict schemas
  - Implementing rate limiting per endpoint preventing abuse and protecting against DoS attacks
---

# Input Validation & Sanitization Security

## Overview

Input validation is critical for preventing injection attacks and ensuring data integrity. This skill covers validation strategies, sanitization patterns, and security best practices.

For complete implementation code, see: `orchestr8://examples/security/input-validation-implementation`

## Schema Validation with Zod

### Why Schema Validation
- **Type safety**: Validate data types at runtime
- **Data transformation**: Trim, lowercase, normalize inputs
- **Complex validation**: Nested objects, conditional rules
- **Clear error messages**: Field-specific validation errors
- **Fail fast**: Reject invalid data before processing

### Schema Validation Strategies
1. **Define strict schemas**: Explicitly list all allowed fields
2. **Use middleware**: Validate at the edge (before business logic)
3. **Transform data**: Normalize inputs (trim, lowercase)
4. **Whitelist fields**: Strip unknown properties
5. **Custom validators**: Business rule validation with `refine()`

### Common Patterns
- **Email validation**: `z.string().email().toLowerCase()`
- **Password rules**: `z.string().min(8).max(100).regex()`
- **Enums**: `z.enum(['user', 'admin', 'moderator'])`
- **Nested objects**: `z.object({ profile: z.object({...}) })`
- **Optional fields**: `z.string().optional()`

## SQL Injection Prevention

### Core Principles
- **Never concatenate SQL**: Use parameterized queries or ORMs
- **Parameterized queries**: Bind parameters separately from SQL
- **ORM usage**: Prisma, TypeORM, Sequelize handle escaping
- **Whitelist dynamic values**: Table names, column names, sort fields
- **Stored procedures**: Consider for complex queries

### Prevention Strategies
1. **Use ORM**: Automatic parameterization (Prisma, TypeORM)
2. **Parameterized queries**: Use `$1, $2` placeholders (PostgreSQL) or `?` (MySQL)
3. **Whitelist approach**: For dynamic column names and tables
4. **Input validation**: Reject special characters in identifiers
5. **Least privilege**: Database user with minimal permissions

## XSS Prevention

### Types of XSS
- **Stored XSS**: Malicious script stored in database, executed on page load
- **Reflected XSS**: Script in URL/request, reflected in response
- **DOM-based XSS**: Client-side script manipulates DOM unsafely

### Prevention Strategies
1. **HTML escaping**: Convert `<`, `>`, `&`, `"`, `'` to entities
2. **Sanitize HTML**: Use DOMPurify for rich text content
3. **Content Security Policy**: Restrict script sources with CSP headers
4. **HttpOnly cookies**: Prevent JavaScript access to session tokens
5. **Context-aware encoding**: Different escaping for HTML, JS, URL, CSS

### Key Techniques
- **Plain text**: Always escape (convert to HTML entities)
- **Rich text**: Sanitize with DOMPurify, whitelist tags/attributes
- **User-generated HTML**: Strip `<script>`, `<iframe>`, event handlers
- **Security headers**: CSP, X-XSS-Protection (Helmet.js)
- **Template engines**: Use auto-escaping (React, Vue, Angular)

## Command Injection Prevention

### Why Command Injection Happens
- **Shell metacharacters**: `;`, `|`, `&`, `$()`, backticks allow command chaining
- **User input in commands**: Concatenating user data into shell commands
- **exec() vs spawn()**: `exec()` uses shell, `spawn()` does not

### Prevention Strategies
1. **Avoid shell commands**: Use native libraries instead
2. **Use spawn() not exec()**: Array arguments, no shell interpretation
3. **Whitelist operations**: Predefined set of allowed commands
4. **Validate inputs**: Strict regex for filenames and parameters
5. **Least privilege**: Run processes with minimal permissions

### Safe Alternatives
- **File operations**: Use `fs` module, not shell commands
- **Image processing**: Use sharp library, not ImageMagick CLI
- **Archive extraction**: Use archiver/tar libraries, not tar command
- **Network requests**: Use fetch/axios, not curl command

## Path Traversal Prevention

### Attack Vectors
- **Directory traversal**: `../../etc/passwd`, `..%2F..%2Fetc%2Fpasswd`
- **Absolute paths**: `/etc/passwd`, `C:\Windows\System32\config\SAM`
- **Symbolic links**: Following symlinks to restricted areas
- **URL encoding**: `%2e%2e%2f` (encoded `../`)

### Prevention Strategies
1. **Use path.basename()**: Strips directory components
2. **Resolve absolute path**: Check it starts with allowed directory
3. **Whitelist characters**: Allow only `[a-zA-Z0-9_.-]`
4. **No direct user paths**: Store files with generated names (UUIDs)
5. **Chroot/jail**: Restrict process to specific directory

## NoSQL Injection Prevention

### MongoDB-Specific Attacks
- **Operator injection**: `{ email: { $ne: null } }` matches all records
- **Query manipulation**: `{ $where: "malicious_code" }`
- **Blind NoSQL injection**: Extract data through timing attacks

### Prevention Strategies
1. **Type validation**: Ensure strings are strings (use Zod)
2. **Sanitize operators**: Strip keys starting with `$`
3. **Use ORM safely**: Mongoose with strict schemas
4. **Disable $where**: MongoDB option to disable JavaScript queries
5. **Whitelist fields**: Only allow expected query fields

## File Upload Validation

### Security Risks
- **Malicious files**: Executable files disguised as images
- **MIME type spoofing**: Client-provided type can be faked
- **Filename attacks**: Path traversal in filenames
- **DOS attacks**: Huge files exhaust disk space
- **Polyglot files**: Valid in multiple formats (JPEG + HTML)

### Validation Layers
1. **File size limit**: Prevent disk exhaustion (5-10MB for images)
2. **Extension whitelist**: Only allow expected extensions
3. **MIME type check**: Validate client-provided type (can be spoofed)
4. **Magic bytes**: Read file header to verify actual type
5. **Generate safe name**: UUID + validated extension, ignore user filename
6. **Scan for viruses**: Use ClamAV or cloud scanning service
7. **Store outside web root**: Serve through application, not static hosting

## Best Practices Summary

### Essential Validation Measures
1. **Validate all input**: Use schema validation (Zod, Joi, Yup) at API boundary
2. **Whitelist, don't blacklist**: Define allowed values explicitly, reject unknown
3. **Use parameterized queries**: Never concatenate SQL, use ORM or prepared statements
4. **Sanitize HTML**: Use DOMPurify for rich text, escape plain text
5. **Validate file uploads**: Check magic bytes, not just extensions or MIME types
6. **No shell execution**: Use array arguments with spawn/execFile, avoid exec()
7. **Prevent path traversal**: Use path.basename and validate against allowed directory
8. **Type checking**: Ensure primitives, not objects (NoSQL injection prevention)
9. **Context-aware encoding**: Different escaping for HTML, JS, URL, CSS contexts
10. **Set security headers**: CSP, X-XSS-Protection with Helmet.js

### Validation Strategy
| Input Type | Validation Approach | Example |
|-----------|---------------------|---------|
| Email | Schema + regex | `z.string().email()` |
| Password | Length + complexity | `z.string().min(8).regex()` |
| Enum values | Whitelist | `z.enum(['user', 'admin'])` |
| File uploads | Magic bytes + size | `fileTypeFromBuffer()` |
| SQL identifiers | Whitelist | `ALLOWED_COLUMNS.includes()` |
| URLs | Protocol + domain | `new URL()` + whitelist |
| Filenames | Regex + basename | `/^[a-zA-Z0-9_.-]+$/` |

## Related Security Skills

### Parent Skills
- **OWASP Top 10**: `orchestr8://skills/security-owasp-top10`
  - Maps to A03:2021 Injection vulnerabilities
  - General security vulnerability framework

### Related Domain Skills
- **API Security**: `orchestr8://skills/security-api-security`
  - Request validation in API middleware
  - Rate limiting to prevent abuse
  - Security headers for XSS protection

## Compliance and Standards

### Security Standards
- **OWASP Top 10**: A03:2021 Injection
- **PCI DSS**: 6.5.1 Injection flaws
- **CWE-79**: Cross-site Scripting (XSS)
- **CWE-89**: SQL Injection
- **CWE-78**: OS Command Injection
- **CWE-22**: Path Traversal

### Regulatory Requirements
- **SOC 2**: CC6.6 Input validation controls
- **GDPR**: Article 32 Security of processing
- **HIPAA**: 164.312(c)(1) Data integrity controls
