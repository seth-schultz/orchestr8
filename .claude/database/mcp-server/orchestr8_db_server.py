#!/usr/bin/env python3
"""
Orchestr8 Intelligence Database MCP Server

This MCP server exposes database queries as native Claude Code tools.
Agents can use these tools transparently without knowing about the database.

Installation:
    Add to Claude Code's MCP servers configuration:
    {
        "mcpServers": {
            "orchestr8-db": {
                "command": "python3",
                "args": ["/path/to/orchestr8_db_server.py"],
                "env": {
                    "DATABASE_URL": "postgresql://orchestr8:password@localhost:5433/orchestr8_intelligence"
                }
            }
        }
    }

Tools exposed:
    - query_function: Get specific function with line numbers
    - query_lines: Get specific lines from a file
    - semantic_search: Find code by natural language
    - find_functions: Pattern-based function search
    - get_callers: Find who calls a function
    - get_dependencies: Get file imports
"""

import sys
import json
import os

# Add lib directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'lib'))

from db_client import CodeQuery, query_function, query_lines, search_code, token_tracker


class MCPServer:
    """MCP Server for Orchestr8 Intelligence Database."""

    def __init__(self):
        self.query = CodeQuery()

    def handle_initialize(self, params):
        """Handle initialize request."""
        return {
            "protocolVersion": "1.0",
            "capabilities": {
                "tools": {}
            },
            "serverInfo": {
                "name": "orchestr8-db",
                "version": "1.5.0"
            }
        }

    def handle_list_tools(self, params):
        """List available tools."""
        return {
            "tools": [
                {
                    "name": "query_function",
                    "description": "Get a specific function with exact line numbers. Use this instead of reading entire files. Returns function signature, body, start/end lines, complexity, and parameters. MUCH faster and uses 90% fewer tokens than reading full files.",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "function_name": {
                                "type": "string",
                                "description": "Name of the function to retrieve"
                            },
                            "project_id": {
                                "type": "string",
                                "description": "Project ID (optional, auto-detected from current directory)"
                            }
                        },
                        "required": ["function_name"]
                    }
                },
                {
                    "name": "query_lines",
                    "description": "Get specific lines from a file (e.g., lines 42-67). Use this to load only the code you need, not entire files. Saves 80-90% tokens.",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "file_path": {
                                "type": "string",
                                "description": "Path to the file"
                            },
                            "start_line": {
                                "type": "integer",
                                "description": "Starting line number (1-indexed)"
                            },
                            "end_line": {
                                "type": "integer",
                                "description": "Ending line number (inclusive)"
                            }
                        },
                        "required": ["file_path", "start_line", "end_line"]
                    }
                },
                {
                    "name": "semantic_search",
                    "description": "Find code using natural language. Example: 'find rate limiting logic' or 'user authentication functions'. Uses AI embeddings to find semantically similar code. Returns top matches with similarity scores.",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "query": {
                                "type": "string",
                                "description": "Natural language description of what to find"
                            },
                            "limit": {
                                "type": "integer",
                                "description": "Maximum number of results (default: 5)",
                                "default": 5
                            },
                            "entity_types": {
                                "type": "array",
                                "items": {"type": "string"},
                                "description": "Types to search: function, class (default: both)",
                                "default": ["function", "class"]
                            }
                        },
                        "required": ["query"]
                    }
                },
                {
                    "name": "find_functions",
                    "description": "Find functions by pattern (supports wildcards). Example: 'auth*' finds all functions starting with 'auth'. Fast pattern matching.",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "pattern": {
                                "type": "string",
                                "description": "Pattern with wildcards (e.g., 'user*', '*Handler')"
                            },
                            "limit": {
                                "type": "integer",
                                "description": "Maximum results (default: 10)",
                                "default": 10
                            }
                        },
                        "required": ["pattern"]
                    }
                },
                {
                    "name": "get_callers",
                    "description": "Find all functions that call a specific function (call graph). Use for impact analysis before modifying code. Shows who depends on this function.",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "function_name": {
                                "type": "string",
                                "description": "Function to analyze"
                            },
                            "max_depth": {
                                "type": "integer",
                                "description": "How many levels deep to search (default: 2)",
                                "default": 2
                            }
                        },
                        "required": ["function_name"]
                    }
                },
                {
                    "name": "get_dependencies",
                    "description": "Get all imports and dependencies for a file. Shows what modules are imported and what items are used.",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "file_path": {
                                "type": "string",
                                "description": "Path to the file"
                            }
                        },
                        "required": ["file_path"]
                    }
                },
                {
                    "name": "token_usage_report",
                    "description": "Get current token usage statistics. Shows how many tokens used, breakdown by method (file vs database), and savings percentage.",
                    "inputSchema": {
                        "type": "object",
                        "properties": {}
                    }
                }
            ]
        }

    def handle_call_tool(self, params):
        """Handle tool call request."""
        tool_name = params.get("name")
        arguments = params.get("arguments", {})

        try:
            if tool_name == "query_function":
                result = self.query.get_function_with_lines(
                    arguments["function_name"],
                    arguments.get("project_id")
                )

                if result:
                    # Track token usage
                    token_tracker.track_read(
                        result['file_path'],
                        result['body'],
                        method='database'
                    )

                    return {
                        "content": [
                            {
                                "type": "text",
                                "text": json.dumps(result, indent=2)
                            }
                        ]
                    }
                else:
                    return {
                        "content": [
                            {
                                "type": "text",
                                "text": f"Function '{arguments['function_name']}' not found"
                            }
                        ],
                        "isError": True
                    }

            elif tool_name == "query_lines":
                result = self.query.get_file_lines(
                    arguments["file_path"],
                    arguments["start_line"],
                    arguments["end_line"]
                )

                if result:
                    token_tracker.track_read(
                        arguments["file_path"],
                        result,
                        method='database'
                    )

                    return {
                        "content": [
                            {
                                "type": "text",
                                "text": result
                            }
                        ]
                    }
                else:
                    return {
                        "content": [
                            {
                                "type": "text",
                                "text": f"Failed to read lines from {arguments['file_path']}"
                            }
                        ],
                        "isError": True
                    }

            elif tool_name == "semantic_search":
                results = self.query.semantic_search(
                    arguments["query"],
                    arguments.get("entity_types", ["function", "class"]),
                    arguments.get("limit", 5)
                )

                # Track token usage
                total_code = '\n'.join(r.get('body', '') for r in results if r.get('body'))
                if total_code:
                    token_tracker.track_read(
                        'semantic_search',
                        total_code,
                        method='database'
                    )

                return {
                    "content": [
                        {
                            "type": "text",
                            "text": json.dumps(results, indent=2)
                        }
                    ]
                }

            elif tool_name == "find_functions":
                results = self.query.find_functions_by_pattern(
                    arguments["pattern"],
                    arguments.get("limit", 10)
                )

                return {
                    "content": [
                        {
                            "type": "text",
                            "text": json.dumps(results, indent=2)
                        }
                    ]
                }

            elif tool_name == "get_callers":
                results = self.query.get_function_callers(
                    arguments["function_name"],
                    arguments.get("max_depth", 2)
                )

                return {
                    "content": [
                        {
                            "type": "text",
                            "text": json.dumps(results, indent=2)
                        }
                    ]
                }

            elif tool_name == "get_dependencies":
                results = self.query.get_file_dependencies(
                    arguments["file_path"]
                )

                return {
                    "content": [
                        {
                            "type": "text",
                            "text": json.dumps(results, indent=2)
                        }
                    ]
                }

            elif tool_name == "token_usage_report":
                # Generate report
                report = {
                    "total_tokens_used": token_tracker.used_tokens,
                    "max_tokens": token_tracker.max_tokens,
                    "percentage_used": (token_tracker.used_tokens / token_tracker.max_tokens) * 100,
                    "total_queries": len(token_tracker.queries),
                    "breakdown": {
                        "file_reads": sum(q['tokens'] for q in token_tracker.queries if q['method'] == 'file'),
                        "database_queries": sum(q['tokens'] for q in token_tracker.queries if q['method'] == 'database')
                    }
                }

                return {
                    "content": [
                        {
                            "type": "text",
                            "text": json.dumps(report, indent=2)
                        }
                    ]
                }

            else:
                return {
                    "content": [
                        {
                            "type": "text",
                            "text": f"Unknown tool: {tool_name}"
                        }
                    ],
                    "isError": True
                }

        except Exception as e:
            return {
                "content": [
                    {
                        "type": "text",
                        "text": f"Error: {str(e)}"
                    }
                ],
                "isError": True
            }

    def run(self):
        """Run the MCP server (stdio protocol)."""
        for line in sys.stdin:
            try:
                request = json.loads(line)

                method = request.get("method")
                params = request.get("params", {})
                request_id = request.get("id")

                if method == "initialize":
                    response = self.handle_initialize(params)
                elif method == "tools/list":
                    response = self.handle_list_tools(params)
                elif method == "tools/call":
                    response = self.handle_call_tool(params)
                else:
                    response = {"error": f"Unknown method: {method}"}

                # Send response
                output = {
                    "jsonrpc": "2.0",
                    "id": request_id,
                    "result": response
                }

                print(json.dumps(output), flush=True)

            except Exception as e:
                error_output = {
                    "jsonrpc": "2.0",
                    "id": request.get("id"),
                    "error": {
                        "code": -32603,
                        "message": str(e)
                    }
                }
                print(json.dumps(error_output), flush=True)


if __name__ == "__main__":
    server = MCPServer()
    server.run()
