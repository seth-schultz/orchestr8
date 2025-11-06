# Changelog

All notable changes to the Orchestr8 MCP Server (Rust) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2024-11-05

### Added
- Initial Rust implementation of Orchestr8 MCP stdio server
- DuckDB in-memory database for ultra-fast agent queries
- LRU cache with configurable TTL for query results
- Three query patterns: context-based, role-based, capability-based
- JSON-RPC 2.0 protocol over stdio
- Cross-platform support (macOS x86_64/ARM64, Linux x86_64/ARM64, Windows x86_64)
- Comprehensive test suite with 80%+ coverage
- Performance benchmarks with Criterion
- GitHub Actions workflow for automated releases
- Docker image support
- CLI with auto-detection of project root
- Health check endpoint with metrics
- Cache statistics and management
- Query pattern learning (foundation for future ML)

### Performance
- Startup time: <100ms (74 agents loaded)
- Query latency: <1ms p95 with caching
- Memory usage: <100MB typical
- Binary size: ~5MB stripped

### Documentation
- Complete README with usage examples
- Contributing guidelines
- Inline code documentation
- Benchmark results
- Architecture diagrams

## [0.1.0] - 2024-11-01

### Added
- Initial project structure
- Basic DuckDB integration
- YAML agent loader
- Stdio protocol loop

[Unreleased]: https://github.com/seth-schultz/orchestr8/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/seth-schultz/orchestr8/releases/tag/v1.0.0
[0.1.0]: https://github.com/seth-schultz/orchestr8/releases/tag/v0.1.0
