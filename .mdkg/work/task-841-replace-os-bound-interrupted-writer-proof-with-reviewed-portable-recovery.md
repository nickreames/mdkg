---
id: task-841
type: task
title: Replace OS-bound interrupted-writer proof with reviewed portable recovery
status: done
priority: 1
tags: [nodejs, portability, recovery, release-0.6.0]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/node-portability/recovery-qualification.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-86, bug-7, task-836, chk-654]
context_refs: [goal-86, dec-98, task-836]
evidence_refs: [chk-654]
aliases: []
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-09-28
updated: 2026-09-28
---
# Overview

Goal: remove production sysctl/procfs/UID-based recovery eligibility while
retaining reviewed, explicit interrupted-transaction recovery in Node.
Context: Task836's completed OS-proof implementation is historical evidence;
Dec98 changes the future contract. Owner mdkg-project-agent, one writer on main.
Goal86's run authorizes this bounded work; no selected-goal change is required.

# Acceptance Criteria

- Ordinary writer exclusion, nonce/custody checks and journals remain intact.
- Recovery requires explicit operator confirmation that all checkout writers
  are stopped, alongside a reviewed approval bound to exact plan, journal,
  lock epoch/claim chain and file-state evidence. No implicit confirmation.
- Inspect/preview stays read-only and separates evidence validity from the
  operator's quiescence assertion; never labels that assertion OS proof.
- Stale approvals, changed files/locks, conflicting mode, unknown entries,
  malformed or insufficient legacy evidence, and observed live/ambiguous
  ownership refuse without deletion or takeover. PID/age alone grants nothing.
- No production sysctl, /proc, /dev/fd or platform-name allowlist is required.
- Complete focused and affected identity/recovery tests, then Test489's
  installed checks. Final independent/platform gates remain separately open.

Task completion records the local implementation and affected-caller tests;
Test489 is its downstream installed acceptance, not a prerequisite of this
task's implementation closure. Do not create a dependency cycle or claim final
release qualification from the local milestone.

# Files Affected

- src/util/lock_evidence.ts and src/util/lock.ts
- src/graph/identity_transaction.ts and related reviewed-recovery schemas
- src/commands/graph.ts, src/cli.ts and generated command contract if required
- tests/graph/identity_interrupted_writer.test.ts and installed recovery fixtures
- Directly required generic guidance, regression and mdkg evidence only

# Implementation Notes

- Read and preserve old journal/lock evidence; do not migrate the canonical graph.
- Use a versioned approval contract if old approvals cannot safely express
  quiescence. Do not reinterpret an old approval as the new operator assertion.
- Avoid expanding recovery into agent scheduling, remote leases or services.
- Stop for custody movement, proof gaps or materially new security semantics.

# Test Plan

Focused refusal/positive controls: missing confirmation, live owner, stopped
writer with exact evidence, wrong checkout, changed plan/journal/claim, competing
recovery, resume-versus-rollback, interrupted approval publication and unknown
files. Assert complete before/after inventories and unchanged Git staging.
Exercise ordinary branch-local create/reconcile and nontransaction writes.
Use owned fixtures under /private/tmp; no canonical crash injection. Measure
targeted timings; defer full suite to integrated/pre-merge qualification.

# Links / Artifacts

- Dec98; Goal86; Task836 historical contract; Test489 final installed acceptance.
- No native, remote, hosted, provider, publication or blocked-context access.

## Local implementation result - 2026-09-28

Chk654 and recovery-qualification.json bind the source, tests, exact installed
artifact and preserved checkout. Node-only owner/claim version2, versioned
mode/checkout/journal/lock/file approvals, required --confirm-quiescent, and
private journal assertion records are implemented. No-lock unfinished recovery
also requires both approvals; no-lock terminal repeats remain observational.
Complete legacy evidence stays byte-preserved; no prior hash becomes an
operator assertion. Live/ambiguous PID observations and malformed/stale/unknown
custody continue to refuse without takeover.

The two new regressions fail before correction. Focused58/58 and affected345/345
tests pass on Node24.18/macOSarm64. One installed234-file intermediate tarball
passes12 caught-error and11 real-kill cases with zero trapped OS utility/UID/
procfs/descriptor dependencies, normal prepack/postinstall, exact owned bytes,
unchanged staging and fixture cleanup. CLI, source/seed/generated guidance,
472 documented examples and8 skills validate. No full release claim follows.

Local task completion is separate from downstream Test489's complete installed
case family, final macOS/Linux/independent acceptance, coverage/ladder and seal.
Goal86 remains NOT_READY; Bugs46/47 deferred/unresolved in paused Goal87 and
Goal85 remains paused. Selected Goal73, runtime DB and Demo3 bundle unchanged.
This work is unstaged/uncommitted; no remote, native or blocked-context action.
