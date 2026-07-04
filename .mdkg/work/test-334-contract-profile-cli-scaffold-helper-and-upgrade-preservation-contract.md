---
id: test-334
type: test
title: contract-profile CLI scaffold helper and upgrade preservation contract
status: done
priority: 1
parent: goal-49
tags: [0.4.1, contract-profile, cli, scaffold, upgrade]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-641, task-642]
blocks: [test-335]
refs: [task-634, test-331]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-02
updated: 2026-07-03
---
# Overview

Validate CLI scaffold/helper behavior and default/init asset upgrade safety.

# Target / Scope

- `task-641`
- `task-642`
- `mdkg new` workflow-file scaffolds
- `mdkg work` helper commands
- managed templates, init assets, and upgrade behavior

# Preconditions / Environment

- Validator and profile CLI tests pass.
- Scaffold/helper flags are implemented.
- Full default/init assets are updated.

# Test Cases

- `mdkg new manifest|work|work_order|receipt` optional profile flags produce
  valid files.
- `mdkg work contract|order|receipt` optional flags produce valid semantic
  mirrors and JSON receipts.
- Fresh `mdkg init --agent` validates with updated managed assets.
- Customized-repo `mdkg upgrade --dry-run --json` writes nothing.
- Customized-repo `mdkg upgrade --apply --json` preserves local templates,
  skills, core docs, config overlays, and local edits.
- Generated dist init payloads match source assets.

# Results / Evidence

Pending.

# Notes / Follow-ups

- None yet.
