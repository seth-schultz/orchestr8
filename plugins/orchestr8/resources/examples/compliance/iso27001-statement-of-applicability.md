---
id: iso27001-statement-of-applicability
category: example
tags: [compliance, iso27001, soa, controls, audit]
capabilities:
  - Annex A control mapping
  - Control applicability assessment
  - Implementation status tracking
  - Justification documentation
  - Compliance reporting
useWhen:
  - Creating Statement of Applicability (SoA)
  - Documenting control implementation
  - Preparing for ISO 27001 audit
  - Tracking control deployment status
  - Justifying control exclusions
estimatedTokens: 620
relatedResources:
  - orchestr8://agents/iso27001-specialist
  - orchestr8://agents/compliance-audit-specialist
  - orchestr8://agents/security-testing-compliance
---

# ISO 27001 Statement of Applicability (SoA)

## Overview
The Statement of Applicability (SoA) documents which Annex A controls are applicable to your ISMS, their implementation status, and justification for inclusion or exclusion.

## Annex A Control Categories

### ISO 27001:2022 Structure

**93 Total Controls across 4 Themes:**

1. **Organizational Controls (37 controls)** - Policies, roles, risk management
2. **People Controls (8 controls)** - HR security, awareness, training
3. **Physical Controls (14 controls)** - Facility security, equipment protection
4. **Technological Controls (34 controls)** - Technical security measures

## Complete Annex A Control List

### Organizational Controls (A.5)

```yaml
# Policies and Procedures
A.5.1: Policies for information security
A.5.2: Information security roles and responsibilities
A.5.3: Segregation of duties
A.5.4: Management responsibilities
A.5.5: Contact with authorities
A.5.6: Contact with special interest groups
A.5.7: Threat intelligence
A.5.8: Information security in project management
A.5.9: Inventory of information and other associated assets
A.5.10: Acceptable use of information and assets
A.5.11: Return of assets
A.5.12: Classification of information
A.5.13: Labelling of information
A.5.14: Information transfer
A.5.15: Access control
A.5.16: Identity management
A.5.17: Authentication information
A.5.18: Access rights
A.5.19: Information security in supplier relationships
A.5.20: Addressing information security within supplier agreements
A.5.21: Managing information security in ICT supply chain
A.5.22: Monitoring, review and change management of supplier services
A.5.23: Information security for use of cloud services
A.5.24: Information security incident management planning and preparation
A.5.25: Assessment and decision on information security events
A.5.26: Response to information security incidents
A.5.27: Learning from information security incidents
A.5.28: Collection of evidence
A.5.29: Information security during disruption
A.5.30: ICT readiness for business continuity
A.5.31: Legal, statutory, regulatory and contractual requirements
A.5.32: Intellectual property rights
A.5.33: Protection of records
A.5.34: Privacy and protection of PII
A.5.35: Independent review of information security
A.5.36: Compliance with policies, rules and standards
A.5.37: Documented operating procedures
```

### People Controls (A.6)

```yaml
A.6.1: Screening
A.6.2: Terms and conditions of employment
A.6.3: Information security awareness, education and training
A.6.4: Disciplinary process
A.6.5: Responsibilities after termination or change of employment
A.6.6: Confidentiality or non-disclosure agreements
A.6.7: Remote working
A.6.8: Information security event reporting
```

### Physical Controls (A.7)

```yaml
A.7.1: Physical security perimeters
A.7.2: Physical entry
A.7.3: Securing offices, rooms and facilities
A.7.4: Physical security monitoring
A.7.5: Protecting against physical and environmental threats
A.7.6: Working in secure areas
A.7.7: Clear desk and clear screen
A.7.8: Equipment siting and protection
A.7.9: Security of assets off-premises
A.7.10: Storage media
A.7.11: Supporting utilities
A.7.12: Cabling security
A.7.13: Equipment maintenance
A.7.14: Secure disposal or re-use of equipment
```

### Technological Controls (A.8)

