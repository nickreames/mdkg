---
title: Readiness, Routing, Evidence, And Closeout
description: Resolve loop questions and approvals, route authorized work, recover from blockers, and close every required evidence lane honestly.
---

A loop is ready to pursue only when its process contract is explicit. mdkg
projects that contract through questions, action permissions, child work,
evidence lanes, waivers, blockers, and closeout state.

Inspect the projection before giving a loop to an execution harness:

```bash
mdkg loop plan LOOP_ID --json
```

This command is read-only. It reports readiness; it does not run the loop.

## Pre-run questions

`pre_run_questions` names the decisions needed before governed actions begin.
Answers bind one question identity to an accepted decision:

```yaml
pre_run_questions:
  - audit_scope
  - local_cache_writes_approved
question_answer_refs:
  - audit_scope=DECISION_ID
  - local_cache_writes_approved=DECISION_ID
```

The decision must exist and be accepted. An unrelated `decision_refs` entry
cannot satisfy a named question. The identity binding prevents one broad
approval from accidentally satisfying every readiness requirement.

mdkg does not provide a special answer command. Create and accept decisions
through the normal graph workflow, then record the explicit bindings in the
scoped loop file.

## Action permissions

Loops distinguish three action sets:

- `pre_approved_actions`: safe to pursue within the loop's declared boundary;
- `approval_gated_actions`: available only when identity-matched approval
  evidence exists; and
- `prohibited_actions`: outside the loop even if another lane is blocked.

`required_actions` and `requested_actions` determine which approval-gated
actions are actually pending. An available but unrequested optional action does
not hold the loop open.

Bind a requested gated action to its approval evidence through
`action_approval_refs`:

```yaml
action_approval_refs:
  - external_advisory_checks=APPROVAL_ID
```

## Evidence lanes

`evidence_lanes` defines what the loop must account for. Evidence is matched to
each lane by identity:

```yaml
evidence_lanes:
  - source_security_review
  - finding_triage
evidence_lane_refs:
  - source_security_review=CHECKPOINT_ID
  - finding_triage=CHECKPOINT_ID
```

Evidence may come from linked runs, outputs, evaluations, checkpoints,
receipts, or other existing evidence refs. Creating a follow-up task is not the
same as completing the evidence lane.

## Typed waivers

A required lane may close without execution only through an explicit waiver.
For each waived lane, record both:

- a decision that explains the durable rationale; and
- approval evidence showing that a human or higher-level orchestrator accepted
  the waiver.

```yaml
lane_waiver_decision_refs:
  - dependency_advisories=DECISION_ID
lane_waiver_approval_refs:
  - dependency_advisories=APPROVAL_ID
```

A body note alone is not sufficient. A decision bound to one lane cannot waive
another lane, and an incomplete decision/approval pair is reported as invalid.

## Route, do not execute

Use `next` to select the next authorized child or recovery lane:

```bash
mdkg loop next LOOP_ID --json
```

`loop next` is observational and does not claim, start, or execute work. It
skips completed or waived lanes, explains gated and blocked lanes, and selects
useful work that the execution harness may pursue.

Use `runs` to inspect recorded run and evidence refs:

```bash
mdkg loop runs LOOP_ID --json
```

This is also an inspection command. mdkg preserves process history; the coding-
agent harness creates the actual execution activity and records resulting graph
evidence.

## Continue around blockers

A blocked branch is not automatically a blocked loop. The loop should:

1. identify the affected branch and record blocker evidence;
2. create or update a source-grounded spike when uncertainty is material;
3. use current web sources when the spike requires changing external facts;
4. create a proposal with at least three viable options;
5. record the recommended path and required decision; and
6. continue every other authorized, useful lane.

This lets a loop complete most of its definition of done even when one branch
needs a decision. The whole loop is blocked only when no authorized child work,
evidence path, or blocker-recovery path remains.

## Honest closeout

`mdkg loop plan LOOP_ID --json` reports `closeout.ready` and the exact missing
conditions. A loop closes only when:

- every required child is complete or explicitly waived;
- every evidence lane has identity-matched evidence or a complete typed waiver;
- required and requested gated actions are approved or removed from scope;
- pre-run questions are answered;
- blockers and invalid refs are resolved; and
- final validation and closeout evidence are recorded.

Residual follow-up may remain after closeout only when it is classified as
non-blocking and the required lanes are already satisfied. A loop cannot declare
success merely because it created future work.

Continue with the [read-only security audit walkthrough](/loops/security-audit/),
or consult the [generated CLI reference](/reference/generated-cli-reference/)
for exact output fields.
