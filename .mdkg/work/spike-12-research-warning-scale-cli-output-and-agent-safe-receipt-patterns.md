---
id: spike-12
type: spike
title: research warning-scale CLI output and agent-safe receipt patterns
status: todo
priority: 1
epic: epic-114
parent: goal-23
tags: [warnings, research, receipts, agent-ux]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-21
updated: 2026-06-21
---
# Research Question

What CLI output and receipt patterns let mdkg stay useful to agents when validation or formatter warnings reach hundreds or thousands of items?

# Context And Constraints

- Preserve backward-compatible full JSON diagnostics for existing tooling.
- Keep compact output explicitly opt-in or additive.
- Do not weaken validation errors.
- Avoid storing raw secrets, prompts, tokens, payloads, or unrelated raw model output in receipts.

# Search Plan

- Inspect current `validate`, `format`, `doctor`, `subgraph`, and `handoff` command outputs.
- Review existing high-volume warning evidence from multi-repo mdkg upgrade runs.
- Compare common CI patterns: summary-first logs, full artifact files, truncation metadata, and deterministic grouping.

# Findings

- Pending implementation research.

# Options And Tradeoffs

- Add summary fields while preserving full arrays: safest compatibility path.
- Make compact JSON default: better ergonomics but risky for existing consumers.
- Add only documentation: cheapest, but would not prevent future regressions.

# Recommendation

Default to additive summary fields, explicit compact flags, and clean JSON artifact output paths.

# Follow-Up Nodes To Create

- task-429
- task-430
- task-431
- test-191
- test-192
- test-193

# Skill Candidates

- Update existing mdkg goal pursuit and closeout skills for multi-repo warning review rather than adding a new skill.

# Data Structures And Algorithms Notes

- Summary grouping should be deterministic: warning id, category, node type, path, qid, and sampled diagnostics.

# UX Notes

- Put counts and truncation metadata near the top of receipts so agents can reason before output truncation.

# Security Notes

- Compact summaries must not include raw marker content.

# mdkg.dev Launch Implications

- mdkg.dev docs should show both compact agent-safe commands and full diagnostic artifact workflows.

# Evidence And Sources

- Runtime and root orchestration upgrade feedback captured in goal-23 context.
