---
id: task-274
type: task
title: define generic agent role SPEC requirements
status: done
priority: 1
epic: epic-50
parent: goal-8
tags: [agents, orchestrator, worker, reviewer, summarizer]
owners: []
links: []
artifacts: [.mdkg/templates/specs/agent.SPEC.md]
relates: [goal-8, epic-50, test-104]
blocked_by: [task-267, task-269]
blocks: [task-275]
refs: [edd-14]
aliases: [orchestrator-agent-spec-contract]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define required SPEC fields for orchestrator, worker, reviewer, summarizer, and
graph/project agents.

# Base Agent SPEC Contract

An agent SPEC is a durable role and authority contract, not a runtime profile.
Every agent SPEC should make these fields explicit:

- identity: stable id, title, owner, status, source mdkg nodes, and version.
- role: one of orchestrator, worker, reviewer, summarizer, graph/project, or a
  clearly named extension role.
- purpose: what outcome the agent exists to produce.
- trigger conditions: human request, graph work item, queue event, scheduled
  check, API/runtime event, or explicit handoff.
- authority boundary: what the agent may decide, write, approve, or close.
- resource boundary: repositories, paths, graphs, queues, artifacts, network
  surfaces, and runtime resources it may read or write.
- capabilities: capability ids or generic capability URIs required to operate.
- forbidden actions: actions the agent must never perform.
- input context: required goal, task, pack, queue message, event, receipt,
  branch, or runtime context.
- output contract: patch, report, receipt, diagnostic, handoff, or checkpoint
  shape.
- receipt/evidence contract: AttemptReceipt, ValidationReceipt, and
  FinalReceipt expectations.
- queue/event semantics: accepted TriggerEvent types, claim rules, retry
  behavior, and settlement expectations.
- single-writer policy: the graph, repo, path, branch, queue, or work item key
  that serializes durable writes.
- validation checks: commands or review gates needed before closeout.
- escalation behavior: when to ask, stop, return a blocker, retry, or
  dead-letter work.
- projection targets: target runtime profiles or manifests, with source links
  and drift metadata.

# Role Requirements

## Orchestrator Agent

An orchestrator agent coordinates work without hiding durable state in runtime
profiles. It may read graph state, select or create work packs, route queue
events, monitor partial receipts, request review, and accept FinalReceipts
before closeout. It should not perform unbounded implementation writes unless a
SPEC grants a scoped single-writer boundary.

Required fields:

- owned graph or goal scope.
- work selection and claim policy.
- queue routing and retry policy.
- receipt acceptance criteria.
- closeout authority and required checks.
- child-agent dispatch constraints.

## Worker Agent

A worker agent executes scoped work inside an explicit resource and
single-writer boundary. It can produce patches, artifacts, AttemptReceipts, and
ValidationReceipts, but it should not broaden scope, claim unrelated work, or
close a parent goal unless its SPEC explicitly grants that authority.

Required fields:

- exact write boundary.
- required input pack or work order.
- allowed tools and resources.
- validation commands it may run.
- handoff and failure receipt shape.
- forbidden scope expansion rules.

## Reviewer Agent

A reviewer agent evaluates a candidate change, receipt, artifact, or plan. It
is read-only by default. Write authority must be explicit and narrow, such as
adding review comments, diagnostics, or a review receipt.

Required fields:

- review target type.
- severity scale and finding format.
- allowed evidence sources.
- mutation policy, defaulting to read-only.
- conflict-of-interest or self-review constraints.

## Summarizer Agent

A summarizer agent condenses durable evidence for humans or later agents. It is
read-only by default and must not create canonical decisions, close work, or
rewrite source content unless explicitly scoped. It may propose summaries or
checkpoint text for a graph/project writer to accept.

Required fields:

- source material boundary.
- summary audience and fidelity requirements.
- redaction and no-secret policy.
- non-authoritative output label.
- handoff destination.

## Graph/Project Agent

A graph/project agent owns durable mdkg writes for a workspace or graph. It is
the expected writer for task state, checkpoint records, index refreshes, graph
repair, and committed project-memory updates inside its declared graph scope.
Higher-level orchestrators may read and route work, but graph/project writes
belong to the graph/project agent unless a SPEC delegates a narrower write key.

Required fields:

- graph or workspace ownership boundary.
- mdkg command families it may use.
- checkpoint and evidence policy.
- parent/child graph write boundary.
- commit or publication authority, if any.
- conflict handling when another writer has claimed the same graph key.

# Runtime-Neutral Projection Boundary

Agent SPECs must remain generic. Runtime-specific files such as agent TOML,
runtime manifests, process configs, queue consumers, or hosted worker profiles
are projections. They can adapt the durable SPEC to a runtime, but they must
preserve source metadata, drift checks, no-secret policy, and the same
authority boundary. Runtime-specific fields that change durable behavior must
create repair work against the source SPEC.

# Single-Writer And Receipt Rules

Every write-capable agent role needs a single-writer key. The key can be a
goal id, task id, graph workspace, repository path set, branch, queue name, or
runtime resource. Claims must be short-lived, reviewable, and connected to
receipts.

Durable closeout requires a FinalReceipt or equivalent accepted evidence. A
ValidationReceipt alone proves checks ran; it does not prove the orchestrator
accepted the result or that the graph/project writer recorded it.

# Compatibility Notes

Existing skeletal agent templates can remain lightweight defaults, but future
template promotion and validation should treat the fields above as the richer
contract. Missing role, authority boundary, resource boundary, receipt, or
single-writer sections should become SPEC diagnostics once parser support
exists.

# Acceptance Criteria

- Orchestrator agents coordinate graph state, work packs, queue events, and
  final receipts.
- Worker agents have scoped write authority.
- Reviewer and summarizer agents are read-only unless explicitly scoped.
- Graph/project agents own writes to their graph.

# Test Plan

- `mdkg capability search "orchestrator agent" --json`
- `mdkg capability search "runtime agent manifest" --json`
- `mdkg capability search "TriggerEvent" --json`

# Files Affected

- mdkg planning nodes only.

# Implementation Notes

- Role definitions must remain generic and runtime-neutral.

# Links / Artifacts

- `goal-8`
- `epic-50`
