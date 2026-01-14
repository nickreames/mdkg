---
id: task-16
type: task
title: implement toon context pack exporter
status: todo
priority: 2
epic: epic-2
tags: [pack, export, toon]
links: [format:toon]
artifacts: [pack-toon]
relates: [rule-2]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-13
updated: 2026-01-13
---

# Overview

Emit TOON packs mirroring JSON semantics with ordered nodes and meta fields.

# Acceptance Criteria

- TOON output mirrors JSON pack schema (meta + ordered nodes)
- node fields align with JSON exporter
- output is deterministic across runs

# Files Affected

- src/pack/export_toon.ts

# Implementation Notes

- follow TOON encoding spec once documented

# Test Plan

- validate TOON output for a small fixture pack

# Links / Artifacts

- rule-2
