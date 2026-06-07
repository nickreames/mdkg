---
id: order.goal-9-dogfood-trigger-task-291
type: work_order
title: Goal 9 dogfood trigger task 291
version: 0.1.0
work_id: work.mdkg-cli.validate
work_version: 0.3.0
requester: user.codex
order_status: submitted
request_ref: request.redacted
trigger_ref: trigger.mdkg-work-trigger
payload_hash: sha256:8b560f154af77441048055ba91559af83e8aedf33522266840dd38a7f9e10cb9
queue_refs: []
input_refs: []
requested_outputs: [validation_receipt:json:required, evidence_refs:list:required]
constraint_refs: []
artifact_policy: commit_sidecar_and_zip
tags: []
owners: []
links: []
artifacts: []
relates: [work.mdkg-cli.validate]
refs: []
aliases: []
created: 2026-06-06
updated: 2026-06-06
---
# Request

Capture the concrete request against a WORK.md version.

`payload_hash` should be the stable sha256 of the redacted trigger payload or
request mirror used to create this order.

This file is a committed semantic mirror, not the canonical execution database.
Do not store raw secrets, credentials, live payment state, ledger mutations,
marketplace inventory, or bulky payloads here.

# Inputs

Record committed input references without secrets. Use `archive://...` for mdkg
archive sidecars and `artifact://...` for external or runtime-managed artifact
identities.

# Queue refs

Queue refs are optional delivery-state pointers. They are not canonical runtime
state.

# Requested Outputs

Document the output descriptors requested from the work contract.

# Constraints

Capture relevant policy, budget, and artifact constraints.
