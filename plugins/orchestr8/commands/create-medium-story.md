---
description: Generate world-class Medium articles with viral potential and platform
  optimization
allowed-tools:
- Bash
- Edit
- Glob
- Grep
- Read
- SlashCommand
- TodoWrite
- WebFetch
- WebSearch
- Write
---

# Create Medium Story: $ARGUMENTS

**Topic:** $ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "plugin:orchestr8:orchestr8-resources"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Mission

Generate a world-class Medium article optimized for viral potential, engagement, and Medium's 2025 distribution standards. The article will be saved to the `medium/` folder with complete publishing instructions.

## Phase 1: Research & Planning (0-25%)

**→ Load:** orchestr8://match?query=$ARGUMENTS+research+analysis&categories=agent,skill&mode=index&maxResults=8

**Activities:**
- **Topic Analysis**: Validate evergreen potential, audience breadth, and unique angle
- **Content Research**: Gather insights, examples, and data supporting the story
- **Headline Ideation**: Generate 3-5 headline options using proven formulas (number-based, how-to, personal journey)
- **Framework Selection**: Choose best structure (listicle, case study, how-to, contrarian)
- **Hook Planning**: Craft opening hook that grips in first 10 words

**Success indicators:**
- Clear value proposition and target audience identified
- Unique angle or personal perspective defined
- Compelling headline options generated
- Appropriate content framework selected

**→ Checkpoint:** Topic researched, framework chosen, headline options ready

## Phase 2: Content Creation (25-70%)

**→ Load:** orchestr8://agents/medium-writer-expert

**→ Load:** orchestr8://match?query=medium+headline+story-structure+engagement&categories=skill&mode=index&maxResults=8

**Parallel tracks:**

### Track 1: Story Writing
- **Opening Hook**: Create gripping first 10 words using micro-story, bold statement, or provocative question
- **Introduction**: Establish context, relatability, and promise within first 100 words
- **Main Content**: Build sections with progressive disclosure, specific examples, and emotional resonance
- **Section Hooks**: Re-engage readers at start of each major section
- **Sticky Lines**: Craft 3-5 memorable, quotable sentences throughout
- **Conclusion**: Deliver memorable insight + specific actionable takeaway

### Track 2: Formatting Optimization
- **Paragraph Length**: 1-3 sentences maximum per paragraph
- **Heading Hierarchy**: Clear H2 sections, H3 subsections
- **Visual Breaks**: Plan image placements every 3-5 paragraphs
- **Text Formatting**: Bold key takeaways, italics for emphasis
- **Lists & Bullets**: Scannable, parallel structure
- **Code Blocks**: Syntax highlighting if technical content

### Track 3: Engagement Elements
- **Micro-Stories**: 2-3 personal anecdotes for emotional connection
- **Zeigarnik Effect**: Information gaps creating anticipation
- **Vulnerability**: Authentic struggles and failures, not just wins
- **Specificity**: Concrete details (numbers, names, moments) over abstractions
- **Pacing**: Vary sentence length and rhythm for sustained engagement

**→ Checkpoint:** Complete draft with engaging hook, clear structure, emotional resonance

## Phase 3: Optimization & Polish (70-90%)

**→ Load:** orchestr8://skills/match?query=technical-writing+editing+readability&mode=index&maxResults=3

**Quality checks:**

### Content Quality
- ✅ **Authenticity**: Real voice, vulnerability, unique perspective (not generic AI content)
- ✅ **Value Delivery**: Actionable insights, specific examples, clear takeaways
- ✅ **Engagement**: Opening hook + section hooks + sticky lines + micro-stories
- ✅ **Specificity**: Concrete details, numbers, names instead of vague statements

### Medium Distribution Standards
- ✅ **CTA Limit**: All calls-to-action under 20% of total content (critical!)
- ✅ **No Clickbait**: Headline accurately represents content, maintains trust
- ✅ **Quality Threshold**: Substantive content worthy of curation consideration
- ✅ **Professional Tone**: Authentic but appropriate for target publication

### Formatting & Readability
- ✅ **Paragraph Length**: 1-3 sentences each, lots of white space
- ✅ **Scannable**: Clear headings, bullets, bold text for visual anchors
- ✅ **Visual Variety**: Mix of text, lists, quotes, code blocks (if applicable)
- ✅ **Heading Flow**: Logical H2 → H3 hierarchy guiding readers

### Technical Elements
- ✅ **Hero Image**: Placeholder reference for high-res image under title
- ✅ **Alt Text**: Image descriptions for accessibility
- ✅ **Links**: Relevant, non-promotional links adding value
- ✅ **Tags**: 3-5 strategic tags for Medium curation categories

