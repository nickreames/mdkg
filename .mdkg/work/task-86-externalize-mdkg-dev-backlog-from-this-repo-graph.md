---
id: task-86
type: task
title: externalize mdkg dev backlog from this repo graph
status: done
priority: 1
epic: epic-12
tags: [0_0_4, repo-boundary, docs]
owners: []
links: []
artifacts: [.mdkg/design/prd-2-mdkg-dev-external-docs-handoff-note.md, .mdkg/work/epic-4-v0-4-agent-memory-skills-and-omni-bootstrap.md, .mdkg/work/task-39-mdkg-dev-deterministic-memory-vs-vectors-content.md, .mdkg/work/task-40-mdkg-dev-skills-tools-and-episodic-trace-content.md, .mdkg/work/task-44-plan-mdkg-dev-ia-and-homepage-positioning.md, .mdkg/work/task-46-plan-mdkg-dev-docs-versioning-examples-and-seo-launch-scope.md, .mdkg/work/test-15-v0-4-mdkg-dev-docs-source-truth-and-cli-parity.md]
relates: [dec-14, prd-2, epic-4, epic-12]
blocked_by: []
blocks: [test-45]
refs: []
aliases: []
created: 2026-03-08
updated: 2026-03-08
---

# Overview

Move mdkg.dev planning out of the active CLI repo scope and leave only a local external handoff note.

# Acceptance Criteria

- mdkg.dev tasks are no longer open blockers in the CLI repo
- local onboarding artifacts remain in the CLI repo

# Files Affected

- `.mdkg/design/prd-2-mdkg-dev-external-docs-handoff-note.md`
- `.mdkg/work/epic-4-v0-4-agent-memory-skills-and-omni-bootstrap.md`

# Implementation Notes

- mdkg.dev planning remains discoverable as external context, not active runtime scope

# Test Plan

- `test-45`
- `mdkg validate`

# Links / Artifacts

- `dec-14`
