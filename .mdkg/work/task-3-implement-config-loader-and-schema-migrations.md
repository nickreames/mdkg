---
id: task-3
type: task
title: implement config loader and schema migrations
status: done
priority: 1
epic: epic-1
tags: [config, migrations, schema]
owners: []
links: [config:schema_version, migrate:n-to-n+1]
artifacts: [config-loader, migrate-functions]
relates: [dec-1, rule-3]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-06
updated: 2026-01-14
---

# Overview

Implement loading of `.mdkg/config.json` with strict validation and schema migrations.

# Acceptance Criteria

- config loader reads `.mdkg/config.json` from repo root (or `--root`)
- `schema_version` is required and validated
- migrations are supported (N → N+1 functions)
- errors are actionable and deterministic
- CLI commands can access resolved workspace registry and pack defaults

# Files Affected

- src/core/config.ts
- src/core/migrate.ts
- src/core/paths.ts

# Implementation Notes

- Keep schema minimal and strict.
- Migrations should be deterministic and do not require external libs.
- Consider a `Config` TypeScript type and a `validateConfig()` function.

# Test Plan

- run with valid config (loads)
- run with missing `schema_version` (fails)
- run with future `schema_version` (fails with clear message)

# Links / Artifacts

- dec-1 (schema and migrations)
- rule-3 (root-only + flags)
