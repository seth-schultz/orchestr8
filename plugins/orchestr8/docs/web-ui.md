# Orchestr8 Web UI Guide

> **Interactive dashboard for testing, monitoring, and exploring Orchestr8 MCP**

The Orchestr8 Web UI is a powerful browser-based interface for testing prompts and resources, monitoring MCP server activity, and exploring the knowledge system.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Features](#features)
- [User Guide](#user-guide)
- [Testing Interface](#testing-interface)
- [Resource Explorer](#resource-explorer)
- [Activity Monitoring](#activity-monitoring)
- [Use Cases](#use-cases)
- [Troubleshooting](#troubleshooting)

---

## Overview

### What is the Web UI?

The Web UI is a real-time dashboard that provides:

- **Resource Explorer**: Browse 200+ fragments by category
- **Testing Interface**: Test prompts and resource URIs interactively
- **Live Activity**: Real-time MCP server event streaming
- **Statistics Dashboard**: Performance metrics and usage charts
- **Debugging Tools**: Protocol inspection and log viewing

### Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser   │ ◄─────► │  Web Server  │ ◄─────► │ MCP Server  │
│  (WebUI)    │ WS/HTTP │ (Express+WS) │  stdio  │   (Node)    │
└─────────────┘         └──────────────┘         └─────────────┘
```

**Communication:**
- Browser ↔ Web Server: HTTP REST + WebSocket
- Web Server ↔ MCP Server: stdio (JSON-RPC)
- Real-time updates: WebSocket broadcast

### Technology Stack

**Backend:**
- Node.js + Express
- WebSocket (ws library)
- MCP SDK for stdio communication

**Frontend:**
- Vanilla JavaScript (no frameworks)
- Chart.js for visualizations
- Marked.js for markdown rendering
- Modern CSS with dark theme

---

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- Built MCP server (run `npm run build` in orchestr8 root)
- Port 3000 available (or custom port)

### Installation

**Step 1: Install dependencies**
```bash
cd /path/to/orchestr8-mcp/plugins/orchestr8/web-ui
npm install
```

**Step 2: Build MCP server (if not already done)**
```bash
cd /path/to/orchestr8-mcp/plugins/orchestr8
npm run build
```

### Launch the Dashboard

**Option 1: From orchestr8 root**
```bash
cd /path/to/orchestr8-mcp/plugins/orchestr8
npm run ui
```

**Option 2: From web-ui directory**
```bash
cd /path/to/orchestr8-mcp/plugins/orchestr8/web-ui
npm start
```

**Option 3: Custom port**
```bash
PORT=8080 npm start
```

**Access:** Open browser to **http://localhost:3000**

---

## Features

### Overview Dashboard

**Real-time statistics:**
- Uptime
- Request count
- Latency (p50, p95, p99, avg)
- Error count
- Memory usage
- Resource count

**Interactive charts:**
- Latency distribution (bar chart)
- Resource usage by category (doughnut chart)

**Recent activity:**
- Last 5 server events
- Quick access to full activity log

**Auto-refresh:**
- WebSocket-based updates every 5 seconds
- No page reload required

---

### Resource Explorer

**Browse resources:**
- Grid and list view options
- Filter by category
- Search by name, description, URI
- View resource metadata

**Categories:**
- Agents (AI agents)
- Skills (techniques)
- Patterns (design patterns)
- Examples (code examples)
- Guides (setup guides)
- Best Practices (standards)

**Resource details:**
- Click any resource to view full content
- Markdown rendering
- Copy URI to clipboard
- View metadata (tags, capabilities, use-when)

---

### Testing Interface

**Test MCP operations:**
- List prompts
- Get prompt with arguments
- List resources
- Read resource by URI

**Dynamic forms:**
- Context-aware fields based on request type
- Pre-configured quick examples
- Argument validation

**Multi-view results:**
- **Content tab**: Human-readable formatted output
- **Protocol tab**: Raw JSON-RPC MCP messages
- **Metadata tab**: Response metadata

**Quick examples:**
- List all prompts
- List all resources
- Load TypeScript agent
- Match API skills (fuzzy)
- Full-stack match (multi-category)

---

### Activity Monitoring

**Real-time log streaming:**
- All MCP server events
- Request/response pairs
- Error tracking
- Server lifecycle events

**Activity types:**
- Server: start, ready, stop, exit
- MCP requests: prompts/list, resources/read, etc.
- MCP responses: success, error
- Logs: MCP server stdout/stderr

**Filtering:**
- All activity
- Requests only
- Responses only
- Errors only
- Logs only

**Controls:**
- Pause/resume stream
- Clear activity log
- Export activity (planned)

---

## User Guide

### Testing Prompts

**1. Navigate to Testing tab**

**2. Select request type:** "Get Prompt"

**3. Fill parameters:**
- **Prompt name**: `new-project` (or any workflow)
- **Arguments** (optional): `{ "description": "Build REST API" }`

**4. Click "Send Request"**

**5. View results:**
- **Content tab**: Formatted prompt content
- **Protocol tab**: Raw MCP JSON-RPC
- **Metadata tab**: Response metadata

**Example:**
```json
Request:
{
  "name": "new-project",
  "arguments": {
    "description": "Build TypeScript REST API"
  }
}

Response:
- Prompt content with substituted arguments
- ~2000 tokens
- Formatted markdown
```

---

### Testing Resources

**1. Select request type:** "Read Resource"

**2. Enter URI:**

**Static resource:**
```
orchestr8://agents/typescript-core
```

**Dynamic matching (catalog):**
```
orchestr8://match?query=typescript+api&mode=catalog&maxResults=10
```

**Dynamic matching (index):**
```
orchestr8://match?query=retry+backoff&mode=index&maxResults=5
```

**Dynamic matching (full):**
```
orchestr8://match?query=python+async&mode=full&maxTokens=2500
```

**3. Click "Send Request"**

**4. View results:**
- **Content tab**: Resource content or match results
- **Protocol tab**: MCP protocol details
- **Metadata tab**: Response size, timing

---

### Browsing Resources

**1. Navigate to Resources tab**

**2. Use search bar:**
- Type keywords to filter
- Searches name, description, URI

**3. Filter by category:**
- Click category in sidebar
- See count for each category

**4. Toggle view:**
- Grid view: Visual cards
- List view: Compact table

**5. View resource:**
- Click any resource card
- Modal displays full content
- Markdown rendered beautifully
- Copy URI button for easy reference

**6. Use URI in testing or workflows**

---

### Monitoring Activity

**1. Navigate to Activity tab**

**2. Watch live events:**
- Real-time streaming via WebSocket
- Color-coded by event type
- Timestamp for each event

**3. Filter events:**
- **All**: Show everything
- **Requests**: MCP requests only
- **Responses**: MCP responses only
- **Errors**: Error events only
- **Logs**: Server log output only

**4. Control stream:**
- **Pause**: Stop updating (events still buffer)
- **Resume**: Continue live updates
- **Clear**: Remove all activity entries

**5. Debug issues:**
- Watch request/response pairs
- Identify errors
- Check server logs
- Verify protocol communication

---

## Testing Interface

### Quick Examples

**Example 1: List All Prompts**
```
Request Type: List Prompts
Parameters: (none)

Result: All available workflow prompts with descriptions
```

**Example 2: List All Resources**
```
Request Type: List Resources
Parameters: (none)

Result: Complete resource catalog
```

**Example 3: Load TypeScript Agent**
```
Request Type: Read Resource
URI: orchestr8://agents/typescript-core

Result: TypeScript core expertise (~650 tokens)
```

**Example 4: Fuzzy Match for API Skills**
```
Request Type: Read Resource
URI: orchestr8://match?query=api+design+patterns&mode=catalog&maxResults=10

Result: Top 10 API-related resources
```

**Example 5: Full-Stack Match**
```
Request Type: Read Resource
URI: orchestr8://match?query=typescript+react+api+testing&categories=agents,skills,examples&mode=catalog

Result: Cross-category matches for full-stack development
```

---

## Resource Explorer

### Finding Resources

**By category:**
1. Click "Agents" in sidebar
2. Browse agent definitions
3. Click to view full content

**By search:**
1. Type "authentication" in search
2. See matching resources
3. Filter by category if needed

**By browsing:**
1. Scroll through grid/list
2. Check resource cards
3. View metadata on hover

### Understanding Resource Cards

**Card information:**
- **Icon**: Category indicator (emoji)
- **Name**: Fragment ID
- **Description**: Brief summary
- **URI**: Full orchestr8:// URI
- **Metadata**: Tags, estimated tokens

**Actions:**
- **Click card**: View full content in modal
- **Copy URI**: Use in queries or workflows

---

## Activity Monitoring

### Reading Activity Feed

**Event structure:**
```
[Timestamp] [Type] [Details]

Example:
14:23:45 MCP_REQUEST resources/read (id: 5)
14:23:45 MCP_RESPONSE Success (12.3ms, 650 tokens)
```

**Event types:**
- **SERVER**: Lifecycle events (start, ready, stop)
- **MCP_REQUEST**: Outgoing requests to MCP server
- **MCP_RESPONSE**: Incoming responses from MCP server
- **ERROR**: Error events
- **LOG**: MCP server log output

### Debugging with Activity

**Problem:** Resource not loading

**Steps:**
1. Navigate to Activity tab
2. Filter: "Errors"
3. Look for failed resource/read requests
4. Check error message
5. Verify URI format

**Problem:** Slow queries

**Steps:**
1. Watch activity feed
2. Note latency for each request
3. Compare cached vs uncached
4. Identify bottlenecks

---

## Use Cases

### Use Case 1: Learning the System

**Goal:** Understand available resources

**Steps:**
1. Open Web UI
2. Navigate to Resources tab
3. Browse each category
4. View resource content
5. Note useful resources for later

**Benefits:**
- Visual exploration
- No token cost
- Immediate feedback
- Easy discovery

---

### Use Case 2: Testing Queries

**Goal:** Test dynamic matching before using in code

**Steps:**
1. Navigate to Testing tab
2. Try different query parameters
3. Compare catalog vs index vs full mode
4. Adjust maxResults and minScore
5. Find optimal query for your needs

**Benefits:**
- Rapid iteration
- See results immediately
- Compare approaches
- Optimize before production use

---

### Use Case 3: Debugging MCP Issues

**Goal:** Diagnose why workflow isn't loading resources

**Steps:**
1. Run workflow in Claude Code
2. Open Web UI Activity tab
3. Watch MCP requests/responses
4. Identify failed requests
5. Check error messages and protocol details

**Benefits:**
- Real-time visibility
- Protocol inspection
- Error tracking
- Root cause analysis

---

### Use Case 4: Performance Tuning

**Goal:** Optimize query performance

**Steps:**
1. Test query in Testing tab
2. Note latency in Metadata tab
3. Try index mode vs fuzzy mode
4. Compare token usage
5. Watch Activity for cache hits

**Benefits:**
- Measure actual performance
- Compare strategies
- Optimize token usage
- Verify caching

---

### Use Case 5: Content Authoring

**Goal:** Create new resource fragments

**Steps:**
1. Browse similar resources in Explorer
2. Check metadata structure (tags, capabilities, useWhen)
3. Note token estimates
4. Create new fragment following patterns
5. Test loading via Testing tab
6. Verify in Explorer

**Benefits:**
- Learn by example
- Ensure consistency
- Immediate validation
- Quick iteration

---

## Troubleshooting

### Web UI Won't Start

**Problem:** `npm start` fails

**Solutions:**
1. Check Node.js version: `node --version` (>= 18.0.0)
2. Install dependencies: `npm install`
3. Build MCP server: `cd .. && npm run build`
4. Check port availability: `lsof -i :3000`

---

### Can't Connect to MCP Server

**Problem:** "MCP server not running" error

**Solutions:**
1. Verify MCP server is built: `ls ../dist/index.js`
2. Check MCP server logs in Web UI Activity tab
3. Restart Web UI: Kill process and restart
4. Check file permissions on dist/index.js

---

### No Resources Displayed

**Problem:** Resource Explorer is empty

**Solutions:**
1. Check MCP server started successfully (Activity tab)
2. Verify resources directory exists: `ls ../resources`
3. Click "List Resources" in Testing tab to diagnose
4. Check Activity tab for errors

---

### WebSocket Disconnects

**Problem:** "Disconnected from server" message

**Solutions:**
1. Check server is still running
2. Refresh page to reconnect
3. Check browser console for errors
4. Verify no firewall blocking WebSocket

---

### Slow Performance

**Problem:** Queries are slow

**Solutions:**
1. Check Activity tab for actual latency
2. Verify caching is working (subsequent queries faster)
3. Try index mode instead of fuzzy
4. Check server load and memory
5. Clear activity log if large (Clear button)

---

## Related Documentation

- [Getting Started](./getting-started.md) - Installation and setup
- [Usage Guide](./usage/README.md) - How to use Orchestr8
- [Examples](./examples/README.md) - Usage examples
- [Troubleshooting Guide](./guides/troubleshooting.md) - Common issues

**Web UI README:** `/Users/seth/Projects/orchestr8-mcp/plugins/orchestr8/web-ui/README.md` (technical details)

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-11
