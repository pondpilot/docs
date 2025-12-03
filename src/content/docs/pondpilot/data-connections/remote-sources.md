---
title: Remote Sources
description: Connect to remote data via HTTP, S3, and Proxy.
sidebar:
  order: 2
---

You can query data that lives on the web or cloud storage.

## HTTP / HTTPS

You can query public URLs directly using DuckDB's `read_*` functions or by simply treating the URL as a table.

```sql
-- Auto-detect format
SELECT * FROM 'https://raw.githubusercontent.com/duckdb/duckdb/master/data/parquet-testing/glob.parquet';

-- Explicit function
SELECT * FROM read_csv('https://example.com/data.csv');
```

### CORS Issues

Browsers block requests to servers that don't send Cross-Origin Resource Sharing (CORS) headers.
If a query fails due to CORS:
1. Enable the **CORS Proxy** in Settings.
2. PondPilot will route the request through a proxy server to bypass the restriction.

## Cloud Storage (S3)

PondPilot supports reading from S3-compatible storage (AWS S3, MinIO, GCS, R2).

### Public Buckets

```sql
SELECT * FROM 's3://my-public-bucket/data.parquet';
```

### Private Buckets

To access private data, you must configure credentials in **Settings → Remote Database**.

1. Enter your **Access Key ID** and **Secret Access Key**.
2. Set the **Region** (e.g., `us-east-1`).
3. Set the **Endpoint** (leave blank for AWS, set for MinIO/R2).

*Note: Credentials are stored locally in your browser.*

## Remote Databases (via Proxy)

To query **PostgreSQL** or **MySQL**, you cannot connect directly from the browser. You must use the **PondPilot Proxy**.

1. [Deploy the Proxy](/pondpilot/deployment/) or run it locally.
2. In PondPilot, go to **Settings → Remote Database**.
3. Add a **Remote DuckDB** connection pointing to your proxy URL.
4. Your Postgres/MySQL tables will appear in the Data Explorer as if they were local.
