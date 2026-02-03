---
title: Export & Import
description: Export query results and import SQL scripts.
sidebar:
  order: 2
---

PondPilot supports exporting query results in multiple formats and importing SQL scripts from files.

## Exporting Query Results

After running a query, export your results:

1. Click the **Export** button in the results panel
2. Select your desired format
3. Configure format-specific options
4. Click **Export** to download

<!-- TODO: Add screenshot of export dialog -->
<!-- Screenshot placeholder -->

## Export Formats

#### CSV

Comma-separated values for spreadsheet compatibility.

| Option | Description |
|--------|-------------|
| Delimiter | Character separating values (`,` `;` `\t`) |
| Include header | Add column names as first row |

```csv
name,age,city
Alice,30,New York
Bob,25,Los Angeles
```

### TSV

Tab-separated values.

| Option | Description |
|--------|-------------|
| Delimiter | Tab character (default) |
| Include header | Add column names as first row |

### Excel (XLSX)

Microsoft Excel spreadsheet format.

| Option | Description |
|--------|-------------|
| Sheet name | Name of the worksheet |
| Include header | Add column names as first row |

Features:
- Proper data type formatting
- Auto-sized columns
- Excel-compatible dates and numbers

### JSON

JSON array of objects.

```json
[
  {"name": "Alice", "age": 30, "city": "New York"},
  {"name": "Bob", "age": 25, "city": "Los Angeles"}
]
```

| Option | Description |
|--------|-------------|
| Pretty print | Formatted with indentation |
| Include nulls | Include null values in output |

### Parquet

Apache Parquet columnar format.

Best for:
- Large datasets
- Preserving data types
- Interoperability with data tools

### SQL

SQL INSERT statements.

| Option | Description |
|--------|-------------|
| Table name | Name for CREATE TABLE |
| Include CREATE TABLE | Add table definition |
| Include data types | Type hints in INSERTs |

```sql
CREATE TABLE exported_data (
  name VARCHAR,
  age INTEGER,
  city VARCHAR
);

INSERT INTO exported_data VALUES ('Alice', 30, 'New York');
INSERT INTO exported_data VALUES ('Bob', 25, 'Los Angeles');
```

### XML

XML document format.

| Option | Description |
|--------|-------------|
| Root element | Name of root element |
| Row element | Name of each row element |

```xml
<?xml version="1.0" encoding="UTF-8"?>
<data>
  <row>
    <name>Alice</name>
    <age>30</age>
    <city>New York</city>
  </row>
  <row>
    <name>Bob</name>
    <age>25</age>
    <city>Los Angeles</city>
  </row>
</data>
```

### Markdown

Markdown table format.

| Option | Description |
|--------|-------------|
| GitHub-flavored | Use GFM table syntax |
| Column alignment | Left, center, or right |

```markdown
| name  | age | city        |
|-------|-----|-------------|
| Alice | 30  | New York    |
| Bob   | 25  | Los Angeles |
```

## Large Dataset Export

For datasets over 1,000,000 rows, PondPilot shows a warning:

- Export may take significant time
- Consider filtering data first
- Browser may become unresponsive

:::tip[Large Exports]
For very large exports, consider:
1. Adding a `LIMIT` clause to your query
2. Filtering to specific date ranges
3. Exporting in batches
:::

## Bulk Export

Export all your saved queries as a ZIP archive:

1. Open **Settings** (**Ctrl+K** → Settings)
2. Navigate to **Saved Data**
3. Click **Export All Queries**
4. Download the ZIP file

The archive contains:
- All SQL scripts as `.sql` files
- Organized by script name
- UTF-8 encoded

<!-- TODO: Add screenshot of bulk export -->
<!-- Screenshot placeholder -->

## Importing SQL Scripts

Import existing SQL files into PondPilot:

### Method 1: Keyboard Shortcut

1. Press **Ctrl+I** (or **⌘+I** on Mac)
2. Select one or more `.sql` files
3. Each file opens as a new script tab

### Method 2: Spotlight

1. Press **Ctrl+K** to open Spotlight
2. Search for "Import SQL"
3. Select files to import

### Method 3: Drag and Drop

1. Drag `.sql` files into PondPilot
2. Files open as new script tabs

<!-- TODO: Add screenshot of import dialog -->
<!-- Screenshot placeholder -->

## Copy to Clipboard

Quickly copy results without downloading:

1. Select cells in the results table
2. Press **Ctrl+C** (or **⌘+C**)
3. Paste into any application

Or copy the entire result:

1. Click **Copy** button in results panel
2. Choose format (CSV, JSON, etc.)
3. Paste anywhere

## Export History

PondPilot remembers your export preferences:

- Last used format
- Format-specific options
- These persist across sessions

## Using Exports with DuckDB

Export Parquet files for use with other DuckDB tools:

```sql
-- In PondPilot: export to Parquet

-- In another tool:
SELECT * FROM 'exported_data.parquet';
```

## Troubleshooting

### "Export failed"

- Check available disk space
- Try a smaller dataset
- Use a different format

### "File too large"

- Add filters to reduce data
- Export in chunks
- Use Parquet for compression

### "Excel can't open file"

- Ensure file isn't corrupted
- Check row count (Excel limit: ~1M rows)
- Try CSV format instead

### "Import not working"

- Verify file is valid SQL
- Check file encoding (UTF-8 recommended)
- Ensure file extension is `.sql`
