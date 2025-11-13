---
description: Generate visualizations, diagrams, and charts for Medium articles and
  technical documentation
argument-hint: '[article-path-or-theme] [--type=all|diagrams|charts|hero]'
allowed-tools:
- Bash
- Edit
- Glob
- Grep
- Read
- SlashCommand
- TodoWrite
- Write
---

# Generate Visualizations Command

Automatically generate professional visualizations including Mermaid diagrams, data charts, token usage comparisons, and hero images for Medium articles and technical documentation.


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "orchestr8"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Usage

```bash
# Generate all visualizations for a Medium article
/orchestr8:generate-visualizations medium/article.md

# Generate specific visualization types
/orchestr8:generate-visualizations medium/article.md --type=diagrams
/orchestr8:generate-visualizations medium/article.md --type=charts
/orchestr8:generate-visualizations medium/article.md --type=hero

# Generate from theme/topic
/orchestr8:generate-visualizations "AI optimization and token management"

# Generate for project documentation
/orchestr8:generate-visualizations . --type=diagrams
```

## Phase 1: Analysis & Planning (0-20%)

**→ Load Agent:** orchestr8://agents/visualization-specialist

**Activities:**
- Analyze article content or project codebase
- Identify key concepts requiring visualization
- Determine appropriate diagram types and data visualizations
- Plan hero image concept if Medium article
- Map technical architecture if code project

**Outputs:**
- List of required visualizations with priorities
- Themes and concepts for each visualization
- File naming and organization plan

**Success Criteria:**
- ✅ All visualization opportunities identified
- ✅ Appropriate types selected for each concept
- ✅ Clear output directory structure planned

**→ Checkpoint:** Analysis complete, visualization plan ready

## Phase 2: Mermaid Diagram Generation (20-45%)

**→ Load:** orchestr8://skills/mermaid-diagram-generation

**Parallel Tracks:**

### Track 1: Architecture Diagrams
For technical content or code projects:
- **System Context (C4 L0)**: High-level system and external dependencies
- **Container Diagram (C4 L1)**: Applications, databases, services
- **Component Diagram (C4 L2)**: Internal components and relationships
- **Code Diagram (C4 L3)**: Class structures (if needed)

### Track 2: Flow Diagrams
- **Data Flow**: How information moves through the system
- **Sequence Diagrams**: Temporal interactions and API calls
- **State Machines**: Workflow states and transitions
- **User Journey**: Decision trees and experience paths

### Track 3: Data Diagrams
- **Entity Relationship**: Database schema and relationships
- **Deployment Topology**: Infrastructure and deployment architecture

**Output Format:**
```markdown
<!-- Saved to: medium/diagrams/[type]-[description].md -->

# [Diagram Title]

**Purpose**: [What this diagram shows]

**Context**: [When to reference this diagram]

```mermaid
[Mermaid diagram code]
```

**Key Points:**
- [Important aspect 1]
- [Important aspect 2]
```

