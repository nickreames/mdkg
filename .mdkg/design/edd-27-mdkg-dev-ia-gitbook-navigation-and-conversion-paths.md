---
tags: [mdkg-dev, ia, gitbook, conversion]
owners: []
links: []
artifacts: [mdkg_planning_docs.zip]
relates: []
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
aliases: []
created: 2026-06-22
updated: 2026-06-22
id: edd-27
type: edd
title: mdkg.dev IA GitBook navigation and conversion paths
---
# Overview

mdkg.dev information architecture should support quick human understanding, LLM-friendly retrieval, generated command reference, and clear conversion paths from interest to install to successful first graph.

# Architecture

- Top-level site paths: product overview, get started, concepts, command reference, project DB/queues, subgraphs/repair, safety/trust, examples, changelog.
- GitBook navigation mirrors docs concepts and generated reference entrypoints.
- Conversion paths: install, initialize, run goal, inspect pack, validate, create handoff.

# Data model

- Navigation entries, guide pages, generated command pages, example pages, and launch evidence pages.

# APIs / interfaces

- Docs build.
- Generated reference entrypoints.
- Link/version/sitemap checks.
- llms.txt generation.

# Failure modes

- Navigation sprawl.
- Duplicate generated and hand-written command docs.
- LLM docs quoting outdated version claims.

# Observability

- Page inventory, sitemap count, broken-link count, generated command count, example execution receipts.

# Security / privacy

- Docs must not expose private graph text by default.
- Public examples must be sanitized and source-backed.

# Testing strategy

- Docs-readiness smoke.
- Link and metadata checks.
- Generated reference drift checks.

# Rollout plan

- Use Goal 2 to implement IA and GitBook source.
- Keep launch public-alpha until conversion and safety checks pass.
