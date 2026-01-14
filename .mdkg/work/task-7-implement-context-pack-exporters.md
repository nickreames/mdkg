---
id: task-7
type: task
title: plan context pack exporters (research + epic + subtasks)
status: done
priority: 2
epic: epic-1
tags: [pack, planning, research]
links: [cmd:pack, format:md, format:json, format:toon, format:xml]
artifacts: [pack-epic, pack-subtasks, pack-spec-alignment]
relates: [rule-2, rule-3, epic-2, task-12, task-13, task-14, task-15, task-16, task-17, task-18]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-06
updated: 2026-01-13
---

# Overview

Convert the context pack work into a structured epic with scoped subtasks. Capture format research (md/json/toon/xml) and align the pack spec before implementation.

# Acceptance Criteria

- research decisions captured for pack format requirements (including XML/TOON)
- epic created for context pack exporters
- subtasks created starting at `task-12`, covering engine, CLI wiring, exporters, and tests
- task links updated to point at the new epic and subtasks

# Files Affected

- .mdkg/work/task-7-implement-context-pack-exporters.md
- .mdkg/work/epic-2-context-pack-exporters-v1.md
- .mdkg/work/task-12-*
- .mdkg/work/task-18-*

# Implementation Notes

- follow templates for epic/task structure
- keep IDs sequential and lowercase
- use `epic: epic-2` for the new subtasks

# Test Plan

- n/a (planning task)

# Links / Artifacts

- rule-2
- rule-3
- epic-2
- task-12
- task-13
- task-14
- task-15
- task-16
- task-17
- task-18
