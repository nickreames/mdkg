---
id: bug-13
type: bug
title: Event JSONL validation follows symlinks and reads an unbounded stream into memory
status: blocked
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: [test-479]
blocked_by: []
blocks: []
refs: []
context_refs: [goal-84, goal-83]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-07
updated: 2026-09-07
---

# Overview

validateEventsJsonl constructs the events path from the workspace configuration, checks only existsSync, then reads the entire path into a string and splits it into lines. A tracked events.jsonl symlink can point at /dev/zero or a very large external file. Markdown discovery limits do not account for this JSONL input. collectValidateReceipt invokes this validator, including through MCP validation and materialization's project-memory validation.

Severity: low. Repository-controlled event input can exhaust or stall a local validation process. Operator repository consumption is required; no separate remote endpoint or confidentiality impact is established.

Owner and qualified execution scope: goal-84. Source evidence: src/commands/validate.ts:683, src/commands/validate.ts:896.

# Reproduction Steps

Use synthetic attacker-controlled inputs matching the sealed scan finding in an owned disposable fixture. Establish failing-before evidence without touching host sentinels outside owned temporary roots.

# Expected vs Actual

Expected: the stated contract is safe and fully evidenced. Actual: the sealed source scan confirms the reachable control gap; runtime reproduction is still pending.

# Suspected Cause

Parent verified whole-file event read and split happens before JSON validation and outside Markdown discovery limits. MCP validation reaches collectValidateReceipt; event append containment does not protect this independent read.

# Fix Plan

Read the event log through contained regular-file authority with explicit file, line, and record-count limits. Prefer incremental parsing when logs may legitimately grow, and include event-log consumption in materialization's total validation budget.

Allowed paths: affected implementation above, directly linked helper/consumer paths, focused regression tests and owned mdkg evidence. No unrelated refactoring. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

Affected-version assessment: confirmed against current 9d7e0d3f candidate source. Verify published 0.5.2 implementation before claiming it affected; identity features may be candidate-only. No invented CVE or advisory claim.

# Test Plan

1. Regression for the exact source-to-sink input and every independently reachable sibling consumer.
2. Positive contained regular-file behavior and compatibility remain supported.
3. Rejected paths leave external files, selected state and Git staging unchanged.

Require failing-before/passing-after results and independent verification in task-828. Every security bug links a case-level source regression and installed consumer regression where applicable. No automatic waiver.

# Links / Artifacts

Codex Security scan 35ca791e-716a-4bc3-8067-88d47224e288; candidate key baseline-events-unbounded-read; sanitized hash receipt chk-571.

Disposition: open, not fixed, not publication-ready.

## Compatibility Decision Pending

2026-09-07 independent read-only prepatch investigation confirms that current
event writers append without file/line/count limits or rotation, while edd-6
describes high-frequency append-only durable history. Markdown discovery limits
do not currently include event JSONL bytes. No event-specific defaults or
oversized-history recovery contract is established. No source changes or
runtime reproduction for this finding have been performed.

Question sent to Nick: may 0.6.0 validation reject oversized event histories
with a clear error, using configurable bounded streaming, or should streaming
accept arbitrarily large histories with no total-size limit? Recommendation:
configurable bounded streaming, no automatic rotation/deletion, preserved raw
history, explicit limit diagnostics. Numerical limits and shared materialization
budgets must be documented and tested after that compatibility choice. Neither
the recommendation nor an unanswered question is an accepted product decision.

All collectValidateReceipt consumers need coverage, including CLI, MCP and
materialization. Preserve current line numbering, blank lines, CRLF, final lines
without newline, UTF-8 boundaries and existing permissive event field semantics.
Bound accumulated diagnostics as well as record/file/aggregate consumption.
Keep this finding open until regression execution and independent verification.
