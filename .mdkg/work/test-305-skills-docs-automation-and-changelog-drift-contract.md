---
id: test-305
type: test
title: skills docs automation and changelog drift contract
status: done
priority: 1
epic: epic-201
parent: goal-41
tags: [0.3.9, skills, docs, changelog, automation, test]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-598, task-599]
blocks: []
refs: [task-598, task-599]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-06-26
updated: 2026-06-27
---
# Overview

Validate that first-party skills, docs automation, and release-note checks catch
CLI drift.

# Target / Scope

`task-598`, `task-599`, first-party skills, command docs, and changelog/release
notes automation.

# Preconditions / Environment

Run from the repo after behavior/docs changes are implemented.

# Test Cases

- Docs command checker accepts current valid examples and rejects stale ones.
- Publish-readiness checks catch stale source-visible version/release-note
  drift.
- Skill coverage audit maps current command families to first-party skills.
- Changelog/release notes inputs stay reconciled.

# Results / Evidence

- `node dist/cli.js skill validate --json` passed: 5 skills checked, 0 warnings,
  0 errors.
- `node dist/cli.js skill list --json` returned five first-party skills,
  including `author-mdkg-skill`.
- `node dist/cli.js skill show author-mdkg-skill --json` showed configured
  mirror target and MANIFEST-over-SPEC authoring guidance.
- `node dist/cli.js skill show verify-close-and-checkpoint --json` showed the
  full pre-publish gate, npm publish dry-run, registry checks, and explicit
  publish approval boundary.
- `npm run docs:check` passed after wiring generated CLI docs, generated
  release-notes data, and public command-example validation into one gate:
  `scanned_files: 50`, `checked_examples: 392`, `failed_examples: 0`.
- `node scripts/assert-publish-ready.js` passed after adding assertions for the
  docs script wiring, seeded authoring skill, release-notes generator, and
  prepublish docs gate order.

# Notes / Follow-ups

- Prefer actionable diagnostics over broad snapshots.
