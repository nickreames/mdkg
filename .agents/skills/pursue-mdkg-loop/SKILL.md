---
name: pursue-mdkg-loop
description: Pursue a selected mdkg loop by exhausting authorized linked work lanes, recording blocker recovery, and closing only when the loop definition of done is satisfied or explicitly waived.
tags: [stage:execute, writer:orchestrator, mdkg, loop, recursive]
version: 0.2.0
authors: [mdkg]
links: [AGENT_START.md, CLI_COMMAND_MATRIX.md, .mdkg/design/edd-66-first-class-loop-node-operating-model-and-reusable-template-lifecycle.md, .mdkg/design/dec-65-loop-is-one-first-class-node-type-for-mvp.md]
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
- Relevant mdkg pack, source files, tests, docs, package metadata, and local
  execution receipts

## Steps

1. Resolve the loop:
   - Inspect it with `mdkg loop show <loop> --json`.
   - Inspect readiness and per-identity evidence with
     `mdkg loop plan <loop> --json`.
   - Ask `mdkg loop next <loop> --json` for the next authorized child, recovery
     path, question, approval, evidence lane, or closeout step.
   - Build context with `mdkg pack <loop> --pack-profile concise --dry-run --stats`
     or a stronger pack profile when needed.
   - Inspect `child_refs`, `scope_refs`, `context_refs`, `evidence_refs`,
     `decision_refs`, `approval_refs`, and `output_refs`.
2. Build a completion matrix before execution:
   - lane name
   - required or optional
   - linked node refs
   - allowed actions
   - evidence needed
   - current status
   - blockers
   - recovery node
   - accepted decision or waiver
3. Ask or surface pre-run questions before beginning when the loop template
   declares external calls, privileged tools, multi-agent delegation, publish,
   deploy, provider, or policy-sensitive decisions.
4. Treat read-only and planning loops as pre-approved for low-risk local work:
   - read source, docs, mdkg graph, package metadata, configs, and tests;
   - run local read-only discovery commands;
   - run local test/build commands even when they write caches or generated
     outputs outside committed source, unless the user forbids it;
   - create mdkg evidence, spike, proposal, task, test, checkpoint, and
     open-question nodes;
   - make provisional triage and prioritization decisions.
5. Do not treat read-only/planning preapproval as permission to:
   - change functional source, docs, templates, generated command outputs, or
     runtime behavior;
   - push, publish, tag, deploy, change DNS, or activate analytics;
   - make external network, registry, advisory, provider, browser-session, or
     privileged calls that disclose repo/package/user metadata without approval;
   - delegate to subagents or external tools unless the harness/user approval is
     explicit.
6. Work the linked graph, not just the first branch:
   - Prefer the selection from `mdkg loop next`; override it only with an
     explicit rationale grounded in the loop definition of done.
   - Work it as far as the loop authorization allows.
   - Record evidence on the child node and update the completion matrix.
   - If that branch is blocked, classify the blocker and continue another
     unblocked branch.
7. Classify blockers:
   - `recoverable_now`: request approval, use an approved local proof path, or
     run an already authorized tool.
   - `branch_blocked`: create or update a spike/proposal/options node, record
     blocker evidence, and continue other linked work.
   - `definition_blocking`: keep the loop open until the missing lane is
     completed or explicitly waived.
   - `residual`: create follow-up work, mark it non-blocking, and allow closeout
     only if all required lanes are otherwise satisfied.
8. For non-trivial blockers, create or update:
   - a source-grounded spike;
   - a proposal or open-question section with at least three viable paths;
   - one recommended path with rationale;
   - blocker evidence on affected linked nodes;
   - a next actionable lane if one remains.
9. Continue while any authorized, in-scope, linked work remains actionable.
   Partial completion is expected and better than early whole-loop blocking.
10. Waive required lanes only through durable evidence:
    - Use proposal or open-question nodes for candidate waivers.
    - Use `decision_refs` for accepted design/product/policy waivers.
    - Use `approval_refs` for concrete human/orchestrator approval receipts,
      artifacts, or future approval nodes when that surface exists.
    - Bind answers, approvals, evidence, and waivers to stable identities with
      `question_answer_refs`, `action_approval_refs`, `evidence_lane_refs`,
      `lane_waiver_decision_refs`, and `lane_waiver_approval_refs`.
    - A waiver requires both an accepted decision and verified approval for the
      same lane; unrelated aggregate refs do not satisfy it.
11. Before marking a loop done or blocked, rebuild the completion matrix and run
    the loop's validation checks.
12. Mark the loop done only when every required lane is complete or explicitly
    waived and the loop body explains why the definition of done is satisfied.
13. Mark the loop blocked only when no authorized, useful, in-scope linked work
    remains across the loop graph and the loop records required decisions,
    follow-up work, and unblock paths. Treat
    `exhaustion.whole_loop_blocked: true` from `mdkg loop next --json` as the
    routing proof, then verify it against current graph state.

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

- Prefer repo truth over chat memory.
- Keep secrets out of skills, references, and generated artifacts.
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
