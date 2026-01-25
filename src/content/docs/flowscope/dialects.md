---
title: SQL Dialects
description: Supported SQL dialects, syntax differences, and dialect-specific features.
sidebar:
  order: 4
---

FlowScope supports 13 SQL dialects with varying levels of syntax coverage. Selecting the correct dialect ensures accurate parsing of dialect-specific functions, quoting styles, and statement syntax.

## Supported Dialects

| Dialect | Use For |
|---------|---------|
| `generic` | Unknown or mixed SQL |
| `ansi` | Standard ANSI SQL |
| `postgresql` | PostgreSQL, CockroachDB |
| `snowflake` | Snowflake Data Cloud |
| `bigquery` | Google BigQuery |
| `duckdb` | DuckDB |
| `redshift` | Amazon Redshift |
| `mysql` | MySQL, MariaDB |
| `mssql` | Microsoft SQL Server |
| `sqlite` | SQLite |
| `hive` | Apache Hive |
| `databricks` | Databricks SQL |
| `clickhouse` | ClickHouse |

## Selecting a Dialect

### Web App

Use the dialect dropdown in the editor toolbar. The default is `generic` which handles most standard SQL.

### CLI

Use the `-d` or `--dialect` flag:

```bash
flowscope -d snowflake queries/*.sql
flowscope --dialect bigquery analytics.sql
```

### API

Pass the dialect in the request:

```typescript
const result = await analyzeSql({
  sql: 'SELECT * FROM orders',
  dialect: 'postgresql'
});
```

## Dialect-Specific Syntax

### PostgreSQL

```sql
-- Array syntax
SELECT array_agg(name) FROM users;
SELECT tags[1] FROM posts;

-- Dollar quoting
SELECT $tag$literal string$tag$;

-- Type casting
SELECT '2024-01-01'::date;
SELECT CAST(amount AS numeric(10,2));

-- Array operations
SELECT * FROM orders WHERE tags @> ARRAY['urgent'];
```

### Snowflake

```sql
-- Lateral flatten
SELECT f.value:name::string
FROM orders,
LATERAL FLATTEN(input => items) f;

-- Semi-structured data
SELECT data:customer:name FROM events;

-- Variant type
SELECT PARSE_JSON('{"key": "value"}');

-- Time travel
SELECT * FROM orders AT(TIMESTAMP => '2024-01-01'::timestamp);
```

### BigQuery

```sql
-- Struct and array
SELECT STRUCT(1 AS a, 'hello' AS b);
SELECT ARRAY<INT64>[1, 2, 3];

-- Unnest
SELECT * FROM UNNEST([1, 2, 3]) AS num;

-- Safe navigation
SELECT SAFE.PARSE_DATE('%Y-%m-%d', date_str);

-- Backtick identifiers
SELECT * FROM `project.dataset.table`;
```

### DuckDB

```sql
-- List comprehension
SELECT [x * 2 FOR x IN [1, 2, 3]];

-- Struct access
SELECT struct.field FROM data;

-- Positional joins
SELECT * FROM t1 POSITIONAL JOIN t2;

-- Friendly SQL
SELECT * FROM 'data.parquet';
SELECT * FROM read_csv_auto('file.csv');
```

### MySQL

```sql
-- Backtick identifiers
SELECT `column` FROM `table`;

-- LIMIT syntax
SELECT * FROM orders LIMIT 10, 20;

-- String functions
SELECT CONCAT_WS('-', year, month, day);

-- INSERT ... ON DUPLICATE KEY
INSERT INTO t (id, val) VALUES (1, 'a')
ON DUPLICATE KEY UPDATE val = VALUES(val);
```

### Redshift

```sql
-- DISTKEY and SORTKEY
CREATE TABLE orders (
    id INT,
    date DATE SORTKEY
) DISTSTYLE KEY DISTKEY(id);

-- COPY command
COPY orders FROM 's3://bucket/data'
CREDENTIALS 'aws_iam_role=...'
FORMAT AS PARQUET;

-- Spectrum external tables
SELECT * FROM spectrum.external_table;
```

## Identifier Quoting

Different dialects use different quoting styles:

| Dialect | Quote Style | Example |
|---------|-------------|---------|
| PostgreSQL | Double quotes | `"Column Name"` |
| MySQL | Backticks | `` `Column Name` `` |
| BigQuery | Backticks | `` `project.dataset.table` `` |
| SQL Server | Brackets | `[Column Name]` |
| ANSI | Double quotes | `"Column Name"` |

FlowScope normalizes identifiers internally for lineage tracking.

## Function Support

FlowScope recognizes dialect-specific functions:

### Aggregations

| Function | Dialects |
|----------|----------|
| `ARRAY_AGG` | PostgreSQL, BigQuery, Snowflake |
| `STRING_AGG` | PostgreSQL, BigQuery |
| `GROUP_CONCAT` | MySQL |
| `LISTAGG` | Snowflake, Redshift |
| `LIST` | DuckDB |

### Date Functions

| Function | Dialects |
|----------|----------|
| `DATE_TRUNC` | PostgreSQL, Snowflake, BigQuery, DuckDB |
| `DATE_PART` | PostgreSQL, Snowflake, Redshift |
| `EXTRACT` | All dialects |
| `DATEDIFF` | Snowflake, MySQL, SQL Server |
| `DATE_SUB` | BigQuery, MySQL |

### String Functions

| Function | Dialects |
|----------|----------|
| `CONCAT` | All dialects |
| `SUBSTRING` | ANSI standard |
| `SUBSTR` | Oracle-style dialects |
| `SPLIT` | BigQuery, Snowflake |
| `REGEXP_EXTRACT` | BigQuery |
| `REGEXP_MATCHES` | PostgreSQL |

## Limitations

### Unsupported Syntax

Some dialect features produce parsing warnings:

- Procedural code (stored procedures, functions with bodies)
- Dialect-specific hints and pragmas
- Administrative commands (GRANT, REVOKE)
- Exotic statement types (EXPLAIN, ANALYZE)

FlowScope skips unsupported statements and continues with the rest.

### Generic Dialect

When using the `generic` dialect:

- Only ANSI-standard syntax is guaranteed
- Dialect-specific functions may not be recognized
- Some valid SQL may produce parse errors

Always select the specific dialect when known for best results.

## Dialect Detection

FlowScope does not auto-detect dialects. Common indicators to help you choose:

| Indicator | Likely Dialect |
|-----------|---------------|
| Backtick identifiers | MySQL, BigQuery |
| `::` type casts | PostgreSQL, DuckDB |
| `FLATTEN` | Snowflake |
| `UNNEST` | BigQuery |
| `DISTKEY` | Redshift |
| Dollar quoting | PostgreSQL |
