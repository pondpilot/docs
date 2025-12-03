---
title: Results Grid
description: Interact with query results using the data grid.
sidebar:
  order: 2
---

After executing a query, PondPilot displays the data in an interactive grid designed for exploration.

## Basic Interaction

- **Sort**: Click any column header to toggle ascending/descending sort.
- **Resize**: Drag the divider between column headers to resize columns.
- **Reorder**: Drag a column header left or right to reorder columns.

## Selection & Copy

- **Cell Selection**: Click a single cell to select it.
- **Range Selection**: Click and drag to select a block of cells.
- **Copy**: Press **Ctrl+C** (or **Cmd+C**) to copy the selected cells to your clipboard. The data is copied as tab-separated values (TSV), ready to paste into Excel or Google Sheets.

## Filtering

You can filter results directly in the grid without rewriting your SQL:

1. Hover over a column header.
2. Click the **Filter** icon (funnel).
3. Enter your criteria (e.g., `> 100`, `contains "text"`).

*Note: Grid filters apply to the **current result set**. To filter the source data (and reduce memory usage), modify your SQL query instead.*

## Pagination

For large result sets, data is paginated to maintain performance. Use the controls at the bottom of the grid to:
- Navigate between pages.
- Change the number of rows per page (10, 25, 50, 100).

## Exporting Results

To export the current view:
1. Click the **Export** button in the toolbar above the grid.
2. Choose your format:
   - **CSV / TSV**: For spreadsheets.
   - **JSON**: For web apps.
   - **Markdown**: For documentation.
   - **Parquet**: For efficient storage.

See [Export & Import](/pondpilot/advanced/export-import/) for more details.
