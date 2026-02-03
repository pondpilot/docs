---
title: Local Files
description: Working with local files (CSV, Parquet, JSON, Excel) in PondPilot.
sidebar:
  order: 1
---

PondPilot allows you to analyze files stored on your local machine without uploading them to a server.

## Supported Formats

| Format | Extension | Description |
|--------|-----------|-------------|
| **Parquet** | `.parquet` | Highly recommended. Fast, compressed, and supports partial reading. |
| **CSV / TSV** | `.csv`, `.tsv` | Standard text formats. Auto-detects delimiters. |
| **JSON** | `.json` | Supports newline-delimited JSON (`.ndjson`) and standard arrays. |
| **Excel** | `.xlsx` | Reads worksheets as tables. |
| **DuckDB** | `.duckdb` | Full DuckDB database files. |

## Adding Files

#### Drag and Drop
Simply drag files from your computer into the PondPilot window. They will appear in the **Data Explorer** sidebar.

### File Picker
1. Press **Ctrl+F** (or **Cmd+F**).
2. Or click the **+** icon in the Data Explorer.
3. Select "Add Local File".

### Folder Access (Chrome/Edge)
In Chromium-based browsers, you can add an entire folder. This grants PondPilot permission to read any file in that directory, which persists across sessions.

1. Open **Spotlight** (**Ctrl+K**).
2. Choose "Add Folder".
3. Select your data folder.

## Querying Local Files

Once added, files act like tables.

```sql
-- Query a file by its name in the explorer
SELECT * FROM sales_data;

-- Join two local files
SELECT 
    orders.id, 
    customers.name 
FROM orders 
JOIN customers ON orders.customer_id = customers.id;
```

## Persistence

PondPilot uses the File System Access API (on supported browsers) to retain access to your files.
- **Reloading**: When you refresh the page, your files remain available.
- **Security**: You must re-grant permission upon reload if the browser requires it (usually a simple prompt).
- **Privacy**: Files are read directly from your disk; no copy is made.

:::note[Firefox/Safari Users]
These browsers do not fully support persistent file handles. You may need to re-add your files after refreshing the page.
:::
