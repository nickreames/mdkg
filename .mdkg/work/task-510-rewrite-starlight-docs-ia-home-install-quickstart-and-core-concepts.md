---
id: task-510
type: task
title: rewrite Starlight docs IA home install quickstart and core concepts
status: backlog
priority: 1
tags: [mdkg-dev, docs]
owners: []
links: [https://mdkg-docs.vercel.app/]
artifacts: [mdkg_preview_polish_pass2]
relates: []
blocked_by: [task-509]
blocks: [task-511]
refs: [archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Make the Starlight docs home and core docs path useful for public-alpha users.

# Acceptance Criteria

- Docs home is user-facing, not scaffold-facing.
- Install, quickstart, repository layout, work node types, local-first/low-dependency, Plan -> Work -> Evidence, reference types, glossary, roadmap, trust, and alpha contract are coherent.
- Claims Evidence Matrix is not public navigation.
- Public docs do not mention Starlight or GitBook implementation details.

# Files Affected

- `docs/`

# Test Plan

- `npm --prefix docs run build`
- docs navigation/browser route checks.

# Implementation Notes

# Links / Artifacts
