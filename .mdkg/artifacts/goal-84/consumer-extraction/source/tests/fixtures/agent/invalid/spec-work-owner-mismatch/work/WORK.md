---
id: work.owner-mismatch
type: work
title: Owner Mismatch Work
version: 1.0.0
agent_id: agent.other
kind: image_generation
pricing_model: quoted
required_capabilities: [model.image.generate]
skill_refs: []
tool_refs: []
model_refs: []
wasm_component_refs: []
runtime_image_refs: []
subagent_refs: []
inputs: [prompt:text:required]
outputs: [image_url:url:required]
receipt_required: true
tags: [agent, invalid]
owners: []
links: []
artifacts: []
relates: [agent.owner-mismatch]
refs: []
aliases: []
created: 2026-05-01
updated: 2026-05-01
---

# Capability

This valid WORK.md is intentionally owned by a different agent id.