**Color Standards:**
- Blue (#1168bd): Internal systems/components
- Gray (#999999): External systems
- Green (#2d7a3e): Databases/persistence
- Red (#d9534f): Cache layers
- Orange (#f0ad4e): Message queues
- Light Blue (#5bc0de): User interfaces

**Success Criteria:**
- ✅ Diagrams render correctly in Mermaid
- ✅ Appropriate level of detail (not too complex)
- ✅ Clear labels and relationships
- ✅ Consistent color scheme
- ✅ Saved to organized directory structure

**→ Checkpoint:** Mermaid diagrams generated and validated

## Phase 3: Data Chart Generation (45-70%)

**→ Load:** orchestr8://skills/data-chart-generation

**Chart Types:**

### Performance Comparisons
- Token usage before/after
- Cost comparison charts
- Speed/latency improvements
- Memory usage reduction

### Metrics Visualization
- Time series data (usage over time)
- Distribution charts (load distribution)
- Comparison bars (method A vs method B)
- Pie charts (resource allocation)

**Technology Options:**

1. **Matplotlib + Python** (Best for complex charts)
   ```python
   python scripts/generate-chart.py \
     --type comparison \
     --data "Before: 200000, After: 5000" \
     --title "Token Usage Reduction" \
     --output medium/images/
   ```

2. **Chart.js + Node** (Web-ready, interactive)
   ```bash
   node scripts/generate-chart.js \
     --type bar \
     --data data.json \
     --output medium/images/chart.png
   ```

3. **Mermaid Charts** (Simple, markdown-native)
   ```mermaid
   %%{init: {'theme':'base'}}%%
   pie title Token Distribution
       "Loaded Upfront" : 200000
       "Loaded On-Demand" : 5000
   ```

**Output Requirements:**
- High resolution (1920px width minimum for hero images)
- PNG format with transparency support
- Optimized file size (<500KB for charts)
- Clear labels, legend, and title
- Professional color scheme

**Success Criteria:**
- ✅ Data accurately represented
- ✅ Charts are readable at small sizes
- ✅ Professional appearance
- ✅ Proper file naming and organization
- ✅ Alt text descriptions included

**→ Checkpoint:** Charts generated and verified

## Phase 4: Screenshot Generation (70-85%)

**→ Load:** orchestr8://skills/screenshot-automation

**Screenshot Types:**

### Code Examples
- Syntax-highlighted code blocks
- Terminal output captures
- Configuration files

### Application Screenshots
- UI mockups or actual application views
- Dashboard visualizations
- Before/after comparisons

### Diagram Renders
- Mermaid diagrams rendered as images
- Architecture visualizations
- Flow diagrams

**Technology Options:**

1. **Playwright for Web Screenshots**
   ```bash
   python scripts/screenshot.py \
     --url "https://mermaid.live/view?code=[encoded]" \
     --output medium/images/architecture.png
   ```

2. **Carbon for Code Screenshots**
   ```bash
   python scripts/code-screenshot.py \
     --file src/example.ts \
     --theme monokai \
     --output medium/images/code-example.png
   ```

3. **Mermaid CLI for Diagram Renders**
   ```bash
   mmdc -i diagram.mmd -o medium/images/diagram.png -w 1920 -b transparent
   ```

**Success Criteria:**
- ✅ High resolution (2x for retina)
- ✅ Proper cropping and margins
- ✅ Readable text at display size
- ✅ Professional appearance
- ✅ Consistent styling

**→ Checkpoint:** Screenshots captured and optimized

## Phase 5: Hero Image Generation (85-95%)

**→ Load:** orchestr8://skills/medium-hero-image-generation

**Activities:**
- Extract article theme and key concepts
- Generate AI-powered hero image (DALL-E 3 or Stable Diffusion)
- Create fallback gradient if APIs unavailable
- Optimize image for Medium (1920x1080, <5MB)
- Update article frontmatter with image path

**Command:**
```bash
python scripts/generate-hero-image.py \
  --file medium/article.md \
  --method dalle \
  --update
```

**Success Criteria:**
- ✅ Image matches article theme
- ✅ Professional, modern aesthetic
- ✅ Proper dimensions (1920x1080)
- ✅ Frontmatter updated
- ✅ Alt text included

**→ Checkpoint:** Hero image generated and integrated

## Phase 6: Integration & Documentation (95-100%)

**Activities:**

### 1. Organize Output Files
```
medium/
├── article.md
├── images/
│   ├── hero.png
│   ├── token-comparison-chart.png
│   ├── architecture-diagram.png
│   └── code-screenshot.png
└── diagrams/
    ├── system-context.md
    ├── data-flow.md
    └── sequence-api-auth.md
```

### 2. Generate Index
Create `medium/diagrams/README.md`:
```markdown
# Visualizations for [Article Title]

## Diagrams
- [System Context](system-context.md) - High-level architecture
- [Data Flow](data-flow.md) - Information movement
- [API Sequence](sequence-api-auth.md) - Authentication flow

## Charts
- ![Token Comparison](../images/token-comparison-chart.png)
- ![Cost Savings](../images/cost-comparison-chart.png)

## Hero Image
- ![Hero](../images/hero.png)
```

### 3. Update Article References
Add image references in article markdown:
```markdown
![Architecture Overview](images/architecture-diagram.png)
*Figure 1: System architecture showing dynamic resource loading*

![Token Usage Comparison](images/token-comparison-chart.png)
*Figure 2: 97% reduction in token usage*
```

### 4. Generate Summary Report
Create `medium/VISUALIZATIONS.md`:
```markdown
# Visualization Generation Report

**Article**: [Title]
**Generated**: [Date]

## Generated Visualizations

### Diagrams (Mermaid)
- ✅ System Context Diagram
- ✅ Data Flow Diagram
- ✅ Sequence Diagram (API Authentication)

### Charts
- ✅ Token Usage Comparison (97% reduction)
- ✅ Cost Comparison (40x savings)

### Screenshots
- ✅ Code Example: TypeScript implementation
- ✅ Architecture render

### Hero Image
- ✅ Generated with DALL-E 3
- ✅ Theme: AI optimization and dynamic loading
- ✅ Resolution: 1920x1080
- ✅ Frontmatter updated

## Usage in Article
All visualizations referenced in article with proper captions and alt text.

## Next Steps
- [ ] Review all visualizations for accuracy
- [ ] Verify rendering in Medium preview
- [ ] Optimize any oversized images
- [ ] Proceed with publishing workflow
```

**Success Criteria:**
- ✅ All files properly organized
- ✅ Index/README generated
- ✅ Article references updated
- ✅ Summary report created
- ✅ All visualizations validated

**→ Checkpoint:** Visualizations integrated and documented

## Success Criteria

✅ **Diagram Quality**
- Mermaid diagrams render correctly
- Appropriate complexity level
- Clear labels and relationships
- Professional color scheme
- Organized by category

✅ **Chart Quality**
- Data accurately visualized
- Professional appearance
- Readable at thumbnail size
- Proper legends and labels
- Optimized file sizes

✅ **Screenshot Quality**
- High resolution (retina-ready)
- Professional cropping
- Readable text
- Consistent styling
- Proper context

✅ **Hero Image Quality**
- Matches article theme
- Professional aesthetic
- Correct dimensions (1920x1080)
- Optimized file size (<5MB)
- Alt text included

✅ **Integration**
- All files properly organized
- Article references updated
- Documentation complete
- Ready for publishing

## Examples

### For Medium Article
```bash
# Generate all visualizations for AI optimization article
/orchestr8:generate-visualizations medium/2025-11-11-ai-memory-optimization.md

# Output:
# - medium/images/hero.png (AI-generated hero image)
# - medium/images/token-comparison.png (Chart showing 97% reduction)
# - medium/images/architecture.png (System diagram)
# - medium/diagrams/system-context.md (C4 Level 0)
# - medium/diagrams/data-flow.md (Resource loading flow)
```

### For Technical Documentation
```bash
# Generate architecture diagrams for project
/orchestr8:generate-visualizations . --type=diagrams

# Output:
# - .orchestr8/docs/diagrams/architecture-system-context.md
# - .orchestr8/docs/diagrams/architecture-containers.md
# - .orchestr8/docs/diagrams/dataflow-resource-loading.md
# - .orchestr8/docs/diagrams/sequence-fuzzy-matching.md
```

### For Specific Concepts
```bash
# Generate visualizations for specific theme
/orchestr8:generate-visualizations "token usage optimization and caching"

# Output:
# - Token usage comparison charts
# - Caching strategy diagrams
# - Performance improvement visualizations
```

## Configuration

### Environment Variables
```bash
# AI Image Generation
export OPENAI_API_KEY="..."           # For DALL-E 3
export REPLICATE_API_TOKEN="..."      # For Stable Diffusion

# Screenshot Automation
export CARBON_API_KEY="..."           # For code screenshots (optional)

# Chart Generation
export CHART_THEME="professional"     # professional, minimal, vibrant
export CHART_DPI="300"                # Output DPI for charts
```

### Output Directory Structure
```bash
# For Medium articles
medium/
├── images/           # All raster images (PNG, JPG)
└── diagrams/         # All Mermaid diagrams (.md files)

# For project documentation
.orchestr8/docs/
└── diagrams/        # All project diagrams
```

## Tips for Best Results

1. **Start with Analysis**: Let the command analyze content thoroughly
2. **Review Diagrams**: Mermaid diagrams can be edited after generation
3. **Iterate on Charts**: Regenerate with different styles if needed
4. **Check Dimensions**: Verify all images meet platform requirements
5. **Optimize Files**: Run through optimization tools before publishing
6. **Test Rendering**: Preview diagrams in target platform (GitHub, Medium)
7. **Use Consistent Style**: Maintain visual consistency across all assets

## Troubleshooting

### Mermaid Diagrams Not Rendering
- Validate syntax at https://mermaid.live
- Check for special characters in labels
- Ensure proper indentation
- Verify diagram type is supported

### Charts Look Unprofessional
- Increase DPI setting (300-600 for print quality)
- Use professional color palette
- Add proper labels and legend
- Ensure sufficient contrast

### Hero Image Doesn't Match Theme
- Refine theme description with specific keywords
- Try different generation method (DALL-E vs Stable Diffusion)
- Use gradient fallback and iterate
- Manually select from Unsplash as alternative

### Screenshots Have Poor Quality
- Increase resolution (use 2x for retina)
- Check viewport size settings
- Verify proper cropping margins
- Use higher quality compression

---

**Related Resources:**
- [Visualization Specialist Agent](../prompts/agents/visualization-specialist.md)
- [Mermaid Diagram Generation Skill](../resources/skills/mermaid-diagram-generation.md)
- [Chart Generation Skill](../resources/skills/data-chart-generation.md)
- [Hero Image Generation Skill](../resources/skills/medium-hero-image-generation.md)
