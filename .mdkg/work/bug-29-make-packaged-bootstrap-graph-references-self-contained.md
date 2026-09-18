---
id: bug-29
type: bug
title: Make packaged bootstrap graph references self-contained
status: done
priority: 1
tags: [release-0.6.0, behavioral-audit]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-24-adjacent-findings.json, .mdkg/artifacts/goal-84/bug-29-verification.json]
relates: [goal-84, goal-83, bug-7, test-483]
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

Fresh installed default initialization seeds references to unshipped design
nodes dec-53, edd-3 and edd-6. Explicit identity migration refuses this fresh
graph because those references have no proven identity bindings. This breaks
the concise-init-to-branch-collaboration journey. Functional severity: medium;
publication blocker, not a new Standard security finding.

# Reproduction Steps

1. Run default init from the installed candidate in an empty disposable folder.
2. Request explicit legacy identity migration with valid graph/origin UUIDs.
3. Observe three blockers: COLLABORATION refs dec-53 and SOUL refs edd-3/edd-6.

# Expected vs Actual

- Expected: packaged portable bootstrap references form a coherent graph that
  can adopt v2 without users manually removing references or importing repo policy.
- Actual: package-specific dangling references prevent adoption.

# Suspected Cause

scripts/copy-init-assets.js copies repository .mdkg/core into the package,
including references to repository design nodes that the package does not ship.

# Fix Plan

Owner mdkg-project-agent; bounded goal-84 remedy. Provide portable, self-contained
packaged guidance and enforce reference closure during package qualification.
Prefer explicit public seed ownership rather than copying unrelated repository
design documents. Preserve existing user-authored and customized legacy guidance;
do not silently delete their references or weaken migration's identity checks.

Allowed: packaged bootstrap seed/build helpers, directly required seed assets,
regression/release checks and owned evidence. No canonical core/instruction edits,
consumer upgrades, canonical migration, bundle refresh, remote Git, publication,
provider or root/sibling work. Other goal-84 exclusions and stop conditions apply.

Affected-version assessment: current installed candidate proven. Confirm whether
0.5.2 seeds also contain these references separately; do not claim old clients
support v2. This is distinct from completed bug-6 documentation wording and
bug-27 migration validation, which must continue rejecting unbound references.

# Test Plan

Extend test-483 and installed bootstrap qualification: untouched fresh default,
--agent and --graph-only initialization; reference closure; task creation and
explicit migration; ordinary v2 graph use; installed package without repository
design files; legacy/customized upgrade preservation and seed provenance. Full
tests and task-828 independent verification remain required.

# Links / Artifacts

- .mdkg/artifacts/goal-84/bug-24-adjacent-findings.json
- root:bug-7, root:test-483, root:task-826 and root:task-828.

## Local Verification — 2026-09-09

Public core guidance now has explicit ownership under assets/init/core rather
than copying the maintainer graph. Ten rule IDs, eleven filenames and all five
historical search aliases remain. Canonical node/schema parsing, reference
closure, identity-free seeds, exact inventory/pins, required aliases and built
byte parity gate build and static package readiness. Core guidance drops from
61020 to 12440 bytes without modifying canonical instructions or project docs.

Before: three fresh-init-to-v2 tests failed with missing dec-53/edd-3/edd-6.
After: 45 focused tests on each of Node24.18.0 and26.0.0; 23 installed tests on
each runtime; 1249 full ordinary tests, zero failures/skips. Actual published
0.5.2 upgrade fixtures prove managed hashes, alias preservation, custom-content
protection, repeated preview, interrupted recovery and explicit v2 adoption.
Preserved custom legacy references continue to block migration, as required.

Two independent functional guard findings were reproduced/corrected; final
source review found no remaining concrete bug29 defect. This is not independent
security clearance. Artifact: .mdkg/artifacts/goal-84/bug-29-verification.json.
Full/changed graph, SQLite, CLI/docs and diff checks pass. Goal83/84, final
task-828, installed full matrix, release ladder and seal remain incomplete.
New bug32 tracks stale source-emitted upgrade help separately; no source fix for
that intake is included. No new skill candidate or publication authority used.
