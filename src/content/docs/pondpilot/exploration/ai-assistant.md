---
title: AI Assistant
description: Get AI-powered help writing, optimizing, and fixing SQL queries.
sidebar:
  order: 4
---

PondPilot's AI assistant helps you write SQL using natural language, fix errors, and optimize queries. It works with OpenAI, Anthropic (Claude), or custom API endpoints.

## Getting Started

### Setting Up

1. Open **Settings** (gear icon or **Ctrl+K** → Settings)
2. Navigate to **AI Assistant**
3. Select your provider (OpenAI, Anthropic, or Custom)
4. Enter your API key
5. Choose a model

<!-- TODO: Add screenshot of AI settings -->
<!-- Screenshot placeholder -->

### Opening the Assistant

- Press **Ctrl+I** (or **⌘+I** on Mac)
- Or click the AI button in the editor toolbar

<!-- TODO: Add screenshot of AI assistant panel -->
<!-- Screenshot placeholder -->

## Supported Providers

### OpenAI

| Model | Best For |
|-------|----------|
| GPT-4.1 | Complex SQL optimization, best quality |
| GPT-4.1 Mini | Balanced speed and quality |
| o4-mini | SQL analysis with reasoning |
| o3-mini | Cost-efficient reasoning |

### Anthropic (Claude)

| Model | Best For |
|-------|----------|
| Claude 4 Opus | Complex reasoning, detailed explanations |
| Claude 4 Sonnet | Fast and efficient (recommended) |

### Custom Endpoints

Use any OpenAI-compatible API:

1. Select "Custom" as provider
2. Enter your API endpoint URL
3. Choose authentication type:
   - **Bearer Token** - `Authorization: Bearer <key>`
   - **X-API-Key** - `x-api-key: <key>`
4. Enter your API key
5. Specify the model name

## Using the Assistant

### Natural Language to SQL

Describe what you want in plain English:

```
Show me the top 10 customers by total order value
```

The AI generates:

```sql
SELECT
    customer_id,
    customer_name,
    SUM(order_value) as total_value
FROM orders
JOIN customers ON orders.customer_id = customers.id
GROUP BY customer_id, customer_name
ORDER BY total_value DESC
LIMIT 10;
```

### Mentioning Tables and Columns

Use **@mentions** to reference specific tables and columns:

```
Calculate the average @orders.amount grouped by @customers.region
```

The AI understands your exact schema and generates accurate queries.

<!-- TODO: Add screenshot of mentions -->
<!-- Screenshot placeholder -->

### Fixing Errors

When you have a SQL error, the AI can help:

1. Run your query and get an error
2. Open the AI assistant (**Ctrl+I**)
3. Ask "Fix this error" or describe the issue
4. Apply the suggested fix

The AI sees your error message and provides a corrected query.

### Optimizing Queries

Ask the AI to improve performance:

```
Optimize this query for better performance
```

The AI analyzes your query and suggests:

- Index recommendations
- Query restructuring
- More efficient joins
- Reduced data scanning

## AI Capabilities

### What the AI Can Do

| Task | Example Prompt |
|------|----------------|
| **Create** | "Write a query to find duplicate records" |
| **Explain** | "Explain what this query does" |
| **Fix** | "Fix the syntax error in this query" |
| **Optimize** | "Make this query faster" |
| **Convert** | "Rewrite using a CTE instead of subquery" |
| **Debug** | "Why is this returning no results?" |

### AI Response Format

The AI provides structured responses:

1. **Summary** - Brief explanation of the assistance
2. **Code Changes** - Specific modifications to apply
3. **Explanation** - Why the changes work
4. **Alternatives** - Other approaches with trade-offs
5. **Warnings** - Important considerations

<!-- TODO: Add screenshot of AI response -->
<!-- Screenshot placeholder -->

### Applying Suggestions

After the AI responds:

- **Accept** - Apply the suggested changes
- **Copy** - Copy the SQL to clipboard
- **Reject** - Dismiss the suggestion

## Privacy & Security

### What Data Is Sent

The AI assistant sends **only**:

- Your current SQL query
- Database schema (table and column names/types)
- Your natural language prompt
- Error messages (if fixing errors)

### What Is NOT Sent

- **Your actual data** - Row contents are never transmitted
- **File contents** - Only metadata about structure
- **Other queries** - Only the current query context

### API Key Security

Your API key is:

- Stored locally in your browser
- Never sent to PondPilot servers
- Used only for direct API calls to your chosen provider

## Advanced Features

### Reasoning Models

Some models (o4-mini, o3-mini) support explicit reasoning:

1. Enable "Use Reasoning" in AI settings
2. The model shows its thought process
3. Better for complex analytical queries

### Prompt History

Access previous AI interactions:

1. Click the history icon in the AI panel
2. Browse past prompts and responses
3. Reuse or modify previous prompts

### Context Awareness

The AI automatically understands:

- All tables in your Data Explorer
- Column names and data types
- Relationships between tables (when inferable)
- Your current query context

## Tips for Better Results

### Be Specific

❌ "Write a query for sales"

✅ "Write a query showing monthly sales totals for 2024, grouped by product category"

### Include Context

❌ "Fix this"

✅ "Fix this query - it should return customers who have made orders in the last 30 days"

### Use Mentions

❌ "Join the tables"

✅ "Join @orders with @customers on customer_id"

### Iterate

If the first result isn't perfect:

1. Accept partial improvements
2. Ask for refinements
3. Provide feedback on what's wrong

## Troubleshooting

### "API Key Invalid"

- Verify your API key is correct
- Check the key has appropriate permissions
- Ensure your account has API access

### "Rate Limited"

- Wait a moment and try again
- Consider upgrading your API plan
- Use a more efficient model

### "Response Too Long"

- Break complex requests into smaller parts
- Ask for specific aspects one at a time

### Model Not Available

- Check your API plan includes the model
- Try a different model
- Verify the model name for custom endpoints
