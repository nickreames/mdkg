---
id: agent.runtime-worker
type: spec
title: Runtime Worker Agent
version: 1.0.0
role: subagent
runtime_mode: room_orchestrated
work_contracts: [runtime-work/WORK.md]
requested_capabilities: [mdkg.read.root_summary, mdkg.write.self]
skill_refs: [skill.review-runtime-receipt]
tool_refs: [tool.mdkg.pack]
model_refs: [model.runtime-planner]
wasm_component_refs: [wasm.runtime-normalizer]
runtime_image_refs: [image.agent-runtime-worker.1.0.0]
subagent_refs: [agent.runtime-worker]
resource_profile: builder
update_policy: manual
tags: [agent, fixture, runtime]
owners: []
links: []
artifacts: []
relates: [work.runtime-render]
refs: []
aliases: [runtime-worker]
created: 2026-05-18
updated: 2026-05-18
---

# Purpose

Provide a generic runtime-style fixture agent for mdkg contract validation.

# Runtime

Runs as a room-orchestrated subagent.

# Work Contracts

Uses the related WORK.md contract.

# Capabilities

Requests scoped mdkg read/write capabilities only.
