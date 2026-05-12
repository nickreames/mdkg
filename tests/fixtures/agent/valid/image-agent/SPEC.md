---
id: agent.image-generator
type: spec
title: Image Generator Agent
version: 1.0.0
role: subagent
runtime_mode: room_orchestrated
work_contracts: [generate-image/WORK.md]
requested_capabilities: [mdkg.read.root_summary, mdkg.write.self]
skill_refs: [author-agent-spec]
tool_refs: [tool.mdkg.pack]
model_refs: [model.image-generate]
wasm_component_refs: [wasm.image-normalizer]
runtime_image_refs: [image.agent-image-generator.1.0.0]
subagent_refs: [agent.image-generator]
resource_profile: builder
update_policy: manual
tags: [agent, fixture]
owners: []
links: []
artifacts: []
relates: [work.generate-image]
refs: []
aliases: [image-generator]
created: 2026-05-01
updated: 2026-05-01
---

# Purpose

Define a subagent that performs image generation work.

# Runtime

Runs as a room-orchestrated subagent.

# Work Contracts

Uses the related generate-image WORK.md contract.

# Capabilities

Requests mdkg read access and scoped write access.
