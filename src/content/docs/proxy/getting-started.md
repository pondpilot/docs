---
title: Getting Started
description: Install PondPilot Proxy and run your first cross-database query.
sidebar:
  order: 1
---

Get up and running with PondPilot Proxy in a few steps. This guide covers installation, basic configuration, and your first cross-database query.

## Prerequisites

- Docker (recommended) or Go 1.24+ for building from source
- Access to at least one database (PostgreSQL, MySQL, or SQLite)

## Installation

### Option 1: Docker (Recommended)

Pull and run the official Docker image:

```bash
docker run -p 8080:8080 \
  -e API_KEY="your-secret-key" \
  -e ENCRYPTION_KEY="your-32-byte-encryption-key-here!!" \
  ghcr.io/pondpilot/proxy:latest
```

### Option 2: Pre-built Binaries

Download the latest release for your platform:

```bash
# Linux (amd64)
curl -L https://github.com/pondpilot/proxy/releases/latest/download/pondpilot-proxy-linux-amd64 -o pondpilot-proxy
chmod +x pondpilot-proxy

# macOS (Apple Silicon)
curl -L https://github.com/pondpilot/proxy/releases/latest/download/pondpilot-proxy-darwin-arm64 -o pondpilot-proxy
chmod +x pondpilot-proxy

# Run
API_KEY="your-key" ENCRYPTION_KEY="your-encryption-key" ./pondpilot-proxy
```

### Option 3: Build from Source

Requires Go 1.24 or later:

```bash
git clone https://github.com/pondpilot/proxy.git
cd proxy
go build -o pondpilot-proxy cmd/server/main.go
./pondpilot-proxy
```

## Required Environment Variables

Two environment variables are required for all installations:

| Variable | Description |
|----------|-------------|
| `API_KEY` | Secret key for API authentication. Clients send this in the `X-API-Key` header. |
| `ENCRYPTION_KEY` | 32-byte key for encrypting connection strings. Must be exactly 32 characters. |

:::caution
Keep these keys secure. Never commit them to version control or expose them in logs.
:::

## Verify Installation

Check that the server is running:

```bash
curl http://localhost:8080/health
```

You should see:

```json
{"status":"healthy"}
```

## Your First Query

### Step 1: Create a DuckDB Instance

PondPilot Proxy manages DuckDB instances for you. Create one:

```bash
INSTANCE_ID=$(curl -s -X POST http://localhost:8080/v1/instances \
  -H "X-API-Key: your-secret-key" \
  -H "Content-Type: application/json" \
  -d '{}' | jq -r '.id')

echo "Instance ID: $INSTANCE_ID"
```

### Step 2: Attach a Database

Attach your first external database. This example uses PostgreSQL:

```bash
curl -X POST http://localhost:8080/v1/instances/$INSTANCE_ID/databases \
  -H "X-API-Key: your-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "postgres",
    "alias": "mydb",
    "connectionString": "postgresql://user:pass@localhost:5432/mydb"
  }'
```

Connection string formats:
- **PostgreSQL**: `postgresql://user:pass@host:port/database`
- **MySQL**: `mysql://user:pass@host:port/database`
- **SQLite**: `/path/to/database.db`

### Step 3: Run a Query

Query your attached database:

```bash
curl -X POST http://localhost:8080/v1/instances/$INSTANCE_ID/query \
  -H "X-API-Key: your-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT * FROM mydb.public.users LIMIT 5"
  }'
```

Notice the naming convention: `{alias}.{schema}.{table}` for PostgreSQL, or `{alias}.{table}` for MySQL and SQLite.

## Pre-Attaching Databases with Config

For production use, configure databases in a YAML file so they're attached automatically on startup:

```yaml
# config.yaml
server:
  port: 8080
  host: "0.0.0.0"

duckdb:
  settings:
    threads: 4
    memory_limit: "2GB"
  attached_databases:
    - alias: "analytics"
      type: "postgres"
      connection_string: "${POSTGRES_URL}"
    - alias: "customers"
      type: "mysql"
      connection_string: "${MYSQL_URL}"

security:
  authentication:
    type: "api-key"
```

Run with the config file:

```bash
docker run -p 8080:8080 \
  -v $(pwd)/config.yaml:/config.yaml \
  -e CONFIG_FILE=/config.yaml \
  -e API_KEY="your-secret-key" \
  -e ENCRYPTION_KEY="your-32-byte-encryption-key-here!!" \
  -e POSTGRES_URL="postgresql://user:pass@host:5432/db" \
  -e MYSQL_URL="mysql://user:pass@host:3306/db" \
  ghcr.io/pondpilot/proxy:latest
```

## Next Steps

- [Configuration Reference](/proxy/configuration/) - All configuration options
- [Cross-Database Queries](/proxy/cross-database-queries/) - JOINs across databases
- [Deployment](/proxy/deployment/) - Production setup with Docker Compose
