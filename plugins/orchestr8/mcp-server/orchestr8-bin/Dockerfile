# Multi-stage build for minimal image size
FROM rust:1.75-slim as builder

WORKDIR /build

# Install dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy manifests
COPY Cargo.toml Cargo.lock ./

# Build dependencies (cached layer)
RUN mkdir src && \
    echo "fn main() {}" > src/main.rs && \
    cargo build --release && \
    rm -rf src

# Copy source code
COPY src ./src

# Build application
RUN cargo build --release --locked

# Runtime stage
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m -u 1000 orchestr8

# Copy binary from builder
COPY --from=builder /build/target/release/orchestr8-bin /usr/local/bin/orchestr8-bin

# Set ownership
RUN chown orchestr8:orchestr8 /usr/local/bin/orchestr8-bin

# Switch to non-root user
USER orchestr8
WORKDIR /home/orchestr8

# Create data directory
RUN mkdir -p .orchestr8/data

# Expose no ports (stdio-based)

# Set environment
ENV RUST_LOG=info
ENV ORCHESTR8_LOG_LEVEL=info

# Health check (using echo to test stdio)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD echo '{"jsonrpc":"2.0","method":"health","id":1}' | orchestr8-bin --root /data || exit 1

# Entry point
ENTRYPOINT ["orchestr8-bin"]

# Default args
CMD ["--root", "/data", "--data-dir", ".orchestr8/data"]
