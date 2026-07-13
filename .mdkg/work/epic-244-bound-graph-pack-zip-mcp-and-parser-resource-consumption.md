---
id: epic-244
type: epic
title: Bound graph pack ZIP MCP and parser resource consumption
status: todo
priority: 1
tags: [security, remediation, v0.5.0]
owners: []
links: []
artifacts: []
relates: [goal-69]
blocked_by: []
blocks: []
refs: [edd-75, dec-80]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-12
updated: 2026-07-12
---
# Goal

Apply deterministic input and output budgets before expensive archive inflation,
graph/index construction, recursive closure, repeated body reads, or MCP response
assembly, while hardening parser and Git operand boundaries.

# Scope

- ZIP entry/inflated-byte checks before allocation and decoding.
- Graph file/byte, closure node/depth, body-read, pack, and MCP budgets.
- Prototype-safe maps and strict workspace alias handling.
- Git operand option separation and receipt truthfulness.

# Milestones

- `task-772`: ZIP, graph, pack, body, loop, and MCP budgets.
- `task-773`: Git operands, parser shapes, and prototype-safe aliases.
- `test-432`: boundary and over-limit behavior.

# Out of Scope

- Hosted rate limiting or multi-tenant quotas; mdkg remains a local tool.
- Arbitrary truncation that hides correctness or security errors.

# Risks

- Limits applied after traversal or read do not reduce peak resource use.
- Budget defaults that are too low can break legitimate large local graphs.
- Structured outputs must report truncation and preserve stable envelopes.

# Links / Artifacts

- `goal-69`, `edd-75`, `dec-80`
- `task-772`, `task-773`, `test-432`
