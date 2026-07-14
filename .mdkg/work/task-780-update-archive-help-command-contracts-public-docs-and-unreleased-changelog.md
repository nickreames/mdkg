---
id: task-780
type: task
title: Update archive help command contracts public docs and Unreleased changelog
status: done
priority: 1
epic: epic-248
tags: [archive, help, contracts, docs, changelog]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-779]
blocks: [task-781]
refs: [goal-70, edd-76, dec-82]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-14
updated: 2026-07-14
---
# Overview

Document the exact writable-owner, qid, `--all --ws`, read-only error, preflight,
and receipt behavior in every canonical command surface.

# Acceptance Criteria

- CLI help and `CLI_COMMAND_MATRIX.md` show supported syntax and mutation scope.
- Generated command contracts and docs are regenerated through canonical tools.
- Public docs explain imported discovery versus mutation ownership.
- The Unreleased changelog describes the fix without bumping from 0.5.0.

# Files Affected

List files/directories expected to change.

- CLI help/contract source and `CLI_COMMAND_MATRIX.md`.
- `docs/`, `mdkg-dev/` only where the archive command is publicly documented.
- `CHANGELOG.md` Unreleased section.

# Implementation Notes

- Use generic mdkg terminology only.
- Do not deploy or activate release content in Goal 70.

# Test Plan

Run CLI parity/contract/docs checks and `test-442`.

# Links / Artifacts

- `edd-76`
- `dec-82`
