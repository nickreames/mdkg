---
id: prd-8
type: prd
title: mdkg.dev pass 3 public-alpha trust copy and docs polish requirements
tags: [mdkg-dev, public-alpha, polish, pass-3, product]
owners: []
links: [https://mdkg-dev.vercel.app/, https://mdkg-docs.vercel.app/]
artifacts: [pasted-text.txt]
relates: []
refs: [archive://archive.mdkg-dev-polish-pass-3-2026-06-24]
aliases: [mdkg-dev-pass-3-prd]
created: 2026-06-24
updated: 2026-06-24
---
# Problem

The mdkg.dev and docs.mdkg.dev previews are close to public-alpha quality, but pass-3 feedback identifies trust-breaking rough edges: command examples need CLI validation, public pages still contain some scaffold/meta commentary, docs navigation can feel noisy, `llms.txt` needs preserved formatting, and public roadmap/reference pages need to speak to users before maintainers.

# Goals

- Make mdkg.dev a concise, high-trust landing page for `Git-native project memory for AI coding agents`.
- Make docs.mdkg.dev read like professional developer documentation instead of launch scaffolding.
- Keep `Plan -> Work -> Evidence` as the single public operating model.
- Verify all public command examples against the current CLI contract.
- Preserve local-first, low-dependency, low-hype, pre-v1 public-alpha positioning.
- Validate Browser, Chrome, and Vercel preview behavior before closeout.

# Non-Goals

- DNS cutover, production promotion, analytics activation, public launch announcement, npm publish, git tag, or GitHub settings mutation.
- Adding broad new product surface area.
- Claiming hosted queues, worker execution, public event/reducer/lease/materializer CLI, or comprehensive secret scanning.
- Turning internal evidence pages into public marketing.

# Requirements

## P0

- Public command examples are copy-pasteable, canonical, readable, and checked against CLI help or generated command contract.
- Public meta/scaffold commentary is removed from home/docs/reference/roadmap surfaces.
- `/docs` on mdkg.dev becomes a clean docs bridge or redirect with external-link behavior.
- `llms.txt` renders as plain text with preserved headings, bullets, and line breaks.
- Claims Evidence Matrix is removed from public docs navigation or noindexed if still reachable.
- Starlight sidebar and table-of-contents behavior are intentional and not duplicated/noisy.
- External links open in new tabs with `rel="noopener noreferrer"`.

## P1

- Homepage distinguishes first-run setup from ongoing Plan -> Work -> Evidence usage.
- Homepage hero, low-dependency card, work-node summary, advanced-alpha section, and operating model visual are tightened.
- Docs homepage, Work Node Types, Reference Types, Repository Layout, Agent Workflow, and Packs/Handoffs are expanded with user-first guidance.
- CLI Reference starts with command selection; Command Contract is maintainer/integration-facing.
- Public Roadmap is product-oriented and excludes deployment chores.

## P2 / P3

- Version/changelog badge is added only if metadata is clean.
- Preview noindex and production canonical behavior are environment-driven and documented.
- Sitemap, robots, social metadata, and OG behavior are validated.
- Vercel Analytics remains production-only and deferred.
- README, package metadata, npm/site/docs wording, and GitHub metadata handoff stay aligned.
- Deterministic demo graph and terminal demo script are captured as follow-up docs/nodes without claiming unfinished demos as proof.

# Acceptance Criteria

- mdkg.dev feels like a concise public product page.
- docs.mdkg.dev feels like professional developer docs.
- No public page reads like internal launch planning.
- Public docs nav is consistent and user-oriented.
- Command examples are verified and preserved as multi-line code blocks.
- Preview deployments remain noindex.
- Final evidence includes files changed, routes changed, validation commands, known blockers, and next steps.

# Risks

- Over-polishing copy could weaken the precise public-alpha boundary.
- Command examples can drift unless pass-3 smoke coverage catches them.
- Preview/production canonical logic can confuse crawlers if environment handling is not explicit.
- Vercel and GitHub settings are external side effects and must remain handoff-only unless separately approved.

# Metrics / Success

# Open Questions