```yaml
# Access and Authentication
A.8.1: User endpoint devices
A.8.2: Privileged access rights
A.8.3: Information access restriction
A.8.4: Access to source code
A.8.5: Secure authentication

# Operations
A.8.6: Capacity management
A.8.7: Protection against malware
A.8.8: Management of technical vulnerabilities
A.8.9: Configuration management
A.8.10: Information deletion
A.8.11: Data masking
A.8.12: Data leakage prevention
A.8.13: Information backup
A.8.14: Redundancy of information processing facilities
A.8.15: Logging
A.8.16: Monitoring activities
A.8.17: Clock synchronization
A.8.18: Use of privileged utility programs
A.8.19: Installation of software on operational systems

# Network Security
A.8.20: Networks security
A.8.21: Security of network services
A.8.22: Segregation of networks
A.8.23: Web filtering
A.8.24: Use of cryptography

# Secure Development
A.8.25: Secure development life cycle
A.8.26: Application security requirements
A.8.27: Secure system architecture and engineering principles
A.8.28: Secure coding
A.8.29: Security testing in development and acceptance
A.8.30: Outsourced development
A.8.31: Separation of development, test and production environments
A.8.32: Change management
A.8.33: Test information
A.8.34: Protection of information systems during audit testing
```

## Statement of Applicability Template

```markdown
# Statement of Applicability

Organization: [Your Organization]
ISMS Scope: [Scope Statement]
Date: [YYYY-MM-DD]
Version: [1.0]

## Control Applicability Summary

| Control | Title | Applicable? | Justification | Implementation Status | Evidence |
|---------|-------|-------------|---------------|----------------------|----------|
| A.5.1 | Policies for information security | Yes | Required for all organizations | Implemented | Information Security Policy v2.1 |
| A.5.7 | Threat intelligence | Yes | Monitor cyber threats | Partially implemented | Threat intelligence feed subscription |
| A.8.7 | Protection against malware | Yes | Critical protection | Implemented | Antivirus on all endpoints |
| A.8.11 | Data masking | Yes | Protect PII in non-prod | Not implemented | Planned Q1 2024 |
| A.7.11 | Supporting utilities | No | Cloud-hosted, no physical control | N/A | Infrastructure is cloud-based |
| A.8.24 | Use of cryptography | Yes | Data protection requirement | Implemented | TLS 1.3, AES-256 encryption |

## Implementation Status Legend

- **Implemented**: Control fully operational and effective
- **Partially Implemented**: Control partially deployed, work in progress
- **Not Implemented**: Control identified but not yet deployed
- **N/A**: Control not applicable to organization

## Control Applicability Statistics

Total Controls: 93
Applicable: 87 (93.5%)
Not Applicable: 6 (6.5%)

### Implementation Status
- Implemented: 65 (74.7%)
- Partially Implemented: 15 (17.2%)
- Not Implemented: 7 (8.0%)

## Controls Not Applicable

| Control | Title | Justification |
|---------|-------|---------------|
| A.7.11 | Supporting utilities | Cloud-hosted infrastructure, no physical data center |
| A.7.12 | Cabling security | Cloud-hosted infrastructure, no physical cabling |
| A.7.13 | Equipment maintenance | Cloud provider responsibility |
| A.7.5 | Protecting against physical threats | Cloud provider responsibility |
| A.7.6 | Working in secure areas | No secure areas defined, remote workforce |
| A.8.30 | Outsourced development | All development in-house |

## Planned Implementations

| Control | Title | Priority | Target Date | Owner |
|---------|-------|----------|-------------|-------|
| A.8.11 | Data masking | High | Q1 2024 | IT Manager |
| A.8.12 | Data leakage prevention | High | Q2 2024 | Security Team |
| A.5.7 | Threat intelligence | Medium | Q1 2024 | CISO |
| A.8.14 | Redundancy | Medium | Q2 2024 | Infrastructure Team |
```

## Usage Notes

- Update SoA whenever controls change
- Review annually during management review
- Map SoA controls to risk treatment plan
- Document all implementation decisions
- Include SoA in Stage 1 audit documentation
- Ensure evidence available for all "Implemented" controls
- Track remediation timeline for non-implemented controls
- Justify all "Not Applicable" decisions clearly
- Link controls to policies and procedures
- Use SoA as checklist for internal audits
