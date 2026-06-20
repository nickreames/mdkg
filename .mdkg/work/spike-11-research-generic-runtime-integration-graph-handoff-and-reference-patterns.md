---
id: spike-11
type: spike
title: research generic runtime integration graph handoff and reference patterns
status: done
priority: 1
epic: epic-105
parent: goal-22
tags: [spike, research, integration, handoff]
owners: []
links: []
artifacts: []
relates: [epic-105, epic-106, epic-107, epic-108, epic-111]
blocked_by: []
blocks: [task-414, task-415, task-416, task-418, task-419, task-422]
refs: []
aliases: [generic-runtime-integration-spike, handoff-reference-patterns]
skills: []
created: 2026-06-17
updated: 2026-06-17
---
# Research Question

What generic mdkg graph, reference, validation, checkpoint, queue-contract, and handoff patterns best support downstream runtime integrations without encoding product-specific naming into mdkg?

# Context And Constraints

- mdkg is durable semantic memory and graph state, not raw execution trace storage.
- Runtime systems own local execution queues, raw event payloads, and provider receipts unless they are intentionally mirrored as sanitized mdkg records.
- Backend systems own identity, policy, billing, ledger, and canonical persistence.
- mdkg should enforce refs-only and no-secret posture through warnings, templates, docs, and handoff packaging.
- The first implementation should produce generic mdkg capabilities useful to any integration repo.

# Search Plan

- Inspect current mdkg goal lifecycle, checkpoint, validate, pack, subgraph, queue, SPEC, WORK, WORK_ORDER, and RECEIPT behavior.
- Review downstream runtime integration evidence as read-only product feedback.
- Compare current mdkg command surfaces to the proposed generic capabilities in goal-22.
- Identify which improvements belong in CLI behavior, templates, validation, docs, and smoke tests.

# Findings

- Goal lifecycle friction is real in the current implementation. `src/commands/goal.ts` mutates `goal_state` and `status` for `done`, but does not move `active_node` to a historical field. Both CLI goal routing and `src/commands/mcp.ts` warn when `active_node` is no longer actionable, so completed goals can look stale even when `node: null` is correct.
- `active_node`, `scope_refs`, and other goal lifecycle fields are currently goal-only attributes in `src/graph/node.ts`. `last_active_node` is not a supported field yet, so the implementation needs template schema, parser, receipt, command, status, MCP, and migration updates.
- `context_refs` does not exist as a generic work-node field. `evidence_refs` exists in default proposal templates and some agent workflow validation, but not as a generic indexed work-node lane. Current generic `refs` can hold portable or URI refs, but it does not distinguish planning context from proof evidence or executable goal scope.
- Current validation already handles important workflow edges such as SPEC-to-WORK contracts, WORK_ORDER-to-WORK refs, RECEIPT-to-WORK_ORDER refs, feedback/dispute/proposal refs, subagent refs, and archive URI refs in `src/graph/validate_graph.ts`. The gap is not a blank slate; goal-22 should generalize these diagnostics, add raw-marker warning categories, and expose focused workflow validation UX instead of duplicating adapter-specific checks.
- Checkpoint creation currently uses one generic checkpoint template via `src/commands/checkpoint.ts`, and `mdkg task done --checkpoint` only accepts a title. The default checkpoint template is decent but cannot select implementation, test-proof, goal-closeout, audit, or handoff intent, so closeout evidence remains inconsistent across large goals.
- Public queue semantics are already concrete in `src/core/project_db_queue.ts`: stable JSON payload hashing, dedupe key returns, oldest-ready claim ordering, lease-owner checked ack/fail/dead-letter, retry delay, expired lease reclaim, pause/resume, snapshot summary, and stats. `src/commands/db.ts` exposes these through `mdkg db queue ...`, but there is no small adapter-facing contract command or generated JSON reference.
- The downstream runtime adapter currently wraps mdkg with its own CLI safety checks, forbidden raw-marker detection, SPEC/WORK/WORK_ORDER/RECEIPT discovery, receipt/proposal mirror validation, queue delivery store, db verify/stats preflight, capability search, work-order status, receipt verification, and pack calls. That is useful evidence that mdkg should own more generic validation, safety warning, and handoff packaging.
- The runtime adapter rejects raw markers such as authorization headers, bearer tokens, cookies, access tokens, API keys, npm tokens, private keys, kubeconfigs, and `secret=` in command arguments and command output. mdkg should not promise perfect secret scanning, but it should centralize obvious marker warnings so every integration does not reimplement the same guard.
- Existing `mdkg pack` is the closest handoff primitive. It packages graph context but does not produce a copy-ready agent handoff with objective, state, boundaries, required checks, validation evidence, checkpoint summaries, and raw-marker warnings.
- Current subgraph support already allows root-authored refs, relates, blockers, and scope refs to configured qids while keeping ownership fields local-only. Goal-22 should build on this rather than introducing a separate cross-graph model.

# Options And Tradeoffs

- Preserve current `active_node` on completed goals and silence warnings: minimal migration, but stale-looking graph state remains.
- Move completed goals to `last_active_node`: clearer lifecycle semantics and better future validation, with a small migration burden.
- Add context/evidence refs as goal-only fields: smaller implementation, but insufficient for epics, tests, checkpoints, and cross-graph handoffs.
- Add context/evidence refs to all work nodes: broader implementation, but aligns with graph-wide orchestration.
- Add `mdkg handoff create` as a top-level command: more public surface, but clearer operator mental model than overloading `pack` profiles.
- Add handoff only as `mdkg pack --pack-profile handoff`: smaller surface, but hides an important workflow under an already dense command.
- Treat raw-marker detection as hard validation failure: safer for generated output, but risks blocking legitimate historical graph review.
- Treat raw-marker detection as typed warnings: better fit for mdkg as semantic memory and lets humans/agents decide remediation.

