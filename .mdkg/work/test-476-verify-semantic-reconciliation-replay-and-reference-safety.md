---
id: test-476
type: test
title: Verify semantic reconciliation replay and reference safety
status: done
priority: 1
parent: goal-82
tags: [alignment-002, execution-authorized]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [task-822]
blocks: []
refs: [edd-81, goal-82, goal-17, test-151, chk-565, chk-568]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-09-05
updated: 2026-09-06
---

# Overview

Prove safe semantic integration, stable alias mappings and replay behavior.
Explicit Goal 82 Run authorizes this bounded acceptance pass. mdkg-project-agent
accepts ownership after test-475; fixtures remain local and disposable.

# Target / Scope

task-819 and task-822, using Goal 17 add/add tests as historical foundations.

# Preconditions / Environment

Three-way disposable fixtures with explicit ancestor, target and incoming
revisions. Track authored paths, generated paths, immutable receipts, ignored
execution state and unrelated sentinel paths separately.

# Test Cases

| Case | Required result |
| --- | --- |
| Independent add/add same alias | Two identities survive; accepted target alias retained |
| Same-node modify/modify | One identity, ancestor-aware comparison, never artificial split |
| Conflicting lifecycle/evidence | Explicit decision; no timestamp or done-wins policy |
| Delete/modify and rename | Clear conflict/origin handling rather than duplicate fabrication |
| Cross-linked incoming nodes | Complete mapping before writes, every edge reaches intended node |
| Substring and ambiguous references | task-1 does not alter task-10; unknown provenance blocks |
| External historical receipts | Original bodies/hashes unchanged; revision-qualified maps provide interpretation |
| Repeated integration | Stable mapping and no new aliases for the same identities |
| Cherry-pick | Identical identity/content deduplicates; divergence is reported |
| Revert/reintroduction | Historical identity preserved without silent resurrection |
| Stale reviewed plan | Input/hash mismatch fails before writes |
| Partial failure | Receipt names completed writes; bounded recovery preserves unrelated edits |
| Generated state | Rebuilt only from valid authored result; bundles/execution state excluded |
| Git side effects | Staging/index bytes unchanged by default; no Git history operation |
| Strict validation | Apply receipt cannot claim success from tolerant parsing alone |

# Results / Evidence

PASS, 2026-09-06: explicitly claimed/started under root:goal-82. Focused legacy
fix, pure semantic reconciliation and real-Git planner suites passed 48 tests,
zero failures. Final source aggregate passed 755 TypeScript plus 26 public-release/
security tests. Execution pack: pack_concise_test-476_20260906-200407485.md.

| Required case group | Direct proof / observed result |
| --- | --- |
| Add/add versus same node | Legacy Git-stage fixtures use ancestor presence before split; v2 stable identities classify one node versus independent creations. Existing target aliases survive. |
| Semantic decisions | Pure fixtures prove disjoint-field merge, lifecycle/evidence conflict groups, atomic body decisions, delete/modify and rename/path preservation. Real-Git lifecycle decisions require reasons and exact unchanged inputs. |
| Complete references | Cross-linked incoming identities remap before writes; strict candidate validation resolves every edge. Portable typed paths remain valid. Ambiguous/unbound identities refuse output authority. |
| Exact historical evidence | Selected body bytes including CRLF and substring mentions remain exact; mappings carry original/input/output hashes. Archive sidecars require exact local payload integrity without rebuilding it. External provider/artifact evidence remains unverified, never synthesized. |
| Replay/cherry-pick/revert | Model and real Git tests deduplicate accepted identities. Reverted acceptance receipts remain discoverable in history, repeated input is byte-identical no-op, receipt-less cherry-pick/revert requires review, and reasoned explicit reintroduction is possible. |
| Evolving ancestry | Successive incoming changes use the latest proven semantic base; a newer accepted Git ancestor supersedes older receipt ancestry. Missing/unverified/incomparable history fails closed. |
| Stale/custody safety | Bad hashes, changed authored/dependency/control state, unknown provenance and nonancestor inputs refuse before mutation. Partial inspection names completed paths; independent edits halt resume. Rollback restores exact authored tree/control hashes. |
| Generated and Git state | Strict validation precedes derived writes. Mounted source bytes and bundle hashes stay unchanged. Existing staged user bytes, Git index/HEAD, checkout selection/runtime state remain untouched by apply/recovery. |

Primary fixture fingerprints: identity_reconcile.test.ts SHA-256
26c815d8401335fa76146dad426e153e5e2ed10fe900e37631e516a6f26b2a51;
identity_reconciliation_plan.test.ts SHA-256
5f5736bf6148d5f30cd52ab152e46f0a684dccff65d505784a4f83a8504729df.
Fixtures assert dynamically captured plan/receipt hashes, identity maps, exact
whole-tree inventories and control bytes; immutable UUIDs are random per creation,
not a promise of identical independent fixture runs. test-151 owns preview/custody
acceptance and test-475 owns command applicability. No canonical adoption, Git
publication, remote/provider or cross-project action. Skill candidates: none.

# Notes / Follow-ups

A passing initial conflict-classifier test does not complete goal-82. test-151
independently owns observational preview and authority-boundary assertions.
