---
id: agent.legacy-spec-worker
type: spec
title: Legacy SPEC Worker Agent
version: 1.0.0
role: subagent
runtime_mode: room_orchestrated
work_contracts: [legacy-spec-work/WORK.md]
requested_capabilities: [mdkg.read.root_summary]
skill_refs: [author-agent-spec]
tool_refs: [tool.mdkg.pack]
model_refs: []
wasm_component_refs: []
runtime_image_refs: []
subagent_refs: [agent.legacy-spec-worker]
resource_profile: builder
update_policy: manual
tags: [agent, fixture, legacy-spec]
owners: []
links: []
artifacts: []
relates: [work.legacy-spec-render]
refs: []
aliases: [legacy-spec-worker]
created: 2026-06-26
updated: 2026-06-26
---

# Purpose

Retain one valid legacy SPEC.md fixture for compatibility release coverage.

# Runtime

Runs as a room-orchestrated subagent.

# Work Contracts

Uses the related legacy-spec WORK.md contract.

# Capabilities

Requests scoped mdkg read access only.
