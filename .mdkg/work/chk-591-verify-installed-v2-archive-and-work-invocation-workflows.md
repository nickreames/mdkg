---
id: chk-591
type: checkpoint
title: Verify installed v2 archive and work invocation workflows
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-7-work-archive.json]
relates: [goal-83, goal-84]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-7]
created: 2026-09-09
updated: 2026-09-09
---
# Summary

Installed archive/work and invocation workflows pass in legacy and v2 graphs
on all three required runtimes. Stable references, evidence bytes and Git staging
survive ordinary mirror updates and warm/cold-cache reads. Overall NOT_READY.

# Scope Covered

Bug-7 under Goal83/84 local qualification authority. Owner mdkg-project-agent;
selected Goal73 and canonical runtime/identity state remain unchanged.

## Changed Surfaces

scripts/installed-work-identity.js, scripts/smoke-archive-work.js,
scripts/smoke-work-invocation.js, this checkpoint, bug-7/Goal84 narratives,
the work/archive evidence artifact and required index projections.

## Boundaries

Synthetic installed-package graphs, local Git and disposable local queue DBs.
No shipped runtime change, canonical migration/bundle/runtime/selection change,
policy waiver, remote Git, provider/deployment, consumer write or publication.
Receipts are local semantic mirrors, not proof of external work or accounting.

# Decisions Captured

No new decisions. Legacy-writer adoption, killed-writer recovery and bug-17
config-less public materialization retain their existing unresolved treatment.

# Implementation Summary

The two existing manifest-backed smokes retain legacy controls and repeat their
complete workflows after installed v2 migration using JSON and SQLite. A shared
fixture helper verifies persisted identity chains, lookup by stable reference,
ordinary order updates, exact staged-index preservation and observational reads.

# Test Proof

- Eighteen complete workflow runs: two workflows, legacy plus two v2 backends,
  and three Node versions. V2 adds 24 warm/cold verification scenarios.
- Archive registration/compression/verification survives removal of raw source;
  source attachments bind input_refs and receipt outputs bind artifacts.
- Contract/order/receipt and archive identities persist. Work status and receipt
  verification return the expected order/work/receipt chain by stable reference.
- Direct trigger does not execute work. Queued trigger, claim and ack are local
  synthetic transport exercises; capability linkage and receipt mirrors validate.
- Git index and archive/input bytes survive updates. Warm/cold read commands
  preserve all fixture file hashes and directory inventory.
- Private migration rehearsal, scale and other remaining acceptance lanes stay
  open. No external proof retrieval or final security clearance is claimed.

# Verification / Testing

## Command Evidence

Installed smoke:archive-work and smoke:work-invocation pass on Node 24.15.0,
24.18.0 and 26.0.0 using intermediate candidate SHA-256
5d72db2d486ab187eef8da487abd519e31700e6e41bb7420a18850216d3eba05.
All 222 installed regular package files except npm-normalized package.json match
current repository bytes. This is not the final 0.6.0 seal.

Fresh npm test on Node 24.18.0 passes 1341 tests with no failures or skips.
CLI/docs parity, 494 documentation examples, syntax and diff checks pass.
Post-evidence full graph validation passes with three preserved bundle-age
warnings; changed-only validation has zero errors/warnings and SQLite is fresh.
Fifteen owned fixture/install/cache trees were removed; diagnostics retained.

## Pass / Fail Status

This milestone passes; bug-7, task-826 and Goal83 remain incomplete.

## Known Warnings

One fixture assertion initially expected a source attachment in artifacts.
Current source and fixture evidence prove input_refs is the correct field;
the assertion was corrected and all three complete archive runs repeated.
No product defect was established. Protected imported bundles remain stale.

An initial graph-check runner reused the previous milestone's temporary directory,
superseding six scratch graph-check files there. Their old digests remain in the
committed chk-590 artifact; do not treat those scratch files as original logs.
Current checks were rerun in this milestone's directory. Prior installed/full-suite
logs and all committed evidence are unchanged. See the artifact correction note.

# Known Issues / Follow-ups

Continue private current-graph migration rehearsal and representative scale,
then remaining qualification. Resolve old-client/killed-writer and bug-17
boundaries; final independent security review, release ladder, metadata and
candidate sealing remain mandatory.

## Follow-up Refs

bug-7, bug-17, task-826, task-827, task-828, task-829, task-830, goal-83, goal-84.

# Links / Artifacts

.mdkg/artifacts/goal-84/bug-7-work-archive.json. Compact diagnostic logs and
harnesses: /private/tmp/mdkg-work-qualification.FwzGCT. No remote evidence asserted.

# Raw Content Safety

Only synthetic summaries, source/package hashes and validation digests retained.
Goal-pursuit, pack-first and checkpoint skills reused. Skill candidates none.
