---
id: test-151
type: test
title: future graph upgrade dry-run no-mutation contract
status: todo
priority: 1
epic: epic-83
tags: [future, graph-upgrade, dry-run, no-mutation, alignment-002]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-363, task-820, task-822]
blocks: []
refs: [edd-81, goal-82, test-475, test-476]
aliases: []
skills: []
cases: [upgrade plan is dry run, graph mutation is explicit, no publish dependency]
created: 2026-06-11
updated: 2026-09-05
---

# Overview

Existing no-mutation verification lane extended for goal-82 and edd-81 under
MDKG-INTERACTIVE-ALIGNMENT-002. Remains todo/unclaimed; no tests executed.
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

Pending future implementation. Record case-level input/output fingerprints,
exit/result, touched-path manifest and uncertainty. Planning validation is not
runtime contract verification.

# Notes / Follow-ups

Goal 82 remains paused. Exact format/selector serialization is a task-820
deliverable to fixture-test before command consumers/migration are enabled.
No new skill or loop is needed; enforced safety belongs in source/schema.
