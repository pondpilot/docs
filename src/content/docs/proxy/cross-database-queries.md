---
title: Cross-Database Queries
description: Query multiple databases with Flight SQL and DuckDB's federated query engine.
sidebar:
  order: 3
---

PondPilot Proxy's core feature is the ability to query multiple databases in a single SQL statement. Each user's DuckDB instance can connect to PostgreSQL, MySQL, and SQLite simultaneously.

## How It Works

When you configure attached databases, each user container starts with those databases pre-connected:

```
┌─────────────────────────────────────────────────────────────┐
│                   User Container (DuckDB)                    │
│                                                             │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│   │  analytics  │  │  customers  │  │   local     │        │
│   │ (postgres)  │  │  (mysql)    │  │  (sqlite)   │        │
│   └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│          │                │                │               │
└──────────┼────────────────┼────────────────┼───────────────┘
           │                │                │
           ▼                ▼                ▼
    ┌────────────┐   ┌────────────┐   ┌────────────┐
    │ PostgreSQL │   │   MySQL    │   │   SQLite   │
    │   Server   │   │   Server   │   │    File    │
    └────────────┘   └────────────┘   └────────────┘
```

## Table Naming Convention

Access tables using the format: `{alias}.{schema}.{table}` or `{alias}.{table}`

| Database Type | Format | Example |
|--------------|--------|---------|
| PostgreSQL | `alias.schema.table` | `analytics.public.orders` |
| MySQL | `alias.table` | `customers.users` |
| SQLite | `alias.table` | `local.products` |

## Cross-Database JOINs

Join data across different database systems:

```sql
-- Join PostgreSQL analytics with MySQL customer data
SELECT
    c.customer_name,
    c.customer_tier,
    COUNT(DISTINCT o.order_id) as order_count,
    SUM(o.amount) as total_revenue
FROM analytics.public.orders o
JOIN customers.users c ON o.customer_id = c.id
WHERE o.order_date >= '2024-01-01'
GROUP BY c.customer_name, c.customer_tier
ORDER BY total_revenue DESC
LIMIT 10;
```

DuckDB handles the federation—pulling data from each source and joining in memory.

## Query Examples

### Cohort Analysis Across Databases

Combine customer data from MySQL with order data from PostgreSQL:

```sql
WITH customer_cohorts AS (
    SELECT
        DATE_TRUNC('month', first_purchase_date) as cohort_month,
        id as customer_id,
        customer_tier
    FROM customers.users
),
revenue_by_cohort AS (
    SELECT
        c.cohort_month,
        c.customer_tier,
        DATE_TRUNC('month', o.order_date) as order_month,
        SUM(o.amount) as revenue,
        COUNT(DISTINCT o.customer_id) as active_customers
    FROM analytics.public.orders o
    JOIN customer_cohorts c ON o.customer_id = c.customer_id
    GROUP BY 1, 2, 3
)
SELECT
    cohort_month,
    customer_tier,
    order_month,
    revenue,
    active_customers,
    SUM(revenue) OVER (
        PARTITION BY cohort_month, customer_tier
        ORDER BY order_month
    ) as cumulative_revenue
FROM revenue_by_cohort
ORDER BY cohort_month, customer_tier, order_month;
```

### Data Reconciliation

Compare data between systems:

```sql
-- Find customers in MySQL but missing from PostgreSQL analytics
SELECT c.id, c.customer_name, c.email
FROM customers.users c
LEFT JOIN analytics.public.customer_dim cd ON c.id = cd.customer_id
WHERE cd.customer_id IS NULL;
```

### Aggregating from Multiple Sources

```sql
-- Combine metrics from different systems
SELECT
    'PostgreSQL Orders' as source,
    COUNT(*) as record_count,
    SUM(amount) as total_value
FROM analytics.public.orders
WHERE order_date >= CURRENT_DATE - INTERVAL 30 DAY

UNION ALL

SELECT
    'MySQL Customers' as source,
    COUNT(*) as record_count,
    NULL as total_value
FROM customers.users
WHERE created_at >= CURRENT_DATE - INTERVAL 30 DAY;
```

## DuckDB Analytics Functions

Even when querying external databases, you get DuckDB's full analytical capabilities:

