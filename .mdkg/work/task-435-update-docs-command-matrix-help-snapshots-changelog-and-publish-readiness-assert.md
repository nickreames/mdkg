---
id: task-435
type: task
title: update docs command matrix help snapshots changelog and publish-readiness assertions
status: done
priority: 1
epic: epic-116
parent: goal-23
tags: [docs, readiness, cli-contract]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-21
updated: 2026-06-21
---
# Overview

Keep public docs, command metadata, help snapshots, changelog, and publish-readiness checks aligned with the new warning-scale UX surfaces.

# Acceptance Criteria

- README and init assets document summary mode and clean JSON receipts.
- CLI command matrix lists new validate/format options and receipt fields.
- Help snapshots and command contract include the new flags.
- Changelog records `0.3.8 - Unreleased` notes.
- `scripts/assert-publish-ready.js` requires `smoke:warning-ux` and warning UX docs.

# Files Affected

- README.md
- CLI_COMMAND_MATRIX.md
- assets/init
- tests/snapshots or generated command docs
- scripts/assert-publish-ready.js

# Implementation Notes

- Keep package version at `0.3.7` until the later 0.3.8 release-candidate pass.

# Test Plan

- `npm run cli:check`
- `npm run cli:contract`
- `node scripts/assert-publish-ready.js`

# Links / Artifacts

- task-428
- task-434
