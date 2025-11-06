# Contributing to Orchestr8 MCP Server (Rust)

Thank you for your interest in contributing! This document provides guidelines and workflows for contributing to the Rust implementation of the Orchestr8 MCP server.

## Development Setup

### Prerequisites

- Rust 1.75+ (install via [rustup](https://rustup.rs/))
- Git
- Make (optional, for convenience commands)

### Initial Setup

```bash
# Clone repository
git clone https://github.com/seth-schultz/orchestr8.git
cd orchestr8/.claude/mcp-server/orchestr8-bin

# Install dependencies
cargo build

# Run tests
cargo test

# Run benchmarks
cargo bench
```

## Code Style

### Rust Style Guide

We follow the [Rust Style Guide](https://doc.rust-lang.org/1.0.0/style/README.html) with these additions:

- **Line length**: 100 characters max
- **Imports**: Group by std, external crates, internal modules
- **Comments**: Use `///` for public API docs, `//` for inline comments
- **Error handling**: Use `Result` and `anyhow` for errors
- **Naming**:
  - `snake_case` for functions, variables, modules
  - `CamelCase` for types, traits, enums
  - `SCREAMING_SNAKE_CASE` for constants

### Formatting

Always format code before committing:

```bash
# Format code
cargo fmt

# Check formatting
cargo fmt -- --check
```

### Linting

Run clippy to catch common mistakes:

```bash
# Run clippy
cargo clippy -- -D warnings

# Fix automatically when possible
cargo clippy --fix
```

## Testing

### Writing Tests

- **Unit tests**: Place in same file as code with `#[cfg(test)]`
- **Integration tests**: Place in `tests/` directory
- **Benchmarks**: Place in `benches/` directory

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_something() {
        let result = some_function();
        assert_eq!(result, expected);
    }

    #[tokio::test]
    async fn test_async_function() {
        let result = async_function().await;
        assert!(result.is_ok());
    }
}
```

### Running Tests

```bash
# Run all tests
cargo test

# Run specific test
cargo test test_name

# Run with output
cargo test -- --nocapture

# Run ignored tests
cargo test -- --ignored

# Generate coverage
cargo tarpaulin --out Html
```

### Test Requirements

- All new features must have tests
- Aim for 80%+ code coverage
- Test edge cases and error conditions
- Use property-based testing (proptest) for complex logic

## Performance

### Benchmarking

Add benchmarks for performance-critical code:

```rust
use criterion::{black_box, criterion_group, criterion_main, Criterion};

fn bench_my_function(c: &mut Criterion) {
    c.bench_function("my_function", |b| {
        b.iter(|| my_function(black_box(input)));
    });
}

criterion_group!(benches, bench_my_function);
criterion_main!(benches);
```

Run benchmarks:

```bash
# Run all benchmarks
cargo bench

# Run specific benchmark
cargo bench bench_name

# View results
open target/criterion/report/index.html
```

### Performance Targets

- Query latency: <1ms p95
- Startup time: <100ms
- Memory usage: <100MB
- Binary size: <10MB

## Pull Request Process

### Before Submitting

1. **Create an issue** - Discuss your changes first
2. **Create a branch** - Use descriptive names: `feature/add-xyz`, `fix/issue-123`
3. **Write code** - Follow style guide, add tests
4. **Run checks** - Format, lint, test
5. **Update docs** - README, inline docs, CHANGELOG

```bash
# Run all checks
make check

# Or manually
cargo fmt -- --check
cargo clippy -- -D warnings
cargo test
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): brief description

Longer description if needed.

Fixes #123
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `perf`: Performance improvement
- `refactor`: Code refactoring
- `test`: Add/update tests
- `docs`: Documentation changes
- `chore`: Maintenance tasks

**Examples:**

```
feat(db): add full-text search support for agent descriptions

Implements FTS using DuckDB's built-in capabilities. Improves
query performance by 3x for context-based searches.

Fixes #42
```

```
fix(cache): prevent cache stampede on expired entries

Added mutex to prevent multiple threads from fetching the same
expired entry simultaneously.
```

### Pull Request Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Benchmarks run (if performance-related)

## Checklist
- [ ] Code formatted (`cargo fmt`)
- [ ] Linter passing (`cargo clippy`)
- [ ] Tests passing (`cargo test`)
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
```

## Code Review

### For Contributors

- Respond to feedback promptly
- Make requested changes in new commits (don't force-push)
- Mark conversations as resolved when addressed
- Be open to suggestions

### For Reviewers

- Review within 48 hours
- Focus on logic, not style (automated checks handle style)
- Be constructive and respectful
- Approve when ready, request changes if needed

## Architecture Guidelines

### Module Organization

```
src/
├── main.rs          # Entry point, CLI, stdio loop
├── mcp.rs           # JSON-RPC protocol, request handlers
├── db.rs            # DuckDB database, schema, queries
├── loader.rs        # YAML parsing, agent loading
├── cache.rs         # LRU cache with TTL
└── queries.rs       # SQL query builders
```

### Design Principles

1. **Separation of Concerns** - Each module has a single responsibility
2. **Type Safety** - Use strong types, avoid `unwrap()` in production code
3. **Error Handling** - Return `Result`, use `?` operator, wrap errors with context
4. **Performance** - Profile before optimizing, use benchmarks
5. **Testability** - Write testable code, use dependency injection

### Adding New Features

1. **Design** - Document design in issue or RFC
2. **Implement** - Add code with tests
3. **Benchmark** - Measure performance impact
4. **Document** - Update README and inline docs
5. **Review** - Submit PR for review

## Common Tasks

### Adding a New Query Pattern

1. Add method to `queries.rs` `QueryBuilder`
2. Add handler in `mcp.rs` `McpHandler`
3. Add tests in both files
4. Add benchmark in `benches/query_benchmark.rs`
5. Update README with example

### Adding a New MCP Method

1. Add method to `mcp.rs` `McpHandler::handle_request()`
2. Add request/response types
3. Add tests
4. Update protocol documentation

### Optimizing Performance

1. Profile with `cargo flamegraph` or `valgrind`
2. Identify bottleneck
3. Add benchmark for specific case
4. Implement optimization
5. Verify improvement with benchmark
6. Ensure tests still pass

## Release Process

Releases are automated via GitHub Actions:

1. Update version in `Cargo.toml`
2. Update `CHANGELOG.md`
3. Commit: `git commit -m "chore: release v1.2.0"`
4. Tag: `git tag -a v1.2.0 -m "Release v1.2.0"`
5. Push: `git push origin v1.2.0`
6. GitHub Actions builds and publishes binaries

## Getting Help

- **Issues**: https://github.com/seth-schultz/orchestr8/issues
- **Discussions**: https://github.com/seth-schultz/orchestr8/discussions
- **Email**: orchestr8@sethschultz.com

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
