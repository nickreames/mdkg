---
id: task-489
type: task
title: lock implementation boundary Product Design brief and story map
status: done
priority: 1
tags: [mdkg-dev, implementation-boundary, product-design]
owners: []
links: []
artifacts: []
relates: [goal-30]
blocked_by: []
blocks: [task-490]
refs: [archive://archive.mdkg-dev-feedback-user-stories-2026-06-23]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Start Goal 30 by re-grounding the feedback bundle, current preview state, Product Design brief, Browser scope, and launch-side-effect boundaries.

# Acceptance Criteria

- Current repo, selected-goal, and preview state are inspected.
- Product Design brief is played back and uses `mdkg-dev/DESIGN.md`, `edd-28`, `edd-29`, `edd-30`, and feedback evidence as source context.
- The implementation story map confirms P0 plus core P1 in scope and P2 deferred.
- DNS, production promotion, analytics activation, npm publish, git tag, and GitHub settings mutation are explicitly out of scope.

# Locked Product Design Brief

mdkg.dev is a restrained OSS developer-tool product site and Starlight docs experience. It should feel like serious local-first developer infrastructure: white and zinc surfaces, blue/sky/teal accents, readable command examples, explicit trust boundaries, and concrete CLI proof. It should not look like generic AI marketing, a decorative SaaS dashboard, or an autonomous-agent hype page.

Primary visual sources:

- `mdkg-dev/DESIGN.md`
- `edd-28`
- `edd-29`
- `edd-30`
- `prd-6`
- `mdkg_dev_feedback/`

Interactivity level for this goal: static-first. Interactive behavior is allowed only where it materially improves the public-alpha experience or validation, such as Starlight docs navigation/search, future copy buttons, or existing browser-native links. Do not add third-party analytics, client-heavy animation, or external scripts in this goal.

# Implementation Boundary

In scope for Goal 30:

- Product site copy, routes, metadata, noindex/sitemap/robots, trust pages, CTAs, footer, design-system polish, and docs bridge copy under `mdkg-dev/`.
- Starlight docs depth, generated/reference docs, install/quickstart, glossary, agent workflow, spike, handoff, queue, roadmap, changelog, troubleshooting, claims matrix, and launch-readiness docs under `docs/`.
- Local smokes for site/docs/SEO/demo-graph, Browser and Product Design QA, logical local commits, push to `origin/main`, and verification that existing Vercel preview projects redeploy.

Out of scope for Goal 30:

- DNS cutover or custom-domain production launch.
- Vercel production promotion.
- npm publish.
- git tag.
- analytics activation.
- GitHub settings mutation; `US-056` is limited to repo-file changes plus a handoff recommendation.
- Storing Vercel/GitHub secrets, raw prompts, raw provider payloads, or private graph dumps in mdkg, site, docs, fixtures, or screenshots.

# Story Map

## Task 490: product-site P0 copy and conversion polish

Stories: `US-001` through `US-014`, plus `US-015`, `US-016`, `US-017`, `US-034`, `US-043`, `US-045`, `US-046`, `US-049`, `US-050`, `US-052`, and `US-058`.

Deliverables:

- replace raw `<id>` placeholders with durable placeholders such as `NODE_ID`, `TASK_ID`, `GOAL_ID`, or real example ids.
- remove internal planning language from public pages.
- make docs bridge preview-safe and Starlight-aware.
- add GitHub/star/feedback CTAs.
- expand trust page and claims matrix.
- add architecture/product visual, audience section, five-minute conversion block, before/after comparison, what-mdkg-is-not block, and mobile/code readability improvements.

## Task 491: Starlight docs golden path and launch reference depth

Stories: `US-018`, `US-019`, `US-020`, `US-021`, `US-022`, `US-023`, `US-024`, `US-026`, `US-027`, `US-028`, `US-030`, `US-031`, `US-036`, `US-037`, `US-038`, `US-047`, and `US-055`.

Deliverables:

- install and quickstart become complete golden paths.
- repository layout renders cleanly and states what to commit.
- add glossary, agent-goal workflow, spike guide, handoff guide, queue safety copy, troubleshooting, changelog summary, Now/Next/Later roadmap, launch checklist, and example output snippets.
- generated command reference remains generated; do not manually duplicate the full CLI surface.

## Task 492: claims, trust, and boundary wording

Stories: `US-008`, `US-009`, `US-010`, `US-030`, `US-038`, `US-049`, `US-050`, and `US-058`.

Deliverables:

- real claims matrix with page, claim, evidence, shipped status, and caveat/safe wording.
- no unsupported claims around hosted memory, worker execution, hosted queues, arbitrary SQL, comprehensive secret scanning, universal agent compatibility, or production maturity.

## Task 493: visual and responsive polish

Stories: `US-014`, `US-015`, `US-033`, `US-042`, `US-043`, `US-045`, and `US-052`.

Deliverables:

- apply the restrained OSS design system.
- add maintainable product/architecture visuals and social-card baseline.
- verify desktop and mobile layouts, code blocks, focus states, and footer/CTA polish.

## Task 494: SEO, metadata, links, sitemap, robots, and noindex

Stories: `US-010`, `US-011`, `US-012`, `US-040`, `US-042`, and `US-056`.

Deliverables:

- page metadata and social metadata.
- sitemap/robots and preview noindex behavior.
- link checks and GitHub metadata handoff, without mutating GitHub settings.

## Task 495: automation and parity gates

Stories: `US-013`, `US-039`, `US-040`, and cross-cutting no-secret/link/metadata requirements.

Deliverables:

- update or add smokes for mdkg.dev, docs, SEO, launch readiness, no-secret checks, link checks, and README/docs/site parity.

## Task 496 through task 498: proof, commits, push, and preview verification

Stories: `US-033`, `US-052`, and `US-055` plus Goal 30 closeout requirements.

Deliverables:

- Browser local and hosted QA at desktop and mobile.
- Product Design QA using the locked brief.
- logical commits and push to `origin/main`.
- existing Vercel preview redeploy proof for `mdkg-dev` and `mdkg-docs`.

# Deferred Story Bucket

Deferred P2 stories: `US-029`, `US-032`, `US-041`, `US-044`, `US-051`, `US-053`, `US-054`, `US-057`, `US-059`, and `US-060`.

Also deferred unless explicitly approved later:

- DNS/custom domain cutover.
- production promotion.
- analytics activation.
- public launch announcement.
- npm publish.
- git tag.
- GitHub settings mutation.

# Initial Current-State Findings

- `mdkg-dev/src/pages/index.astro`, `quickstart.astro`, and `llms*.txt` still show raw `<id>` placeholders that should become durable placeholders or concrete examples.
- `mdkg-dev/src/pages/docs.astro` links directly to future `https://docs.mdkg.dev`; during preview, this needs copy or links that do not imply DNS is live unless the hosted docs preview is the target.
- `mdkg-dev/src/pages/trust.astro` and `mdkg-dev/CLAIMS.md` are structurally useful but too thin for public-alpha trust review.
- Starlight docs exist, but install/quickstart, claims, roadmap, command reference entry points, workflow guides, and troubleshooting need enough depth that public-alpha users can follow them without chat context.
- Existing root scripts already expose `smoke:mdkg-dev`, `smoke:mdkg-dev-docs`, `smoke:mdkg-dev-seo`, and `smoke:demo-graph`; these are the first automation surfaces to strengthen instead of inventing a separate gate family.

# Test Plan

- `node dist/cli.js goal show goal-30 --json`
- `node dist/cli.js pack task-489 --pack-profile concise`
- `node dist/cli.js goal next goal-30 --json`
- `node dist/cli.js validate --summary --json --limit 20`

# Files Affected

- `.mdkg/work/task-489-lock-implementation-boundary-product-design-brief-and-story-map.md`

# Implementation Notes

- `goal-30` was activated and `task-489` claimed on 2026-06-23.
- Product Design brief is locked from existing project design records and the feedback bundle; no additional user questions are needed before implementation.
- This task intentionally does not edit site/docs source beyond establishing the durable execution boundary. Functional edits begin with `task-490`.

# Links / Artifacts

- `archive://archive.mdkg-dev-feedback-user-stories-2026-06-23`
- `prd-6`
- `edd-28`
- `edd-29`
- `edd-30`
- `edd-34`
- `edd-35`
- `dec-36`
- `.mdkg/pack/pack_concise_task-489_20260623-183727189.md`
