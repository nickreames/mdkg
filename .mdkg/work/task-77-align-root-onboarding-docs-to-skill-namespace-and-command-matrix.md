---
id: task-77
type: task
title: align root onboarding docs to skill namespace and command matrix
status: done
priority: 1
epic: epic-10
tags: [v0_5, docs, llm, ux]
owners: []
links: []
artifacts: [README.md, llms.txt, AGENT_PROMPT_SNIPPET.md, AGENTS.md, CLI_COMMAND_MATRIX.md]
relates: [dec-13, test-37, epic-10]
blocked_by: []
blocks: [test-37]
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

Align the root onboarding artifacts to the new skill namespace and point humans and agents at the command matrix as the canonical reference.

# Acceptance Criteria

- source docs and mdkg graph reflect the intended contract for this task
- referenced runtime/docs artifacts are updated or tracked explicitly
- linked validation/test nodes can be used to audit completion

# Files Affected

- see `artifacts` in frontmatter for the primary files touched or planned

# Implementation Notes

- keep behavior deterministic and local-first
- prefer one canonical interface per workflow over parallel teaching paths

# Test Plan

- satisfy the linked `test-*` contract for this task
- rerun `mdkg validate` after node or doc updates

# Links / Artifacts

- epic linkage and frontmatter artifacts are the source of truth for this planning record
