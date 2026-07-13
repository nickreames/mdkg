---
id: epic-241
type: epic
title: Build symlink-safe filesystem authority and migrate all containment sinks
status: todo
priority: 0
tags: [security, remediation, v0.5.0]
owners: []
links: []
artifacts: []
relates: [goal-69]
blocked_by: []
blocks: []
refs: [edd-75, dec-80]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-12
updated: 2026-07-12
---
# Goal

Replace dispersed lexical path checks with one symlink-safe filesystem authority
and migrate all 26 containment findings, including every high-severity external
delete/write/read instance.

# Scope

- Safe contained read/create/replace/delete APIs with explicit root and operation.
- Lexical validation, canonical containment, ancestor `lstat`/`realpath` checks,
  final-sink enforcement, and non-existing-target handling.
- Migrations for mirror, workspace, snapshot, SQLite, archive, bundle, Git,
  scaffold, subgraph, loop, skill, work, handoff, and event paths.
- Disposable-root tests proving outside sentinels are unchanged.

# Milestones

- `task-763`: shared capability and platform contract.
- `task-764`: five high findings plus project-DB migration containment.
- `task-765`: remaining containment instances.
- `test-425` and `test-426`: exact cross-command and destructive-operation proof.

# Out of Scope

- Operator-selected external outputs that are intentionally outside a repository;
  these use a separate explicit capability rather than accidental containment.
- Broad filesystem abstraction refactors unrelated to the recorded sinks.

# Risks

- Check-then-use code can remain vulnerable if enforcement is not repeated at the
  actual file descriptor or destructive sink.
- Overly strict link rejection can break legitimate valid repositories; preserve
  documented behavior only where the target is explicitly authorized.
- Cross-platform link and rename behavior requires fixture coverage.

# Links / Artifacts

- `goal-69`
- `edd-75`
- `dec-80`
- `task-763` through `task-765`
- `test-425`, `test-426`
