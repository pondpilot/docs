---
title: SQL Editor
description: Write and execute SQL queries with syntax highlighting, autocomplete, and formatting.
sidebar:
  order: 1
---

PondPilot's SQL editor is built for productivity with syntax highlighting, intelligent autocomplete, and full DuckDB SQL support.

## Editor Features

#### Syntax Highlighting

The editor provides full SQL syntax highlighting powered by CodeMirror:

- Keywords (`SELECT`, `FROM`, `WHERE`, etc.)
- Functions (`COUNT`, `SUM`, `AVG`, etc.)
- Strings, numbers, and comments
- Table and column references

<!-- TODO: Add screenshot of syntax highlighting -->
<!-- Screenshot placeholder -->

### Autocomplete

Start typing to get intelligent suggestions:

- **Table names** from your data sources
- **Column names** based on context
- **DuckDB functions** with signatures
- **Keywords** and SQL clauses

Press **Tab** or **Enter** to accept a suggestion.

<!-- TODO: Add screenshot of autocomplete -->
<!-- Screenshot placeholder -->

### Function Tooltips

Hover over any DuckDB function to see:

- Function signature
- Parameter descriptions
- Return type
- Example usage

<!-- TODO: Add screenshot of function tooltip -->
<!-- Screenshot placeholder -->

## Executing Queries

#### Run Entire Script

Press **Ctrl+Enter** (or **⌘+Enter** on Mac) to execute all statements in your script.

Multiple statements are executed in order:

```sql
-- All three statements run sequentially
CREATE TABLE temp AS SELECT * FROM data;
UPDATE temp SET status = 'processed';
SELECT * FROM temp;
```

### Run Statement Under Cursor

Press **Ctrl+Shift+Enter** to execute only the statement where your cursor is positioned.

This is useful for:
- Testing individual queries in a larger script
- Re-running a specific statement
- Debugging step by step

<!-- TODO: Add screenshot showing cursor position -->
<!-- Screenshot placeholder -->

### Execution Feedback

After running a query:

- **Success** - Results appear in the table below
- **Error** - Error message with line number and details
- **Timing** - Execution duration displayed

## Query Results

#### Results Table

Results display in an interactive table:

| Feature | Description |
|---------|-------------|
| Sort | Click column headers |
| Filter | Filter by column values |
| Paginate | Navigate large result sets |
| Copy | Select and copy cells |
| Resize | Drag column borders |

<!-- TODO: Add screenshot of results table -->
<!-- Screenshot placeholder -->

### NULL Values

NULL values are clearly indicated with a distinct style, making them easy to distinguish from empty strings.

### Data Types

Column headers show the data type:

```
name (VARCHAR) | age (INTEGER) | created_at (TIMESTAMP)
```

## Editor Customization

#### Font Settings

Customize the editor font in **Settings → Appearance**:

- **Font size** - Adjust text size
- **Font weight** - Light, regular, semibold, or bold

<!-- TODO: Add screenshot of font settings -->
<!-- Screenshot placeholder -->

### Format on Run

Enable automatic SQL formatting when executing queries:

1. Open **Settings → Appearance**
2. Toggle "Format on Run"

When enabled, your SQL is automatically formatted before execution.

## Script Management

#### Creating Scripts

Create new scripts using:

- **Ctrl+K** → "New SQL Script"
- Click the **+** button in the tab bar
- Spotlight → type a name for your script

### Naming Scripts

Click the script name in the tab to rename it. Scripts are auto-saved with their names.

### Script Storage

Scripts are automatically saved to your browser's IndexedDB:

- **Persistent** - Scripts survive browser restarts
- **Automatic** - No manual save needed
- **Per-browser** - Scripts are specific to your browser profile

### Importing SQL Files

Import existing `.sql` files:

1. Press **Ctrl+I** or Spotlight → "Import SQL Files"
2. Select one or more `.sql` files
3. Each file opens as a new script tab

### Exporting Scripts

Export all your scripts as a ZIP archive:

1. Open **Settings → Saved Data**
2. Click "Export All Queries"
3. Download the ZIP file

## Working with Tabs

#### Tab Management

- **Multiple tabs** - Work on multiple scripts simultaneously
- **Reorder** - Drag tabs to rearrange
- **Close** - Click the X or middle-click
- **Close others** - Right-click → "Close Other Tabs"

### Tab Types

| Tab Type | Icon | Description |
|----------|------|-------------|
| Script | 📝 | SQL query editor |
| Table | 📊 | Data source preview |
| Comparison | ⚖️ | Data comparison results |

## Error Handling

#### Syntax Errors

Errors are highlighted with:

- Red underline on the problematic code
- Error message with line number
- Suggested fix (when available)

<!-- TODO: Add screenshot of error display -->
<!-- Screenshot placeholder -->

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Table not found | Table doesn't exist or isn't loaded | Check Data Explorer for available tables |
| Column not found | Typo or wrong table | Use autocomplete for column names |
| Syntax error | Invalid SQL | Check DuckDB documentation |

## DuckDB SQL Reference

PondPilot uses DuckDB, which supports standard SQL plus many extensions:

### Useful Functions

```sql
-- Read files directly
SELECT * FROM read_csv('file.csv');
SELECT * FROM read_parquet('file.parquet');
SELECT * FROM read_json('file.json');

-- Export results
COPY (SELECT * FROM data) TO 'output.parquet';

-- Describe tables
DESCRIBE my_table;
SHOW TABLES;

-- String functions
SELECT string_agg(name, ', ') FROM users;

-- Window functions
SELECT *, ROW_NUMBER() OVER (PARTITION BY category) FROM sales;
```

### DuckDB Extensions

PondPilot includes common DuckDB extensions:

- **parquet** - Parquet file support
- **json** - JSON functions
- **excel** - Excel file reading

For complete DuckDB SQL reference, see [DuckDB Documentation](https://duckdb.org/docs/sql/introduction).
