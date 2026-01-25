---
title: Analyzing Queries
description: Input methods, query validation, supported statement types, and error handling.
---

FlowScope supports multiple ways to input SQL for analysis and handles a wide range of SQL statement types. This guide covers input methods, supported queries, and how to interpret validation results.

## Input Methods

### Web App

The web app at [flowscope.pondpilot.io](https://flowscope.pondpilot.io) offers several input methods:

- **SQL Editor** - Type or paste SQL directly with syntax highlighting
- **File Upload** - Drag and drop `.sql` files
- **Multi-File Projects** - Upload related SQL files for cross-file lineage

### CLI

The command-line tool accepts SQL from files or stdin:

```bash
# Single file
flowscope query.sql

# Multiple files
flowscope etl/*.sql

# From stdin
echo "SELECT * FROM orders" | flowscope

# With dialect
flowscope -d snowflake warehouse_queries.sql
```

### API

The NPM package accepts SQL as a string:

```typescript
import { analyzeSql } from '@pondpilot/flowscope-core';

const result = await analyzeSql({
  sql: 'SELECT id, name FROM users',
  dialect: 'postgresql'
});
```

## Supported Statement Types

FlowScope extracts lineage from these SQL statement types:

### Data Manipulation (DML)

| Statement | Lineage Extracted |
|-----------|------------------|
| `SELECT` | Source tables, columns, transformations |
| `INSERT INTO ... SELECT` | Source-to-target column mappings |
| `UPDATE ... SET` | Modified columns and their sources |
| `DELETE` | Affected table and filter conditions |
| `MERGE` | Source, target, and matched/unmatched actions |

### Data Definition (DDL)

| Statement | Lineage Extracted |
|-----------|------------------|
| `CREATE TABLE AS SELECT` | Full lineage from SELECT to new table |
| `CREATE VIEW` | View definition lineage |
| `CREATE TABLE` | Schema metadata (used for column resolution) |
| `DROP TABLE/VIEW` | Tracks schema changes |

### Query Components

| Component | Support Level |
|-----------|--------------|
| Common Table Expressions (CTEs) | Full lineage tracking |
| Subqueries | Correlated and uncorrelated |
| Set Operations | UNION, INTERSECT, EXCEPT |
| Window Functions | OVER clause column tracking |
| JOINs | All join types with column correlation |

## Query Validation

FlowScope validates your SQL and reports issues at different severity levels:

### Issue Severities

| Severity | Meaning |
|----------|---------|
| **Error** | Query cannot be parsed; lineage unavailable |
| **Warning** | Query parsed but some constructs unrecognized |
| **Info** | Hints for better analysis (e.g., missing schema) |

### Common Validation Messages

**"Unknown table: orders"**
The table is referenced but not defined in the schema context. FlowScope still generates lineage with the table marked as external.

**"Cannot resolve column: SELECT *"**
Without schema metadata, FlowScope cannot expand wildcards. Provide CREATE TABLE statements for accurate column-level lineage.

**"Unsupported statement type"**
Some specialized statements (e.g., `EXPLAIN`, `GRANT`) don't produce lineage. FlowScope skips them and continues with other statements.

**"Dialect-specific syntax not recognized"**
Try selecting a more specific dialect. Some functions are dialect-specific.

## Handling Parse Errors

When FlowScope encounters syntax errors:

1. **Partial Lineage** - FlowScope attempts to extract lineage from valid portions
2. **Error Spans** - The exact location of the error is highlighted
3. **Suggestions** - Common fixes are suggested when possible

Example error output:

```
Error at line 5, column 12:
  Unexpected token 'FRMO' - did you mean 'FROM'?

  SELECT id, name
         FRMO users
         ^^^^
```

## Multi-Statement Analysis

FlowScope handles files with multiple SQL statements:

```sql
-- First statement
CREATE TABLE staging AS
SELECT id, amount FROM raw_data;

-- Second statement
CREATE TABLE summary AS
SELECT id, SUM(amount) as total
FROM staging
GROUP BY id;
```

The analysis shows:
- Statement 1: `raw_data` → `staging`
- Statement 2: `staging` → `summary`
- Cross-statement lineage: `raw_data` → `staging` → `summary`

## Schema Context

Providing schema metadata improves analysis accuracy:

### Without Schema

```sql
SELECT * FROM orders
```

Result: Single node for `orders` with unknown columns.

### With Schema

```sql
-- Schema context
CREATE TABLE orders (id INT, customer_id INT, amount DECIMAL);

-- Query
SELECT * FROM orders
```

Result: `orders` node with columns `id`, `customer_id`, `amount` explicitly shown.

### Schema Sources

1. **Manual DDL** - Paste CREATE TABLE statements
2. **File Upload** - Upload schema definition files
3. **Database Connection** (CLI) - Connect directly to PostgreSQL, MySQL, or SQLite

```bash
# CLI with live schema introspection
flowscope --metadata-url postgres://user:pass@localhost/db query.sql
```

## Statement Splitting

FlowScope intelligently splits SQL files into individual statements, handling:

- Standard semicolon delimiters
- Dollar-quoted strings (PostgreSQL)
- Nested BEGIN/END blocks
- Comment preservation

```sql
-- Correctly split despite complex quoting
CREATE FUNCTION example() RETURNS void AS $$
BEGIN
  -- This semicolon doesn't end the statement
  SELECT 1;
END;
$$ LANGUAGE plpgsql;  -- Statement ends here

SELECT * FROM orders;  -- Second statement
```
