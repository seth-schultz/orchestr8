---
id: assumption-validation-confidence-scoring
category: example
tags: [assumption-validation, confidence-scoring, metrics, decision-making]
capabilities:
  - Quantitative confidence calculation framework
  - Multi-dimensional scoring system
  - Statistical validation metrics
  - Evidence-based decision thresholds
useWhen:
  - Calculating confidence scores for assumption validation results
  - Quantifying validation quality across multiple dimensions
  - Making evidence-based go/no-go decisions
estimatedTokens: 450
relatedResources:
  - orchestr8://skills/assumption-validation
---

# Assumption Validation: Confidence Scoring Framework

Complete TypeScript implementation for calculating multi-dimensional confidence scores from validation results.

## Confidence Score Calculation

```typescript
interface ConfidenceScore {
  overall: number; // 0-100
  dimensions: {
    dataQuality: number;        // 0-100
    sampleSize: number;         // 0-100
    methodology: number;        // 0-100
    consistency: number;        // 0-100
    expertise: number;          // 0-100
  };
  factors: {
    positive: string[];         // What increases confidence
    negative: string[];         // What decreases confidence
    assumptions: string[];      // Remaining assumptions
    limitations: string[];      // Known limitations
  };
  recommendation: 'high-confidence' | 'moderate-confidence' | 'low-confidence' | 'insufficient-data';
}

interface ValidationResult {
  usedProductionData: boolean;
  coveredAllScenarios: boolean;
  measurementAccuracy: number;
  measurements: any[];
  requiredSampleSize: number;
  dataVariance: number;
  controlledEnvironment: boolean;
  repeatedMultipleTimes: boolean;
  isolatedVariables: boolean;
  properInstrumentation: boolean;
  resultVariance: number;
  outlierCount: number;
  reproducibleResults: boolean;
  teamExperienceLevel: number;
  expertReviewed: boolean;
  industryResearchConsulted: boolean;
}

function calculateConfidence(validation: ValidationResult): ConfidenceScore {
  // Data Quality (0-100)
  const dataQuality = calculateDataQuality({
    realistic: validation.usedProductionData ? 100 : 50,
    complete: validation.coveredAllScenarios ? 100 : 70,
    accurate: validation.measurementAccuracy // 0-100
  });

  // Sample Size (0-100)
  const sampleSize = calculateSampleSize({
    n: validation.measurements.length,
    required: validation.requiredSampleSize,
    variance: validation.dataVariance
  });

  // Methodology (0-100)
  const methodology = calculateMethodology({
    controlled: validation.controlledEnvironment ? 100 : 60,
    repeatable: validation.repeatedMultipleTimes ? 100 : 50,
    isolated: validation.isolatedVariables ? 100 : 70,
    instrumented: validation.properInstrumentation ? 100 : 80
  });

  // Consistency (0-100)
  const consistency = calculateConsistency({
    variance: validation.resultVariance, // Low variance = high score
    outliers: validation.outlierCount,   // Few outliers = high score
    reproducible: validation.reproducibleResults ? 100 : 50
  });

  // Expertise (0-100)
  const expertise = calculateExpertise({
    experience: validation.teamExperienceLevel, // 0-100
    reviewed: validation.expertReviewed ? 100 : 70,
    researched: validation.industryResearchConsulted ? 100 : 80
  });

  const overall = (
    dataQuality * 0.25 +
    sampleSize * 0.20 +
    methodology * 0.25 +
    consistency * 0.15 +
    expertise * 0.15
  );

  return {
    overall,
    dimensions: { dataQuality, sampleSize, methodology, consistency, expertise },
    factors: identifyFactors(validation),
    recommendation: getRecommendation(overall)
  };
}

function calculateDataQuality(scores: { realistic: number; complete: number; accurate: number }): number {
  return (scores.realistic * 0.4 + scores.complete * 0.3 + scores.accurate * 0.3);
}

function calculateSampleSize(data: { n: number; required: number; variance: number }): number {
  const adequacy = Math.min(100, (data.n / data.required) * 100);
  const variancePenalty = Math.max(0, 100 - data.variance * 10);
  return (adequacy * 0.7 + variancePenalty * 0.3);
}

function calculateMethodology(scores: { controlled: number; repeatable: number; isolated: number; instrumented: number }): number {
  return (scores.controlled + scores.repeatable + scores.isolated + scores.instrumented) / 4;
}

function calculateConsistency(data: { variance: number; outliers: number; reproducible: number }): number {
  const varianceScore = Math.max(0, 100 - data.variance * 20);
  const outlierScore = Math.max(0, 100 - data.outliers * 10);
  return (varianceScore * 0.4 + outlierScore * 0.3 + data.reproducible * 0.3);
}

function calculateExpertise(scores: { experience: number; reviewed: number; researched: number }): number {
  return (scores.experience * 0.5 + scores.reviewed * 0.25 + scores.researched * 0.25);
}

function getRecommendation(score: number): string {
  if (score >= 85) return 'high-confidence';
  if (score >= 70) return 'moderate-confidence';
  if (score >= 50) return 'low-confidence';
  return 'insufficient-data';
}

function identifyFactors(validation: ValidationResult) {
  const positive: string[] = [];
  const negative: string[] = [];

  if (validation.usedProductionData) positive.push('Used production data');
  else negative.push('Synthetic data used');

  if (validation.controlledEnvironment) positive.push('Controlled environment');
  else negative.push('Uncontrolled variables');

  if (validation.expertReviewed) positive.push('Expert validation');

  return {
    positive,
    negative,
    assumptions: ['Production environment may differ', 'Long-term effects unknown'],
    limitations: ['Limited to tested scenarios', 'Time-constrained validation']
  };
}
```

## Usage Example

```typescript
const validationResult: ValidationResult = {
  usedProductionData: true,
  coveredAllScenarios: true,
  measurementAccuracy: 92,
  measurements: new Array(100000),
  requiredSampleSize: 50000,
  dataVariance: 0.08,
  controlledEnvironment: true,
  repeatedMultipleTimes: true,
  isolatedVariables: true,
  properInstrumentation: true,
  resultVariance: 0.05,
  outlierCount: 3,
  reproducibleResults: true,
  teamExperienceLevel: 78,
  expertReviewed: true,
  industryResearchConsulted: true
};

const confidence = calculateConfidence(validationResult);
console.log(`Overall Confidence: ${confidence.overall}/100`);
console.log(`Recommendation: ${confidence.recommendation}`);
```
