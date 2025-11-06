.PHONY: help build test bench clean install run fmt lint release docker

help: ## Show this help message
	@echo "Orchestr8 MCP Server (Rust) - Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Build debug binary
	cargo build

release: ## Build optimized release binary
	cargo build --release --locked
	strip target/release/orchestr8-bin

test: ## Run all tests
	cargo test

test-verbose: ## Run tests with output
	cargo test -- --nocapture

bench: ## Run benchmarks
	cargo bench

clean: ## Clean build artifacts
	cargo clean
	rm -rf data/*.duckdb logs/*.log

fmt: ## Format code
	cargo fmt

fmt-check: ## Check code formatting
	cargo fmt -- --check

lint: ## Run clippy linter
	cargo clippy --all-targets --all-features -- -D warnings

install: release ## Install binary to /usr/local/bin
	sudo cp target/release/orchestr8-bin /usr/local/bin/
	@echo "Installed to /usr/local/bin/orchestr8-bin"

run: ## Run server (debug build)
	cargo run

run-release: release ## Run server (release build)
	./target/release/orchestr8-bin

docker-build: ## Build Docker image
	docker build -t orchestr8-bin:latest .

docker-run: ## Run Docker container
	docker run -i --rm -v $(PWD)/../../../:/data orchestr8-bin:latest --root /data

coverage: ## Generate test coverage report
	cargo tarpaulin --out Html --output-dir coverage
	@echo "Coverage report: coverage/index.html"

check: fmt-check lint test ## Run all checks (CI)

all: fmt lint test release ## Build everything

# Development helpers
dev: ## Run in development mode with auto-reload
	cargo watch -x run

demo: ## Run demo query
	@echo '{"jsonrpc":"2.0","method":"initialize","id":1}' | cargo run --release
	@sleep 1
	@echo '{"jsonrpc":"2.0","method":"agents/query","params":{"context":"React"},"id":2}' | cargo run --release

benchmark-quick: ## Quick benchmark (fewer samples)
	cargo bench --bench query_benchmark -- --quick

# Platform-specific builds
build-linux: ## Build for Linux x86_64
	cargo build --release --target x86_64-unknown-linux-gnu

build-macos: ## Build for macOS (current architecture)
	cargo build --release

build-windows: ## Build for Windows x86_64
	cargo build --release --target x86_64-pc-windows-msvc

# Cross-compilation (requires cross)
cross-linux-arm: ## Cross-compile for Linux ARM64
	cross build --release --target aarch64-unknown-linux-gnu

cross-macos-arm: ## Cross-compile for macOS ARM64
	cargo build --release --target aarch64-apple-darwin

size: release ## Show binary size
	@ls -lh target/release/orchestr8-bin | awk '{print "Binary size:", $$5}'

profile: ## Profile release build
	cargo build --release
	valgrind --tool=callgrind --callgrind-out-file=callgrind.out target/release/orchestr8-bin &
	sleep 5
	killall orchestr8-bin
	kcachegrind callgrind.out
