---
id: medium-hero-image-example
category: example
tags: [medium, hero-image, ai-generation, workflow-example, automation]
capabilities:
  - Demonstrate hero image generation for Medium articles
  - Show integration with Medium story workflow
  - Provide practical usage examples
  - Illustrate different generation methods
useWhen:
  - Learning how to generate hero images for Medium articles
  - Understanding the hero image generation workflow
  - Comparing different image generation methods
  - Setting up automated hero image creation
estimatedTokens: 450
---

# Medium Hero Image Generation Example

Complete example showing how to generate hero images for Medium articles using the Orchestr8 hero image generation feature.

## Example: Generated Medium Story

We have a Medium story at:
```
medium/2025-11-11-i-cut-my-ai-assistants-memory-by-95-percent.md
```

**Article Details:**
- **Title**: "I Cut My AI Assistant's Memory by 95% and Made It Smarter"
- **Theme**: AI optimization, token management, just-in-time loading
- **Tone**: Technical but accessible, personal journey

## Method 1: Automatic Generation from File

### Using DALL-E 3 (Best Quality)

```bash
# Ensure API key is set
export OPENAI_API_KEY="your-openai-api-key"

# Generate and auto-update markdown file
python scripts/generate-hero-image.py \
  --file medium/2025-11-11-i-cut-my-ai-assistants-memory-by-95-percent.md \
  --method dalle \
  --update
```

**What happens:**
1. Script reads the markdown file
2. Extracts title and theme from frontmatter
3. Generates optimized prompt for DALL-E 3
4. Creates abstract visualization of "AI memory optimization and dynamic loading"
5. Saves to `medium/images/2025-11-11-i-cut-my-ai-assistants-memory-by-95-percent-hero.png`
6. Updates frontmatter with image path

**Expected output:**
```
Extracted from file:
  Title: I Cut My AI Assistant's Memory by 95% and Made It Smarter
  Theme: Artificial Intelligence

Generating image with DALL-E 3...
Theme: Artificial Intelligence
Mood: Futuristic, intelligent, clean, cutting-edge

Image generated successfully!
Downloading image...
✓ Image saved to: medium/images/2025-11-11-i-cut-my-ai-assistants-memory-by-95-percent-hero.png
✓ Updated frontmatter in medium/2025-11-11-i-cut-my-ai-assistants-memory-by-95-percent.md
```

### Using Stable Diffusion (Cost-Effective)

```bash
# Ensure API token is set
export REPLICATE_API_TOKEN="your-replicate-token"

# Generate with Stable Diffusion
python scripts/generate-hero-image.py \
  --file medium/2025-11-11-i-cut-my-ai-assistants-memory-by-95-percent.md \
  --method replicate \
  --update
```

**Cost comparison:**
- DALL-E 3: ~$0.04-0.08 per image
- Stable Diffusion: ~$0.002-0.005 per image (10-20x cheaper)

### Using Gradient Fallback (Free)

```bash
# No API key needed
python scripts/generate-hero-image.py \
  --file medium/2025-11-11-i-cut-my-ai-assistants-memory-by-95-percent.md \
  --method gradient \
  --update
```

**Result**: Clean blue gradient image suitable for technical content

## Method 2: Manual Generation

### Specify Custom Theme

```bash
python scripts/generate-hero-image.py \
  --title "I Cut My AI Assistant's Memory by 95% and Made It Smarter" \
  --theme "just-in-time resource loading, dynamic matching, token optimization" \
  --method dalle \
  --output medium/images/
```

**Why use manual theme?**
- More specific than auto-extracted theme
- Better control over visual concept
- Can emphasize specific aspects of the article

### Interactive Mode

```bash
python scripts/generate-hero-image.py --interactive
```

**Interactive prompts:**
```
=== Hero Image Generator (Interactive Mode) ===

Article title: I Cut My AI Assistant's Memory by 95% and Made It Smarter
Article theme/topic: AI memory optimization, dynamic loading, token efficiency
Output directory [medium/images]: 

Generation method:
  1. DALL-E 3 (requires OPENAI_API_KEY)
  2. Stable Diffusion via Replicate (requires REPLICATE_API_TOKEN)
  3. Gradient fallback (free, no API required)

Select method [1/2/3]: 1

Generating image with DALL-E 3...
...
✓ Success! Image generated: medium/images/2025-11-11-i-cut-my-ai-assistants-memory-by-95-percent-hero.png

Update markdown file frontmatter? [y/N]: y
Path to markdown file: medium/2025-11-11-i-cut-my-ai-assistants-memory-by-95-percent.md
✓ Updated frontmatter in medium/2025-11-11-i-cut-my-ai-assistants-memory-by-95-percent.md
```

## Expected Visual Results

### DALL-E 3 Output
**Visual concept**: Abstract data streams with selective filtering, flowing light paths representing dynamic loading, minimal geometric nodes, clean modern aesthetic with blue/purple gradient

**Style**: Professional, futuristic, technical but approachable

### Stable Diffusion Output
**Visual concept**: Similar to DALL-E but potentially more abstract/artistic, geometric patterns representing modular systems, glowing connections

