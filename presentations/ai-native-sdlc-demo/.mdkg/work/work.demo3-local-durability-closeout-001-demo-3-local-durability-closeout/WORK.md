---
id: work.demo3-local-durability-closeout-001
type: work
title: Demo 3 local durability closeout
version: 0.1.0
agent_id: agent.omni-mdkg-agent
kind: durability_closeout
pricing_model: included
required_capabilities: [mdkg.graph.read, mdkg.graph.write]
skill_refs: [select-work-and-ground-context, service-boundary-ownership-check, verify-close-and-checkpoint]
tool_refs: []
model_refs: []
wasm_component_refs: []
runtime_image_refs: []
subagent_refs: []
inputs: [repository_root:path:required, custody_manifest:hash:required, original_evidence_refs:list:required]
outputs: [closeout_receipt:markdown:required, reconciled_graph:mdkg:required]
receipt_required: true
tags: [demo-3, durability, closeout]
owners: [omni-mdkg-agent]
links: []
artifacts: []
relates: [goal-7, epic-7, chk-28]
refs: []
aliases: []
created: 2026-08-02
updated: 2026-08-02
---

# Capability

Close the local program graph around a source-grounded Demo 3 outcome while
preserving generated-state, Git, remote, provider, and publication authority
boundaries.

# Inputs

The frozen 42-path custody ledger, current Git baseline, original rollout,
cached public commit, child graph, Goal 7 graph, checkpoints, and receipt hashes.

# Outputs

A reconciled local program/child evidence relationship and a complete local
durability closeout receipt.

# Receipt

Completion requires scoped graph validation, exact path review, an approved
local commit, and a released writer lease. Shared remote history remains a
separate authority gate.
