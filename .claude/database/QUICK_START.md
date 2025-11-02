# Quick Start: Autonomous Coding with Database Intelligence

## 🎯 Goal

Enable Claude Code to work autonomously for 8+ hours without hitting context/token limits by using intelligent database queries instead of reading entire files.

## 🚀 Installation (5 minutes)

```bash
cd .claude/database
./install.sh
```

This will:
1. ✓ Start PostgreSQL + pgvector database
2. ✓ Install Python dependencies
3. ✓ Configure MCP server for Claude Code
4. ✓ Create database schema (27+ tables)

## 🔑 Required Configuration

**Edit `.env` file and add your OpenAI API key:**

```bash
nano .claude/database/.env

# Change this line:
OPENAI_API_KEY=your_openai_api_key_here
```

**Edit MCP config (if not auto-configured):**

```bash
nano ~/.config/claude-code/mcp_settings.json

# Ensure orchestr8-db server is configured
```

## 📊 Index Your Project

```bash
# Index current project (coming soon - use MCP tools for now)
cd /path/to/your/project
python3 .claude/database/lib/indexer.py .
```

## 💡 How To Use

### Old Way (Wastes Tokens)

```
Read file src/auth.ts
# Loads 1000 lines = 10,000 tokens
```

### New Way (Saves Tokens)

```
Use query_function tool with function_name: "authenticateUser"
# Loads only this function = 500 tokens
# 95% token savings!
```

## 🛠️ Available MCP Tools

Once installed, Claude Code gains these new tools:

### 1. query_function
Get a specific function with exact line numbers.

**Example:**
```
Use query_function tool with function_name: "authenticateUser"
```

**Returns:**
```json
{
  "name": "authenticateUser",
  "signature": "function authenticateUser(email: string, password: string)",
  "body": "... complete function code ...",
  "file_path": "src/auth.ts",
  "start_line": 42,
  "end_line": 67,
  "estimated_tokens": 125
}
```

### 2. semantic_search
Find code using natural language.

**Example:**
```
Use semantic_search tool with query: "rate limiting logic"
```

**Returns:**
```json
[
  {
    "name": "rateLimiter",
    "file_path": "src/middleware/rateLimit.ts",
    "start_line": 15,
    "similarity": 0.92
  }
]
```

### 3. query_lines
Get specific lines from a file.

**Example:**
```
Use query_lines tool with file_path: "src/auth.ts", start_line: 42, end_line: 67
```

### 4. find_functions
Pattern-based function search.

**Example:**
```
Use find_functions tool with pattern: "auth*"
```

### 5. get_callers
Find who calls a function (impact analysis).

**Example:**
```
Use get_callers tool with function_name: "authenticateUser"
```

### 6. get_dependencies
See what a file imports.

**Example:**
```
Use get_dependencies tool with file_path: "src/auth.ts"
```

## 📈 Impact

### Before (Traditional)

- **Task**: Refactor authentication system
- **Approach**: Read 20 full files
- **Tokens**: 200,000 (hit limit)
- **Time**: 2 hours before restart needed
- **Result**: Incomplete, lost context

### After (Database-First)

- **Task**: Refactor authentication system
- **Approach**: Query 50 specific functions
- **Tokens**: 25,000 (87% savings)
- **Time**: 8+ hours continuous work
- **Result**: Complete, never hit limits

## 🎯 Real-World Example

### Scenario: Fix Bug in Login

**Traditional Approach:**
```
1. Read src/auth.ts (10k tokens)
2. Read src/models/user.ts (5k tokens)
3. Read src/utils/validation.ts (3k tokens)
4. Read src/middleware/session.ts (4k tokens)
Total: 22,000 tokens
```

**Database-First Approach:**
```
1. query_function("authenticateUser") - 500 tokens
2. query_function("validateUser") - 300 tokens
3. query_function("createSession") - 400 tokens
4. get_callers("authenticateUser") - 200 tokens
Total: 1,400 tokens (94% savings!)
```

**Result:**
- 15x more work per context window
- Can debug much larger systems
- Never run out of context

## 🔧 Troubleshooting

### Database Not Running

```bash
docker ps | grep orchestr8-intelligence-db
# If not running:
cd .claude/database
./setup.sh
```

### MCP Server Not Working

```bash
# Check configuration
cat ~/.config/claude-code/mcp_settings.json

# Restart Claude Code
```

### Functions Not Found

```bash
# Reindex project
cd /path/to/project
python3 .claude/database/lib/indexer.py .
```

## 📖 Complete Documentation

- **System Instructions**: `.claude/SYSTEM_INSTRUCTIONS.md` (MUST READ)
- **Database Guide**: `.claude/database/README.md`
- **Agent Guidelines**: `.claude/CLAUDE.md`
- **Database Schema**: `.claude/database/schema.sql`

## 🎓 Key Concepts

### 1. Database is Cache, Files are Truth

- File system = source of truth
- Database = performance optimization
- Automatic reconciliation ensures sync
- Self-correcting on git operations

### 2. Query First, Read Last

- **Always** try database query first
- **Only** read files if query fails
- Database triggers reindexing automatically

### 3. Precise Loading

- Load only what you need
- Function-level granularity
- Line-number precision
- 80-90% token savings

### 4. Semantic Discovery

- Don't know function name? Use semantic_search
- Describe what you want in natural language
- AI finds most relevant code
- Much smarter than grep

## 💻 Python API (For Advanced Users)

```python
from db_client import CodeQuery, query_function, search_code

# Initialize
query = CodeQuery()

# Get specific function
func = query.get_function_with_lines("authenticateUser")
print(f"Function at {func['file_path']}:{func['start_line']}")

# Semantic search
results = search_code("rate limiting implementation")

# Get specific lines
code = query.get_file_lines("src/auth.ts", 42, 67)

# Impact analysis
callers = query.get_function_callers("authenticateUser", max_depth=3)
```

## 🎯 Success Criteria

You're using it correctly when:

✅ Token usage stays under 30% even after hours
✅ You rarely read entire files
✅ Most code loading via query_function
✅ Semantic search finds what you need
✅ Never hit context limits

You need to adjust if:

❌ Token usage > 60% after 30 minutes
❌ Frequently reading full files
❌ Not using database tools
❌ Hitting context limits
❌ Can't find functions

## 🚀 Next Steps

1. **Index your main project** (coming soon - auto-indexing)
2. **Try semantic_search** to find code
3. **Use query_function** instead of read_file
4. **Monitor tokens** with token_usage_report tool
5. **Code for hours** without hitting limits!

---

**The goal: Code autonomously for 8+ hours without interruption or context issues.**

**The method: Intelligent database queries instead of file reads.**

**The result: 80-90% token savings, unlimited scalability.**
