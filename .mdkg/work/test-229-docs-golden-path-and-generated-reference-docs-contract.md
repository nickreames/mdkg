---
id: test-229
type: test
title: docs golden path and generated reference docs contract
status: todo
priority: 1
tags: [mdkg-dev, docs, starlight]
owners: []
links: []
artifacts: []
relates: [task-491]
blocked_by: [task-491]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Contract

Starlight docs contain a coherent install/quickstart/concepts/guides/reference path with generated command reference and launch-safe queue/advanced-alpha wording.

# Verification

- `npm --prefix docs run build`
- `npm run docs:check`
- `npm run smoke:mdkg-dev-docs`
