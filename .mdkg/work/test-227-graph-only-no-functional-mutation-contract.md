---
id: test-227
type: test
title: graph-only no-functional-mutation contract
status: done
priority: 1
tags: [mdkg-dev, graph-only, no-functional-mutation]
owners: []
links: []
artifacts: []
relates: [task-488]
blocked_by: [task-488]
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

Goal 29 changes only mdkg graph/design/archive/index state plus committed feedback evidence. It does not edit site/docs/source implementation, deploy, publish, tag, push, or change DNS.

# Verification

- `git status --short --branch`
- `git diff --check`
- Review changed paths before commit.
