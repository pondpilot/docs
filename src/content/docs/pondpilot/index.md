---
title: PondPilot
description: A blazing-fast, privacy-first data exploration platform that runs entirely in your browser.
---

PondPilot is a powerful data analytics platform powered by DuckDB-WASM. Analyze local and remote data with SQL, get AI-powered assistance, and compare datasets - all without your data ever leaving your browser.

## Key Features

- **100% Client-Side** - All processing happens in your browser using DuckDB-WASM
- **Privacy First** - Your data never leaves your device
- **Zero Setup** - No installation, no server, no configuration
- **AI-Powered** - Natural language to SQL with OpenAI or Claude
- **Multiple Data Sources** - CSV, Parquet, JSON, Excel, DuckDB databases
- **Data Comparison** - Compare tables and queries with advanced algorithms

## Quick Links

import { Card, CardGrid } from '@astrojs/starlight/components';

<CardGrid>
  <Card title="Getting Started" icon="rocket">
    Learn the basics and start exploring data in minutes.

    [Read guide →](/pondpilot/getting-started/)
  </Card>
  <Card title="Data Sources" icon="document">
    Connect to files, databases, and remote sources.

    [Learn more →](/pondpilot/data-connections/local-files/)
  </Card>
  <Card title="SQL Editor" icon="pencil">
    Write and execute SQL with syntax highlighting and autocomplete.

    [Learn more →](/pondpilot/exploration/sql-editor/)
  </Card>
  <Card title="AI Assistant" icon="star">
    Get AI-powered help writing and optimizing SQL queries.

    [Learn more →](/pondpilot/exploration/ai-assistant/)
  </Card>
  <Card title="Data Comparison" icon="random">
    Compare datasets with powerful diff algorithms.

    [Learn more →](/pondpilot/advanced/data-comparison/)
  </Card>
  <Card title="Schema Browser" icon="puzzle">
    Visualize tables and relationships in an interactive graph.

    [Learn more →](/pondpilot/exploration/schema-browser/)
  </Card>
  <Card title="Keyboard Shortcuts" icon="list-format">
    Master PondPilot with keyboard shortcuts.

    [View shortcuts →](/pondpilot/keyboard-shortcuts/)
  </Card>
</CardGrid>

## How It Works

```
┌─────────────────────────────────────────────────────────┐
│                    Your Browser                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ Local Files │  │   DuckDB    │  │  AI Assistant   │  │
│  │ CSV/Parquet │→ │    WASM     │← │ (API calls only)│  │
│  │ JSON/Excel  │  │   Engine    │  │                 │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│         ↓               ↓                               │
│  ┌─────────────────────────────────────────────────┐    │
│  │              Results & Exports                   │    │
│  │         (Everything stays local)                 │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## Browser Support

| Browser | Support Level |
|---------|--------------|
| Chrome / Edge | Full support with file persistence |
| Firefox | Core features, session-only file access |
| Safari | Core features, session-only file access |

## Privacy & Security

PondPilot is designed with privacy as a core principle:

- **Data stays local** - Files are processed directly in your browser
- **No server uploads** - Your data is never sent to any server
- **AI privacy** - Only schema and queries are sent to AI providers, never your actual data
- **Read-only** - PondPilot never modifies your original files
