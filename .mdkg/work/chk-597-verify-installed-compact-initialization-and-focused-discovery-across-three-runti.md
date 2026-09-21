---
id: chk-597
type: checkpoint
title: Verify installed compact initialization and focused discovery across three runtimes
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-7-init-discovery.json]
relates: [bug-7]
blocked_by: []
blocks: []
refs: [goal-83, goal-84, task-826, task-828, test-477, test-482]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-7, test-477, test-482]
created: 2026-09-09
updated: 2026-09-09
---
# Summary

The installed compact-init/discovery matrix passes eight scenario groups and
77 commands on each of Node 24.15.0, 24.18.0 and 26.0.0: 24 groups and 231
commands total. The final full suite passes 1395 tests with no failures/skips.
This is a bounded test milestone, not complete Bug7 or release qualification.

# Scope Covered

Bug7 qualification infrastructure and test477/test482 evidence. The accepted
compact bootstrap and generic single-writer graph boundaries are unchanged.

## Changed Surfaces

- scripts/smoke-init.js; tests/smoke-init-discovery.test.mjs; linked evidence,
  Bug7/test477/test482/task826 narratives and required index projections.

## Boundaries

- In scope: owned disposable installed-CLI tests, local evidence and validation.
- No product source, canonical bootstrap/migration/bundle refresh, runtime DB,
  remote Git, provider, deployment, publication, root/sibling or skill changes.
- Raw logs and invalidated fixture diagnostics stay under owned /private/tmp.

# Decisions Captured

No material product policy accepted. Old-writer v2 adoption, killed-writer
recovery and legacy public-bundle materialization remain unresolved.

# Implementation Summary

Retain original smoke:init groups and add independent explicit-agent setup,
fresh customized instructions/docs, scoped link resolution and complete native
resource equality. CLI-discovered skills must equal the canonical roster.
Skill list/show/search preserve fixture inventories. Sync must preserve an
independent pre-sync canonical snapshot, not merely make all copies equal.
Correct the stale removed-flag test expectation to current compact-default
guidance without weakening rejection or no-scaffold assertions.

# Test Proof

- Installed intermediate tarball SHA256:
  39575a351ed5eb7b7074721102863aa3000a842630f7ed2597e30d490a1f349b.
- Fixtures: /private/tmp/mdkg-init-qualification.0ZV2pV; three final success
  roots removed. Final runtime/package/source and command hashes are recorded.
- Keep scoped link syntax, byte-only inventory and reused-install limits explicit.

# Verification / Testing

## Command Evidence

- Final npm test on Node24.18.0: 1395 pass, zero failures/skips.
- Twelve focused verifier tests cover broken/escaping links, missing/changed/
  extra native resources, roster mismatch and synchronized canonical loss.
- Three strengthened installed runs: each8groups/77commands, five expected
  refusals, no signals, matching custody bookends and fixture cleanup.
- CLI/docs pass, with 494 command examples checked. Full/changed graph and
  SQLite verification pass; git diff --check passes. Three pre-existing stale
  subgraph warnings remain in full validation, none in changed-only validation.

## Pass / Fail Status

- Bounded installed proof passes; aggregate qualification remains NOT_READY.

## Known Warnings

- The original minimum-runtime run overlapped an owned build cleaning dist and
  failed its post-run custody check. It is retained and excluded from acceptance.
- Earlier Node26/Node24 runs predate strengthened resource assertions and are
  supplemental only. Final runs are node24-min-v2, node24-v2 and node26-v3.
- Existing stale subgraph warnings are preserved, never refreshed here.

# Known Issues / Follow-ups

- Add installed fresh stale-upgrade-plan refusal and tracked-node mixed
  staged/unstaged coverage; requalify recovery after the transaction optimization.
- Resolve compatibility/recovery/historical migration decisions; finish Bug17,
  final security diff review, draft0.6 metadata, full ladder and artifact seal.

## Follow-up Refs

- bug7, task826, test477 through test482, task828, goals83/84/85.

# Links / Artifacts

- .mdkg/artifacts/goal-84/bug-7-init-discovery.json contains case-level coverage,
  evidence corrections, exact runtime hashes and qualification limitations.
- Prior scale unit locally committed as1cd6a889a3e18f0d471a289858cdce9eed7fd7b9.
  No push or publication. Separate Bug17/generated-state custody remains intact.

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.

Skill coverage: pursue-mdkg-goal, build-pack-and-execute-task,
verify-close-and-checkpoint and source-grounded-diagnose-and-fix. Candidates:none.
