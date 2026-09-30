---
id: dec-97
type: dec
title: Keep current mdkg development Node.js and local with deferred native and hosted qualification work
status: accepted
tags: [roadmap, nodejs, local-only]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
refs: [goal-86, goal-85, bug-46, bug-47, test-487, task-840, epic-256, epic-257, dec-96]
aliases: []
created: 2026-09-21
updated: 2026-09-21
---
# Context

2026-09-28 successor: Dec98 governs current execution. Nick reaffirmed Node-only
portability, deferred unresolved Bugs46/47 to paused Goal87, approved a verified
Node capability/range revision and operator-confirmed recovery, and continued
Goal86. Native integration is not selected. Preserve this decision's prior
scope and feasibility history below; do not use it to reinstate superseded
0.6.0 blocker routing or infer final qualification.

2026-09-28 scope addendum: Nick separately allowed bounded owned local
filesystem experiments, fixes if safe, and a local GitHub Actions stub for the
final pre-publish gate while continuing on main. This supersedes the original
no-VM/no-workflow-edit limits only for that local feasibility/stub work. An
isolated Ubuntu ARM64 VM was stopped and deleted after synthetic experiments;
the workflow stub is intentionally unqualified and fail-closed. No native
runtime integration, hosted dispatch, remote Git, publication, or platform
acceptance follows. Bug46/Bug47 remain blocked, Test487 remains unqualified.
The original decision below is retained as its historical context.

Nick chose Node.js-only and local-only current development after the Goal86
pause and selective-test review. Rust filesystem work and Linux qualification
through GitHub Actions should be documented as future epics. This request
authorizes mdkg planning records/projections, not implementation or hosted runs.
Owner: mdkg-project-agent. Current scope completion remains26/47; existing
accomplishments and unresolved findings are not reclassified by roadmap placement.

# Decision

1. Keep current mdkg implementation in TypeScript/JavaScript on Node.js. No Bun
   runtime migration, Rust backend, native addon, system-tool filesystem bridge
   or compiler/runtime replacement is part of the current continuation.
2. Development and permitted validation remain local. Do not start/reconfigure
   Linux services, containers or VMs, dispatch hosted CI, access remote Git or
   providers, or perform publication under this decision.
3. Epic256 owns future Rust filesystem authority design and qualification.
   Epic257 owns future Linux qualification through GitHub Actions. Both are
   backlog/unclaimed, outside Goal86's executable scope; neither authorizes work.
4. Use verify-close-and-checkpoint0.3.0: focused iteration and affected-subsystem
   checks, broader checks for shared/uncertain effects, and full pre-merge and
   pre-publish acceptance. Reuse verified builds and exact applicable evidence;
   preserve explicit task checks, coverage floors and artifact provenance.
5. Recommend resuming independent Node-only local Goal86 lanes, starting Bug60,
   then Task838 and release-critical Task839 preparation. Current action leaves
   Goal86 paused and selected Goal73 unchanged; a resume request is still needed.
6. Deferral is not remediation, platform proof or a security waiver. Bugs46/47
   remain unresolved; do not silently replace their invariants with mode-only
   or repeated-path-check claims. Linux proof remains unverified. Dec96's release
   acceptance gates remain in force unless explicitly revised separately.

# Alternatives considered

- Add a native layer during the current pass: deferred by Nick to epic256.
- Qualify Linux now using a local executor or hosted CI: deferred to epic257;
  installed Docker/Lima tools do not establish usable execution infrastructure.
- Full rewrite or performance-driven runtime switch: not selected. Improve test
  cadence and measure existing behavior rather than expanding0.6.0 scope.
- Mark deferred findings passed or remove required platform gates: not implied
  by this execution-boundary decision; unresolved release requirements stay visible.

# Consequences

READY_TO_RESUME_LOCAL_WORK is distinct from LOCAL_READY_NOT_PUBLISHED. The latter
cannot be claimed under the unchanged Goal86 condition while required security
and Linux evidence are missing. If the intended release scope becomes Node-only
macOS qualification with different threat assumptions, it needs an explicit
acceptance/risk decision; this record does not invent one.

No changes to source, instructions, skills, package metadata, historical evidence,
protected runtime/bundle bytes, Git history or external systems. No persistent
writer lease, claim, new execution goal or speculative child implementation nodes.

# Links / references

- Epic256: narrow native filesystem research, not the older Epic34 DB sidecar.
- Epic257: exact-artifact Linux CI evidence, reusing Test487 rather than duplicating it.
- Chk637: pause/custody; Task840: selective validation; Chk638: this planning receipt.
