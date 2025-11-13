# How to Load orchestr8 MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using the MCP resource tools.

## Tool Usage

Use the `ReadMcpResourceTool` with these parameters:

```
ReadMcpResourceTool:
- server: "plugin:orchestr8:orchestr8-resources"
- uri: "<the orchestr8:// URI>"
```

## Examples

**Load a specific resource:**
```
ReadMcpResourceTool(
  server: "plugin:orchestr8:orchestr8-resources",
  uri: "orchestr8://patterns/autonomous-organization"
)
```

**Query for matching resources:**
```
ReadMcpResourceTool(
  server: "plugin:orchestr8:orchestr8-resources",
  uri: "orchestr8://match?query=typescript react&categories=agents,skills&minScore=15"
)
```

**Load an agent:**
```
ReadMcpResourceTool(
  server: "plugin:orchestr8:orchestr8-resources",
  uri: "orchestr8://agents/project-manager"
)
```

## Common URI Patterns

- **Direct resource:** `orchestr8://category/resource-name`
- **Dynamic query:** `orchestr8://match?query=<keywords>&categories=<cats>&minScore=<threshold>`
- **Category search:** `orchestr8://category/match?query=<keywords>`

## Categories

- `agents` - Domain expert agents
- `skills` - Reusable techniques
- `patterns` - Architectural patterns
- `workflows` - Multi-phase processes
- `examples` - Code samples
- `guides` - Implementation guides
