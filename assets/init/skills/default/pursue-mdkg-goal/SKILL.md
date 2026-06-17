---
name: pursue-mdkg-goal
description: Pursue a selected mdkg goal by repeatedly selecting one scoped work item, executing it with evidence, and evaluating the goal until done, blocked, paused, or budget-limited.
tags: [stage:execute, writer:orchestrator, mdkg, goal, recursive]
version: 0.1.0
authors: [mdkg]
links: [AGENT_START.md, CLI_COMMAND_MATRIX.md, .mdkg/design/prd-3-mdkg-goal-node-ux-and-agent-harness-contract.md, .mdkg/design/edd-10-mdkg-goal-node-architecture-and-recursive-agent-loop.md]
---

# Goal

Move one durable mdkg goal forward without losing scope, evidence, or user intent.

## When To Use

- A user has selected or named an mdkg goal.
- A long-running objective needs one concrete next work item at a time.
- Goal progress should improve the graph while keeping skill changes controlled.

## Inputs

- Optional goal id or qid.
- Current selected goal state from `mdkg goal current`.
- The goal node, scoped work nodes, required skills, and required checks.
- User constraints, budget, and stop conditions.

## Steps

1. Resolve the goal:
   - If a goal id is provided and you are beginning durable work on it, run `mdkg goal activate <goal-id>`.
   - Use `mdkg goal select <goal-id>` only when you need a local pointer without changing lifecycle state.
   - Otherwise run `mdkg goal current`.
   - If the result is missing or ambiguous, ask the user to select a goal.
2. Inspect the goal with `mdkg goal show <goal-id>` and build context with `mdkg pack <goal-id>`.
3. Run `mdkg goal next` to surface exactly one scoped feature, task, bug, or test.
4. If `goal next` returns no node, evaluate the goal with `mdkg goal evaluate <goal-id>` and report whether completion, blocker, or new-node creation is needed.
5. Before coding, run `mdkg goal claim <work-id>` to set `active_node` when the surfaced node is accepted.
6. Work only the claimed node to completion. Do not expand into unrelated urgent work.
7. Run the required technical checks yourself. mdkg goal required checks are report-only; mdkg does not execute them.
8. Record evidence on the active work node, then evaluate the goal with `mdkg goal evaluate <goal-id>`.
9. Repeat steps 3-8 until the goal condition is achieved, blocked, paused, budget-limited, or the user stops the run.

## Skill Improvement Candidates

- During normal goal execution, record skill improvement ideas in the goal body or a proposal node.
- Edit `SKILL.md` files only when the active node is explicitly skill-maintenance work.
- After intentional skill edits, run `mdkg skill sync`, `mdkg skill validate`, `mdkg index`, and `mdkg validate`.

## Outputs

- One active scoped work item at a time.
- Evidence recorded on the active node and summarized on the goal when useful.
- Required checks reported with pass/fail status.
- A clear stop reason: continue, achieved, blocked, paused, or budget-limited.

## Safety

- `mdkg goal next` is read-only; do not treat it as a claim.
- `mdkg goal claim` is the durable `active_node` mutation.
- Do not mutate subgraph/imported qids; update the owning source workspace.
- Do not create missing nodes without evidence that the current goal scope needs them.
- Do not edit skills opportunistically while pursuing product or code work.

## Failure Handling

- If selection is ambiguous, ask for a goal instead of guessing.
- If scoped work is missing, create a proposal or task only after explaining the gap.
- If checks fail, keep the active node open and record the failure evidence.
- If repeated attempts hit the same blocker, mark the goal blocked or ask for direction.
