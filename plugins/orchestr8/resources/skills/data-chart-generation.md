---
id: data-chart-generation
category: skill
tags: [charts, data-visualization, matplotlib, chartjs, comparison, metrics, performance, medium-images]
capabilities:
  - Generate professional comparison charts (before/after, A vs B)
  - Create performance metric visualizations (time series, distributions)
  - Produce cost analysis and ROI charts
  - Build benchmark result visualizations
  - Generate token usage, memory, and performance comparisons
  - Create web-optimized PNG charts for Medium articles
useWhen:
  - Visualizing performance improvements or comparisons
  - Showing cost savings or ROI metrics
  - Illustrating token usage, memory, or resource optimization
  - Creating data-driven content for Medium articles
  - Supporting technical claims with visual evidence
  - Generating benchmark result visualizations
estimatedTokens: 320
---

# Data Chart Generation

Create professional, publication-quality charts for technical articles, documentation, and Medium publications using Python (Matplotlib) or JavaScript (Chart.js).

## Overview

**Why Charts Matter:**
- 63% higher engagement on articles with data visualizations
- Complex data becomes immediately understandable
- Builds credibility with specific, visualized metrics
- Makes technical content accessible to broader audiences

**Output Requirements:**
- High resolution (300 DPI for print, 150 DPI for web)
- Professional color schemes
- Clear labels and legends
- Optimized file sizes (<500KB for charts)
- PNG format with transparency support

## Technology Stack

### Option 1: Python + Matplotlib (Recommended)

**Pros:**
- Full control over appearance
- Professional, publication-quality output
- Extensive customization options
- Great for complex visualizations
- Large ecosystem of extensions

**Setup:**
```bash
pip install matplotlib numpy pandas seaborn
```

### Option 2: JavaScript + Chart.js

**Pros:**
- Web-native, interactive capabilities
- Easier integration with web apps
- Modern, clean aesthetic
- Good for simple charts

**Setup:**
```bash
npm install chart.js canvas chartjs-node-canvas
```

### Option 3: Mermaid Charts

**Pros:**
- Markdown-native
- No dependencies
- Version control friendly
- Quick for simple visualizations

**Cons:**
- Limited customization
- Basic chart types only

## Common Chart Types

### 1. Comparison Bar Charts

**Use Case**: Before/after, Method A vs Method B, multiple options comparison

**Key Features:**
- Automatic reduction percentage calculation
- Value labels on bars
- Professional color schemes
- Publication-quality output

For complete Python implementation with token usage and cost comparison examples:
→ `orchestr8://examples/skills/chart-generation-comparison-bars`

### 2. Other Chart Types

**Time Series Charts:**
- Performance over time with before/after comparison
- Vertical line markers for key events
- Dual-color plotting for comparison

**Distribution Charts (Pie/Donut):**
- Resource allocation visualization
- Component breakdown with percentages
- Exploded slices for emphasis

**Multi-Series Comparison:**
- Multiple metrics side-by-side
- Grouped bar charts with legends
- Value labels on each bar

## Unified Chart Generation Script

Production-ready CLI tool for automated chart generation:

**Features:**
- Command-line interface with argparse
- Flexible data input (JSON or key:value format)
- Multiple chart types (comparison, pie, timeline, benchmark)
- Customizable titles and output paths

**Usage Examples:**
```bash
python generate-chart.py --type comparison --data "Before:200000,After:5000" --output chart.png
python generate-chart.py --type pie --data '{"Core":35,"API":25,"Data":20}' --title "Resources"
```

For complete implementation with all chart types:
→ `orchestr8://examples/skills/chart-generation-unified-script`

## Professional Styling Tips

### Color Palettes

**Professional (default)**:
```python
colors = {
    'primary': '#1168bd',    # Blue
    'success': '#2d7a3e',    # Green
    'danger': '#d9534f',     # Red
    'warning': '#f39c12',    # Orange
    'info': '#5bc0de',       # Light Blue
    'neutral': '#999999'     # Gray
}
```

**Vibrant**:
```python
colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6']
```

**Monochrome**:
```python
colors = ['#2c3e50', '#34495e', '#7f8c8d', '#95a5a6', '#bdc3c7']
```

### Typography
```python
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['Arial', 'Helvetica', 'DejaVu Sans']
plt.rcParams['font.size'] = 11
plt.rcParams['font.weight'] = 'normal'
```

### Grid and Spines
```python
# Clean minimal style
ax.grid(axis='y', alpha=0.3, linestyle='--', linewidth=0.8)
ax.set_axisbelow(True)  # Grid behind bars
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['left'].set_linewidth(1.5)
ax.spines['bottom'].set_linewidth(1.5)
```

## Best Practices

1. **High Resolution**: 150 DPI for web, 300 DPI for print
2. **Clear Labels**: No abbreviations, descriptive axis labels
3. **Readable Fonts**: Minimum 10pt, bold for emphasis
4. **Color Accessibility**: Use patterns/textures for colorblind users
5. **White Space**: Don't cram too much data
6. **Professional Colors**: Avoid neon, use muted professional palette
7. **Source Attribution**: Add data source in subtitle or footer
8. **Optimize Files**: Compress PNG without losing quality
9. **Test Sizes**: Verify readability at thumbnail size
10. **Consistent Style**: Match visual style across all charts

## Optimization

### File Size Reduction
```python
# Optimize for web
plt.savefig('chart.png', dpi=150, bbox_inches='tight', 
            optimize=True, facecolor='white')

# Or use external tool
# pngquant chart.png --quality=85-95 --output chart-optimized.png
```

### Responsive Sizing
```python
# For different contexts
sizes = {
    'hero': (19.20, 10.80),  # 1920x1080 for hero images
    'inline': (12, 6),        # Standard inline chart
    'thumbnail': (8, 6),      # Smaller charts
    'square': (10, 10)        # Square for social media
}

fig, ax = plt.subplots(figsize=sizes['inline'], dpi=150)
```

## Integration with Medium Workflow

```python
# In Phase 3 of visualization generation:

# 1. Extract metrics from article content
metrics = extract_metrics_from_article('medium/article.md')

# 2. Generate relevant charts
if 'token_usage' in metrics:
    generate_token_comparison(metrics['token_usage'])

if 'cost_savings' in metrics:
    generate_cost_comparison(metrics['cost_savings'])

# 3. Save to medium/images/
# 4. Update article with image references
# 5. Generate captions and alt text
```

---

**With these tools, you can create publication-quality charts that make technical content engaging and credible!**
