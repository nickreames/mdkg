---
id: bug-40
type: bug
title: Keep subgraph sync previews free of mutation locks and cache directory writes
status: done
priority: 1
tags: [release-0.6.0, observational-boundary]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/observational-boundary-reproductions.json, .mdkg/artifacts/goal-86/observational-boundary-verification.json]
relates: [bug-21, bug-35, test-479]
blocked_by: [task-834]
blocks: []
refs: [dec-96]
context_refs: [goal-86, goal-84]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-15
updated: 2026-09-15
---
# Overview

Goal: make subgraph sync previews observational on writable and read-only graphs,
including linked checkouts without an ignored cache directory. Owner is
mdkg-project-agent. This is a bounded Goal86 successor to Bug21's completed
cache-persistence work, not a reopening or rewrite of that historical proof.

Current and retained published 0.5.2 executables both create and remove a
write.lock directory and create its owner.json during a successful --dry-run.
This is a confirmed functional publication blocker, not a newly counted Standard
security finding. Existing index-byte preservation does not prove no transient
writes, and cache-directory creation can survive after the lock is removed.

# Reproduction Steps

1. Copy the retained synthetic root/registered-child graph into an owned fixture.
2. Instrument successful fs mkdir/open/rm calls for .mdkg/index/write.lock.
3. Run subgraph sync child_demo --dry-run --allow-dirty --json. Both packages
   exit zero and emit successful mutation-lock syscalls; no lock remains afterward.
4. In a fresh linked worktree, leave ignored .mdkg/index absent and compare the
   complete path/mode/content inventory. Preserve that missing-cache case rather
   than precreating state to hide the behavior.

# Expected vs Actual

- Expected: preview produces its proposed bundle/hash receipt without any lock,
  config, cache, index, bundle or Git mutation. Actual sync remains exclusively
  locked and independently validates its current inputs.
- Actual: runSubgraphSyncCommand enters withSubgraphLock unconditionally, before
  its dry-run return. withMutationLock creates index/write.lock and owner.json.

# Suspected Cause

src/commands/subgraph.ts runSubgraphSyncCommand wraps preview and apply in the
same mutation-lock callback; src/util/lock.ts ensures the cache directory before
acquisition. Do not weaken the lock used by real mutations to fix this caller.

# Fix Plan

Allowed: separate the observational dry-run execution path from the locked
non-dry-run path in src/commands/subgraph.ts; directly required tests and sanitized
mdkg evidence. Preserve supported root-format/config refusal and source ownership,
containment, allow-dirty diagnostics and proposed hash calculation. Preserve the
accepted Bug17 transport edits and Bug35 Git-read suppression in the same file.

No canonical sync/bundle refresh, migration, branch/worktree change, provider,
remote Git, publication or unrelated cleanup. Disposable fixtures only. Use the
Goal86 run's supported ownership; local commits require exact-path review.

# Test Plan

Failing-before/passing-after successful-syscall tracing and absent-cache full
inventories; present/absent caches, clean/dirty children, active mutation-lock
sentinel, supported/unsupported graph format, and actual read-only filesystem.
Preview must retain typed proposals. Non-dry-run sync must still acquire the lock
and fail without modifying protected state under competing ownership. Reuse the
installed test479/484 families on required runtimes/platforms; final independent
task828 and macOS/Linux qualification remain separate from implementation closure.

# Links / Artifacts

- .mdkg/artifacts/goal-86/observational-boundary-reproductions.json
- Current source and published 0.5.2 evidence are separately hashed there.
- The prepatch source-only review confirmed the call path; current verification
  is recorded below and does not rewrite that initial observation.
- New skill candidates: none. This is enforced CLI behavior, not a skill.

# Local Implementation Verification - 2026-09-15

Preview now performs explicit supported-format admission outside the mutation
lock, while real sync retains its existing exclusive lock and fresh input reads.
Old-output inspection uses createParents only for real sync. Independent review
identified the second missing-output-parent path; a focused prepatch reproduction
confirmed creation and the corrected fixture now proves its absence.

The reusable288-case matrix passes built CLI and one installed intermediate
tarball on Node24.15.0,24.18.0 and26.0.0. Each topology checks absent cache/output
parents, selected synchronous mutation traps, competing owner lock preservation,
unsupported format refusal, and real sync successfully creating its output.
The final normal-timeout restoration removes a fixture-only contention flake.
All1,409 broader tests pass. Actual read-only APFS preview succeeds with EROFS
write controls and unchanged inventories for all36 graph/runtime variants.

The broader mounted semantic matrix remains failed:12 legacy show/search cases
return old cache metadata, now owned by Bug42. This is not a full qualification
pass, security clearance, Linux result or final artifact seal. Evidence is
.mdkg/artifacts/goal-86/observational-boundary-verification.json. The test volume
is detached. No canonical bundle/selection/runtime/Git-index bytes changed and
no staging, commit, remote, provider or publication action occurred.
