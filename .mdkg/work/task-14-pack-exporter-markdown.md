---
id: task-14
type: task
title: implement markdown context pack exporter
status: done
priority: 2
epic: epic-2
tags: [export, md, pack]
owners: []
links: [format:md]
artifacts: [pack-md]
relates: [rule-2]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-13
updated: 2026-01-14
---

# Overview

Emit deterministic Markdown packs with headers, included node list, and node sections that surface searchable fields without raw frontmatter.

# Acceptance Criteria

- pack header includes root, depth, verbose, node count, and truncation flags
- ordered included-nodes list matches pack ordering
- each node section includes qid/type/title/status/priority/path/links/artifacts/refs
- node body excludes raw frontmatter
- stable divider separates nodes

# Files Affected

- src/pack/export_md.ts

# Implementation Notes

- keep ordering identical to pack engine output
- respect `max_bytes` during md generation

# Test Plan

- snapshot a markdown pack for a small fixture graph

# Links / Artifacts

- rule-2
