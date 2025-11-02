#!/usr/bin/env python3
"""
Orchestr8 Intelligence Database Client

This is the ACTUAL working client that agents use to query the database.
All agents should import and use this instead of reading full files.

Usage:
    from db_client import CodeQuery

    query = CodeQuery()

    # Get specific function with line numbers
    func = query.get_function_with_lines("authenticateUser", project_id)
    # Returns: {name, signature, body, start_line, end_line, file_path}

    # Semantic search
    results = query.semantic_search("rate limiting logic", limit=5)

    # Load only lines 42-67 from a file
    code = query.get_file_lines("src/auth.ts", 42, 67, project_id)
"""

import os
import sys
import json
import hashlib
import subprocess
from typing import Optional, List, Dict, Any, Tuple
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2 import pool

# Connection pooling for performance
connection_pool = None


def get_db_connection():
    """Get database connection from pool."""
    global connection_pool

    if connection_pool is None:
        database_url = os.getenv('DATABASE_URL',
            'postgresql://orchestr8:orchestr8_dev_password@localhost:5433/orchestr8_intelligence')

        try:
            connection_pool = psycopg2.pool.SimpleConnectionPool(
                1, 10,  # min, max connections
                database_url
            )
        except Exception as e:
            print(f"⚠ Database connection failed: {e}")
            print("  Falling back to file system operations")
            return None

    try:
        return connection_pool.getconn()
    except:
        return None


def release_db_connection(conn):
    """Release connection back to pool."""
    if conn and connection_pool:
        connection_pool.putconn(conn)


