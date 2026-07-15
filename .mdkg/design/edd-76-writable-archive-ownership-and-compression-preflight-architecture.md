---
id: edd-76
type: edd
title: Writable archive ownership and compression preflight architecture
tags: [archive, ownership, subgraph, filesystem, preflight]
owners: []
links: []
artifacts: []
relates: [goal-70, dec-82, dec-29, edd-11, dec-80]
refs: [goal-70, dec-82, dec-29, edd-11, dec-80, goal-69]
aliases: []
created: 2026-07-14
updated: 2026-07-14
---
# Overview

Make archive compression authority derive from configured enabled local
workspaces instead of every archive visible in the merged graph index. Imported
archives remain useful read-only projections but can never become filesystem
mutation targets.

# Architecture

Split compression into selection, full-set preflight, and apply phases.
Selection resolves graph identity and workspace ownership without constructing
paths. Preflight derives only local contained paths and validates every selected
archive before mutation. Apply preserves the existing lock and per-file atomic
replacement behavior.

# Data model

- Writable owner: an enabled entry in `config.workspaces`.
- Read-only projection: a configured subgraph alias or node whose source marks
  it imported/read-only.
- Compression plan: sorted qid, owner, validated raw path, ZIP destination, and
  sidecar update prepared before writes.
- Selection receipt: requested workspace, selected local workspaces, compressed
  archives, and excluded read-only projections.

# APIs / interfaces

- `mdkg archive compress --all [--ws <local-workspace>]`
- `mdkg archive compress <id|archive-uri|workspace-qualified-qid> [--ws <alias>]`
- Existing JSON `action`, `count`, and `archives` fields remain; additive
  `selection` evidence is deterministic and sorted.
- A qid plus a conflicting `--ws` fails as invalid usage.

# Failure modes

- Imported alias or qid: fail with the shared read-only-workspace message before
  path resolution.
- Unknown or disabled workspace: fail before mutation with a stable reason.
- Duplicate portable IDs: explicit qid/workspace wins; ordering is by qid.
- Invalid local source, containment, or symlink: abort the complete selection
  before the first write.
- Unexpected apply-time I/O failure: preserve per-file atomicity; do not claim a
  cross-archive transaction.

# Observability

JSON and text receipts expose requested/selected workspaces, compressed qids,
and read-only projections excluded from mutation. Errors identify the target,
workspace, read-only reason, and source-workspace remediation.

# Security / privacy

Never parse `#` fragments into filesystem paths. Imported metadata is untrusted
until ownership classification completes. Preserve centralized containment,
symlink, lock, temporary-write, and atomic-replacement protections from
`dec-80`.

# Testing strategy

Use disposable root/local/imported fixtures. Hash bundles and child trees around
commands, instrument filesystem calls against fragment paths, test invalid-set
zero-write behavior, and retain all existing archive/subgraph/containment tests.

# Rollout plan

Goal 70 implements and locally qualifies the change without a version bump.
Goal 71 owns v0.5.1 publication, real consumer proof, and public docs deployment.
