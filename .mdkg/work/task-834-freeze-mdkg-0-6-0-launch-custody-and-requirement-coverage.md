---
id: task-834
type: task
title: Freeze mdkg 0.6.0 launch custody and requirement coverage
status: done
priority: 1
tags: [release-0.6.0, launch-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/planning-receipt.json, .mdkg/artifacts/goal-86/execution-baseline-20260915.json, .mdkg/artifacts/goal-86/requirement-coverage.json]
relates: []
blocked_by: []
blocks: []
refs: [dec-96, task-823, task-833]
context_refs: [goal-86, goal-83, goal-84]
evidence_refs: [chk-608]
aliases: []
skills: []
created: 2026-09-13
updated: 2026-09-15
---

# Overview

Goal: Re-inventory execution custody and build the release requirement/evidence matrix before any remedy or scan.

Context: The planning snapshot is not a standing lease. Previous Standard, behavioral and installed results bind older snapshots.

# Acceptance Criteria

- Verify main/HEAD/cached upstream, staged/unstaged/untracked paths, exact ownership,
  supported locks/claims/runtime lease/queue state, graph selection and imported freshness.
- Classify all current paths; bind and preserve the accepted partial Bug17 bytes.
  Overlap with Bug35 is narrow and explicit; unrelated history is not absorbed.
- Bind recorded published0.5.2 integrity/source provenance, current package inputs,
  completed extraction and every remaining requirement to exact evidence.
- Matrix states are historical/current-intermediate/final-artifact-pass/failure/
  unverified. Keep reproduction, fix, independent review and release acceptance distinct.
- Verify requirement/dependency routing including reopen/stale-evidence behavior.
- Record the run's Goal, Context, Boundaries, Done when and Evidence; establish
  only supported scoped ownership. No invented lease command or DB initialization.

# Files Affected

Read source/Git/graph and evidence; write scoped mdkg custody/coverage artifacts and required projections only.

# Implementation Notes

Owner: mdkg-project-agent, one writer in this checkout. Current action is mdkg-only
planning; this task stays unclaimed until an explicit Run of fully planned goal-86.
That later Run authorizes its bounded implementation, local validation, evidence
and reviewed explicit-path local commits on main; selected state does not authorize it.
No remote Git/push/tag/publication, provider/deployment, consumer/root/sibling
writes, canonical branch/worktree changes, canonical graph migration, bundle or
subgraph refresh, history rewrite, unrelated cleanup or global configuration changes.
Preserve partial Bug17 work, selected Goal73, runtime DB, Demo3 bundles and unknown
files. Stop on baseline movement, ownership collision, unknown custody, material
new decisions or missing authority. Fixture mutations belong only in owned
disposable local roots; never execute recovered Demo3 application payloads.

# Test Plan

Hash/path bookends, zero staged changes, no active collision, dependency acyclicity and explicit gap inventory. Stop before any remedy if custody differs or cannot be classified.

# Links / Artifacts

Record exact inputs, package/source hashes, commands, results, failures and
remaining uncertainty in sanitized goal86 evidence. No current execution proof.

# Execution Result - 2026-09-15

Explicit Goal 86 execution supersedes the pre-run planning labels above. Accepted
all 40 preserved dirty paths at main 38205296208c23fcfcc6fc821a295040be05c0bb;
no staged or unknown work, active lease, queue item or transient lock was present.
Selected Goal 73, runtime DB, Demo 3 bundle and Git index hashes matched exactly.
The partial Bug 17 source/evidence remains owned but incomplete; Bug 35 may alter
only its accepted overlapping Git helpers while preserving transport behavior.

Evidence binds 1,855 non-mdkg paths, 254 package-input source paths, the recorded
published 0.5.2 dual-hash provenance and its cached source revision, all 152 sealed
consumer-extraction payloads, 25 requirement groups, 23 work contracts and 55
historical evidence records. No historical pass is promoted to final-artifact
clearance. The cached published archive must be rehashed before installed reuse.

The 62-node dependency closure is acyclic. In-memory routing controls confirm
that completed custody exposes Bug 35, implementation prerequisites expose the
installed family, and reopening an implementation/platform prerequisite blocks
unfinished installed/publication acceptance. Completed descendants and artifact
freshness are not automatically invalidated by mdkg; the explicit Goal 86 contract
requires reopening affected acceptance and repeating proof after input changes.

Full graph validation passed with zero errors and three preserved stale-import
warnings; changed-only validation, supported SQLite verification and diff checks
passed. Runtime executables remain locally available; Linux client presence is
not executor or platform proof. Full macOS/Linux qualification remains test-487.

Independent source-only review confirms git inspect is already hardened while
four other Git status helpers still lack optional-lock suppression. Separate
unverified candidates are transient locking in subgraph sync --dry-run and
helper execution through other observational Git paths. Reproduce and disposition
them before broad observational acceptance; do not fold them into a claimed
Bug 35 fix or count this read-only review as a Standard security scan.

- .mdkg/artifacts/goal-86/execution-baseline-20260915.json
- .mdkg/artifacts/goal-86/requirement-coverage.json

Task outcome: custody and requirement grounding complete; overall Goal 86 remains
NOT_READY. No source fix, external operation, release qualification or publication
is claimed by this task. Skill candidates: none.
