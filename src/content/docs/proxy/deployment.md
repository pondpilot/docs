---
title: Deployment
description: Production deployment with Docker Compose, health checks, rate limiting, and audit logging.
sidebar:
  order: 4
---

This guide covers deploying PondPilot Proxy in production environments with Docker, health monitoring, and security best practices.

## Docker Compose Deployment

A production-ready Docker Compose setup:

```yaml
version: '3.8'
services:
  pondpilot-proxy:
    image: ghcr.io/pondpilot/proxy:latest
    ports:
      - "8080:8080"
    environment:
      - CONFIG_FILE=/config/config.yaml
      - API_KEY=${API_KEY}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
      - POSTGRES_URL=${POSTGRES_URL}
      - MYSQL_URL=${MYSQL_URL}
    volumes:
      - ./config.yaml:/config/config.yaml:ro
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
    deploy:
      resources:
        limits:
          memory: 4G
        reservations:
          memory: 1G
```

Create a `.env` file for secrets:

```bash
API_KEY=your-production-api-key
ENCRYPTION_KEY=your-32-byte-production-key!!
POSTGRES_URL=postgresql://user:pass@postgres-host:5432/db
MYSQL_URL=mysql://user:pass@mysql-host:3306/db
```

Start the service:

```bash
docker-compose up -d
```

## Production Configuration

A complete production configuration file:

```yaml
# config.yaml
server:
  host: "0.0.0.0"
  port: 8080
  read_timeout: 30s
  write_timeout: 30s
  shutdown_timeout: 15s

duckdb:
  max_instances: 20
  settings:
    threads: 8
    memory_limit: "4GB"
  extensions:
    - arrow
    - postgres
    - mysql
  connection_pool:
    min_connections: 5
    max_connections: 20
    idle_timeout: 10m
    acquire_timeout: 30s
    validate_on_acquire: true
    validation_interval: 2m
    max_connection_age: 1h
  attached_databases:
    - alias: "analytics"
      type: "postgres"
      connection_string: "${POSTGRES_URL}"
    - alias: "crm"
      type: "mysql"
      connection_string: "${MYSQL_URL}"

security:
  authentication:
    type: "api-key"
    api_key_header: "X-API-Key"
  encryption:
    algorithm: "AES-256-GCM"
    key_derivation: "pbkdf2"
  rate_limit:
    requests_per_minute: 100
    burst_size: 20
  read_only: true

environment: "production"
```

## Health Checks

PondPilot Proxy exposes health check endpoints for container orchestration:

### Liveness Probe

Check if the service is running:

```bash
curl http://localhost:8080/health
```

Response:

```json
{"status": "healthy"}
```

### Readiness Probe

Check if the service is ready to accept requests:

```bash
curl http://localhost:8080/ready
```

Response when ready:

```json
{"status": "ready", "databases": 2}
```

Response when not ready (database connection issues):

```json
{"status": "not_ready", "error": "database connection failed"}
```

### Kubernetes Configuration

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pondpilot-proxy
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: pondpilot-proxy
          image: ghcr.io/pondpilot/proxy:latest
          ports:
            - containerPort: 8080
          livenessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 10
            periodSeconds: 30
          readinessProbe:
            httpGet:
              path: /ready
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 10
          resources:
            limits:
              memory: "4Gi"
              cpu: "2"
            requests:
              memory: "1Gi"
              cpu: "500m"
```

## Rate Limiting

Protect your proxy from abuse and ensure fair resource usage:

```yaml
security:
  rate_limit:
    requests_per_minute: 100   # Base rate per client
    burst_size: 20             # Allowed burst above limit
```

Rate limiting is applied per client IP address. When a client exceeds the limit:

- HTTP 429 (Too Many Requests) is returned
- A `Retry-After` header indicates when to retry
- Requests are logged for monitoring

### Rate Limit Recommendations

| Use Case | Requests/Min | Burst |
|----------|--------------|-------|
| Internal analytics | 200 | 50 |
| External API | 60 | 10 |
| Public access | 30 | 5 |

## Audit Logging

PondPilot Proxy logs all API requests for security auditing:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "info",
  "message": "query executed",
  "request_id": "abc123",
  "client_ip": "192.168.1.100",
  "instance_id": "inst_xyz",
  "query_type": "SELECT",
  "duration_ms": 45,
  "rows_returned": 150
}
```

Logs include:
- Request ID for tracing
- Client IP address
- Instance and database accessed
- Query type (SELECT, etc.)
- Execution duration
- Result size

:::note
Query text is not logged by default to protect sensitive data in WHERE clauses.
:::

### Log Aggregation

Ship logs to your preferred log aggregator:

```yaml
# docker-compose.yaml with logging
services:
  pondpilot-proxy:
    image: ghcr.io/pondpilot/proxy:latest
    logging:
      driver: "json-file"
      options:
        max-size: "100m"
        max-file: "5"
```

For production, consider using a logging driver for your observability stack (Loki, Elasticsearch, etc.).

## TLS/HTTPS

PondPilot Proxy serves HTTP. For HTTPS, deploy behind a reverse proxy:

### Nginx Configuration

```nginx
server {
    listen 443 ssl;
    server_name api.example.com;

    ssl_certificate /etc/ssl/certs/api.example.com.crt;
    ssl_certificate_key /etc/ssl/private/api.example.com.key;

    location / {
        proxy_pass http://pondpilot-proxy:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Caddy Configuration

```
api.example.com {
    reverse_proxy pondpilot-proxy:8080
}
```

## Scaling

### Horizontal Scaling

PondPilot Proxy is stateless and can be scaled horizontally:

```yaml
# docker-compose.yaml
services:
  pondpilot-proxy:
    image: ghcr.io/pondpilot/proxy:latest
    deploy:
      replicas: 3
```

With a load balancer:

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - pondpilot-proxy

  pondpilot-proxy:
    image: ghcr.io/pondpilot/proxy:latest
    deploy:
      replicas: 3
```

### Resource Sizing

| Workload | Memory | CPU | Max Instances |
|----------|--------|-----|---------------|
| Light (< 10 concurrent) | 2GB | 2 cores | 10 |
| Medium (10-50 concurrent) | 4GB | 4 cores | 20 |
| Heavy (50+ concurrent) | 8GB+ | 8+ cores | 50+ |

Adjust `duckdb.settings.memory_limit` based on available memory and expected concurrent instances.

## Security Best Practices

### Network Security

- Deploy in a private network
- Restrict database access to proxy servers only
- Use TLS for all connections

### Secrets Management

- Never commit secrets to version control
- Use environment variables or secrets managers
- Rotate API keys and encryption keys regularly

### Database Access

- Use read-only database users
- Grant minimal permissions (SELECT only)
- Use separate credentials per environment

### Monitoring

- Alert on authentication failures
- Monitor rate limit triggers
- Track query patterns for anomalies

## Monitoring with Metrics

Access server metrics at the metrics endpoint:

```bash
curl http://localhost:8080/api/v1/metrics
```

Metrics include:
- Request counts and latencies
- Active instances and connections
- Error rates
- Memory usage

Integrate with Prometheus by scraping the metrics endpoint.

## Backup and Recovery

PondPilot Proxy is stateless—it doesn't store data locally. Recovery involves:

1. Redeploying the container
2. Ensuring source databases are accessible
3. Verifying configuration

Pre-attached databases are reconnected automatically on startup.
