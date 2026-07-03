---
id: task-642
type: task
title: update full default init assets and upgrade preservation coverage
status: todo
priority: 1
parent: goal-49
tags: [0.4.1, contract-profile, init-assets, upgrade, templates]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-641]
blocks: [task-643, test-334]
refs: [task-634, test-331]
context_refs: []
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-02
updated: 2026-07-02
---
# Overview

Update full managed defaults and init assets to demonstrate contract-profile
support after validators, profile CLI, scaffolds, and helper flags are proven.

# Acceptance Criteria

- Managed templates and init assets demonstrate the new fields without adding
  runtime-only Omni Room state.
- Default skills/docs explain generic semantic mirrors and profile validation
  without claiming runtime execution ownership.
- `mdkg upgrade --dry-run --json` writes nothing.
- A temp `mdkg upgrade --apply --json` proof preserves customized templates,
  skills, core docs, config overlays, and local edits.
- Fresh init, existing repo, and agent-enabled skill mirror paths are covered.

# Files Affected

- Managed templates/defaults.
- Init asset sources and generated dist init payloads.
- Upgrade smoke fixtures.
- Default skill/docs assets.

# Implementation Notes

- Full defaults are in scope for this release, but only after upgrade
  preservation evidence exists.
- SPEC-to-MANIFEST compatibility remains independent from contract-profile
  fields.

# Test Plan

- `npm run smoke:init`
- `npm run smoke:upgrade`
- temp fresh-init validation
- temp customized-repo `mdkg upgrade --dry-run --json`
- authorized temp customized-repo `mdkg upgrade --apply --json`
- `node dist/cli.js validate --changed-only --json`

# Links / Artifacts

- `task-634`
- `test-331`
