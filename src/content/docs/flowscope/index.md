---
title: FlowScope
description: A privacy-first SQL lineage analysis engine that traces how data flows through your queries.
---

FlowScope analyzes SQL queries to produce detailed lineage graphs showing how tables, CTEs, and columns flow through data transformations. All processing happens in your browser via WebAssembly—your SQL never leaves your device.

## What is SQL Lineage?

SQL lineage maps the relationships between data sources and outputs in your queries. Understanding lineage helps you:

- **Impact Analysis** - Know which downstream tables are affected when you change a column
- **Data Debugging** - Trace where values come from when results are unexpected
- **Compliance & Auditing** - Document data flows for regulatory requirements
- **Documentation** - Visualize how your data pipeline transforms information

## Key Features

- **100% Client-Side** - All analysis happens in your browser via WebAssembly
- **Privacy First** - Your SQL never leaves your device
- **Column-Level Lineage** - Track individual columns through JOINs, aggregations, and transformations
- **Table-Level Lineage** - Understand source-to-target relationships at a glance
- **13 SQL Dialects** - PostgreSQL, Snowflake, BigQuery, DuckDB, Redshift, and more
- **CTE Support** - Full tracking through Common Table Expressions
- **dbt/Jinja Support** - Analyze templated SQL with variable substitution

## How It Works

```
┌───────────────────────────────────────────────────────────────┐
│                       Your Browser                             │
│  ┌─────────────┐   ┌─────────────────┐   ┌────────────────┐   │
│  │  SQL Input  │ → │ FlowScope WASM  │ → │ Lineage Graph  │   │
│  │             │   │    Engine       │   │ Visualization  │   │
│  └─────────────┘   └─────────────────┘   └────────────────┘   │
│                           ↓                                    │
│                    ┌──────────────┐                           │
│                    │   Exports    │                           │
│                    │ JSON/Mermaid │                           │
│                    │  HTML/Excel  │                           │
│                    └──────────────┘                           │
└───────────────────────────────────────────────────────────────┘
```

1. Paste or type your SQL query
2. FlowScope parses and analyzes the query locally
3. View the interactive lineage graph
4. Export in your preferred format

## Use Cases

- **Data Engineers** - Understand data pipelines before making changes
- **Analytics Teams** - Trace metric definitions back to source tables
- **Data Governance** - Document PII flows and data transformations
- **Code Reviews** - Quickly understand what a complex query does
- **Onboarding** - Help new team members understand existing queries

## Quick Links

import { Card, CardGrid } from '@astrojs/starlight/components';

<CardGrid>
  <Card title="Getting Started" icon="rocket">
    Analyze your first SQL query and view the lineage graph.

    [Get started →](/flowscope/getting-started/)
  </Card>
  <Card title="Analyzing Queries" icon="pencil">
    Input methods, query validation, and supported statement types.

    [Learn more →](/flowscope/analyzing-queries/)
  </Card>
  <Card title="Lineage Visualization" icon="random">
    Reading the graph, node types, and navigation controls.

    [Learn more →](/flowscope/lineage-visualization/)
  </Card>
  <Card title="SQL Dialects" icon="document">
    Supported dialects and syntax differences.

    [View dialects →](/flowscope/dialects/)
  </Card>
  <Card title="Advanced Patterns" icon="puzzle">
    CTEs, dbt templates, complex transformations.

    [Learn more →](/flowscope/advanced/)
  </Card>
  <Card title="CLI Reference" icon="seti:shell">
    Analyze SQL files from the command line.

    [View CLI →](/flowscope/cli/)
  </Card>
</CardGrid>

## Available Interfaces

FlowScope is available in multiple forms:

| Interface | Description |
|-----------|-------------|
| [Web App](https://flowscope.pondpilot.io) | Interactive browser-based analysis |
| [CLI Tool](/flowscope/cli/) | Command-line analysis with multiple output formats |
| [NPM Package](/flowscope/api/) | Embed lineage analysis in your applications |
| VS Code Extension | Analyze SQL directly in your editor |
