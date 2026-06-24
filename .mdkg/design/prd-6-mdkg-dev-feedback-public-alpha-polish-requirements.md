---
id: prd-6
type: prd
title: mdkg.dev feedback public-alpha polish requirements
tags: [mdkg-dev, feedback, public-alpha, polish, launch]
owners: []
links: [https://mdkg-dev.vercel.app/, https://mdkg-docs.vercel.app/]
artifacts: [mdkg_dev_feedback, mdkg_dev_feedback_user_stories.zip]
relates: []
refs: [archive://archive.mdkg-dev-feedback-user-stories-2026-06-23]
aliases: [mdkg-dev-feedback-prd]
created: 2026-06-23
updated: 2026-06-23
---
# Problem

The first mdkg.dev Vercel previews are live and valuable, but the feedback crawl found launch-blocking public-alpha issues: first-run command formatting, `llms.txt` placeholders, internal planning language, trust/claims scaffolds, docs depth, preview-vs-production links, mobile polish, SEO, and quality gates.

# Goals

- Make the first five minutes credible: install, init, index, status, validate, pack, and handoff examples must be readable and consistent.
- Preserve the simple positioning: git-native project memory for AI-native software engineering.
- Keep public claims honest and evidence-backed.
- Make Starlight docs useful enough for public-alpha users.
- Add validation gates so Browser, Product Design, SEO, link, no-secret, docs, and preview checks catch regressions before traffic is sent to the site.

# Story Taxonomy

## P0 launch blockers

`US-001` through `US-014` are required before real launch/article/conference traffic. They cover first-run UX, `llms.txt`, public copy cleanup, semantic-ref clarity, docs bridge behavior, GitHub/feedback CTAs, claims matrix, trust posture, preview indexing, metadata/social cards, sitemap/robots, accessibility/performance gates, and design system enforcement.

## Core P1 public-alpha readiness

Goal 30 includes the P1 stories that materially improve first-run confidence and launch quality: architecture/product visuals, bigger-context thesis, five-minute conversion block, install/quickstart depth, repository layout, glossary, agent goal workflow, spike guide, handoff guide, generated reference/changelog/roadmap depth, queue safety copy, troubleshooting, screenshots, audience copy, docs homepage and summaries, read-only/mutating labels, README/docs parity, link checks, OG assets, footer, section CTAs, before/after comparison, output snippets, Markdown/frontmatter explanation, what-mdkg-is-not block, mobile polish, launch checklist, and small-repo safety note.

## Deferred

P2 stories remain valuable follow-ups: advanced alpha page expansion, copy-to-clipboard, analytics plan/activation, wordmark/logo treatment, page-specific docs redirects, search indexing, image/diagram backlog, npm package-page polish, feedback-wanted section, and first article landing-path alignment.

# Requirements

- Public examples must avoid raw `<id>` placeholders that render incorrectly; use durable placeholders like `WORK_ID`.
- Public copy must not claim hosted execution, hosted memory, production runtime maturity, comprehensive secret scanning, broad MCP mutation, arbitrary SQL, or universal agent compatibility.
- Preview URLs must be treated as review surfaces; canonical production domains remain future launch work.
- Product and docs pages must use consistent definitions for `scope_refs`, `context_refs`, and `evidence_refs`.
- Claims matrix rows must include page, claim, evidence, shipped status, and caveat/safe wording.
- Browser/Product Design QA must cover desktop and mobile before push.

# Acceptance Criteria

- Goal 30 has complete scope for P0 plus core P1 implementation and validation.
- P2 items are explicitly deferred.
- Launch side effects remain blocked unless a later explicit goal authorizes them.

# Risks

- Trying to complete all 60 stories at once would blur the launch boundary and risk hiding regressions.
- Over-polishing visual identity before copy/trust correctness could waste time.
- Preview links may accidentally imply custom domains are live before DNS is configured.

# Open Questions

- Which P2 items should become the next polish goal after Goal 30 closes?

# Non-goals

# Metrics / Success
