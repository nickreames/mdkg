---
id: work.mdkg-cli.validate
type: work
title: Validate mdkg CLI graph and package readiness
version: 0.3.0
agent_id: spec.mdkg-cli
kind: cli_validation
pricing_model: included
required_capabilities: [mdkg.graph.read, mdkg.graph.write]
skill_refs: [verify-close-and-checkpoint]
tool_refs: [tool.node, tool.npm]
model_refs: []
wasm_component_refs: []
runtime_image_refs: []
subagent_refs: []
inputs: [repo_root:path:required, checks:list:required]
outputs: [validation_receipt:json:required, evidence_refs:list:required]
receipt_required: true
tags: [work, cli, dogfood, validation]
owners: []
links: [CLI_COMMAND_MATRIX.md]
artifacts: []
relates: [spec.mdkg-cli]
refs: [edd-15, dec-27, dec-28]
aliases: [mdkg-cli-validate-work, dogfood-cli-work]
created: 2026-06-06
updated: 2026-06-06
---

# Capability

Run selected mdkg CLI validation and release-readiness checks against a local
repo and record deterministic evidence refs for review.

This file is a committed semantic mirror. It does not execute work by itself
and must not contain raw secrets, credentials, live payment state, ledger
mutations, marketplace inventory, fulfillment state, or canonical runtime
execution state.

# Inputs

- `repo_root`: local repo path to validate.
- `checks`: ordered command or smoke identifiers requested by the operator or
  goal node.

# Outputs

- `validation_receipt`: structured result summary from the selected checks.
- `evidence_refs`: task, checkpoint, archive, artifact, or command-output refs
  that prove the result.

# Receipt

A completed invocation must record the commands run, pass/fail status, relevant
artifact refs, and any remaining blockers. Production execution systems remain
canonical for real orders, payments, ledgers, fulfillment, and hosted runtime
state.
