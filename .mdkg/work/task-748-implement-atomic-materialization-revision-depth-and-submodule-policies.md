---
id: task-748
type: task
title: implement atomic materialization revision depth and submodule policies
status: done
priority: 1
parent: goal-66
prev: task-747
next: task-749
tags: [goal-66, atomicity, revision, submodule, containment]
owners: []
links: []
artifacts: []
relates: [goal-66]
blocked_by: [task-747]
blocks: [task-749]
refs: [goal-66, dec-76, dec-78]
context_refs: [edd-73, dec-61]
evidence_refs: []
aliases: [atomic-git-materialization]
skills: [service-boundary-ownership-check]
created: 2026-07-11
updated: 2026-07-15
---

# Overview

Implement the contained sibling-temporary materialization state machine and all
Git identity, depth, hook, submodule, cancellation, cleanup, and destination
publication gates.

# Acceptance Criteria

- Resolve the full target ref and require exact expected commit equality before
  checkout acceptance; verify expected tree when supplied and report detected
  Git object format.
- Enforce full or positive-integer depth without silently fetching an
  unadvertised object or falling back to a broader clone.
- `deny` rejects `.gitmodules` and gitlink entries. `ignore` leaves gitlinks
  uninitialized and reports bounded count/hash evidence; recursion is never run.
- Invoke Git by argv with prompts and repository hooks disabled. The complete
  invocation audit contains no push, shell, repository script, or hook path.
- Resolve destination ancestry symlink-safely under the command root, reject
  existing targets, and use a same-parent atomic rename only after all checks.
- Git failure, mismatch, signal, caller timeout, or cancellation terminates the
  process group, removes bounded temporary state, and leaves no destination.
- Cleanup failure is explicit and never converted into acceptance.

# Test Plan

- `test-412`
- `test-413`
- targeted no-push and hook-disable cases in `test-414`

# Completion Evidence

- Implemented an argv-only system-Git transaction that clones without checkout
  or recursive submodules into a random sibling temporary directory, fetches
  only the declared full target ref at the declared depth, verifies its peeled
  commit, detects SHA-1/SHA-256 object format, verifies the tree when supplied,
  and checks out the accepted commit with global/system config and hooks
  disabled.
- `deny` rejects `.gitmodules` or gitlinks. `ignore` leaves gitlinks
  uninitialized and records only a bounded count plus deterministic SHA-256
  identity hash; no path or tree output enters the receipt.
- Destination and every temporary/hook path use contained ancestry checks.
  Existing targets fail closed, the destination is rechecked immediately
  before one same-parent rename, and failure paths remove temporary state and
  newly created empty parents.
- SIGINT/SIGTERM are handled across the transaction, terminate the detached Git
  process group, and produce a nonzero bounded `cancelled` receipt only after
  cleanup. Output-limit, Git, identity, policy, cleanup, and atomic-publication
  failures are distinct bounded reason codes and cannot become acceptance.
- Compiled focused test evidence: 12/12 pass, including moved/missing refs,
  commit/tree mismatch, annotated tag peeling, depth propagation without a
  direct object fetch, SHA-256, existing and symlinked destinations,
  submodule deny/ignore, hook suppression, no push/recursion, raw-output
  redaction, and process-group cancellation with no destination or leftovers.

# Files Affected

- Git materialization engine, process lifecycle, containment helpers, and
  neutral fixture tests.

# Implementation Notes

- Reuse existing Git sanitization and containment helpers where their contracts
  are sufficient; do not weaken existing clone behavior.

# Links / Artifacts

- `dec-76`, `dec-78`, `test-412`, and `test-413`.
