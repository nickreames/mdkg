---
id: chk-582
type: checkpoint
title: Verify portable compact bootstrap seeds and installed upgrade compatibility
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-29-verification.json]
relates: [bug-29]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-29]
created: 2026-09-09
updated: 2026-09-09
---
# Summary

Bug29 is fixed and locally verified, not release-qualified. Public bootstrap
guidance is self-contained and concise without importing maintainer graph policy.
The verification artifact binds source/runtime/package hashes, protected state,
exact commit allowlist and remaining publication gates.

# Scope Covered

- Completed node: bug-29 (Make packaged bootstrap graph references self-contained)
- Node type: bug
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Eleven explicit public core seed files; seed copy and build/release guard;
  regression coverage; bug29/Goal84 evidence and new bug32 intake/dependencies.
- Existing maintainer instructions/core, Demo3 bundle, selected Goal73, runtime
  database and partial bug17 changes are preserved. SQLite is separate dirty
  generated custody, not part of this commit.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

- Ten IDs and five historical search aliases preserved; public core shrinks
  from 61020 to 12440 bytes. Rule schema, references, identity exclusion, inventory,
  aliases, pins and built parity are enforced without weakening migration.
- Known legacy seeds update only through reviewed hash provenance. Custom content
  survives; its unbound references remain explicit migration blockers.

# Verification / Testing

## Command Evidence

- Build, full/changed graph, SQLite, CLI/docs and static package gates pass.
- 45 focused tests each on Node24.18.0/26.0.0; 23 installed tests each, plus
  actual published0.5.2 upgrade/customization/interrupted recovery scenarios.
- Full ordinary suite:1249 pass, zero failures/skips, Node26.0.0.
- Independent source-only functional review: two guard gaps reproduced and
  corrected; final review found no remaining concrete bug29 defect. This is not
  the separately required final security diff scan.

## Pass / Fail Status

- status: done

## Known Warnings

- Three existing imported-bundle age warnings remain; no refresh authority used.

# Known Issues / Follow-ups

- Bugs17,26,27,32; full installed matrix, exact24.15 runtime, draft0.6 metadata,
  independent task828, release ladder and final artifact seal remain open.
- Source-emitted stale upgrade hints are recorded in bug32, not silently fixed
  in this seed change. Next bounded recommendation: bug26 recreation provenance.
- Local commit authority only; no push, publication, tag/history, provider,
  deployment, canonical migration/upgrade or bundle/subgraph refresh.
- No runtime writer lease acquired; transient locks released after CLI writes.
- Skill candidates:none; boundary skill kept generic seeds separate from repo policy.

## Follow-up Refs

- task/test/goal refs: inspect the completed node and checkpoint frontmatter

# Links / Artifacts

- .mdkg/artifacts/goal-84/bug-24-adjacent-findings.json
- .mdkg/artifacts/goal-84/bug-29-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
