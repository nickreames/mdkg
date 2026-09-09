---
id: bug-27
type: bug
title: Validate migration candidates and bind their skill dependencies
status: backlog
priority: 1
tags: [release-0.6.0, behavioral-audit]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-83/task-824-contract-audit.json]
relates: [task-824, goal-84, test-483]
blocked_by: []
blocks: []
refs: []
context_refs: [goal-84, goal-83, task-824]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-09
updated: 2026-09-09
---
# Overview

Migration preview/application omits checks performed by normal graph validation. A task referencing an absent skill receives safe_to_apply and a successful applied receipt while the resulting v2 graph remains invalid. Functional severity: medium; false migration validation and missing dependency provenance block publication. Candidate-only v2 behavior; no published 0.5.2 migration claim.

Owner: mdkg-project-agent. Goal: bounded root:goal-84 remedy discovered by root:task-824. Current intake authors evidence only. Future implementation stays within this bug, regression tests and required mdkg projections; use one writer, exact custody, and failing-before/passing-after installed proof. No canonical migration, protected bundle refresh, Git history action, remote/provider access, publication, unrelated source or cross-project writes. Preserve selected Goal 73, runtime DB, existing dirty state and source snapshot until audit closeout. Materially new policy needs Nick; no automatic risk waiver.

# Reproduction Steps

1. Start with a valid synthetic legacy graph. Give task-1 skills: [not-installed-skill].
2. Normal validate exits 2 with the exact missing-slug error.
3. Preview graph migrate with fixed graph/origin identifiers: safe_to_apply true and no blockers.
4. Apply the exact reviewed plan in the disposable fixture: exit 0, ok true, state applied, and a claim of strict authored validation. Normal validation afterward still exits 2.

# Expected vs Actual

The candidate must satisfy required semantic/dependency validation before any writes and again before a successful receipt. Missing skills must block without migration, rather than merely survive into a newly invalid v2 graph. Read-only external dependencies must participate in stale-plan checks.

# Suspected Cause

src/graph/identity_migration.ts uses indexAuthoredSnapshot, which lacks the complete known-skill and visibility/dependency checks in src/commands/validate.ts. src/graph/identity_transaction.ts finish uses the fuller candidate validator only for reconciliation, not migration. Reconciliation already demonstrates reusable dependency capture in validateReconciliationCandidate.

# Fix Plan

Reuse/extend shared virtual candidate validation rather than weakening normal validate or creating a separate definition of validity. Capture required canonical skill inventory/content and other actual validation dependencies in the reviewed plan, verify them before writes and through recovery, and only emit success after equivalent strict checks. Audit migration versus reconciliation parity for mounted references, visibility, schemas and archive dependencies. Distinguish existing unrelated warnings from blocking graph errors.

Allowed source: src/graph/identity_migration.ts, identity_transaction.ts, identity_reconciliation_plan.ts, identity_snapshot.ts and directly required shared validation helpers; focused regression tests/docs and mdkg evidence. No canonical migration or dependency refresh.

# Test Plan

- Missing/malformed skill references refuse preview/application without writes.
- Present valid skills allow migration; removal/addition/content changes after review invalidate the plan where relevant.
- Normal validation and virtual candidate checks agree on required graph, skill, visibility and archive conditions.
- Successful and interrupted migration preserve Git staging, runtime state and exact user bytes; resume/rollback respect dependency custody.
- Preserve imported read-only ownership and existing valid legacy/v2 controls.
- Require installed test-483 and independent task-828 verification; no remediation or final qualification yet.

# Links / Artifacts

- .mdkg/artifacts/goal-83/task-824-contract-audit.json
- root:test-483; root:task-828; root:goal-83
- Initial probe starts invalid deliberately to test refusal; the defect is false safe/applied validation, not a claim that migration created the original missing skill.
