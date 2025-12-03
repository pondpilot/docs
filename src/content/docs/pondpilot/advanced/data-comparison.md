---
title: Data Comparison
description: Compare datasets with powerful diff algorithms to find differences.
sidebar:
  order: 1
---

PondPilot's data comparison feature helps you find differences between tables, queries, or any combination. Compare schema and data using multiple algorithms optimized for different scenarios.

## Starting a Comparison

### Method 1: From Data Explorer

1. Right-click a table in the Data Explorer
2. Select "Compare"
3. Choose the second data source
4. Configure comparison options

### Method 2: From Spotlight

1. Press **Ctrl+K** to open Spotlight
2. Search for "Compare"
3. Select "New Comparison"
4. Choose both data sources

<!-- TODO: Add screenshot of comparison setup -->
<!-- Screenshot placeholder -->

## Comparison Types

### Table vs Table

Compare two tables from your data sources:

```
Source A: sales_2023
Source B: sales_2024
```

### Query vs Query

Compare results of two different queries:

```sql
-- Source A
SELECT * FROM orders WHERE status = 'completed'

-- Source B
SELECT * FROM orders WHERE status = 'shipped'
```

### Table vs Query

Compare a table against a query result:

```
Source A: customers (table)
Source B: SELECT * FROM customers WHERE active = true (query)
```

### Cross-Database

Compare tables from different databases:

```
Source A: local_db.users
Source B: remote_db.users
```

## Configuration Options

### Join Keys

Specify how to match rows between sources:

<!-- TODO: Add screenshot of join key selection -->
<!-- Screenshot placeholder -->

**Single Key:**
```
Join on: id
```

**Composite Key:**
```
Join on: customer_id, order_date
```

**Key Mapping** (when column names differ):
```
Source A: user_id  →  Source B: customer_id
```

### Column Mapping

Map columns with different names:

| Source A | Source B |
|----------|----------|
| `full_name` | `name` |
| `created_at` | `creation_date` |
| `amt` | `amount` |

### Column Exclusion

Exclude columns from comparison:

- Timestamps that always differ
- Auto-generated IDs
- Audit columns

<!-- TODO: Add screenshot of column exclusion -->
<!-- Screenshot placeholder -->

### Filtering

Apply filters to narrow comparison scope:

**Common Filter** (applies to both sources):
```sql
WHERE region = 'US' AND year = 2024
```

**Separate Filters** (different filter per source):
```sql
-- Source A
WHERE status = 'active'

-- Source B
WHERE is_active = true
```

### Compare Mode

| Mode | Description |
|------|-------------|
| **Strict** | Exact value matching (type-sensitive) |
| **Coerce** | Type conversion before comparison |

Use **Coerce** when comparing:
- String "123" vs Integer 123
- Date strings vs Date objects
- Decimal vs Float

## Comparison Algorithms

PondPilot offers multiple algorithms optimized for different scenarios:

### Auto-Select (Recommended)

Let PondPilot choose the best algorithm based on:

- Dataset size
- Available memory
- Key distribution

### Hash-Bucket Algorithm

Best for **large datasets** with memory constraints.

**How it works:**
1. Hashes rows into buckets
2. Compares buckets incrementally
3. Streams results without loading all data

**Best when:**
- Datasets exceed available memory
- You need streaming results
- Memory efficiency is critical

### Join Algorithm

Best for **moderate datasets** with simple comparisons.

**How it works:**
1. Performs a full outer join on keys
2. Compares matched rows column by column
3. Identifies unmatched rows

**Best when:**
- Datasets fit in memory
- You need complete comparison
- Key relationships are clear

### Sampling Algorithm

Best for **quick validation** of large datasets.

**How it works:**
1. Takes a random sample from each source
2. Compares the samples
3. Extrapolates differences

**Best when:**
- You need a quick estimate
- Full comparison is too slow
- Approximate results are acceptable

## Understanding Results

### Summary Statistics

<!-- TODO: Add screenshot of comparison results -->
<!-- Screenshot placeholder -->

| Metric | Description |
|--------|-------------|
| **Rows in A only** | Records that exist only in Source A |
| **Rows in B only** | Records that exist only in Source B |
| **Matching rows** | Records identical in both sources |
| **Different rows** | Records with same key but different values |
| **Total differences** | Sum of all differences |

### Schema Comparison

Before comparing data, PondPilot analyzes schemas:

| Finding | Description |
|---------|-------------|
| ✓ Column match | Column exists in both with same type |
| ⚠️ Type mismatch | Column exists in both with different types |
| ✗ Missing in A | Column only in Source B |
| ✗ Missing in B | Column only in Source A |

### Difference Details

Drill into specific differences:

```
Row ID: 1234
Column: status
Source A: "pending"
Source B: "completed"
```

<!-- TODO: Add screenshot of difference details -->
<!-- Screenshot placeholder -->

## Progress Tracking

Large comparisons show real-time progress:

| Stage | Description |
|-------|-------------|
| Counting | Counting rows in each source |
| Splitting | Dividing data into buckets |
| Inserting | Processing comparison buckets |
| Finalizing | Generating final results |

Progress includes:
- Processed row count
- Difference count so far
- Bucket completion (for hash algorithm)
- Estimated completion

<!-- TODO: Add screenshot of progress indicator -->
<!-- Screenshot placeholder -->

## Result Storage

Comparison results are stored in PondPilot's system database:

```sql
-- Query stored comparison results
SELECT * FROM system.comparison_results
WHERE comparison_id = 'abc123';
```

Results persist across sessions until manually cleared.

## Comparison Workflow

### Step-by-Step

1. **Select Sources**
   - Choose Source A (table or query)
   - Choose Source B (table or query)

2. **Configure Join Keys**
   - Select columns that uniquely identify rows
   - Map keys if names differ

3. **Map Columns**
   - Match columns between sources
   - Exclude unnecessary columns

4. **Apply Filters** (optional)
   - Filter to specific data subsets
   - Use common or separate filters

5. **Choose Algorithm**
   - Use Auto-Select for best results
   - Or manually select based on needs

6. **Execute Comparison**
   - Monitor progress
   - Review results

7. **Analyze Results**
   - Check summary statistics
   - Drill into differences
   - Export findings

## Tips & Best Practices

### Performance

- **Index your join keys** - Faster matching
- **Filter early** - Reduce data volume before comparison
- **Use sampling first** - Validate approach on small sample

### Accuracy

- **Verify join keys** - Wrong keys cause false differences
- **Check data types** - Use Coerce mode for type mismatches
- **Exclude noise** - Filter out timestamps and audit columns

### Large Datasets

- **Use Hash-Bucket** - Memory efficient for millions of rows
- **Filter aggressively** - Compare subsets when possible
- **Monitor progress** - Cancel if taking too long

## Troubleshooting

### "No matching rows found"

- Verify join keys are correct
- Check for data type mismatches
- Ensure keys exist in both sources

### "Out of memory"

- Switch to Hash-Bucket algorithm
- Apply filters to reduce dataset size
- Compare in smaller batches

### "Comparison taking too long"

- Use Sampling for quick estimate
- Add filters to reduce scope
- Check if join keys are indexed

### "Unexpected differences"

- Check column mappings are correct
- Verify compare mode (Strict vs Coerce)
- Look for trailing spaces or case differences
