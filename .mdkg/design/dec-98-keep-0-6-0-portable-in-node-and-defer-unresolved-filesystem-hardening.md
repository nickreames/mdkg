---
id: dec-98
type: dec
title: Keep 0.6.0 portable in Node and defer unresolved filesystem hardening
status: accepted
tags: [nodejs, portability, release-0.6.0]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
refs: [goal-86, goal-85, goal-87, bug-46, bug-47, bug-60, dec-97, task-841, task-842, test-489]
aliases: []
created: 2026-09-28
updated: 2026-09-28
---
# Context

Nick explicitly chose a Node.js-only portable 0.6.0 after reviewing the
filesystem experiments and production OS restrictions. The prior baseline is
main at 6d23981e70bc68798def73c81b9cd5fa7bc9f3df, with 65 preserved dirty
paths, no staged files, no mutation lock, five released DB leases and empty
queue tables. This record supersedes conflicting current-scope language in
Dec97 and Goals84/86; earlier evidence remains historical, not rewritten.

# Decision

1. Bugs46/47 are **DEFERRED**, unresolved, to paused Goal87. They are not
   accepted findings, fixed findings, completed work, or release proof. Nick's
   explicit version-specific deferral removes their remediation from the 0.6.0
   completion gate only. Preserve severity, reproductions and follow-up duties.
2. No mdkg-owned native addon, executable helper, Rust layer, OS filesystem
   bridge or required sysctl/procfs utility belongs in 0.6.0. Node APIs and
   native Git remain the portable implementation interface; benign path/npm
   adapters are not hard platform restrictions.
3. Bug60 continues under Goal86 with a bounded Node-only in-memory SQLite
   observation experiment, then a source remedy only if it preserves project
   bytes, valid results, journal-state refusal and writer positive controls.
   Do not restore the known readOnly-only WAL/SHM side-effect regression.
4. Nick approves revising the supported Node range/capability requirement
   after proof. Node24.18 exposes deserialize; Node24.15 and installed26.0 do
   not. Pin verified support and diagnose missing capability before effects;
   do not assume every higher major has a backported API or silently fall back
   to a writable/OS-specific observer. Task842 owns final metadata and parity.
5. Task841 replaces OS-proven orphanhood with **operator-confirmed
   quiescence**, exact reviewed journal/lock/file hashes, explicit recovery
   approval and retained single-writer exclusion. A hash token is evidence
   binding, not authentication. Never infer abandonment from age/PID alone;
   live/ambiguous ownership, stale evidence and unknown files must refuse.
6. Cross-platform testing remains necessary. Node-only implementation is not
   Windows, Linux, ACL or sandbox qualification. Test487's macOS/Linux gates
   and Windows-unqualified label remain until actual evidence changes them.
   Task842 must reconcile the obsolete native-hardening assumptions in the
   current fail-closed CI stub without removing installed-platform acceptance.

# Alternatives considered

- Native helper: not selected for 0.6.0; Epic256 remains historical research.
- Direct SQLite readOnly reopen: rejected because Bug60 has a distinct
  reproduced journal-transition side effect, independent of Bugs46/47.
- Private temporary database copies: a Node-only fallback design if memory
  deserialization proves unsuitable, but needs explicit data-custody, resource
  and cleanup review before selection; not silently substituted.
- Automatic age/PID-only lock stealing: not selected.

# Consequences

Goal86 remains the sole current execution lane. It owns Bug60, Tasks841/842,
Test489 and existing final qualification. Goal87 is fully planned but paused
and unclaimed; this request does not run it. Current development remains on
canonical main, local-only, with one writer and preserved unrelated custody.

The release threat statement must explain that ordinary cooperative private
checkouts are supported, while restrictive per-file ACL/owner preservation
and resistance to adversarial ancestor replacement remain unresolved. Keep
existing Node path/link/type checks; deferral is not permission to delete them.

Allowed: scoped source/tests, release-critical owned guidance/runtime metadata,
local disposable fixtures, mdkg nodes/events/index evidence, and reviewed
explicit-path local commits under the existing Goal86 run contract. Excluded:
remote Git, publication/tags/providers/deployments, root/consumer edits,
canonical migration/branch/worktree changes, bundles/subgraph refresh, raw
blocked scan context, global configuration and native helpers. No publication
approval follows; Goal85 remains paused. New material decisions still stop.

# Links / references

- Goal87 preserves the two unresolved bugs; Goal86 owns current execution.
- Tasks841/842 and Test489 specify the portable implementation and gates.
- https://nodejs.org/download/release/v24.18.0/docs/api/sqlite.html
- Skill coverage reused: pursue-mdkg-goal and verify-close-and-checkpoint.
  New skill candidates: none.
