---
id: spike-12
type: spike
title: research warning-scale CLI output and agent-safe receipt patterns
status: done
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
refs: [task-429, task-430, task-431, task-432, task-433, task-434, task-435, test-191, test-192, test-193, test-194, test-195]
context_refs: []
evidence_refs: [task-429, task-430, task-431, task-432, task-433, task-434, task-435, test-191, test-192, test-193, test-194, test-195]
aliases: []
skills: []
created: 2026-06-21
updated: 2026-06-25
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

- The safest scalable pattern is additive and compatibility-preserving: keep full `warnings` and `warning_diagnostics` available for existing tooling, and add deterministic `warning_summary` metadata for high-level review.
- Compact output should remain explicit through `--summary`, with `--limit <n>` controlling sampled diagnostics and truncation metadata showing exactly what was omitted.
- Clean machine artifacts should use `--json-out <path>` for full parseable JSON receipts; the existing `--out <path>` behavior remains a compatibility text report path.
- Heading formatter previews need the same summary-first shape so `mdkg format --headings --dry-run --summary --json --limit <n>` is safe for warning-heavy historical graphs.
- Strict doctor, subgraph, and handoff remediation should give concrete next commands and safe multi-repo sequencing rather than hiding real graph problems.
- Prepublish automation should include a high-volume warning smoke so warning-heavy output regressions are caught before release.

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
- `task-429` specified the compact warning-summary and clean JSON receipt contract.
- `task-430` implemented `validate` warning summaries, explicit summary output, and `--json-out`.
- `task-431` implemented summary-first heading formatter preview behavior.
- `task-432` improved strict doctor, subgraph, and handoff remediation wording.
- `task-433` updated repo-local mdkg skills for safe multi-repo upgrade and subgraph sequencing.
- `task-434` added the CI-style high-volume warning smoke.
- `task-435` aligned docs, command matrix, help snapshots, changelog, and publish-readiness assertions.
- `test-191` through `test-195` record the validation, formatter, remediation, and packed warning UX contracts.
