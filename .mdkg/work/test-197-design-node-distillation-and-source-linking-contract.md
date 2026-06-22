---
id: test-197
type: test
title: design-node distillation and source-linking contract
status: done
priority: 1
epic: epic-119
parent: goal-24
tags: [mdkg-dev, contract]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-442]
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

Validate that the planning bundle was distilled into canonical design records without losing provenance.

# Acceptance Criteria

- PRD/EDD/DEC nodes exist and validate.
- Each canonical design node links to archive/source evidence.
- Old external docs nodes contain supersession notes.

# Files Affected

- .mdkg graph/design/archive files only for Goal 1, Goal 2 paths after future activation only

# Implementation Notes

- Use mdkg CLI receipts and graph validation.

# Test Plan

- Run the commands named in this contract.

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- parent: goal-24
- epic: epic-119
