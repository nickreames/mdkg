---
id: chk-613
type: checkpoint
title: Verify helper-free Git observations and exact provenance
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-41-local-verification.json, .mdkg/artifacts/goal-86/changed-warning-intake.json]
relates: [bug-41]
blocked_by: []
blocks: []
refs: [test-479, test-484, test-487, task-828, bug-42, bug-43]
context_refs: [goal-86, goal-84, dec-96]
evidence_refs: [chk-612]
aliases: []
skills: []
scope: [bug-41]
created: 2026-09-15
updated: 2026-09-15
---
# Summary

Bug41 is locally verified and done:1,474 source tests and726 installed cases per
required Node runtime pass. Goal86 remains NOT_READY. Exact final0.6.0 installed
macOS/Linux, Standard, independent full-remediation diff, coverage/full ladder
and seal remain open; Goal85 stays paused under separate publication authority.

# Scope Covered

- Completed node: bug-41 (Prevent configured Git helpers from executing through generic graph observations)
- Node type: bug
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Fourteen source/test/fixture files individually named and hashed in the receipt:
  shared Git observation helper, existing callers and CLI-only regressions.
- Bug41 and this checkpoint, Goals84/86, requirement coverage, Bug43 intake and
  task827/test480/task828 dependencies, sanitized evidence and required projections.
- Prior Bug17/35/40/39 work is preserved. Whole-file hashes bind combined owned
  candidate bytes, not exclusive ownership of all pre-existing diff hunks.

## Boundaries

- Explicit Goal86 Run; one canonical writer and bounded source-read-only review.
  Native Git operations and package installs occurred only in synthetic owned
  fixtures/isolated prefixes. No recovered Demo3 application payload was executed.
- Main38205296208c23fcfcc6fc821a295040be05c0bb stays50ahead/0behind cached origin/main;
  no remote verification, staging, commit, push, release or provider action.
- Selected Goal73, runtime DB, Demo3 bundle and Git index retain their exact
  accepted hashes. Five runtime leases remain released; queues/messages are empty.
- Canonical migration, branch/worktree changes, bundle refresh and cross-project
  writes remain excluded. No raw security reports, secrets or payloads are copied.

# Decisions Captured

- Refuse active content filters rather than disabling them and fabricating clean
  state. Config enumeration and guarded Git commands must share effective config.
- Distinguish missing/Boolean attributes from literal sentinel-named drivers via
  native read-only probing with executable drivers disabled only for the probe.
- Keep verified historical imports inspectable, but mark unknown source state
  stale and refuse fresh-only or action receipts. Missing recorded HEAD is stale.
- Generic enforced CLI behavior belongs in implementation/tests; no new skill.

# Implementation Summary

- Shared fsmonitor/optional-lock/lazy-fetch controls, strict UTF-8/NUL parsing,
  effective-filter inventory, nested cwd and initialized-submodule handling.
- GIT_CONFIG shadowing, attribute-state ambiguity and literal-backslash dirty
  provenance fixes follow reproduced candidate-review findings. The parent also
  reproduced and corrected missing recorded-HEAD freshness.
- Missing-event upgrade previews do not execute fsmonitor or reconstruct history.
  No Git workflow wrapper, consumer policy or new public command was added.

# Verification / Testing

## Command Evidence

- Build/test-build and1,474 full discovered tests pass on Node24.18.0/macOS:
  zero failures/skips. CLI/help/contract/docs/workflow parity and diff checks pass.
- Intermediate tarball version0.5.2,225files,SHA256
  bd7d6fbdc6b6b99d4ad23a4f61b0ad3c5f853bf9f0f330c7cae6fa5980cee987.
  Exact installed bytes pass430 direct observations,288 registered-child
  observations,two upgrade cases andsix provenance cases per Node24.15.0,
  24.18.0 and26.0.0. Complete result matrices agree across runtimes.
- Standalone/nested/worktree/submodule/gitdir paths, active/unused/sentinel-named
  filters, failed/malformed output, native trigger controls and deliberate graph
  mutations retain file-content/mode/topology inventories and Git staging.
- An overlapping build invalidated one intermediate test run. A separate fixture
  used unsupported init --json; it was corrected and the full source/minimum
  installed suites rerun. No weakened assertion or missing-case waiver.
- Graph validation has0errors andthree existing stale-import warnings; changed-only
  has0errors. SQLite verifies fresh after sequential writes finish. Post-checkpoint
  results and bookends are attached to the receipt, not inferred from task done.

## Pass / Fail Status

- Bug41 local implementation:PASS. Final platform/security/artifact:UNVERIFIED.

## Known Warnings

- Three existing stale imported bundles remain unrefreshed. Windows is unqualified;
  Linux and fresh security coverage remain required. Source tests are not coverage
  floor or full release-ladder proof. Temporary candidate is not a release seal.

# Known Issues / Follow-ups

- Bug42 copied-cache metadata is next. Bug43 is a separate publication blocker:
  current and retained published0.5.2 omit changed-only warnings for nested Git
  roots and literal backslash names. It is planned, unclaimed and not fixed here.
- Task835/836, final installed families, task837, task828, task829 and task830 remain.
- Owned synthetic reproduction checkouts were removed after retaining diagnostics;
  intermediate tarball, installed packages and compact proof remain in owned temp.

## Follow-up Refs

- root:bug-42,root:bug-43,root:test-484,root:test-487,root:task-828,root:goal-86.

# Links / Artifacts

- .mdkg/artifacts/goal-86/observational-boundary-reproductions.json
- .mdkg/artifacts/goal-86/bug-41-local-verification.json

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
