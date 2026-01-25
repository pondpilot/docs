---
title: Getting Started with FlowScope
description: Analyze your first SQL query and understand the lineage visualization.
sidebar:
  order: 1
---

FlowScope is a privacy-first SQL lineage engine that analyzes SQL queries to produce detailed lineage graphs showing how tables, CTEs, and columns flow through data transformations. All processing happens locally in your browser.

## Your First Analysis

The fastest way to try FlowScope is through the web app at [flowscope.pondpilot.io](https://flowscope.pondpilot.io).

### Step 1: Open the Web App

Navigate to [flowscope.pondpilot.io](https://flowscope.pondpilot.io). No account or installation required.

### Step 2: Enter Your SQL

Paste this example query into the SQL editor:

```sql
WITH monthly_sales AS (
    SELECT
        customer_id,
        DATE_TRUNC('month', order_date) AS month,
        SUM(amount) AS total_amount
    FROM orders
    GROUP BY customer_id, DATE_TRUNC('month', order_date)
)
SELECT
    c.name,
    c.email,
    ms.month,
    ms.total_amount
FROM monthly_sales ms
JOIN customers c ON ms.customer_id = c.id
WHERE ms.total_amount > 1000;
```

### Step 3: View the Lineage Graph

FlowScope analyzes your query and displays an interactive lineage graph:

- **Tables** appear as nodes showing the table name and columns
- **Arrows** show how data flows from source tables through transformations
- **CTEs** like `monthly_sales` appear as intermediate nodes

### Step 4: Explore the Visualization

- **Click a node** to see its details and connected columns
- **Hover over an edge** to see the column-level lineage
- **Use the controls** to zoom, pan, and fit the graph to view
- **Toggle views** between table-level and column-level lineage

## Understanding the Results

In the example above, FlowScope shows:

1. **Source Tables**: `orders` and `customers` are the upstream data sources
2. **CTE**: `monthly_sales` aggregates order data by customer and month
3. **Final Output**: The SELECT produces four columns from the join
4. **Column Lineage**: `total_amount` traces back to `orders.amount` through `SUM()`

## Selecting a Dialect

Click the dialect selector to match your SQL syntax:

- **PostgreSQL** - Default, covers most standard SQL
- **Snowflake** - Snowflake-specific functions and syntax
- **BigQuery** - Google BigQuery SQL dialect
- **DuckDB** - DuckDB analytical SQL
- **MySQL** - MySQL syntax variations
- **Redshift** - Amazon Redshift

Selecting the correct dialect ensures accurate parsing of dialect-specific functions and syntax.

## Working with Multiple Statements

FlowScope can analyze files with multiple SQL statements. Each statement is analyzed separately, with lineage tracked across statements that reference the same tables.

```sql
-- Statement 1: Create staging table
CREATE TABLE staging_orders AS
SELECT * FROM raw_orders WHERE status = 'completed';

-- Statement 2: Create summary
SELECT customer_id, COUNT(*) as order_count
FROM staging_orders
GROUP BY customer_id;
```

## Providing Schema Context

For more accurate column resolution, especially with `SELECT *`, you can provide schema information:

1. Click the **Schema** tab
2. Paste CREATE TABLE statements or connect to a database
3. FlowScope uses this metadata to resolve wildcards and validate column references

```sql
-- Example schema input
CREATE TABLE orders (
    id INT,
    customer_id INT,
    amount DECIMAL(10,2),
    order_date DATE
);
```

## Next Steps

- [Analyzing Queries](/flowscope/analyzing-queries/) - Input methods and query validation
- [Lineage Visualization](/flowscope/lineage-visualization/) - Reading the graph in detail
- [SQL Dialects](/flowscope/dialects/) - Dialect-specific syntax support
- [CLI Reference](/flowscope/cli/) - Analyze SQL from the command line
