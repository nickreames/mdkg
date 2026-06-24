---
id: task-533
type: task
title: harden demo graph public proof path before canonical linking
status: todo
priority: 3
epic: epic-170
tags: [demo, proof, follow-up, mdkg-dev]
owners: []
links: []
artifacts: []
relates: [task-528, test-255]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Harden the existing mdkg.dev demo/template graphs before any public page treats them as canonical product proof.

# Acceptance Criteria

- Demo graph validates from a clean checkout.
- Template import/fork path is documented and reproducible.
- Demo graph proof stays noindex or preview-only until explicitly promoted.
- Public pages do not imply unfinished demos are production-ready examples.
- Follow-up includes Browser/Vercel validation expectations for any promoted demo URL.

# Test Plan

- Run `npm run smoke:demo-graph`.
- Run mdkg graph validation inside each demo/template graph.
- Verify public docs link to demo guidance only after validation evidence exists.

Describe what this task is and why it matters.

# Acceptance Criteria

- criterion 1
- criterion 2

# Files Affected

List files/directories expected to change.

- path 1
- path 2

# Implementation Notes

- note 1
- note 2

# Test Plan

How will we verify it works?

# Links / Artifacts

- related docs
- related issues
- references
