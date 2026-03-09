---
id: task-48
type: task
title: plan skills authoring guide and script risk policy
status: done
priority: 1
epic: epic-4
tags: [v0_4, skills, guide, security]
owners: []
links: []
artifacts: [.mdkg/design/edd-5-mdkg-skills-integration-guide-v0-4-agent-skills-standard-and-packs.md, .mdkg/design/prd-1-mdkg-product-spec-v0-4-deterministic-agent-memory-and-skills.md, .mdkg/design/dec-9-v0-4-decision-log-design-philosophy-and-key-decisions.md, README.md]
relates: [prd-1, dec-8, dec-9, edd-5, epic-4]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-03-04
updated: 2026-03-06
---

# Overview

Define practical authoring guidance for skills and a clear risk policy for skills that include scripts.

# Acceptance Criteria

- Skills authoring structure is documented (goal, inputs, preconditions, steps, outputs, failure handling, examples).
- Single-purpose skill guidance is explicit with good/bad examples.
- Script-bearing skills are documented as higher-risk with explicit approval/logging/path constraints guidance.
- Guidance clearly states mdkg indexes/discovers skills but does not execute scripts.
- Guidance remains source-truth aligned and avoids claiming unimplemented runtime enforcement.

# Files Affected

- .mdkg/design/edd-5-mdkg-skills-integration-guide-v0-4-agent-skills-standard-and-packs.md
- .mdkg/design/dec-9-v0-4-decision-log-design-philosophy-and-key-decisions.md
- README.md

# Implementation Notes

- Keep metadata extension contract flattened (`ochatr_*`), not nested maps.
- Keep this pass docs/work-node only.

# Test Plan

Validate policy and portability coverage in docs (`test-18`, `test-19`).

# Links / Artifacts

- prd-1
- dec-8
- dec-9
- edd-5
- epic-4
