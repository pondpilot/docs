---
title: CORS Proxy
description: Enable browser-based access to remote data sources without CORS headers.
sidebar:
  order: 0
---

The PondPilot CORS Proxy is a transparent proxy service that enables browser-based applications to access remote files and databases that don't have CORS headers configured. All requests are proxied without logging, caching, or modification—your data remains private.

## What is CORS?

Cross-Origin Resource Sharing (CORS) is a browser security mechanism that prevents web pages from making requests to different domains unless the server explicitly allows it. When you try to load a file from `https://data.example.com` in a web app running at `https://app.pondpilot.io`, your browser blocks the request unless `data.example.com` sends proper CORS headers.

```
┌─────────────────┐         ┌─────────────────┐
│   Your Browser  │ ──────▶ │  Remote Server  │
│  (PondPilot)    │ ◀────── │  (no CORS)      │
└─────────────────┘   ❌    └─────────────────┘
                    Blocked by browser security
```

Many public data sources—S3 buckets, CloudFront distributions, government data portals—don't include CORS headers, making them inaccessible from browser-based tools like PondPilot.

## How the CORS Proxy Helps

The CORS Proxy acts as an intermediary that:

1. Receives your request from PondPilot
2. Fetches the data from the original source
3. Adds proper CORS headers to the response
4. Returns the data to your browser

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Your Browser  │ ──────▶ │   CORS Proxy    │ ──────▶ │  Remote Server  │
│  (PondPilot)    │ ◀────── │  (adds headers) │ ◀────── │  (no CORS)      │
└─────────────────┘    ✓    └─────────────────┘    ✓    └─────────────────┘
```

## When You Need the CORS Proxy

Use the CORS Proxy when accessing:

- **Remote Parquet/CSV files** on S3, CloudFront, or other CDNs without CORS
- **Remote DuckDB databases** for read-only analytics
- **Public data portals** (data.gov, data.gouv.fr, etc.)
- **GitHub raw files** and releases
- **Any HTTPS resource** blocked by browser CORS policies

PondPilot automatically uses the CORS Proxy when loading remote files that would otherwise fail.

## Privacy Guarantees

The CORS Proxy is designed with privacy as a core principle:

- **No Logging** - Request URLs and data are never logged or retained
- **No Caching** - Data passes through without storage
- **No Modification** - Responses are streamed unaltered
- **No Tracking** - No cookies, analytics, or user identification
- **HTTPS Only** - All traffic is encrypted in transit

## Usage Options

### Official Hosted Service

The official proxy is available at `https://cors-proxy.pondpilot.io`:

```
https://cors-proxy.pondpilot.io/proxy?url=https://example.com/data.parquet
```

This service is free, globally distributed via Cloudflare's edge network, and automatically used by PondPilot when needed.

### Self-Hosted

For maximum privacy or enterprise requirements, you can run your own proxy:

```bash
docker run -p 3000:3000 ghcr.io/pondpilot/cors-proxy
```

See the [Self-Hosting Guide](/cors-proxy/self-hosted/) for deployment options.

## Quick Links

import { Card, CardGrid } from '@astrojs/starlight/components';

<CardGrid>
  <Card title="Usage Guide" icon="pencil">
    Learn how to use the CORS Proxy with PondPilot and other tools.

    [View usage →](/cors-proxy/usage/)
  </Card>
  <Card title="Self-Hosting" icon="server">
    Deploy your own CORS Proxy with Docker or Cloudflare Workers.

    [Self-host →](/cors-proxy/self-hosted/)
  </Card>
  <Card title="Security" icon="shield">
    Security features, SSRF protection, and configuration options.

    [Learn more →](/cors-proxy/security/)
  </Card>
</CardGrid>
