---
id: chk-631
type: checkpoint
title: Verify bounded numeric graph allocation
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-54-baseline.json, .mdkg/artifacts/goal-86/bug-54-full-verification.json, .mdkg/artifacts/goal-86/bug-54-installed-verification.json]
relates: [bug-54]
blocked_by: []
blocks: []
refs: [goal-86, goal-84, test-488, task-828, bug-55]
context_refs: [goal-86, goal-84]
evidence_refs: [chk-630]
aliases: []
skills: []
scope: [bug-54]
created: 2026-09-21
updated: 2026-09-21
---
# Summary

1816 full tests and 258 installed cases pass; blocked context untouched; final release remains NOT_READY

# Scope Covered

- Completed node: bug-54 (Large numeric aliases can hang repair or corrupt newly authored graph nodes)
- Node type: bug
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Bounded arithmetic in util/id; new/checkpoint/loop/fix consumers; task-done
  checkpoint preflight; prospective authoring and SQLite reservations.
- Numeric allocation regression suite, README contract, sanitized receipts and
  Bug54/Goal86 progress. Generated indexes are derived; tracked SQLite dirt is
  preserved and excluded from the local commit.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- Safe-integer authoring, historical inspection compatibility, portable IDs,
  exact SQLite counters and explicit legacy relationship staging are distinct.
- One writer on main; fresh temporary fixtures only. No blocked Security context
  or recovered scan artifacts. No remote Git, publication or provider action.

# Implementation Summary

- Fresh authored graph admission prevents stale cached maxima. Prospective
  syntax, aliases, identities and discovery bounds precede transactional alias
  reservation. Composite completion validates its actual checkpoint body.
- One independent candidate review's three gaps were addressed. Full-suite
  compatibility failures were retained, corrected and rerun, not waived.

# Verification / Testing

## Command Evidence

- Full discovered suite: 1816 pass, 0 fail, 0 skip; 412640ms on Node26/macOS arm64.
- Final compatibility: 147 pass; allocation suite:86 pass; earlier focused:220.
- Exact installed package:86 cases each on Node24.15.0/24.18.0/26.0.0;258 total.
- CLI/docs/workflow parity, full/changed-only graph, SQLite and diff checks pass.
- Intermediate tarball SHA256:
  7bf5c746dc35a36e6efdee7ce7d6a6a0e2fabdb36c842e112b23abbbbeb1f3e4.
  All230 package files unchanged. Not a final release seal.

## Pass / Fail Status

- status: done

## Known Warnings

- Three existing stale imported-bundle warnings preserved; no bundle refresh.
- Linux and final independent Security/release gates are not established here.

# Known Issues / Follow-ups

- Nine of14 retained findings have local remedies. Bugs46/47/55-57 and adjacent
  Bugs58-60 remain open, plus Task828, platform coverage, full ladder and seal.
- Protected selected Goal73, runtime DB and Demo3 bundle hashes match entry.
  Five runtime leases remain released; queue/messages empty; no held writer lock.
- Goal86 remains active and Goal85 paused. Release NOT_READY. Next: Bug55.
- Skill coverage reused; new candidates:none. No skill authoring or dispatch.

## Follow-up Refs

- root:bug-55; root:test-488; root:task-828; root:goal-86; root:goal-85.

# Links / Artifacts

- .mdkg/artifacts/goal-86/bug-54-baseline.json
- .mdkg/artifacts/goal-86/bug-54-full-verification.json
- .mdkg/artifacts/goal-86/bug-54-installed-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
