---
title: Cross-Database Queries
description: Query and join data across PostgreSQL, MySQL, SQLite, and DuckDB in a single SQL statement.
sidebar:
  order: 3
---

Cross-database queries are PondPilot Proxy's core feature. This guide covers how to attach multiple databases and join them in a single query.

## How It Works

When you attach a database, DuckDB creates a virtual connection to that database. Tables appear in DuckDB's catalog under the alias you specified. You can then query tables from different databases as if they were all in one database.

```
┌──────────────────────────────────────────────────────────────────┐
│                          DuckDB                                   │
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   postgres_db   │  │    mysql_db     │  │   sqlite_db     │  │
│  │   ┌─────────┐   │  │   ┌─────────┐   │  │   ┌─────────┐   │  │
│  │   │ orders  │   │  │   │customers│   │  │   │ config  │   │  │
│  │   │ products│   │  │   │ regions │   │  │   │ cache   │   │  │
│  │   └─────────┘   │  │   └─────────┘   │  │   └─────────┘   │  │
│  └────────│────────┘  └────────│────────┘  └────────│────────┘  │
│           │                    │                    │            │
│           └────────────────────┼────────────────────┘            │
│                                ▼                                 │
│                        Single SQL Query                          │
│  SELECT ... FROM postgres_db.orders JOIN mysql_db.customers ...  │
└──────────────────────────────────────────────────────────────────┘
```

## Attaching Multiple Databases

### Via Configuration File

The simplest approach—databases are attached automatically on startup:

```yaml
duckdb:
  attached_databases:
    - alias: "sales"
      type: "postgres"
      connection_string: "postgresql://user:pass@pg-host:5432/sales"
    - alias: "crm"
      type: "mysql"
      connection_string: "mysql://user:pass@mysql-host:3306/crm"
    - alias: "cache"
      type: "sqlite"
      connection_string: "/data/cache.db"
```

### Via API

Attach databases dynamically after creating an instance:

```bash
# Create instance
INSTANCE_ID=$(curl -s -X POST http://localhost:8080/v1/instances \
  -H "X-API-Key: your-key" \
  -d '{}' | jq -r '.id')

# Attach PostgreSQL
curl -X POST http://localhost:8080/v1/instances/$INSTANCE_ID/databases \
  -H "X-API-Key: your-key" \
  -H "Content-Type: application/json" \
  -d '{"type": "postgres", "alias": "sales", "connectionString": "postgresql://..."}'

# Attach MySQL
curl -X POST http://localhost:8080/v1/instances/$INSTANCE_ID/databases \
  -H "X-API-Key: your-key" \
  -H "Content-Type: application/json" \
  -d '{"type": "mysql", "alias": "crm", "connectionString": "mysql://..."}'
```

## Table Naming Convention

Tables are referenced using the pattern: `{alias}.{schema}.{table}` or `{alias}.{table}`

| Database Type | Pattern | Example |
|---------------|---------|---------|
| PostgreSQL | `alias.schema.table` | `sales.public.orders` |
| MySQL | `alias.table` | `crm.customers` |
| SQLite | `alias.table` | `cache.settings` |

PostgreSQL tables use the full schema-qualified name. For the default `public` schema:

```sql
SELECT * FROM sales.public.orders;
```

For other schemas:

```sql
SELECT * FROM sales.analytics.events;
```

## Cross-Database JOIN Examples

### Basic JOIN

Join a PostgreSQL orders table with MySQL customer data:

```sql
SELECT
    c.customer_name,
    c.email,
    o.order_id,
    o.order_date,
    o.total_amount
FROM sales.public.orders o
JOIN crm.customers c ON o.customer_id = c.id
WHERE o.order_date >= '2024-01-01'
ORDER BY o.order_date DESC;
```

### Aggregation Across Databases

Calculate revenue by customer tier (PostgreSQL) and region (MySQL):

```sql
SELECT
    c.region,
    c.tier,
    COUNT(DISTINCT o.customer_id) as customers,
    COUNT(o.order_id) as orders,
    SUM(o.total_amount) as revenue
FROM sales.public.orders o
JOIN crm.customers c ON o.customer_id = c.id
GROUP BY c.region, c.tier
ORDER BY revenue DESC;
```

### Three-Database Join

Combine data from PostgreSQL, MySQL, and SQLite:

```sql
SELECT
    p.product_name,
    c.customer_name,
    o.quantity,
    cfg.discount_rate
FROM sales.public.orders o
JOIN sales.public.products p ON o.product_id = p.id
JOIN crm.customers c ON o.customer_id = c.id
JOIN cache.discount_config cfg ON c.tier = cfg.tier_name
WHERE o.order_date >= '2024-01-01';
```

