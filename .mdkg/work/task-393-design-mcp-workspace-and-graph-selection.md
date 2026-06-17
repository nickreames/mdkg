---
id: task-393
type: task
title: design mcp workspace and graph selection
status: done
priority: 2
epic: epic-96
parent: goal-19
tags: [0.3.6, mcp, workspace]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-392]
blocks: [task-394, test-170]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-17
---
# Overview

Design explicit root/workspace/subgraph selection for the local MCP server.

# Acceptance Criteria

- Root graph selection is explicit.
- Subgraph selection is read-only.
- Path containment is enforced.
- Local root selection uses the existing `--root` global flag.
- Workspace hints are explicit per tool call; there is no hidden workspace state.

# Files Affected

- src/**
- tests/**
- docs/**

# Implementation Notes

- Avoid hidden workspace switching.
- `mdkg mcp serve --stdio --root <repo>` starts one server bound to one mdkg root.
- Tool calls accept `ws` only where the corresponding CLI read path supports a workspace hint.
- The `mdkg_workspace_list` tool reports enabled root workspaces and configured subgraphs so clients can choose intentionally.
- The server uses `loadIndex(... includeImports: true)` so configured subgraph nodes are projected into read-only search/show/pack paths.
- Subgraph qids are never mutation targets because no mutation tools are exposed in phase one.
- Path containment is inherited from mdkg config loading and subgraph registration validation; MCP tools do not accept arbitrary source, target, or output paths.
- Pack output is returned in memory as structured content and does not write `.mdkg/pack` files.

# Test Plan

- Selection fixture tests.
- Unit test workspace list and `ws` filtering against a repo with at least one registered workspace.
- Smoke test subgraph selection using a bundled child graph registered through `mdkg subgraph add`.

# Links / Artifacts

- task-392
- chk-169
