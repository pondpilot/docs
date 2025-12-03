---
title: Configuration
description: Manage application settings, themes, and API keys.
sidebar:
  order: 8
---

PondPilot offers several configuration options to customize your experience. Settings are accessed via the gear icon in the sidebar or by pressing **Ctrl+K** and searching for "Settings".

## General Settings

### Appearance

- **Theme**: Toggle between Light, Dark, or System Sync modes.
- **Editor Font**: Adjust the font size and weight for the SQL editor.
- **Format on Run**: Automatically format your SQL queries when you execute them.

### Data Persistence

PondPilot uses your browser's IndexedDB to store:
- Connection details
- Saved scripts
- Schema metadata

To clear all local data and reset the application:
1. Go to **Settings** → **Saved Data**.
2. Click **Clear All Data**.
3. Confirm the action. **Warning: This cannot be undone.**

## AI Assistant

Configure the AI provider for natural language-to-SQL features.

### Providers

1. **OpenAI**: Requires an API Key. Supports GPT-4o, GPT-4 Turbo, etc.
2. **Anthropic**: Requires an API Key. Supports Claude 3.5 Sonnet, Opus, etc.
3. **Custom / Local**: Connect to a local LLM (like Ollama or LM Studio) running an OpenAI-compatible endpoint.

### Setup

1. Select your provider.
2. Enter your API Key. Keys are stored locally in your browser and are never sent to PondPilot servers.
3. (Optional) Choose a specific model.
4. Click **Save**.

## Remote Databases

Manage connections to remote DuckDB instances or S3 buckets.

- **CORS Proxy**: Enable/disable the built-in CORS proxy for fetching remote files that don't have proper headers.
- **S3 Configuration**: Set default regions or credentials for S3 access (if applicable).
