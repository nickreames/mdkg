---
id: bug-18
type: bug
title: Template schema discovery escapes its configured root through default_set
status: backlog
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

Repository config validates templates.root_path as contained but only checks default_set is a string. An absolute or traversal default_set redirects schema discovery to an external directory, whose Markdown is recursively read without bounds and can affect inferred schema or expose field/path details in errors.

Severity: low. Out-of-scope local reads, metadata error disclosure and resource exhaustion during local schema-driven commands. Requires local operator consumption; no remote execution.

Owner and qualified execution scope: goal-84. Source evidence: src/graph/template_schema.ts:114.

# Reproduction Steps

Use synthetic attacker-controlled inputs matching the sealed scan finding in an owned disposable fixture. Establish failing-before evidence without touching host sentinels outside owned temporary roots.

# Expected vs Actual

Expected: the stated contract is safe and fully evidenced. Actual: the sealed source scan confirms the reachable control gap; runtime reproduction is still pending.

# Suspected Cause

Path resolution combines a contained root with an unchecked later component; schema discovery uses raw traversal and reads instead of the contained template body reader.

# Fix Plan

Require a contained normalized template-set selector, verify the complete resolved path/tree through filesystem authority and bound schema file count/bytes before parsing.

Allowed paths: affected implementation above, directly linked helper/consumer paths, focused regression tests and owned mdkg evidence. No unrelated refactoring. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

Affected-version assessment: confirmed against current 9d7e0d3f candidate source. Verify published 0.5.2 implementation before claiming it affected; identity features may be candidate-only. No invented CVE or advisory claim.

# Test Plan

1. Absolute and traversal selectors fail before reads.
2. Template-root symlinks cannot escape.
3. Normal custom sets and bundled fallback remain usable.

Require failing-before/passing-after results and independent verification in task-828. Every security bug links a case-level source regression and installed consumer regression where applicable. No automatic waiver.

# Links / Artifacts

Codex Security scan 35ca791e-716a-4bc3-8067-88d47224e288; candidate key identity-template-root-escape; sanitized hash receipt chk-571.

Disposition: open, not fixed, not publication-ready.
