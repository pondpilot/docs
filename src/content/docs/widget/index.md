---
title: PondPilot Widget
description: Transform static SQL code blocks into interactive snippets powered by DuckDB WASM.
sidebar:
  order: 1
---

The **PondPilot Widget** transforms static SQL code blocks on your website or documentation into interactive, executable SQL editors powered by [DuckDB WASM](https://github.com/duckdb/duckdb-wasm).

It runs entirely in the browser—no backend required.

## Key Features

- 🦆 **DuckDB in the Browser** - Full SQL analytics engine running locally via WebAssembly.
- ✨ **Zero Backend** - Secure and private; data never leaves the user's device.
- 🎨 **Syntax Highlighting** - Beautiful SQL formatting with customizable themes.
- ⚡ **Instant Results** - Execute queries immediately.
- 🔧 **Easy Integration** - Works with any static site, blog, or documentation framework.
- 🧩 **Configurable** - Extensive API for initialization, theming, and lifecycle management.
- 📁 **Relative Paths** - Automatically resolves relative paths to Parquet/CSV files.

## Live Demo

See the widget in action at [widget.pondpilot.io](https://widget.pondpilot.io).

## Installation

#### CDN (Recommended)

The easiest way to get started is via a CDN. Add this script tag to your page:

```html
<!-- Latest version -->
<script src="https://unpkg.com/pondpilot-widget"></script>
```

### NPM

For projects using a bundler (Webpack, Vite, etc.):

```bash
npm install pondpilot-widget
```

## Quick Start

1.  **Add the script:**

    ```html
    <script src="https://unpkg.com/pondpilot-widget"></script>
    ```

2.  **Mark your SQL blocks:**
    Add the `pondpilot-snippet` class to any `<pre>` tag containing SQL.

    ```html
    <pre class="pondpilot-snippet">
    SELECT
      'Hello World' as greeting,
      42 as answer,
      CURRENT_DATE as today;
    </pre>
    ```

3.  **That's it!** The widget will automatically initialize on page load.

## Browser Support

- Chrome/Edge 88+
- Firefox 89+
- Safari 15+

Requires a browser with WebAssembly and Web Worker support.
