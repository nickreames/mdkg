---
id: goal-32
type: goal
title: Polish mdkg.dev and docs.mdkg.dev public-alpha experience pass 2
status: progress
priority: 1
goal_state: active
goal_condition: Goal 32 is achieved when mdkg.dev and docs.mdkg.dev implement all P0, P1, P2, and P3 pass-2 feedback stories, local Browser/Chrome/Product Design QA passes, required smokes pass, logical commits are pushed to origin/main, Vercel previews redeploy successfully, and no DNS, production promotion, npm publish, analytics activation, git tag, or public launch occurs.
scope_refs: [epic-157, epic-158, epic-159, epic-160, epic-161, epic-162, epic-163, epic-164, task-507, task-508, task-509, task-510, task-511, task-512, task-513, task-514, task-515, task-516, task-517, task-518, test-239, test-240, test-241, test-242, test-243, test-244, test-245, test-246, test-247]
active_node: task-516
required_skills: [select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [git status --short --branch, npm --prefix mdkg-dev run build, npm --prefix docs run build, npm run docs:check, npm run smoke:mdkg-dev, npm run smoke:mdkg-dev-docs, npm run smoke:mdkg-dev-seo, npm run smoke:demo-graph, npm run smoke:mdkg-dev-polish-pass2, npm run build, npm run test, npm run cli:check, npm run cli:contract, node dist/cli.js validate --summary --json --limit 20, node dist/cli.js doctor --strict --json, git diff --check]
max_iterations: 30
blocked_after_attempts: 3
tags: [mdkg-dev, public-alpha, preview-polish, product-design, vercel-preview]
owners: []
links: [https://mdkg-dev.vercel.app/, https://mdkg-docs.vercel.app/]
artifacts: [mdkg_preview_polish_pass2, mdkg_preview_polish_pass2_docs.zip]
relates: []
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24]
context_refs: []
evidence_refs: []
aliases: [mdkg-dev-pass-2-implementation]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-06-23
updated: 2026-06-23
---
# Objective

Implement the second public-alpha polish pass from `mdkg_preview_polish_pass2/`: sharpen product positioning, remove public implementation-meta language, deepen the Starlight docs, validate with Browser/Chrome/Product Design, push `main`, and verify existing Vercel previews.

# End Condition

All pass-2 stories are implemented and validated:

- P0 stories `P0-001` through `P0-009`.
- P1 stories `P1-010` through `P1-026`.
- P2 stories `P2-027` through `P2-035`.
- P3 stories `P3-036` through `P3-040`.
- Local checks and Browser/Chrome/Product Design QA pass.
- Logical commits are pushed to `origin/main` without force.
- Existing Vercel projects `mdkg-dev` and `mdkg-docs` redeploy from the pushed commit and hosted preview routes validate.
- DNS, production promotion, npm publish, analytics activation, git tag, and public launch do not occur.

# Required Implementation Decisions

- Delete the marketing `/docs` bridge page now. A future redirect to `docs.mdkg.dev` is a separate launch/cutover task.
- Make `docs.mdkg.dev` the canonical docs concept, but do not change DNS in this goal.
- Use "Git-native project memory for AI coding agents" as the primary public framing.
- Replace "golden loop" with "Plan -> Work -> Evidence" across public copy.
- Implement the Plan -> Work -> Evidence diagram in CSS/HTML first.
- Create lower-priority follow-up nodes for generated visual/image assets after copy stabilizes.
- Rewrite `llms.txt` and `llms-full.txt` manually once during this pass.
- Update README and npm/package metadata copy, but do not publish npm.
- Apply noindex to preview URLs only, not future production.
- Store Product Design review evidence in mdkg checkpoints only for this pass.
- Move Claims Evidence Matrix out of public navigation; if retained as a file, it must be internal/noindex and not presented as user docs.

# Execution Phases

1. Lock the story map, Product Design brief, and no-launch boundary.
2. Fix P0 trust breakers: command blocks, `llms.txt`, wordmark/nav, `/docs`, scaffold/meta copy, claims matrix exposure, renderer mentions, and preview noindex policy.
3. Rewrite public positioning around AI coding agents, Plan -> Work -> Evidence, work node types, local-first posture, and low-dependency trust.
4. Rewrite Starlight IA and core docs for install, quickstart, concepts, repository layout, node types, reference types, roadmap, trust, and alpha contract.
5. Implement all P2 polish, including SEO/social review, copy consistency, analytics/CTA plan without activation, footer links, supply-chain install guidance, external link accessibility, and responsive/code-block checks.
6. Implement P3 docs expansion: generated CLI reference plan/output, demo repo docs, read-only MCP guide, and subgraphs/bundles/graph movement docs.
7. Add pass-2 smokes and launch-quality assertions.
8. Run Browser and Chrome locally at desktop, mobile, and tablet-ish widths; record Product Design checkpoint review.
9. Run full local gates, commit logically, push `main`, verify Vercel deployments/logs/previews, and close with no-launch evidence.

# Required Checks

- `git status --short --branch`
- `npm --prefix mdkg-dev run build`
- `npm --prefix docs run build`
- `npm run docs:check`
- `npm run smoke:mdkg-dev`
- `npm run smoke:mdkg-dev-docs`
- `npm run smoke:mdkg-dev-seo`
- `npm run smoke:demo-graph`
- `npm run smoke:mdkg-dev-polish-pass2`
- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `node dist/cli.js validate --summary --json --limit 20`
- `node dist/cli.js doctor --strict --json`
- Browser/Chrome local E2E for marketing and docs routes.
- Vercel deployment/log/preview validation after push.
- `git diff --check`

# Checkpoint Requirements

Goal 32 cannot close unless checkpoints exist for:

- Boundary and story-map lock.
- P0 remediation proof.
- Public positioning and copy proof.
- Docs IA and content proof.
- Trust, SEO, noindex, metadata, and link proof.
- Product Design responsive/accessibility review.
- Local Browser/Chrome E2E proof.
- Push and Vercel preview proof.
- Final closeout with deferred launch side effects explicitly confirmed.

# Push And Preview Proof

Commit logically before push, likely:

- `feat: sharpen mdkg dev public positioning and command UX`
- `docs: rewrite Starlight public-alpha docs experience`
- `docs: add advanced alpha guides for cli mcp demos and graph movement`
- `test: add mdkg dev pass 2 polish gates`
- `graph: close mdkg dev pass 2 evidence`

Push only `main` to `origin/main`, without force. Verify existing Vercel projects:

- `mdkg-dev`
- `mdkg-docs`

# Stop Conditions

Stop before DNS changes, Vercel production promotion, custom-domain binding, npm publish, git tag, analytics activation, GitHub settings mutation, or public launch announcement.

# Current State

Paused until explicitly activated. Goal 31 creates this implementation contract but does not execute it.

# Context Inventory

These records inform Goal 32 but stay out of traversal-sensitive frontmatter so `goal next goal-32` routes cleanly:

- `goal-30`
- `goal-31`
- `prd-7`
- `edd-36`
- `edd-37`
- `edd-38`
- `dec-37`
- `dec-38`
- `prd-6`
- `edd-34`
- `edd-35`
- `dec-36`

# Completion Evidence

- Pending.
