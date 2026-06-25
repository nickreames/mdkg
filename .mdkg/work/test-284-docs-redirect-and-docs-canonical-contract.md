---
id: test-284
type: test
title: docs redirect and docs-canonical contract
status: done
priority: 1
epic: epic-191
parent: goal-36
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-566]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Validate that docs are canonical on `docs.mdkg.dev` and the marketing `/docs` route redirects there.

# Target / Scope

- Marketing `/docs` route.
- Docs host root and quickstart routes.

# Preconditions / Environment

- `task-566` source changes are deployed.

# Test Cases

- `https://mdkg.dev/docs` redirects to `https://docs.mdkg.dev/`.
- Marketing navigation and CTAs point to docs canonical host.
- Docs pages emit canonical URLs under `https://docs.mdkg.dev`.
- No public production route describes GitBook or preview-docs bridge language.

# Results / Evidence

Pending.

# Notes / Follow-ups

- Future marketing docs landing can be reintroduced only by a separate goal.
