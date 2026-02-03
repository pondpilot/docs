---
title: Self-Hosting
description: Deploy your own CORS Proxy with Docker, Cloudflare Workers, or Node.js.
sidebar:
  order: 2
---

For maximum privacy or enterprise requirements, you can run your own CORS Proxy instance. This guide covers deployment options from quick Docker setup to production Cloudflare Workers deployment.

## Deployment Options

| Option | Best For | Effort |
|--------|----------|--------|
| Docker | Quick local/server deployment | Low |
| Docker Compose | Production server deployment | Low |
| Cloudflare Workers | Global edge deployment, serverless | Medium |
| Node.js | Custom integrations | Medium |

## Docker Deployment

### Quick Start

Run the proxy with Docker:

```bash
docker run -p 3000:3000 ghcr.io/pondpilot/cors-proxy
```

The proxy is now available at `http://localhost:3000`.

### With Environment Variables

Configure the proxy with environment variables:

```bash
docker run -p 3000:3000 \
  -e ALLOWED_ORIGINS="https://app.pondpilot.io,http://localhost:5173" \
  -e RATE_LIMIT_REQUESTS=100 \
  -e MAX_FILE_SIZE_MB=1000 \
  ghcr.io/pondpilot/cors-proxy
```

### Docker Compose

For production deployments, use Docker Compose:

```yaml
# docker-compose.yml
services:
  cors-proxy:
    image: ghcr.io/pondpilot/cors-proxy
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - ALLOWED_ORIGINS=https://app.pondpilot.io,https://yourapp.com
      - RATE_LIMIT_REQUESTS=60
      - RATE_LIMIT_WINDOW_MS=60000
      - MAX_FILE_SIZE_MB=500
      - HTTPS_ONLY=true
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

Start with:

```bash
docker compose up -d
```

## Cloudflare Workers Deployment

Cloudflare Workers provides global edge deployment with automatic scaling and HTTPS.

### Prerequisites

- Cloudflare account
- Wrangler CLI installed

### Setup

1. Clone the repository:

```bash
git clone https://github.com/pondpilot/cors-proxy.git
cd cors-proxy/cloudflare-worker
npm install
```

2. Login to Cloudflare:

```bash
npx wrangler login
```

3. Configure `wrangler.toml`:

```toml
name = "cors-proxy"
main = "src/worker.ts"
compatibility_date = "2024-01-01"

[env.production]
vars = {
  ALLOWED_ORIGINS = "https://yourapp.com",
  RATE_LIMIT_REQUESTS = "60",
  MAX_FILE_SIZE_MB = "500"
}
```

4. Deploy:

```bash
# Deploy to production
npm run deploy:production

# Or deploy to workers.dev subdomain
npx wrangler deploy
```

### Custom Domain

To use a custom domain instead of `*.workers.dev`:

1. Add the domain to your Cloudflare account
2. Update `wrangler.toml`:

```toml
[env.production]
routes = [
  { pattern = "cors-proxy.yourdomain.com/*", zone_name = "yourdomain.com" }
]
```

3. Deploy and configure DNS to point to Cloudflare.

## Node.js Deployment

For integration into existing Node.js applications:

### Installation

```bash
git clone https://github.com/pondpilot/cors-proxy.git
cd cors-proxy/self-hosted
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### As Express Middleware

You can integrate the proxy into an existing Express app:

```javascript
import express from 'express';
import { createProxyMiddleware } from './cors-proxy';

const app = express();

// Mount CORS proxy at /proxy
app.use('/proxy', createProxyMiddleware({
  allowedOrigins: ['https://yourapp.com'],
  allowedDomains: ['*.s3.amazonaws.com', '*.cloudfront.net'],
  rateLimit: { requests: 60, windowMs: 60000 }
}));

app.listen(3000);
```

## Configuration Reference

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `development` | Environment (`production` enables stricter security) |
| `ALLOWED_ORIGINS` | `*` | Comma-separated origins allowed to use the proxy |
| `ALLOWED_DOMAINS` | (see below) | Comma-separated domains that can be proxied |
| `RATE_LIMIT_REQUESTS` | `60` | Requests per IP per window |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Rate limit window in milliseconds |
| `MAX_FILE_SIZE_MB` | `500` | Maximum response size in MB |
| `REQUEST_TIMEOUT_MS` | `30000` | Request timeout in milliseconds |
| `HTTPS_ONLY` | `true` (prod) | Only allow HTTPS target URLs |
| `ALLOW_CREDENTIALS` | `false` | Forward Authorization headers (security risk) |

### Default Allowed Domains

When `ALLOWED_DOMAINS` is not set, the proxy allows these domains:

- **AWS S3**: `*.s3.amazonaws.com`, `*.s3.*.amazonaws.com`
- **CloudFront**: `*.cloudfront.net`
- **GitHub**: `*.github.io`, `*.githubusercontent.com`
- **Google Cloud Storage**: `*.storage.googleapis.com`
- **Azure Blob Storage**: `*.blob.core.windows.net`
- **Public Data Portals**: `data.gov`, `data.gouv.fr`
- **DuckDB**: `blobs.duckdb.org`, `*.duckdb.org`

To customize, set `ALLOWED_DOMAINS` with your own list.

### Domain Wildcards

Domain patterns support single-level wildcards:

| Pattern | Matches | Does Not Match |
|---------|---------|----------------|
| `*.example.com` | `api.example.com`, `cdn.example.com` | `a.b.example.com` |
| `*.*.example.com` | `a.b.example.com` | `x.y.z.example.com` |
| `example.com` | `example.com` only | `sub.example.com` |

## HTTPS Configuration

### With Caddy (Recommended)

Caddy provides automatic HTTPS with Let's Encrypt:

```caddyfile
# Caddyfile
cors-proxy.yourdomain.com {
    reverse_proxy localhost:3000
}
```

```bash
caddy run
```

### With nginx

```nginx
server {
    listen 443 ssl;
    server_name cors-proxy.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/cors-proxy.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cors-proxy.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Cloud Platform Deployment

### Railway

One-click deployment:

```bash
railway init
railway up
```

### Fly.io

```bash
fly launch
fly deploy
```

### Google Cloud Run

```bash
# Build and push container
gcloud builds submit --tag gcr.io/PROJECT_ID/cors-proxy

# Deploy
gcloud run deploy cors-proxy \
  --image gcr.io/PROJECT_ID/cors-proxy \
  --platform managed \
  --allow-unauthenticated
```

## Health Checks

The proxy exposes health check endpoints for monitoring:

| Endpoint | Response |
|----------|----------|
| `/health` | `{"status":"ok","service":"pondpilot-cors-proxy","uptime":...}` |
| `/info` | Service version and configuration |

Example health check:

```bash
curl http://localhost:3000/health
```

## Production Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production`
- [ ] Configure `ALLOWED_ORIGINS` (no wildcards)
- [ ] Review `ALLOWED_DOMAINS` for your use case
- [ ] Enable HTTPS via reverse proxy or Cloudflare
- [ ] Set appropriate rate limits
- [ ] Configure health check monitoring
- [ ] Set up logging/alerting for errors
- [ ] Test SSRF protection (see [Security](/cors-proxy/security/))

## Configuring PondPilot

After deploying your self-hosted proxy, configure PondPilot to use it:

1. Open PondPilot settings
2. Navigate to **Data Sources** → **CORS Proxy**
3. Enter your proxy URL (e.g., `https://cors-proxy.yourcompany.com`)
4. Save settings

PondPilot will now route remote file requests through your proxy.
