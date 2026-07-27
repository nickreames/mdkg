---
name: pursue-mdkg-goal
description: Pursue an explicit mdkg goal QID through owned scoped work, durable evidence, evaluation, and supported local-only closure while treating selected state as a hint.
tags: [stage:execute, writer:orchestrator, mdkg, goal, recursive]
version: 0.2.0
authors: [mdkg]
links: [AGENT_START.md, CLI_COMMAND_MATRIX.md]
---

# Purpose

Move one durable mdkg goal forward without losing explicit scope, writer
ownership, evidence, or user authority.

## When To Use

- A user or orchestrator supplies an explicit mdkg goal QID.
- A named durable objective needs one owned scoped work item at a time.
- Goal progress must continue across independent lanes when one lane is blocked.

Use `select-work-and-ground-context` first when no goal has been supplied or the
target is still ambiguous. Use `verify-close-and-checkpoint` for focused review
and checkpoint quality at the closeout boundary.

## Inputs

- Supplied explicit goal QID, recorded as `TARGET_GOAL_QID`.
- Optional selected-goal receipt from `mdkg goal current --json`.
- One explicit writer identity, recorded as `OWNER`.
- Goal scope, required skills, required checks, user constraints, budget, and
  stop conditions.

## Outputs

- One explicitly owned and claimed scoped work item at a time.
- Durable task and checkpoint evidence for completed work.
- Goal evaluation before any supported goal-done transition.
- A path-specific local commit by default, with no push.
- A clear stop reason: continue, achieved, blocked, paused, budget-limited, or
  stopped by the user.

## Required Capabilities

- Current mdkg CLI with explicit-QID goal show, next, claim, evaluate, and done.
- Git status, diff, path-specific staging, and local commit commands.
- The technical validators required by the target goal and changed surfaces.

## Resources Touched

- The supplied goal node and its owned scoped work nodes.
- Evidence fields, event metadata, indexes, and milestone checkpoints produced
  by authorized mdkg commands.
- Only files owned by the claimed work item and the final local commit.

## Steps

1. Resolve the target without changing selected-goal state.
   - When a goal QID is supplied, set `TARGET_GOAL_QID` to that exact QID. It is
     authoritative for the run.
   - Run `mdkg goal current --json` only to capture selected state as a hint. It
     may be absent, stale, paused, or achieved and must not override a supplied
     `TARGET_GOAL_QID`.
   - Do not run goal activate, select, or clear unless the user separately asks
     for that selection mutation.
   - If no goal QID was supplied, hand back to `select-work-and-ground-context`.
     Do not silently adopt an ambiguous or achieved selected goal.
2. Ground the explicit goal.
   - Run `mdkg goal show "$TARGET_GOAL_QID" --json`.
   - Build bounded context with `mdkg pack "$TARGET_GOAL_QID"` when needed.
   - Confirm the goal is source-owned here, actionable, and within current
     authority before any durable write.
3. Surface work with `mdkg goal next "$TARGET_GOAL_QID" --json`.
   - Treat the receipt as read-only routing, not a claim.
   - If no node is returned, continue at the evaluation step instead of
     inventing work.
4. Establish explicit ownership before claim.
   - Record the surfaced node as `WORK_QID` and recheck its current owners.
   - If ownership is missing and assignment is authorized, use the repository's
     supported owner-assignment path. When no owner command exists, edit only
     the source node's `owners` frontmatter and run index/validation before
     claim.
   - Stop on overlapping or ambiguous ownership.
   - Claim with both QIDs:
     `mdkg goal claim "$TARGET_GOAL_QID" "$WORK_QID" --json`.
5. Execute only the claimed node.
   - Keep changes within its declared files, service boundaries, and authority.
   - Use `mdkg task start`, `mdkg task update`, and `mdkg task done` with the
     explicit `WORK_QID` for structured work state.
   - Do not expand into unrelated urgent work or opportunistic skill edits.
6. Run the required technical checks yourself.
   - Goal `required_checks` are report-only guidance; mdkg does not execute them.
   - Record concise pass/fail evidence on the owned work node.
