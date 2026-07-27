---
name: pursue-mdkg-loop
description: Pursue a selected mdkg loop by exhausting authorized linked work lanes, recording blocker recovery, and closing only when the loop definition of done is satisfied or explicitly waived.
tags: [stage:execute, writer:orchestrator, mdkg, loop, recursive]
version: 0.2.0
authors: [mdkg]
links: [AGENT_START.md, CLI_COMMAND_MATRIX.md]
---

# Goal

Move one durable mdkg loop forward without prematurely closing, blocking, or
shrinking the loop definition of done.

## When To Use

- A user has selected or named a `type: loop` node.
- A reusable audit, planning, or implementation process should work across
  several linked goals, tasks, tests, spikes, proposals, checkpoints, or
  decisions.
- A loop should keep making progress after one branch hits a decision point.

## Inputs

- Repo root
- Loop id, qid, or template alias
- Loop node, required evidence lanes, child refs, linked goals, output refs,
  decision refs, approval refs, and blocker policy
- Current user constraints, available approvals, and stop conditions

## Steps

1. Resolve the loop with `mdkg loop show <loop> --json`.
2. Inspect identity-scoped readiness with `mdkg loop plan <loop> --json`.
3. Route with `mdkg loop next <loop> --json`; prefer its authorized child or
   recovery selection unless current graph evidence justifies an override.
4. Build context with `mdkg pack <loop> --pack-profile concise --dry-run --stats`.
5. Build a completion matrix: lane, required/optional, linked refs, allowed
   actions, needed evidence, status, blockers, recovery node, and accepted
   decision or waiver.
6. Surface pre-run questions before beginning when the loop template declares
   external calls, privileged tools, multi-agent delegation, publish, deploy,
   provider, or policy-sensitive decisions.
7. Treat read-only and planning loops as pre-approved for low-risk local work:
   source/doc/mdkg inspection, local discovery commands, local tests/builds that
   may write caches or generated outputs outside committed source, mdkg evidence
   nodes, and provisional triage.
8. Do not treat read-only/planning preapproval as permission for functional
   source changes, push/publish/tag/deploy, external metadata-disclosing calls,
   privileged tools, or subagent delegation unless approval is explicit.
9. Work the linked graph, not just the first branch. If one branch is blocked,
   record blocker recovery and continue another authorized branch.
10. Classify blockers as `recoverable_now`, `branch_blocked`,
   `definition_blocking`, or `residual`.
11. For non-trivial blockers, create or update a source-grounded spike, proposal
   or open-question section with at least three viable paths, one recommended
   path, and blocker evidence.
12. Continue while any authorized, in-scope, linked work remains actionable.
13. Bind answers, approvals, evidence, and waivers to stable identities with
    `question_answer_refs`, `action_approval_refs`, `evidence_lane_refs`,
    `lane_waiver_decision_refs`, and `lane_waiver_approval_refs`. A waiver
    requires both an accepted decision and verified approval for the same lane.
14. Mark the loop done only when every required lane is complete or explicitly
    waived and the loop body explains why the definition of done is satisfied.
15. Mark the loop blocked only when no authorized, useful, in-scope linked work
    remains across the loop graph and the loop records required decisions,
    follow-up work, and unblock paths. Confirm
    `exhaustion.whole_loop_blocked: true` from `mdkg loop next --json` against
    current graph state before stopping.

## Outputs

- Completion matrix for the loop
- Evidence recorded on linked children and summarized on the loop
- Provisional decisions, open questions, approval requests, and residual
  follow-up work
- A clear stop reason: continue, done, blocked, or waiting for approval

## Required Capabilities

- mdkg loop inspection and packing
- mdkg graph search/show/validate
- Source and documentation review
- Local command execution within the loop's authorization
- Proposal, decision, spike, task, test, and checkpoint authoring

## Resources Touched

- `.mdkg/work/<loop>.md`
- Linked child nodes under `.mdkg/work/`
- Linked design and decision docs under `.mdkg/design/`
- Local source/docs/test files only for read-only inspection unless the loop is
  explicitly write-capable

## Validation Checks

- `git status --short --branch`
- `mdkg loop show <loop> --json`
- `mdkg loop plan <loop> --json`
- `mdkg loop next <loop> --json`
- `mdkg pack <loop> --pack-profile concise --dry-run --stats`
- `mdkg validate --changed-only --json`
- `mdkg validate --summary --json --limit 20`
- Loop-specific local checks from the template or linked child nodes

## Closeout Evidence

- Completion matrix with every required lane classified
- Evidence refs for completed lanes
- Decision refs or approval refs for accepted waivers
- Follow-up nodes split into definition-blocking and residual work
- Validation receipts
- A loop summary that states why the loop is done, blocked, or continuing

## Safety

- Do not mark a loop done merely because follow-up nodes were created.
- Do not mark a loop blocked while authorized linked work remains actionable.
- Do not shrink the loop definition of done without a durable decision or
  approval record.
- Treat external advisory checks, provider calls, publish/deploy actions, and
  multi-agent delegation as approval-gated unless the loop has explicit
  pre-approval.
- Communicate provisional decisions and open questions to the human or
  higher-level orchestrator before treating them as accepted.

## Failure Handling

- If pre-run approvals are missing, record the decision request and continue
  authorized local lanes.
- If all branches are blocked, create or update spike/proposal/decision-request
  nodes before marking the loop blocked.
- If validation fails, keep the loop open and record the failing lane.
- If the loop template lacks required evidence lanes, create a template
  hardening task instead of silently closing the loop.

## Related Manifests

- Future loop-runner or orchestrator agent manifests.

## Projection Targets

- `.agents/skills/pursue-mdkg-loop`
- `.claude/skills/pursue-mdkg-loop`
- `assets/init/skills/default/pursue-mdkg-loop`

## Open Questions

- Should mdkg add first-class approval nodes later, or keep approvals as typed
  decision refs plus checkpoint, receipt, and external approval refs?
