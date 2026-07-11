---
id: test-402
type: test
title: Draft builds expose no dormant loop release content or metadata
status: todo
priority: 1
epic: epic-236
tags: [release, test, goal-63]
owners: []
links: []
artifacts: []
relates: [goal-63]
blocked_by: [task-731, task-732]
blocks: [test-407]
refs: [edd-71, dec-73, dec-74, prd-11, prop-8]
context_refs: [goal-63, epic-236, dec-74, prop-8, task-731, task-732]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-07-11
updated: 2026-07-11
---
# Overview

Prove a normal draft build cannot leak the v0.5.0 loop release through either
human-facing or machine-readable output.

# Target / Scope

`task-731` and `task-732`; both Astro sites, direct routes, navigation, metadata,
structured data, search, sitemap, robots, Pagefind, and LLM output.

# Preconditions / Environment

Canonical `release/public-release.json` in `draft`, no preview override, clean
marketing/docs build output, and deterministic forbidden-term corpus.

# Test Cases

- Marketing HTML/source contains no announcement, CTA, target version, release
  headline, loop metadata, or structured availability claim.
- Docs navigation contains no Loops group.
- `/loops/**` routes are absent or generic unavailable/noindex and expose no
  release guide title/body/commands.
- Sitemap, Pagefind, LLM files, metadata, Open Graph, JSON-LD, and robots contain
  no dormant route or copy.
- Homepage structured data continues to advertise real package version 0.4.2.
- Existing hero, quickstart, docs routes, navigation, and preview-wide noindex
  behavior remain regression-clean.
- Manifest hash is unchanged after both builds.

# Results / Evidence

Pending Goal 63 implementation.

# Notes / Follow-ups

- Hiding navigation alone is a failure.
- Scan built files directly rather than relying only on browser visibility.
