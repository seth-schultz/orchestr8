---
id: chart-generation-comparison-bars
category: example
tags: [charts, matplotlib, comparison, before-after, data-visualization]
capabilities:
  - Professional comparison bar chart generation
  - Token/performance comparison visualization
  - Automatic reduction percentage calculation
  - Publication-quality styling
useWhen:
  - Creating before/after comparisons
  - Visualizing performance improvements
  - Showing token usage reductions
estimatedTokens: 280
relatedResources:
  - orchestr8://skills/data-chart-generation
---

# Chart Generation: Comparison Bar Charts

Python implementation for generating professional before/after comparison charts with automatic reduction percentage display.

## Token Usage Comparison Example

```python
#!/usr/bin/env python3
"""
Generate token usage comparison chart
Usage: python generate-chart.py --type token-comparison --output medium/images/
"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np

def generate_token_comparison():
    # Data
    categories = ['Traditional\nApproach', 'On-Demand\nLoading']
    values = [200000, 5000]
    colors = ['#d9534f', '#2d7a3e']  # Red for old, Green for new

    # Create figure
    fig, ax = plt.subplots(figsize=(10, 6), dpi=150)

    # Create bars
    bars = ax.bar(categories, values, color=colors, width=0.6, edgecolor='white', linewidth=2)

    # Add value labels on bars
    for bar in bars:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height,
                f'{int(height):,} tokens',
                ha='center', va='bottom', fontsize=14, fontweight='bold')

    # Calculate and show reduction
    reduction_pct = ((values[0] - values[1]) / values[0]) * 100
    reduction_tokens = values[0] - values[1]

    # Add reduction annotation
    ax.text(0.5, max(values) * 0.55,
            f'{reduction_pct:.0f}% Reduction\n({reduction_tokens:,} tokens saved)',
            ha='center', va='center', fontsize=18, fontweight='bold',
            bbox=dict(boxstyle='round,pad=0.8', facecolor='white',
                     edgecolor='#1168bd', linewidth=3))

    # Styling
    ax.set_ylabel('Token Count', fontsize=13, fontweight='bold')
    ax.set_title('Token Usage: Traditional vs On-Demand Loading',
                 fontsize=16, fontweight='bold', pad=20)
    ax.set_ylim(0, max(values) * 1.2)
    ax.grid(axis='y', alpha=0.3, linestyle='--')
    ax.set_axisbelow(True)

    # Format y-axis with commas
    ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda x, p: f'{int(x):,}'))

    # Remove top and right spines
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

    plt.tight_layout()
    plt.savefig('token-comparison.png', dpi=150, bbox_inches='tight',
                facecolor='white', transparent=False)
    print("✓ Chart saved: token-comparison.png")

if __name__ == '__main__':
    generate_token_comparison()
```

## Cost Comparison Variant

```python
def generate_cost_comparison():
    methods = ['DALL-E 3', 'Stable Diffusion\n(Replicate)', 'Gradient\nFallback']
    costs = [0.06, 0.003, 0]  # Cost per image in dollars
    colors = ['#e74c3c', '#f39c12', '#2ecc71']

    fig, ax = plt.subplots(figsize=(10, 6), dpi=150)

    bars = ax.bar(methods, costs, color=colors, width=0.6, edgecolor='white', linewidth=2)

    # Add cost labels
    for bar in bars:
        height = bar.get_height()
        label = f'${height:.3f}' if height > 0 else 'Free'
        ax.text(bar.get_x() + bar.get_width()/2., height,
                label, ha='center', va='bottom', fontsize=14, fontweight='bold')

    ax.set_ylabel('Cost per Image ($)', fontsize=13, fontweight='bold')
    ax.set_title('Hero Image Generation: Cost Comparison',
                 fontsize=16, fontweight='bold', pad=20)
    ax.set_ylim(0, max(costs) * 1.3)
    ax.grid(axis='y', alpha=0.3, linestyle='--')
    ax.set_axisbelow(True)

    # Add savings annotation
    savings_pct = ((costs[0] - costs[1]) / costs[0]) * 100
    ax.text(1.5, max(costs) * 0.5,
            f'{savings_pct:.0f}% cheaper\nthan DALL-E',
            ha='center', fontsize=12,
            bbox=dict(boxstyle='round', facecolor='#2ecc71', alpha=0.2))

    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

    plt.tight_layout()
    plt.savefig('cost-comparison.png', dpi=150, bbox_inches='tight', facecolor='white')
    print("✓ Chart saved: cost-comparison.png")
```
