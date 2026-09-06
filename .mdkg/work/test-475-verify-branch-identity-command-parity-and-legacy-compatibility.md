---
id: test-475
type: test
title: Verify branch identity command parity and legacy compatibility
status: todo
priority: 1
parent: goal-82
tags: [alignment-002, planning-only]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-821]
blocks: []
refs: [edd-81, goal-82, dec-93, test-151]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-09-05
updated: 2026-09-05
---

# Overview

Prove immutable identities, legacy migration and normal unmerged-node usability.
Test execution remains unapproved and unclaimed.

# Target / Scope

task-820, task-821, edd-81; existing Goal 18 transport fixtures are reusable context.

# Preconditions / Environment

Disposable local Git repos/worktrees representing a common project plus an
independent project, frozen v1 fixtures, and both JSON/SQLite cache modes.
No remote Git or canonical checkout migration.

# Test Cases

| Case | Required result |
| --- | --- |
| Offline same-alias creation | Distinct immutable identities without network allocation |
| Cross-linked new nodes | All references bind to intended identity before and after alias changes |
| Legacy common ancestor migration | Shared nodes use one accepted common map |
| Divergent legacy additions | Matching numeric aliases do not collapse distinct nodes |
| Preview repetition | Same accepted input produces same proposed mapping without writes/reservations |
| Rebuild JSON/SQLite | Identities unchanged; indexes derive from authored data |
| Unsupported format | Deterministic diagnostic; writes refused |
| Mixed/partial migration | Explicit state and safe recovery, no silent conversion |
| Alias and stable selectors | Compatible short aliases; explicit identity works; ambiguity errors |
| Ordinary branch nodes | show/list/search/pack/new/task/goal/loop/checkpoint/refs work where applicable before and after staging |
| Extended consumers | Archive/work/manifest/event references, import/export, validator and read-only MCP preserve identity |
| Literal merge markers | Inspection diagnostics available, ambiguous mutations and strict validation fail |
| Project fork/template/subgraph | Source lineage retained, target ownership explicit, mounts remain read-only |
| Single-writer main | Existing workflow works without branch orchestration or silent claim semantics change |

# Results / Evidence

Pending. Maintain a command-by-state matrix with applicable/non-applicable
classification, input/output hashes and exact identity targets. No blanket
all-commands claim without the matrix.

# Notes / Follow-ups

Run after implementation tasks. Legacy alias-only external references need
revision/provenance evidence; preserve ambiguity when none exists. Do not
convert local selection/locks into shared project knowledge.
