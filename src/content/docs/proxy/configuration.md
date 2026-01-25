---
title: Configuration
description: YAML configuration, environment variables, and authentication options for PondPilot Proxy.
sidebar:
  order: 2
---

PondPilot Proxy is configured through YAML files and environment variables. This reference covers all available options.

## Configuration File

Create a `config.yaml` file and point to it with the `CONFIG_FILE` environment variable:

```bash
export CONFIG_FILE=/path/to/config.yaml
./pondpilot-proxy
```

## Complete Configuration Reference

```yaml
# Server configuration
server:
  host: "0.0.0.0"        # Listen address
  port: 8080             # Listen port
  read_timeout: 30s      # HTTP read timeout
  write_timeout: 30s     # HTTP write timeout
  shutdown_timeout: 10s  # Graceful shutdown timeout

# DuckDB engine configuration
duckdb:
  max_instances: 10      # Maximum concurrent DuckDB instances
  settings:
    threads: 4           # DuckDB threads per instance
    memory_limit: "2GB"  # Memory limit per instance
  extensions:            # DuckDB extensions to load
    - arrow
    - postgres
    - mysql
  connection_pool:       # Connection pool settings
    min_connections: 2
    max_connections: 10
    idle_timeout: 5m
    acquire_timeout: 30s
    validate_on_acquire: true
    validation_interval: 1m
    max_connection_age: 30m
  attached_databases:    # Pre-attached databases (see below)
    - alias: "mydb"
      type: "postgres"
      connection_string: "postgresql://user:pass@host:5432/db"

# Security configuration
security:
  authentication:
    type: "api-key"           # Options: "api-key", "jwt", "none"
    api_key_header: "X-API-Key"
  encryption:
    algorithm: "AES-256-GCM"
    key_derivation: "pbkdf2"  # Options: "pbkdf2", "scrypt"
  rate_limit:
    requests_per_minute: 60
    burst_size: 10
  read_only: false            # Set true to disable write operations

# Environment
environment: "production"     # Options: "development", "staging", "production"
```

## Environment Variables

Environment variables override configuration file values:

| Variable | Required | Description |
|----------|----------|-------------|
| `CONFIG_FILE` | No | Path to YAML configuration file |
| `API_KEY` | Yes* | API key for authentication (if using api-key auth) |
| `ENCRYPTION_KEY` | Yes | 32-byte key for encrypting connection strings |
| `JWT_SECRET` | Yes* | JWT secret (if using JWT auth) |

*Required depending on authentication type.

### Environment Variable Substitution

Connection strings support environment variable substitution:

```yaml
attached_databases:
  - alias: "production"
    type: "postgres"
    connection_string: "${DATABASE_URL}"  # Reads from DATABASE_URL env var
```

## Pre-Attached Databases

Configure databases to attach automatically on startup. A default DuckDB instance is created with these databases pre-attached.

```yaml
duckdb:
  attached_databases:
    # PostgreSQL
    - alias: "analytics"
      type: "postgres"
      connection_string: "postgresql://user:pass@localhost:5432/analytics"

    # MySQL
    - alias: "customers"
      type: "mysql"
      connection_string: "mysql://user:pass@localhost:3306/customers"

    # SQLite
    - alias: "local_data"
      type: "sqlite"
      connection_string: "/path/to/database.db"
```

### Supported Database Types

| Type Value | Database |
|------------|----------|
| `postgres` or `postgresql` | PostgreSQL and compatible databases |
| `mysql` | MySQL and MariaDB |
| `sqlite` | SQLite files |

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
./relative/path/to/database.db
```

## Authentication

### API Key Authentication

The default and simplest authentication method:

```yaml
security:
  authentication:
    type: "api-key"
    api_key_header: "X-API-Key"
```

Clients include the key in requests:

```bash
curl -H "X-API-Key: your-secret-key" http://localhost:8080/v1/instances
```

Set the API key via environment variable:

```bash
export API_KEY="your-secret-key"
```

### JWT Authentication

For integration with existing auth systems:

```yaml
security:
  authentication:
    type: "jwt"
```

Clients include a JWT token:

```bash
curl -H "Authorization: Bearer eyJhbGciOi..." http://localhost:8080/v1/instances
```

Set the JWT secret:

```bash
export JWT_SECRET="your-jwt-secret"
```

### No Authentication

For development or internal networks only:

```yaml
security:
  authentication:
    type: "none"
```

:::danger
Never disable authentication in production.
:::

## Rate Limiting

Protect your proxy from abuse:

```yaml
security:
  rate_limit:
    requests_per_minute: 60  # Requests allowed per minute per client
    burst_size: 10           # Allowed burst above the limit
```

Rate limiting is applied per client IP address.

## Connection Pooling

Optimize database connection reuse:

```yaml
duckdb:
  connection_pool:
    min_connections: 2        # Minimum pool size
    max_connections: 10       # Maximum pool size
    idle_timeout: 5m          # Close idle connections after this time
    acquire_timeout: 30s      # Timeout waiting for a connection
    validate_on_acquire: true # Validate connections before use
    validation_interval: 1m   # How often to validate idle connections
    max_connection_age: 30m   # Maximum connection lifetime
```

## DuckDB Settings

Configure the DuckDB engine:

```yaml
duckdb:
  max_instances: 10       # Maximum concurrent instances
  settings:
    threads: 4            # Threads per instance
    memory_limit: "2GB"   # Memory per instance
  extensions:
    - arrow              # Apache Arrow support
    - postgres           # PostgreSQL connector
    - mysql              # MySQL connector
```

### Memory Limit

The `memory_limit` setting controls maximum memory per DuckDB instance. Use units like:
- `512MB`
- `2GB`
- `4GB`

Set based on your server's available RAM and expected concurrent instances.

## Read-Only Mode

Disable all write operations:

```yaml
security:
  read_only: true
```

When enabled, only SELECT queries are allowed. INSERT, UPDATE, DELETE, and DDL operations return an error.

## Configuration Validation

Invalid configurations are rejected on startup with clear error messages:

- Duplicate database aliases
- Invalid database types
- Missing required fields
- Invalid connection string formats

Check logs for validation errors if the proxy fails to start.
