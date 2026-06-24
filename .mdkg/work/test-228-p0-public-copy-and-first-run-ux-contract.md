---
id: test-228
type: test
title: P0 public copy and first-run UX contract
status: done
priority: 1
tags: [mdkg-dev, p0, ux]
owners: []
links: []
artifacts: []
relates: [task-490]
blocked_by: [task-490]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Contract

P0 public copy, quickstart command formatting, docs bridge behavior, `llms.txt`, CTAs, alpha/trust copy, and semantic-ref wording are fixed and validated.

# Verification

- Product-site build.
- Browser checks for homepage, quickstart, docs bridge, trust, alpha, and `llms.txt`.

# Evidence

- Covered by `task-490`, `chk-206`, and final Browser receipts.
- `npm --prefix mdkg-dev run build`, `npm run smoke:mdkg-dev`, and `npm run smoke:mdkg-dev-seo` passed.
- Browser checks covered homepage, quickstart, trust, docs bridge, and LLM docs with expected copy and no raw-marker findings.
