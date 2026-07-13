---
id: dec-80
type: dec
title: Centralize filesystem authority and require exact security finding closure before release
status: accepted
tags: [security, filesystem, release, decision]
owners: []
links: []
artifacts: []
relates: [goal-69, edd-75, goal-64]
refs: [task-718, test-389]
aliases: []
created: 2026-07-12
updated: 2026-07-12
---
# Context

The v0.5.0 audit completed full assigned-file review and found 51 independently
reachable security instances. Most high and many medium findings repeat lexical
containment or symlink-following mistakes across command families; others repeat
unvalidated projection, workflow authority, and resource-budget gaps. Closing the
audit task does not mean these findings passed the release gate.

# Decision

- Treat `task-718` as the execution of the external gate. It may close with a
  failed-closed outcome once findings are durably transferred, but `test-389`
  and the first push remain blocked until a clean rerun.
- Centralize contained filesystem reads, writes, replacements, and recursive
  deletions behind one owned, symlink-safe capability. Do not fix each command
  with ad hoc `path.resolve` checks.
- Treat caches, bundle manifests, subgraph projections, import IDs, and snapshot
  metadata as untrusted runtime input until schema, integrity, visibility, and
  canonical-source binding pass.
- Require exact typed loop authority: normalized action identity, completed
  decision/approval state, evidence kind/status, and exact child-lane identity.
- Enforce resource limits before expensive inflation, traversal, body reads, or
  response assembly.
- Preserve all 51 candidate IDs in a closure matrix. A shared patch may close
  several rows, but representative proof cannot replace direct regression
  evidence for an independently reachable sink.
- No high or medium release blocker may be waived without a separate explicit
  accepted DEC. Transfer to `goal-69` is not a waiver.
- Goal 64 remains paused and blocked by `goal-69`; `task-719` remains blocked by
  `goal-69` and `test-389`. Resume only after `test-434` records a clean scan.

# Alternatives considered

- Patch each reported line locally. Rejected because duplicated enforcement would
  drift and leave future sinks vulnerable.
- Accept local-tool findings as operator risk. Rejected because untrusted repos,
  imported bundles, and agent harnesses are explicit product trust boundaries.
- Publish v0.5.0 and fix forward. Rejected because five high findings include
  recursive external deletion and external SQLite/filesystem mutation before the
  irreversible npm step.
- Treat the classifier-blocked derived report as no audit. Rejected: coverage,
  validation, attack-path decisions, and finding inventory exist; the reporting
  limitation is recorded separately and does not erase the findings.

# Consequences

Implementation starts with the shared path capability and high-severity sinks.
Valid existing workflows should keep their public envelopes; unsafe inputs fail
earlier. Goal 64's security task closes as completed-with-findings, while release
mutation stays gated on remediation and a clean scan. The project accepts a
larger pre-publish delay in exchange for not shipping known release blockers.

# Links / references

- `goal-69`
- `edd-75`
- `goal-64`
- `task-718`
- `test-389`
- `task-763` through `task-776`
- `test-425` through `test-434`
