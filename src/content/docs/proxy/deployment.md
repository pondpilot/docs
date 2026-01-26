---
title: Deployment
description: Deploy PondPilot Proxy with Docker Compose, production configuration, and scaling considerations.
sidebar:
  order: 4
---

This guide covers deploying PondPilot Proxy in production environments.

## Architecture Requirements

PondPilot Proxy requires:

- **Docker** — To run user containers (SQLFlite instances)
- **Docker socket access** — The proxy manages containers via Docker API
- **Two ports** — HTTP (8080) and gRPC (8081)
- **Network connectivity** — To reach configured databases

## Docker Compose Deployment

### Basic Setup

```yaml
services:
  proxy:
    image: ghcr.io/pondpilot/proxy:latest
    ports:
      - "8080:8080"  # HTTP
      - "8081:8081"  # gRPC (Flight SQL)
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - CONTAINER_NETWORK=pondpilot
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./config.yaml:/config.yaml
    networks:
      - pondpilot
    restart: unless-stopped

networks:
  pondpilot:
    driver: bridge
```

### With Local Databases (Development)

```yaml
services:
  proxy:
    image: ghcr.io/pondpilot/proxy:latest
    ports:
      - "8080:8080"
      - "8081:8081"
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - CONTAINER_NETWORK=pondpilot
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/analytics
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./config.yaml:/config.yaml
    networks:
      - pondpilot
    depends_on:
      - postgres

  postgres:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: analytics
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - pondpilot

networks:
  pondpilot:
    driver: bridge

volumes:
  postgres_data:
```

## Environment Variables

### Required

```bash
# JWT signing secret (minimum 32 characters)
JWT_SECRET="your-secret-key-at-least-32-characters-long"
```

### Optional

```bash
# Server ports
PORT=8080
GRPC_PORT=8081

# Container settings
CONTAINER_IMAGE=ghcr.io/pondpilot/sqlflite:latest
CONTAINER_IDLE_TIMEOUT=300000  # 5 minutes in ms
CONTAINER_MEMORY_LIMIT=512m
CONTAINER_CPU_LIMIT=0.5
CONTAINER_NETWORK=pondpilot

# AI integration
CLAUDE_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
```

## TLS Configuration

### Behind a Reverse Proxy (Recommended)

Use nginx, Traefik, or Caddy for TLS termination:

**nginx example:**

```nginx
server {
    listen 443 ssl http2;
    server_name proxy.example.com;

    ssl_certificate /etc/ssl/certs/proxy.crt;
    ssl_certificate_key /etc/ssl/private/proxy.key;

    # HTTP endpoints
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# gRPC requires separate server block
server {
    listen 443 ssl http2;
    server_name grpc.proxy.example.com;

    ssl_certificate /etc/ssl/certs/proxy.crt;
    ssl_certificate_key /etc/ssl/private/proxy.key;

    location / {
        grpc_pass grpc://localhost:8081;
    }
}
```

### With Caddy (Automatic TLS)

```
proxy.example.com {
    reverse_proxy localhost:8080
}

grpc.proxy.example.com {
    reverse_proxy localhost:8081 {
        transport http {
            versions h2c
        }
    }
}
```

## Health Checks

Configure health checks for orchestrators:

```yaml
services:
  proxy:
    image: ghcr.io/pondpilot/proxy:latest
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
```

### Available Endpoints

| Endpoint | Purpose | Response |
|----------|---------|----------|
| `GET /health` | Basic health | `{"status":"healthy"}` |
| `GET /ready` | Readiness probe | `{"ready":true}` |
| `GET /health/detailed` | Component status | Detailed JSON |

## Resource Planning

### Memory Requirements

| Component | Memory |
|-----------|--------|
| Proxy service | ~100MB |
| Per user container | 512MB (configurable) |
| 10 concurrent users | ~5.1GB total |
| 50 concurrent users | ~25.5GB total |

### CPU Requirements

| Load | Recommended |
|------|-------------|
| Light (< 10 users) | 2 cores |
| Medium (10-50 users) | 4 cores |
| Heavy (50+ users) | 8+ cores |

### Container Limits

Configure based on query complexity:

```yaml
containers:
  memory_limit: "512m"   # Light queries
  memory_limit: "1g"     # Medium queries
  memory_limit: "2g"     # Heavy analytics
  cpu_limit: 0.5         # Light
  cpu_limit: 1.0         # Medium
  cpu_limit: 2.0         # Heavy
```

## Scaling Considerations

### Single Host Limits

The current architecture runs containers on a single Docker host:

- Limited by host resources
- Maximum ~100 concurrent containers (configurable)
- Suitable for small-to-medium deployments

### Horizontal Scaling (Future)

The `Orchestrator` interface supports alternative backends:

- Kubernetes pods
- Fly.io machines
- AWS Fargate tasks

Contact us for enterprise scaling solutions.

## Monitoring

### Logs

View proxy logs:

```bash
docker compose logs -f proxy
```

Key log patterns:

```
level=info msg="Container spawned" user_id=abc123 container_id=def456
level=info msg="Container stopped" user_id=abc123 reason=idle_timeout
level=warn msg="Rate limit exceeded" user_id=abc123
level=error msg="Container spawn failed" user_id=abc123 error="..."
```

### Metrics

The proxy exposes basic metrics at `/health/detailed`:

```json
{
  "status": "healthy",
  "containers": {
    "active": 5,
    "total_spawned": 127,
    "total_stopped": 122
  },
  "uptime_seconds": 86400
}
```

## Security Hardening

### Docker Socket

The proxy requires Docker socket access. Mitigate risks:

1. **Run proxy as non-root** where possible
2. **Use Docker socket proxy** like [Tecnativa/docker-socket-proxy](https://github.com/Tecnativa/docker-socket-proxy)
3. **Limit container capabilities** (already enforced by proxy)

### Network Isolation

User containers should only access:
- Configured databases
- The proxy (for gRPC communication)

```yaml
networks:
  pondpilot:
    driver: bridge
    internal: false  # Needs external access for databases
```

For stricter isolation, use network policies or separate networks per security tier.

### Secrets Management

Never commit secrets. Use:
- Environment variables from `.env` files
- Docker secrets
- Vault or similar secret management

```yaml
services:
  proxy:
    environment:
      - JWT_SECRET=${JWT_SECRET}  # From .env
    secrets:
      - jwt_secret  # Or Docker secrets

secrets:
  jwt_secret:
    external: true
```

## Backup and Recovery

### Stateless Design

The proxy is stateless:
- No persistent data in the proxy itself
- User containers are ephemeral
- Database connections are configured via config

### What to Back Up

1. **config.yaml** — Your configuration
2. **Environment variables** — Secrets and connection strings
3. **Source databases** — Your actual data

### Recovery

1. Deploy fresh proxy instance
2. Apply configuration
3. Users reconnect automatically

## Troubleshooting

### Container spawn failures

```bash
# Check Docker socket
ls -la /var/run/docker.sock

# Check proxy logs
docker compose logs proxy | grep -i "spawn"

# Check Docker daemon
docker info
```

### gRPC connection issues

```bash
# Test gRPC port
nc -zv localhost 8081

# Check if gRPC server started
docker compose logs proxy | grep -i "grpc"
```

### Database connection failures

```bash
# Test from host
psql "${DATABASE_URL}"

# Test from container network
docker run --rm --network pondpilot postgres:16 \
  psql "${DATABASE_URL}" -c "SELECT 1"
```

### Memory issues

If containers are being killed:

```bash
# Check container stats
docker stats

# Increase memory limit in config
containers:
  memory_limit: "1g"
```
