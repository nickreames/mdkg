---
id: test-153
type: test
title: spike init upgrade template compatibility contract
status: done
priority: 1
epic: epic-84
parent: goal-14
tags: [spike, init, upgrade, templates]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-365]
blocks: []
refs: [task-365]
aliases: []
skills: []
cases: [fresh init includes spike template, upgrade dry-run reports spike template safely, existing repos are not overwritten silently]
created: 2026-06-11
updated: 2026-06-15
---
# Overview

Validate that spike templates and init assets work for both fresh repos and
existing repos upgraded from older mdkg scaffold state.

# Target / Scope

- `task-365`
- default templates
- init assets
- upgrade receipts

# Preconditions / Environment

- Built or packed CLI with spike support.
- Fresh temp repo and older scaffold fixture or temp repo.

# Test Cases

- Fresh `mdkg init --agent` includes spike-aware templates/docs after `mdkg
  index`.
- `mdkg new spike "..." --json` works in the fresh repo.
- `mdkg upgrade --dry-run --json` reports missing spike assets in an older repo
  without mutation.
- `mdkg upgrade --apply --json` adds managed spike assets and leaves local
  customized templates untouched or explicitly reported.

# Results / Evidence

- Passed.
- `scripts/smoke-init.js` verifies fresh base and agent init include
  `.mdkg/templates/default/spike.md`, key spike template sections, and manifest
  coverage.
- `scripts/smoke-upgrade.js` verifies missing spike templates are reported by
  dry-run upgrade, restored by apply, and customized spike templates are
  preserved with explicit conflict/customization receipts.
- `npm run smoke:init`; passed.
- `npm run smoke:upgrade`; passed.
- `node dist/cli.js validate --json`; passed with zero warnings/errors.

# Notes / Follow-ups

- This is the compatibility gate for template delivery.
