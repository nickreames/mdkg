---
id: task-308
type: task
title: run final temp-repo E2E and package dry-run gates
status: done
priority: 1
epic: epic-64
parent: goal-10
tags: [e2e, prepublish, dry-run, release]
owners: []
links: []
artifacts: [tests://full-suite, tests://prepublishOnly, npm://pack-dry-run, npm://publish-dry-run, temp://mdkg-cli-ux-polish.j0HyT5]
relates: []
blocked_by: [task-307]
blocks: [task-309, test-121]
refs: []
aliases: []
skills: []
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Run the final package-readiness ladder after UX polish and record dry-run
evidence without publishing.

# Acceptance Criteria

- Required local checks pass.
- `npm pack --dry-run --json` proves `mdkg@0.3.0` tarball contents.
- `npm publish --dry-run` proves npm publish simulation only.
- Dry-run logs are attached as artifact refs.
- No real `npm publish`, tag, or push is run.

# Files Affected

- Evidence only, plus generated index/cache updates from validation.

# Implementation Notes

- Use `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache` for npm dry-run commands.
- If network/auth blocks dry-run, record the exact blocker and do not publish.

# Test Plan

- Full `goal-10` required checks.

# Links / Artifacts

- `test-121`
