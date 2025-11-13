---
id: iso27001-risk-assessment
category: example
tags: [compliance, iso27001, risk-assessment, security, audit]
capabilities:
  - Asset identification and classification
  - Threat and vulnerability assessment
  - Risk calculation and scoring
  - CIA rating methodology
  - Risk treatment planning
useWhen:
  - Conducting ISO 27001 risk assessments
  - Implementing ISMS risk management
  - Calculating information security risks
  - Planning risk treatment strategies
  - Preparing for ISO 27001 certification
estimatedTokens: 780
relatedResources:
  - orchestr8://agents/iso27001-specialist
  - orchestr8://agents/compliance-audit-specialist
  - orchestr8://agents/security-testing-compliance
---

# ISO 27001 Risk Assessment Implementation

## Overview
Python implementation of ISO 27001 risk assessment methodology (Clause 6.1.2) with asset identification, threat analysis, vulnerability assessment, and risk calculation.

## Risk Assessment Process

### Asset Identification

```python
# ISO 27001 Risk Assessment
class ISO27001RiskAssessment:
    def __init__(self):
        self.assets = []
        self.threats = []
        self.vulnerabilities = []
        self.risks = []

    def identify_assets(self):
        """Clause 8.1 - Asset inventory"""
        asset_categories = {
            'information_assets': [
                'Customer database',
                'Source code repository',
                'Financial records',
                'Employee data',
                'Intellectual property'
            ],
            'software_assets': [
                'Operating systems',
                'Applications',
                'Development tools',
                'Database systems'
            ],
            'physical_assets': [
                'Servers',
                'Workstations',
                'Mobile devices',
                'Storage devices'
            ],
            'services': [
                'Cloud hosting',
                'Email service',
                'Payment processing',
                'Authentication service'
            ],
            'people': [
                'Developers',
                'Administrators',
                'Support staff'
            ]
        }

        for category, items in asset_categories.items():
            for item in items:
                asset = {
                    'name': item,
                    'category': category,
                    'owner': self.assign_owner(item),
                    'confidentiality': self.rate_cia(item, 'C'),
                    'integrity': self.rate_cia(item, 'I'),
                    'availability': self.rate_cia(item, 'A')
                }
                self.assets.append(asset)

    def rate_cia(self, asset, attribute):
        """Rate Confidentiality, Integrity, Availability"""
        # 1=Low, 2=Medium, 3=High
        # Based on business impact if compromised

        high_confidentiality = [
            'Customer database', 'Financial records',
            'Employee data', 'Intellectual property'
        ]
        high_integrity = [
            'Financial records', 'Database systems',
            'Payment processing'
        ]
        high_availability = [
            'Email service', 'Payment processing',
            'Authentication service', 'Database systems'
        ]

        if attribute == 'C' and asset in high_confidentiality:
            return 3
        elif attribute == 'I' and asset in high_integrity:
            return 3
        elif attribute == 'A' and asset in high_availability:
            return 3
        elif attribute in ['C', 'I', 'A']:
            return 2
        return 1

    def assign_owner(self, asset):
        """Assign asset owner"""
        owner_map = {
            'Customer database': 'CTO',
            'Source code repository': 'Engineering Manager',
            'Financial records': 'CFO',
            'Employee data': 'HR Manager',
            'Cloud hosting': 'Infrastructure Team',
            'Email service': 'IT Manager'
        }
        return owner_map.get(asset, 'Asset Manager')
```

### Threat and Vulnerability Identification

```python
    def identify_threats(self):
        """Common threats from Annex A"""
        return [
            {'name': 'Unauthorized access', 'type': 'intentional'},
            {'name': 'Malware infection', 'type': 'intentional'},
            {'name': 'Data breach', 'type': 'intentional'},
            {'name': 'Insider threat', 'type': 'intentional'},
            {'name': 'Phishing attack', 'type': 'intentional'},
            {'name': 'DDoS attack', 'type': 'intentional'},
            {'name': 'Hardware failure', 'type': 'accidental'},
            {'name': 'Human error', 'type': 'accidental'},
            {'name': 'Natural disaster', 'type': 'environmental'},
            {'name': 'Power outage', 'type': 'environmental'},
        ]

    def identify_vulnerabilities(self):
        """Technical and organizational vulnerabilities"""
        return [
            {'name': 'Unpatched software', 'severity': 'high'},
            {'name': 'Weak passwords', 'severity': 'high'},
            {'name': 'No MFA', 'severity': 'high'},
            {'name': 'Inadequate logging', 'severity': 'medium'},
            {'name': 'Lack of encryption', 'severity': 'high'},
            {'name': 'No backup testing', 'severity': 'medium'},
            {'name': 'Insufficient training', 'severity': 'medium'},
            {'name': 'No access reviews', 'severity': 'medium'},
            {'name': 'Missing security policies', 'severity': 'high'},
            {'name': 'No incident response plan', 'severity': 'high'},
        ]
```

