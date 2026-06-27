---
id: task-598
type: task
title: audit and refresh first party skills for current CLI capability coverage
status: todo
priority: 1
epic: epic-201
parent: goal-41
tags: [0.3.9, skills, docs, cli-coverage]
owners: []
links: []
artifacts: [.mdkg/skills, CLI_COMMAND_MATRIX.md, docs/src/content/docs/reference/cli.md]
relates: []
blocked_by: [task-594]
blocks: [test-305, task-600]
refs: [task-594]
context_refs: []
evidence_refs: []
aliases: []
skills: [author-mdkg-skill]
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Audit and refresh first-party mdkg skills so they explain the current CLI
capabilities and the new `0.3.9` customization model.

# Acceptance Criteria

- First-party skills cover current command families, including manifest,
  capability, archive, bundle, subgraph, work, db, upgrade, validate, and docs
  checks where relevant.
- Stale `SPEC.md`, `.agents`-only, or outdated command syntax examples are
  corrected.
- Skill updates preserve stage tags and writer-safety boundaries.

# Files Affected

- `.mdkg/skills/`
- mirrored skill outputs if sync is required
- CLI/docs references needed by the skills

# Implementation Notes

- Use `author-mdkg-skill` for skill edits.
- Do not expand skills into broad prose docs; keep them operational.
- Mirror generated skills only after canonical `.mdkg/skills/` is correct.

# Test Plan

- `mdkg skill list --json`
- `mdkg skill show <slug> --json` for changed skills
- docs/command checks if examples change
- `test-305`

# Links / Artifacts

- `edd-57`