7. Handle blockers without abandoning independent scope.
   - Record the affected lane's blocker and failed evidence.
   - Keep that node open or blocked as appropriate.
   - Run `mdkg goal next "$TARGET_GOAL_QID" --json` again and continue other
     actionable scoped nodes when safe.
   - Classify the whole goal as blocked only when the blocker prevents meaningful
     progress across the remaining scope or meets the goal's attempt policy.
8. Create durable checkpoint evidence before commit.
   - At a milestone or final commit boundary, create one checkpoint that records
     exact QIDs, owner, changed surfaces, validation results, failures or
     warnings, selected-goal state, boundaries, and follow-up refs.
   - Run `mdkg index`, relevant skill validation, `mdkg validate`, and
     `git diff --check` after the checkpoint is present.
9. Evaluate the explicit goal before considering done.
   - Run `mdkg goal evaluate "$TARGET_GOAL_QID" --json`.
   - If scope or evidence remains incomplete, return to explicit goal next and
     continue. Do not run goal done.
10. Mark the goal done only when evidence supports closure.
    - Confirm the goal condition, scoped statuses, required-check receipts, and
      checkpoint evidence are satisfied.
    - Then run `mdkg goal done "$TARGET_GOAL_QID" --json`.
    - If evaluation does not support closure, leave the goal open, paused, or
      blocked according to current evidence.
11. Create the default local-only commit.
    - Recheck full dirtiness and preserve unrelated work.
    - Stage only explicit owned paths with `git add -- <path>...`.
    - Review `git diff --cached --name-only` and the cached diff.
    - Create one path-specific local commit after checkpoint and closure state
      are present.
    - Do not push. Report the local commit SHA and final dirty state.

## Validation Checks

- The supplied goal QID appears in explicit show, next, claim, evaluate, and
  supported done receipts.
- Selected-goal QID and selection timestamp are unchanged unless separate
  selection authority was supplied.
- Every claim has a non-ambiguous explicit owner.
- Required technical checks and `mdkg validate` pass or failures remain open.
- A durable checkpoint exists before the commit.
- `git diff --check` passes and cached paths match the owned allowlist.
- Skill maintenance runs `mdkg skill sync`, `mdkg skill validate`, and
  `mdkg index` before graph validation.

## Closeout Evidence

- Explicit target goal QID and each claimed work QID.
- Owner identity and claim receipts.
- Required checks with pass/fail status.
- Final checkpoint QID and path.
- Goal evaluation and conditional goal-done receipts.
- Selected state before and after.
- Staged path list, local commit SHA, and final dirty state.
- Explicit confirmation that no push, publish, tag, deploy, provider mutation,
  or registry credential inspection occurred.

## Failure Modes

- Supplied and selected goals disagree: keep the supplied QID authoritative and
  leave selection unchanged.
- Selected goal is achieved or stale: treat it as a hint, not executable scope.
- Goal or work QID is imported or read-only: update the owning source workspace.
- Ownership overlaps: stop before claim or write.
- One lane is blocked: record it and continue other actionable lanes.
- Checks or evaluation fail: keep work open and do not create a closure commit.
- Context or authority is missing: pause and request the missing decision.

## Safety Rules

- Ordinary goal pursuit never inspects registry credentials and never runs
  package publication, push, tag, deploy, provider mutation, history rewrite,
  archive generation, bundle generation, or subgraph synchronization.
- Goal completion, checkpoint creation, and local commit authority do not imply
  any of those higher-impact actions.
- Hand package release work to a repository-owned release workflow under an
  explicit release goal and current approval.
- Do not store secrets, tokens, raw provider payloads, raw prompts, customer
  data, or unrelated runtime payloads in graph state, events, checkpoints, or
  handoffs.
- Do not create missing work nodes unless current goal evidence requires them.

## Related Manifests

- None required for the generic goal-pursuit lifecycle.

## Projection Targets

- Canonical source: `.mdkg/skills/pursue-mdkg-goal/SKILL.md`.
- Configured local mirrors such as `.agents/skills/` and `.claude/skills/`.
- Public default seed: `assets/init/skills/default/pursue-mdkg-goal/SKILL.md`
  in the mdkg package source repository.

## Open Questions

- None. Record future improvements in the active goal or a dedicated proposal
  instead of changing this skill during unrelated work.