### Window Functions

```sql
SELECT
    customer_id,
    order_date,
    amount,
    SUM(amount) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) as running_total,
    ROW_NUMBER() OVER (
        PARTITION BY customer_id
        ORDER BY amount DESC
    ) as amount_rank
FROM analytics.public.orders;
```

### Common Table Expressions (CTEs)

```sql
WITH monthly_sales AS (
    SELECT
        DATE_TRUNC('month', order_date) as month,
        SUM(amount) as revenue
    FROM analytics.public.orders
    GROUP BY 1
),
growth AS (
    SELECT
        month,
        revenue,
        LAG(revenue) OVER (ORDER BY month) as prev_revenue
    FROM monthly_sales
)
SELECT
    month,
    revenue,
    prev_revenue,
    ROUND((revenue - prev_revenue) / prev_revenue * 100, 2) as growth_pct
FROM growth
WHERE prev_revenue IS NOT NULL;
```

### PIVOT and UNPIVOT

```sql
-- Pivot monthly revenue by customer tier
PIVOT (
    SELECT
        DATE_TRUNC('month', o.order_date) as month,
        c.customer_tier,
        SUM(o.amount) as revenue
    FROM analytics.public.orders o
    JOIN customers.users c ON o.customer_id = c.id
    GROUP BY 1, 2
)
ON customer_tier
USING SUM(revenue);
```

## Performance Considerations

### Predicate Pushdown

DuckDB pushes filters to source databases when possible:

```sql
-- This filter is pushed to PostgreSQL
SELECT * FROM analytics.public.orders
WHERE order_date >= '2024-01-01'
  AND status = 'completed';
```

The PostgreSQL server filters the data, reducing network transfer.

### Large Result Sets

For large joins, consider:

1. **Filter early** — Apply WHERE clauses to reduce data before joining
2. **Use LIMIT** — Add LIMIT during development
3. **Aggregate at source** — Use subqueries to aggregate before joining

```sql
-- Better: Aggregate at source, then join
SELECT
    c.customer_name,
    o.total_orders,
    o.total_revenue
FROM customers.users c
JOIN (
    SELECT
        customer_id,
        COUNT(*) as total_orders,
        SUM(amount) as total_revenue
    FROM analytics.public.orders
    GROUP BY customer_id
) o ON c.id = o.customer_id;
```

### Memory Limits

Each container has a memory limit (default 512MB). For large queries:

- Use `LIMIT` during exploration
- Filter data before joining
- Consider increasing `containers.memory_limit` in config

## Connecting via Flight SQL

### PondPilot App

The PondPilot app connects automatically. Configure your proxy URL in settings.

### DuckDB Airport Extension

```sql
LOAD airport;

-- Connect to proxy
ATTACH 'flight://proxy.example.com:8081?token=<jwt>' AS remote;

-- Query through proxy
SELECT * FROM remote.analytics.public.orders LIMIT 10;

-- Cross-database join through proxy
SELECT
    c.customer_name,
    SUM(o.amount) as total
FROM remote.analytics.public.orders o
JOIN remote.customers.users c ON o.customer_id = c.id
GROUP BY c.customer_name;
```

### Python with PyArrow

```python
from pyarrow import flight

client = flight.connect("grpc://proxy.example.com:8081")
options = flight.FlightCallOptions(headers=[
    (b"authorization", b"Bearer <jwt-token>")
])

# Execute cross-database query
query = b"""
    SELECT c.name, SUM(o.amount)
    FROM analytics.public.orders o
    JOIN customers.users c ON o.customer_id = c.id
    GROUP BY c.name
"""

info = client.get_flight_info(
    flight.FlightDescriptor.for_command(query),
    options
)
reader = client.do_get(info.endpoints[0].ticket, options)
df = reader.read_pandas()
```

## Troubleshooting

### "Table not found"

Check the table naming convention:
- PostgreSQL: `alias.schema.table` (schema is usually `public`)
- MySQL: `alias.table`

### Slow queries

1. Check if predicates are being pushed down
2. Reduce data volume with filters
3. Consider container memory limits

### Connection errors

The container connects to databases on startup. If a database is unreachable:
- The container may fail to start
- Check network connectivity between container and database
- Verify connection string credentials
