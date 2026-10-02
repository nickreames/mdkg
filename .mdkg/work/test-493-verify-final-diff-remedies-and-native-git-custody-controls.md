---
id: test-493
type: test
title: Verify final diff remedies and native Git custody controls
status: done
priority: 1
tags: [release-0.6.0, final-diff-remedy]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/independent-diff-review-20260930.json, .mdkg/artifacts/goal-86/successor-installed-case-acceptance-20260930.json, .mdkg/artifacts/goal-86/successor-installed-platform-qualification-20260930.json, .mdkg/artifacts/goal-86/successor-security-acceptance-20260930.json]
relates: []
blocked_by: [bug-63, bug-70, bug-71, bug-72, bug-73]
blocks: []
refs: [goal-86, goal-84, task-828, test-488, test-491, bug-63, bug-70, bug-71, bug-72]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-09-30
updated: 2026-09-30
---
# Overview

Goal: independently verify final diff security/integrity remedies on exact
successor installed0.6.0 bytes. Owner: mdkg-project-agent.
Context: partial scan e5e0584a at c313d804 and f7cbdc1d reproduced two low security
findings and two native-Git correctness defects. No release clearance follows.

# Target / Scope

Bugs70/71/72/73 plus Bug63's destination-root/recursive-clean extension.
Reuse existing Test488/491 families rather than duplicate their accepted cases.

# Preconditions / Environment

Synthetic owned fixtures only, supported Node >=24.18.0 <25, installed artifact
with recorded input/SHA256/integrity identities, macOS ARM64 and local Ubuntu24
ARM64/native plus x86_64/emulated as required. Windows/hosted/consumer adoption unqualified.
Do not initialize or migrate canonical graph/DB or contact remotes/providers.

# Test Cases

1. Non-special credential descriptors and alternate parser/mixed-separator forms
   cannot retain userinfo in shared helper and inspection/provenance sinks; safe
   descriptors and idempotence survive.
2. Pending skill new/force refuses per-file/combined/count overflow before writes;
   replacement uses new bytes once and within-budget controls succeed. Existing
   mirror-control manifests obey per-file/aggregate budgets; new/force/sync
   refusal preserves complete inventories, with exact-boundary positive controls.
3. Materialization clean refuses native Git at target root and affected nested
   destinations; excessive incoming growth and virtual bare-store signatures
   refuse before temporary creation or deletion. Legitimate generated clean and
   exact-limit input remain usable, staging unchanged.
4. DB snapshot/configured mutable outputs refuse actual native Git administration
   before any runtime/state/manifest effects; default/custom legitimate seals work.
5. Both canonical test launchers remove ambient Git routing from worker
   environments, preserve unrelated inputs and do not mutate the parent.

# Results / Evidence

Baseline effects are in independent-diff-review-20260930.json. Record source,
installed artifact, platform, commands/counts, failed/positive controls and cleanup.
Raw security reports stay plugin-owned. Bug-local passing controls alone do not
establish this test, complete Task828 coverage, full ladder or exact artifact seal.

# Boundaries / Completion

Read-only independent verification after fixes freeze; no source edits during
that review. Additional supporting diff coverage must be completed separately
under Task828. New confirmed defects route to bounded ownership, no automatic waiver.
Bugs46/47 stay deferred unresolved; Goal85 remains paused. Skill candidates: none.
