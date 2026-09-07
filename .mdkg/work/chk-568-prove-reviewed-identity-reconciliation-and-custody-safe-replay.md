---
id: chk-568
type: checkpoint
title: Prove reviewed identity reconciliation and custody-safe replay
checkpoint_kind: implementation
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: [task-822]
blocked_by: []
blocks: []
refs: [goal-82, edd-81, chk-567, test-151, test-475, test-476]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-822]
created: 2026-09-06
updated: 2026-09-06
---
# Summary

Task-822 implementation is complete: revision-backed reviewed identity
reconciliation, durable alias receipts, replay/revert evidence and recoverable
application. Goal 82 acceptance remains open in test-151/test-475/test-476.
No canonical graph migration, staging, commit, push or remote authority was used.

# Scope Covered

- Completed node: task-822 (Apply reviewed identity reconciliation with durable alias receipts)
- Node type: task
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Source: identity_history, identity_reconciliation_plan, identity_reconcile,
  identity_snapshot, identity_transaction and graph_identity command modules;
  archive parser integrity separation, mounted index/reference validation;
  CLI dispatch/help/contract and command documentation projections.
- Direct proof: tests/graph/identity_reconciliation_plan.test.ts (twelve actual
  local Git scenarios) plus migration, pure reconciliation, graph transport and
  subgraph regression tests. Raw fixture evidence remains test-owned, not copied
  into public graph nodes.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- Nick's explicit Goal 82 Run authorizes local source and mdkg evidence work.
- Exact reviewed plan hash binds authored inputs, HEAD/index, validation schema,
  identity provenance and local dependencies. No Git merge or staging is implicit.
- Accepted receipt ancestry can supply the semantic base; a newer accepted Git
  ancestor supersedes it. Incomparable/missing/shallow/grafted evidence fails
  closed, never fetches or guesses. Reverts do not silently resurrect identities;
  reasoned explicit reintroduction remains possible.

# Implementation Summary

- Preview is observational and body-redacted; apply is hash-bound and journaled.
  Complete alias/path/reference mappings precede writes. Historical bodies and
  external receipt hashes are preserved; source/config/public-copy changes are
  excluded. Journals expose per-path before/after/collision observations and
  completed writes. Resume/rollback preserves independent user edits.
- Mounted identities participate in strict validation without entering the
  persisted local-owned index or granting source mutation. Archive payloads must
  already exist with exact integrity; their transfer/rebuild is never implicit.

# Verification / Testing

## Command Evidence

- Fresh build passed; full npm test passed 754 TypeScript plus 26 public-release/
  security tests before the final newer-ancestor case. That final case then
  passed independently with a fresh build. Final aggregate then passed all 755
  TypeScript tests plus 26 public-release/security tests (zero failures).
- Focused migration/reconciliation: 24 passed; reconciliation/transport/subgraph:
  39 passed after the mounted-identity fix. Fixture setup/assertion failures were
  corrected, not counted as passing proof.
- CLI matrix and generated docs checks passed, including 478 command examples.
  Full/changed graph validation and git diff --check passed before this narrative.
  Re-index and validation follow this checkpoint update.

## Pass / Fail Status

- Implementation milestone: done. Goal-level acceptance: pending.

## Known Warnings

- Three inherited stale imported-bundle warnings remain unchanged. They do not
  authorize bundle refresh or establish live source freshness.

# Known Issues / Follow-ups

- Complete test-151, test-475 and test-476 case-level acceptance, final aggregate
  validation and explicit Goal 82 evaluation before considering goal closure.
- Canonical checkout remains legacy format on main; migration/adoption, Git
  publication, bundles and provider/deployment work require separate authority.

## Follow-up Refs

- root:test-151 next; root:test-475 and root:test-476 follow under Goal 82.
- Generic mdkg identity/compatibility ownership only. Runtime orchestration and
  project-specific policy remain outside this implementation.
- Skill coverage: existing goal pursuit and verification/checkpoint procedures;
  reconciliation skill search returned none. New skill candidates: none.

# Links / Artifacts

- No artifacts were attached by the completion command.

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
