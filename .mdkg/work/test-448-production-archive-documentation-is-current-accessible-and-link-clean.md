---
id: test-448
type: test
title: Production archive documentation is current accessible and link-clean
status: todo
priority: 1
epic: epic-253
tags: [release, documentation, accessibility, production]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-787]
blocks: [task-788]
refs: [goal-71, task-787]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-14
updated: 2026-07-14
---
# Overview

Ensure public docs accurately describe the package users can install.

# Target / Scope

mdkg.dev/docs.mdkg.dev deployment SHA, archive docs, CLI examples, install/version
facts, links, metadata, indexing, accessibility, and responsive behavior.

# Preconditions / Environment

Production must serve the intended release commit; capture desktop and mobile.

# Test Cases

- Live commands/errors/JSON examples match registry 0.5.1.
- Navigation and links resolve; metadata/version/install facts are current.
- Keyboard, focus, contrast/reflow, indexing, and no-secret checks pass.

# Results / Evidence

Pending deployment and browser evidence.

# Notes / Follow-ups

- Production drift is repaired forward before Goal 71 closes.
