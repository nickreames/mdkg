---
id: work.invalid-dependency-ref
type: work
title: Invalid Dependency Ref
version: 1.0.0
agent_id: agent.image-generator
kind: image_generation
pricing_model: quoted
required_capabilities: [model.image.generate]
skill_refs: [author-agent-work-contract]
tool_refs: [Tool.ArtifactUploader]
model_refs: []
wasm_component_refs: []
runtime_image_refs: []
subagent_refs: []
inputs: [prompt:text:required]
outputs: [image_url:url:required]
receipt_required: true
tags: []
owners: []
links: []
artifacts: []
relates: []
refs: []
aliases: []
created: 2026-05-01
updated: 2026-05-01
---

# Capability

Invalid WORK.md fixture because dependency refs must be lowercase portable ids.
