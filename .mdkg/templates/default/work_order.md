---
id: {{id}}
type: work_order
title: {{title}}
version: 0.1.0
work_id: work.example
work_version: 0.1.0
requester: user.example
order_status: submitted
request_ref: request.example
trigger_ref: trigger.manual
payload_hash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
contract_profile: generic
validation_policy_ref: policy.validation.default
evidence_policy_ref: policy.evidence.default
input_refs: []
queue_refs: []
requested_outputs: [result:text:required]
constraint_refs: []
artifact_policy: commit_sidecar_and_zip
tags: []
owners: []
links: []
artifacts: []
relates: []
refs: []
aliases: []
created: {{created}}
updated: {{updated}}
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
