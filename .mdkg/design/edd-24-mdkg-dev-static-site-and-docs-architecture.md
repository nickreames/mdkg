---
tags: [mdkg-dev, astro, gitbook, architecture]
owners: []
links: []
artifacts: [mdkg_planning_docs.zip]
relates: []
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
aliases: []
created: 2026-06-22
updated: 2026-06-22
id: edd-24
type: edd
title: mdkg.dev static site and docs architecture
---
# Overview

mdkg.dev should use a split-source architecture so website implementation, docs source, and demo/template graphs can evolve independently while remaining inside the mdkg repo.

# Architecture

- /mdkg-dev owns the Astro static site and marketing shell.
- /docs owns canonical GitBook documentation source.
- /examples owns demo repos and template graphs.
- Generated command docs are projected from command contracts into docs/site outputs.

# Data model

- Site pages, docs pages, command-reference pages, and example graph metadata are separate source classes.
- mdkg graph nodes remain roadmap/planning source, not a direct public content dump.

# APIs / interfaces

- Astro build and static render.
- GitBook source sync or export path.
- Command-contract-to-docs generation.
- Smoke scripts for site/docs/examples.

# Failure modes

- Generated reference drift.
- Docs/site duplicate content.
- Launch copy over-claims deferred capabilities.
- Examples rot without temp-repo smokes.

# Observability

- Build receipts include command-contract hash, package version, page count, link check count, and smoke temp roots.

# Security / privacy

- No private graph dumps or local absolute paths in public output.
- No token-like strings, raw prompts, provider payloads, or unpublished private notes.

# Testing strategy

- smoke:mdkg-dev, smoke:command-docs, no-secret scan, link/version checks, sitemap/metadata checks.

# Rollout plan

- Implement only in Goal 2 after Goal 1 closes.
- Start with static pages and docs source.
- Add generated reference and examples after base build passes.
