---
title: CORS Proxy Overview
description: Enable browser-based access to remote data sources without CORS headers.
---

The PondPilot CORS Proxy is a transparent proxy service that enables browser-based access to remote databases and files that don't have CORS headers.

## Why Use a CORS Proxy?

Browser security policies (CORS) prevent web applications from accessing resources on different domains unless the server explicitly allows it. Many public data sources (S3, CloudFront, etc.) don't include CORS headers, making them inaccessible from browser-based tools like PondPilot.

The CORS Proxy solves this by:
1. Receiving your request
2. Fetching the data from the source
3. Adding CORS headers to the response
4. Returning the data to your browser

## Usage Options

### Official Hosted Service

Use the official proxy at `https://cors-proxy.pondpilot.io`:

```
https://cors-proxy.pondpilot.io/?url=https://example.com/data.parquet
```

This is automatically used by PondPilot when loading remote files.

### Self-Hosted

For production use or additional privacy, you can self-host the proxy:

```bash
docker run -p 3000:3000 ghcr.io/pondpilot/cors-proxy
```

Or deploy to Cloudflare Workers for edge deployment.

## Security Features

The CORS Proxy includes several security features:

- **SSRF Protection**: Blocks requests to private IPs, localhost, and cloud metadata services
- **Domain Allowlisting**: Configure which domains can be proxied
- **Redirect Blocking**: Prevents following redirects to private networks
- **Origin Validation**: Validates request origins
- **Rate Limiting**: Default 60 requests/minute
- **HTTPS Enforcement**: Only proxies HTTPS URLs
- **Request Timeouts**: 30-second default timeout
- **No Logging**: No request data is logged or retained

## Next Steps

- [Self-Hosting Guide](/cors-proxy/self-hosting/)
- [Security Configuration](/cors-proxy/security/)
