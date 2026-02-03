---
title: Getting Started
description: Deploy PondPilot Proxy and connect to your first database.
sidebar:
  order: 1
---

Get PondPilot Proxy running and execute your first cross-database query. This guide covers deployment with Docker Compose and connecting via Flight SQL.

## Prerequisites

- **Docker** with Docker Compose
- **A database** to connect to (PostgreSQL, MySQL, or SQLite)
- **A Flight SQL client** (PondPilot app, DuckDB with `airport` extension, or any Arrow Flight client)

## Quick Start with Docker Compose

#### 1. Create Configuration Files

Create a `docker-compose.yml`:

```yaml
services:
  proxy:
    image: ghcr.io/pondpilot/proxy:latest
    ports:
      - "8080:8080"  # HTTP (health, AI endpoints)
      - "8081:8081"  # gRPC (Flight SQL)
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - CONTAINER_NETWORK=pondpilot
      - CLAUDE_API_KEY=${CLAUDE_API_KEY}  # Optional: for AI features
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./config.yaml:/config.yaml
    networks:
      - pondpilot

networks:
  pondpilot:
    driver: bridge
```

Create a `config.yaml`:

```yaml
server:
  port: 8080
  grpc_port: 8081
  host: "0.0.0.0"

containers:
  image: "ghcr.io/pondpilot/sqlflite:latest"
  idle_timeout: 5m
  memory_limit: "512m"
  cpu_limit: 0.5

duckdb:
  extensions: [arrow, postgres, mysql]
  attached_databases:
    - alias: "mydb"
      type: "postgres"
      connection_string: "${DATABASE_URL}"
```

### 2. Set Environment Variables

Create a `.env` file:

```bash
# Required: JWT secret (minimum 32 characters)
JWT_SECRET="your-secret-key-at-least-32-characters-long"

# Database connection
DATABASE_URL="postgresql://user:pass@host:5432/database"

# Optional: AI features
CLAUDE_API_KEY="sk-ant-..."
```

### 3. Start the Proxy

```bash
docker compose up -d
```

### 4. Verify Installation

Check health endpoint:

```bash
curl http://localhost:8080/health
```

Expected response:

```json
{"status":"healthy"}
```

Check detailed health:

```bash
curl http://localhost:8080/health/detailed
```

## Authentication

PondPilot Proxy requires JWT authentication. All requests must include a valid JWT token.

### Getting a Demo Token

For testing, request a demo token:

```bash
curl -X POST http://localhost:8080/auth/demo-token
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_at": "2026-01-26T12:00:00Z"
}
```

Demo tokens have restricted rate limits and short expiration times.

### Using JWT Tokens

Include the token in requests:

**HTTP endpoints:**
```bash
curl -H "Authorization: Bearer <token>" http://localhost:8080/ai/chat
```

**Flight SQL (gRPC):**
The token is passed via gRPC metadata with key `authorization`.

## Connecting with Flight SQL

#### Using PondPilot App

PondPilot automatically connects to the proxy when configured with a remote database connection. See [Remote Sources](/pondpilot/data-connections/remote-sources/) for setup.

### Using DuckDB with Airport Extension

Connect from any DuckDB client using the `airport` extension:

```sql
-- Load the airport extension
LOAD airport;

-- Attach the proxy as a remote database
ATTACH 'flight://localhost:8081?token=<your-jwt-token>' AS remote;

-- Query attached databases through the proxy
SELECT * FROM remote.mydb.public.users LIMIT 10;
```

### Using Arrow Flight Clients

Any Arrow Flight SQL client can connect to port 8081. The JWT token should be passed in the `authorization` metadata field.

**Python example:**

```python
from pyarrow import flight

# Connect with authentication
client = flight.connect("grpc://localhost:8081")
options = flight.FlightCallOptions(headers=[
    (b"authorization", b"Bearer <your-jwt-token>")
])

# Execute query
info = client.get_flight_info(
    flight.FlightDescriptor.for_command(b"SELECT * FROM mydb.public.users"),
    options
)
reader = client.do_get(info.endpoints[0].ticket, options)
table = reader.read_all()
```

## Your First Query

Once connected, query your attached databases:

```sql
-- Query a PostgreSQL table through the proxy
SELECT
    customer_name,
    COUNT(*) as order_count,
    SUM(amount) as total_revenue
FROM mydb.public.orders
GROUP BY customer_name
ORDER BY total_revenue DESC
LIMIT 10;
```

The query is executed in your isolated DuckDB container, which connects to the PostgreSQL database you configured.

## Container Lifecycle

Understanding how containers work:

1. **First request** — Container spawns (~2-5 seconds)
2. **Subsequent requests** — Uses cached container (~10-50ms)
3. **Idle timeout** — Container stops after 5 minutes of inactivity
4. **Next request after idle** — Container respawns

Each user (identified by JWT `sub` claim) gets their own isolated container.

## AI Endpoints

The proxy includes AI integration for chat and embeddings:

```bash
# Chat completion (streaming)
curl -X POST http://localhost:8080/ai/chat \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Write a SQL query to find top customers"}],
    "model": "claude-sonnet-4-20250514"
  }'

# Embeddings
curl -X POST http://localhost:8080/ai/embed \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "input": "customer revenue analysis",
    "model": "text-embedding-3-small"
  }'
```

## Troubleshooting

### Container not starting

Check Docker socket permissions:

```bash
ls -la /var/run/docker.sock
```

The proxy needs access to the Docker socket to manage containers.

### Connection refused on port 8081

Ensure the gRPC port is exposed and not blocked by firewall:

```bash
docker compose logs proxy | grep -i grpc
```

### JWT validation failed

Verify your JWT secret matches and token hasn't expired:

```bash
# Decode JWT (without verification) to check claims
echo "<token>" | cut -d'.' -f2 | base64 -d 2>/dev/null | jq
```

## Next Steps

- [Configuration Reference](/proxy/configuration/) — All configuration options
- [Cross-Database Queries](/proxy/cross-database-queries/) — JOIN across databases
- [Deployment](/proxy/deployment/) — Production setup
