---
id: test-475
type: test
title: Verify branch identity command parity and legacy compatibility
status: done
priority: 1
parent: goal-82
tags: [alignment-002, execution-authorized]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [task-821]
blocks: []
refs: [edd-81, goal-82, dec-93, test-151, chk-566, chk-567, chk-568]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-09-05
updated: 2026-09-06
---

# Overview

Prove immutable identities, legacy migration and normal unmerged-node usability.
Explicit Goal 82 Run authorizes this acceptance pass. mdkg-project-agent accepts
the next owned lane after test-151, reusing chk-566/chk-567/chk-568 evidence.

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

PASS, 2026-09-06: explicitly claimed/started under root:goal-82. Focused run of
identity.test.ts, identity_migration.test.ts, identity_commands.test.ts and
commands/graph.test.ts passed 52 tests; final source aggregate passed 755+26.
Execution pack: pack_concise_test-475_20260906-200124894.md.

| Required case group | Proven behavior |
| --- | --- |
| Offline/legacy allocation | UUID allocation needs no network; same accepted ancestor derives common identities, distinct branch origins preserve independent same-alias additions. |
| Format/migration | Unsupported/mixed manifests fail before mutation; legacy reads do not initialize identity; interrupted migration resumes or rolls back exact owned bytes. |
| Branch command matrix | Both JSON and SQLite: untracked, staged and unstaged alias-change states retain exact stable targets across show/list/search/pack/refs, goal/loop/status, manifest/capability/work and read-only MCP where applicable. Read-only whole-fixture hashes match. |
| Lifecycle/index | Task mutation and explicit index rebuild retain authored identity and Git index bytes. New/checkpoint/goal/loop/work/archive authoring stamps or preserves identity; structured references and events bind to exact targets. |
| Ambiguity/selection | Same-alias variants remain inspectable, ambiguous mutation is blocked. Literal conflict markers produce source diagnostics. Selection follows immutable identity and never rebinds a missing/deleted identity to a reused alias. |
| Extended consumers | WORK paths, work input hashes, decision supersedes, archive sidecars, immutable artifact URLs, capability/manifest discovery and legacy projections retain their declared semantics. |
| Transport/ownership | Same-project clones retain identities; independent forks/templates record target-owned mappings; subgraph sources remain read-only and source bytes unchanged. |
| Single writer | The legacy/main command suite remains green; selection and durable goal claims are not represented as distributed execution leases. |

The command applicability table in docs/advanced-alpha/graph-movement.md is the
bounded contract: archive verification, lifecycle and workflow commands apply
only to their supported node kinds; routing and successful verification require
a valid graph. No claim that every command accepts arbitrary node types or a
literal unresolved merge. Tests assert exact stable targets and byte inventories,
not merely success exit codes. Primary command fixture SHA-256:
01159b07850b688b4ec60a21b960dc7c04b1d0464f03a21c8a083b89d0a3c9e5.
See chk-566/chk-567/chk-568 for implementation proofs; test-476 independently
owns semantic replay acceptance. No canonical migration, Git publication,
provider or cross-project action. Skill candidates: none.

# Notes / Follow-ups

Run after implementation tasks. Legacy alias-only external references need
revision/provenance evidence; preserve ambiguity when none exists. Do not
convert local selection/locks into shared project knowledge.
