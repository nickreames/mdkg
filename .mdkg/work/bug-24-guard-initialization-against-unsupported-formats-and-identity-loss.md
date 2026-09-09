---
id: bug-24
type: bug
title: Guard initialization against unsupported formats and identity loss
status: done
priority: 1
tags: [release-0.6.0, behavioral-audit]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-83/task-824-behavioral-audit.json, .mdkg/artifacts/goal-84/bug-24-verification.json]
relates: [task-824, goal-84, goal-83]
blocked_by: []
blocks: []
refs: []
context_refs: [goal-84, goal-83, task-824]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-08
updated: 2026-09-09
---
# Overview

Initialization can introduce identity-less nodes into an adopted graph and writes through an unsupported format manifest. Impact: a valid graph becomes invalid and forward-compatibility protection is bypassed. Functional severity: medium; release blocker.

Owner: mdkg-project-agent. Context: root:task-824 under root:goal-83; remediation belongs to root:goal-84. Publication blocker, not a new security advisory. No source fix or verification is claimed at intake.

Allowed future remedy: named source paths, directly required helpers, regression tests, and sanitized mdkg evidence under the approved local qualification contract. Preserve numeric aliases, explicit v2 adoption, user-authored content, Git staging, selected Goal 73, runtime DB and protected bundles. No canonical migration, bundle refresh, remote/provider action, publication or unrelated refactoring. Stop on ownership collision, moving baseline or a materially new decision. Require failing-before/passing-after installed evidence and independent root:task-828 verification.

# Reproduction Steps

In a copied valid v2 graph remove legacy HUMAN.md and its incoming COLLABORATION relates edge, then validate (exit 0). Run init or init --graph-only: exit 0, HUMAN.md is restored without graph_id/node_id, and validation exits 2. Separately set format_version=99: init exits 0 and creates 28 files. Complete v2 graph controls for default/--agent/--graph-only remain valid.

# Expected vs Actual

Init must respect format capability and never silently introduce invalid or reidentified nodes. Complete supported initialization stays usable. Actual: restored v1 seed invalidates v2; unsupported manifests do not stop bootstrap writes.

# Suspected Cause

src/commands/init.ts copies absent seed nodes without graph-format/identity preflight. The normal shared mutation lock's format gate does not cover this path.

# Fix Plan

Preflight the complete write set against graph format before any persistent write. Preserve complete-graph idempotency and customization. If restoring a node needs reviewed identity/reintroduction, refuse with actionable guidance rather than invent an identity or recover alias identity from insufficient provenance. Cover force, upgrade interactions, and interrupted bootstrap without authorizing canonical migration.

Allowed paths: src/commands/init.ts and directly required bootstrap/identity helpers; init/upgrade regression fixtures. No canonical instructions or graph migration.

Affected-version assessment: Confirmed candidate against adopted and future-format fixtures. Existing 0.5.2 clients must be tested separately in legacy/v2 qualification; no claim that old clients already provide v2 guarantees.

# Test Plan

Fresh legacy init; complete v2 default/graph-only/--agent; valid v2 omitting legacy core; unknown format/required feature/minimum writer; --force; custom roots/instructions; no partial writes on refusal; repeated and interrupted operation; user docs preserved.

Acceptance: all reproduced failures corrected with passing controls preserved; root:test-483 and root:task-828 verify the exact installed candidate. No missing proof is a waiver.

# Links / Artifacts

- .mdkg/artifacts/goal-83/task-824-behavioral-audit.json
- root:test-483; root:task-824; root:task-828; root:goal-84
- Initial candidate SHA-256: 3238663f76882f094cfd1e9c86abbd43e057aa165ec69099a976949f9d011c05 (development metadata 0.5.2; not a 0.6.0 seal).

## 2026-09-09 Local Verification

Initialization now checks the format contract and complete seeded/fallback core
candidate set before persistent writes. It rejects unsupported capabilities,
missing manifest evidence, and unsafe v2 restoration/force replacement. It
preserves complete adopted graphs and customized instructions, supports recovery
of missing non-node guidance, refuses unfinished upgrade custody, and uses the
existing shared writer lock with a repeated preflight under ownership.

Twenty-two new regression cases: the prior installed candidate fails eighteen
safety expectations while four supported controls pass. The corrected installed
package passes all 44 init/compact/upgrade cases on Node 24.18.0 and 26.0.0.
The final full suite passes 1130 source tests and 26 contract checks. Build,
CLI/docs (494 examples), full/changed graph, SQLite and diff checks pass.
Evidence: .mdkg/artifacts/goal-84/bug-24-verification.json.

Adjacent installed probes create bug-28 (unsafe v2 upgrade restoration) and
bug-29 (unshipped seed references preventing migration), both explicitly block
test-483/task-828. No adjacent fix is claimed. The synthetic closed graph used
by these init regressions is not proof that untouched packaged seeds migrate.

No canonical init, migration, selection change, bundle refresh or remote action.
Selected Goal 73, runtime DB and protected Demo 3 bundle retain exact hashes;
partial bug-17 work and the mixed SQLite projection remain excluded from this
commit unit. Final independent task-828 review, full runtime matrix and release
qualification are still required. New skill candidates: none.
