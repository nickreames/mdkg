---
id: bug-20
type: bug
title: Default pack output follows directory symlinks outside the checkout
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

Default pack generation builds a repository-local timestamped destination but performs raw mkdirSync/writeFileSync. A preexisting .mdkg/pack link redirects graph output and derived reports into an external writable directory, although the operator did not choose an external --out path.

Severity: low. Unintended external file creation containing project context, with possible replacement if the generated name already exists. Requires local operator consumption; no remote execution.

Owner and qualified execution scope: goal-84. Source evidence: src/commands/pack.ts:578.

# Reproduction Steps

Use synthetic attacker-controlled inputs matching the sealed scan finding in an owned disposable fixture. Establish failing-before evidence without touching host sentinels outside owned temporary roots.

# Expected vs Actual

Expected: the stated contract is safe and fully evidenced. Actual: the sealed source scan confirms the reachable control gap; runtime reproduction is still pending.

# Suspected Cause

Default generated output paths are treated like explicit user-selected export sinks without repository containment.

# Fix Plan

Apply contained atomic writes to default pack and derived report paths. Keep explicit export destinations an explicit separate authority mode with safe file-type handling.

Allowed paths: affected implementation above, directly linked helper/consumer paths, focused regression tests and owned mdkg evidence. No unrelated refactoring. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

Affected-version assessment: confirmed against current 9d7e0d3f candidate source. Verify published 0.5.2 implementation before claiming it affected; identity features may be candidate-only. No invented CVE or advisory claim.

# Test Plan

1. Default pack directory link leaves external directory unchanged.
2. Stats and truncation reports obey default-path containment.
3. Explicit approved export and dry-run remain supported.

Require failing-before/passing-after results and independent verification in task-828. Every security bug links a case-level source regression and installed consumer regression where applicable. No automatic waiver.

# Links / Artifacts

Codex Security scan 35ca791e-716a-4bc3-8067-88d47224e288; candidate key parent-default-pack-output-symlink; sanitized hash receipt chk-571.

Disposition: open, not fixed, not publication-ready.
