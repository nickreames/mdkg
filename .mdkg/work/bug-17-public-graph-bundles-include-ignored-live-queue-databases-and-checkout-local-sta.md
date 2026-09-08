---
id: bug-17
type: bug
title: Public graph bundles include ignored live queue databases and checkout-local state
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

Bundle exclusions omit the configured live DB runtime and most checkout-local state. A public workspace's .mdkg/db/runtime/project.sqlite, journals and queue payloads are recursively packaged as authored public files despite runtime policy explicitly marking them local and ignored by Git.

Severity: medium. Private local task payloads, errors and execution ownership may be included in an artifact meant to contain public project memory. Requires local operator consumption; no remote execution.

Owner and qualified execution scope: goal-84. Source evidence: src/commands/bundle.ts:368.

# Reproduction Steps

Use synthetic attacker-controlled inputs matching the sealed scan finding in an owned disposable fixture. Establish failing-before evidence without touching host sentinels outside owned temporary roots.

# Expected vs Actual

Expected: the stated contract is safe and fully evidenced. Actual: the sealed source scan confirms the reachable control gap; runtime reproduction is still pending.

# Suspected Cause

Bundle collection treats all remaining .mdkg files as authored knowledge, relying on a short fixed exclusion list rather than configured runtime/transport policy.

# Fix Plan

Exclude configured live runtime DBs, sidecars, locks, local selection and transient execution state using one transport classification contract. Keep intentionally sealed portable snapshots/evidence distinct from live runtime files.

Allowed paths: affected implementation above, directly linked helper/consumer paths, focused regression tests and owned mdkg evidence. No unrelated refactoring. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

Affected-version assessment: confirmed against current 9d7e0d3f candidate source. Verify published 0.5.2 implementation before claiming it affected; identity features may be candidate-only. No invented CVE or advisory claim.

# Test Plan

1. Synthetic queue secret markers never occur in public or portable bundle contents.
2. Configured nondefault runtime paths and SQLite sidecars are excluded.
3. Intentionally sealed portable DB snapshots retain explicit supported behavior.

Require failing-before/passing-after results and independent verification in task-828. Every security bug links a case-level source regression and installed consumer regression where applicable. No automatic waiver.

# Links / Artifacts

Codex Security scan 35ca791e-716a-4bc3-8067-88d47224e288; candidate key db-runtime-public-bundle; sanitized hash receipt chk-571.

Disposition: open, not fixed, not publication-ready.
