# Orchestr8 Scripts

Utility scripts for enhancing Orchestr8 workflows.

## Version Bump Script

Automatically bump version numbers across all required files consistently.

### Usage

```bash
# Using npm scripts (recommended)
npm run version:patch  # 8.0.4 -> 8.0.5
npm run version:minor  # 8.0.4 -> 8.1.0
npm run version:major  # 8.0.4 -> 9.0.0

# Or with explicit version
npm run version:bump 8.0.5

# Direct script usage
./scripts/bump-version.sh patch
./scripts/bump-version.sh 8.0.5
```

### What It Updates

The script automatically updates version numbers in:
1. `VERSION` (root file)
2. `plugins/orchestr8/package.json` (`.version` field)
3. `plugins/orchestr8/.claude-plugin/plugin.json` (`.version` field)
4. `.claude-plugin/marketplace.json` (`.version` field)

### CI Validation

The GitHub CI workflow validates that all these files match on every PR and push. If they don't match, the build will fail.

### Next Steps After Bumping

After running the version bump script:

1. **Update CHANGELOG.md** with release notes for the new version
2. **Review changes**: `git diff`
3. **Commit changes**: `git add -A && git commit -m "chore: Bump version to X.Y.Z"`
4. **Create git tag**: `git tag vX.Y.Z`
5. **Push changes**: `git push && git push --tags`

The script will remind you of these steps after successfully updating the version.

---

## Hero Image Generator

Automatically generate professional hero images for Medium articles using AI image generation.

### Installation

```bash
pip install openai replicate Pillow requests pyyaml
```

### Configuration

Set environment variables for your preferred image generation service:

```bash
# For DALL-E 3 (highest quality, $0.04-0.08 per image)
export OPENAI_API_KEY="your-openai-api-key"

# For Stable Diffusion via Replicate (good quality, $0.002-0.005 per image)
export REPLICATE_API_TOKEN="your-replicate-api-token"

# No API key needed for gradient fallback (free)
```

### Usage

#### Generate from Markdown File

Automatically extracts title and theme from frontmatter:

```bash
python scripts/generate-hero-image.py \
  --file medium/2025-11-11-my-article.md \
  --update
```

The `--update` flag automatically updates the markdown file's frontmatter with the generated image path.

#### Generate from Title and Theme

```bash
python scripts/generate-hero-image.py \
  --title "My Amazing Article" \
  --theme "productivity and AI" \
  --output medium/images/
```

#### Specify Generation Method

```bash
# Use DALL-E 3
python scripts/generate-hero-image.py \
  --file medium/article.md \
  --method dalle \
  --update

# Use Stable Diffusion
python scripts/generate-hero-image.py \
  --file medium/article.md \
  --method replicate \
  --update

# Use gradient fallback (no API needed)
python scripts/generate-hero-image.py \
  --file medium/article.md \
  --method gradient \
  --update
```

#### Interactive Mode

```bash
python scripts/generate-hero-image.py --interactive
```

Prompts you for:
- Article title
- Article theme
- Output directory
- Generation method

### Examples

**Technical Article**:
```bash
python scripts/generate-hero-image.py \
  --title "Building Scalable Microservices" \
  --theme "technical architecture and distributed systems" \
  --method dalle
```

**Personal Development**:
```bash
python scripts/generate-hero-image.py \
  --title "How I Learned Python in 30 Days" \
  --theme "personal growth and learning" \
  --method replicate
```

**Productivity**:
```bash
python scripts/generate-hero-image.py \
  --title "10 Time Management Techniques" \
  --theme "productivity and efficiency" \
  --method gradient
```

### Output

Generated images are saved to `medium/images/` with naming format:
```
YYYY-MM-DD-article-slug-hero.png
```

Example:
```
medium/images/2025-11-11-building-scalable-microservices-hero.png
```

### Image Specifications

All generated images meet Medium's requirements:
- **Width**: 1920px (minimum 1400px)
- **Height**: 1080px (16:9 aspect ratio)
- **Format**: PNG (optimized)
- **Quality**: Professional, suitable for publication
- **Style**: Clean, modern, abstract/conceptual

### Troubleshooting

**Error: OPENAI_API_KEY not set**
- Set the environment variable: `export OPENAI_API_KEY="your-key"`
- Or use `--method replicate` or `--method gradient`

**Error: replicate package not installed**
- Install: `pip install replicate`

**Error: Could not extract title from file**
- Ensure markdown file has proper frontmatter with `title:` field
- Or use `--title` and `--theme` flags instead

**Image quality not satisfactory**
- Try DALL-E 3 for highest quality: `--method dalle`
- Refine the theme description for better results
- Edit the prompt in the script for more control

### Integration with Workflows

The `/orchestr8:create-medium-story` workflow automatically suggests hero image generation in Phase 4.

To enable automatic generation, ensure API keys are set before running the workflow.

### Cost Comparison

| Method | Cost per Image | Quality | Speed |
|--------|---------------|---------|-------|
| DALL-E 3 | $0.04-0.08 | Excellent | ~10s |
| Stable Diffusion (Replicate) | $0.002-0.005 | Very Good | ~5s |
| Gradient Fallback | Free | Basic | <1s |

### Advanced Usage

#### Custom Prompts

Edit `generate-hero-image.py` to customize the prompt template:

```python
def generate_with_dalle(title, theme, output_dir):
    # Customize this prompt for your specific needs
    prompt = f"""
    Your custom prompt here...
    {title}
    {theme}
    """
```

#### Batch Generation

Generate images for multiple articles:

```bash
for file in medium/*.md; do
  python scripts/generate-hero-image.py --file "$file" --method dalle --update
done
```

### Future Enhancements

Planned features:
- [ ] Custom style presets (minimal, vibrant, dark, etc.)
- [ ] Midjourney integration via unofficial API
- [ ] Local Stable Diffusion support
- [ ] Image variation generation (create multiple options)
- [ ] A/B testing recommendations

### Support

For issues or feature requests, open an issue in the main repository.

---

**Related Documentation:**
- [Hero Image Generation Skill Fragment](../resources/skills/medium-hero-image-generation.md)
- [Medium Workflow](../resources/workflows/workflow-create-medium-story.md)
