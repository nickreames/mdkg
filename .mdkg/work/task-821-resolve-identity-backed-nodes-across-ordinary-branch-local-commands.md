---
id: task-821
type: task
title: Resolve identity-backed nodes across ordinary branch-local commands
status: done
priority: 1
epic: epic-83
parent: goal-82
tags: [alignment-002, execution-authorized]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [task-820]
blocks: []
refs: [edd-81, dec-93]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-09-05
updated: 2026-09-06
---

# Overview

Use one identity-aware resolver across graph-facing commands, so new branch-local
nodes remain ordinary usable nodes before staging/commit/integration. Authorized
by the user's Goal 82 Run; mdkg-project-agent takes ownership after task-820's
chk-566 proof. Selected Goal 73 and all higher-impact exclusions stay unchanged.

# Acceptance Criteria

- new/show/list/search/pack and task/goal/loop/checkpoint use one identity model.
- Cover refs, archive/work/manifest, event references, import/export, validation,
  indexes and read-only MCP; document any command not applicable to a node type.
- Existing alias/QID inputs and output fields remain compatible, with additive
  stable identity where needed. Explicit identity resolves alias collisions;
  ambiguous bare aliases fail instead of choosing lexical/newest nodes.
- Staged, unstaged and untracked authored nodes use the working-tree graph.
  Optional staged-view inspection is read-only, not a second mutation target.
- Conflict markers can be diagnosed, not treated as a valid writable graph.
- Checkout-local selection and transient execution ownership do not merge into
  canonical knowledge; durable task lifecycle remains a semantic graph change.

# Files Affected

Future shared graph loading/resolution/types, command adapters, MCP and parity tests.

# Implementation Notes

Current goal claim also changes shared task status and goal active_node. Define
its compatibility treatment explicitly; do not silently relabel existing claims
as local leases or break single-writer main. Index rebuild preserves identity.

# Test Plan

For each applicable command, exercise branch-local new nodes before and after
staging and after alias reconciliation; compare outcomes/targets by identity.
Include JSON/SQLite parity, MCP read parity, legacy selectors and ordinary main.
test-475 owns the executable matrix.

# Links / Artifacts

- edd-81, goal-82; evidence pending implementation.

# Implementation Progress

2026-09-06: shared identity authoring binds proven structured node references;
opaque request/trigger/cost/source/policy labels remain semantic references rather
than being mistaken for graph foreign keys. New/checkpoint/work/archive creation
persists identity; show/list/search add stable identity without replacing aliases.
Focused regression proof: five v2 command scenarios cover JSON/SQLite, untracked
and staged nodes, unchanged Git index, checkpoint scope, workflow chains and
archive sidecars. The combined new/checkpoint run passed 21 tests; workflow/
archive plus v2 commands passed 18 tests. Three initial parity failures and two
extended-creator failures were reproduced before their fixes.

Broader verification after these increments: npm run test passed 718 TypeScript
tests plus 26 public-release/security contract tests. Full graph validation has
zero errors and only the three inherited stale-bundle warnings; changed-only
validation and git diff --check pass. No canonical migration, Git metadata,
selection, runtime DB, bundle or provider mutation was used.

Additional 2026-09-06 command-compatibility proof:

- One shared checkout-selection reader/writer resolves v2 stable identity across
  alias reuse in goal current/routing, status, doctor and read-only MCP. Explicit
  selection writes the binding; reads preserve its bytes. Missing, malformed or
  legacy-unbound v2 selection cannot silently fall back to a different active
  goal. Graph import/fork selection uses the same writer. Legacy selection stays
  compatible; canonical selected Goal 73 remains unchanged.
- Existing task, goal and workflow mutations bind structured reference inputs
  and preserve immutable identity. Task/goal mutation receipts and lifecycle
  events expose stable targets; explicit event append binds graph aliases before
  append, rejecting an unknown binding without changing fixture bytes. Historical
  events and body text are not rewritten.
