---
id: task-18
type: task
title: add pack tests and fixtures
status: done
priority: 2
epic: epic-2
tags: [fixtures, pack, tests]
owners: []
links: [cmd:test]
artifacts: [pack-fixtures, pack-tests]
relates: [rule-2, rule-6]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-13
updated: 2026-01-14
---

# Overview

Add unit tests and fixtures for pack traversal, ordering, truncation metadata, and exporter outputs.

# Acceptance Criteria

- tests cover traversal depth and edge selection
- ordering is deterministic for task and non-task roots
- verbose core inclusion respected and warnings covered
- truncation metadata recorded correctly
- exporters (md/json/toon/xml) produce expected output

# Files Affected

- tests/pack/**
- tests/fixtures/**

# Implementation Notes

- keep fixtures minimal and deterministic

# Test Plan

- `npm run test`

# Links / Artifacts

- rule-2
- rule-6
