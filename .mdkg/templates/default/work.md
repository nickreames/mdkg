---
id: {{id}}
type: work
title: {{title}}
version: 0.1.0
agent_id: agent.example
kind: generic
pricing_model: quoted
required_capabilities: []
skill_refs: []
tool_refs: []
model_refs: []
wasm_component_refs: []
runtime_image_refs: []
subagent_refs: []
inputs: [request:text:required]
outputs: [result:text:required]
receipt_required: true
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

# Capability

Describe the reusable capability contract.

This file is a semantic mirror for discovery and review. Do not store raw
secrets, credentials, live payment state, ledger mutations, marketplace
inventory, or canonical execution state here.

# Inputs

Document input descriptors and validation expectations.

# Outputs

Document output descriptors and artifact expectations.

# Receipt

Describe required receipt evidence. Production execution systems remain
canonical for real orders, receipts, payments, ledgers, and fulfillment state.
