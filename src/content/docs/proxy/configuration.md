---
title: Configuration
description: YAML configuration, environment variables, and container settings for PondPilot Proxy.
sidebar:
  order: 2
---

PondPilot Proxy is configured through YAML files and environment variables. Environment variables take precedence over YAML configuration.

## Configuration Precedence

```
Environment Variables (highest priority)
         │
         ▼
    YAML Config File
         │
         ▼
   Default Values (lowest priority)
```

## Complete Configuration Reference

```yaml
# Server configuration
server:
  port: 8080              # HTTP server port
  grpc_port: 8081         # gRPC (Flight SQL) port
  host: "0.0.0.0"         # Listen address

# Container orchestration
containers:
  image: "ghcr.io/pondpilot/sqlflite:latest"  # SQLFlite container image
  idle_timeout: 5m        # Stop containers after this idle period
  memory_limit: "512m"    # Memory limit per container
  cpu_limit: 0.5          # CPU limit per container (0.5 = half a core)
  max_per_host: 100       # Maximum containers per host
  network: "pondpilot"    # Docker network name

# DuckDB configuration
duckdb:
  extensions:             # Extensions to load in containers
    - arrow
    - postgres
    - mysql
  attached_databases:     # Pre-attached databases (see below)
    - alias: "mydb"
      type: "postgres"
      connection_string: "${DATABASE_URL}"

# Security configuration
security:
  rate_limit:
    requests_per_minute: 100   # Rate limit per user
    burst_size: 200            # Burst allowance

# AI integration
ai:
  claude_api_key: "${CLAUDE_API_KEY}"
  openai_api_key: "${OPENAI_API_KEY}"
  default_model: "claude-sonnet-4-20250514"
```

## Environment Variables

#### Required Variables

| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | JWT signing secret (minimum 32 characters) |

### Server Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | HTTP server port | 8080 |
| `GRPC_PORT` | gRPC server port | 8081 |
| `HOST` | Listen address | 0.0.0.0 |

### Container Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `CONTAINER_IMAGE` | SQLFlite container image | ghcr.io/pondpilot/sqlflite:latest |
| `CONTAINER_IDLE_TIMEOUT` | Idle timeout in milliseconds | 300000 (5 min) |
| `CONTAINER_MEMORY_LIMIT` | Memory limit per container | 512m |
| `CONTAINER_CPU_LIMIT` | CPU limit per container | 0.5 |
| `CONTAINER_MAX_PER_HOST` | Maximum containers | 100 |
| `CONTAINER_NETWORK` | Docker network name | bridge |

### AI Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `CLAUDE_API_KEY` | Anthropic API key | — |
| `OPENAI_API_KEY` | OpenAI API key | — |
| `AI_DEFAULT_MODEL` | Default AI model | claude-sonnet-4-20250514 |

## Pre-Attached Databases

Configure databases to attach automatically when user containers start.

```yaml
duckdb:
  attached_databases:
    # PostgreSQL
    - alias: "analytics"
      type: "postgres"
      connection_string: "postgresql://user:pass@host:5432/analytics"

    # MySQL
    - alias: "customers"
      type: "mysql"
      connection_string: "mysql://user:pass@host:3306/customers"

    # SQLite
    - alias: "local"
      type: "sqlite"
      connection_string: "/data/local.db"
```

### Database Types

| Type | Aliases | Notes |
|------|---------|-------|
| `postgres` | `postgresql` | PostgreSQL and compatible databases |
| `mysql` | — | MySQL and MariaDB |
| `sqlite` | — | SQLite files |

### Connection String Formats

**PostgreSQL:**
```
postgresql://user:password@host:port/database
postgresql://user:password@host:port/database?sslmode=require
```

**MySQL:**
```
mysql://user:password@host:port/database
```

**SQLite:**
```
/absolute/path/to/database.db
```

### Environment Variable Substitution

Connection strings support environment variable substitution:

```yaml
attached_databases:
  - alias: "prod"
    type: "postgres"
    connection_string: "${DATABASE_URL}"
```

## JWT Authentication

All requests require JWT authentication. The JWT must include a `sub` claim identifying the user.

### JWT Requirements

| Claim | Required | Description |
|-------|----------|-------------|
| `sub` | Yes | User identifier (used for container isolation) |
| `exp` | Yes | Expiration timestamp |
| `iat` | No | Issued-at timestamp |

### JWT Secret

The `JWT_SECRET` must be at least 32 characters:

```bash
# Generate a secure secret
openssl rand -base64 32
```

### Demo Tokens

For testing, the proxy can issue demo tokens:

```bash
curl -X POST http://localhost:8080/auth/demo-token
```

Demo tokens have:
- Short expiration (1 hour)
- Stricter rate limits
- Restricted features

## Rate Limiting

Configure per-user rate limits:

```yaml
security:
  rate_limit:
    requests_per_minute: 100   # Sustained rate
    burst_size: 200            # Temporary burst allowance
```

Rate limits apply per-user (identified by JWT `sub` claim).

## Container Resource Limits

Control resource usage per container:

```yaml
containers:
  memory_limit: "512m"    # Memory limit
  cpu_limit: 0.5          # CPU cores (0.5 = half core)
```

### Memory Limit Format

- `256m` — 256 megabytes
- `1g` — 1 gigabyte
- `2g` — 2 gigabytes

### CPU Limit

Fractional values allowed:
- `0.5` — Half a CPU core
- `1.0` — One full core
- `2.0` — Two cores

## Container Security

Containers run with hardened security settings:

| Setting | Value | Purpose |
|---------|-------|---------|
| User | UID 1000 | Non-root execution |
| Capabilities | All dropped | Minimal privileges |
| no-new-privileges | Enabled | Prevent privilege escalation |

## Idle Container Management

The proxy automatically manages container lifecycle:

```yaml
containers:
  idle_timeout: 5m        # Stop after 5 minutes idle
  max_per_host: 100       # Maximum concurrent containers
```

### How Idle Reaping Works

1. Background reaper runs every minute
2. Checks each container's last-used timestamp
3. Stops containers idle longer than `idle_timeout`
4. Containers respawn on next request

### Performance Impact

| Scenario | Latency |
|----------|---------|
| Container cached | ~10-50ms |
| Container respawn | ~2-5 seconds |

Set longer idle timeouts for frequently-used systems to avoid respawn latency.

## Health Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /health` | Basic health check |
| `GET /ready` | Readiness probe (for k8s) |
| `GET /health/detailed` | Detailed component status |

## Example Configurations

#### Development

```yaml
server:
  port: 8080
  grpc_port: 8081

containers:
  idle_timeout: 30m       # Longer timeout for dev
  memory_limit: "1g"

duckdb:
  attached_databases:
    - alias: "dev"
      type: "postgres"
      connection_string: "postgresql://postgres:postgres@localhost:5432/dev"
```

### Production

```yaml
server:
  port: 8080
  grpc_port: 8081

containers:
  image: "ghcr.io/pondpilot/sqlflite:v1.2.3"  # Pin version
  idle_timeout: 5m
  memory_limit: "512m"
  cpu_limit: 0.5
  max_per_host: 50

security:
  rate_limit:
    requests_per_minute: 60
    burst_size: 100

duckdb:
  attached_databases:
    - alias: "prod"
      type: "postgres"
      connection_string: "${DATABASE_URL}"
```
