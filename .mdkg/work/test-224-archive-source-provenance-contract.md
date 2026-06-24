---
id: test-224
type: test
title: archive source provenance contract
status: done
priority: 1
tags: [mdkg-dev, archive, provenance]
owners: []
links: []
artifacts: []
relates: [task-483]
blocked_by: [task-483]
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

Archive verification succeeds, the readable feedback folder remains committed source evidence, and new Goal 29/30 records cite the archive URI.

# Verification

- `node dist/cli.js archive verify archive://archive.mdkg-dev-feedback-user-stories-2026-06-23 --json`
- `node dist/cli.js validate --summary --json --limit 20`
