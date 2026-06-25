---
id: goal-35
type: goal
title: Polish mdkg.dev and docs.mdkg.dev launch-ready public-alpha experience pass 5
status: todo
priority: 1
goal_state: active
goal_condition: Goal 35 is achieved when the pass-5 feedback is implemented, local Browser/Chrome/Product Design/Creative Production QA passes, local gates pass, logical commits are pushed to origin/main, Vercel previews for mdkg-dev and mdkg-docs are live and validated, and no launch side effects occur.
scope_refs: [epic-181, epic-182, epic-183, epic-184, epic-185, epic-186, epic-187, epic-188, spike-20, task-549, task-550, task-551, task-552, task-553, task-554, task-555, task-556, task-557, task-558, task-559, task-560, task-561, task-562, test-269, test-270, test-271, test-272, test-273, test-274, test-275, test-276, test-277, test-278, test-279, test-280]
active_node: task-561
required_skills: [select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [git status --short --branch, npm --prefix mdkg-dev run build, npm --prefix docs run build, npm run docs:check, npm run docs:check-commands, npm run smoke:mdkg-dev, npm run smoke:mdkg-dev-docs, npm run smoke:mdkg-dev-seo, npm run smoke:demo-graph, npm run smoke:mdkg-dev-polish-pass4, npm run smoke:mdkg-dev-polish-pass5, npm run smoke:mdkg-dev-a11y, npm run smoke:mdkg-dev-perf, npm run build, npm run test, npm run cli:check, npm run cli:contract, node dist/cli.js validate --summary --json --limit 20, node dist/cli.js doctor --strict --json, Browser and Chrome local E2E at desktop tablet and mobile widths, Product Design screenshot-backed audit checkpoint, Creative Production visual direction checkpoint, Vercel deployment and build-log verification for mdkg-dev and mdkg-docs, hosted preview route checks for marketing home docs home quickstart trust demo graphs generated CLI reference llms.txt and llms-full.txt, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [mdkg-dev, public-alpha, launch-ready, preview-polish, product-design, creative-production, vercel-preview]
owners: []
links: [https://mdkg-dev.vercel.app/, https://mdkg-docs.vercel.app/]
artifacts: [archive://archive.mdkg-dev-preview-audit-pass-5-2026-06-24]
relates: []
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-preview-audit-pass-5-2026-06-24]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-06-24
updated: 2026-06-24
---
# Objective

Raise mdkg.dev and docs.mdkg.dev from polished public-alpha preview to launch-ready preview by implementing the pass-5 audit: correct preview docs links, remove duplicated Starlight navigation noise, validate every public command example, make first success more copy-pasteable, tighten the homepage narrative, improve docs IA and troubleshooting, fix agent-readable text assets, measure accessibility/performance, and prove the result through local and hosted preview validation.

# End Condition

This goal is done only when all scoped tasks/tests are complete, required checkpoints exist, local checks pass, Browser/Chrome/Product Design/Creative Production evidence is recorded, logical commits are pushed to `origin/main`, Vercel previews for `mdkg-dev` and `mdkg-docs` redeploy successfully and match local proof, and final closeout confirms no DNS, production promotion, npm publish, tag, analytics activation, GitHub settings mutation, or public-launch announcement occurred.

# Non-Goals

- No DNS change for `mdkg.dev`, `www.mdkg.dev`, or `docs.mdkg.dev`.
- No Vercel production promotion, analytics activation, public launch announcement, npm publish, or git tag.
- No GitHub repository settings mutation; GitHub metadata changes are handoff copy only.
- No generated final image/video assets; diagrams should be deterministic accessible HTML/CSS/SVG unless explicitly rescoped later.
- No broad rewrite outside the pass-5 audit and launch-ready public-alpha polish boundary.

# Recursive Algorithm

1. Ground the current graph, pass-5 archive, previous pass evidence, and active node.
2. Work one scoped task/test at a time from `task-550` through `task-562`.
3. Keep implementation commits logical and evidence-rich; do not push until local gates and QA pass.
4. Validate marketing and docs locally in Browser and Chrome at desktop, tablet, and mobile widths.
5. Run Product Design and Creative Production reviews as direction gates and apply evidence-backed fixes.
6. Push only after local gates pass, then verify Vercel deployments, logs, and hosted previews.
7. Close with checkpoint evidence and explicit no-launch-side-effect confirmation.

# Required Skills

- select-work-and-ground-context
- verify-close-and-checkpoint

# Required Checks

- `npm --prefix mdkg-dev run build`
- `npm --prefix docs run build`
- `npm run docs:check`
- `npm run docs:check-commands`
- `npm run smoke:mdkg-dev`
- `npm run smoke:mdkg-dev-docs`
- `npm run smoke:mdkg-dev-seo`
- `npm run smoke:demo-graph`
- `npm run smoke:mdkg-dev-polish-pass4`
- new `npm run smoke:mdkg-dev-polish-pass5`
- `npm run smoke:mdkg-dev-a11y`
- `npm run smoke:mdkg-dev-perf`
- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `node dist/cli.js validate --summary --json --limit 20`
- `node dist/cli.js doctor --strict --json`
- Browser and Chrome local E2E at desktop, tablet, and mobile widths.
- Product Design screenshot-backed audit checkpoint.
- Creative Production visual-direction checkpoint.
- Vercel project/deployment/build-log verification for `mdkg-dev` and `mdkg-docs`.
- Hosted preview route checks for marketing home, docs home, quickstart, trust, demo graphs, generated CLI reference, `llms.txt`, and `llms-full.txt`.
- `git diff --check`

# Acceptance Criteria

- Preview CTAs and docs links target `https://mdkg-docs.vercel.app/` until `docs.mdkg.dev` DNS is live.
- Starlight pages have one coherent TOC/outline, readable code blocks, copyable commands, and screen-reader-friendly structure.
- Public command examples are canonical, validated against the command contract/help, and safe to copy-paste.
- Homepage copy is denser and clearer, with a strong thesis, before/after narrative, first-success path, final CTA, and production-quality social metadata.
- Docs explain the no-work-yet path, human/agent routing, demo graph entry, troubleshooting, generated references, frontmatter examples, and common mistakes.
- `llms.txt` and `llms-full.txt` are readable agent-facing plain text with preserved headings, links, and line breaks.
- Public docs remove remaining meta commentary and keep CLI Reference user-facing, Command Contract maintainer-facing, Roadmap product-facing, and Changelog release-note-oriented.
- Accessibility, reduced motion, contrast, performance, noindex/canonical, link, and asset-budget checks are automated or measured and recorded.
- Product Design and Creative Production review findings are applied or explicitly deferred with evidence.
- Vercel previews are verified after push and match local proof.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Checkpoints for pass-5 archive/story taxonomy, docs CTA/TOC/command proof, homepage/first-success proof, docs IA/reference proof, a11y/perf proof, Product Design/Creative Production proof, Browser/Chrome proof, Vercel proof, and final closeout exist.
- Completion evidence is recorded in the goal and `goal next goal-35 --json` returns no actionable node without warnings.

# Stop Conditions

- Any action would require DNS, production promotion, npm publish, tag, analytics activation, GitHub settings mutation, or public launch.
- Browser, Chrome, Vercel, Product Design, or Creative Production access is unavailable in a way that prevents required proof.
- Required local gates fail and cannot be fixed within this goal boundary.
- A secret, token, raw provider payload, or unrelated raw prompt would need to be stored in mdkg, public docs, screenshots, or handoffs.

# Current State

Pass-4 is complete and pushed. The pass-5 audit says the product direction is improving but still needs launch-ready polish around preview docs URLs, Starlight TOC duplication, command accuracy, copy-paste ergonomics, first-success paths, homepage conversion copy, docs IA, `llms.txt` formatting, accessibility/performance measurement, and Vercel preview evidence.

# Context Package

Non-actionable context is intentionally kept in `context_refs`, not `scope_refs`, so routing stays focused on executable work.

- Prior goals: `goal-30`, `goal-32`, `goal-33`, `goal-34`.
- Product/design context: `prd-6` through `prd-10`, `edd-34` through `edd-53`, `dec-37` through `dec-49`.
- Evidence: `chk-239`, `archive://archive.mdkg-dev-preview-audit-pass-5-2026-06-24`.

# Iteration Log

- 2026-06-24: Goal created from archived pass-5 preview audit. Initial active node is `task-549`; after graph-only creation closeout, `task-550` is the next implementation node.

# Skill Improvement Candidates

- If the Browser/Chrome/Vercel/Product Design/Creative Production validation sequence proves reusable, capture it as a future mdkg skill candidate.

# Completion Evidence

- Pending.

# Required Checkpoints

- Pass-5 archive, boundary, and story taxonomy.
- Docs CTA, TOC, command validation, and copy-paste proof.
- Homepage copy, thesis, metadata, and first-success proof.
- Docs IA, troubleshooting, examples, roadmap/changelog/reference proof.
- Accessibility, responsiveness, performance, noindex/canonical, and asset-budget proof.
- Product Design and Creative Production review proof.
- Local Browser/Chrome desktop/tablet/mobile proof.
- Logical commits, push, Vercel deployment/log/preview proof.
- Final closeout confirming no DNS, production promotion, npm publish, tag, analytics activation, GitHub settings mutation, or public-launch announcement.
