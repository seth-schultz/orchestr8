# CRITICAL: Database-First Code Access Instructions

**ALL AGENTS MUST READ THIS BEFORE ANY CODING TASK**

## 🚨 MANDATORY: Use Database Queries Instead of Reading Files

The Orchestr8 Intelligence Database contains indexed code from all projects.
**You MUST query the database FIRST before reading any files.**

### Why This Matters

- **Token Savings**: 80-90% reduction (50k tokens → 500 tokens)
- **Speed**: Database queries are 10x faster than file reads
- **Precision**: Load only the exact lines you need
- **Scalability**: Work on large codebases without context limits

### ❌ OLD WAY (DO NOT DO THIS):

```python
# BAD: Reads entire file (10k+ tokens)
content = read_file('src/auth.ts')  # 1000 lines = 10,000 tokens
# Search through all content...
```

### ✅ NEW WAY (ALWAYS DO THIS):

```python
# GOOD: Query specific function (500 tokens)
result = query_function('authenticateUser')  # Returns ONLY this function
# result = {
#   'name': 'authenticateUser',
#   'body': '... function code ...',
#   'start_line': 42,
#   'end_line': 67,
#   'file_path': 'src/auth.ts'
# }
# Only 500 tokens vs 10,000 tokens = 95% savings
```

## 📋 Available Database Query Methods

### Method 1: query_function (MOST COMMON)

**Use when**: You need a specific function

```python
from db_client import query_function

# Get function with exact line numbers
result = query_function('authenticateUser')

# Returns:
{
    'name': 'authenticateUser',
    'signature': 'function authenticateUser(email: string, password: string)',
    'body': '... complete function code ...',
    'docstring': '... documentation ...',
    'file_path': 'src/auth.ts',
    'start_line': 42,
    'end_line': 67,
    'parameters': ['email', 'password'],
    'return_type': 'Promise<User>',
    'complexity': 5,
    'estimated_tokens': 125  # Much smaller than full file!
}
```

### Method 2: query_lines (For Specific Line Ranges)

**Use when**: You need specific lines from a file

```python
from db_client import query_lines

# Get only lines 42-67
code = query_lines('src/auth.ts', 42, 67)

# Returns just those 25 lines, not all 1000 lines
```

### Method 3: semantic_search (For Discovery)

**Use when**: You don't know the exact function name

```python
from db_client import search_code

# Find code using natural language
results = search_code("rate limiting logic", limit=5)

# Returns top 5 most relevant functions
for r in results:
    print(f"{r['similarity']:.0%} match: {r['name']} in {r['file_path']}:{r['start_line']}")
```

### Method 4: MCP Tools (If MCP Server Installed)

**Best option**: Use native Claude Code MCP tools

```
Use the query_function tool with function_name: "authenticateUser"
```

## 🎯 Decision Tree: When to Use What

```
START
  │
  ├─ Do you know the exact function name?
  │   YES → Use query_function()
  │   NO  → ↓
  │
  ├─ Do you know file + line numbers?
  │   YES → Use query_lines(file, start, end)
  │   NO  → ↓
  │
  ├─ Can you describe what you're looking for?
  │   YES → Use semantic_search(description)
  │   NO  → Use grep/glob as last resort
  │
  └─ After finding: Use query_function() to load it
```

## 📐 Real-World Example

### Scenario: Fix a bug in authentication

**❌ OLD WAY (WASTES TOKENS):**

```python
# 1. Read entire file (10,000 tokens)
auth_content = read_file('src/auth.ts')

# 2. Read entire user model (5,000 tokens)
user_content = read_file('src/models/user.ts')

# 3. Read entire validation file (3,000 tokens)
validation_content = read_file('src/utils/validation.ts')

# Total: 18,000 tokens for 3 files
# After 10 such operations: 180,000 tokens (near limit!)
```

**✅ NEW WAY (SAVES TOKENS):**

```python
# 1. Query specific function (500 tokens)
auth_func = query_function('authenticateUser')

# 2. Query specific class method (300 tokens)
user_validate = query_function('validateCredentials')

# 3. Query specific validator (200 tokens)
validator = query_function('isValidEmail')

# Total: 1,000 tokens for 3 specific functions
# After 10 such operations: 10,000 tokens (only 5% of limit!)
# Can do 18x more work before hitting limits!
```

## 🔍 Pattern: Always Query First, Read Last

```python
# Step 1: Try database query
result = query_function('targetFunction')

if result:
    # Success! Use the result (500 tokens)
    analyze(result['body'])

else:
    # Step 2: Fallback to file search only if not in database
    # (Database automatically triggers reindexing)
    content = read_file('path/to/file.ts')
```

## 🚀 Performance Impact

### Example Task: Refactor Authentication System

**Without Database (Traditional):**
- Read 20 files completely
- 200,000 tokens used
- Hit context limit after 2 hours
- Need to restart, lose context

