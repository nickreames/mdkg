---
id: edd-34
type: edd
title: mdkg.dev feedback-driven product docs and SEO polish architecture
tags: [mdkg-dev, docs, seo, public-alpha, feedback]
owners: []
links: [https://mdkg-dev.vercel.app/, https://mdkg-docs.vercel.app/]
artifacts: [mdkg_dev_feedback]
relates: []
refs: [archive://archive.mdkg-dev-feedback-user-stories-2026-06-23]
aliases: [mdkg-dev-feedback-polish-architecture]
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Goal 30 should treat the product site and Starlight docs as one public-alpha funnel. The homepage establishes the problem and promise; the product pages convert and set trust boundaries; Starlight docs carry the golden path, concepts, guides, reference, and launch evidence.

# Product Site Contract

- Homepage: hero, problem, bigger-context thesis, architecture/core-loop visual, quickstart, work/context/evidence explanation, handoffs, audience, before/after comparison, trust boundary, CTAs, footer.
- Quickstart: exact install and first-run commands, small-repo/fresh-branch alpha note, expected success signals, links into docs.
- Trust: local-first storage, no hosted runtime, MCP/queue boundaries, no raw secrets/prompts/provider payloads, handoff warnings caveat.
- Alpha: pre-v1 caveats framed for users, not implementers.
- Docs bridge: links to the current preview docs during preview review and explains that `docs.mdkg.dev` is the future canonical host.
- `llms.txt`: plain text, short sections, durable placeholders, links, safety caveats, pack/handoff preference.

# Starlight Docs Contract

Required docs depth:

- install and quickstart golden path
- repository layout and what to commit
- glossary
- agent workflow guide
- spike guide
- packs and handoffs guide
- command/reference pages from generated metadata
- changelog summary
- Now/Next/Later roadmap
- project DB/queue safety copy
- troubleshooting page
- read-only vs mutating labels
- claims evidence matrix

# SEO And Link Contract

- Every public page has route-specific metadata, canonical policy, social metadata, and noindex behavior appropriate to preview vs production.
- Sitemap and robots output must be verified for product and docs.
- Links must resolve or be explicitly marked as future-domain placeholders.
- README, mdkg.dev, docs, command contract, and `llms.txt` must agree on install commands, tagline, alpha status, and core loop.

# Failure Modes

- Public pages sound like internal project plans.
- Preview docs links imply `docs.mdkg.dev` is live before DNS exists.
- Generated docs drift from CLI command metadata.
- Claims matrix becomes a pointer instead of a real review artifact.

# Testing Strategy

- Site/docs build checks.
- Docs drift and command-reference checks.
- Link/metadata/sitemap/robots checks.
- No-secret scan across source and generated output.
- README/docs/site parity check.

# Architecture

# Data model

# APIs / interfaces

# Observability

# Security / privacy

# Rollout plan
