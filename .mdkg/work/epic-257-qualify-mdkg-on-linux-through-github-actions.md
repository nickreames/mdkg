---
id: epic-257
type: epic
title: Qualify mdkg on Linux through GitHub Actions
status: backlog
priority: 3
tags: [future, linux, github-actions, planning-only]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-86, goal-85, test-487, task-829, task-830, dec-97]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-09-21
updated: 2026-09-21
---
# Current accepted package closeout contract - 2026-09-28 Dec100

PAUSED/UNCLAIMED future hosted lane. Preserve the deliberately failing stub; do not dispatch or mark it green. Dec100 removes hosted completion from0.6.0 local package prerequisites. Future cases use Node >=24.18.0 <25 plus unsupported-version refusal, not old24.15/26 success.

Dec100 requires37 package smokes plus local platform/security/guidance acceptance.
All46 definitions remain; nine website smokes/nine site profiles defer to Epic258
and hosted execution to Epic257. Same-input case evidence can be reused; missing
seal does not erase passes. Node >=24.18.0 <25 replaces old runtime success gates.
Bugs46/47 remain deferred/unresolved; no blocked scan context recovery. This
amendment is not qualification proof or publication authority.

# Historical contract and evidence retained below

# Goal

2026-09-28 local-only preparation: the release workflow now contains an
explicitly unqualified, fail-closed Test487 x64/ARM64 matrix stub. This is
scaffolding, not hosted execution or platform evidence. The future epic still
owns actual fixture implementation, runner/resource approval, exact-artifact
dispatch, and independent acceptance before publication.

Produce trustworthy Linux qualification for an exact mdkg candidate through
explicitly authorized GitHub Actions execution, reusing the existing Test487
acceptance matrix and manifest-backed ladder. This is future planning only;
current Node.js development remains local under Dec97.

# Scope

- Linux x86_64 and ARM64 evidence; record native versus emulated execution,
  image/runner identity, filesystem semantics and actual CPU/OS/runtime versions.
- Reuse existing CI topology and tests; inspect before creating another runner.
- Qualify Node24.15.0, the explicitly selected supported24 version and Node26 as
  required by the approved candidate contract, or obtain a later explicit revision.
- Build/transfer one immutable candidate: SHA256/SHA512, package-input/file
  manifests, source revision, retained logs and case-level receipts. No per-platform
  repack masquerading as the same artifact; rehash before/after consumption.
- Real worktrees, submodule/gitdir indirection, permissions/ACLs, recovery,
  SQLite observations, installed upgrades and the existing required graph cases.
- Least-privilege workflow permissions, pinned actions/toolchains, no publication
  credentials or privileged untrusted PR execution, bounded jobs and artifact retention.

# Milestones

1. Inventory existing local workflow/manifest contracts read-only and map Test487
   requirements, missing coverage, runner availability and infrastructure costs.
2. Obtain separate workflow-edit, remote-push, hosted-dispatch, runner/resource
   and any private-artifact disclosure authority before those actions occur.
3. Author/test the bounded workflow and safe synthetic fixtures under approved
   scope, with reviewed matrix partitioning and immutable candidate delivery.
4. Execute authorized Linux jobs, independently inspect complete evidence and
   record failures/skips honestly. Emulation never proves native performance.
5. Attach accepted results to Test487, Task829 and the candidate seal; reuse one
   result across matching requirements without duplicate acceptance runs.

Done when: all required Linux cases pass on the exact approved artifact with
retained provenance and independent evidence review. Client tools, green job
summaries, cached logs or missing architectures do not satisfy the gate.

# Out of Scope

Current CI dispatch/service start, providers/deployments, npm publication, tags,
remote history changes, Windows qualification, native filesystem implementation,
consumer repositories and broad CI rewrites. Workflow activation is not authorized
by authoring this epic; current Goal86 continuation does not acquire hosted authority.

# Risks

- Runner capacity/cost, emulation, filesystem differences and artifact expiry.
- Secrets or privileged workflow context exposed to untrusted code.
- Artifact changes or platform repacking invalidate qualification.
- Deferring execution leaves Linux unverified; it does not waive Dec96 or Test487.

# Links / Artifacts

- Dec97; Test487; Task829; Task830; Goals85/86. Owner mdkg-project-agent.
- Reuse test families477-488 and repository CI manifest; child tasks are allocated
  only under a later fully scoped assignment. No hosted or provider inspection now.
