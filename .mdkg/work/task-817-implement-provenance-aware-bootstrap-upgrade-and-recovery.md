---
id: task-817
type: task
title: Implement provenance-aware bootstrap upgrade and recovery
status: done
priority: 1
parent: goal-81
tags: [alignment-002, execution-authorized]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [task-816]
blocks: []
refs: [edd-80, dec-93, edd-56]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-09-05
updated: 2026-09-05
---

# Overview

Extend the existing seed-manifest upgrade path with managed-section provenance,
previewed relocation and bounded recovery. Execution authorized by the user's
Goal 81 Run action; scope and exclusions are recorded in goal-81.

# Acceptance Criteria

- Classify every path/unit as generated, customized, authored or unrelated.
- Preserve bytes outside managed wrapper sections and modified managed content.
- Dry-run writes nothing, reports exact changes/conflicts and retains legacy
  pointers until compatibility links are safe.
- Apply checks baseline hashes and owned destinations before writing. Stale
  previews fail. No deletion of unknown files or blanket Git restore/reset.
- Repeating upgrade is a no-op; interrupted apply can resume or restore only
  operation-owned verified bytes with explicit authority.
- Existing graph-only mode stays graph-only without explicit adoption.

# Files Affected

Future src/commands/upgrade.ts, init manifest schema/helpers and upgrade fixtures.

# Implementation Notes

Use edd-80, not a second independent provenance database. Test migration of known
seed hashes separately from customized files and absent/corrupt manifests.
Retain detailed operation receipts; do not claim multi-file atomicity without
fault-injection proof. No actual canonical-repo upgrade under this task by default.

# Test Plan

Custom/mixed wrappers, missing manifests, malformed/duplicate markers, stale plan,
symlink escape, existing legacy links, repeat apply and injected failure after
each write. Compare unowned byte hashes before/after. See test-474.

# Links / Artifacts

- edd-80, edd-56, task-816, goal-81.
- 2026-09-05: build passed; existing upgrade suite 13/13 and new upgrade safety
  suite 7/7 passed. Preview collects exact operations in memory; apply requires
  its plan hash, fails closed on requested conflicts, and supports explicit
  exact-path subsets. Derived registry/mirror paths are individually reviewed.
- Verified stale preview rejection, mixed CRLF wrapper preservation, legacy
  seed redirects, graph-only preservation, no Git index writes, interrupted
  writes at every tested position, explicit resume/recovery, collision refusal,
  and symlink/corrupt-manifest refusal. Journal originals are local/private
  mode 0600; no whole-tree rollback or implicit Git action.
- Goal-wide CLI/docs/package gates and focused discovery remain with task-818
  and test-474. No canonical checkout upgrade, bundle, or remote action ran.
