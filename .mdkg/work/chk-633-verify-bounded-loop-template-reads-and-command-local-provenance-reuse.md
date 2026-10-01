---
id: chk-633
type: checkpoint
title: Verify bounded loop template reads and command-local provenance reuse
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-56-baseline.json, .mdkg/artifacts/goal-86/bug-56-full-verification.json, .mdkg/artifacts/goal-86/bug-56-installed-verification.json]
relates: [bug-56]
blocked_by: []
blocks: []
refs: [goal-86, goal-84, test-488, task-828, bug-57]
context_refs: [goal-86, goal-84]
evidence_refs: [chk-632]
aliases: []
skills: []
scope: [bug-56]
created: 2026-09-21
updated: 2026-09-21
---
# Summary

1920 full tests and 312 installed cases pass; blocked context untouched; release remains NOT_READY

# Scope Covered

- Completed node: bug-56 (Loop inspection can exhaust memory by reading seeds without template limits)
- Node type: bug
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Loop catalog/provenance shared budgets and command-local reuse, bounded fresh
  indexed reads, imported body byte accounting, incremental frontmatter/purpose
  parsing, focused regression fixtures and README guidance.
- Bug56/Goal86 lifecycle and sanitized evidence. Required SQLite projection
  remains preserved dirty custody and is excluded from the local commit.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- Reuse capped template limits; retain direct seed isolation, title-only
  suggestions, parser line numbers and newline semantics. No new product policy.
- One writer on main; no blocked context, old scan recovery, remote Git,
  provider/deployment, publication, canonical migration or bundle refresh.

# Implementation Summary

- Bug55 already supplied safe seed admission. Bug56 adds bounded fresh indexed
  inputs, one catalog per command, unique-input file/byte accounting and parsing
  without millions of body-line array entries. Subsequent commands read fresh bytes.
- One independent candidate review identified imported show-body accounting;
  fresh synthetic reproduction confirmed it and a bounded helper callback fixes
  it. No second review cycle; final Task828 review remains separate.

# Verification / Testing

## Command Evidence

- Build and complete discovered suite:1920/1920 pass,0 fail/skip;424491ms,
  Node26.0.0/macOS arm64. Focused/nearby compatibility:161 pass.
- Exact installed candidate:104 each on Node24.15.0/24.18.0/26.0.0;312 total.
- CLI/docs/workflow parity, full/changed graph, SQLite and diff checks pass.
- Intermediate tarball SHA256:
  9c54ce1301ee1db89a5afe5f326c485346bb52d10707de46dd49493305f5ddca.
  All231 installed files unchanged; this is not the final release seal.

## Pass / Fail Status

- status: done

## Known Warnings

- Three pre-existing stale imported-bundle warnings remain; no refresh.
- Linux and final independent release review/qualification are unverified here.

# Known Issues / Follow-ups

- Eleven of14 retained findings have local remedies. Bugs46/47/57, adjacent
  Bugs58-60, Task828, Linux, full ladder/coverage and final seal remain open.
- Static containment does not close Bug47's concurrent ancestor substitution.
- Selected Goal73, runtime DB and Demo3 bundle hashes match the baseline receipt;
  five released leases, empty queues/messages, no held mutation or Git lock.
- Goal86 remains active; Goal85 paused; release NOT_READY. Next: Bug57.
- Skill coverage reused; candidates:none. No skill authoring.

## Follow-up Refs

- root:bug-57; root:test-488; root:task-828; root:goal-86; root:goal-85.

# Links / Artifacts

- .mdkg/artifacts/goal-86/bug-56-baseline.json
- .mdkg/artifacts/goal-86/bug-56-full-verification.json
- .mdkg/artifacts/goal-86/bug-56-installed-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
