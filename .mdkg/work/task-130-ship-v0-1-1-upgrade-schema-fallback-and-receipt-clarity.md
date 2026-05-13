---
id: task-130
type: task
title: ship v0.1.1 upgrade schema fallback and receipt clarity
status: done
priority: 1
epic: epic-18
tags: [upgrade, schema, release, cli]
owners: []
links: []
artifacts: [src/graph/template_schema.ts, src/templates/loader.ts, src/commands/upgrade.ts, scripts/assert-publish-ready.js, scripts/smoke-upgrade.js, tests/commands/agent_file_types.test.ts, cmd:npm_run_test_ok_2026_05_12, cmd:npm_run_cli_check_ok_2026_05_12, cmd:node_dist_cli_validate_ok_2026_05_12, cmd:npm_smoke_upgrade_ok_2026_05_12, cmd:npm_publish_dry_run_ok_2026_05_12]
relates: []
blocked_by: []
blocks: []
refs: [rule-3, rule-5, rule-6]
aliases: []
skills: []
created: 2026-05-12
updated: 2026-05-12
---
# Overview

Ship the v0.1.1 patch that lets older mdkg workspaces keep inspecting their
current graph while they are missing newly introduced built-in templates, and
make conservative upgrade receipts clear enough for agents to decide whether
`--apply` is safe.

# Acceptance Criteria

- Missing local built-in templates are covered by packaged read-only schema
  fallback for graph inspection, validation, formatting, and node creation.
- `mdkg upgrade --dry-run --json` exposes safe apply metadata, write paths,
  preserved customizations, blocking conflicts, and apply side effects.
- Ignored event logs are skipped with guidance instead of created by upgrade.
- `omni-web` can get past the missing-template blocker with the local dist CLI
  without running `mdkg upgrade --apply`.
- The full prepublish dry-run gate passes for v0.1.1.

# Files Affected

- `src/graph/template_schema.ts`
- `src/templates/loader.ts`
- `src/commands/upgrade.ts`
- `scripts/smoke-upgrade.js`
- docs and release metadata

# Implementation Notes

- Local templates remain authoritative when present.
- Malformed local templates remain fatal; only missing built-in templates fall
  back to packaged defaults.
- Explicit missing custom template sets stay fatal and do not silently fall
  back to packaged defaults.
- Upgrade conflicts preserve local customizations and do not block safe creates
  or managed updates.

# Test Plan

- `npm run build`
- `npm run test`
- `npm run cli:check`
- `node dist/cli.js validate`
- `npm run smoke:consumer`
- `npm run smoke:matrix`
- `npm run smoke:upgrade`
- `npm pack --dry-run --json`
- `npm publish --dry-run`

# Links / Artifacts

- `epic-18`
- `rule-3`
- `rule-5`
- `rule-6`
- `omni-web:task-157`
