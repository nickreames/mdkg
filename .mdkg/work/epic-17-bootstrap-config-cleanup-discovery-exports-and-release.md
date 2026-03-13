---
id: epic-17
type: epic
title: bootstrap config cleanup discovery exports and release
status: review
priority: 1
tags: [0_0_7, release, config, exports]
owners: []
links: []
artifacts: [assets/init/config.json, .mdkg/config.json, src/commands/query_output.ts, CLI_COMMAND_MATRIX.md, chk-6-release-cut-and-readiness-audit.md]
relates: [dec-20]
blocked_by: []
blocks: [task-110, task-111, task-112, task-113, task-114, task-115, task-116, test-63, test-64, test-65, test-66, test-67, test-68]
refs: []
aliases: []
skills: []
created: 2026-03-12
updated: 2026-03-12
---
# Goal

Remove the published workspace-config leak, complete non-JSON discovery/show exports, and leave the repo in a clean `0.0.7` release-candidate state.

# Scope

- root-only published init seed config
- removal of leaked `polish` / `smoke` live subgraphs
- XML / TOON / Markdown output for node and skill list/search/show
- help, startup doc, and command-matrix parity
- release-readiness audit and cut preparation

# Milestones

- M1: published init seed is separated from the live repo config
- M2: live repo graph no longer contains `polish` / `smoke`
- M3: discovery/show format parity lands across nodes and skills
- M4: release audit passes and a `0.0.7` cut is ready

# Out of Scope

- pack exporter changes
- new workspace fixtures for the deleted subgraphs
- version bump, tag, and npm publish in this task wave

# Risks

- discovery/show formats can drift if docs and help are not updated together
- deleting leaked subgraphs without reindexing would leave stale graph data

# Links / Artifacts

- `dec-20`
- `chk-6-release-cut-and-readiness-audit.md`
