---
id: spec.mdkg-cli
type: spec
title: mdkg CLI tool
version: 0.3.0
spec_kind: cli_tool
role: tool_service
runtime_mode: tool_service
work_contracts: [validate/WORK.md]
requested_capabilities: [mdkg.graph.read, mdkg.graph.write, mdkg.project_db.local]
skill_refs: [pursue-mdkg-goal, verify-close-and-checkpoint]
tool_refs: [tool.node, tool.npm]
model_refs: []
wasm_component_refs: []
runtime_image_refs: []
subagent_refs: []
resource_profile: local_cli
update_policy: proposal_required
tags: [spec, cli, dogfood, mdkg]
owners: []
links: [CLI_COMMAND_MATRIX.md, README.md, AGENT_START.md]
artifacts: []
relates: [work.mdkg-cli.validate]
refs: [edd-15, dec-26, dec-27, dec-28]
aliases: [mdkg-cli-tool-spec, dogfood-cli-spec, mdkg cli tool spec]
created: 2026-06-06
updated: 2026-06-06
---

# Purpose

Define the reusable mdkg CLI capability surface for local graph, capability,
work mirror, archive, bundle, subgraph, project DB, and release-readiness
operations.

# Runtime

mdkg runs as a local Node.js CLI. It reads and writes committed mdkg graph
documents, derived indexes, local project DB state, and deterministic package
artifacts according to command-specific policy in `CLI_COMMAND_MATRIX.md`.

# Work Contracts

- `validate/WORK.md` records the reusable validation and capability discovery
  work contract for this CLI surface.

# Capabilities

- `mdkg.graph.read`: inspect graph nodes, packs, skills, capabilities, and
  subgraph projections.
- `mdkg.graph.write`: create and update local mdkg graph mirrors under the
  active repo.
- `mdkg.project_db.local`: initialize, migrate, verify, snapshot, and use local
  project DB delivery state.

# Authority Boundary

The CLI may mutate files under the selected mdkg workspace only when an
explicit mutating command is invoked. It does not execute LLM work, payment
flows, ledgers, marketplace state, hosted queues, production databases, or
remote publish operations unless a separate explicit command and operator
approval provide that authority.

# Resource Boundary

Read and write scope is the selected repo root, configured mdkg workspaces,
local temp directories for smokes and packs, and package-managed cache paths
documented by the command matrix. External repos, browser state, credentials,
and production services are out of scope unless named by a specific command and
approval boundary.

# Queue / Event Semantics

Project DB queues are local delivery state, not canonical history. Public queue
commands can create, pause, enqueue, claim, settle, inspect, and drain local
messages. Work-order queue bridging is optional and records delivery refs
without executing work.

# Single-Writer Policy

Graph writes should be serialized by the repo/workspace and active work item.
Commands that mutate graph files or project DB state must use existing lock and
atomic-write behavior where available.

# Security / Privacy

Do not store raw secrets, credentials, auth headers, live payment state, ledger
mutations, marketplace inventory, canonical fulfillment state, or production
runtime state in SPEC, WORK, ORDER, or RECEIPT mirrors. Use opaque refs, hashes,
archive refs, artifact refs, and redacted receipts.

# Validation Checks

- `npm run build`
- `npm run test`
- `npm run cli:check`
- `node dist/cli.js validate`
- `npm run prepublishOnly`
- `npm pack --dry-run --json`
- `npm publish --dry-run`

# Closeout Evidence

Accepted changes include passing command tests, graph validation, capability
index proof, smoke coverage for touched command surfaces, package dry-run proof
when release readiness is in scope, and mdkg task/checkpoint evidence.
