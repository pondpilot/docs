---
title: Schema Browser
description: Visualize your database schema, tables, and relationships.
sidebar:
  order: 3
---

The Schema Browser allows you to visualize your database structure, relationships between tables, and column details in an interactive graph.

## Opening the Schema Browser

To open the Schema Browser:

1.  Open the **Data Explorer** sidebar.
2.  Right-click on a database or schema.
3.  Select **View Schema**.

Alternatively, you can use the **Spotlight** menu (**Ctrl+K**) and search for "Schema".

## Visualizing Relationships

The Schema Browser automatically detects and visualizes foreign key relationships between tables.

-   **Nodes**: Each table is represented as a node, listing its columns and data types.
-   **Edges**: Lines connect related columns (Foreign Keys).
-   **Highlighting**: Click on a table or relationship line to highlight the connected elements and dim the rest of the graph.

## Layout

Toggle between different layout orientations to best fit your screen or schema structure:

-   **Vertical Layout (TB)**: Arranges tables from top to bottom.
-   **Horizontal Layout (LR)**: Arranges tables from left to right.

## Navigation

-   **Zoom**: Use the mouse wheel or trackpad to zoom in and out.
-   **Pan**: Click and drag on the background to move around the graph.
-   **Minimap**: Use the minimap in the corner to quickly navigate large schemas.
-   **Fit View**: Automatically adjusts the zoom and position to fit all tables on the screen.

## Features

### Interactive Exploration

-   **Column Details**: See column names and data types at a glance.
-   **Relationship Tracing**: Hover over or click relationship lines to see exactly which columns are linked.
-   **Dark Mode**: The schema browser fully supports light and dark themes, automatically adapting to your application settings.
