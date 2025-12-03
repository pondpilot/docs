---
title: Getting Started with FlowScope
description: Learn how to use FlowScope to analyze SQL lineage in your queries.
---

FlowScope is a privacy-first SQL lineage engine that analyzes SQL queries to produce detailed lineage graphs showing how tables, CTEs, and columns flow through data transformations.

## Installation

FlowScope is available as an NPM package:

```bash
npm install @pondpilot/flowscope-core
```

Or use the React component:

```bash
npm install @pondpilot/flowscope-react
```

## Quick Example

```typescript
import { analyzeLineage } from '@pondpilot/flowscope-core';

const sql = `
  SELECT
    orders.id,
    customers.name,
    orders.amount
  FROM orders
  JOIN customers ON orders.customer_id = customers.id
`;

const lineage = await analyzeLineage(sql);
console.log(lineage);
```

## Features

### Table-Level Lineage
Understand which tables are read from and written to.

### Column-Level Lineage
Track how individual columns flow through transformations, JOINs, and aggregations.

### CTE Support
Full support for Common Table Expressions with proper lineage tracking.

### Multiple SQL Dialects
- PostgreSQL
- Snowflake
- BigQuery
- ANSI SQL

## React Component

Use the React component for interactive visualization:

```tsx
import { LineageGraph } from '@pondpilot/flowscope-react';

function App() {
  return (
    <LineageGraph
      sql="SELECT * FROM orders JOIN customers ON orders.customer_id = customers.id"
      dialect="postgresql"
    />
  );
}
```

## Next Steps

- [API Reference](/flowscope/api-reference/)
- [React Component Guide](/flowscope/react-component/)
- [Supported SQL Dialects](/flowscope/sql-dialects/)
