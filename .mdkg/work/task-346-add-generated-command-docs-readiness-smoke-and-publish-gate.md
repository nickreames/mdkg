---
id: task-346
type: task
title: add generated command docs readiness smoke and publish gate
status: done
priority: 1
epic: epic-73
parent: goal-13
tags: [cli-spec, docs, smoke, prepublish, 0-3-9]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [test-131]
refs: [edd-22]
aliases: []
skills: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Add the docs-readiness smoke and publish gate that prove public command docs can
be generated from the mdkg-native command contract instead of hand-maintained
tables.

# Acceptance Criteria

- A smoke script creates or uses a fresh temp repo and generates command docs
  from the packaged command contract.
- Representative generated examples execute with the packed CLI.
- The smoke fails if command docs are hand-maintained without contract input.
- `prepublishOnly` and publish-readiness assertions require the docs-readiness
  smoke after the contract generator is stable.
- mdkg.dev launch planning remains blocked until this gate passes.

# Files Affected

- `scripts/smoke-command-docs.js` or equivalent
- `package.json`
- `scripts/assert-publish-ready.js`
- generated docs/reference projection inputs

# Implementation Notes

- Keep this smoke local-only and packed-install oriented.
- It should verify generated docs, not public website deployment.
- Generated mdkg.dev input artifacts should be public-safe and exclude hidden
  or internal command records.

# Test Plan

- `npm run smoke:command-docs`
- `npm run prepublishOnly`
- `node scripts/assert-publish-ready.js`

# Links / Artifacts

- `edd-22`
- `test-131`
- `test-141`
