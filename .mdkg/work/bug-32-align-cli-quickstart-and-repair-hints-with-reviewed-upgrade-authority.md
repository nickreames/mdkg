---
id: bug-32
type: bug
title: Align CLI quickstart and repair hints with reviewed upgrade authority
status: done
priority: 1
tags: [release-0.6.0, behavioral-audit]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-32-verification.json]
relates: [goal-83, goal-84, bug-6, task-827, task-828]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-09-09
updated: 2026-09-09
---
# Overview

Top-level CLI help and several fallback/repair diagnostics still direct users to
bare `mdkg upgrade --apply`, despite the candidate requiring a reviewed plan hash
and the same selected paths. The quickstart also presents agent setup as an
extra mode rather than the compact default. Functional severity: low; misleading
installed onboarding/remediation guidance is a publication blocker under goal-84.
This is not an additional Standard security finding. The implementation correctly
refuses missing authority; the defect is its conflicting user-facing guidance.

# Reproduction Steps

1. Inspect current `mdkg --help`: src/cli.ts:241-255 includes bare upgrade apply
   and repeats `mdkg init --agent` as the agent-ready path.
2. Inspect src/commands/new.ts, validate.ts, doctor.ts and subgraph.ts for
   fallback hints instructing bare `mdkg upgrade --apply`.
3. In an owned installed 0.5.2-to-candidate fixture with a safe selected router
   upgrade, run `upgrade --apply --only .mdkg/AGENT_START.md --json` without a
   hash. It exits 1 with: review mdkg upgrade first, then supply its exact
   --plan-hash and --only selection; stale plans are refused.
4. Reproduction candidate SHA-256:
   9c2d5f4223885a0814d961b3aa93492dd6639a152dbe57039b18b81b531b60fd.
   This is an unpublished development artifact still labelled 0.5.2, not a
   claim that the historical published 0.5.2 required the new hash contract.

# Expected vs Actual

- expected: concise default initialization and accurate preview/review/apply
  instructions, including hash and selected-unit requirements where relevant.
- actual: help and repair hints omit prerequisites that execution enforces.

# Suspected Cause

Source help and diagnostic strings were not updated with the accepted compact
bootstrap and hash-bound upgrade contract. Completed bug-6 fixed maintained
README/install guidance, not these remaining source-emitted surfaces.

# Fix Plan

Owner mdkg-project-agent. Extend the existing contract, not command behavior:
align source CLI help and upgrade-related hints, update exact generated command
references/snapshots as required, and add installed output regressions. Prefer
preview-first guidance and focused discovery; retain --agent compatibility and
do not weaken plan/hash checks to make old examples work.

Allowed: src/cli.ts; upgrade-related diagnostic text in src/commands/{new,
validate,doctor,subgraph,init,upgrade}.ts as needed; directly required tests,
CLI/reference projections and owned mdkg evidence. Current goal-83/84 local-only
implementation/validation/explicit-path commit authority applies. No unrelated
runtime feature change, canonical scaffold upgrade/migration, root instructions
or skills edits, bundle refresh, remote Git, publication, provider or deployment.
Stop for unknown custody, writer collision, material new decisions or scope drift.

# Test Plan

Capture installed top-level help and representative fallback diagnostics before
the fix. Require default/graph-only/--agent wording parity; generated command
snapshots and docs checks; preview/apply-with-exact-hash success and missing/stale
hash refusal in disposable graphs; unchanged Git staging and user content.
Do not equate static command parity with complete release readiness. Final
task-828 must verify this finding along with all other publication blockers.

# Links / Artifacts

- root:bug-6, root:task-827, root:task-828, root:goal-83, root:goal-84.
- Supporting context: root:bug-29 bootstrap qualification. No implementation yet.
- Skill candidates: none; surface is CLI behavior/documentation, not a new skill.

## 2026-09-09 Local Verification

The quickstart now leads with compact-default initialization and keeps upgrade
and skill-authoring work out of the basic task flow. Init modes are explicit;
fallback/repair diagnostics preview first and require exact reviewed hashes
with matching path selections. The bundled command reference and maintained
reference now agree. A generated-help regression also prevents prose from being
misinterpreted as the `--only` argument.

Reproduced three CLI-output failures, one stale bundled-reference failure and
one generated-placeholder failure. Final source passes 1338 ordinary tests,
37 focused bootstrap/recovery checks, and ten installed onboarding checks each
on Node 24.18.0 and 26.0.0. Build, CLI/docs parity and 26 release-contract tests
pass. Full/changed graph and SQLite verification are closeout gates. Exact
source/package hashes and limitations are in the verification artifact.

This is a guidance correction, not new upgrade authority or changed transport
semantics. Only the diagnostic hunk in shared `src/commands/subgraph.ts` belongs
to this commit; the prior bug-17 transport hunks remain uncommitted. Selected
Goal 73, runtime DB and Demo 3 bundle remain unchanged. No runtime lease,
canonical migration, bundle refresh, remote Git, provider action or publication.
Task-828 independent security verification and complete installed/release
qualification remain open; this intermediate package is not the final seal.
Skill coverage reused; candidates none.
