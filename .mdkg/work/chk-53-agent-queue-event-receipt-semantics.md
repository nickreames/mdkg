---
id: chk-53
type: checkpoint
title: Agent queue event receipt semantics
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: [.mdkg/work/task-275-define-queue-event-and-receipt-semantics-for-agent-specs.md]
relates: [task-275]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-275]
created: 2026-06-06
updated: 2026-06-06
---
# Summary

`task-275` defined generic queue/event and receipt semantics for agent and
runtime-agent SPECs. The async lifecycle is now explicit:
`TriggerEvent -> AgentRun -> AttemptReceipt -> ValidationReceipt ->
FinalReceipt`.

# Scope Covered

- TriggerEvent fields and routing semantics.
- AgentRun claim, lease, context, and single-writer semantics.
- AttemptReceipt, ValidationReceipt, and FinalReceipt responsibilities.
- Boundary between live queue rows, durable event history, and committed mdkg
  graph evidence.
- Retry, cancellation, dead-letter, and closeout invariants.
- Runtime-agent manifest expectations for queue ownership, trigger kinds,
  leases, sandbox bounds, opaque SecretGrant refs, telemetry, and projection
  metadata.

# Decisions Captured

- Live queue rows remain runtime/project DB delivery state, not canonical mdkg
  history.
- Retries must preserve idempotency and create new runs or attempts rather
  than rewriting previous receipts.
- Queue leases do not replace single-writer policy.
- AttemptReceipt and ValidationReceipt are not enough for durable closeout;
  FinalReceipt acceptance is required.
- Receipts must not contain raw secrets, credentials, local auth state,
  production controls, or private runtime state.

# Implementation Summary

Only mdkg graph/design state changed. `task-275` now carries the event and
receipt lifecycle contract, and `edd-14` exposes lifecycle aliases so future
discoverability checks can find TriggerEvent, AgentRun, AttemptReceipt,
ValidationReceipt, and FinalReceipt concepts.

# Verification / Testing

- `node dist/cli.js index`
- `node dist/cli.js validate --json`
- `node dist/cli.js capability search "runtime agent manifest" --json`
- `node dist/cli.js capability search "FinalReceipt" --json`
- `node dist/cli.js capability search "AgentRun" --json`
- `node dist/cli.js capability search "AttemptReceipt" --json`
- `node dist/cli.js capability search "ValidationReceipt" --json`
- Product-name grep over `task-275`
- `git diff --check`

# Known Issues / Follow-ups

- `task-276` must define the parser, index, validation, and diagnostics
  implementation sequence.
- `test-104` must validate discoverability after the implementation sequence is
  recorded.
- Queue/runtime implementation remains deferred.

# Links / Artifacts

- `goal-8`
- `task-275`
- `epic-50`
- `.mdkg/templates/specs/runtime-agent.SPEC.md`
