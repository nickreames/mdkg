---
id: task-822
type: task
title: Apply reviewed identity reconciliation with durable alias receipts
status: done
priority: 1
epic: epic-83
parent: goal-82
tags: [alignment-002, execution-authorized]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [task-821]
blocks: []
refs: [edd-81, dec-93, goal-17, test-151]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-09-05
updated: 2026-09-06
---

# Overview

Complete the identity slice with reviewed reconciliation, durable mappings,
strict graph validation and recoverable application. Authorized by the explicit
Goal 82 Run. mdkg-project-agent accepts this lane after task-821's chk-567 proof;
selection and all canonical migration/Git/bundle/provider exclusions stay intact.

# Acceptance Criteria

- Fixed ancestor/target/incoming inputs produce deterministic classification and
  an exact authored-path plan. Preserve target aliases for distinct identities.
- Same-identity divergent lifecycle/evidence changes need explicit decisions.
- Bind apply to the reviewed plan/hash and unchanged revisions/worktree/index
  fingerprints. Preflight full mapping/reference safety before any write.
- Rewrite only proven identity-bound references; ambiguous legacy references block.
  Do not alter immutable external receipt bodies or arbitrary text substrings.
- Persist alias/path/origin mappings and strict validation results in receipts.
  Repeated integration/cherry-pick is idempotent; reverts do not silently resurrect.
- Generated indexes are rebuilt from authored results, bundles excluded.
  A tolerant rebuild is not success proof.
- No implicit Git stage/merge/rebase/commit/push or history rewrite.

# Files Affected

Future repair/reconcile implementation, shared reference rewriting, receipt
schema and disposable integration fixtures.

# Implementation Notes

Before applying, classify every path as authored in-scope, generated, immutable
evidence or unrelated. Inject failures to prove bounded recovery and custody.
Repeated mappings must not allocate another alias for already integrated identity.
No current Demo graph repair or canonical Git integration is part of this task.

# Test Plan

test-476 and test-151: offline cross-linked branches, same-node conflicts, repeated
integration, cherry-pick/revert, external receipt refs, stale plan, ambiguity,
partial failure, index rebuild and no staging. Goal 82 requires the full matrix.

# Links / Artifacts

- edd-81, goal-17, goal-82; evidence pending.

# Implementation Progress

2026-09-06: accepted after chk-567, claimed and started as mdkg-project-agent.
Execution pack: .mdkg/pack/pack_concise_task-822_20260906-185555363.md.

- src/graph/identity_reconcile.ts now contains a pure, non-applying three-way
  semantic planning kernel. It requires one graph/workspace ownership domain,
  normalizes proven structured references per input snapshot, preserves target
  labels/paths, and deterministically assigns incoming numeric or portable
  aliases on collision. It reports per-identity input/output hashes and mappings.
- Same-identity edits use field ancestry. Conflicting lifecycle/evidence groups
  and concurrent bodies need a reasoned explicit whole-node target/incoming/
  delete decision. No timestamp winner, array union or body substring rewrite.
  Exact selected body bytes and existing target bytes are retained where equal.
- Nine pure model fixtures pass: independent cross-links, disjoint same-node
  fields, lifecycle/evidence conflicts, exact body decisions, replay/cherry-pick
  identity states, delete/modify and prior-integration reintroduction barriers,
  ambiguity/ownership/stale decisions, empty bodies/path labels, portable typed
  manifest collision paths. These model tests are not real Git integration proof.
- Snapshot/recovery groundwork now inventories durable .mdkg/identity JSON
  evidence as authored provenance, within limits and containment checks. Its
  changes/new additions participate in stale-input and recovery custody checks.
  Runtime WAL/journal hashes augment the DB control fingerprint. Older journals
  missing these optional controls are compatible only while the files are absent.
  Two direct fixtures prove changed evidence, a new WAL, and new unowned receipt
  evidence cannot be silently consumed or overwritten by apply/recovery.
- Combined identity/migration/kernel regression run passed 31 tests before the
  ninth portable-kernel case; the final kernel run passed all nine. Build passed.
  Fixture wiring failures (ES2020 string API, test runtime import paths and
  missing parser/schema options) were corrected; they are not counted as proof.
- Final aggregate at this foundation boundary: npm run test:built PASS, 743
  TypeScript tests plus 26 public-release/security contract tests. Full/changed
  graph validation and git diff --check pass; only three inherited bundle-age
  warnings remain. No canonical migration or Git staging/history action occurred.

2026-09-06 revision-backed application milestone:

- `graph reconcile --ancestor <ref> --incoming <ref>` now previews an exact
  current-checkout plan, optionally using a reasoned stable-reference decisions
  JSON file. Application requires its exact unchanged hash. HEAD, Git index,
  authored files, identity evidence, validation schemas, selection/runtime DB,
  mounted bundles, skills and archive dependencies are rechecked. No implicit
  staging, source transplant, bundle refresh or remote access.
- Identity history uses bounded local Git pickaxe candidates followed by parsed
  headers in commits/parents. Cherry-picked then reverted identities cannot be
  treated as new creations. Verified canonical receipt payloads provide semantic
  bases and exact repeated-input no-ops even after the receipt was Git-reverted.
  A newer accepted Git ancestor supersedes an older receipt base; incomparable
  bases, shallow/grafted history, missing objects and malformed provenance fail
  closed. Explicit reintroduction decisions are recorded, never inferred.
- Durable reconciliation receipts contain input revisions/hashes, classifications,
  alias/path mappings, decisions and validation policy. Private transaction
  journals support exact resume/rollback. Read-only journal inspection reports
  per-path before/after/collision state and completed writes without body disclosure.
- Historical archive parsing no longer borrows current filesystem payload bytes
  as historical proof. Current/candidate payloads require containment and exact
  integrity; missing payloads remain a separately authorized transfer gate.
- A real mounted-identity fixture exposed strict local index validation running
  before imported identity context was available. V2 index validation now uses
  verified read-only mounts while preserving the local-only persisted index.
  Combined projections bind stable references and rebuild reverse edges without
  mutating either input projection. Source/bundle bytes remain unchanged.
- Twelve real local-Git scenarios live in
  tests/graph/identity_reconciliation_plan.test.ts: cross-links/alias collision,
  lifecycle decisions/stale inputs, receipt replay after revert, cherry-pick/revert
  without receipt, successive semantic integration, custody-safe resume, public
  CLI/staged-user preservation, exact archive dependencies, rollback, provenance/
  ancestor refusal, mounted identity boundaries and newer accepted Git ancestry.
- Validation: 24 migration/reconciliation tests passed before the mounted case;
  39 reconciliation/transport/subgraph tests passed after its fix. Full npm test
  passed 754 TypeScript plus 26 public-release/security tests before the final
  newer-ancestor regression; that regression then passed independently with a
  fresh build. Final aggregate then passed 755 TypeScript plus 26 public-release/
  security tests. Goal acceptance reconciliation remains pending.
  CLI/docs checks passed (478 examples); full/changed mdkg validation and diff
  checks passed, with only three inherited bundle-age warnings.

Goal 82 is not complete from this implementation milestone. test-151, test-475
and test-476 must still receive case-level acceptance evidence and final aggregate
validation. Canonical migration/adoption, Git staging/commits/pushes, bundle or
subgraph refresh, providers and cross-project writes remain excluded. Skill
coverage reuses existing goal/verification procedures; skill candidates: none.
