---
id: test-222
type: test
title: live preview Browser Chrome validation contract
status: done
priority: 1
epic: epic-141
parent: goal-28
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Validate that live preview deployments are usable before DNS or production promotion.

# Target / Scope

- `task-480`
- Vercel preview URLs for `mdkg-dev` and `mdkg-docs`

# Preconditions / Environment

- Both Vercel preview projects have successful deployments.
- Preview URLs are available.

# Test Cases

- Marketing preview routes render: `/`, `/quickstart/`, `/trust/`, `/alpha/`, `/docs/`, `/llms.txt`, `/llms-full.txt`, `/robots.txt`, `/sitemap.xml`.
- Docs preview renders Starlight landing, start-here, concepts, guides, reference, generated CLI reference, search UI, metadata, dark mode, and code blocks.
- Desktop and mobile checks pass in Browser/Chrome.
- No page-level console errors.
- No preview URL appears in production sitemap/canonical metadata.

# Results / Evidence

- Chrome route checks passed for marketing preview `https://mdkg-dev.vercel.app`:
  - `/`: homepage H1 `Git-native project memory for AI-native software engineering.`
  - `/quickstart/`: H1 `Initialize, index, inspect, validate.`
  - `/trust/`: H1 `Durable semantic memory, not an executor.`
  - `/alpha/`: H1 `Usable today, still pre-v1.`
  - `/docs/`: H1 `Repo-owned docs, rendered with Starlight.`
  - No page-level console errors were observed on checked HTML routes.
- Chrome route checks passed for docs preview `https://mdkg-docs.vercel.app`:
  - `/`: Starlight docs H1 `mdkg Docs`.
  - `/start-here/quickstart/`, `/start-here/install/`, `/reference/generated-cli-reference/`, `/reference/command-contract/`, and `/project/claims-evidence-matrix/` rendered expected titles/headings.
  - No page-level console errors were observed on checked HTML routes.
- In-app Browser opened and verified:
  - `https://mdkg-dev.vercel.app/`
  - `https://mdkg-docs.vercel.app/`
- Direct live network checks passed for `llms.txt`, `llms-full.txt`, `robots.txt`, marketing sitemap, and docs sitemap index.
- Production canonical metadata remains pointed at `https://mdkg.dev` and `https://docs.mdkg.dev`; preview URLs are not written into canonical metadata or sitemaps.
- Public safety-boundary copy intentionally mentions tokens/raw prompts/raw payloads as prohibited content; narrow secret-pattern checks passed.

# Notes / Follow-ups

- Do not click external links or submit forms during preview validation.
