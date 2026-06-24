---
id: spike-17
type: spike
title: research pass 2 feedback into public-alpha Product Design execution model
status: done
priority: 1
tags: [mdkg-dev, feedback, product-design]
owners: []
links: []
artifacts: [mdkg_preview_polish_pass2]
relates: []
blocked_by: []
blocks: [task-501, task-503]
refs: [archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Research Question

How should the pass-2 feedback become a Product Design-grounded implementation plan that improves public trust without turning mdkg.dev into overbuilt marketing?

# Context And Constraints

- The source bundle contains 40 stories across P0, P1, P2, and P3.
- Goal 31 is graph-only; Goal 32 is the future implementation.
- User decisions: include all P2 and P3, delete `/docs` now, keep Claims Evidence Matrix internal, use CSS/HTML diagram first, rewrite `llms` manually once, update README/package metadata, noindex previews only, and push after local gates.

# Search Plan

- Read all pass-2 files and story files.
- Compare against achieved Goal 30 and existing mdkg.dev design records.
- Convert feedback into PRD, EDD, DEC, task, and test contracts.

# Findings

- The major risk is not missing content; it is public trust erosion from scaffold/meta language, broken command blocks, duplicated docs entrypoints, and unclear launch boundaries.
- The implementation goal should be ambitious but sequential: P0 first, P1/P2 copy/docs/trust next, P3 docs expansion, then validation/push/Vercel proof.
- Product Design review should be checkpoint evidence for hierarchy, clarity, responsiveness, and credibility.

# Recommendation

Create Goal 32 as a paused implementation goal that includes all P0/P1/P2/P3 stories, explicit checkpoints, local Browser/Chrome/Product Design QA, logical commits, push to `origin/main`, Vercel preview validation, and no-launch stop conditions.

# Follow-Up Nodes To Create

- `goal-32`
- `prd-7`
- `edd-36`
- `edd-37`
- `edd-38`
- `dec-37`
- `dec-38`

# Skill Candidates

- Future mdkg-dev website QA skill after pass-2 implementation stabilizes.

# UX Notes

- Public visitors need a five-minute path: install, init, index, status, validate, then Plan -> Work -> Evidence.
- The wordmark should stay simple; no logo treatment is needed now.

# Security Notes

- Public copy should emphasize local-first and low-dependency behavior while avoiding comprehensive security guarantees.

# Evidence And Sources

- `mdkg_preview_polish_pass2/INDEX.md`
- `mdkg_preview_polish_pass2/USER_STORIES_mdkg_dev_docs_pass_2.md`
- `archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24`

# Options And Tradeoffs
