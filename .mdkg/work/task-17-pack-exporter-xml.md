---
id: task-17
type: task
title: implement xml context pack exporter
status: done
priority: 2
epic: epic-2
tags: [pack, export, xml]
links: [format:xml]
artifacts: [pack-xml]
relates: [rule-2]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-13
updated: 2026-01-14
---

# Overview

Emit XML packs with a stable schema for meta and ordered nodes.

# Acceptance Criteria

- XML output includes pack meta and ordered nodes
- schema defined in rule-2 (root + meta + nodes)
- node fields align with JSON exporter
- output is deterministic across runs

# Files Affected

- src/pack/export_xml.ts

# Implementation Notes

- ensure body content is safely encoded

# Test Plan

- validate XML output for a small fixture pack

# Links / Artifacts

- rule-2
