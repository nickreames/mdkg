---
id: test-18
type: test
title: v0.4 skills guide metadata portability and source truth
status: done
priority: 1
epic: epic-4
tags: [v0_4, skills, docs, validation]
owners: []
links: []
artifacts: [.mdkg/design/edd-5-mdkg-skills-integration-guide-v0-4-agent-skills-standard-and-packs.md, .mdkg/design/dec-8-v0-4-doc-integration-source-truth-and-gap-policy.md, .mdkg/design/dec-9-v0-4-decision-log-design-philosophy-and-key-decisions.md, README.md]
relates: [prd-1, dec-8, dec-9, edd-5, task-35, task-48, epic-4]
blocked_by: []
blocks: []
refs: []
aliases: []
cases: [flattened-metadata-contract, source-truth-labeling, portability-guidance]
created: 2026-03-04
updated: 2026-03-06
---

# Overview

Validate that skills integration guidance preserves parser-compatible metadata contracts and source-truth labeling.

# Target / Scope

Covers flattened metadata policy, deterministic/progressive disclosure guidance, and planned-vs-implemented boundaries.

# Preconditions / Environment

- `edd-5` and linked tasks are integrated
- source-truth policy (`dec-8`) is current
- runtime remains unchanged in this pass

# Test Cases

- Verify skills metadata guidance uses flattened optional `ochatr_*` keys, not nested maps.
- Verify skills guidance clearly separates implemented behavior from v0.4 planned capability.
- Verify portability guidance ensures SKILL instructions remain useful without runtime-specific metadata.

# Results / Evidence

Capture `mdkg show edd-5 --body`, `mdkg show dec-8 --body`, and relevant task outputs.

# Notes / Follow-ups

- Add parser-level fixture tests once skill frontmatter parsing is implemented.
