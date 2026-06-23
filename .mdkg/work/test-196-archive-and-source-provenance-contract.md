---
id: test-196
type: test
title: archive and source-provenance contract
status: done
priority: 1
epic: epic-118
parent: goal-24
tags: [mdkg-dev, contract]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-438]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-21
---
# Overview

Validate the planning source provenance contract for Goal 1.

# Acceptance Criteria

- Archive URI verifies successfully.
- Design and roadmap nodes use archive/source paths as evidence or context.
- Original planning docs remain committed source evidence.

# Files Affected

- .mdkg graph/design/archive files only for Goal 1, Goal 2 paths after future activation only

# Implementation Notes

- Use mdkg CLI receipts and graph validation.

# Test Plan

- Run the commands named in this contract.

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- parent: goal-24
- epic: epic-118
