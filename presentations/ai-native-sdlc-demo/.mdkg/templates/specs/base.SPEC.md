---
id: {{spec_id}}
type: spec
title: {{title}}
version: 0.1.0
spec_kind: capability
role: {{role}}
runtime_mode: {{runtime_mode}}
work_contracts: []
contract_profile: generic
validation_policy_ref: policy.validation.default
evidence_policy_ref: policy.evidence.default
requested_capabilities: []
skill_refs: []
tool_refs: []
model_refs: []
wasm_component_refs: []
runtime_image_refs: []
subagent_refs: []
resource_profile: builder
update_policy: manual
tags: [spec]
owners: []
links: []
artifacts: []
relates: []
refs: []
aliases: []
created: {{created}}
updated: {{updated}}
---

# Identity

Name, stable id, owner, status, and source mdkg nodes.

# Purpose

What durable capability or contract this SPEC defines.

# Authority Boundary

Who or what is allowed to make decisions, mutate state, delegate work, or accept
evidence under this SPEC.

# Resource Boundary

Included behavior, resources, paths, graph nodes, queues, services, and
explicit non-authorities.

# Optional Resource URIs

- Optional generic draft URI: `resource://...`
- Optional mdkg draft URI: `mdkg://resource/...`

# Capabilities

- Capability id:
- Optional generic draft URI: `capability://...`
- Optional mdkg draft URI: `mdkg://capability/...`

# Queue / Event Semantics

- Trigger events accepted:
- Queue ownership:
- Retry, ack, fail, and dead-letter expectations:
- Ordering or idempotency rules:

# Single-Writer Policy

- Writer key:
- Allowed write surfaces:
- Forbidden write surfaces:
- Conflict handling:

# Inputs

- Required input contract.

# Outputs

- Required output or receipt contract.

# Receipts / Evidence

- Attempt evidence:
- Validation evidence:
- Final receipt or closeout evidence:
- Aggregate checkpoint policy:

# Dependencies

- Other specs, skills, tools, models, services, or runtime images.

# Security / Privacy

- Authority, secret, data, and mutation boundaries.
- No raw secrets, credentials, local auth state, or production controls.

# Validation Checks

- Commands or review checks.

# Closeout Evidence

- Evidence required to accept this SPEC or implementation.

# Projection Targets

- Runtime manifest, package metadata, API contract, tool manifest, or protocol
  projection.

# Versioning

- Compatibility rules.

# Change Policy

- Who can change this SPEC and what validation is required.

# Open Questions

- Decision needed before implementation.