## Advanced Analytics

### Window Functions

Apply DuckDB's window functions across external databases:

```sql
SELECT
    customer_id,
    order_date,
    total_amount,
    SUM(total_amount) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) as running_total,
    ROW_NUMBER() OVER (
        PARTITION BY customer_id
        ORDER BY order_date
    ) as order_number
FROM sales.public.orders;
```

### CTEs (Common Table Expressions)

Build complex queries step by step:

```sql
WITH customer_stats AS (
    SELECT
        customer_id,
        COUNT(*) as order_count,
        SUM(total_amount) as lifetime_value,
        MIN(order_date) as first_order,
        MAX(order_date) as last_order
    FROM sales.public.orders
    GROUP BY customer_id
),
customer_details AS (
    SELECT
        c.id,
        c.customer_name,
        c.email,
        c.tier,
        c.region
    FROM crm.customers c
)
SELECT
    d.customer_name,
    d.tier,
    d.region,
    s.order_count,
    s.lifetime_value,
    s.first_order,
    s.last_order,
    DATEDIFF('day', s.first_order, s.last_order) as customer_lifespan_days
FROM customer_stats s
JOIN customer_details d ON s.customer_id = d.id
ORDER BY s.lifetime_value DESC
LIMIT 100;
```

### Cohort Analysis

Perform cohort analysis combining data from multiple sources:

```sql
WITH customer_cohorts AS (
    SELECT
        customer_id,
        DATE_TRUNC('month', MIN(order_date)) as cohort_month
    FROM sales.public.orders
    GROUP BY customer_id
),
monthly_activity AS (
    SELECT
        c.cohort_month,
        DATE_TRUNC('month', o.order_date) as activity_month,
        COUNT(DISTINCT o.customer_id) as active_customers,
        SUM(o.total_amount) as revenue
    FROM sales.public.orders o
    JOIN customer_cohorts c ON o.customer_id = c.customer_id
    GROUP BY c.cohort_month, DATE_TRUNC('month', o.order_date)
)
SELECT
    cohort_month,
    activity_month,
    DATEDIFF('month', cohort_month, activity_month) as months_since_first_order,
    active_customers,
    revenue
FROM monthly_activity
ORDER BY cohort_month, activity_month;
```

## Listing Attached Databases

Check which databases are attached to an instance:

```bash
curl http://localhost:8080/v1/instances/$INSTANCE_ID/databases \
  -H "X-API-Key: your-key"
```

Response:

```json
{
  "databases": [
    {"alias": "sales", "type": "postgres"},
    {"alias": "crm", "type": "mysql"},
    {"alias": "cache", "type": "sqlite"}
  ]
}
```

## Detaching Databases

Remove a database from an instance:

```bash
curl -X DELETE http://localhost:8080/v1/instances/$INSTANCE_ID/databases/crm \
  -H "X-API-Key: your-key"
```

## Performance Considerations

### Query Optimization

DuckDB's query optimizer works across attached databases:

- Predicates are pushed down to source databases when possible
- JOINs are optimized for the data sizes involved
- Results are streamed to minimize memory usage

### Connection Pooling

Each attached database maintains a connection pool. Configure pool sizes based on your workload:

```yaml
duckdb:
  connection_pool:
    min_connections: 2
    max_connections: 10
```

### Read-Only Access

All external database connections are read-only. This is by design for:

- Safety—prevents accidental writes to production databases
- Performance—allows use of read replicas
- Compliance—maintains audit trail integrity

## Supported Query Types

| Query Type | Supported |
|------------|-----------|
| SELECT | Yes |
| JOIN | Yes |
| Aggregations (GROUP BY) | Yes |
| Window functions | Yes |
| CTEs | Yes |
| Subqueries | Yes |
| UNION/INTERSECT/EXCEPT | Yes |
| INSERT/UPDATE/DELETE | No (read-only) |
| DDL (CREATE/DROP) | No |

## Troubleshooting

### "Database not found" Error

Verify the alias matches exactly:

```sql
-- Wrong
SELECT * FROM mydb.table;

-- Correct (with schema for PostgreSQL)
SELECT * FROM mydb.public.table;
```

### Slow Queries

- Check if predicates can be pushed down to source databases
- Consider creating indexes on frequently joined columns
- Use EXPLAIN to understand the query plan

### Connection Errors

- Verify connection strings are correct
- Check network connectivity to source databases
- Ensure database users have read permissions
