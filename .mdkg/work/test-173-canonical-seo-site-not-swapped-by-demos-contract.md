---
id: test-173
type: test
title: canonical SEO site not swapped by demos contract
status: todo
priority: 2
epic: epic-100
parent: goal-20
tags: [0.3.7, seo, demo]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-400, task-401]
blocks: []
refs: []
aliases: []
skills: []
cases: [Canonical mdkg.dev remains stable., Demo subdomains and previews are separate., Rejected demos are noindexed or removed.]
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Validate canonical SEO site not swapped by demos contract.

# Target / Scope

- task-400
- task-401

# Preconditions / Environment

- Use a fresh temp repo or deterministic fixture where mutation behavior is under test.
- Run through the public CLI surface unless the test explicitly targets an internal helper.

# Test Cases

- Canonical mdkg.dev remains stable.
- Demo subdomains and previews are separate.
- Rejected demos are noindexed or removed.

# Expected Evidence

- SEO safety review.

# Notes / Follow-ups

- Record command output, receipts, and linked checkpoints when implemented.
