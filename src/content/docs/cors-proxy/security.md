---
title: Security
description: Security features, SSRF protection, and threat model of the CORS Proxy.
---

The CORS Proxy is designed with security as a core principle. This page documents the security features, threat model, and configuration options for hardening your deployment.

## Security Features Overview

| Feature | Purpose |
|---------|---------|
| SSRF Protection | Block requests to private networks and cloud metadata |
| Domain Allowlisting | Limit which domains can be proxied |
| Origin Validation | Restrict which websites can use the proxy |
| Rate Limiting | Prevent abuse and DDoS |
| HTTPS Enforcement | Prevent man-in-the-middle attacks |
| No Logging | Protect user privacy |

## SSRF Protection

Server-Side Request Forgery (SSRF) attacks trick a server into making requests to internal resources. The CORS Proxy blocks all requests to private networks and sensitive endpoints.

### Blocked IP Ranges

| Range | Description |
|-------|-------------|
| `127.0.0.0/8` | Localhost/loopback |
| `10.0.0.0/8` | Private network (Class A) |
| `172.16.0.0/12` | Private network (Class B) |
| `192.168.0.0/16` | Private network (Class C) |
| `169.254.0.0/16` | Link-local (AWS/GCP metadata) |
| `::1` | IPv6 localhost |
| `fe80::/10` | IPv6 link-local |
| `fc00::/7` | IPv6 unique local |

### Blocked Hostnames

- `localhost`
- `0.0.0.0`
- `metadata.google.internal` (GCP)
- Kubernetes internal services

### Blocked Requests Examples

```
# Cloud metadata endpoints (credential theft)
https://cors-proxy.pondpilot.io/proxy?url=http://169.254.169.254/latest/meta-data/

# Internal services
https://cors-proxy.pondpilot.io/proxy?url=http://127.0.0.1:8080/admin

# Private network scanning
https://cors-proxy.pondpilot.io/proxy?url=http://192.168.1.1/router-config
```

All of these return `403 Forbidden` with SSRF protection error.

### Redirect Blocking

The proxy blocks redirects to prevent SSRF bypass via redirect chains. A URL that redirects to a private IP is blocked even if the initial URL appears safe.

## Domain Allowlisting

By default, the proxy only allows requests to a curated list of safe domains. This prevents the proxy from being used as an open proxy for malicious purposes.

### Default Allowed Domains

```
# Cloud Storage
*.s3.amazonaws.com
*.s3.*.amazonaws.com
*.cloudfront.net
*.storage.googleapis.com
*.blob.core.windows.net

# Code Hosting
*.github.io
*.githubusercontent.com

# Public Data
data.gov
data.gouv.fr
blobs.duckdb.org
*.duckdb.org
```

### Custom Domain Configuration

To allow additional domains, set the `ALLOWED_DOMAINS` environment variable:

```bash
# Allow specific domains
ALLOWED_DOMAINS="api.yourcompany.com,data.yourcompany.com"

# Allow wildcard subdomains
ALLOWED_DOMAINS="*.yourcompany.com,*.partner.com"

# Combine with defaults (not automatic, you must list all)
ALLOWED_DOMAINS="*.s3.amazonaws.com,*.yourcompany.com"
```

### Wildcard Security

Wildcards match only one subdomain level for security:

| Pattern | Matches | Does Not Match |
|---------|---------|----------------|
| `*.example.com` | `api.example.com` | `malicious.api.example.com` |

This prevents attackers from registering deep subdomains to bypass restrictions.

## Origin Validation

The proxy validates the `Origin` header to ensure only authorized websites can use it.

### Configuration

```bash
# Allow specific origins
ALLOWED_ORIGINS="https://app.pondpilot.io,https://yourapp.com"

# Allow localhost for development
ALLOWED_ORIGINS="https://app.pondpilot.io,http://localhost:5173"
```

Requests without a valid `Origin` header or from non-allowed origins are rejected.

## Rate Limiting

Rate limiting prevents abuse and protects against DDoS attacks.

### Configuration

```bash
# 100 requests per minute per IP
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000
```

### Default Limits

