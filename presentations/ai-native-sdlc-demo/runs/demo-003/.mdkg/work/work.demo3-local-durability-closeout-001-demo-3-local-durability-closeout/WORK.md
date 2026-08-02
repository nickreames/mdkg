---
id: work.demo3-local-durability-closeout-001
type: work
title: Demo 3 local durability closeout
version: 0.1.0
agent_id: agent.omni-mdkg-agent
kind: durability_closeout
pricing_model: included
required_capabilities: [mdkg.graph.read, mdkg.graph.write]
skill_refs: [select-work-and-ground-context, verify-close-and-checkpoint]
tool_refs: []
model_refs: []
wasm_component_refs: []
runtime_image_refs: []
subagent_refs: []
inputs: [repository_root:path:required, original_evidence_refs:list:required, authority_scope:text:required]
outputs: [loss_exception_receipt:markdown:required, reconciled_graph:mdkg:required]
receipt_required: true
tags: [demo-3, durability, closeout]
owners: [omni-mdkg-agent]
links: []
artifacts: []
relates: [goal-1, test-3]
refs: []
aliases: []
created: 2026-08-02
updated: 2026-08-02
---

# Capability

Reconcile the local Demo 3 child graph from exact original evidence, recover
content-addressed receipts when exact bytes survive, and account explicitly for
evidence whose original bytes are lost.

# Inputs

- The frozen repository custody ledger and scoped Nick authorization.
- Cached public commit and original archived rollout evidence.
- Existing child and umbrella receipts identified by path and hash.

# Outputs

- A reconciled local child graph with stale selection cleared.
- A verified loss-exception receipt for the missing original checkpoint body.

# Receipt

Completion requires exact-hash validation, graph validation, no synthesized
historical body, and a released writer lease.
