---
id: chk-62
type: checkpoint
title: 0.3.0 dogfood mdkg CLI SPEC
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-284]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [task-284]
created: 2026-06-06
updated: 2026-06-06
---
# Summary

Added the first concrete dogfood `SPEC.md` capability record for the mdkg CLI
and a matching `WORK.md` validation contract.

# Scope Covered

- `task-284`: dogfood CLI SPEC, strict WORK linkage, capability discovery
  proof, and graph validation.

# Decisions Captured

- The dogfood SPEC uses `spec_kind: cli_tool`.
- A real matching `WORK.md` was created now because `work_contracts` references
  are strict and must validate immediately.
- The SPEC describes mdkg CLI capability boundaries, not the 0.3.0 roadmap.

# Implementation Summary

- Added `.mdkg/work/mdkg-cli/SPEC.md` with `id: spec.mdkg-cli`.
- Added `.mdkg/work/mdkg-cli/validate/WORK.md` with
  `id: work.mdkg-cli.validate` and `agent_id: spec.mdkg-cli`.
- Linked the SPEC to `validate/WORK.md` and the WORK contract back to the SPEC.

# Verification / Testing

- `node dist/cli.js index`: passed.
- `node dist/cli.js validate --json`: passed with no warnings or errors.
- `node dist/cli.js capability list --kind spec --json`: returned
  `root:spec.mdkg-cli`.
- `node dist/cli.js capability search "mdkg cli tool spec" --kind spec --json`:
  returned `root:spec.mdkg-cli`.
- `node dist/cli.js capability list --kind work --json`: returned
  `root:work.mdkg-cli.validate`.
- `git diff --check`: passed.

# Known Issues / Follow-ups

- `task-285` still needs to project `spec_kind` into capability metadata.
- `test-109` remains open until the capability record exposes useful
  `spec_kind` metadata.

# Links / Artifacts

- `task-284`
- `test-109`
- `.mdkg/work/mdkg-cli/SPEC.md`
- `.mdkg/work/mdkg-cli/validate/WORK.md`
