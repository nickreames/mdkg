---
id: edd-42
type: edd
title: Browser Chrome and Vercel preview validation evidence contract
tags: [mdkg-dev, browser, chrome, vercel, evidence, pass-3]
owners: []
links: [https://mdkg-dev.vercel.app/, https://mdkg-docs.vercel.app/]
artifacts: []
relates: []
refs: [archive://archive.mdkg-dev-polish-pass-3-2026-06-24]
aliases: [pass-3-preview-evidence-contract]
created: 2026-06-24
updated: 2026-06-24
---
# Local Validation

Goal 33 implementation must run local builds for marketing and docs, start local previews, and validate routes with Browser and Chrome at desktop, tablet, and mobile widths.

# Browser / Chrome Evidence

- Marketing routes: `/`, `/quickstart/`, `/trust/`, `/alpha/`, `/llms.txt`, `/llms-full.txt`, `/robots.txt`, `/sitemap.xml`, and `/docs` bridge/redirect behavior.
- Docs routes: docs home, install, quickstart, Plan -> Work -> Evidence, Work Node Types, Reference Types, Repository Layout, Agent Workflow, Packs/Handoffs, CLI Reference, Command Contract, Changelog, and Roadmap.
- Validate no obvious console errors, broken local navigation, collapsed code blocks, incoherent overlaps, mobile overflow, inaccessible focus states, or raw secret/prompt/token/payload markers.

# Vercel Evidence

- Push only accepted commits to `origin/main`.
- Verify existing Vercel projects `mdkg-dev` and `mdkg-docs` redeploy from the pushed commit.
- Record deployment ids, preview URLs, route checks, and known warnings.
- Do not create DNS records, promote production, activate analytics, mutate GitHub settings, publish npm, or create tags.

# Overview

# Architecture

# Data model

# APIs / interfaces

# Failure modes

# Observability

# Security / privacy

# Testing strategy

# Rollout plan
