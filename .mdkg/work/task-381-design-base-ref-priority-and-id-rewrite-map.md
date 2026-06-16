---
id: task-381
type: task
title: design base ref priority and id rewrite map
status: todo
priority: 2
epic: epic-89
parent: goal-17
tags: [0.3.4, base-ref, id-map]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [spike-6]
blocks: [task-382, task-383]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-16
---
# Overview

Define how mdkg prioritizes main/base IDs and rewrites incoming branch IDs while preserving links.

# Acceptance Criteria

- Base branch IDs win by default.
- Rewrite maps cover links, blockers, parents, scope refs, aliases, and body references where supported.
- Ambiguous rewrites are reported, not guessed.

# Files Affected

- src/**
- tests/**
- docs/**

# Implementation Notes

- Start with clean duplicate trees and expand to Git-stage repair.

# Test Plan

- Unit fixtures for rewrite maps.

# Links / Artifacts

- Add command receipts, validation output, and checkpoint ids during execution.
