---
name: create-medium-story
description: Generate world-class Medium articles with viral potential and platform optimization
arguments:
  - name: topic
    description: Topic or idea for the Medium article
    required: true
---

# Create Medium Story: {{topic}}

**Topic:** {{topic}}

## Your Mission

Generate a world-class Medium article optimized for viral potential, engagement, and Medium's 2025 distribution standards. The article will be saved to the `medium/` folder with complete publishing instructions.

## Workflow

**→ Execute:** orchestr8://workflows/workflow-create-medium-story

This workflow will:

### Phase 1: Research & Planning (0-25%)
- Analyze topic for evergreen potential and unique angle
- Research supporting insights and examples
- Generate 3-5 compelling headline options
- Select optimal content framework (listicle, case study, how-to, contrarian)
- Plan opening hook that grips in first 10 words

### Phase 2: Content Creation (25-70%)
- Write engaging story with proven Medium structure
- Craft opening hook using micro-story, bold statement, or question
- Build sections with progressive disclosure and emotional resonance
- Include 2-3 personal anecdotes for connection
- Create 3-5 sticky lines worth quoting
- Format with short paragraphs (1-3 sentences) and visual breaks

### Phase 3: Optimization & Polish (70-90%)
- Ensure authentic voice with vulnerability and specificity
- Verify Medium distribution standards compliance (under 20% CTA)
- Optimize formatting for readability and scannability
- Validate heading hierarchy and visual variety
- Confirm strategic tag selection for curation

### Phase 4: Finalization & Export (90-100%)
- Create `medium/` folder if needed
- Save story as `medium/YYYY-MM-DD-slug-title.md` with frontmatter
- Generate `medium/[filename]-INSTRUCTIONS.md` with:
  - Pre-publication checklist
  - Headline alternatives
  - Recommended publications
  - Manual publishing steps
  - Optional: API publishing script (if you have integration token)

## What You'll Get

**1. Complete Medium Article** (`medium/[filename].md`):
```markdown
---
title: "[Compelling headline]"
tags: ["tag1", "tag2", "tag3", "tag4", "tag5"]
publish_status: "draft"
hero_image: "[Placeholder for high-res image]"
created_date: "YYYY-MM-DD"
---

[World-class article content optimized for Medium]
```

**2. Publishing Instructions** (`medium/[filename]-INSTRUCTIONS.md`):
- Pre-publication checklist
- Headline alternatives for A/B testing
- Recommended publications for submission
- Step-by-step manual publishing guide
- Medium API publishing info (if applicable)

**3. Quality Guarantees**:
- ✅ Gripping opening hook in first 10 words
- ✅ Authentic voice with vulnerability and specificity
- ✅ Clear structure with scannable sections
- ✅ Complies with Medium distribution standards
- ✅ Optimized for viral potential and engagement
- ✅ Ready for publication or submission

## After Generation

**Review the story:**
```bash
# View the generated article
cat medium/[filename].md

# View publishing instructions
cat medium/[filename]-INSTRUCTIONS.md
```

**Publish to Medium:**
1. **Manual (Recommended)**: Follow instructions in `-INSTRUCTIONS.md` file
2. **API (If you have token)**: Use generated publishing script or follow API instructions

**Post-publication:**
- Share strategically (Twitter, LinkedIn, communities)
- Engage with comments in first 24 hours
- Monitor metrics in Medium stats
- Learn patterns for future articles

## Tips for Best Results

**Topic Selection:**
- Focus on evergreen subjects (self-improvement, productivity, career, learning)
- Choose topics where you have personal experience or unique perspective
- Validate broad audience appeal before generating

**Customization:**
- Add your specific examples and anecdotes during review
- Adjust headline if you have stronger variation
- Replace image placeholders with actual high-res photos
- Personalize based on your authentic voice

**Quality over Speed:**
- Review generated content carefully
- Read aloud to check pacing and flow
- Save as draft first, review on mobile/desktop
- Polish before publishing

## Example Usage

```bash
# Generate article on learning to code
/orchestr8:create-medium-story "How to learn programming faster as a complete beginner"

# Generate article on productivity
/orchestr8:create-medium-story "The productivity system that helped me 10x my output"

# Generate article on career
/orchestr8:create-medium-story "How I negotiated a 50% salary increase"

# Generate technical article
/orchestr8:create-medium-story "Building a REST API with TypeScript and Express from scratch"
```

## Building a Publishing Cadence

**Consistency is key on Medium:**
1. Start with 1 article per week
2. Batch topic ideas (generate 10 at once)
3. Use this command for each article
4. Analyze what works, iterate on successful patterns
5. Build audience systematically

**Topic Ideation Sources:**
- Personal experiences and lessons learned
- Common questions in your field
- Contrarian takes on popular advice
- How-to guides for problems you solved
- Mistakes you made and insights gained

## Success Metrics

A successful Medium article features:
- **Engagement**: High read ratio, highlights, comments
- **Distribution**: Selected for Medium curation
- **Virality**: Shared on social media, bookmarked
- **Authority**: Positions you as expert in your field
- **Growth**: Builds follower base and publication opportunities

This workflow optimizes for all of these outcomes.

---

**Ready to create your Medium story? Let's go!**
