---
id: work.generate-image
type: work
title: Generate Image
version: 1.0.0
agent_id: agent.image-generator
kind: image_generation
pricing_model: included
required_capabilities: [model.image.generate, artifact.upload]
skill_refs: [author-agent-work-contract]
tool_refs: [tool.artifact-uploader]
model_refs: [model.image-generate]
wasm_component_refs: [wasm.image-normalizer]
runtime_image_refs: [image.agent-image-generator.1.0.0]
subagent_refs: [agent.image-generator]
inputs: [source_image:file:optional, prompt:text:required]
outputs: [image_url:url:required]
receipt_required: true
tags: [agent, fixture]
owners: []
links: []
artifacts: []
relates: [agent.image-generator]
refs: []
aliases: [generate-image]
created: 2026-05-01
updated: 2026-05-01
---

# Capability

Generate an image from a prompt and optional source image.

# Inputs

The prompt is required and the source image is optional.

# Outputs

The work returns an image URL artifact.

# Receipt

Every completed request records a receipt.
