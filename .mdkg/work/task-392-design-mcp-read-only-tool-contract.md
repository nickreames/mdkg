---
id: task-392
type: task
title: design mcp read only tool contract
status: done
priority: 2
epic: epic-95
parent: goal-19
tags: [0.3.6, mcp, design]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [spike-8]
blocks: [task-393, task-394, task-396]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-17
---
# Overview

Design read-only local MCP tools for mdkg graph inspection.

# Acceptance Criteria

- Tools cover status, search, show, pack, goal current/next, and validation summaries.
- No mutation tools are enabled in phase one.
- Output contracts map cleanly to CLI JSON.
- Stdio is the only transport for 0.3.6; HTTP is deferred.
- Tool outputs are bounded and include structured JSON content.

# Files Affected

- src/**
- docs/**
- .mdkg/work/**

# Implementation Notes

- Manual node body editing remains an agent responsibility.
- Public command: `mdkg mcp serve --stdio`.
- MCP protocol version: `2025-06-18`.
- Server capabilities: tools only, with no prompts, resources, sampling, or mutation capability.
- Tool set:
  - `mdkg_status`: read-only operator health summary, equivalent to `mdkg status --json`.
  - `mdkg_workspace_list`: root workspace and configured subgraph selection metadata.
  - `mdkg_search`: bounded metadata search over local plus read-only subgraph indexes.
  - `mdkg_show`: node detail read with optional `meta_only`.
  - `mdkg_pack`: bounded context pack built through existing pack traversal APIs.
  - `mdkg_goal_current`: selected or uniquely active local root goal summary.
  - `mdkg_goal_next`: read-only next actionable node inside a goal scope.
  - `mdkg_validate`: validation summary equivalent to the JSON validate receipt.
- No task, goal, workspace, graph, queue, event, archive, fix-apply, format, or SQL mutation tools are exposed in phase one.
- Tool arguments may include `ws` where the equivalent CLI read path accepts a workspace hint. Subgraph aliases are valid only for read paths.
- No tool accepts arbitrary filesystem paths except the configured root selected by `--root`.

# Test Plan

- Design review before implementation.
- Unit tests for tool listing, read-only calls, unknown mutation tool rejection, and no stdout contamination.
- Packed temp-repo smoke through `npm run smoke:mcp`.

# Links / Artifacts

- spike-8
- chk-168
