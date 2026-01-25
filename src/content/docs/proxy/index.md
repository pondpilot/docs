---
title: PondPilot Proxy
description: Query PostgreSQL, MySQL, and SQLite databases through DuckDB's analytics engine via HTTP API.
sidebar:
  order: 0
---

PondPilot Proxy extends DuckDB with the ability to query external databases seamlessly. Run complex analytical queries across multiple database systems—all via a simple HTTP API.

## What is PondPilot Proxy?

PondPilot Proxy is a server that sits between your applications and your databases. It uses DuckDB as a powerful query engine, letting you:

- Query PostgreSQL, MySQL, and SQLite from a single endpoint
- Join data across different database systems in one query
- Apply DuckDB's analytics functions to external databases
- Get results in JSON, CSV, or Apache Arrow format

## Why Use PondPilot Proxy?

### Cross-Database Analytics

Query multiple databases in a single SQL statement:

```sql
-- Join PostgreSQL sales with MySQL customer data
SELECT
    c.customer_name,
    SUM(s.revenue) as total_revenue
FROM postgres_db.sales s
JOIN mysql_db.customers c ON s.customer_id = c.id
GROUP BY c.customer_name;
```

### No Data Movement

Traditional approaches require ETL pipelines to move data into a central warehouse. PondPilot Proxy queries external databases directly—no data copying, no sync jobs, no stale data.

### DuckDB's Analytical Power

Even when querying PostgreSQL or MySQL, you get access to DuckDB's:

- Window functions and CTEs
- Advanced aggregations
- Vectorized execution
- Optimized query plans

### Simple HTTP Interface

No database drivers or connection management in your application. Send SQL over HTTP, get results back as JSON.

## How It Works

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Your Application                             │
│                              │                                      │
│                         HTTP Request                                │
│                              ▼                                      │
├─────────────────────────────────────────────────────────────────────┤
│                      PondPilot Proxy                                │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐    │
│  │ Auth & Rate  │ → │   DuckDB     │ → │ Connection Pooling   │    │
│  │   Limiting   │   │   Engine     │   │                      │    │
│  └──────────────┘   └──────────────┘   └──────────────────────┘    │
│                              │                                      │
│              ┌───────────────┼───────────────┐                      │
│              ▼               ▼               ▼                      │
│        ┌──────────┐   ┌──────────┐   ┌──────────┐                  │
│        │PostgreSQL│   │  MySQL   │   │  SQLite  │                  │
│        └──────────┘   └──────────┘   └──────────┘                  │
└─────────────────────────────────────────────────────────────────────┘
```

1. Your application sends SQL queries over HTTP
2. PondPilot Proxy authenticates the request and applies rate limiting
3. DuckDB parses and optimizes the query
4. DuckDB's extensions connect to external databases
5. Results stream back in your preferred format

## Supported Databases

| Database   | Read Support | Notes                                    |
|------------|--------------|------------------------------------------|
| PostgreSQL | Full         | All PostgreSQL-compatible databases      |
| MySQL      | Full         | MySQL and MariaDB                        |
| SQLite     | Full         | Local or remote SQLite files             |
| DuckDB     | Full         | Native DuckDB tables and in-memory data  |

## Use Cases

- **Analytics on Production Data** - Run complex analytical queries without impacting your production databases
- **Data Federation** - Query across microservice databases without tight coupling
- **Business Intelligence** - Connect BI tools to multiple databases through one endpoint
- **Data Science Notebooks** - Access production data in Jupyter/notebooks via HTTP
- **Reporting** - Generate reports from multiple data sources with a single query

## Quick Links

import { Card, CardGrid } from '@astrojs/starlight/components';

<CardGrid>
  <Card title="Getting Started" icon="rocket">
    Install and run your first cross-database query.

    [Get started →](/proxy/getting-started/)
  </Card>
  <Card title="Configuration" icon="setting">
    YAML configuration, environment variables, authentication.

    [Configure →](/proxy/configuration/)
  </Card>
  <Card title="Cross-Database Queries" icon="random">
    Master cross-database JOINs and analytics.

    [Learn more →](/proxy/cross-database-queries/)
  </Card>
  <Card title="Deployment" icon="rocket">
    Docker, health checks, and production setup.

    [Deploy →](/proxy/deployment/)
  </Card>
</CardGrid>
