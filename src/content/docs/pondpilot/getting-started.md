---
title: Getting Started
description: Learn how to use PondPilot for data exploration and analysis.
sidebar:
  order: 1
---

Get up and running with PondPilot in minutes. This guide walks you through loading data, writing queries, and exploring results.

## Opening PondPilot

Visit [app.pondpilot.io](https://app.pondpilot.io) in your browser. No account or installation required.

For the best experience, use **Chrome** or **Edge** which support persistent file access across sessions.

<!-- TODO: Add screenshot of initial PondPilot interface -->
<!-- Screenshot placeholder -->

## Loading Your First Data

#### From Local Files

1. Press **Ctrl+F** (or **⌘+F** on Mac) to open the file picker
2. Select one or more files (CSV, Parquet, JSON, Excel, or DuckDB)
3. Your files appear in the **Data Explorer** on the left

<!-- TODO: Add screenshot of file picker -->
<!-- Screenshot placeholder -->

:::tip[Supported Formats]
- **CSV/TSV** - Comma or tab-separated values
- **JSON** - JSON arrays or newline-delimited JSON
- **Parquet** - Apache Parquet files
- **XLSX** - Excel spreadsheets (each sheet becomes a table)
- **DuckDB** - DuckDB database files
:::

### From URLs

Load data directly from a URL:

```sql
SELECT * FROM 'https://example.com/data.parquet';
```

For URLs without CORS headers, PondPilot automatically uses the [CORS Proxy](/cors-proxy/overview/).

## Writing Your First Query

1. Click **New Script** or press **Ctrl+K** → "New SQL Script"
2. Write your SQL query:

```sql
SELECT * FROM my_data LIMIT 100;
```

3. Press **Ctrl+Enter** to execute

<!-- TODO: Add screenshot of query execution -->
<!-- Screenshot placeholder -->

### Query Tips

- **Run entire script**: `Ctrl+Enter` / `⌘+Enter`
- **Run statement under cursor**: `Ctrl+Shift+Enter` / `⌘+Shift+Enter`
- **Open AI assistant**: `Ctrl+I` / `⌘+I`

## Exploring Results

Query results appear in an interactive table below your editor:

- **Sort columns** - Click column headers
- **Filter data** - Use column filters
- **Navigate pages** - Use pagination controls for large results
- **Copy cells** - Select and copy individual values

<!-- TODO: Add screenshot of results table -->
<!-- Screenshot placeholder -->

## Using the Data Explorer

The left sidebar shows all your loaded data sources:

- **Tables** - Your loaded files and database tables
- **Columns** - Expand tables to see column names and types
- **Search** - Use the search box to find tables or columns

**Right-click** on any table for quick actions:
- Open in new tab
- Compare with another table
- View schema details

<!-- TODO: Add screenshot of data explorer -->
<!-- Screenshot placeholder -->

## Using the Spotlight Menu

Press **Ctrl+K** (or **⌘+K**) to open Spotlight - your command center for:

- Creating new scripts
- Adding data sources
- Navigating to tables and columns
- Accessing settings
- Opening comparison tools

<!-- TODO: Add screenshot of spotlight menu -->
<!-- Screenshot placeholder -->

## Exporting Results

After running a query, export your results:

1. Click the **Export** button in the results panel
2. Choose your format (CSV, Excel, JSON, Parquet, SQL, Markdown)
3. Configure export options
4. Download your file

See [Export & Import](/pondpilot/export/) for detailed options.

## Next Steps

Now that you're familiar with the basics:

- [Connect to more data sources](/pondpilot/data-sources/) - Files, databases, and remote URLs
- [Master the SQL editor](/pondpilot/sql-editor/) - Autocomplete, formatting, and more
- [Use AI assistance](/pondpilot/ai-assistant/) - Natural language to SQL
- [Compare datasets](/pondpilot/data-comparison/) - Find differences between tables
- [Learn keyboard shortcuts](/pondpilot/keyboard-shortcuts/) - Work faster with hotkeys
