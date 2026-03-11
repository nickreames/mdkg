---
id: implement-5
type: task
title: implement stream e manual docs alignment audit cycle
status: done
priority: 1
epic: epic-5
tags: [v0_4, implementation, docs, governance, audit]
owners: []
links: []
artifacts: [cmd:node_dist_cli_help_parity_audit_2026_03_05, cmd:node_dist_cli_validate_ok_2026_03_05]
relates: [dec-10, prd-1, prd-2, edd-7, task-56, test-25, epic-5]
blocked_by: [implement-4]
blocks: [test-25]
refs: []
aliases: [stream-e, docs-audit]
created: 2026-03-05
updated: 2026-03-05
---

# Overview

Execute Stream E release-cut manual alignment audits across CLI help, README, and 0.0.4 design nodes.

# Acceptance Criteria

- Manual parity checks are completed for `mdkg --help` and command help surfaces.
- Planned-vs-implemented wording remains source-aligned across 0.0.4 docs.
- Audit evidence is captured in mdkg artifacts and linked test nodes.

# Files Affected

- README.md
- .mdkg/design/
- .mdkg/work/

# Implementation Notes

- Keep manual audits as the 0.0.4 governance mechanism.
- Avoid scripted drift tooling in this release family.

# Test Plan

- Run `mdkg validate`.
- Execute `test-25` checklist and attach evidence refs.

# Links / Artifacts

- dec-10
- prd-1
- prd-2
- test-25
- cmd:node_dist_cli_help_parity_audit_2026_03_05
- cmd:node_dist_cli_validate_ok_2026_03_05
