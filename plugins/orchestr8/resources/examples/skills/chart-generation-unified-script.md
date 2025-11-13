---
id: chart-generation-unified-script
category: example
tags: [charts, matplotlib, automation, cli, data-visualization]
capabilities:
  - Command-line chart generation
  - Dynamic data input from CLI arguments
  - Multiple chart type support
  - JSON and key:value data parsing
useWhen:
  - Creating automated chart generation workflows
  - Generating charts from CLI or scripts
  - Building reusable chart generation tools
estimatedTokens: 350
relatedResources:
  - orchestr8://skills/data-chart-generation
---

# Chart Generation: Unified CLI Script

Production-ready Python script for generating charts from command-line with flexible data input formats.

## Unified Chart Generator

```python
#!/usr/bin/env python3
"""
Unified chart generation script
Usage: python scripts/generate-chart.py --type [chart-type] --data [data] --output [path]

Examples:
  python generate-chart.py --type comparison --data "Before:200000,After:5000" --title "Token Usage" --output token-chart.png
  python generate-chart.py --type comparison --data '{"Redux":127,"Zustand":68,"Jotai":74}' --title "Lines of Code"
"""

import argparse
import json
import matplotlib.pyplot as plt
import numpy as np

def parse_data(data_str):
    """Parse data from command line argument"""
    try:
        return json.loads(data_str)
    except:
        # Try simple key:value format
        pairs = data_str.split(',')
        return {k.strip(): float(v.strip()) for k, v in
                (pair.split(':') for pair in pairs)}

def generate_comparison(data, title, output):
    """Generate comparison bar chart"""
    categories = list(data.keys())
    values = list(data.values())
    colors = ['#d9534f', '#2d7a3e', '#1168bd', '#f39c12'][:len(categories)]

    fig, ax = plt.subplots(figsize=(10, 6), dpi=150)
    bars = ax.bar(categories, values, color=colors, width=0.6)

    for bar in bars:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height,
                f'{int(height):,}',
                ha='center', va='bottom', fontsize=12, fontweight='bold')

    ax.set_title(title, fontsize=16, fontweight='bold', pad=20)
    ax.grid(axis='y', alpha=0.3, linestyle='--')
    ax.set_axisbelow(True)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

    plt.tight_layout()
    plt.savefig(output, dpi=150, bbox_inches='tight', facecolor='white')
    print(f"✓ Chart saved: {output}")

def generate_pie(data, title, output):
    """Generate pie chart"""
    labels = list(data.keys())
    sizes = list(data.values())
    colors = ['#1168bd', '#5bc0de', '#2d7a3e', '#d9534f', '#999999'][:len(labels)]
    explode = [0.05 if i == 0 else 0 for i in range(len(labels))]

    fig, ax = plt.subplots(figsize=(10, 8), dpi=150)

    wedges, texts, autotexts = ax.pie(sizes, explode=explode, labels=labels,
                                        colors=colors, autopct='%1.1f%%',
                                        startangle=90, textprops={'fontsize': 12})

    for autotext in autotexts:
        autotext.set_color('white')
        autotext.set_fontweight('bold')
        autotext.set_fontsize(13)

    for text in texts:
        text.set_fontweight('bold')
        text.set_fontsize(12)

    ax.set_title(title, fontsize=16, fontweight='bold', pad=20)

    plt.tight_layout()
    plt.savefig(output, dpi=150, bbox_inches='tight', facecolor='white')
    print(f"✓ Chart saved: {output}")

def main():
    parser = argparse.ArgumentParser(description='Generate data visualization charts')
    parser.add_argument('--type', required=True,
                       choices=['comparison', 'timeline', 'pie', 'benchmark'],
                       help='Chart type')
    parser.add_argument('--data', required=True, help='Data in JSON or key:value format')
    parser.add_argument('--title', default='Data Comparison', help='Chart title')
    parser.add_argument('--output', default='chart.png', help='Output file path')

    args = parser.parse_args()

    data = parse_data(args.data)

    if args.type == 'comparison':
        generate_comparison(data, args.title, args.output)
    elif args.type == 'pie':
        generate_pie(data, args.title, args.output)
    # Add other types as needed

if __name__ == '__main__':
    main()
```

## Usage Examples

```bash
# Simple comparison chart
python generate-chart.py --type comparison \
  --data "Before:200000,After:5000" \
  --title "Token Usage Reduction" \
  --output token-chart.png

# JSON data format
python generate-chart.py --type comparison \
  --data '{"Redux":127,"Zustand":68,"Jotai":74,"Recoil":81}' \
  --title "Lines of Code Comparison" \
  --output loc-comparison.png

# Pie chart
python generate-chart.py --type pie \
  --data "Core Logic:35,API:25,Data:20,Cache:15,Other:5" \
  --title "Resource Allocation" \
  --output resource-pie.png
```
