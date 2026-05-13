---
id: work.non-subagent-ref
type: work
title: Non Subagent Ref Work
version: 1.0.0
agent_id: agent.worker
kind: image_generation
pricing_model: quoted
required_capabilities: [model.image.generate]
skill_refs: []
tool_refs: []
model_refs: []
wasm_component_refs: []
runtime_image_refs: []
subagent_refs: [agent.not-subagent]
inputs: [prompt:text:required]
outputs: [image_url:url:required]
receipt_required: true
tags: [agent, invalid]
owners: []
links: []
artifacts: []
relates: [agent.not-subagent]
refs: []
aliases: []
created: 2026-05-01
updated: 2026-05-01
---

# Capability

This WORK.md references a SPEC.md whose role is not subagent.
