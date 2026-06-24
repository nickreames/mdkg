---
id: test-225
type: test
title: story taxonomy and priority mapping contract
status: done
priority: 1
tags: [mdkg-dev, feedback, taxonomy]
owners: []
links: []
artifacts: []
relates: [task-484]
blocked_by: [task-484]
blocks: []
refs: [archive://archive.mdkg-dev-feedback-user-stories-2026-06-23]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Contract

`prd-6` maps all 60 feedback stories into P0 launch blockers, core P1 implementation scope, and deferred P2/follow-up scope.

# Verification

- `node dist/cli.js show prd-6 --json`
- `node dist/cli.js validate --summary --json --limit 20`
