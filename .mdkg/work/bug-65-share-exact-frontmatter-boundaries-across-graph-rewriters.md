---
id: bug-65
type: bug
title: Share exact frontmatter boundaries across graph rewriters
status: done
priority: 1
tags: [release-0.6.0, current-security]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/current-security-audit-20260929.json, .mdkg/artifacts/goal-86/successor-installed-case-acceptance-20260930.json, .mdkg/artifacts/goal-86/successor-installed-platform-qualification-20260930.json, .mdkg/artifacts/goal-86/successor-security-acceptance-20260930.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-86, goal-84, task-828, test-491, chk-667]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-09-29
updated: 2026-09-30
---
# Overview

Goal: remedy frontmatter boundary disagreement destroys document body or metadata during rewriting within Goal86's accepted generic, Node-only local release scope.

Context: Current Standard scan 78faed0e-5058-4db4-969a-62ccb02d6910 completed against main 72a3c8780af7d4c2888590b02158ddc60476facc plus 280 frozen dirty paths. This is a new current-source finding, not recovery of blocked historical context. Goal84 is the paused blocker ledger; Goal86 is the sole execution lane.

Severity/impact: medium. Identity migration, independent fork, and v2 template import can silently discard the leading body segment while reporting preserved historical bodies. Reconciliation can omit this segment from same-node and conflict comparisons, allowing conflicting narrative/evidence edits to avoid the required body decision; subsequent serialization can discard that segment. Heading-only formatting independently selects a triple-hyphen substring inside a valid title scalar and discards the remaining frontmatter.

Owner: mdkg-project-agent, one writer. Allowed paths: src/graph/frontmatter.ts, identity_migration.ts, identity_reconcile.ts, src/commands/format.ts and their direct callers/tests; directly required mdkg evidence/projections and disposable synthetic fixtures.

Boundaries: no remote Git, publication, provider, consumer/root/sibling write, native helper, canonical branch/worktree change, graph migration or bundle refresh. Preserve unknown work, selected Goal73, runtime DB and Demo3 bundles. Bugs46/47 remain deferred/unresolved, not fixed or accepted. Stop on custody movement or a materially new decision.

Done when: failing-before evidence, the bounded remedy, focused regressions and shared-caller positives, independent post-patch review and installed successor-candidate controls pass. Full release ladder/platform/security acceptance and exact sealing remain separate gates; do not claim release readiness from a local fix.

# Reproduction Steps

Candidate6154e4ea accepted a task with a whitespace closing fence; preview was safe_to_apply with no blockers, exact-hash apply returned0, and a synthetic evidence paragraph before a later Markdown horizontal rule disappeared while the suffix remained. Preview itself preserved bytes. Installed format --headings --apply returned success but removed status and later fields for title review---notes. Preview was non-mutating but did not expose the destructive generated header.

Only synthetic data was used. Source-only sibling routes are not claimed dynamically tested. Canonical report hashes and sanitized mapping are in .mdkg/artifacts/goal-86/current-security-audit-20260929.json.

# Expected vs Actual

- Expected: Valid parser input does not establish equivalent rewrite framing.
- Actual: Identity migration, independent fork, and v2 template import can silently discard the leading body segment while reporting preserved historical bodies. Reconciliation can omit this segment from same-node and conflict comparisons, allowing conflicting narrative/evidence edits to avoid the required body decision; subsequent serialization can discard that segment. Heading-only formatting independently selects a triple-hyphen substring inside a valid title scalar and discards the remaining frontmatter.

# Suspected Cause

The normal parser ends the header at line.trim() === '---', but replaceGraphFrontmatter and reconciliation's exactBody search for an exact delimiter. They therefore identify the later horizontal rule as the header boundary and treat the intervening narrative as header material. The heading formatter likewise ignores the parser boundary and uses content.indexOf('---',3), a different delimiter interpretation with the same missing authoritative framing control.

Affected-version assessment: exact retained 0.6.0 candidate 6154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca and frozen current source confirmed. Earlier published versions are unassessed; do not infer exposure from version numbers.

# Fix Plan

Share delimiter grammar and exact source spans. Keep parsed-body normalization unchanged while identity operations preserve exact body bytes and heading-only formatting preserves header bytes. Do not globally reserialize unrelated prose.

# Test Plan

Whitespace delimiters, LF/CRLF, title a---b, later body horizontal rules, empty/missing boundaries, unchanged previews, idempotence, identity migration/reconciliation/fork/import and format controls.

Use selective iteration under verify-close-and-checkpoint. Broaden for shared helper callers; Test491 and Task828 independently bind final installed/review evidence. Source/package-input changes invalidate the old candidate for final acceptance, not its immutable historical receipts.

# Links / Artifacts

- Current rule: integrity.frontmatter-boundary-disagreement.
- .mdkg/artifacts/goal-86/current-security-audit-20260929.json and Chk667.
- Pre-patch boundary review was read-only and reused an independent reviewer because a fresh worker hit the host thread limit; this is not fresh post-patch verification.
