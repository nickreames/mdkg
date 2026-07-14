---
id: task-777
type: task
title: Implement writable archive ownership selection and qid target resolution
status: done
priority: 0
epic: epic-246
tags: [archive, ownership, qid, subgraph]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [bug-1]
blocks: [task-778]
refs: [goal-70, edd-76, dec-82, dec-29, edd-11]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-14
updated: 2026-07-14
---
# Overview

Introduce one ownership-aware selector that resolves archive graph identity from
enabled local workspaces before any path operation.

# Acceptance Criteria

- `--all` selects sorted local archive qids and records imported exclusions.
- `--all --ws <local>` filters correctly; imported, disabled, and unknown aliases
  fail before writes with stable reasons.
- Direct IDs/URIs retain default-root or `--ws` behavior; exact qids work; qid
  and conflicting `--ws` fail deterministically.
- Imported qids fail with `dec-82` messaging before path derivation.

# Files Affected

List files/directories expected to change.

- `src/commands/archive.ts`
- Shared graph/workspace ownership helpers if warranted by existing boundaries.
- Focused archive/subgraph tests.

# Implementation Notes

- Use `config.workspaces` as writable truth and `config.subgraphs` plus imported
  source metadata as read-only truth.
- Never infer authority from a lexical `#` check.

# Test Plan

Run tests `test-435`, `test-437`, `test-438`, and `test-439` in the disposable
fixture plus existing archive/subgraph tests.

# Links / Artifacts

- `edd-76`
- `dec-82`
