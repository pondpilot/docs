---
title: CLI Reference
description: Command-line interface for FlowScope SQL lineage analysis.
sidebar:
  order: 6
---

The FlowScope CLI analyzes SQL files from the command line, producing lineage in multiple output formats. It also includes a serve mode that runs an embedded web UI with file watching.

## Installation

```bash
# Using Cargo
cargo install flowscope-cli

# Or download from releases
# https://github.com/pondpilot/flowscope/releases
```

## Basic Usage

```bash
# Analyze a single file
flowscope query.sql

# Analyze multiple files
flowscope models/*.sql

# Read from stdin
cat query.sql | flowscope
echo "SELECT * FROM orders" | flowscope
```

## Options

### Dialect Selection

```bash
-d, --dialect <DIALECT>
```

SQL dialect for parsing. Options: `generic`, `ansi`, `postgresql`, `snowflake`, `bigquery`, `duckdb`, `redshift`, `mysql`, `mssql`, `sqlite`, `hive`, `databricks`, `clickhouse`

```bash
flowscope -d snowflake warehouse/*.sql
flowscope --dialect bigquery analytics.sql
```

### Output Format

```bash
-f, --format <FORMAT>
```

Output format. Options: `table`, `json`, `mermaid`, `html`, `sql`, `csv`, `xlsx`, `duckdb`

```bash
# Default: table format
flowscope query.sql

# JSON output
flowscope -f json query.sql > lineage.json

# Mermaid diagram
flowscope -f mermaid query.sql > lineage.mmd

# Excel workbook
flowscope -f xlsx -o report.xlsx queries/*.sql

# Interactive HTML report
flowscope -f html -o report.html query.sql
```

### View Mode

```bash
-v, --view <VIEW>
```

Lineage view mode. Options: `table`, `column`, `script`, `hybrid`

```bash
# Table-level lineage only
flowscope -v table query.sql

# Column-level lineage
flowscope -v column query.sql

# Script/file-level view
flowscope -v script models/*.sql
```

### Output File

```bash
-o, --output <FILE>
```

Write output to file instead of stdout.

```bash
flowscope -f json -o lineage.json query.sql
flowscope -f xlsx -o report.xlsx queries/*.sql
```

### Schema Metadata

```bash
-s, --schema <FILE>
```

Provide DDL file for column resolution.

```bash
flowscope -s schema.sql -v column query.sql
```

### Live Database Schema

```bash
--metadata-url <URL>
```

Fetch schema from a live database. Supports PostgreSQL, MySQL, and SQLite.

```bash
# PostgreSQL
flowscope --metadata-url postgres://user:pass@localhost/db query.sql

# MySQL
flowscope --metadata-url mysql://user:pass@localhost/db query.sql

# SQLite
flowscope --metadata-url sqlite:///path/to/database.db query.sql
```

### Template Mode

```bash
--template <MODE>
```

Enable template preprocessing. Options: `raw`, `jinja`, `dbt`

```bash
flowscope --template dbt models/*.sql
```

### Template Variables

```bash
--template-var <KEY=VALUE>
```

Set template variables for Jinja/dbt preprocessing.

```bash
flowscope --template dbt \
  --template-var target_schema=production \
  --template-var run_date=2024-01-01 \
  models/*.sql
```

## Serve Mode

Run an embedded web UI with file watching:

```bash
flowscope --serve [OPTIONS] [PATH]
```

### Serve Options

| Option | Description |
|--------|-------------|
| `--port <PORT>` | HTTP port (default: 8080) |
| `--watch <DIR>` | Directory to watch for changes |
| `--open` | Open browser automatically |

```bash
# Start server watching current directory
flowscope --serve --watch . --open

# Custom port
flowscope --serve --port 3000 --watch ./sql

# Watch multiple directories
flowscope --serve --watch models --watch macros
```

### REST API Endpoints

When running in serve mode:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check with version |
| `/api/analyze` | POST | Run lineage analysis |
| `/api/completion` | POST | Code completion |
| `/api/split` | POST | Split SQL into statements |
| `/api/files` | GET | List watched files |
| `/api/schema` | GET | Get schema metadata |
| `/api/export/:format` | POST | Export to format |
| `/api/config` | GET | Server configuration |

## Output Formats

### Table Format (Default)

Human-readable table output:

```
┌─────────────────────────────────────────────────────────────┐
│ Statement 1: SELECT                                         │
├─────────────────────────────────────────────────────────────┤
│ Sources: orders, customers                                  │
│ Target: (query result)                                      │
│                                                             │
│ Column Lineage:                                             │
│   customer_name ← customers.name                            │
│   total_amount  ← SUM(orders.amount)                        │
└─────────────────────────────────────────────────────────────┘
```

### JSON Format

Structured JSON for programmatic use:

```json
{
  "statements": [
    {
      "sql": "SELECT ...",
      "nodes": [...],
      "edges": [...],
      "issues": []
    }
  ],
  "summary": {
    "tables": 2,
    "columns": 4,
    "edges": 6
  }
}
```

### Mermaid Format

Diagram syntax for documentation:

```mermaid
graph LR
    orders[orders]
    customers[customers]
    output[Query Result]
    orders --> output
    customers --> output
```

### HTML Format

Self-contained HTML with interactive visualization. Includes the full React graph component.

### CSV Format

ZIP archive containing:
- `scripts.csv` - SQL statements
- `tables.csv` - Tables and columns
- `edges.csv` - Lineage relationships
- `issues.csv` - Validation issues

### Excel Format

Workbook with sheets for summary, lineage details, and issues.

### SQL Format

DuckDB-compatible DDL and INSERT statements for loading lineage into a database.

### DuckDB Format

Native DuckDB database file (requires native build, not WASM).

## Examples

### Basic Analysis

```bash
# Analyze and display
flowscope query.sql

# With column-level detail
flowscope -v column query.sql
```

### Export for Documentation

```bash
# Mermaid for markdown docs
flowscope -f mermaid -v table etl.sql > docs/lineage.mmd

# HTML report for sharing
flowscope -f html -o lineage-report.html queries/*.sql
```

### dbt Project Analysis

```bash
# Analyze dbt models
flowscope --template dbt \
  -d snowflake \
  -v column \
  models/**/*.sql

# With variables
flowscope --template dbt \
  --template-var target_schema=analytics \
  --template-var env=prod \
  -f html -o lineage.html \
  models/*.sql
```

### CI/CD Integration

```bash
# JSON output for parsing
flowscope -f json query.sql | jq '.summary'

# Check for issues
flowscope -f json query.sql | jq '.statements[].issues | length'
```

### Development Server

```bash
# Start development server
flowscope --serve --watch ./sql --port 8080 --open

# Server logs
# Listening on http://localhost:8080
# Watching: ./sql
# Press Ctrl+C to stop
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Parse error or invalid input |
| 2 | File not found or I/O error |
| 3 | Invalid options |
