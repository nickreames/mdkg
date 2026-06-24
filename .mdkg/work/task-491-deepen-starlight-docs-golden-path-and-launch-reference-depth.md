---
id: task-491
type: task
title: deepen Starlight docs golden path and launch reference depth
status: todo
priority: 1
tags: [mdkg-dev, docs, starlight, p1]
owners: []
links: []
artifacts: []
relates: [test-229]
blocked_by: [task-490]
blocks: [task-492]
refs: [archive://archive.mdkg-dev-feedback-user-stories-2026-06-23]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Deepen Starlight docs so a new user can install mdkg, run the golden path, understand key concepts, and hand work to an agent.

# Acceptance Criteria

- Install docs cover canonical npm path, Node version guidance, and package-manager caveats.
- Quickstart explains commands, expected outputs, pack/handoff flow, and required-check semantics.
- Repository layout explains what to commit and what not to commit.
- Glossary, agent-goal guide, spike guide, handoff guide, changelog summary, roadmap, troubleshooting, generated/reference docs, and project DB/queue safety copy exist or are materially improved.
- Read-only vs mutating labels are present where relevant.

# Test Plan

- `npm --prefix docs run build`
- `npm run docs:check`
- `npm run smoke:mdkg-dev-docs`
- `test-229`

# Files Affected

# Implementation Notes

# Links / Artifacts
