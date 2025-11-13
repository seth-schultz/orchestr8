---
id: medium-api-publishing
category: skill
tags: [medium, api, publishing, automation, integration, oauth, rest-api, markdown, programmatic-posting]
capabilities:
  - Publish articles to Medium programmatically via API
  - Authenticate with Medium using integration tokens
  - Format content in Markdown or HTML for API submission
  - Handle Medium API endpoints and response handling
  - Manage post metadata (title, tags, publish status)
  - Troubleshoot API errors and limitations
useWhen:
  - Automating Medium article publishing from markdown files or content management systems with API integration
  - Building content distribution workflows publishing to multiple platforms including Medium programmatically
  - Creating tools for batch publishing or scheduling Medium posts with REST API automation
  - Integrating Medium publishing into existing writing workflows or static site generators
  - Developing applications requiring programmatic Medium post creation with OAuth authentication
  - Troubleshooting Medium API integration issues with authentication errors or content formatting problems
estimatedTokens: 280
---

# Medium API Publishing

Programmatically publish articles to Medium using their REST API, with authentication, content formatting, and error handling.

**→ See complete implementations:** orchestr8://examples/medium/medium-api-implementations

## Important Limitations (2025)

### API Status
- **Official Medium API**: No longer actively maintained (GitHub repo archived March 2023)
- **New Integration Tokens**: Medium stopped issuing new integration tokens
- **Existing Tokens**: Continue to work if you already have one
- **Limited Functionality**: Can create posts and get user info only; cannot edit or delete posts

### Recommendation
If you don't already have a Medium integration token, you **cannot** use the official API for new projects. Alternatives:
- Manual posting through Medium's web interface
- Use third-party services (if they have existing tokens)
- Wait for potential API revival (no timeline)

## For Users With Existing Integration Tokens

### Authentication Setup

**1. Get Your Integration Token**
```
1. Go to https://medium.com/me/settings
2. Scroll to "Integration tokens" section
3. Enter description (e.g., "Article Publisher")
4. Click "Get integration token"
5. Copy token immediately (shown only once)
```

**2. Store Token Securely**
```bash
# Environment variable (recommended)
export MEDIUM_INTEGRATION_TOKEN="your_token_here"

# Or in .env file
MEDIUM_INTEGRATION_TOKEN=your_token_here

# Never commit tokens to version control!
```

### Get Your User ID

```bash
curl https://api.medium.com/v1/me \
  -H "Authorization: Bearer YOUR_INTEGRATION_TOKEN"

# Response includes: id, username, name, url
```

## Publishing a Post

### Endpoint
```
POST https://api.medium.com/v1/users/{USER_ID}/posts
```

### Required Headers
```
Authorization: Bearer YOUR_INTEGRATION_TOKEN
Content-Type: application/json
Accept: application/json
```

### Request Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | Yes | Article title |
| `contentFormat` | string | Yes | "markdown", "html", or "plain" |
| `content` | string | Yes | Article content in specified format |
| `tags` | array | No | Array of strings (max 5 tags) |
| `publishStatus` | string | No | "public", "draft", or "unlisted" (default: "public") |
| `license` | string | No | "all-rights-reserved", "cc-40-by", etc. |
| `notifyFollowers` | boolean | No | Whether to notify followers (default: false) |

### Example Request

```bash
curl -X POST https://api.medium.com/v1/users/USER_ID/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "How to Use the Medium API",
    "contentFormat": "markdown",
    "content": "# Introduction\n\nThis is my article.",
    "tags": ["programming", "api", "tutorial"],
    "publishStatus": "draft",
    "notifyFollowers": false
  }'
```

### Response (201 Created)

```json
{
  "data": {
    "id": "e6f36a",
    "title": "How to Use the Medium API",
    "url": "https://medium.com/@yourname/how-to-use-the-medium-api-e6f36a",
    "publishStatus": "draft",
    "tags": ["programming", "api", "tutorial"]
  }
}
```

## Code Examples

**→ See complete Python and Node.js implementations:** orchestr8://examples/medium/medium-api-implementations

### Python Quick Start

