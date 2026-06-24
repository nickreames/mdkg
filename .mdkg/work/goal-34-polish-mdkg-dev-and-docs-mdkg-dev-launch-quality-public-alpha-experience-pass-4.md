---
id: goal-34
type: goal
title: Polish mdkg.dev and docs.mdkg.dev launch-quality public-alpha experience pass 4
status: progress
priority: 1
goal_state: active
goal_condition: Goal 34 is achieved when mdkg.dev and docs.mdkg.dev implement the pass-4 preview audit, local Browser/Chrome/Product Design/Creative Production QA passes, local gates pass, logical commits are pushed to origin/main, Vercel previews for mdkg-dev and mdkg-docs are verified live, and no launch side effects occur.
scope_refs: [epic-172, epic-173, epic-174, epic-175, epic-176, epic-177, epic-178, epic-179, epic-180, spike-19, task-534, task-535, task-536, task-537, task-538, task-539, task-540, task-541, task-542, task-543, task-544, task-545, task-546, task-547, task-548, test-258, test-259, test-260, test-261, test-262, test-263, test-264, test-265, test-266, test-267, test-268]
active_node: task-535
required_skills: [select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [git status --short --branch, npm --prefix mdkg-dev run build, npm --prefix docs run build, npm run docs:check, npm run docs:check-commands, npm run smoke:mdkg-dev, npm run smoke:mdkg-dev-docs, npm run smoke:mdkg-dev-seo, npm run smoke:demo-graph, npm run smoke:mdkg-dev-polish-pass3, npm run smoke:mdkg-dev-polish-pass4, npm run smoke:mdkg-dev-a11y, npm run smoke:mdkg-dev-perf, npm run build, npm run test, npm run cli:check, npm run cli:contract, node dist/cli.js validate --summary --json --limit 20, node dist/cli.js doctor --strict --json, Browser and Chrome local E2E at desktop tablet and mobile widths, Product Design screenshot-backed audit checkpoint, Creative Production visual direction checkpoint, Vercel deployment and log verification for mdkg-dev and mdkg-docs, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [mdkg-dev, public-alpha, launch-quality, product-design, creative-production, vercel-preview]
owners: []
links: [https://mdkg-dev.vercel.app/, https://mdkg-docs.vercel.app/]
artifacts: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24]
relates: []
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-06-24
updated: 2026-06-24
---
# Objective

Raise mdkg.dev and docs.mdkg.dev from credible public alpha to launch-quality preview by implementing the latest pass-4 audit: sharper first-run DX, validated public commands, deterministic demo proof, cleaner Starlight docs, stronger homepage copy, measured accessibility/performance gates, and evidence-backed preview validation.

# End Condition

The goal is done only after all scoped tasks/tests are complete, required checkpoints exist, local gates pass, `main` is pushed to `origin/main`, Vercel previews for `mdkg-dev` and `mdkg-docs` are live and verified, and closeout explicitly confirms no DNS change, production promotion, npm publish, tag, analytics activation, GitHub settings mutation, or public-launch announcement occurred.

# Non-Goals

- No DNS cutover or production-domain indexing changes.
- No production promotion, analytics activation, public launch announcement, npm publish, or git tag.
- No GitHub repository settings mutation.
- No generated image/video asset requirement unless a later explicit task rescope approves it.
- No broad website rewrite outside the pass-4 audit scope.

# Recursive Algorithm

1. Inspect the current goal state, relevant graph nodes, and required skills.
2. Execute one scoped task/test at a time in the order implied by `task-535` through `task-548`.
3. Keep source edits incremental and checkpoint evidence at each required milestone.
4. Run local build/docs/smoke gates before Browser/Chrome/Product Design/Creative Production review.
5. Push only after local gates pass, then verify Vercel deployments/logs and hosted preview behavior.
6. Re-evaluate the end condition and continue, pause, or close.

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
- `npm run smoke:mdkg-dev-polish-pass3`
- `npm run smoke:mdkg-dev-polish-pass4`
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
- Creative Production visual direction checkpoint.
- Vercel deployment/log verification for `mdkg-dev` and `mdkg-docs`.
- `git diff --check`

# Acceptance Criteria

- `llms.txt` and `llms-full.txt` are readable plain text with preserved line breaks and a canonical agent path.
- Public docs have no duplicated Starlight TOC output, no confusing heading outlines, and no maintainer-scaffold language in beginner paths.
- Public command examples are validated or explicitly marked illustrative; beginner examples use canonical copy-safe forms.
- Homepage is shorter, clearer, and centered on the article thesis: larger context is not project memory.
- A deterministic demo/first-success path exists with expected outputs and stable validation.
- Repository layout, command-boundary, frontmatter, common-mistake, generated reference, and roadmap pages are user-facing and responsive.
- Accessibility, reduced-motion, high-contrast, mobile, and performance budgets are measured and recorded.
- Browser, Chrome, Product Design, Creative Production, and Vercel proof is recorded in checkpoints.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Checkpoints `chk-234` through `chk-243` exist with command evidence, affected routes/docs, warnings, screenshots or receipt refs where useful, and explicit no-secret/no-launch boundary confirmation.
- Completion evidence is recorded in the goal and `goal next goal-34 --json` returns no actionable node without warnings.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Browser, Chrome, Vercel, Product Design, or Creative Production access fails in a way that prevents required proof.
- A required check fails and cannot be fixed within the goal boundary.
- The work would require DNS, production promotion, analytics activation, npm publish, git tag, GitHub settings mutation, or public launch.

# Current State

Pass-3 is complete and pushed. The pass-4 feedback rates the previews around 7.3/10 and identifies remaining launch-quality gaps: broken `llms.txt` formatting, duplicated docs TOC output, unvalidated public commands, homepage density, missing deterministic demo path, cramped docs tables, maintainer-facing reference surfaces, and missing measured a11y/performance gates.

# Context Package

Non-actionable context is intentionally recorded here and on child nodes, not in goal-level `scope_refs`, so `mdkg goal next` and `mdkg pack goal-34` stay focused on executable work.

- Prior goals: `goal-30`, `goal-32`, `goal-33`
- Product/design: `prd-6`, `prd-7`, `prd-8`, `prd-9`, `edd-34` through `edd-47`, `dec-37` through `dec-45`
- Evidence: `chk-233`, `archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24`

# Iteration Log

- 2026-06-24: Goal created from archived pass-4 preview audit. Initial active node is `task-534`; after mdkg-only creation closeout, `task-535` becomes the next implementation node.
- 2026-06-24: Creation pass closed. Archive verified, graph indexed/validated, strict doctor passed with only expected local DB runtime warning, `test-258` and `task-534` marked done, and `task-535` claimed for the future implementation pass.

# Skill Improvement Candidates

- Capture any repeatable Browser/Chrome/Vercel/Product Design/Creative Production launch-QA workflow as a future mdkg skill candidate if it proves reusable.

# Completion Evidence

- Creation/distillation pass complete. Functional implementation remains pending, starting at `task-535`.

# Required Checkpoints

- `chk-234`: pass-4 archive, boundary, story map.
- `chk-235`: `llms.txt`, TOC, and command-example validation proof.
- `chk-236`: homepage narrative, CTA, and before/after proof.
- `chk-237`: docs IA, repository layout, reference hierarchy, and common-mistakes proof.
- `chk-238`: deterministic demo and first-success path proof.
- `chk-239`: generated CLI reference and docs quality automation proof.
- `chk-240`: measured a11y/performance and Product Design/Creative Production proof.
- `chk-241`: local Browser/Chrome desktop/tablet/mobile proof.
- `chk-242`: logical commits, push, Vercel deployment/log/preview proof.
- `chk-243`: final goal-34 closeout with launch side effects explicitly deferred.
