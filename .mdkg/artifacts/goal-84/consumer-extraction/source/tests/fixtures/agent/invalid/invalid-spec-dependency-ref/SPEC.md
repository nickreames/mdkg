---
id: agent.bad-spec-dependency
type: spec
title: Bad Spec Dependency
version: 1.0.0
role: subagent
runtime_mode: room_orchestrated
work_contracts: []
requested_capabilities: [mdkg.read.root_summary]
skill_refs: [author-agent-spec]
tool_refs: [Tool.ArtifactUploader]
model_refs: []
wasm_component_refs: []
runtime_image_refs: []
subagent_refs: []
resource_profile: builder
update_policy: manual
tags: [agent, fixture]
owners: []
links: []
artifacts: []
relates: []
refs: []
aliases: []
created: 2026-05-01
updated: 2026-05-01
---

# Purpose

Invalid SPEC.md fixture because dependency refs must be lowercase portable ids.
