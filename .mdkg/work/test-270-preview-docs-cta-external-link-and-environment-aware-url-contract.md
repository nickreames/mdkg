---
id: test-270
type: test
title: preview docs CTA external-link and environment-aware URL contract
status: todo
priority: 1
epic: epic-182
parent: goal-35
tags: [mdkg-dev, links, docs, preview]
owners: []
links: []
artifacts: []
relates: [task-550, edd-48, dec-46]
blocked_by: [task-550]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: [preview-docs-links, external-link-behavior, future-dns-copy]
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Prove preview docs links are accurate and environment-aware.

# Test Cases

- Marketing header, hero, footer, final CTA, and `/docs` route target `https://mdkg-docs.vercel.app/`.
- Future `docs.mdkg.dev` language is clearly labeled as future production DNS.
- External links are not broken and have consistent behavior.
- No DNS or production promotion occurs.
