# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server with hot reload
npm run build        # Build for production (output: dist/)
npm run preview      # Preview production build locally
```

## Architecture

This is a documentation site for the PondPilot ecosystem built with [Astro](https://astro.build/) and [Starlight](https://starlight.astro.build/).

### Content Structure

Documentation is in `src/content/docs/` as Markdown/MDX files with YAML frontmatter:
- `pondpilot/` - Main data exploration app
- `proxy/` - Multi-tenant data proxy
- `flowscope/` - SQL lineage engine
- `widget/` - Interactive SQL code blocks
- `cors-proxy/` - CORS proxy service

### Key Files

- `astro.config.mjs` - Site config, sidebar structure, integrations
- `src/styles/custom.css` - PondPilot design system (accent colors, spacing tokens)
- `src/content.config.ts` - Astro content collection schema

### Sidebar Configuration

Sidebar is configured in `astro.config.mjs`. Some sections use `autogenerate: { directory: 'path' }` to automatically populate from directory contents. Use `sidebar.order` in frontmatter to control ordering within auto-generated sections.

### Frontmatter Format

```yaml
---
title: Page Title
description: Short description for SEO
sidebar:
  order: 1  # Optional: controls position in auto-generated sections
---
```

### Starlight Components

Available in MDX files via import:
```jsx
import { Card, CardGrid, Tabs, TabItem, Steps, FileTree } from '@astrojs/starlight/components';
```

Callouts use directive syntax: `:::tip[Title]`, `:::note`, `:::caution`, `:::danger`

## Deployment

Deploys to Cloudflare Pages at docs.pondpilot.io. PR previews are automatic.