def get_git_hash(file_path: str) -> Optional[str]:
    """Get git hash of file (source of truth for staleness)."""
    try:
        result = subprocess.run(
            ['git', 'hash-object', file_path],
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip()
    except:
        # Not in git, use file mtime
        try:
            return str(os.path.getmtime(file_path))
        except:
            return None


def get_project_id(project_path: str = None) -> Optional[str]:
    """Get or create project ID."""
    if project_path is None:
        # Use current git root
        try:
            result = subprocess.run(
                ['git', 'rev-parse', '--show-toplevel'],
                capture_output=True,
                text=True,
                check=True
            )
            project_path = result.stdout.strip()
        except:
            project_path = os.getcwd()

    conn = get_db_connection()
    if not conn:
        return None

    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Try to find existing project
            cur.execute("""
                SELECT id FROM projects WHERE path = %s
            """, (project_path,))

            result = cur.fetchone()
            if result:
                return str(result['id'])

            # Create new project
            project_name = os.path.basename(project_path)
            cur.execute("""
                INSERT INTO projects (name, path, created_at)
                VALUES (%s, %s, NOW())
                RETURNING id
            """, (project_name, project_path))

            conn.commit()
            return str(cur.fetchone()['id'])
    finally:
        release_db_connection(conn)


class CodeQuery:
    """
    Main query interface for agents.

    This class provides all the query methods agents need to load
    code context efficiently without reading entire files.
    """

    def __init__(self, project_id: str = None):
        self.project_id = project_id or get_project_id()

    def get_function_with_lines(self, function_name: str, project_id: str = None) -> Optional[Dict[str, Any]]:
        """
        Get function with exact line numbers.

        This is what agents should use instead of reading entire files.
        Returns ONLY the function code with precise line numbers.

        Returns:
            {
                'name': 'authenticateUser',
                'signature': 'function authenticateUser(email: string, password: string): Promise<User>',
                'body': '... function code ...',
                'docstring': '... docs ...',
                'file_path': 'src/auth.ts',
                'start_line': 42,
                'end_line': 67,
                'complexity': 5,
                'parameters': ['email', 'password'],
                'return_type': 'Promise<User>'
            }
        """
        proj_id = project_id or self.project_id
        conn = get_db_connection()

        if not conn:
            return self._fallback_grep_function(function_name)

        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    SELECT
                        f.name,
                        f.signature,
                        f.body,
                        f.docstring,
                        f.start_line,
                        f.end_line,
                        f.complexity,
                        f.parameters,
                        f.return_type,
                        fi.path as file_path,
                        fi.git_hash as db_git_hash
                    FROM functions f
                    JOIN files fi ON f.file_id = fi.id
                    WHERE f.name = %s
                      AND f.project_id = %s
                    LIMIT 1
                """, (function_name, proj_id))

                result = cur.fetchone()

                if not result:
                    print(f"⚠ Function '{function_name}' not in database")
                    return self._fallback_grep_function(function_name)

                # Validate git hash
                result_dict = dict(result)
                file_path = result_dict['file_path']
                current_hash = get_git_hash(file_path)

                if current_hash != result_dict['db_git_hash']:
                    print(f"⚠ Database stale for {file_path}, falling back to file read")
                    # TODO: Trigger reindex in background
                    return self._fallback_read_function(file_path, function_name)

                # Remove internal field
                del result_dict['db_git_hash']

                # Calculate token estimate
                result_dict['estimated_tokens'] = len(result_dict['body']) // 4

                print(f"✓ Loaded function '{function_name}' from DB ({result_dict['estimated_tokens']} tokens, lines {result_dict['start_line']}-{result_dict['end_line']})")

                return result_dict

        finally:
            release_db_connection(conn)

    def get_file_lines(self, file_path: str, start_line: int, end_line: int, project_id: str = None) -> Optional[str]:
        """
        Get specific lines from a file.

        Use this to load only the lines you need, not the entire file.

        Args:
            file_path: Relative path to file
            start_line: Starting line number (1-indexed)
            end_line: Ending line number (inclusive)

        Returns:
            String containing only the requested lines
        """
        proj_id = project_id or self.project_id

        try:
            with open(file_path, 'r') as f:
                lines = f.readlines()
                # Convert to 0-indexed
                selected_lines = lines[start_line-1:end_line]
                code = ''.join(selected_lines)

                tokens = len(code) // 4
                print(f"✓ Loaded {file_path} lines {start_line}-{end_line} ({tokens} tokens)")

                return code
        except Exception as e:
            print(f"✗ Failed to read {file_path}: {e}")
            return None

    def semantic_search(self, query: str, entity_types: List[str] = ['function', 'class'], limit: int = 5, project_id: str = None) -> List[Dict[str, Any]]:
        """
        Semantic code search using embeddings.

        Use this to find relevant code without knowing exact names.

        Example:
            results = query.semantic_search("rate limiting logic")
            for r in results:
                print(f"{r['similarity']:.2%} match: {r['name']} in {r['file_path']}:{r['start_line']}")
        """
        proj_id = project_id or self.project_id
        conn = get_db_connection()

        if not conn:
            print("⚠ Database unavailable, falling back to grep")
            return self._fallback_grep_search(query)

        try:
            # Generate embedding for query
            import openai
            openai.api_key = os.getenv('OPENAI_API_KEY')

            if not openai.api_key:
                print("⚠ OPENAI_API_KEY not set, falling back to text search")
                return self._fallback_text_search(query, entity_types, limit)

            response = openai.Embedding.create(
                input=query,
                model="text-embedding-ada-002"
            )
            query_embedding = response['data'][0]['embedding']

            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Convert Python list to PostgreSQL array format
                embedding_str = '[' + ','.join(map(str, query_embedding)) + ']'

                cur.execute("""
                    SELECT
                        e.entity_name as name,
                        e.entity_type,
                        f.signature,
                        f.body,
                        f.start_line,
                        f.end_line,
                        fi.path as file_path,
                        1 - (e.embedding <=> %s::vector) AS similarity
                    FROM embeddings e
                    JOIN files fi ON e.project_id = fi.project_id
                    LEFT JOIN functions f ON e.entity_id = f.id AND e.entity_type = 'function'
                    WHERE e.project_id = %s
                      AND e.entity_type = ANY(%s)
                    ORDER BY e.embedding <=> %s::vector
                    LIMIT %s
                """, (embedding_str, proj_id, entity_types, embedding_str, limit))

                results = [dict(row) for row in cur.fetchall()]

                total_tokens = sum(len(r.get('body', '')) // 4 for r in results)
                print(f"✓ Semantic search found {len(results)} results ({total_tokens} total tokens)")

                return results

        except Exception as e:
            print(f"⚠ Semantic search failed: {e}, falling back to text search")
            return self._fallback_text_search(query, entity_types, limit)
        finally:
            release_db_connection(conn)

    def find_functions_by_pattern(self, pattern: str, limit: int = 10, project_id: str = None) -> List[Dict[str, Any]]:
        """
        Find functions matching a pattern.

        Use wildcards: find_functions_by_pattern("auth*")
        """
        proj_id = project_id or self.project_id
        conn = get_db_connection()

        if not conn:
            return self._fallback_grep_pattern(pattern)

        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    SELECT
                        f.name,
                        f.signature,
                        f.start_line,
                        f.end_line,
                        fi.path as file_path
                    FROM functions f
                    JOIN files fi ON f.file_id = fi.id
                    WHERE f.name ILIKE %s
                      AND f.project_id = %s
                    ORDER BY f.name
                    LIMIT %s
                """, (pattern.replace('*', '%'), proj_id, limit))

                results = [dict(row) for row in cur.fetchall()]
                print(f"✓ Found {len(results)} functions matching '{pattern}'")
                return results
        finally:
            release_db_connection(conn)

    def get_function_callers(self, function_name: str, max_depth: int = 2, project_id: str = None) -> List[Dict[str, Any]]:
        """
        Find all functions that call this function (call graph).

        Use this for impact analysis before modifying a function.
        """
        proj_id = project_id or self.project_id
        conn = get_db_connection()

        if not conn:
            return []

        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    WITH RECURSIVE call_tree AS (
                        -- Base case: direct callers
                        SELECT
                            fc.caller_function_id,
                            f.name as caller_name,
                            fi.path as caller_file,
                            fc.line_number,
                            1 as depth
                        FROM function_calls fc
                        JOIN functions f ON fc.caller_function_id = f.id
                        JOIN files fi ON f.file_id = fi.id
                        WHERE fc.callee_function_id = (
                            SELECT id FROM functions
                            WHERE name = %s AND project_id = %s
                            LIMIT 1
                        )

                        UNION

                        -- Recursive case: callers of callers
                        SELECT
                            fc.caller_function_id,
                            f.name,
                            fi.path,
                            fc.line_number,
                            ct.depth + 1
                        FROM function_calls fc
                        JOIN call_tree ct ON fc.callee_function_id = ct.caller_function_id
                        JOIN functions f ON fc.caller_function_id = f.id
                        JOIN files fi ON f.file_id = fi.id
                        WHERE ct.depth < %s
                    )
                    SELECT DISTINCT caller_name, caller_file, line_number, depth
                    FROM call_tree
                    ORDER BY depth, caller_name
                """, (function_name, proj_id, max_depth))

                results = [dict(row) for row in cur.fetchall()]
                print(f"✓ Found {len(results)} callers of '{function_name}'")
                return results
        finally:
            release_db_connection(conn)

    def get_file_dependencies(self, file_path: str, project_id: str = None) -> List[Dict[str, Any]]:
        """Get all imports/dependencies for a file."""
        proj_id = project_id or self.project_id
        conn = get_db_connection()

        if not conn:
            return []

        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    SELECT module_name, imported_items, import_type
                    FROM dependencies
                    WHERE file_id = (
                        SELECT id FROM files
                        WHERE path = %s AND project_id = %s
                    )
                """, (file_path, proj_id))

                return [dict(row) for row in cur.fetchall()]
        finally:
            release_db_connection(conn)

    # Fallback methods when database unavailable

    def _fallback_grep_function(self, function_name: str) -> Optional[Dict[str, Any]]:
        """Fallback: Use grep to find function."""
        try:
            result = subprocess.run(
                ['grep', '-rn', f'function {function_name}', '.'],
                capture_output=True,
                text=True
            )

            if result.stdout:
                # Parse first match
                first_line = result.stdout.split('\n')[0]
                parts = first_line.split(':', 2)
                if len(parts) >= 2:
                    file_path = parts[0]
                    line_num = int(parts[1])

                    print(f"✓ Found via grep: {file_path}:{line_num}")

                    # Read function from file (estimate 20 lines)
                    return self.get_file_lines(file_path, line_num, line_num + 20)

            return None
        except Exception as e:
            print(f"✗ Grep fallback failed: {e}")
            return None

    def _fallback_text_search(self, query: str, entity_types: List[str], limit: int) -> List[Dict[str, Any]]:
        """Fallback: Simple text search in database."""
        conn = get_db_connection()
        if not conn:
            return []

        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    SELECT
                        f.name,
                        f.signature,
                        f.start_line,
                        f.end_line,
                        fi.path as file_path,
                        0.5 as similarity
                    FROM functions f
                    JOIN files fi ON f.file_id = fi.id
                    WHERE f.name ILIKE %s
                       OR f.docstring ILIKE %s
                    LIMIT %s
                """, (f'%{query}%', f'%{query}%', limit))

                return [dict(row) for row in cur.fetchall()]
        finally:
            release_db_connection(conn)

    def _fallback_grep_pattern(self, pattern: str) -> List[Dict[str, Any]]:
        """Fallback: Use grep for pattern search."""
        try:
            result = subprocess.run(
                ['grep', '-rn', pattern.replace('*', '.*'), '.'],
                capture_output=True,
                text=True
            )

            results = []
            for line in result.stdout.split('\n')[:10]:  # Limit to 10
                if ':' in line:
                    parts = line.split(':', 2)
                    if len(parts) >= 2:
                        results.append({
                            'file_path': parts[0],
                            'line_number': int(parts[1]),
                            'name': pattern,
                            'from_grep': True
                        })

            return results
        except:
            return []


# Convenience functions for agents
def query_function(name: str, project_id: str = None) -> Optional[Dict[str, Any]]:
    """Quick function query."""
    return CodeQuery(project_id).get_function_with_lines(name, project_id)


def query_lines(file_path: str, start: int, end: int, project_id: str = None) -> Optional[str]:
    """Quick line range query."""
    return CodeQuery(project_id).get_file_lines(file_path, start, end, project_id)


def search_code(query: str, limit: int = 5, project_id: str = None) -> List[Dict[str, Any]]:
    """Quick semantic search."""
    return CodeQuery(project_id).semantic_search(query, limit=limit, project_id=project_id)


# Token usage tracking
class TokenTracker:
    """
    Track token usage and enforce database usage.

    Agents should check this before loading code:
    - If under budget: Can read files directly
    - If over budget: MUST use database queries
    """

    def __init__(self, max_tokens: int = 50000):
        self.max_tokens = max_tokens
        self.used_tokens = 0
        self.queries = []

    def estimate_tokens(self, text: str) -> int:
        """Estimate tokens in text (rough: 1 token ≈ 4 chars)."""
        return len(text) // 4

    def can_afford(self, estimated_tokens: int) -> bool:
        """Check if we can afford to load this much context."""
        return (self.used_tokens + estimated_tokens) < self.max_tokens

    def track_read(self, file_path: str, content: str, method: str = 'file'):
        """Track a read operation."""
        tokens = self.estimate_tokens(content)
        self.used_tokens += tokens
        self.queries.append({
            'file': file_path,
            'tokens': tokens,
            'method': method,
            'timestamp': datetime.now().isoformat()
        })

        percent = (self.used_tokens / self.max_tokens) * 100

        if percent > 80:
            print(f"⚠ WARNING: {percent:.1f}% of token budget used ({self.used_tokens}/{self.max_tokens})")
            print("  → MUST use database queries instead of reading full files")
        elif percent > 60:
            print(f"⚠ {percent:.1f}% of token budget used, consider using database queries")

    def report(self):
        """Generate token usage report."""
        print(f"\n📊 Token Usage Report:")
        print(f"  Total used: {self.used_tokens:,} / {self.max_tokens:,} ({(self.used_tokens/self.max_tokens)*100:.1f}%)")
        print(f"  Total queries: {len(self.queries)}")

        # Break down by method
        file_tokens = sum(q['tokens'] for q in self.queries if q['method'] == 'file')
        db_tokens = sum(q['tokens'] for q in self.queries if q['method'] == 'database')

        print(f"\n  By method:")
        print(f"    File reads: {file_tokens:,} tokens")
        print(f"    DB queries: {db_tokens:,} tokens")

        if file_tokens > 0 and db_tokens > 0:
            savings = (file_tokens / (file_tokens + db_tokens)) * 100
            print(f"\n  💡 Database queries saved {savings:.1f}% compared to file reads")


# Global tracker instance
token_tracker = TokenTracker()


if __name__ == '__main__':
    # CLI usage
    import argparse

    parser = argparse.ArgumentParser(description='Query Orchestr8 Intelligence Database')
    parser.add_argument('--function', '-f', help='Get function by name')
    parser.add_argument('--search', '-s', help='Semantic search')
    parser.add_argument('--pattern', '-p', help='Pattern search (wildcards)')
    parser.add_argument('--callers', '-c', help='Find function callers')
    parser.add_argument('--lines', '-l', nargs=3, metavar=('FILE', 'START', 'END'), help='Get file lines')

    args = parser.parse_args()

    query = CodeQuery()

    if args.function:
        result = query.get_function_with_lines(args.function)
        if result:
            print(json.dumps(result, indent=2))

    elif args.search:
        results = query.semantic_search(args.search)
        print(json.dumps(results, indent=2))

    elif args.pattern:
        results = query.find_functions_by_pattern(args.pattern)
        print(json.dumps(results, indent=2))

    elif args.callers:
        results = query.get_function_callers(args.callers)
        print(json.dumps(results, indent=2))

    elif args.lines:
        file_path, start, end = args.lines
        code = query.get_file_lines(file_path, int(start), int(end))
        print(code)

    else:
        parser.print_help()
