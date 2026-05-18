---
id: order.runtime-render-1
type: work_order
title: Runtime Render Work Order
version: 1.0.0
work_id: work.runtime-render
work_version: 1.0.0
requester: agent.runtime-orchestrator
order_status: completed
request_ref: fixture://runtime/order-1
input_refs: [artifact://runtime/input]
requested_outputs: [artifact_uri:uri:required, receipt_markdown:file:required]
constraint_refs: [policy.runtime-safe, fixture://runtime/constraints]
artifact_policy: commit_sidecar_and_zip
tags: [agent, fixture, runtime]
owners: []
links: []
artifacts: []
relates: [work.runtime-render, agent.runtime-worker, receipt.runtime-render-1]
refs: []
aliases: [runtime-render-order]
created: 2026-05-18
updated: 2026-05-18
---

# Request

Render a deterministic fixture artifact from a prompt.

# Inputs

Input refs point at non-secret runtime artifact identities.

# Requested Outputs

Return an artifact URI and receipt Markdown mirror.

# Constraints

No external model, shell, registry, secret store, Postgres, payment, or ledger
action is performed by this fixture.
