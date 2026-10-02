---
id: task-840
type: task
title: Define selective testing and full readiness gates in existing skills
status: done
priority: 9
tags: [skills, testing, maintenance]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [chk-637, goal-86]
context_refs: []
evidence_refs: []
aliases: []
skills: [author-mdkg-skill]
created: 2026-09-21
updated: 2026-09-21
---
# Overview

Goal: codify selective testing during development and full pre-merge/pre-publish
readiness checks by extending existing portable mdkg skills.

Context: explicit Nick instruction following chk637's pause and latency review.
Owner: mdkg-project-agent, sole writer for this bounded maintenance assignment.
Goal86 remains paused; this task neither resumes it nor changes its acceptance
requirements. Preserve the uncommitted Bug60 source/test draft and checkpoint,
the generated SQLite custody, selected Goal73, runtime DB and Demo3 bundle.

Boundaries: canonical skills, exact public seeds, configured native mirrors,
registry, this maintenance record and required indexes only. No CLI/source/test
implementation, task-specific gate waiver, new test runner, runtime/compiler
change, blocked-context access, merge, commit, push, publication or bundle refresh.

# Acceptance Criteria

- Existing verification skill owns one generic testing policy; execution skills
  point to it rather than duplicating it or creating another overlapping skill.
- Focused iteration includes positive controls; uncertain/shared effects broaden
  coverage. Full checks are required for pre-merge and pre-publish assertions.
- Explicit task gates, coverage thresholds, platform requirements, exact artifact
  provenance and authority boundaries remain intact.
- Skill validation, relevant existing skill tests, seed/mirror parity, graph and
  diff checks pass. No full runtime suite is required for this guidance-only
  maintenance closeout; this is not merge or publication readiness evidence.

# Files Affected

- .mdkg/skills/verify-close-and-checkpoint/SKILL.md and registry.md.
- .mdkg/skills/build-pack-and-execute-task/SKILL.md.
- .mdkg/skills/pursue-mdkg-goal/SKILL.md.
- Corresponding assets/init/skills/default public seeds.
- Configured .agents/skills and .claude/skills projections through skill sync.
- This task and necessary generated index/mirror manifests.

# Implementation Notes

## Skill Governance Receipt

- Slug/title: verify-close-and-checkpoint / selective verification and readiness
  gates, version0.3.0. Routing updates: build-pack-and-execute-task0.2.1 and
  pursue-mdkg-goal0.3.1.
- Generic trigger: choosing test scope during implementation, closing work or
  asserting pre-merge/pre-publish readiness.
- Owner: mdkg-project-agent; canonical repository writer.
- Evidence: Bug58 and Bug59 each repeated full and installed verification;
  retained full receipts record434385ms and458423ms respectively. Bug60's
  latest focused55-case run took53533.5ms with two harness failures. These are
  multiple observed uses, not a hypothetical workflow. No blocked reports read.
- Existing coverage searched: skill list; searches test and verification
  returned no metadata matches; show verify-close-and-checkpoint and
  build-pack-and-execute-task; existing goal and authoring procedures reviewed.
- Update versus new: verification already owns check selection and closeout;
  extend its description/tags/body and route execution to it. No duplicate skill.
- Portability: generic across languages, runtimes, repositories and consumers;
  no product policy, absolute local paths or hard-coded runtime matrix in skills.
- Surface: repeatable procedure belongs in SKILL.md; this assignment/evidence
  belongs in a task. No MANIFEST or enforced CLI/schema behavior introduced.
- Inputs: changed surfaces, dependent callers, risk, acceptance contract,
  candidate/build identity and existing validation evidence.
- Outputs: justified test selection, results/durations, deferred gates and
  accurately labeled focused/subsystem/merge/publication readiness.
- Resources: existing repository test scripts/help and build/fixture/evidence
  identities; no new executable resources required.
- Steps: select risk tier, run focused controls, broaden where warranted, reuse
  verified builds/isolated seeds, preserve failure evidence, run full readiness
  gates against exact inputs and record outstanding obligations.
- Validation: skill schema/discovery, existing skill tests, exact projections,
  manual scenario review and graph/diff checks; results below.
- Security/authority: test selection cannot waive explicit gates or authorize
  merge/publication/services/remote actions. Never narrow to hide failures;
  stale/changed inputs invalidate affected evidence. Unknown impact broadens.
- Projections: canonical .mdkg, exact public seeds, configured native mirrors.
- Recommendation: update existing; new skill candidates:none. Skill seed bytes
  are package inputs, so later release qualification must include this revision.

# Test Plan

Use already built skill tests and direct skill validators; refresh only generated
init assets needed to test edited public seed bytes, not a full TypeScript build.
Verify all three canonical/public/native pairs byte-for-byte and search discovery.
Run full and changed-only graph validation plus git diff --check. Preserve
protected hashes and all paused source custody. No final release readiness claimed.

Manual policy scenarios: a local helper edit selects regressions/caller controls;
a shared identity/filesystem change broadens immediately; a stale target defeats
pre-merge evidence; a final package-input change requires affected requalification;
missing platform authority remains NOT_READY. Explicit task gates still apply.

# Links / Artifacts

- root:chk-637; root:goal-86 (paused reference, not an execution claim).
- .mdkg/artifacts/goal-86/bug-58-full-verification.json.
- .mdkg/artifacts/goal-86/bug-59-full-verification.json.

## Maintenance Validation Receipt

- Eight existing skill tests passed, zero failures/skips,230.861875ms using the
  already compiled test file. No full runtime suite or TypeScript rebuild.
- skill validate checked all eight skills: zero errors/warnings. Capability
  search finds the revised testing description. All three canonical skills match
  their public seed, built seed, .agents and .claude copies byte-for-byte.
- Canonical SHA256: verification fb3380e8b9ea80e09a6876708a894dd3c1f23684687b3876c62783d3de03dfd1;
  execution df1572cf54ae81cd7c9197bf52c30842044a41ef20ad0393846a5b00dfd28c62;
  goal1806688721b6c1e0e484fed84bae65bd5e510dcb9c07bc9fc218e07383c15e9a.
- Full/changed graph validation passed; an expected stale index warning before
  the final projection refresh and three preserved subgraph freshness warnings
  were reported. git diff --check passed.
- All nine paused Bug60 source/test hashes match the pause inventory. Selected
  Goal73, runtime DB and protected Demo3 bundle match chk637. Goal86 stays paused.
- No lease, source fix, commit, remote verification, push or publication. HEAD
  c10113489381badf2845fc378c49b317376f953e unchanged. Maintenance changes are
  unstaged and uncommitted; existing dirty custody remains separately preserved.
- Outcome: existing skill enhanced, no new skill or executable mechanism.
  Validation is maintenance-scoped, not pre-merge/pre-publish readiness. A later
  approved release run must qualify the changed package seed inputs.