**With Database (Orchestr8):**
- Query 50 specific functions
- 25,000 tokens used (87.5% savings)
- Can work 8+ hours continuously
- Never hit context limits

## 🎓 Training Examples

### Example 1: Add New Feature

```python
# Task: Add rate limiting to login endpoint

# 1. Find existing rate limiting code
results = semantic_search("rate limiting implementation")

# 2. Get the specific function
rate_limiter = query_function(results[0]['name'])

# 3. Get the login handler
login_handler = query_function('handleLogin')

# 4. Implement new feature (only 800 tokens used so far!)
# vs reading 5 full files (25,000 tokens)
```

### Example 2: Fix Bug

```python
# Task: Fix null pointer error in authenticateUser at line 52

# 1. Get just the function (not entire file)
func = query_function('authenticateUser')

# 2. See it's in src/auth.ts lines 42-67
print(f"Function at {func['file_path']}:{func['start_line']}-{func['end_line']}")

# 3. Fix the bug (only 500 tokens used)
# vs reading entire 1000-line file (10,000 tokens)
```

### Example 3: Impact Analysis

```python
# Task: Refactor authenticateUser - who will be affected?

# 1. Get the function
func = query_function('authenticateUser')

# 2. Find all callers
callers = CodeQuery().get_function_callers('authenticateUser', max_depth=3)

# 3. For each caller, get just that function
for caller in callers:
    caller_func = query_function(caller['caller_name'])
    analyze_impact(caller_func)

# Total tokens: ~5,000 (instead of 50,000 reading all files)
```

## 📊 Token Tracking

### Check Your Token Usage

```python
from db_client import token_tracker

# At any point, check usage
token_tracker.report()

# Output:
# 📊 Token Usage Report:
#   Total used: 12,450 / 50,000 (24.9%)
#   Total queries: 15
#
#   By method:
#     File reads: 2,000 tokens
#     DB queries: 10,450 tokens
#
#   💡 Database queries saved 83.9% compared to file reads
```

### Enforce Budget

```python
# Before loading code, check budget
if not token_tracker.can_afford(estimated_tokens=10000):
    # Over budget! Must use database queries
    result = query_function('targetFunc')  # Uses 500 tokens instead
else:
    # Under budget, can read file
    content = read_file('path.ts')
```

## 🔧 Implementation Checklist

Before starting ANY coding task, verify:

- [ ] Database is running (`docker ps | grep orchestr8-intelligence-db`)
- [ ] Database is indexed (run `/index-codebase` if needed)
- [ ] Know the query methods (query_function, query_lines, semantic_search)
- [ ] Have db_client imported or MCP tools available
- [ ] Token tracker is initialized

## 🚨 CRITICAL RULES

1. **ALWAYS query database FIRST** before reading files
2. **NEVER read entire files** when you only need specific functions
3. **USE semantic_search** when you don't know exact names
4. **CHECK token_tracker** regularly to monitor usage
5. **QUERY by line numbers** when you know the location
6. **LOAD incrementally** - query functions as needed, not all at once
7. **TRUST the database** - it's kept synchronized with file system automatically

## 💡 Pro Tips

1. **Chain queries**: Get function → see dependencies → query those too
2. **Use call graphs**: See who calls what before refactoring
3. **Semantic discovery**: Describe what you want, AI finds it
4. **Line-specific edits**: Query lines 42-67, edit, write back
5. **Impact analysis**: Query callers before changing signatures

## 🎯 Success Metrics

You're doing it right when:

- ✅ Token usage stays under 30% even after hours of work
- ✅ Queries return in <100ms
- ✅ You never read files over 100 lines completely
- ✅ You can work on 1M+ line codebases easily
- ✅ Context never fills up

You're doing it wrong when:

- ❌ Token usage exceeds 60% after 30 minutes
- ❌ You're reading full files with read_file()
- ❌ You're grepping through entire codebase
- ❌ You hit context limits
- ❌ You're not using query_function()

## 📖 Quick Reference

| Task | Use This | Tokens |
|------|----------|--------|
| Get specific function | `query_function('name')` | ~500 |
| Get specific lines | `query_lines(file, start, end)` | ~200 |
| Find code by description | `semantic_search('description')` | ~2000 |
| Find functions by pattern | `find_functions_by_pattern('auth*')` | ~1000 |
| Get function callers | `get_function_callers('name')` | ~1500 |
| Get file dependencies | `get_file_dependencies(file)` | ~300 |
| Read entire file | `read_file(path)` | ~10000 |

**Bottom line**: Database queries use 80-90% fewer tokens than file reads.

---

## 🎓 Remember

**The database is not optional - it's mandatory for efficient operation.**

Every time you're about to read a file, ask yourself:
- Do I need the ENTIRE file?
- Or just a specific function/class/lines?

99% of the time, you only need specific parts. **Query the database.**

**This is the key to working autonomously for hours without hitting limits.**
