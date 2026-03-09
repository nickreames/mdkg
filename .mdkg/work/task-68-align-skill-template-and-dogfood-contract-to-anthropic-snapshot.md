---
id: task-68
type: task
title: align skill template and dogfood contract to anthropic snapshot
status: done
priority: 1
epic: epic-9
tags: [v0_5, skills, template, docs]
owners: []
links: []
artifacts: [assets/skills/SKILL.md.example, .mdkg/skills/select-work-and-ground-context/SKILL.md, .mdkg/skills/build-pack-and-execute-task/SKILL.md, .mdkg/skills/verify-close-and-checkpoint/SKILL.md, .mdkg/design/edd-5-mdkg-skills-integration-guide-v0-4-agent-skills-standard-and-packs.md, .mdkg/design/edd-7-v0-4-agent-skills-standards-alignment-and-research-snapshot.md]
relates: [dec-12, edd-5, edd-7, test-33, epic-9]
blocked_by: []
blocks: [test-33]
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

Lock the built-in skill scaffold, dogfood skills, and design docs to the same Anthropic-aligned minimal authoring contract.

# Acceptance Criteria

- Generated default sections match the current canonical mdkg skill shape.
- Dogfood skills remain the source-truth examples.
- Optional sections are documented as optional rather than required defaults.

# Files Affected

- assets/skills/
- .mdkg/skills/
- .mdkg/design/

# Implementation Notes

- Keep the template body-first and concise.
- Do not add extra metadata requirements beyond the existing parser contract.

# Test Plan

- Validate via `test-33`.

# Links / Artifacts

- epic-9
