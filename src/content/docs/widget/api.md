---
title: API Reference
description: JavaScript API for controlling the PondPilot Widget.
sidebar:
  order: 4
---

The widget exposes a global `window.PondPilot` object for advanced control.

## Global Methods

### `PondPilot.init(target?, options?)`

Initializes widgets on the page.

-   **target** (optional): CSS selector, HTMLElement, or NodeList. Defaults to `config.selector`.
-   **options** (optional): Configuration object to override defaults.

```javascript
// Initialize default selector
PondPilot.init();

// Initialize specific elements with options
PondPilot.init('.my-sql-block', { theme: 'dark' });
```

### `PondPilot.create(element, options?)`

Creates a single widget instance on a specific element. Returns the `Widget` instance.

```javascript
const el = document.getElementById('sql-1');
const widget = PondPilot.create(el, { editable: true });
```

### `PondPilot.destroy(target?)`

Destroys widget instances and restores original DOM elements.

```javascript
// Destroy all widgets
PondPilot.destroy();

// Destroy specific widgets
PondPilot.destroy('.sidebar .pondpilot-widget');
```

### `PondPilot.config(partial)`

Updates the global configuration.

```javascript
PondPilot.config({
  theme: 'auto',
  baseUrl: '/assets/data'
});
```

### `PondPilot.registerTheme(name, definition)`

Registers a custom theme. See [Theming](/widget/theming/) for details.

## Widget Instance

When using `PondPilot.create()` or `new PondPilot.Widget()`, you get an instance with the following methods:

### `widget.run()`

Executes the current SQL query in the editor.

### `widget.reset()`

Restores the original SQL code and executes any configured `resetQueries`.

### `widget.destroy()`

Cleanly removes the widget and restores the original HTML element.

## Custom Events

The widget emits DOM events that bubble up, allowing you to react to widget activity.

### `pondpilot:results`

Fired when a query successfully completes and results are available.

-   **detail.data**: Array of result rows (objects).
-   **detail.elapsed**: Execution time in milliseconds.
-   **detail.widget**: The widget DOM element.

**Example: Logging results**

```javascript
document.addEventListener('pondpilot:results', (e) => {
  console.log(`Query finished in ${e.detail.elapsed}ms`);
  console.log('Rows returned:', e.detail.data.length);
  console.log('First row:', e.detail.data[0]);
});
```

**Example: Custom Visualization**

You can use this event to build charts or maps from the query results, hiding the default table output if desired (via CSS) or augmenting it.

```javascript
document.addEventListener('pondpilot:results', (e) => {
  const { data } = e.detail;
  // Pass data to a charting library like Chart.js or D3
  updateMyChart(data);
});
```