| Setting | Default |
|---------|---------|
| Requests per window | 60 |
| Window duration | 60 seconds (1 minute) |

Rate-limited requests receive `429 Too Many Requests`.

## HTTPS Enforcement

In production mode (`NODE_ENV=production`), the proxy only allows HTTPS target URLs. This prevents:

- Man-in-the-middle attacks on proxied data
- Accidental exposure of sensitive data over unencrypted connections

```bash
# Only HTTPS allowed (default in production)
HTTPS_ONLY=true

# Allow HTTP (development only, not recommended)
HTTPS_ONLY=false
```

## Credential Handling

By default, the proxy never forwards authentication headers:

- `Authorization` headers are stripped
- Cookies are not forwarded
- API keys in headers are removed

### Credential Forwarding (Advanced)

For corporate environments where you trust both the client and data source, you can enable credential forwarding:

```bash
ALLOW_CREDENTIALS=true
```

:::caution
Enabling credential forwarding increases security risk. Only use when:
- You control both the client application and data source
- All communication is over HTTPS
- You understand the implications
:::

Even with credentials enabled:
- Upstream `Set-Cookie` headers are blocked
- The proxy never stores or logs credentials

## No Logging Policy

The proxy does not log:

- Request URLs
- Request/response bodies
- User IP addresses (beyond rate limiting)
- Any personally identifiable information

This is enforced at the code level, not just policy.

## Threat Model

### Protected Against

| Threat | Mitigation |
|--------|------------|
| SSRF attacks | Private IP blocking, domain allowlist, redirect blocking |
| DNS rebinding | Domain validation before fetch, redirect blocking |
| Unauthorized proxy use | Origin validation |
| DDoS/abuse | Rate limiting |
| Bandwidth exhaustion | File size limits, request timeouts |
| Open proxy abuse | Domain allowlist, origin validation |
| Credential theft | No auth header forwarding by default |
| Data exfiltration | Read-only operations, domain allowlist |
| Privacy violations | No logging policy |

### Not Protected Against

| Threat | Why |
|--------|-----|
| Malicious content from allowed domains | The proxy is transparent; it doesn't scan content |
| Allowed origin misuse | If an allowed origin is compromised, it can use the proxy |
| Physical server compromise | Standard infrastructure security applies |

## Production Hardening Checklist

Before deploying to production, verify:

- [ ] `NODE_ENV=production` is set
- [ ] `HTTPS_ONLY=true` (or using HTTPS reverse proxy)
- [ ] `ALLOWED_ORIGINS` contains only your domains (no `*`)
- [ ] `ALLOWED_DOMAINS` is appropriate for your use case
- [ ] Rate limits are configured appropriately
- [ ] Firewall blocks direct access to internal networks
- [ ] Health monitoring is configured
- [ ] HTTPS termination is properly configured

## Testing Security

### Test SSRF Protection

```bash
# Should return 403
curl "http://localhost:3000/proxy?url=http://169.254.169.254/latest/" \
  -H "Origin: http://localhost:5173"

curl "http://localhost:3000/proxy?url=http://127.0.0.1:8080/" \
  -H "Origin: http://localhost:5173"
```

### Test Domain Allowlist

```bash
# Should work (default allowed domain)
curl "http://localhost:3000/proxy?url=https://blobs.duckdb.org/test" \
  -H "Origin: http://localhost:5173"

# Should return 403 (not in allowlist)
curl "http://localhost:3000/proxy?url=https://evil.com/malware" \
  -H "Origin: http://localhost:5173"
```

### Test Origin Validation

```bash
# Should work with allowed origin
curl "http://localhost:3000/proxy?url=https://blobs.duckdb.org/test" \
  -H "Origin: http://localhost:5173"

# Should return 403 with unauthorized origin
curl "http://localhost:3000/proxy?url=https://blobs.duckdb.org/test" \
  -H "Origin: https://malicious-site.com"
```

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly:

1. Do not open a public GitHub issue
2. Email security concerns to the maintainers
3. Allow time for a fix before public disclosure

See the [Security Policy](https://github.com/pondpilot/cors-proxy/security/policy) for details.
