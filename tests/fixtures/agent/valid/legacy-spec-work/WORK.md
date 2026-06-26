---
id: work.legacy-spec-render
type: work
title: Legacy SPEC Render Contract
version: 1.0.0
agent_id: agent.legacy-spec-worker
kind: artifact_rendering
pricing_model: included
required_capabilities: [model.runtime.generate]
skill_refs: [author-agent-work-contract]
tool_refs: [tool.mdkg.pack]
model_refs: []
wasm_component_refs: []
runtime_image_refs: []
subagent_refs: [agent.legacy-spec-worker]
inputs: [prompt:text:required]
outputs: [artifact_uri:uri:required]
receipt_required: true
tags: [agent, fixture, legacy-spec]
owners: []
links: []
artifacts: []
relates: [agent.legacy-spec-worker]
refs: []
aliases: [legacy-spec-render]
created: 2026-06-26
updated: 2026-06-26
---

# Capability

Defines a minimal WORK.md contract linked from a legacy SPEC.md manifest.
