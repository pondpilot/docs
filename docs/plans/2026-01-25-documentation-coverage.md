# Plan: Complete Documentation Coverage

Add user-facing documentation for PondPilot Proxy, FlowScope, and CORS Proxy to achieve 100% coverage in the central docs site. Priority order: Proxy (missing entirely), FlowScope (1 page), CORS Proxy (1 page). Total of 17 pages to write.

## Validation Commands

- `yarn build`
- `yarn dev` (manual verification)

### Task 1: PondPilot Proxy Documentation

Create complete user-facing documentation for PondPilot Proxy, which currently has zero pages in the central docs. This is the highest priority gap as the product enables cross-database queries—a powerful feature with no central documentation. Source content from the repo at `../pondpilot-proxy/`.

- [x] Create `src/content/docs/proxy/index.md` — Overview: what Proxy does, use cases (cross-database joins, analytics on external DBs), when to use it
- [x] Create `src/content/docs/proxy/getting-started.md` — Quick start: installation, Docker setup, connecting to first database, running first query
- [x] Create `src/content/docs/proxy/configuration.md` — YAML configuration, environment variables, authentication methods (API keys, JWT), connection pooling settings
- [x] Create `src/content/docs/proxy/cross-database-queries.md` — Main feature guide: attaching multiple databases, cross-database JOIN examples, supported databases (PostgreSQL, MySQL, SQLite, DuckDB)
- [x] Create `src/content/docs/proxy/deployment.md` — Production deployment: Docker Compose, health checks, rate limiting, audit logging
- [x] Verify all 5 Proxy pages render correctly with `yarn dev`

### Task 2: FlowScope Documentation

Expand FlowScope from 1 page to complete user-facing coverage. Focus is on the web application at flowscope.pondpilot.io—how to use the UI for SQL lineage analysis. CLI gets its own section, npm package is a brief mention. Source content from the repo at `../flowscope/`.

- [ ] Create `src/content/docs/flowscope/index.md` — Overview: what SQL lineage is, why it matters, key features of FlowScope
- [ ] Enhance `src/content/docs/flowscope/getting-started.md` — First analysis walkthrough: paste SQL, view lineage graph, understand results
- [ ] Create `src/content/docs/flowscope/analyzing-queries.md` — Detailed guide: input methods, query validation, error messages, supported query types
- [ ] Create `src/content/docs/flowscope/lineage-visualization.md` — Reading the graph: table-level vs column-level lineage, node types, expanding/collapsing, navigation controls
- [ ] Create `src/content/docs/flowscope/dialects.md` — Supported SQL dialects: PostgreSQL, Snowflake, BigQuery, DuckDB, Redshift, ANSI SQL; syntax differences and limitations
- [ ] Create `src/content/docs/flowscope/advanced.md` — Advanced patterns: CTE handling, dbt/Jinja template support, subqueries, complex transformations
- [ ] Create `src/content/docs/flowscope/cli.md` — CLI reference: installation, commands, options, usage examples, output formats
- [ ] Create `src/content/docs/flowscope/api.md` — Brief API section: npm package mention (@pondpilot/flowscope-core), basic usage example, link to repo for details
- [ ] Verify all 8 FlowScope pages render correctly with `yarn dev`

### Task 3: CORS Proxy Documentation

Expand CORS Proxy from 1 page to complete user-facing coverage. This is a utility service that enables PondPilot to access remote resources blocked by CORS. Simpler product, fewer pages needed. Source content from the repo at `../cors-proxy/`.

- [ ] Enhance `src/content/docs/cors-proxy/overview.md` — Improve overview: clearer explanation of what CORS is, when you need the proxy, hosted service URL
- [ ] Create `src/content/docs/cors-proxy/usage.md` — Usage guide: how to use with PondPilot, URL format, supported protocols, examples with remote Parquet files and databases
- [ ] Create `src/content/docs/cors-proxy/self-hosted.md` — Self-hosting: Docker setup, Cloudflare Workers deployment, Node.js option, configuration options
- [ ] Create `src/content/docs/cors-proxy/security.md` — Security model: SSRF protection, domain allowlisting, rate limiting, no-logging policy, HTTPS enforcement
- [ ] Verify all 4 CORS Proxy pages render correctly with `yarn dev`

### Task 4: Sidebar Configuration and Final Verification

Update Astro/Starlight configuration to include all new documentation sections in the sidebar navigation. Verify the complete site builds and all links work correctly.

- [ ] Update `astro.config.mjs` — Add Proxy section to sidebar with all 5 pages
- [ ] Update `astro.config.mjs` — Update FlowScope section to include all 8 pages
- [ ] Update `astro.config.mjs` — Update CORS Proxy section to include all 4 pages
- [ ] Run `yarn build` to verify full site builds without errors
- [ ] Run `yarn dev` and manually verify sidebar navigation for all new sections
- [ ] Verify all internal links between docs work correctly
