---
title: Getting Started
description: Learn how to add the PondPilot Widget to your site.
sidebar:
  order: 2
---

This guide will walk you through adding the PondPilot Widget to your webpage.

## Basic Usage

The widget is designed to be "drop-in". By default, it looks for `<pre>` elements with the class `pondpilot-snippet`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>PondPilot Widget Demo</title>
</head>
<body>
    <h1>My SQL Blog</h1>

    <p>Here is an interactive query:</p>

    <!-- 1. Create a container with the target class -->
    <pre class="pondpilot-snippet">
    SELECT * FROM generate_series(1, 5) AS t(n);
    </pre>

    <!-- 2. Load the widget script -->
    <script src="https://unpkg.com/pondpilot-widget"></script>
</body>
</html>
```

## Using with Data Files

The widget shines when querying data files like Parquet, CSV, or JSON.

### Loading Remote Files

You can query files directly via URL:

```sql
SELECT * FROM 'https://example.com/data.parquet' LIMIT 10;
```

### Relative Paths

The widget automatically resolves relative paths based on the current page URL or a configured `baseUrl`.

If you have a file `sales.parquet` in the same directory as your HTML file:

```html
<pre class="pondpilot-snippet">
SELECT * FROM 'sales.parquet';
</pre>
```

Supported formats include:
- `'data.parquet'`
- `'./data.parquet'`
- `'/data.parquet'`

## Bundler Integration

If you are using a modern JavaScript framework or bundler:

1.  **Install the package:**
    ```bash
    npm install pondpilot-widget
    ```

2.  **Import it:**
    ```javascript
    import 'pondpilot-widget';
    ```

    The import automatically registers `window.PondPilot` and runs the auto-initializer (unless disabled).

## Keyboard Shortcuts

- **Ctrl + Enter** (or **Cmd + Enter** on Mac): Run the current query when the editor is focused.

## Next Steps

- Customize the look and feel in [Configuration](/widget/configuration/).
- Learn about the [JavaScript API](/widget/api/).
- Explore [Framework Integration](/widget/frameworks/) for React and Vue.