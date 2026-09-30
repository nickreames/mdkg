---
id: chk-650
type: checkpoint
title: Verify descriptor-backed SQLite observation under local Node runtimes
checkpoint_kind: test-proof
status: backlog
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-60-local-resume-evidence.json]
relates: [goal-86, test-488, task-828]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-60]
created: 2026-09-22
updated: 2026-09-22
---
# Summary

Bug60's Node-only local observational SQLite remedy now passes its focused
source and installed-package suite. Two deterministic interleavings establish
that an observation neither creates canonical WAL/SHM sidecars after a
journal-mode transition nor returns data from an inode replaced at the canonical
pathname. This is a local subsystem milestone, not Bug60 or Goal86 completion.

# Scope Covered

Scope: root:bug-60. Owner: mdkg-project-agent. Explicit target: root:goal-86;
selected Goal73 remains achieved and unchanged.

## Changed Surfaces

- `src/core/sqlite_observation.ts`; observational call sites in
  `src/graph/sqlite_index.ts` and the project DB migrations, queue, events and
  snapshot modules; `src/commands/db.ts` and `src/commands/work.ts` retain
  explicit mutation routes; `tests/core/sqlite_observation.test.ts`.
- Bug60 narrative, this checkpoint and its sanitized JSON receipt. Required
  mdkg event/index projection changes are separate generated custody.

## Boundaries

- In scope: generic SQLite observational contract and synthetic local fixtures.
- Out of scope: Bug47's ancestor-directory race, canonical DB migration, Linux
  or hosted qualification, security scan acceptance, full ladder, artifact seal,
  remote Git, publication, providers and sibling repositories.
- Raw secrets, raw prompts, raw payloads and bulky traces excluded.

# Decisions Captured

Dec97 retains Node-only local development; future Rust filesystem and Linux
GitHub Actions work belongs to Epics256/257. Neither defers the existing
0.6.0 release acceptance condition into a pass.

# Implementation Summary

Observations pre-admit a regular rollback-journal SQLite file, retain an
O_RDONLY/O_NOFOLLOW descriptor through native `DatabaseSync` reads using a
process-local fd path, and post-check sidecar/header state plus canonical
pathname and held descriptor identity. Explicit snapshot sealing and queue
mutations use separate writable paths. Unsupported descriptor platforms fail
closed; Linux behavior remains unverified. An independent read-only source
review found the missing final pathname comparison; it was added and covered
by an atomic-replacement regression. No further concrete canonical-write route
was found in the directly reviewed callers; this is not security clearance.

# Test Proof

- 2026-09-25 follow-up: the ten-path Bug60 source/test unit is locally committed
  as `6d23981e70bc68798def73c81b9cd5fa7bc9f3df`. Its staged patch was
  identical to a disposable parent-plus-only-Bug60 snapshot. Both canonical
  and isolated affected suites passed 91/91 on Node24.18/macOS arm64; the
  isolated build, CLI/docs/CI and graph/index checks passed. The earlier
  2224/2224 current-source full suite used the same Bug60 bytes. This remains
  a local source milestone, not Linux, independent security or release proof.
- Test target: `dist/tests/core/sqlite_observation.test.js` generated from
  current uncommitted source at HEAD c10113489381badf2845fc378c49b317376f953e.
- Owned synthetic fixture roots; isolated intermediate tarball under
  `/private/tmp/mdkg-bug60-installed.0W7PlN/`, SHA-256
  `2565feb6df9e29859f06836f6bd197aa391f59055665572fe0bc26c5323b7147`.
  npm packing and offline install used an isolated temporary cache; no host
  npm-cache repair, remote access or package publication.
- Source full: Node24.18.0/macOS arm64, 61/61 pass in 64.797 s.
  Installed full on the same intermediate tarball: Node24.15.0, 61/61 in
  57.847 s; Node24.18.0, 61/61 in 66.366 s; Node26.0.0, 61/61 in 70.117 s.
  Targeted source race/live-WAL writer controls: 4/4 each on Node24.15.0 and26.0.0.
- Gaps: Linux native descriptor semantics, Test488, Task828 independent
  security diff, final package-input
  freeze, full release ladder, platform matrix and exact artifact seal.

# Verification / Testing

## Command Evidence

- `npm run build && npm run build:test`: pass.
- Node test runner on focused source and isolated installed package: counts above.
- `mdkg index`: pass; full graph validate: pass with three existing stale
  imported-subgraph warnings; changed-only validate: pass with zero warnings;
  DB index verify: pass with all five caches fresh.
- `git diff --check`: pass after graph projection.
- Exact source-file hashes and prior failing-before WAL effect are in the
  linked JSON artifact. Intermediate package is not the sealed candidate.
- 2026-09-25 broader validation: host-evidence full test discovery on
  Node24.18.0/macOS arm64 ran 2224 tests, with 2223 pass and one stale
  DB/index expectation failure. The restricted run also failed because it
  lacked OS ownership proof; the affected 38-case interrupted-writer family
  passed on the host. After updating only the DB/index expectation to assert
  WAL refusal and unchanged bytes, `npm run build:test` passed, the exact
  failing case passed 1/1 and its complete file passed 30/30. The subsequent
  full suite on that corrected dirty-source snapshot passed 2224/2224 with zero
  failures or skips in 342.557 s using approved local host process evidence.
  Built CLI, documentation example and CI workflow checks also passed. The
  earlier failed runs remain failed intermediate attempts. This result does
  not qualify the final candidate or the required Linux/security/release gates.

## Pass / Fail Status

- Local Bug60 focused subsystem and current-source macOS full suite: PASS.
  Final-candidate, platform and security acceptance: NOT_READY.

## Known Warnings

- Goal86 still has Bug46/47, Test487 platform, Test488, Task828, full ladder
  and final seal gates. The retained fourteen security findings count is not
  increased by this distinct observational-contract bug.

# Known Issues / Follow-ups

1. Verify Linux behavior without weakening no-write invariants; do not
   silently assume `/proc/self/fd` has macOS-equivalent SQLite semantics.
2. Requalify this source against the final package after all remaining fixes.

## Follow-up Refs

- root:bug-60; root:test-488; root:task-828; root:test-487;
  root:goal-86; root:goal-85.

# Links / Artifacts

- `.mdkg/artifacts/goal-86/bug-60-local-resume-evidence.json`.
- No push, tag or publication. The initial checkpoint preceded the later
  local source commit recorded above.

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
