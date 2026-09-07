---
id: test-151
type: test
title: future graph upgrade dry-run no-mutation contract
status: done
priority: 1
epic: epic-83
tags: [future, graph-upgrade, dry-run, no-mutation, alignment-002]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [task-363, task-820, task-822]
blocks: []
refs: [edd-81, goal-82, test-475, test-476, chk-568]
aliases: []
skills: []
cases: [upgrade plan is dry run, graph mutation is explicit, no publish dependency]
created: 2026-06-11
updated: 2026-09-06
---

# Overview

Existing no-mutation verification lane extended for goal-82 and edd-81 under
MDKG-INTERACTIVE-ALIGNMENT-002. The explicit Goal 82 Run authorizes this acceptance
pass; mdkg-project-agent accepts ownership after task-822/chk-568.
Historical lower-priority release framing is superseded for this scoped priority,
not a promise to publish or migrate another repository.

# Target / Scope

task-820 migration preview and task-822 reviewed reconciliation. Reuse task-363
planning evidence and complement test-475/test-476 rather than duplicate them.

# Preconditions / Environment

Disposable local legacy/v2 graphs and Git fixtures, dirty unrelated sentinel
files, captured authored/index/cache/event/selection/claim/Git-index fingerprints.
No downstream/provider access and no canonical graph migration.

# Test Cases

- Preview leaves source, mdkg, indexes/caches, events, selected goal, claims,
  identity reservations, Git index and worktree metadata byte-identical.
- Repeating a preview on fixed accepted inputs preserves mappings and plan hash.
- Receipts enumerate exact candidate writes, generated exclusions, immutable
  evidence preservation, unresolved references and recovery requirements.
- Applying a stale plan, unsupported format or ambiguous reference fails before
  mutation; unrelated dirty paths are not staged, normalized or absorbed.
- Reviewed apply writes only approved owned paths, records strict validation,
  never stages implicitly, and does not refresh bundles/subgraphs.
- Inject a failure between writes and verify truthful partial receipt and bounded
  recovery; later user edits are preserved, not overwritten by automatic rollback.
- Cross-project ownership and source identity mismatch are explicit failures.
- No test depends on publication, remote fetch, history rewrite or provider proof.

# Results / Evidence

PASS, 2026-09-06. Claimed and started explicitly under root:goal-82 after
task-822/chk-568. The focused identity, migration and reconciliation-plan command
ran 35 tests with zero failures; the final source aggregate passed 755+26.

| Contract | Direct evidence / observed result |
| --- | --- |
| Observational preview | Migration and real-branch planner fixtures compare whole fixture inventories, including Git files, caches and authored bytes before/after; equal. Repeated hashes/maps equal. |
| Exact public plan | Public CLI fixture asserts raw bodies absent, exact path classifications present, bad apply hash rejected with whole-tree equality. |
| Stale/unsupported inputs | Identity format tests reject unsupported manifests before locks; migration/reconciliation tests preserve bytes after authored, selection, schema, provenance, WAL and archive dependency movement. |
| Scoped writes | Cross-linked incoming graph applies while unrelated source is absent and an untracked target node survives. Staged user-notes and Git index/control hashes remain unchanged. |
| Recovery | Injected partial writes expose completed paths; changed user bytes stop recovery. Exact owner withdrawal permits resume. Reverse rollback restores original authored tree hash and control state. |
| Ownership | Foreign manifest/identity failures precede mutation; mounted-source fixture preserves full child inventory and exact bundle bytes. |
| Generated/evidence separation | Missing archive payload blocks; separate exact fixture transfer permits a new valid plan. Apply changes only planned nodes/receipts/journal/indexes, never bundles or Git history. |
| No remote dependency | All proofs execute in disposable local fixtures; source receipt bodies and semantic ancestry are local evidence only. |

Input proof sources at this pass: identity_migration.test.ts SHA-256
ab91f6b48f39b0f956e54ddb439725dfeed2974c7f082dd42d1c8dc7f59b78c2;
identity_reconciliation_plan.test.ts SHA-256
5f5736bf6148d5f30cd52ab152e46f0a684dccff65d505784a4f83a8504729df.
Each fixture captures its dynamically allocated identity/plan hashes and compares
exact before/after bytes; random fixture UUIDs are not asserted to repeat across
separate test runs. Execution pack: pack_concise_test-151_20260906-195929090.md.
No canonical graph adoption/publication proof is claimed. Skills: existing goal
pursuit/verification coverage; candidates none. test-475/test-476 remain separate
command and semantic acceptance lanes.

# Notes / Follow-ups

Goal 82 is active under explicit Run authority. Exact format/selector
serialization is implemented by task-820 and remains a canonical migration gate.
No new skill or loop is needed; enforced safety belongs in source/schema.
