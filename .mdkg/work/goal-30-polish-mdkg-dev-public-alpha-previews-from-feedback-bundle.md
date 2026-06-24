---
id: goal-30
type: goal
title: Polish mdkg.dev public-alpha previews from feedback bundle
status: progress
priority: 1
goal_state: active
goal_condition: Goal 30 is achieved when mdkg.dev and Starlight docs implement all P0 plus core P1 feedback stories, local Browser/Product Design QA passes, required smokes pass, logical commits are pushed to origin/main, existing Vercel previews redeploy successfully, and no DNS, production promotion, npm publish, analytics activation, git tag, or public launch occurs.
scope_refs: [epic-147, epic-148, epic-149, epic-150, epic-151, epic-152, task-489, task-490, task-491, task-492, task-493, task-494, task-495, task-496, task-497, task-498, test-228, test-229, test-230, test-231, test-232, test-233, test-234]
active_node: task-497
required_skills: [select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [git status --short --branch, npm --prefix mdkg-dev run build, npm --prefix docs run build, npm run docs:check, npm run smoke:mdkg-dev, npm run smoke:mdkg-dev-docs, npm run smoke:mdkg-dev-seo, npm run smoke:demo-graph, npm run build, npm run test, npm run cli:check, npm run cli:contract, node dist/cli.js validate --summary --json --limit 20, node dist/cli.js doctor --strict --json, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [mdkg-dev, public-alpha, polish, browser, product-design, vercel-preview]
owners: []
links: [https://mdkg-dev.vercel.app/, https://mdkg-docs.vercel.app/]
artifacts: [mdkg_dev_feedback, mdkg_dev_feedback_user_stories.zip]
relates: []
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-feedback-user-stories-2026-06-23]
context_refs: []
evidence_refs: []
aliases: [mdkg-dev-feedback-polish]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-06-23
updated: 2026-06-23
---
# Objective

Implement the public-alpha polish pass from `mdkg_dev_feedback/`: fix launch-blocking product/docs issues, deepen the golden path, prove trust/claims/SEO quality, validate in Browser and Product Design review, push `main`, and verify the existing Vercel preview redeploys.

# End Condition

All in-scope feedback is implemented and validated:

- All P0 stories `US-001` through `US-014`.
- Core P1 stories: `US-015`, `US-016`, `US-017`, `US-018`, `US-019`, `US-020`, `US-021`, `US-022`, `US-023`, `US-024`, `US-026`, `US-027`, `US-028`, `US-030`, `US-031`, `US-033`, `US-034`, `US-036`, `US-037`, `US-038`, `US-039`, `US-040`, `US-042`, `US-043`, `US-045`, `US-046`, `US-047`, `US-049`, `US-050`, `US-052`, `US-055`, and `US-058`.
- `US-056` is limited to repo-file updates and a GitHub metadata handoff; do not mutate GitHub settings without explicit later approval.
- P2 stories are captured as deferred nodes or closeout follow-ups, not silently dropped.

# Non-Goals

- No DNS change for `mdkg.dev`, `www.mdkg.dev`, or `docs.mdkg.dev`.
- No Vercel production promotion, custom-domain binding, analytics activation, npm publish, git tag, public launch announcement, or GitHub repository settings mutation.
- No storage of Vercel/GitHub secrets, cookies, tokens, DNS credentials, raw prompts, raw provider payloads, or private graph dumps in mdkg.

# Execution Phases

1. Lock implementation boundary and Product Design brief.
2. Fix product-site P0 copy, quickstart, docs bridge, CTAs, trust/alpha pages, and `llms.txt`.
3. Deepen Starlight docs for install, quickstart, repository layout, glossary, agent workflow, spikes, handoffs, changelog, roadmap, command reference, and queues.
4. Build the claims matrix and trust/SEO/no-secret guardrails.
5. Apply restrained OSS design polish, architecture/product visuals, mobile polish, code-block readability, footer, and CTAs.
6. Add or update smokes for site/docs parity, launch readiness, no-secret scanning, links, metadata, and README/docs parity.
7. Run Browser and Product Design QA locally at desktop `1440x900` and mobile `390x844`.
8. Commit logically, push `main` to `origin/main`, and verify existing Vercel projects redeploy.
9. Record preview URLs, deployment IDs, route evidence, screenshots/receipts, and deferred launch notes.

# Browser And Product Design Contract

Use Product Design brief playback with this default brief: mdkg.dev is a restrained OSS developer-tool site using white/zinc surfaces, blue/sky/teal accents, clear CLI/product proof, and no generic AI hype.

Since Product Design saved context is currently missing, use `mdkg-dev/DESIGN.md`, `edd-28`, `edd-29`, `edd-30`, the feedback bundle, and current preview pages as the visual/product source.

Browser validation must cover local and hosted routes for homepage, quickstart, trust, docs bridge, docs homepage, install, quickstart docs, claims matrix, roadmap, and one mobile flow.

# Required Checks

- `git status --short --branch`
- `npm --prefix mdkg-dev run build`
- `npm --prefix docs run build`
- `npm run docs:check`
- `npm run smoke:mdkg-dev`
- `npm run smoke:mdkg-dev-docs`
- `npm run smoke:mdkg-dev-seo`
- `npm run smoke:demo-graph`
- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `node dist/cli.js validate --summary --json --limit 20`
- `node dist/cli.js doctor --strict --json`
- `git diff --check`

# Push And Preview Proof

Commit logically before push, likely:

- `feat: polish mdkg dev public-alpha product pages`
- `docs: deepen Starlight golden path and trust docs`
- `test: add mdkg dev launch polish gates`
- `graph: close mdkg dev feedback polish evidence`

Push only `main` to `origin/main`, without force. Verify the existing Vercel projects redeploy:

- `mdkg-dev` for `mdkg-dev/`
- `mdkg-docs` for `docs/`

# Current State

Paused until explicitly activated after Goal 29 closes. Existing previews are live, but this goal is not complete until fresh implementation, push, redeploy, and validation proof exist.

# Context Inventory

These records inform Goal 30 but intentionally stay in body text instead of traversal-sensitive frontmatter so `goal next goal-30` routes cleanly:

- `goal-25`
- `goal-28`
- `goal-29`
- `prd-6`
- `edd-28`
- `edd-29`
- `edd-30`
- `edd-34`
- `edd-35`
- `dec-36`
- `archive://archive.mdkg-dev-feedback-user-stories-2026-06-23`

# Completion Evidence

Pending future implementation.
