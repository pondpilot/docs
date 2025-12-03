---
title: Performance & Limits
description: Understanding the limitations of browser-based data analysis.
sidebar:
  order: 10
---

PondPilot runs **entirely in your browser** using WebAssembly (WASM). While powerful, this architecture implies certain limitations compared to native desktop applications or server-side databases.

## Memory Limits & Large Datasets

PondPilot has a distinct advantage over many browser-based tools: **it does not load your files into browser memory.**

Instead, it accesses files directly from your disk (zero-copy) when using Chrome or Edge. This allows you to work with **larger-than-memory datasets**—you can query a 100GB Parquet file even if your browser tab is capped at 4GB of RAM.

### When Memory Matters

While file size isn't a hard limit, **query complexity** is. The browser's memory limit (typically ~4GB per tab) applies to the *intermediate results* of your query.

*   ✅ **Supported:** Scanning huge files, filtering, simple aggregations, and streaming results.
    *   *Example:* `SELECT * FROM 'huge_file.parquet' WHERE date > '2024-01-01'`
*   ⚠️ **Risky:** Operations that require holding massive amounts of data in memory at once.
    *   *Example:* `ORDER BY` on a 10GB dataset (sorting requires materialization).
    *   *Example:* `DISTINCT` on high-cardinality columns in massive tables.
    *   *Example:* Cross-joining large tables without filters.

### Tips for Large Data

1. **Use Parquet**: Parquet files are columnar and compressed. PondPilot only reads the columns you select, drastically reducing memory pressure compared to row-based formats like CSV.
2. **Filter Early**: Apply `WHERE` clauses to reduce the data volume processed in memory.
3. **Limit Results**: `LIMIT 100` prevents the UI from trying to render millions of rows (though the engine can handle calculating them).

## Browser Differences

Performance varies by browser engine:

| Browser | Performance | Notes |
| :--- | :--- | :--- |
| **Chrome / Edge** | ⭐⭐⭐ Best | Fastest WASM execution. Supports File System Access API for persistent file handles. |
| **Firefox** | ⭐⭐ Good | Good performance but slightly stricter memory management. No persistent file handles (files must be re-selected on reload). |
| **Safari** | ⭐ Fair | Stricter memory limits. May struggle with very large datasets earlier than Chrome. |

## Network & CORS

When loading remote files (URLs):

- **CORS**: The remote server must allow Cross-Origin Resource Sharing. If not, the request will fail.
- **Proxy**: PondPilot includes a CORS proxy to bypass this, but it adds network overhead.
- **Direct Loading**: For best performance, ensure your S3 buckets or web servers send correct `Access-Control-Allow-Origin` headers so PondPilot can fetch data directly.

