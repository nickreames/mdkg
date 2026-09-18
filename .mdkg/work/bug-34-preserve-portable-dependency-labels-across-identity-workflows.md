---
id: bug-34
type: bug
title: Preserve portable dependency labels across identity workflows
status: done
priority: 1
tags: [release-0.6.0, behavioral-audit]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-34-verification.json]
relates: [bug-7]
blocked_by: []
blocks: []
refs: [goal-83, goal-84]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-09-09
updated: 2026-09-09
---
# Overview

Valid MANIFEST/SPEC/WORK dependency labels are treated as graph foreign keys by
the shared identity reference mapper. Absent matching nodes, v2 migration refuses
valid records; with a coincidentally matching alias it silently replaces the
dependency label with an unintended node identity. This blocks portable branch
collaboration and qualification. Owner: mdkg-project-agent under Goal83/84.

# Reproduction Steps

Nine installed synthetic probes validate as legacy. Bare skill/tool/model/WASM/
runtime-image labels cause migration blockers; skill.fixture is inconsistently
exempt. A tool.node label with a matching unrelated MANIFEST alias is silently
converted to a stable node ref. Preview is observational. Controls include an
empty dependency list and a separately rejected historical mdkg://goal-1 artifact.

# Expected vs Actual

- expected: schema-defined portable dependency labels retain their meaning and
  bytes, independently of unrelated graph aliases; explicit mdkg: references stay
  strict identity references.
- actual: generic *_refs traversal assigns graph semantics to every label.

# Suspected Cause

src/graph/identity_refs.ts matches all *_refs. Existing schema and valid fixtures
allow dependency labels without graph targets. Migration, authoring, reconciliation,
template import, independent fork and index normalization share this mapper.
Independent source-only classification confirms the mismatch. subagent_refs is
different: graph validation requires an existing MANIFEST/SPEC with role subagent.

# Fix Plan

Goal: preserve non-immutable references in skill_refs, tool_refs, model_refs,
wasm_component_refs and runtime_image_refs across identity workflows. Keep explicit
mdkg: refs strict and remappable; keep subagent_refs and actual graph relationships
bound. Do not add global tool.* bypasses or reinterpret historical artifact URIs.

Allowed: shared reference-classification source, focused regression tests and
directly required mdkg evidence/projections. Preserve the nine pre-existing dirty
paths; do not edit the partial bug-17 source. No canonical migration, bundle or
subgraph refresh, remote Git, publication, tags, provider/deployment, root/sibling
writes or global config. Disposable installed fixtures and reviewed explicit-path
local commits on main are allowed. Stop for ownership collision, baseline movement,
new policy/contract semantics or out-of-scope mutation.

# Test Plan

Require failing-before/passing-after migration, ordinary binding, reconciliation,
template and fork controls; alias collisions must not change dependency meaning.
Explicit immutable refs still bind/remap; missing, ambiguous and malformed refs
must fail. subagent_refs keeps identity and role checks. Verify JSON/SQLite and
capability projection behavior. Repeat installed proof on Node 24.15.0, 24.18.0
and 26.0.0. Full tests, CLI/docs, graph/SQLite/diff gates and bounded independent
review precede local closure; task-828 remains the final independent security gate.

Affected version: confirmed in the unpublished identity candidate at a441acca;
the newly introduced v2 workflows are not attributed to published 0.5.2.

# Links / Artifacts

Diagnostic fixture: /private/tmp/mdkg-migration-refs.wVCX2l/classification.json.
Source: agent_file_types.ts portable-ref schema, validate_graph.ts subagent checks,
agent_file_types.test.ts valid fixtures, and identity_refs.ts consumers.
No raw private graph bodies in committed evidence; new skill candidates none.

## 2026-09-09 Verification

The shared mapper preserves schema-defined portable labels without alias capture.
Explicit immutable references remain strict and remappable; subagent role and
identity checks are unchanged. Final identical regression fixtures fail seven
cases before the fix and pass all eight afterward. All eight pass against the
installed package on Node 24.15.0, 24.18.0 and 26.0.0; 271 focused and 1357 full
tests pass, with CLI/docs and 26 release-contract checks passing. Independent
read-only review found no bounded blocker; task-828 security clearance is separate.

The frozen private preview removes seven false dependency blockers while retaining
the strict historical task-309 URI refusal. Neither graph was migrated or edited
to manufacture a passing result. Exact hashes, fixture corrections, limitations
and protected custody are in the linked verification artifact. Final graph and
Git closeout checks are recorded in the milestone checkpoint.