**→ Checkpoint:** Story polished, distribution standards met, ready for publication

## Phase 4: Finalization & Export (90-100%)

**Activities:**

### 1. Create Medium Folder Structure
```bash
mkdir -p medium/
```

### 2. Generate Filename
Format: `YYYY-MM-DD-slug-title.md`
Example: `2025-11-11-how-to-write-viral-medium-articles.md`

### 3. Create Markdown File with Frontmatter
```markdown
---
title: "[Final headline]"
subtitle: "[Optional: Compelling subtitle]"
tags: ["tag1", "tag2", "tag3", "tag4", "tag5"]
publish_status: "draft"
canonical_url: ""
hero_image: "[URL or placeholder for high-res image]"
created_date: "YYYY-MM-DD"
---

[Story content in Markdown format]
```

### 4. Save Complete Story
- Write markdown file to `medium/[filename].md`
- Include frontmatter metadata
- Format content following Medium best practices
- Add comments for image placement suggestions

### 5. Generate Publishing Instructions
Create `medium/[filename]-INSTRUCTIONS.md`:
```markdown
# Publishing Instructions for "[Title]"

## Pre-Publication Checklist
- [ ] Review story for typos and flow
- [ ] Replace hero_image placeholder with actual high-res image (1400px+ wide)
- [ ] Add section images at marked locations
- [ ] Verify all links work correctly
- [ ] Confirm tags are relevant to content
- [ ] Read aloud to check pacing and engagement

## Headline Alternatives
1. [Primary headline - use this]
2. [Alternative 1]
3. [Alternative 2]

## Recommended Publications
Based on topic and style:
- [Publication 1 name] - Why: [reason]
- [Publication 2 name] - Why: [reason]

## Manual Publishing (Recommended)
1. Go to https://medium.com/new-story
2. Paste content from markdown file
3. Add hero image and section images
4. Apply formatting (bold, italics, headings)
5. Add tags in right sidebar
6. Choose publication if submitting
7. Save as draft initially
8. Review on mobile and desktop
9. Publish when ready

## API Publishing (If You Have Integration Token)
See medium/[filename]-API-PUBLISH.py for automated publishing script.

**Note**: Medium API is no longer maintained. Manual publishing recommended.
```

### 6. Optional: Generate API Publishing Script
If user has Medium integration token, create `medium/[filename]-API-PUBLISH.py`:
```python
# See medium-api-publishing skill fragment for complete implementation
# This is a template - requires MEDIUM_INTEGRATION_TOKEN environment variable
```

**→ Load:** orchestr8://skills/medium-api-publishing (only if API publishing requested)

**→ Checkpoint:** Story saved to medium/ folder with publishing instructions

## Success Criteria

✅ **Story Quality**
- Gripping opening hook in first 10 words
- Clear structure with scannable sections
- Authentic voice with vulnerability and specificity
- 3-5 sticky lines worth quoting
- Actionable takeaways for readers

✅ **Medium Optimization**
- Complies with distribution standards (no clickbait, under 20% CTA)
- Appropriate length (1,200-2,500 words ideal)
- Strategic tag selection for curation
- Formatted for maximum readability (short paragraphs, visual breaks)
- Professional tone suitable for target publications

✅ **Deliverables**
- Complete markdown story in `medium/[filename].md`
- Frontmatter with metadata (title, tags, hero image placeholder)
- Publishing instructions in `medium/[filename]-INSTRUCTIONS.md`
- Headline alternatives for A/B testing
- Recommended publications for submission
- Optional: API publishing script if requested

## Post-Generation Actions

After the story is generated:

1. **Review the files:**
   ```bash
   cat medium/[filename].md
   cat medium/[filename]-INSTRUCTIONS.md
   ```

2. **Customize the content:**
   - Add your personal examples and anecdotes
   - Adjust headline if you have a stronger variation
   - Replace image placeholders with actual photos
   - Polish based on your authentic voice

3. **Publish to Medium:**
   - Manual publishing (recommended): Follow steps in INSTRUCTIONS file
   - API publishing (if you have token): Use generated script

4. **Post-publication:**
   - Share strategically (Twitter, LinkedIn, communities)
   - Engage with comments in first 24 hours
   - Monitor metrics in Medium stats dashboard
   - Learn patterns for future articles

## Tips for Best Results

**Topic Selection:**
- Focus on evergreen subjects (self-improvement, productivity, career, learning)
- Choose topics where you have personal experience or unique perspective
- Validate broad audience appeal

**Building Consistency:**
1. Start with 1 article per week
2. Batch topic ideas (generate 10 at once)
3. Use this command for each article
4. Analyze what works, iterate on successful patterns
5. Build audience systematically

---

**Ready to create your world-class Medium story!**
