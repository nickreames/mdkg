---
id: goal-22
type: goal
title: Complete runtime integration UX semantic references and handoff hardening
status: done
priority: 1
goal_state: achieved
goal_condition: mdkg is next-release ready after completed-goal lifecycle ergonomics, semantic context/evidence refs, richer checkpoints, workflow validation, warning migration UX, queue adapter contract docs, and sanitized handoff packaging are implemented, documented, tested in packed temp repos, and proven through dry-run publish gates.
scope_refs: [epic-105, epic-106, epic-107, epic-108, epic-109, epic-110, epic-111, epic-112, spike-11, task-413, task-414, task-415, task-416, task-417, task-418, task-419, task-420, task-421, task-422, task-423, task-424, task-425, task-426, test-180, test-181, test-182, test-183, test-184, test-185, test-186, test-187, test-188, test-189]
last_active_node: task-426
required_skills: [pursue-mdkg-goal, select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, npm run cli:check, npm run cli:contract, node dist/cli.js validate --json, npm run smoke:goal-lifecycle, npm run smoke:subgraph, npm run smoke:work-invocation, npm run smoke:semantic-refs, npm run smoke:checkpoint-templates, npm run smoke:handoff, npm run smoke:integration-ux, npm run prepublishOnly, node scripts/assert-publish-ready.js, npm pack --dry-run --json, npm publish --dry-run, git diff --check]
max_iterations: 35
blocked_after_attempts: 3
tags: [integration, ux, references, handoff, runtime]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
aliases: [integration-ux-hardening, semantic-handoff-hardening, runtime-adapter-hardening]
skills: []
created: 2026-06-17
updated: 2026-06-18
---
# Objective

Turn integration friction from downstream mdkg consumers into generic mdkg product capabilities without baking a product-specific naming scheme into node titles, templates, docs, or command surfaces.

# End Condition

This goal is complete when mdkg can represent completed goals without stale active-node warnings, distinguish executable scope from contextual and evidence refs across graph boundaries, generate richer checkpoint and handoff artifacts, validate generic SPEC/WORK/WORK_ORDER/RECEIPT workflows, manage historical warning noise, document a stable project DB queue adapter contract, and prove all of it through temp-repo smoke tests plus dry-run publish gates.

# Non-Goals

- Do not edit downstream runtime repositories.
- Do not add raw execution trace storage to mdkg.
- Do not store raw prompts, provider payloads, tokens, cookies, credentials, or bulky runtime payloads in graph memory.
- Do not make runtime-owned queues/events/receipts canonical mdkg graph history.
- Do not publish, tag, push, or globally install unless separately requested.

# Recursive Algorithm

1. Complete `spike-11` to ground generic runtime integration patterns and reference semantics.
2. Close the graph alignment proof in `task-413` and `test-180`.
3. Claim one implementation task at a time through `mdkg goal claim goal-22 <node>`.
4. Keep each feature paired with its focused validation node before moving to docs or E2E.
5. Add the packed temp-repo smokes and prepublish gates before closeout.
6. Write the external runtime integration handoff megaprompt only after new mdkg surfaces are implemented and validated.
7. Close the goal with prepublish dry-run evidence, not a real npm publish.

# Required Checks

- npm run build
- npm run test
- npm run cli:check
- npm run cli:contract
- node dist/cli.js validate --json
- npm run smoke:goal-lifecycle
- npm run smoke:subgraph
- npm run smoke:work-invocation
- npm run smoke:semantic-refs
- npm run smoke:checkpoint-templates
- npm run smoke:handoff
- npm run smoke:integration-ux
- npm run prepublishOnly
- node scripts/assert-publish-ready.js
- npm pack --dry-run --json
- npm publish --dry-run
- git diff --check

# Acceptance Criteria

- Completed or achieved goals migrate `active_node` to `last_active_node`; `goal next` returns `node: null` without misleading stale-action warnings.
- Work nodes support generic `context_refs` and `evidence_refs` distinct from executable `scope_refs`; refs index, search, show, pack, validate, and subgraph visibility behavior is documented and tested.
- Cross-subgraph blockers and read-only refs are explainable without treating imported nodes as local actions.
- Checkpoint creation supports implementation, test-proof, goal-closeout, audit, and handoff templates with command evidence, known warnings, boundaries, and follow-up refs.
- Workflow validation covers generic SPEC, WORK, WORK_ORDER, and RECEIPT fixtures and emits raw-content warnings rather than hard failures for obvious secret/prompt/payload markers.
- Historical warning noise has an operator-friendly migration/filtering path without hiding real graph errors.
- Public queue CLI docs expose a stable adapter contract for payload hash, dedupe, claim order, lease-owner validation, retry, dead-letter, release-expired, and stats semantics.
- `mdkg handoff create` produces sanitized, copy-ready agent handoffs from graph state, packs, checkpoints, boundaries, and validation summaries.
- Packed temp-repo smokes prove the new surfaces from an installed package.

# Release Boundary

This is a next-release readiness goal. The final version number is chosen during closeout. This goal stops at dry-run publish evidence unless real publish is separately requested.

# External Handoff Requirement

`task-425` must produce a handoff megaprompt for `/Users/nick/omni-chat-rooms/projects/omni-room-runtime` explaining how to upgrade and adapt to the new mdkg capabilities. The mdkg node title remains generic.

# Checkpoint Requirement

`task-426` must close with a checkpoint named `integration UX semantic refs and handoff hardening readiness`.

# Current State

Created as the active mdkg-owned umbrella after the 0.3.6 release train. Existing paused/future goals remain untouched.

Relevant historical context includes goal-16 goal lifecycle work, goal-18 graph clone/import work, goal-19 local MCP and graph import hardening, goal-20 live demo readiness, and goal-21 mdkg.dev launch readiness. These are intentionally described here instead of frontmatter refs so current routing does not treat them as actionable goal scope.

# Iteration Log

- 2026-06-17: Created `goal-22` and scoped epics, spike, tasks, and tests from runtime integration feedback.

# Completion Evidence

- `chk-184` records the goal-closeout checkpoint: `integration UX semantic refs and handoff hardening readiness`.
- Required checks passed without real publish: `npm run build`, `npm run test` (503 passed), `npm run cli:check`, `npm run cli:contract`, `node dist/cli.js validate --json`, focused goal-22 smokes, `npm run prepublishOnly`, `node scripts/assert-publish-ready.js`, `npm pack --dry-run --json`, `npm publish --dry-run`, and `git diff --check`.
- `npm pack --dry-run --json` produced `mdkg-0.3.6.tgz` metadata with 163 package files.
- `npm publish --dry-run` completed lifecycle scripts and reported `+ mdkg@0.3.6` in dry-run mode only.
- Handoff artifacts were written under `.mdkg/handoffs/` for goal-22 and external runtime integration upgrade planning.
- No real npm publish, tag, push, global install, or downstream repo mutation was performed.
