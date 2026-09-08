---
id: bug-11
type: bug
title: Symlinked graph directories expose and format external nodes
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

getWorkspaceDocRoots checks containment of the workspace .mdkg directory. Discovery then appends core, design, work, or archive and immediately calls readdirSync on those directory paths. It does not check whether these newly appended top-level directories are symlinks. readdirSync follows a symlinked root, and its regular child files are returned to indexer.ts, which reads and parses them with fs.readFileSync. Search and metadata-only output can expose the resulting external node metadata without invoking the protected local body reader. Parent additionally verified that format and heading-apply write through these discovered paths, replacing external nodes when formatting changes are needed.

Severity: medium. Beyond frontmatter disclosure, parent inspection established format and heading-apply write through discovered paths, allowing outside-root node replacement. Requires a compatible external graph and local formatting invocation.

Owner and qualified execution scope: goal-84. Source evidence: src/graph/workspace_files.ts:121, src/graph/workspace_files.ts:35, src/graph/indexer.ts:139, src/commands/format.ts:460, src/commands/format.ts:581.

# Reproduction Steps

Use synthetic attacker-controlled inputs matching the sealed scan finding in an owned disposable fixture. Establish failing-before evidence without touching host sentinels outside owned temporary roots.

# Expected vs Actual

Expected: the stated contract is safe and fully evidenced. Actual: the sealed source scan confirms the reachable control gap; runtime reproduction is still pending.

# Suspected Cause

Parent verified initial core/design/work/archive directory symlinks are followed before Dirent filtering. Raw indexing exposes metadata; both format apply loops pass the same discovered pathname to uncontained atomicWriteFile. Nested links and ordinary node-body reads are protected but do not guard these routes.

# Fix Plan

Apply contained-directory authority to every discovery root and use contained file reads when parsing discovered Markdown. Test symlinks at the core, design, work, and archive root positions, not only nested entries.

Allowed paths: affected implementation above, directly linked helper/consumer paths, focused regression tests and owned mdkg evidence. No unrelated refactoring. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

Affected-version assessment: confirmed against current 9d7e0d3f candidate source. Verify published 0.5.2 implementation before claiming it affected; identity features may be candidate-only. No invented CVE or advisory claim.

# Test Plan

1. Regression for the exact source-to-sink input and every independently reachable sibling consumer.
2. Positive contained regular-file behavior and compatibility remain supported.
3. Rejected paths leave external files, selected state and Git staging unchanged.

Require failing-before/passing-after results and independent verification in task-828. Every security bug links a case-level source regression and installed consumer regression where applicable. No automatic waiver.

# Links / Artifacts

Codex Security scan 35ca791e-716a-4bc3-8067-88d47224e288; candidate key baseline-workspace-root-symlink; sanitized hash receipt chk-571.

Disposition: open, not fixed, not publication-ready.
