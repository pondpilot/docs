---
title: Advanced Patterns
description: CTE handling, dbt/Jinja templates, subqueries, and complex transformations.
---

FlowScope handles advanced SQL patterns including CTEs, templated SQL, and complex transformations. This guide covers how FlowScope analyzes these patterns and how to get the most accurate lineage.

## Common Table Expressions (CTEs)

FlowScope fully tracks lineage through CTEs, treating them as intermediate nodes in the lineage graph.

### Basic CTE Lineage

```sql
WITH active_users AS (
    SELECT id, name, email
    FROM users
    WHERE status = 'active'
),
user_orders AS (
    SELECT
        u.id,
        u.name,
        COUNT(o.id) as order_count
    FROM active_users u
    LEFT JOIN orders o ON u.id = o.user_id
    GROUP BY u.id, u.name
)
SELECT * FROM user_orders WHERE order_count > 5;
```

FlowScope shows:
- `users` → `active_users` (with column filtering)
- `active_users` + `orders` → `user_orders` (with aggregation)
- `user_orders` → final output

### Recursive CTEs

```sql
WITH RECURSIVE subordinates AS (
    SELECT id, name, manager_id, 1 as level
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    SELECT e.id, e.name, e.manager_id, s.level + 1
    FROM employees e
    JOIN subordinates s ON e.manager_id = s.id
)
SELECT * FROM subordinates;
```

FlowScope tracks the recursive reference and shows the self-referential lineage pattern.

### Hiding CTEs

Toggle "Hide CTEs" in the visualization to simplify the graph. When hidden:

- CTE nodes are removed
- Direct edges connect original sources to final outputs
- Column-level lineage is preserved through bypass edges

## dbt and Jinja Templates

FlowScope supports dbt-style Jinja templating for analyzing models before they run.

### Enabling Template Mode

```bash
# CLI
flowscope --template dbt models/*.sql

# With variables
flowscope --template dbt \
  --template-var target_schema=production \
  --template-var run_date=2024-01-01 \
  models/*.sql
```

### Supported Jinja Constructs

| Construct | Example |
|-----------|---------|
| Variables | `{{ var('schema_name') }}` |
| Config | `{{ config(materialized='table') }}` |
| ref | `{{ ref('stg_orders') }}` |
| source | `{{ source('raw', 'orders') }}` |
| Conditionals | `{% if target.name == 'prod' %}` |
| Loops | `{% for col in columns %}` |

### Example dbt Model

```sql
{{ config(materialized='table') }}

WITH source_data AS (
    SELECT
        id,
        {{ dbt_utils.star(from=ref('stg_customers'), except=['created_at']) }},
        created_at::date as signup_date
    FROM {{ ref('stg_customers') }}
    WHERE created_at >= '{{ var("start_date") }}'
)

SELECT *
FROM source_data
{% if target.name == 'prod' %}
WHERE is_active = true
{% endif %}
```

FlowScope resolves:
- `{{ ref('stg_customers') }}` → table reference
- `{{ var('start_date') }}` → literal value
- Conditional blocks based on provided variables

### Providing Template Variables

Variables not provided are replaced with placeholders. Provide variables for accurate lineage:

```bash
flowscope --template dbt \
  --template-var start_date=2024-01-01 \
  --template-var target.name=prod \
  model.sql
```

## Subqueries

FlowScope tracks lineage through all subquery types.

### Scalar Subqueries

```sql
SELECT
    name,
    (SELECT AVG(amount) FROM orders WHERE user_id = u.id) as avg_order
FROM users u;
```

The correlated subquery shows lineage from `orders.amount` to `avg_order`.

### Subqueries in FROM

```sql
SELECT
    customer_name,
    total_orders
FROM (
    SELECT
        c.name as customer_name,
        COUNT(*) as total_orders
    FROM customers c
    JOIN orders o ON c.id = o.customer_id
    GROUP BY c.name
) summary
WHERE total_orders > 10;
```

The inline view appears as an intermediate node like a CTE.

### Subqueries in WHERE/HAVING

```sql
SELECT *
FROM orders
WHERE customer_id IN (
    SELECT id FROM customers WHERE region = 'WEST'
);
```

FlowScope shows the filter relationship between `orders` and `customers`.

## Complex Transformations

### Window Functions

```sql
SELECT
    order_id,
    customer_id,
    amount,
    SUM(amount) OVER (PARTITION BY customer_id ORDER BY order_date) as running_total,
    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY amount DESC) as rank
FROM orders;
```

FlowScope tracks:
- `amount` → `running_total` (aggregation)
- `amount` → `rank` (through ordering)
- `customer_id`, `order_date` as partition/order columns

### CASE Expressions

```sql
SELECT
    id,
    CASE
        WHEN status = 'active' THEN 'Active'
        WHEN status = 'pending' THEN 'Pending'
        ELSE 'Unknown'
    END as status_label,
    CASE region
        WHEN 'US' THEN price * 1.0
        WHEN 'EU' THEN price * 1.2
        ELSE price * 1.1
    END as adjusted_price
FROM products;
```

FlowScope shows:
- `status` → `status_label`
- `region` + `price` → `adjusted_price`

### COALESCE and NVL

```sql
SELECT
    COALESCE(preferred_name, first_name, 'Unknown') as display_name
FROM users;
```

Both `preferred_name` and `first_name` contribute to `display_name`.

## Set Operations

### UNION, INTERSECT, EXCEPT

```sql
SELECT id, name FROM customers
UNION ALL
SELECT id, name FROM prospects;
```

FlowScope shows both source tables contributing to the output columns.

### Complex Set Operations

```sql
WITH all_people AS (
    SELECT id, name, 'customer' as type FROM customers
    UNION ALL
    SELECT id, name, 'employee' as type FROM employees
)
SELECT * FROM all_people
EXCEPT
SELECT ap.* FROM all_people ap
JOIN blocklist b ON ap.id = b.person_id;
```

Full lineage is tracked through the set operations.

## Multi-File Analysis

FlowScope can analyze related SQL files together:

```bash
flowscope models/staging/*.sql models/marts/*.sql
```

### Cross-File Lineage

When files reference tables created in other files, FlowScope connects the lineage:

```
staging/stg_orders.sql    →    marts/fct_orders.sql
CREATE TABLE stg_orders        SELECT * FROM stg_orders
```

### Project Structure

For dbt projects:

```bash
flowscope --template dbt \
  models/staging/*.sql \
  models/intermediate/*.sql \
  models/marts/*.sql
```

FlowScope resolves `{{ ref() }}` calls across files.

## Schema Handling

### Wildcard Resolution

With schema context, `SELECT *` expands to actual columns:

```sql
-- Schema
CREATE TABLE orders (id INT, amount DECIMAL, status TEXT);

-- Query
SELECT * FROM orders WHERE status = 'active';
```

Lineage shows individual columns: `id`, `amount`, `status`.

### Qualified Names

FlowScope handles schema-qualified table names:

```sql
SELECT * FROM analytics.public.orders;
SELECT * FROM "Analytics"."Public"."Orders";
```

Both resolve to the same table if schema metadata matches.

### Search Path

For PostgreSQL-style search paths:

```bash
flowscope --search-path public,staging query.sql
```

Unqualified table names resolve using the search path order.
