---
id: task-535
type: task
title: fix llms txt formatting and add the canonical agent-readable path
status: todo
priority: 1
epic: epic-173
parent: goal-34
tags: [mdkg-dev, llms, agent-path]
owners: []
links: []
artifacts: []
relates: [goal-34, test-259]
blocked_by: [task-534]
blocks: [task-536, task-537]
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24]
context_refs: [prd-9, edd-43]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Fix the agent-readable text surface so LLMs and coding agents receive readable, line-preserved guidance.

# Acceptance Criteria

- `/llms.txt` and `/llms-full.txt` serve as `text/plain` with headings, bullets, links, and line breaks preserved.
- Agent path is explicit: read `AGENT_START.md`, run status/current/next, show/pack one node, do work outside mdkg, record evidence, validate.
- No hidden prompts, raw secrets, tokens, provider payloads, or private runtime payloads appear.
- `test-259` passes.

# Files Affected

- `mdkg-dev/`
- `docs/`
- related smoke scripts if needed

# Implementation Notes

- Prefer simple text generation or static files over client-rendered content for LLM endpoints.
- Keep production/preview noindex policy intact.

# Test Plan

Direct HTTP checks, Browser/Chrome route checks where applicable, and pass-4 smoke assertions.

# Links / Artifacts

- `test-259`
