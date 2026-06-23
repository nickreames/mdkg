---
id: chk-1
type: checkpoint
title: Template graph seed accepted
status: backlog
priority: 9
tags: [template, checkpoint, seed]
owners: []
links: []
artifacts: []
relates: [goal-1]
blocked_by: []
blocks: []
refs: []
context_refs: [goal-1, epic-1, spike-1, task-1, test-1, edd-3, dec-1]
evidence_refs: []
aliases: []
skills: []
scope: []
created: 2026-06-22
updated: 2026-06-22
---
# Summary

The template-mdkg-dev example graph has been seeded with an umbrella goal, epic, spike, implementation task, validation test, design record, deployment-boundary decision, and public-safe website template brief.

# Scope Covered

- goal-1
- epic-1
- spike-1
- task-1
- test-1

# Decisions Captured

- dec-1 keeps the template cloneable and local-only by default.
- edd-3 defines the website-template information architecture.

# Implementation Summary

The graph is clone/fork friendly and starts from `goal-1`. It can be used to generate disposable candidate sites while deferring preview deployment, durable demo subdomains, analytics, and production promotion.

# Verification / Testing

Validation is performed by the parent goal and future smoke automation. The required local proof is `mdkg validate --json`, `mdkg goal next goal-1 --json`, and `mdkg pack goal-1 --profile concise`.

# Known Issues / Follow-ups

- Future implementation should build a local candidate site.
- Future preview/promotion should be a separate explicit goal.

# Links / Artifacts

- README.md
- WEBSITE_TEMPLATE_BRIEF.md
- dec-1
- edd-3
