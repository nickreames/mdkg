---
id: work.runtime-render
type: work
title: Runtime Render Contract
version: 1.0.0
agent_id: agent.runtime-worker
kind: artifact_rendering
pricing_model: included
required_capabilities: [model.runtime.generate, artifact.upload]
skill_refs: [skill.review-runtime-receipt]
tool_refs: [tool.artifact-upload, tool.mdkg.pack]
model_refs: [model.runtime-generate]
wasm_component_refs: [wasm.runtime-normalizer]
runtime_image_refs: [image.agent-runtime-worker.1.0.0]
subagent_refs: [agent.runtime-worker]
inputs: [prompt:text:required, source_artifact:uri:optional]
outputs: [artifact_uri:uri:required, receipt_markdown:file:required]
receipt_required: true
tags: [agent, fixture, runtime]
owners: []
links: []
artifacts: []
relates: [agent.runtime-worker, order.runtime-render-1]
refs: []
aliases: [runtime-render]
created: 2026-05-18
updated: 2026-05-18
---

# Capability

Defines a reusable runtime artifact rendering capability contract.

# Inputs

The prompt is required. Source artifacts are non-secret references.

# Outputs

The output includes an artifact URI and a receipt Markdown mirror.

# Receipt

Every completed request records a semantic receipt mirror.
