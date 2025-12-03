---
title: Deployment
description: How to self-host and deploy PondPilot.
sidebar:
  order: 9
---

PondPilot can be deployed at the domain root (`/`) or under a subdirectory (e.g., `/ui/` or `/pondpilot/`). This guide covers Docker deployment and configuration.

## Docker Deployment

The easiest way to run PondPilot is using the official Docker image.

```bash
docker run -d -p 80:80 --name pondpilot ghcr.io/pondpilot/pondpilot:latest
```

Visit `http://localhost` to access the application.

## Subdirectory Deployment

To deploy PondPilot under a subpath (like `https://example.com/pondpilot/`), you need to configure the build and your reverse proxy.

### 1. Build Configuration

You must build the application with the `VITE_BASE_PATH` environment variable. The path must start and end with `/`.

**Example:**
```bash
VITE_BASE_PATH=/pondpilot/ yarn build
```

Or using the provided `just` command:
```bash
just docker-build /pondpilot/
```

This sets the correct asset paths in the generated HTML and JS files.

### 2. Nginx Configuration

You have two options for configuring your reverse proxy (Nginx).

#### Option A: Strip Prefix (Recommended)

This approach strips the subdirectory prefix before forwarding the request to the container. The container serves files from its root.

```nginx
location = /pondpilot { return 301 "/pondpilot/"; }

location /pondpilot/ {
    # Trailing slash is crucial here to strip the prefix
    proxy_pass http://pondpilot-container:80/;
    proxy_set_header Host $host;
}
```

#### Option B: Rewrite Inside Container

If you cannot strip the prefix in your outer proxy, you can handle the rewrite inside the container's Nginx config.

**Outer Proxy:**
```nginx
location /pondpilot/ {
    proxy_pass http://pondpilot-container:80;
}
```

**Container `nginx.conf`:**
```nginx
location /pondpilot/ {
    rewrite ^/pondpilot/(.*)$ /$1 break;
    try_files $uri $uri/ /index.html;
}
```

## Docker Compose Example

Here is a complete `docker-compose.yml` example with Nginx:

```yaml
version: '3'
services:
  pondpilot:
    image: ghcr.io/pondpilot/pondpilot:latest
    restart: always

  nginx:
    image: nginx:alpine
    ports: ["80:80"]
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on: [pondpilot]
```

## Troubleshooting

- **404 on Assets**: If JS/CSS files fail to load, check that your `VITE_BASE_PATH` matches your deployment path exactly (including trailing slashes).
- **Blank Page**: Open the browser console. If you see errors about loading modules, your Nginx `proxy_pass` might be missing the trailing slash (Option A).
