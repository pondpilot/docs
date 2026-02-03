---
title: Keyboard Shortcuts
description: Master PondPilot with keyboard shortcuts for faster workflow.
sidebar:
  order: 7
---

Learn the keyboard shortcuts to navigate PondPilot efficiently. All shortcuts work on Windows/Linux with **Ctrl** and on Mac with **⌘** (Command).

## Quick Reference

#### Global Shortcuts

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Open Spotlight | `Ctrl+K` | `⌘+K` |
| Add local file | `Ctrl+F` | `⌘+F` |
| Add DuckDB file | `Ctrl+D` | `⌘+D` |
| Import SQL files | `Ctrl+I` | `⌘+I` |

### Editor Shortcuts

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Run entire script | `Ctrl+Enter` | `⌘+Enter` |
| Run statement under cursor | `Ctrl+Shift+Enter` | `⌘+Shift+Enter` |
| Open AI assistant | `Ctrl+I` | `⌘+I` |
| Copy selection | `Ctrl+C` | `⌘+C` |
| Paste | `Ctrl+V` | `⌘+V` |
| Undo | `Ctrl+Z` | `⌘+Z` |
| Redo | `Ctrl+Shift+Z` | `⌘+Shift+Z` |
| Find | `Ctrl+F` | `⌘+F` |
| Find and replace | `Ctrl+H` | `⌘+H` |

### Navigation

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Next tab | `Ctrl+Tab` | `⌘+Tab` |
| Previous tab | `Ctrl+Shift+Tab` | `⌘+Shift+Tab` |
| Close tab | `Ctrl+W` | `⌘+W` |

### Data Explorer

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Delete selected | `Delete` | `Delete` |
| Rename | `F2` | `F2` |
| Expand/collapse | `Enter` | `Enter` |

## Spotlight Menu

The Spotlight menu (**Ctrl+K**) is your command center. Type to search for:

- **Tables and columns** - Jump to any data source
- **Scripts** - Open saved queries
- **Actions** - Create, import, compare, and more
- **Settings** - Quick access to configuration

<!-- TODO: Add screenshot of spotlight -->
<!-- Screenshot placeholder -->

### Spotlight Actions

| Type | Action |
|------|--------|
| `new` | Create new SQL script |
| `add` | Add data sources |
| `import` | Import SQL files |
| `compare` | Start data comparison |
| `settings` | Open settings |
| `refresh` | Refresh metadata |

## Editor Execution

#### Run Entire Script

**Ctrl+Enter** / **⌘+Enter**

Executes all SQL statements in the current script, from top to bottom.

```sql
-- All statements execute in order
CREATE TABLE temp AS SELECT * FROM data;
SELECT COUNT(*) FROM temp;
DROP TABLE temp;
```

### Run Statement Under Cursor

**Ctrl+Shift+Enter** / **⌘+Shift+Enter**

Executes only the SQL statement where your cursor is positioned.

```sql
SELECT * FROM users;  -- Cursor here: only this runs

SELECT * FROM orders; -- This doesn't run
```

This is useful for:
- Testing individual queries
- Debugging step by step
- Re-running specific statements

## AI Assistant

#### Open AI Assistant

**Ctrl+I** / **⌘+I**

Opens the AI assistant panel for natural language SQL help.

When the assistant is open:
- Type your question in natural language
- Use **@mentions** to reference tables
- Press **Enter** to submit

## File Operations

#### Add Local File

**Ctrl+F** / **⌘+F**

Opens the file picker to select local files (CSV, Parquet, JSON, Excel, DuckDB).

### Add DuckDB Database

**Ctrl+D** / **⌘+D**

Opens file picker specifically for DuckDB database files.

### Import SQL Files

**Ctrl+I** / **⌘+I**

Opens file picker to import `.sql` script files. Each file opens as a new tab.

:::note
**Ctrl+I** opens the AI assistant when in the editor, but opens file import from the Spotlight or when no editor is focused.
:::

## Tab Management

#### Switch Tabs

- **Ctrl+Tab** - Move to next tab
- **Ctrl+Shift+Tab** - Move to previous tab

### Close Tab

- **Ctrl+W** / **⌘+W** - Close current tab
- **Middle-click** on tab - Close that tab

### Reorder Tabs

Drag tabs left or right to reorder them.

## Text Editing

Standard text editing shortcuts work in the SQL editor:

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Select all | `Ctrl+A` | `⌘+A` |
| Select word | `Ctrl+D` | `⌘+D` |
| Select line | `Ctrl+L` | `⌘+L` |
| Move line up | `Alt+Up` | `⌥+Up` |
| Move line down | `Alt+Down` | `⌥+Down` |
| Duplicate line | `Ctrl+Shift+D` | `⌘+Shift+D` |
| Delete line | `Ctrl+Shift+K` | `⌘+Shift+K` |
| Comment line | `Ctrl+/` | `⌘+/` |

## Results Table

### Copy Data

Select cells and use **Ctrl+C** / **⌘+C** to copy.

### Navigate

| Action | Key |
|--------|-----|
| Next page | `Page Down` |
| Previous page | `Page Up` |
| First page | `Home` |
| Last page | `End` |

## Customizing Shortcuts

Currently, keyboard shortcuts cannot be customized. This feature may be added in a future release.

## Printing Shortcut Reference

Use **Ctrl+K** → type "keyboard" → select "Keyboard Shortcuts Help" to see an in-app reference.

## Tips

#### Learn Progressively

Start with these essential shortcuts:

1. **Ctrl+K** - Open Spotlight (your command center)
2. **Ctrl+Enter** - Run query
3. **Ctrl+I** - AI assistant

### Use Spotlight

When in doubt, press **Ctrl+K**. You can find almost any action by typing what you want to do.

### Mouse + Keyboard

Combine mouse and keyboard for efficiency:
- Click to position cursor
- Use shortcuts to execute
- Drag to select
- Keyboard to copy
