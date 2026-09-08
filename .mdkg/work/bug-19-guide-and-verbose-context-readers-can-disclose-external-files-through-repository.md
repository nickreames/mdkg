---
id: bug-19
type: bug
title: Guide and verbose context readers can disclose external files through repository links
status: done
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-19-verification.json]
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

The guide command follows .mdkg/core/guide.md symlinks and prints the complete external target. The verbose pack core-list reader similarly follows a configured link and includes unresolved noncomment lines in warnings. These bypass the containment checks used for ordinary node and skill bodies.

Severity: medium. Host file content can enter agent context, command output or a persisted pack without authorization to read outside the selected repository. Requires local operator consumption; no remote execution.

Owner and qualified execution scope: goal-84. Source evidence: src/commands/guide.ts:10.

# Reproduction Steps

Use synthetic attacker-controlled inputs matching the sealed scan finding in an owned disposable fixture. Establish failing-before evidence without touching host sentinels outside owned temporary roots.

# Expected vs Actual

Expected: discovery reads reject linked/nonregular/oversized content before disclosure. Thirteen discovery cases failed before patch; two shared-reader cases additionally proved post-stat growth could exceed the byte bound and FIFO reads could block before regular-file validation. The corrected candidate passes all original and alternate inputs with no external sentinel disclosure.

# Suspected Cause

Auxiliary guidance and context-list readers use existsSync/readFileSync directly rather than the shared contained reader.

# Fix Plan

Use bounded contained regular-file reads for guide and core-list discovery; validate configured paths and reject links before output.

Allowed paths: affected implementation above, directly linked helper/consumer paths, focused regression tests and owned mdkg evidence. No unrelated refactoring. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

Affected-version assessment: the exact published 0.5.2 tarball contains the same raw guide/core-list readers; runtime before-proof used the equivalent prepatch candidate. Earlier versions unassessed; no CVE or advisory claim.

# Test Plan

1. Guide file/parent link produces no external sentinel output.
2. Verbose core-list link does not leak lines in warnings.
3. Valid guide and verbose core behavior remain compatible.

Require failing-before/passing-after results and independent verification in task-828. Every security bug links a case-level source regression and installed consumer regression where applicable. No automatic waiver.

# Links / Artifacts

Codex Security scan 35ca791e-716a-4bc3-8067-88d47224e288; candidate key parent-guide-uncontained-read; sanitized hash receipt chk-571.

Disposition: fixed and verified locally. Guide and verbose lists use root-contained regular-file reads with the existing 8 MiB body-limit precedent; an explicit pack maxBodyBytes is honored. The shared reader checks actual bytes, rejects invalid budgets and refuses special files without blocking on a FIFO. Normal Unicode/empty/trimEnd guide output, native custom list paths, CRLF/comment/case parsing and nonverbose behavior remain supported.

Fresh independent investigation and one candidate review found no surviving static-input bypass or regression. The stronger active concurrent ancestor-swap limitation remains explicit; this is not portable openat protection. Verbose disclosure was into warnings/stderr, not ordinary serialized pack content; MCP/handoff currently disable verbose mode.

Evidence: `.mdkg/artifacts/goal-84/bug-19-verification.json`. Focused source checks pass 65, installed-package discovery/authority checks pass 27, and the full suite passes 833 plus 26 with no failures/skips. CLI/doc/graph/diff checks pass. Protected state and three inherited age warnings remain unchanged. Final task-828 security diff review and overall 0.6.0 qualification remain open; no publication readiness is claimed.
