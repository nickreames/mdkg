---
id: task-587
type: task
title: teach docs command checker manifest command family
status: todo
priority: 3
tags: [release, polish, docs, manifest, 0-3-8]
owners: []
links: []
artifacts: [scripts/check-doc-command-examples.js, README.md]
relates: []
blocked_by: []
blocks: []
refs: [goal-39, goal-38, task-585]
context_refs: [goal-38, task-585]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Teach the documentation command-example checker that `mdkg manifest ...` is a
valid command family. The CLI already supports `manifest list` and
`manifest show`; the checker is stale.

# Acceptance Criteria

- `npm run docs:check-commands` exits 0.
- The checker recognizes at least `manifest list`, `manifest show`, and
  `manifest validate` command paths consistently with `mdkg help manifest`.
- README examples for `mdkg manifest list --json` and
  `mdkg manifest show <id-or-qid-or-alias> --json` remain valid examples.

# Files Affected

- `scripts/check-doc-command-examples.js`
- README examples only if the checker reveals a real invalid example after
  manifest support is added.

# Implementation Notes

- Prefer updating the command path allowlist/parser over reverting docs back to
  legacy `mdkg spec ...`.
- Do not remove `mdkg spec ...` compatibility from the checker.

# Test Plan

- `npm run docs:check-commands`
- `npm run smoke:mdkg-dev-docs`
- `node dist/cli.js manifest list --json`
- `node dist/cli.js manifest show spec.mdkg-cli --json`

# Links / Artifacts

- `goal-38`
- `task-585`
