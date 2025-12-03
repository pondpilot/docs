---
title: Configuration
description: Configure the PondPilot Widget via globals, options, or data attributes.
sidebar:
  order: 3
---

You can configure the widget globally via JavaScript or per-instance via HTML data attributes.

## Global Configuration

Set global defaults before loading the widget script using `window.PONDPILOT_CONFIG`.

```html
<script>
  window.PONDPILOT_CONFIG = {
    theme: 'dark',
    autoInit: true,
    baseUrl: 'https://my-data-server.com/assets',
    initQueries: ["INSTALL httpfs;", "LOAD httpfs;"]
  };
</script>
<script src="https://unpkg.com/pondpilot-widget"></script>
```

### Configuration Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `selector` | `string` | `".pondpilot-snippet, ..."` | CSS selector for elements to auto-initialize. |
| `baseUrl` | `string` | `https://app.pondpilot.io` | Base URL for resolving relative file paths. |
| `theme` | `string` | `"light"` | Default theme (`"light"`, `"dark"`, `"auto"`, or custom). |
| `autoInit` | `boolean` | `true` | Automatically initialize widgets on DOM ready. |
| `editable` | `boolean` | `true` | Allow users to edit the SQL code. |
| `showPoweredBy` | `boolean` | `true` | Show the "Powered by PondPilot" footer. |
| `initQueries` | `string[]` | `[]` | SQL statements to run once when DuckDB loads (e.g., loading extensions). |
| `resetQueries` | `string[]` | `[]` | SQL statements to run every time the "Reset" button is clicked. |

## Data Attributes

Override configuration for specific widgets using `data-` attributes on the `<pre>` element.

```html
<pre
  class="pondpilot-snippet"
  data-theme="dark"
  data-editable="false"
  data-base-url="https://cdn.example.com"
  data-init-queries='["LOAD spatial;"]'
>
SELECT * FROM 'maps/world.parquet';
</pre>
```

### Supported Attributes

| Attribute | Value Example | Description |
| :--- | :--- | :--- |
| `data-theme` | `"dark"`, `"sunset"` | Override the theme. |
| `data-base-url` | `"https://cdn.com"` | Override base URL for file paths. |
| `data-editable` | `"false"` | Disable editing for this snippet. |
| `data-show-powered-by`| `"false"` | Hide the branding footer. |
| `data-init-queries` | JSON array or string | Specific init queries for this widget. |
| `data-reset-queries` | JSON array or string | Specific reset queries for this widget. |

## Initialization Queries

Use `initQueries` to load DuckDB extensions or set up the environment before any user queries run. These run **once** per page load (or per shared DuckDB instance).

```javascript
window.PONDPILOT_CONFIG = {
  initQueries: [
    "INSTALL httpfs;",
    "LOAD httpfs;",
    "SET s3_region='us-east-1';"
  ]
};
```

## Reset Queries

Use `resetQueries` to clean up state when a user clicks "Reset". This is useful if your example creates tables that need to be dropped to run the example again cleanly.

```html
<pre
  class="pondpilot-snippet"
  data-reset-queries='["DROP TABLE IF EXISTS my_table;"]'
>
CREATE TABLE my_table AS SELECT 1;
SELECT * FROM my_table;
</pre>
```
