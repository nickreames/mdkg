---
id: task-15
type: task
title: implement json context pack exporter
status: done
priority: 2
epic: epic-2
tags: [export, json, pack]
owners: []
links: [format:json]
artifacts: [pack-json]
relates: [rule-2]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-13
updated: 2026-01-14
---

# Overview

Emit deterministic JSON packs with meta, ordered nodes, and parsed frontmatter subsets.

# Acceptance Criteria

- JSON output includes `meta` with root/depth/verbose/timestamp/truncation
- `nodes` array is in pack order
- each node includes qid/id/workspace/type/title/status/priority/path
- `frontmatter` includes links/artifacts/refs/aliases when present
- `body` excludes raw frontmatter

# Files Affected

- src/pack/export_json.ts

# Implementation Notes

- keep schema aligned with rule-2

# Test Plan

- validate JSON schema with a fixture pack

# Links / Artifacts

- rule-2