# Recommendation

Default direction is to move completed goals to `last_active_node`, allow context/evidence refs on work nodes, treat raw-content scans as warnings, and implement `mdkg handoff create` as its own command.

Implementation should proceed in this order:

1. `task-414` should convert this spike evidence into exact acceptance contracts and confirm no command/schema decision remains ambiguous.
2. `task-415` should add `last_active_node` support across goal commands, templates, parser/schema, MCP, status, receipts, docs, and migration/upgrade guidance.
3. `task-416` should add generic `context_refs` and `evidence_refs` for work nodes, backed by index/search/show/pack/visibility behavior and preserving `scope_refs` as executable goal queue.
4. `task-417` should add read-only reference summaries and improve cross-subgraph blocker explanations without mutating imported nodes.
5. `task-418` should add checkpoint kinds before handoff so handoff output can summarize durable milestone evidence consistently.
6. `task-419` and `task-420` should centralize workflow validation and warning categories that runtime adapters currently duplicate.
7. `task-421` should expose the queue adapter contract without expanding mdkg into raw runtime event storage.
8. `task-422` should implement `mdkg handoff create` on top of pack, checkpoint, goal state, refs, and safety warnings.

# Follow-Up Nodes To Create

- Already scoped under goal-22: task-414 through task-426 and test-181 through test-189.
- Create additional design or decision nodes only if spike evidence shows a command or schema decision is still ambiguous.
- No additional nodes are required from this spike; the existing goal-22 task/test stack is sufficient.

# Skill Candidates

- Consider a future skill for creating sanitized cross-repo mdkg handoffs once `mdkg handoff create` exists.
- Consider a future skill for running integration-repo mdkg upgrade audits after goal-22 closes.
- Consider enhancing `pursue-mdkg-goal` after `last_active_node` ships so it describes completed-goal closeout without stale active-node conventions.

# Data Structures And Algorithms Notes

- Context/evidence refs should be stored as normalized arrays on indexed work nodes and remain separate from executable `scope_refs`.
- Graph reference summaries should compute inbound and outbound lanes without changing ownership semantics.
- `last_active_node` should be included in frontmatter key ordering immediately after `active_node` or in the same lifecycle block, but only one of the two should be actionable at a time.
- Goal closeout migration should be idempotent: if `status` is `done` or `goal_state` is `achieved` and `active_node` exists, write `last_active_node` when absent, remove `active_node`, and leave existing `last_active_node` unchanged unless a dry-run receipt reports a conflict.
- `context_refs` and `evidence_refs` should use the same low-level portable-id/qid/URI parser as `refs`, but validation should distinguish missing local ids, configured subgraph qids, external workspace qids, and URI refs in diagnostics.
- `mdkg graph refs <id-or-qid> --json` should compute inbound and outbound refs from edge fields plus `refs`, `scope_refs`, `context_refs`, and `evidence_refs`; it should be read-only and should not imply ownership of subgraph nodes.

# UX Notes

- Operators need clear messages that distinguish actionable local work from read-only subgraph context.
- Warning filters must reduce noise without implying the graph was only partially validated.
- Handoff output should be copy-ready for another agent without relying on hidden chat history.
- `goal next` for completed goals should be quiet and unsurprising: `node: null`, empty warnings unless there are real graph issues, and optional `last_active_node` in the goal payload.
- `mdkg validate --json` should preserve backward-compatible `warnings` while adding typed warning details for category/severity/remediation.
- `mdkg handoff create` should produce a receipt with output path or stdout mode, included node ids, validation command summaries, warning count, and sanitization warnings.
- Queue adapter docs should be terse and contract-like; integration code needs stable semantics more than tutorial prose.

# Security Notes

- Raw-content detection should warn on obvious secret, token, prompt, cookie, payload, and kubeconfig markers.
- Handoff packaging must not promise perfect secret detection; it should surface warnings and boundaries.
- Warning text should avoid echoing detected secret-like values; report marker family, node/path, and field or section when possible.
- Handoff output should default to refs, hashes, checkpoints, and summaries. It should not include raw provider payloads, raw prompts, cookies, tokens, private keys, kubeconfigs, or bulky queue payloads.
- `mdkg handoff create --strict` can fail on raw-marker warnings later, but the default should warn so historical graph review stays possible.

# Launch Implications

- These capabilities improve downstream docs, mdkg.dev examples, and agent orchestration narratives without blocking the existing mdkg.dev launch goal.
- mdkg.dev can demonstrate generic handoff, semantic refs, and workflow validation without exposing product-specific naming.
- The queue adapter contract gives downstream integration narratives a stable local-first story while preserving the boundary that mdkg is not canonical runtime storage.

# Evidence And Sources

- AGENT_START.md
- CLI_COMMAND_MATRIX.md
- goal-22
- Read-only downstream runtime feedback supplied by the operator.
- src/commands/goal.ts
- src/commands/mcp.ts
- src/graph/node.ts
- src/graph/frontmatter.ts
- src/graph/validate_graph.ts
- src/commands/checkpoint.ts
- src/commands/db.ts
- src/core/project_db_queue.ts
- /Users/nick/omni-chat-rooms/projects/omni-room-runtime/crates/omni-mdkg-adapter/src/lib.rs
- Command evidence: `node dist/cli.js goal current --json`, `node dist/cli.js goal next goal-22 --json`, `node dist/cli.js pack spike-11 --format json`, `node dist/cli.js validate --json`.
