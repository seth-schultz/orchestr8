.PHONY: build test clean install run dev fmt lint

# Build release binary
build:
	cargo build --release

# Run tests
test:
	cargo test

# Clean build artifacts
clean:
	cargo clean
	rm -f *.duckdb *.duckdb.wal

# Install binary to system
install: build
	cp target/release/orchestr8-async-server ~/.local/bin/

# Run in MCP mode
run:
	cargo run

# Run in API mode
run-api:
	ORCHESTR8_MODE=api cargo run

# Run in development mode with auto-reload
dev:
	cargo watch -x run

# Format code
fmt:
	cargo fmt

# Run linter
lint:
	cargo clippy -- -D warnings

# Run benchmarks
bench:
	cargo bench

# Generate documentation
docs:
	cargo doc --open

# Build Docker image
docker-build:
	docker build -t orchestr8-async .

# Run Docker container
docker-run:
	docker run -p 3000:3000 -e ORCHESTR8_MODE=api orchestr8-async
