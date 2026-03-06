---
id: task-49
type: task
title: plan omni skills usage pattern and pack loading guidance
status: todo
priority: 1
epic: epic-4
tags: [v0_4, skills, omni, packs]
owners: []
links: []
artifacts: []
relates: [prd-1, dec-8, dec-9, edd-3, edd-5, epic-4]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-03-04
updated: 2026-03-04
---

# Overview

Define recommended orchestrator usage of skills in Omni-style flows, including metadata-first discovery and full-body inclusion during execution.

# Acceptance Criteria

- Omni pattern is documented: select node -> load deterministic pack -> load relevant skill bodies -> execute -> write results/checkpoint.
- Guidance distinguishes skills (procedural memory) from tools (capability implementations).
- Progressive disclosure guidance is explicit (meta during planning, full during execution).
- Recommended skill pack flags are documented as non-normative until CLI contract is finalized.

# Files Affected

- .mdkg/design/edd-3-mdkg-agent-memory-model-deterministic-memory-skills-events.md
- .mdkg/design/edd-5-mdkg-skills-integration-guide-v0-4-agent-skills-standard-and-packs.md
- .mdkg/work/task-36-plan-pack-skill-inclusion.md

# Implementation Notes

- Keep command naming deferred; examples are illustrative only.
- Preserve pack ordering and checkpoint-default inclusion assumptions from existing v0.4 decisions.

# Test Plan

Validate usage guidance consistency with pack and memory-model docs (`test-10`, `test-19`).

# Links / Artifacts

- prd-1
- dec-8
- dec-9
- edd-3
- edd-5
- epic-4
