FROM rust:1.75 as builder

WORKDIR /app

# Copy manifests
COPY Cargo.toml ./

# Copy source code
COPY src ./src

# Build release binary
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy binary from builder
COPY --from=builder /app/target/release/orchestr8-async-server /usr/local/bin/

# Create data directory
RUN mkdir -p /data

# Set environment variables
ENV ORCHESTR8_DB_PATH=/data/orchestr8-async.duckdb
ENV ORCHESTR8_MODE=api
ENV ORCHESTR8_HOST=0.0.0.0
ENV ORCHESTR8_PORT=3000
ENV ORCHESTR8_WORKERS=4

# Expose API port
EXPOSE 3000

# Run the server
CMD ["orchestr8-async-server"]