**Style**: Modern, clean, slightly more stylized

### Gradient Output
**Visual concept**: Simple blue gradient (technical theme), clean and professional

**Style**: Minimalist, ensures article has a hero image even without AI generation

## Integration with Workflow

### Automatic in /orchestr8:create-medium-story

When running the Medium story creation workflow, hero image generation happens in Phase 4:

```markdown
## Phase 4: Finalization & Export (90-100%)

### 4. Generate Hero Image (Optional)

**→ Load:** orchestr8://skills/medium-hero-image-generation

**Image generation options:**
- If OPENAI_API_KEY available: Use DALL-E 3
- If REPLICATE_API_TOKEN available: Use Stable Diffusion  
- Fallback: Generate gradient or provide Unsplash search terms
```

The workflow automatically:
1. Detects available API keys
2. Suggests appropriate generation method
3. Provides command to run
4. Updates markdown file with image path

### Manual Addition to Existing Stories

For stories created before hero image feature:

```bash
# Batch generate for all stories
for file in medium/*.md; do
  echo "Generating hero image for: $file"
  python scripts/generate-hero-image.py --file "$file" --method dalle --update
done
```

## Verifying the Result

### Check Updated Frontmatter

```yaml
---
title: "I Cut My AI Assistant's Memory by 95% and Made It Smarter"
subtitle: "How just-in-time resource loading solved the token budget crisis"
tags: ["Artificial Intelligence", "Software Development", "Productivity", "Claude AI", "Developer Tools"]
publish_status: "draft"
canonical_url: ""
hero_image: "medium/images/2025-11-11-i-cut-my-ai-assistants-memory-by-95-percent-hero.png"
hero_image_alt: "Abstract visualization of dynamic AI resource loading and memory optimization"
created_date: "2025-11-11"
---
```

### Check Image Properties

```bash
# View image dimensions
file medium/images/2025-11-11-i-cut-my-ai-assistants-memory-by-95-percent-hero.png

# Expected output:
# PNG image data, 1920 x 1080, 8-bit/color RGB, non-interlaced
```

### Preview Image

```bash
# macOS
open medium/images/2025-11-11-i-cut-my-ai-assistants-memory-by-95-percent-hero.png

# Linux
xdg-open medium/images/2025-11-11-i-cut-my-ai-assistants-memory-by-95-percent-hero.png
```

## Troubleshooting

### No API Keys Available

**Problem**: Script shows "No AI image generation API available"

**Solution**:
```bash
# Use gradient fallback
python scripts/generate-hero-image.py --file medium/article.md --method gradient --update

# Or manually search Unsplash
# Script will provide search terms like: "abstract blue technology minimal"
```

### Image Doesn't Match Article Tone

**Problem**: Generated image is too abstract or doesn't fit

**Solutions**:
1. **Regenerate with custom theme**:
   ```bash
   python scripts/generate-hero-image.py \
     --title "Article Title" \
     --theme "more specific theme keywords" \
     --method dalle
   ```

2. **Edit script prompt**: Modify the prompt in `scripts/generate-hero-image.py` for more control

3. **Use Unsplash**: Search for curated stock photos matching your vision

### File Size Too Large

**Problem**: Image over 5MB

**Solution**:
```bash
# Optimize with ImageMagick
convert medium/images/hero.png -quality 85 -strip medium/images/hero-optimized.png

# Or use online tools
# - TinyPNG: https://tinypng.com
# - Squoosh: https://squoosh.app
```

## Best Practices

1. **Theme Specificity**: More specific themes generate better images
   - ❌ Generic: "technology"
   - ✅ Specific: "AI memory optimization, dynamic resource loading"

2. **Check Before Publishing**: Always preview generated image at thumbnail size

3. **Iterate if Needed**: Don't settle for first result - regenerate if not satisfied

4. **Cost Management**: Use Stable Diffusion for drafts, DALL-E for final version

5. **Archive Successful Prompts**: Save prompts that work well for future reference

## Example Output Comparison

### Input Article Theme
"AI assistant memory optimization through just-in-time resource loading and dynamic fuzzy matching"

### Generated Image Descriptions

**DALL-E 3**: Abstract visualization showing flowing data streams converging into focused channels, representing selective loading. Clean geometric nodes with glowing connections. Modern blue gradient background. Professional and futuristic aesthetic.

**Stable Diffusion**: Geometric network of interconnected nodes with selective pathways highlighted. Abstract representation of modular resource loading. Blue and white color scheme with purple accents. Technical and modern style.

**Gradient**: Simple vertical blue gradient (RGB 41,128,185 to 142,68,173). Clean minimal fallback suitable for technical content.

## Next Steps

1. Generate hero image for your Medium story
2. Preview at thumbnail size (200x200px)
3. Adjust theme if needed and regenerate
4. Update markdown frontmatter
5. Proceed with Medium publishing workflow

---

**Related Resources:**
- [Hero Image Generation Skill](../skills/medium-hero-image-generation.md)
- [Medium Story Workflow](../workflows/workflow-create-medium-story.md)
- [Generation Script](../../scripts/generate-hero-image.py)
