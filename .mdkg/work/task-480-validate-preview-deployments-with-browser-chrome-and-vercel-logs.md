---
id: task-480
type: task
title: validate preview deployments with Browser Chrome and Vercel logs
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
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Validate the live preview deployments before any DNS or production work is considered.

# Acceptance Criteria

- Marketing preview validates routes `/`, `/quickstart/`, `/trust/`, `/alpha/`, `/docs/`, `/llms.txt`, `/llms-full.txt`, `/robots.txt`, and `/sitemap.xml`.
- Docs preview validates Starlight landing, start-here, concepts, guides, reference, generated CLI reference, search UI presence, metadata, dark mode, and code blocks.
- Desktop and mobile checks pass in Browser/Chrome.
- Vercel logs show successful builds.
- No preview URL is written into production canonical metadata or sitemap.

# Files Affected

List files/directories expected to change.

- preview evidence only

# Implementation Notes

- Do not click external links or submit forms during validation.

# Test Plan

- Browser and Chrome manual/automated checks.
- Vercel deployment/log inspection.
- no-secret marker review of generated artifacts and mdkg evidence.

# Links / Artifacts

- `test-222`

# Completion Evidence

- Vercel project/deployment verification:
  - `mdkg-dev`: project `prj_R9FJkRf2FsmcM9cuIyQbPTV9A056`, deployment `dpl_7oq5idj6rjsamgPt1DgXXyiMb2VT`, state `READY`, alias `https://mdkg-dev.vercel.app`.
  - `mdkg-docs`: project `prj_3Aoh90VnkqNmqM6AnX9t72fSULEd`, deployment `dpl_BSRCqokvScb8Uvot4cHBu27bmKg2`, state `READY`, alias `https://mdkg-docs.vercel.app`.
- Chrome validation:
  - Marketing routes rendered without page-level console errors: `/`, `/quickstart/`, `/trust/`, `/alpha/`, `/docs/`.
  - Docs routes rendered without page-level console errors: `/`, `/start-here/quickstart/`, `/start-here/install/`, `/reference/generated-cli-reference/`, `/reference/command-contract/`, `/project/claims-evidence-matrix/`.
  - Marketing canonical URLs remain `https://mdkg.dev/...`, not Vercel preview URLs.
  - Docs canonical URLs remain `https://docs.mdkg.dev/...`, not Vercel preview URLs.
  - Chrome extension blocked direct navigation to `https://mdkg-dev.vercel.app/llms.txt` with `ERR_BLOCKED_BY_CLIENT`; live text assets were then verified by direct network checks.
- In-app Browser validation:
  - Opened `https://mdkg-dev.vercel.app/` and verified title `Markdown Knowledge Graph - Git-native project memory` with expected homepage H1.
  - Opened `https://mdkg-docs.vercel.app/` and verified title `mdkg Docs | mdkg Docs` with expected Starlight homepage H1.
- Live text asset checks:
  - `https://mdkg-dev.vercel.app/llms.txt`: HTTP 200, `text/plain`, no high-risk secret pattern.
  - `https://mdkg-dev.vercel.app/llms-full.txt`: HTTP 200, `text/plain`, no high-risk secret pattern.
  - `https://mdkg-dev.vercel.app/robots.txt`: HTTP 200, `text/plain`, no high-risk secret pattern.
  - `https://mdkg-dev.vercel.app/sitemap.xml`: HTTP 200, `application/xml`, no preview URLs in canonical sitemap entries.
  - `https://mdkg-docs.vercel.app/sitemap-index.xml`: HTTP 200, `application/xml`, canonical sitemap points to `https://docs.mdkg.dev/sitemap-0.xml`.
- Known validation note:
  - Naive raw-word matching flags public safety-boundary pages that intentionally mention tokens, raw prompts, or raw payloads as prohibited content. Narrow secret-pattern checks against token/key shapes passed.
