---
title: API Reference
description: NPM packages for embedding FlowScope lineage analysis in your applications.
---

FlowScope is available as NPM packages for embedding SQL lineage analysis in your own applications. The core package provides the analysis engine, while the React package provides visualization components.

## Packages

| Package | Description |
|---------|-------------|
| `@pondpilot/flowscope-core` | Core analysis engine (WASM) |
| `@pondpilot/flowscope-react` | React visualization components |

## Installation

```bash
# Core analysis only
npm install @pondpilot/flowscope-core

# With React visualization
npm install @pondpilot/flowscope-core @pondpilot/flowscope-react
```

## Core Package

The core package provides the WASM-based analysis engine.

### Basic Usage

```typescript
import { analyzeSql } from '@pondpilot/flowscope-core';

const result = await analyzeSql({
  sql: `
    SELECT
      c.name,
      SUM(o.amount) as total
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    GROUP BY c.name
  `,
  dialect: 'postgresql'
});

console.log(result.statements[0].nodes);
console.log(result.statements[0].edges);
```

### API Functions

#### analyzeSql

Analyze SQL and return lineage information.

```typescript
async function analyzeSql(request: AnalyzeRequest): Promise<AnalyzeResult>
```

**Request:**

```typescript
interface AnalyzeRequest {
  sql: string;                    // SQL to analyze
  dialect?: string;               // SQL dialect (default: 'generic')
  schema?: string;                // Optional DDL for column resolution
  template?: TemplateConfig;      // Template preprocessing config
  encoding?: 'utf8' | 'utf16';    // Span encoding (default: 'utf8')
}
```

**Response:**

```typescript
interface AnalyzeResult {
  statements: StatementLineage[];
  issues: Issue[];
  summary: Summary;
}

interface StatementLineage {
  nodes: Node[];
  edges: Edge[];
  issues: Issue[];
  source: string;
}
```

#### completionItems

Get code completion suggestions at a cursor position.

```typescript
async function completionItems(
  request: CompletionRequest
): Promise<CompletionItemsResult>
```

```typescript
interface CompletionRequest {
  sql: string;
  dialect?: string;
  offset: number;          // Cursor byte offset
  schema?: string;
  encoding?: 'utf8' | 'utf16';
}
```

#### splitStatements

Split SQL text into individual statements.

```typescript
async function splitStatements(
  request: StatementSplitRequest
): Promise<StatementSplitResult>
```

```typescript
interface StatementSplitRequest {
  sql: string;
  dialect?: string;
}

interface StatementSplitResult {
  statements: StatementSpan[];
}
```

### Types

#### Node

```typescript
interface Node {
  id: string;
  name: string;
  type: 'table' | 'cte' | 'external' | 'output';
  columns?: Column[];
  schema?: string;
  database?: string;
}
```

#### Edge

```typescript
interface Edge {
  source: string;          // Source node ID
  target: string;          // Target node ID
  sourceColumn?: string;
  targetColumn?: string;
  edgeType: 'direct' | 'derived' | 'aggregated';
  confidence: 'high' | 'medium' | 'low';
}
```

#### Issue

```typescript
interface Issue {
  code: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  span?: Span;
}

interface Span {
  start: number;
  end: number;
}
```

## React Package

The React package provides visualization components for rendering lineage graphs.

### Basic Usage

```tsx
import { LineageExplorer } from '@pondpilot/flowscope-react';

function App() {
  return (
    <LineageExplorer
      sql="SELECT * FROM orders JOIN customers ON orders.customer_id = customers.id"
      dialect="postgresql"
    />
  );
}
```

### Components

#### LineageExplorer

Full-featured lineage explorer with editor and graph.

```tsx
<LineageExplorer
  sql={string}              // Initial SQL
  dialect={string}          // SQL dialect
  schema={string}           // Optional schema DDL
  onSqlChange={fn}          // SQL change callback
  theme="light" | "dark"    // Color theme
/>
```

#### GraphView

Graph visualization only, for custom integrations.

```tsx
import { GraphView } from '@pondpilot/flowscope-react';

<GraphView
  nodes={nodes}             // Node array from analyzeSql
  edges={edges}             // Edge array from analyzeSql
  viewMode="table" | "column"
  layout="dagre" | "elk"
  onNodeClick={fn}
  onEdgeClick={fn}
/>
```

#### MatrixView

Dependency matrix visualization.

```tsx
import { MatrixView } from '@pondpilot/flowscope-react';

<MatrixView
  nodes={nodes}
  edges={edges}
  onCellClick={fn}
/>
```

### Styling

The React components use Tailwind CSS. Include the package styles:

```tsx
import '@pondpilot/flowscope-react/dist/style.css';
```

Or configure Tailwind to scan the package:

```js
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@pondpilot/flowscope-react/**/*.{js,ts,jsx,tsx}'
  ]
};
```

## Example: Custom Integration

```tsx
import { useState, useEffect } from 'react';
import { analyzeSql } from '@pondpilot/flowscope-core';
import { GraphView } from '@pondpilot/flowscope-react';

function LineageViewer({ sql, dialect }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    analyzeSql({ sql, dialect })
      .then(setResult)
      .catch(setError);
  }, [sql, dialect]);

  if (error) return <div>Error: {error.message}</div>;
  if (!result) return <div>Loading...</div>;

  const statement = result.statements[0];
  return (
    <GraphView
      nodes={statement.nodes}
      edges={statement.edges}
      viewMode="column"
    />
  );
}
```

## Resources

- [GitHub Repository](https://github.com/pondpilot/flowscope)
- [NPM: @pondpilot/flowscope-core](https://www.npmjs.com/package/@pondpilot/flowscope-core)
- [NPM: @pondpilot/flowscope-react](https://www.npmjs.com/package/@pondpilot/flowscope-react)
