---
id: task-275
type: task
title: define queue event and receipt semantics for agent SPECs
status: done
priority: 1
epic: epic-50
parent: goal-8
tags: [agents, queue, events, receipts, runtime-agent]
owners: []
links: []
artifacts: [.mdkg/templates/specs/runtime-agent.SPEC.md]
relates: [goal-8, epic-50, test-104]
blocked_by: [task-274]
blocks: [task-276]
refs: [edd-14]
aliases: [runtime-agent-manifest-contract]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define generic queue/event and receipt semantics for agent and runtime-agent
SPECs.

# Lifecycle Contract

The generic async agent lifecycle is:

```text
TriggerEvent -> AgentRun -> AttemptReceipt -> ValidationReceipt -> FinalReceipt
```

The lifecycle is a contract for SPEC authors and future validators. It is not a
new queue implementation, public runtime API, or exporter in this goal.

# Event And Receipt Semantics

## TriggerEvent

A TriggerEvent is the request to start or route agent work. It can originate
from a human request, graph work item, queue message, scheduled check,
API/runtime event, or retry policy. It should identify the target role or SPEC,
the triggering source, payload shape, idempotency key, correlation id, and
single-writer key when the work can mutate durable state.

Required fields:

- event id and event type.
- target agent SPEC or role.
- source qid, queue, runtime, or handoff origin.
- schema version.
- idempotency or dedupe key.
- payload hash and safe payload reference.
- correlation id and optional causation id.
- actor or system principal.
- available time and priority.
- requested visibility boundary.

## AgentRun

An AgentRun is a claimed execution attempt against a TriggerEvent. It connects
the selected agent SPEC, input context, lease owner, single-writer key, and
runtime boundary. It should be short-lived, reviewable, and cancellable.

Required fields:

- run id.
- TriggerEvent id.
- agent SPEC id and role.
- lease owner and lease deadline when queue-backed.
- input pack, work order, or artifact refs.
- single-writer key.
- sandbox or workspace boundary.
- attempt number.
- status: claimed, running, cancelled, completed, failed, or expired.

## AttemptReceipt

An AttemptReceipt records what an agent tried and what it produced before
validation. It can reference patches, artifacts, logs, diagnostics, or proposed
graph changes, but it does not by itself prove the work is acceptable.

Required fields:

- run id and attempt number.
- result status: succeeded, failed, cancelled, timed out, or blocked.
- produced artifact refs.
- changed path or graph key summary.
- error class and retry recommendation when failed.
- redaction/no-secret assertion.
- next suggested lifecycle action.

## ValidationReceipt

A ValidationReceipt records checks run against an AttemptReceipt or candidate
artifact. It should be deterministic enough for a reviewer or orchestrator to
trust the evidence without replaying the whole runtime session.

Required fields:

- validated run and attempt ids.
- commands, checks, review gates, or policy names.
- pass/fail/skip status per check.
- environment assumptions relevant to the check.
- artifact refs for logs or reports.
- reviewer identity when human or reviewer-agent validation is involved.
- residual risks or skipped checks.

## FinalReceipt

A FinalReceipt records orchestrator or graph/project-agent acceptance of the
work. Durable closeout, committed checkpoint summaries, and graph state changes
require a FinalReceipt or an equivalent accepted evidence record.

Required fields:

- accepted TriggerEvent, AgentRun, AttemptReceipt, and ValidationReceipt refs.
- final outcome: accepted, rejected, superseded, dead-lettered, cancelled, or
  escalated.
- closeout summary.
- durable graph writes performed or explicitly deferred.
- committed checkpoint or artifact refs.
- no-secret and projection-boundary assertions.
- follow-up work created or declared unnecessary.

# Queue State Boundary

Live queue rows are runtime/project DB delivery state. They are not canonical
mdkg history and should not be committed as normal graph evidence. Queue rows
can carry TriggerEvent payloads, lease state, retry counters, and dead-letter
status, but committed mdkg should store aggregate evidence, accepted receipts,
sealed checkpoints, and improvement proposals.

An agent SPEC should distinguish:

- queue delivery state: ready, leased, retrying, dead-lettered, or settled
  rows used by local runtimes.
- durable event history: accepted event/receipt records when the project DB or
  mdkg graph intentionally persists them.
- graph evidence: checkpoints, task updates, decisions, and artifacts that
  humans and later agents can review.

# Retry, Cancellation, And Dead Letter Policy

Retries must preserve idempotency. A retry is a new AgentRun or attempt against
the same TriggerEvent, not a silent rewrite of prior receipts. Backoff and
max-attempt policy belong in the runtime-agent SPEC when a role can be
queue-backed.

Cancellation should settle the current AgentRun with a cancellation receipt.
Dead-lettered work should emit or reference a FinalReceipt-like record that
explains why the work was not accepted and what repair, escalation, or manual
handoff remains.

# Single-Writer And Closeout Invariants

- A write-capable AgentRun must name a single-writer key before mutating
  durable state.
- A queue lease does not replace the single-writer policy; it only protects
  delivery of the queued work item.
- An AttemptReceipt does not imply acceptance.
- A ValidationReceipt does not imply closeout.
- FinalReceipt acceptance is required before durable closeout.
- Receipts may reference logs or artifacts, but must not contain raw secrets,
  credentials, local auth state, production controls, or private runtime state.

# Runtime Agent Manifest Expectations

A runtime-agent SPEC or manifest projection should include:

- queue ownership and per-agent queue responsibilities.
- TriggerEvent kinds accepted by the agent.
- AgentRun claim, lease, cancellation, and retry policy.
- sandbox or workspace bounds.
- opaque SecretGrant or credential refs, never values.
- single-writer keys.
- receipt lifecycle and required evidence.
- telemetry policy limited to aggregate-safe stats unless a SPEC says
  otherwise.
- projection metadata and drift policy inherited from the source SPEC.

# Validation Expectations

Future SPEC validation should report missing lifecycle fields as diagnostics
instead of inferring behavior from projection files. A runtime-agent SPEC that
accepts queue events but lacks receipt, retry, single-writer, or no-secret
policy should be considered incomplete.

# Acceptance Criteria

- Async lifecycle is `TriggerEvent -> AgentRun -> AttemptReceipt ->
  ValidationReceipt -> FinalReceipt`.
- Live queue rows remain runtime/project DB state.
- Committed mdkg stores aggregate evidence, checkpoints, and improvement
  proposals.
- Final receipts are required before durable closeout.

# Test Plan

- `mdkg capability search "runtime agent manifest" --json`
- `mdkg capability search "FinalReceipt" --json`
- `mdkg capability search "AgentRun" --json`
- `mdkg capability search "AttemptReceipt" --json`
- `mdkg capability search "ValidationReceipt" --json`

# Files Affected

- mdkg planning nodes only.

# Implementation Notes

- Define semantics only; do not implement queue or runtime behavior.

# Links / Artifacts

- `goal-8`
- `epic-50`
