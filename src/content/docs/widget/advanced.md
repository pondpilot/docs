---
title: Advanced Topics
description: Advanced features like external DuckDB instances and geospatial analysis.
sidebar:
  order: 7
---

## External DuckDB Instance

By default, the widget creates its own shared DuckDB WASM instance. However, you can provide your own existing instance. This is useful if your application already uses DuckDB and you want to share data or minimize memory usage.

```javascript
import * as duckdb from '@duckdb/duckdb-wasm';

// ... initialize your db instance ...
const myDB = await duckdb.AsyncDuckDB.create(...);

// Pass it to the widget
PondPilot.create(element, {
  duckdbInstance: myDB,
  duckdbModule: duckdb
});
```

You can also pass a **Promise** that resolves to a DuckDB instance, and the widget will wait for it.

## Relative Path Resolution

The widget intelligently resolves file paths in your SQL.

```sql
-- Works even if the HTML file is in a subdirectory
SELECT * FROM './data/sales.parquet';
```

It handles:
- `./file` relative to current page.
- `/file` relative to domain root.
- `file` (no prefix) relative to `baseUrl` configuration.

## Geospatial Analysis

You can use DuckDB's spatial extensions within the widget. Use `initQueries` to load them.

```javascript
PondPilot.config({
  initQueries: [
    "INSTALL spatial;",
    "LOAD spatial;",
    // Optional: Load community extensions
    "INSTALL a5 FROM community;",
    "LOAD a5;"
  ]
});
```

### Map Visualization

Combine the `pondpilot:results` event with a mapping library like Leaflet to visualize geospatial queries.

1.  Run a query that outputs GeoJSON:
    ```sql
    SELECT ST_AsGeoJSON(geom) as geojson FROM my_table;
    ```
2.  Listen for results:
    ```javascript
    document.addEventListener('pondpilot:results', (e) => {
      const rows = e.detail.data;
      // Parse GeoJSON strings and add to Leaflet map
      rows.forEach(row => {
        const feature = JSON.parse(row.geojson);
        L.geoJSON(feature).addTo(map);
      });
    });
    ```

See the [Geospatial Demo](https://widget.pondpilot.io/a5-geospatial-demo.html) for a complete example.
