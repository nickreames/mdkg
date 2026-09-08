---
id: bug-15
type: bug
title: Skill projection copies external files through source resource-directory symlinks
status: done
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-15-verification.json]
relates: [test-479]
blocked_by: []
blocks: []
refs: []
context_refs: [goal-84, goal-83]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-07
updated: 2026-09-08
---

# Overview

A valid repository skill can link its assets, references, or scripts directory to readable files outside the checkout. Skill mirror synchronization follows that resource-root link and copies the files into native agent projections, where they can be consumed or accidentally committed.

Severity: medium. Disclosure and persistence of external local files in generated agent-facing resources. Requires local operator consumption; no remote execution.

Owner and qualified execution scope: goal-84. Source evidence: src/commands/skill_mirror.ts:226.

# Reproduction Steps

Use synthetic attacker-controlled inputs matching the sealed scan finding in an owned disposable fixture. Establish failing-before evidence without touching host sentinels outside owned temporary roots.

# Expected vs Actual

Expected: the stated contract is safe and fully evidenced. Actual: the sealed source scan confirms the reachable control gap; runtime reproduction is still pending.

# Suspected Cause

Canonical SKILL.md and destination trees are contained, but resource directory roots use statSync and raw recursive source reads.

# Fix Plan

Validate complete source skill resource trees with contained no-follow traversal and reads before touching any mirror; share that safe source inventory with parity checking.

Allowed paths: affected implementation above, directly linked helper/consumer paths, focused regression tests and owned mdkg evidence. No unrelated refactoring. This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

Affected-version assessment: confirmed against current 9d7e0d3f candidate source. Verify published 0.5.2 implementation before claiming it affected; identity features may be candidate-only. No invented CVE or advisory claim.

# Test Plan

1. Each assets/references/scripts root link fails without copying sentinels.
2. Source race and nested link cases fail closed.
3. Valid mirrors, customization ownership and repeat sync remain compatible.

Require failing-before/passing-after results and independent verification in task-828. Every security bug links a case-level source regression and installed consumer regression where applicable. No automatic waiver.

# Links / Artifacts

Codex Security scan 35ca791e-716a-4bc3-8067-88d47224e288; candidate key skill-source-assets-symlink; sanitized hash receipt chk-571.

Disposition: open, not fixed, not publication-ready.

## 2026-09-08 Prepatch Investigation and Pending Limit Decision

Parent and one independent read-only source investigator confirm resource-root
links, stale nested links, discovery-to-read substitution and the parity reader
share the gap. Prepare complete byte-preserving source inventories before mirror
writes, reuse them for parity, and preserve valid binary/empty-directory/legacy
document/custom-target behavior. No skill source or mirror changes yet.

Nick has been asked whether projected resource snapshots should reuse existing
configurable graph limits (8 MiB/file, 512 MiB total defaults), failing explicitly
with mirrors untouched when exceeded, or use separately agreed resource limits.
This is a compatibility decision for large assets, not duplicate implementation
approval. Await the answer for this lane; continue independent bugs 16/17.
Snapshot bytes are local evidence, not permission to execute skill scripts.

## Accepted Limit Policy

Nick accepted reuse of existing configurable graph limits for source skill
resource inventories: 8 MiB per file and 512 MiB aggregate by default. Reject
oversized input explicitly before mirror writes; do not truncate or delete it.
The policy question is resolved. Resume the existing bounded fix and independent
verification; no skill authoring, script execution or canonical mirror sync.

## Local Verification

Fixed locally with complete contained byte inventories before mirror writes,
bounded document discovery/parsing, binary-safe parity and atomic replacement
preserving existing permissions. Ten initial regression failures reproduced the
gap. Independent candidate review found early unbounded document parsing and
umask-based permission loss; both were reproduced and corrected. Eighteen new
cases plus existing mirror/skill/index tests pass: 44 focused and 44 against the
installed candidate. Serialized full validation passes 1,018 source tests and
26 release/security-contract checks. CLI/docs/full and changed-only graph/DB/diff
checks pass; only three inherited subgraph-age warnings remain. One overlapping
docs build invalidated a full-suite attempt; the isolated rerun passed.

Source-confirmed affected in cached published 0.5.2; no fresh registry or external
exploit execution. Exact hashes, intermediate package integrity, compatibility,
limits and exclusions: .mdkg/artifacts/goal-84/bug-15-verification.json.
No portable active-ancestor race, extended ACL, Windows or supported Node 24
qualification is claimed here. Final independent task-828 remains required.
Selected Goal 73, runtime DB and protected bundle hashes are unchanged; no
canonical skill sync or bundle rebuild. No new skill candidate.