```python
from medium_publisher import MediumPublisher

publisher = MediumPublisher(os.getenv("MEDIUM_INTEGRATION_TOKEN"))
user = publisher.get_user_info()

result = publisher.publish_post(
    title="My Article",
    content="# Hello\n\nContent here.",
    content_format="markdown",
    tags=["programming"],
    publish_status="draft"
)

print(f"Published: {result['data']['url']}")
```

### Node.js Quick Start

```javascript
const publisher = new MediumPublisher(process.env.MEDIUM_INTEGRATION_TOKEN);
const user = await publisher.getUserInfo();

const result = await publisher.publishPost({
  title: 'My Article',
  content: '# Hello\n\nContent here.',
  contentFormat: 'markdown',
  tags: ['programming'],
  publishStatus: 'draft'
});

console.log(`Published: ${result.data.url}`);
```

## Content Formatting

### Markdown Format (Recommended)
```markdown
# Main Title

Introduction with **bold** and *italic* text.

## Section 1

Paragraph with [links](https://example.com) and `code`.

```python
# Code block
def example():
    return "Hello!"
```

> Blockquote for emphasis

![Image alt](https://example.com/image.jpg)
```

### HTML Format
Use standard HTML tags: `<h1>`, `<p>`, `<strong>`, `<em>`, `<a>`, `<code>`, `<pre>`, `<img>`, etc.

## Error Handling

### Common Error Codes

| Status | Error | Solution |
|--------|-------|----------|
| 401 | Unauthorized | Check integration token is valid |
| 400 | Bad Request | Validate request payload format |
| 403 | Forbidden | Token may be revoked; regenerate |
| 404 | Not Found | Check user ID is correct |
| 500 | Server Error | Retry after delay |

### Robust Error Handling

Implement retry logic with exponential backoff for transient errors (5xx). Don't retry authentication errors (401, 403).

**→ See error handling examples:** orchestr8://examples/medium/medium-api-implementations

## Best Practices

### Security
✅ **Do:**
- Store tokens in environment variables
- Add `.env` to `.gitignore`
- Rotate tokens periodically
- Use HTTPS for all requests

❌ **Don't:**
- Commit tokens to version control
- Share tokens publicly
- Hardcode tokens in source code

### Content Preparation
✅ **Do:**
- Validate Markdown/HTML before sending
- Test with `publishStatus: "draft"` first
- Keep tags relevant (max 5)
- Use proper heading hierarchy (H1, H2, H3)

❌ **Don't:**
- Send malformed Markdown/HTML
- Use all 5 tag slots with low-value tags
- Skip the draft review step

### Rate Limiting
- No official rate limits documented
- Implement exponential backoff for retries
- Don't spam rapid requests
- Monitor for 429 (Too Many Requests) responses

## Workflow Integration

### Publish from Markdown Files

Create files with YAML frontmatter:

```markdown
---
title: "My Article"
tags: ["programming", "api"]
publish_status: "draft"
---

# Content here...
```

Use `publish_from_file()` method to automatically extract metadata and publish.

**→ See workflow examples:** orchestr8://examples/medium/medium-api-implementations

## Limitations and Workarounds

### Cannot Edit Published Posts
**Workaround:**
- Publish as draft first
- Review on Medium web interface
- Manually edit if needed

### Cannot Delete Posts
**Workaround:** Manually delete via web interface

### Cannot Upload Images
**Workaround**:
- Host images externally (Imgur, Cloudinary, S3)
- Reference via URL in Markdown: `![alt](https://...)`

### No Analytics Access
**Workaround:** Use Medium web interface for analytics

## Summary Checklist

Before implementing:
- ✅ Do you have an existing Medium integration token?
- ✅ Have you tested authentication with `/me` endpoint?
- ✅ Is token stored securely (environment variable)?
- ✅ Have you implemented error handling?
- ✅ Are you publishing drafts first for review?
- ✅ Is content properly formatted (valid Markdown/HTML)?
- ✅ Have you tested with sample content?
- ✅ Do you have a fallback plan if API fails?

## Resources

- **API Documentation**: https://github.com/Medium/medium-api-docs (archived)
- **Integration Token Settings**: https://medium.com/me/settings
- **Medium Help Center**: https://help.medium.com/hc/en-us/articles/213480228-API-Importing
