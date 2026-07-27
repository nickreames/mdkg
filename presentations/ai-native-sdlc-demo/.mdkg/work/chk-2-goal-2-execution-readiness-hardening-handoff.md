---
id: chk-2
type: checkpoint
title: Goal 2 execution-readiness hardening handoff
checkpoint_kind: handoff
status: done
priority: 9
tags: [ai-native-sdlc, presentation-demo, phase-2, execution-readiness, accepted]
owners: [program-orchestrator, root-integration-owner]
links: []
artifacts: [artifacts/demo-platform/activation-contract.json, artifact://ai-native-sdlc-demo/private-bundle]
relates: []
blocked_by: []
blocks: []
refs: [goal-2, epic-2, goal-1, chk-1, prd-1, edd-1, dec-4]
context_refs: [goal-2, epic-2, goal-1, chk-1, prd-1, edd-1, dec-4]
evidence_refs: [chk-1]
aliases: []
skills: []
scope: []
created: 2026-07-26
updated: 2026-07-26
---
# Summary

Hardened the Goal 2 mdkg execution contract without activating or executing the goal. Read-only discovery is now separate from shared-source mutation; ownership, lease, pack, evidence, bootstrap, historical Demo 1, test, and future sendoff boundaries are explicit and fail closed.

# Scope Covered

This checkpoint covers execution-readiness authoring for goal-2, epic-2, spike-2, tasks 5–10, tests 4–6, dec-4, edd-1, and the future task-31 consumer contract. It does not claim that any Goal 2 actionable node has executed.

## Changed Surfaces

- Nested mdkg design and work nodes for Goal 2.
- `artifacts/demo-platform/activation-contract.json`, a fail-closed template rather than an accepted lease.
- Generated nested mdkg indexes.

## Boundaries

- in scope: graph-only requirements, roles, gates, paths, pack commands, artifact schemas, and validation contracts.
- out of scope: Goal 2 activation or claims; spike execution; shared-source/product edits; historical Demo 1 edits; root bundle refresh until the graph commit is clean; staging/commit except the separately authorized local graph and projection commits; push, deploy, or provider mutation.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded: yes.

# Decisions Captured

- Discovery gate: Goal 2 may later be activated only for the read-only spike-2.
- Mutation gate: task-5 requires an accepted receipt bound to a clean base commit, exact path/operation allowlist, owners, inventory hash, quiet window, and invalidation rules.
- Historical boundary: `examples/demo-runs/demo-001/**` and `mdkg-dev/public/demo-001/**` remain read-only.
- Pack boundary: execution uses explicit context/evidence edges; `context_refs` is not a supported configured default edge.
- Sendoff ownership: task-10 authors the canonical contract and task-31 freezes it later.

# Implementation Summary

- Goal 2 now requires `pursue-mdkg-goal` and `build-pack-and-execute-task` in addition to startup and closeout skills.
- Spike-2 owns a concrete audit matrix and proposed allowlist/readiness receipts.
- The activation template defines fail-closed, typed per-path rows for read-only, existing-mutable, and create-root authority.
- Tasks 5–10 and tests 4–6 stay with the shared-source writer as one bounded implementation-and-proof lease; the program orchestrator resumes only after that writer yields.
- Task 9 requires an executable repository-root fork/operator bootstrap with explicit-edge packs, pre-specialization identity proof, repeat verification, and negative-drift proof.
- Task 10 carries the complete pack-visible normative sendoff contract; task-31 consumes and materializes it byte-for-byte.
- Tests 4–6 are partitioned into build/accessibility/budget, public-safety/visibility/zero-JS, and fork/bootstrap/pack receipts.

# Handoff Summary

- Recipient/context: future program orchestrator under a separately accepted discovery gate.
- Starting node: `root:spike-2`.
- Preview command: `mdkg pack spike-2 --profile concise --depth 1 --edges parent,epic,relates,blocked_by,blocks,prev,next,context_refs,evidence_refs --skills auto --skills-depth full --dry-run --stats`.
- Execution pack: repeat with `--profile standard`.
- Explicit boundaries: leave Goal 2 paused now; later discovery may write only the nested graph and demo-platform artifacts; do not claim task-5 until the mutation receipt is accepted.

# Verification / Testing

## Command Evidence

- `mdkg index`: pass after graph edits.
- nested `mdkg validate --json`: pass after sequential index refresh.
- `mdkg goal show goal-2 --json`: pass; four required skills and seven required check families resolve.
- `mdkg goal next goal-2 --json`: pass; first node remains spike-2 while the goal remains paused.
- explicit-edge concise and standard `mdkg pack spike-2 ... --dry-run --stats`: pass with PRD, EDD, six decisions, Goal 1, chk-1, this handoff, successor context, and four skills.
- `mdkg skill validate pursue-mdkg-goal --json` and `build-pack-and-execute-task --json`: pass.
- JSON syntax, deterministic chain, task-10/task-31 direction, changed-path boundary, and `git diff --check`: required before local commit.

## Pass / Fail Status

- status: PASS / accepted after the final sequential validation receipt.

## Known Warnings

- `context_refs` is supported by the `pack --edges` flag but not by `pack.default_edges`; the first checkpoint-creation attempt failed closed before writing, the unsupported config change was removed, and the explicit pack command is canonical.
- Bundle refresh is intentionally deferred until this graph is committed cleanly; ordinary Goal 2 execution is not authorized to build or sync bundles.

# Known Issues / Follow-ups

- Goal 2 remains paused and no discovery or mutation authority is granted by this checkpoint.
- The future spike must replace all null mutation-gate fields with current evidence; missing values fail closed.
- The root integration owner must rebuild and verify the private program bundle from the clean graph commit in a separate generated-artifact commit.

## Follow-up Refs

- goal-2
- spike-2
- task-5
- test-4
- test-5
- test-6
- task-31

# Links / Artifacts

- `artifacts/demo-platform/activation-contract.json`
- `artifacts/demo-platform/drift-audit.md` (future spike output)
- `artifacts/demo-platform/proposed-source-allowlist.json` (future spike output)
- `artifacts/demo-platform/goal-2-activation-receipt.json` (future integration-owner acceptance)
- Local baseline commit: `075d4e69c8c51209f3aa8d0f55dab72e142ef063`.
- No remote push, deployment, or provider action.

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