### Risk Assessment and Calculation

```python
    def assess_risk(self, asset, threat, vulnerability):
        """Calculate risk level"""
        # Likelihood (1-5) x Impact (1-5) = Risk Score (1-25)

        likelihood = self.calculate_likelihood(threat, vulnerability)
        impact = self.calculate_impact(asset, threat)
        risk_score = likelihood * impact

        if risk_score >= 20:
            risk_level = 'Critical'
        elif risk_score >= 15:
            risk_level = 'High'
        elif risk_score >= 10:
            risk_level = 'Medium'
        elif risk_score >= 5:
            risk_level = 'Low'
        else:
            risk_level = 'Very Low'

        return {
            'asset': asset['name'],
            'threat': threat['name'],
            'vulnerability': vulnerability['name'],
            'likelihood': likelihood,
            'impact': impact,
            'risk_score': risk_score,
            'risk_level': risk_level,
            'treatment_required': risk_score >= 10
        }

    def calculate_likelihood(self, threat, vulnerability):
        """1=Rare, 2=Unlikely, 3=Possible, 4=Likely, 5=Almost Certain"""
        # Consider threat type and vulnerability severity

        likelihood_map = {
            ('intentional', 'high'): 5,
            ('intentional', 'medium'): 4,
            ('intentional', 'low'): 3,
            ('accidental', 'high'): 4,
            ('accidental', 'medium'): 3,
            ('accidental', 'low'): 2,
            ('environmental', 'high'): 3,
            ('environmental', 'medium'): 2,
            ('environmental', 'low'): 1,
        }

        key = (threat['type'], vulnerability['severity'])
        return likelihood_map.get(key, 3)

    def calculate_impact(self, asset, threat):
        """1=Insignificant, 2=Minor, 3=Moderate, 4=Major, 5=Severe"""
        # Based on CIA rating of asset
        max_cia = max(
            asset['confidentiality'],
            asset['integrity'],
            asset['availability']
        )

        # Add business impact factor
        if max_cia == 3:
            return 5  # Severe
        elif max_cia == 2:
            return 3  # Moderate
        else:
            return 2  # Minor
```

### Run Assessment

```python
    def run_assessment(self):
        """Execute complete risk assessment"""
        self.identify_assets()
        threats = self.identify_threats()
        vulnerabilities = self.identify_vulnerabilities()

        # Assess each combination
        for asset in self.assets:
            for threat in threats:
                for vulnerability in vulnerabilities:
                    # Only assess relevant combinations
                    if self.is_relevant_combination(asset, threat, vulnerability):
                        risk = self.assess_risk(asset, threat, vulnerability)
                        self.risks.append(risk)

        # Sort by risk score
        self.risks.sort(key=lambda x: x['risk_score'], reverse=True)

        return self.risks

    def is_relevant_combination(self, asset, threat, vulnerability):
        """Filter out irrelevant risk combinations"""
        # Implement business logic to determine relevance
        return True

    def generate_risk_report(self):
        """Generate risk assessment report"""
        report = {
            'total_assets': len(self.assets),
            'total_risks': len(self.risks),
            'critical_risks': sum(1 for r in self.risks if r['risk_level'] == 'Critical'),
            'high_risks': sum(1 for r in self.risks if r['risk_level'] == 'High'),
            'medium_risks': sum(1 for r in self.risks if r['risk_level'] == 'Medium'),
            'low_risks': sum(1 for r in self.risks if r['risk_level'] == 'Low'),
            'treatment_required': sum(1 for r in self.risks if r['treatment_required'])
        }
        return report

# Run assessment
assessment = ISO27001RiskAssessment()
risks = assessment.run_assessment()
report = assessment.generate_risk_report()

print(f"Risk Assessment Summary:")
print(f"  Total Assets: {report['total_assets']}")
print(f"  Total Risks: {report['total_risks']}")
print(f"  Critical: {report['critical_risks']}")
print(f"  High: {report['high_risks']}")
print(f"  Medium: {report['medium_risks']}")
print(f"  Treatment Required: {report['treatment_required']}")
```

## Usage Notes

- Customize asset categories for your organization
- Adjust CIA ratings based on business impact
- Review and update risk assessments annually
- Document risk acceptance decisions
- Map risks to Annex A controls for treatment
- Maintain risk register throughout certification
- Involve asset owners in risk assessment
- Consider residual risk after control implementation
