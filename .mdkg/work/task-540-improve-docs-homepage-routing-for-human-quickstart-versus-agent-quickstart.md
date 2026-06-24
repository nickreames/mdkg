---
id: task-540
type: task
title: improve docs homepage routing for human quickstart versus agent quickstart
status: done
priority: 1
epic: epic-175
parent: goal-34
tags: [mdkg-dev, docs, quickstart]
owners: []
links: []
artifacts: []
relates: [goal-34, test-260]
blocked_by: [task-536, task-539]
blocks: [task-543, task-544]
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24]
context_refs: [edd-44]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Route human developers and coding agents into different first paths that both converge on Plan -> Work -> Evidence.

# Acceptance Criteria

- Docs homepage has clear cards for install, agent context, work node types, handoffs, advanced multi-repo workflows, and CLI reference.
- Human path is install -> quickstart -> work node types -> packs/handoffs.
- Agent path is AGENT_START -> status -> current/next -> show/pack -> validate.
- Agent Workflow page links back to this path.

# Files Affected

- `docs/src/content/docs/index.mdx`
- related guide pages

# Implementation Notes

- Keep beginner path concise; move advanced details out of landing pages.

# Test Plan

Docs build, Browser/Chrome nav checks, and docs smoke assertions.

# Links / Artifacts

- `test-260`
