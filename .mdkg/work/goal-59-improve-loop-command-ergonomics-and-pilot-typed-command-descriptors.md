---
id: goal-59
type: goal
title: Improve loop command ergonomics and pilot typed command descriptors
status: done
priority: 1
goal_state: achieved
goal_condition: mdkg loop commands are easier for humans and agents to operate after first-class readiness metadata, improved raw-loop creation guidance, template discovery, loop plan readiness output, loop next routing, and a loop-family typed descriptor pilot ship without changing goal semantics or widening into general CLI redesign.
scope_refs: [epic-220, epic-221, epic-222, epic-223, epic-224, task-693, task-694, task-695, task-696, task-697, task-698, task-699, task-700, task-701, test-367, test-368, test-369, test-370, test-371, test-372, test-373, test-374]
last_active_node: task-701
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
required_checks: [git status --short --branch, npm run build, npm run test, npm run cli:check, npm run docs:check, node dist/cli.js validate --changed-only --json, node dist/cli.js validate --summary --json --limit 20, node dist/cli.js goal show goal-59 --json, node dist/cli.js goal next goal-59 --json, node dist/cli.js pack task-693 --pack-profile concise --dry-run --stats, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [loop, ux, cli, descriptor, pilot]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-58, loop-4, prop-4, task-691, task-692, test-366]
context_refs: [goal-58, edd-66, dec-65, edd-69, dec-66, loop-4, prop-4, task-691, task-692, test-366, goal-60]
evidence_refs: [chk-392, chk-393, chk-394, chk-395, chk-396, chk-397, chk-398, chk-399, chk-400, chk-401, chk-402, chk-403, chk-404, chk-405, chk-406, chk-407, chk-408]
aliases: [loop-ux-descriptor-pilot]
skills: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-06
updated: 2026-07-06
---
# Objective

Improve the loop command family from a basic graph accessor into an
operator-ready surface for running mdkg loops. The implementation should absorb
the `loop-4` dogfood results, preserve the existing first-class `loop` node
model from `goal-58`, and pilot typed command descriptors on the loop family
before any broader CLI refactor.

# End Condition

This goal is achieved when:

- loop nodes support first-class readiness metadata for pre-run questions,
  approval requirements, evidence lanes, lane waivers, `decision_refs`, and
  `approval_refs`;
- `mdkg new loop` remains deterministic raw/custom loop creation while guiding
  users and agents toward `mdkg loop list` and `mdkg loop fork` when seeded
  templates may fit;
- `mdkg loop list` makes seeded templates and existing loop nodes easier to
  compare;
- `mdkg loop plan` exposes a readiness/status cockpit for operators and agents;
- `mdkg loop next` provides minimal goal-like actionable routing for loops;
- the `loop` command family has the first typed command descriptor pilot feeding
  help and command-contract metadata without changing current public behavior;
- all focused tests and required checks pass.

# Non-Goals

- Do not implement the broader generic CLI redesign in this goal.
- Do not add `mdkg loop status`, `mdkg loop evaluate`, or `mdkg loop handoff`
  unless an accepted decision supersedes `dec-66`.
- Do not add interactive prompting to `mdkg new loop`; mdkg CLI behavior must
  remain deterministic and scriptable.
- Do not implement `/goal` handoff output in this goal. Capture the design
  contract only.
- Do not change `goal` semantics or make loops replace goals.
- Do not include CocoIndex, semantic search, remote references, runtime
  execution, model routing, tools, approvals, sandboxes, or traces.

# Recursive Algorithm

1. Inspect the current goal state, relevant graph nodes, and required skills.
2. Claim the next scoped task with `mdkg goal claim goal-59 <task>`.
3. Work one focused task or test to completion while preserving existing loop
   and goal behavior.
4. Run the task-specific checks plus the goal checks that are relevant at that
   point.
5. Record evidence on the task/test and re-run `mdkg goal next goal-59 --json`
   until no scoped actionable node remains.

# Required Skills

- `select-work-and-ground-context`
- `service-boundary-ownership-check`
- `verify-close-and-checkpoint`

# Required Checks

- `git status --short --branch`
- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run docs:check`
- `node dist/cli.js validate --changed-only --json`
- `node dist/cli.js validate --summary --json --limit 20`
- `node dist/cli.js goal show goal-59 --json`
- `node dist/cli.js goal next goal-59 --json`
- `node dist/cli.js pack task-693 --pack-profile concise --dry-run --stats`
- `git diff --check`

# Acceptance Criteria

- `task-693` through `task-701` are complete with evidence.
- `test-367` through `test-374` are complete with evidence.
- Public loop JSON envelopes are preserved unless the new fields are additive.
- Existing `mdkg loop list/show/fork/plan/runs` behavior remains compatible.
- Existing `goal` behavior and `mdkg goal next` semantics remain unchanged.
- `goal-60` remains the queued planning lane for general CLI ergonomics and is
  not activated by this implementation goal.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.
- `mdkg goal next goal-59 --json` returns no actionable scoped node after
  closeout.
- No validation, generated docs, command matrix, help, or command-contract drift
  remains.

# Stop Conditions

- The implementation starts redesigning generic CLI UX beyond the loop-family
  descriptor pilot.
- The implementation requires interactive prompts in `mdkg new loop`.
- The implementation changes goal semantics, work-node semantics, or existing
  loop node identity/provenance rules.
- The implementation starts adding `/goal` handoff output instead of only
  capturing the design contract.

# Current State

Achieved on 2026-07-06. The loop family now has first-class readiness metadata,
deterministic raw-loop guidance, comparable template/list output, a readiness
cockpit, actionable next-work routing, and typed command descriptors feeding
help and generated contracts. Broad CLI redesign remains queued in `goal-60`.

# Iteration Log

- 2026-07-06: Created as the active focused implementation goal after `loop-4`
  exposed loop operator UX gaps and `prop-4` recommended a descriptor-first CLI
  simplification path.
- 2026-07-10: Repaired historical evidence integrity under `goal-61`. The
  original checkpoint scaffolds are now explicit milestone pointers, and
  `chk-408` is the authoritative reconstructed closeout receipt.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- `task-693` through `task-701` and `test-367` through `test-374` are done and
  link to their milestone checkpoints.
- `chk-408` consolidates source, descriptor, generated-contract, compatibility,
  and current regression evidence.
- Focused loop/graph and descriptor/CLI/contract suites passed during the
  v0.5.0 hardening rerun; final release-candidate counts remain owned by
  `goal-61`.
- `goal-60` remains paused and owns generic CLI ergonomics plus the later
  loop-module decomposition proposal.