- Loop materialization allocates independent identities for the loop and its
  children before binding cross-links. JSON/SQLite fixtures prove observational
  preview, explicitly provisional preview identities, fresh apply identities,
  template provenance and ordinary show/plan/next behavior.
- Nine v2 command scenarios now pass. The expanded full suite passes 722
  TypeScript tests plus 26 public-release/security contract tests. CLI matrix and
  docs checks pass (475 command examples); full graph validation has zero errors
  and only the three inherited stale-bundle warnings. Changed-only validation and
  git diff --check pass. Initial fixture mistakes (unsupported goal --id, second
  active-goal creation, event ordering and loop-plan envelope) were corrected;
  their failed runs are not counted as passing evidence.
- Goal-pursuit and verification skill coverage was reused. No skill authoring or
  new skill candidate. All code/proof changes remain owned by this task, unstaged
  and uncommitted on main. Selected state, runtime DB and protected Demo 3 bundle
  hashes still match intake; no Git/ref, provider or canonical migration action.

Final command-compatibility increment, 2026-09-06:

- Read-only v2 inspection retains every distinct identity sharing an alias.
  show/list/search/refs/pack/MCP expose stable variants and alias_qid, while bare
  ambiguous aliases and ordinary writes fail. Unresolved inspection indexes
  cannot be persisted; literal conflict markers produce source diagnostics.
- Capability/manifest readers derive v2 identity from authored files, ignoring
  stale or forged capability projections. WORK path references bind uniquely;
  migration, template import and independent fork retain typed filenames and
  owner relationships. Manifest-triggered work follows the bound contract.
- Archive selectors and receipts accept identity. New internal archive links
  bind sidecar identities; external artifact URLs/filesystem locators stay opaque.
  New work invocation hashes use stable graph inputs, independent of aliases;
  caller-supplied/historical hashes and raw evidence bodies are not rewritten.
- Decision supersedes metadata reaches graph validation, with wrong-type and
  unresolved immutable references rejected. A second active v2 goal is rejected
  before numeric reservation/source writing rather than leaving an invalid graph.
- Eighteen identity-command scenarios now include an explicit JSON/SQLite
  command-by-state matrix: untracked, staged and unstaged alias-change sources;
  whole-fixture read hashes; exact stable targets; unchanged Git-index bytes;
  authored identity unchanged after explicit derived-index rebuilding. Extended
  fixture groups cover lifecycle, loop, archive, workflow, event and transport
  consumers. Both graph-movement docs record applicability and strict-versus-
  inspection boundaries. This is not a blanket every-command/every-node claim.
- Latest focused command/archive/migration run: 43 passed. Earlier aggregate
  runs passed 731+26 and 732+26; the final artifact-binding aggregate had 731/732
  pass with one lock-timeout stress failure under suite load. That exact SQLite
  test passed all four cases in isolation (concurrent allocation 1.64s versus
  13.95s in the loaded run). Only the stress fixture timeout was raised to 60s;
  production remains 10s, separately asserted. Final aggregate proof: PASS,
  all 732 TypeScript tests plus 26 public-release/security contract tests.
  CLI parity, docs checks (475 examples), changed-only validation and full
  validation pass; only three inherited stale-bundle warnings remain.
- Other diagnosed failures: supersedes missing from parsed attributes, a new
  SQLite guard masking containment validation, and typed MANIFEST import paths.
  All received direct regressions. One matrix fixture incorrectly expected JSON
  from index; it now checks the supported command status. A validation invocation
  overlapped build's dist cleanup and was rerun successfully after build completion.

Task-822 must still implement reviewed semantic reconciliation and its replay,
decision and recovery receipts. test-475/476 and test-151 remain the final
acceptance gates; ordinary alias-change tests are not integration proof. No Goal
82 completion claim, canonical migration, staging, commit, push or bundle refresh.
