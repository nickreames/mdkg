---
tags: [mdkg-dev, agent-ux, cli, doctrine]
owners: []
links: []
artifacts: [mdkg_planning_docs.zip]
relates: []
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
aliases: []
created: 2026-06-22
updated: 2026-06-22
id: edd-25
type: edd
title: CLI and agent UX launch doctrine
---
# Overview

Public docs and demos should teach mdkg as a disciplined local-first agent memory workflow, not as a raw trace store or autonomous execution engine.

# Architecture

- Docs guide users through init, goal activation, next routing, pack, task lifecycle, checkpoint, validation, and handoff.
- Agent docs emphasize refs-only boundaries and explicit human-controlled execution.
- Runtime-facing docs separate mdkg durable graph state from project DB delivery state.

# Data model

- Goal/task/test/spike/checkpoint nodes.
- context_refs and evidence_refs for non-executable context.
- Packs and handoffs as sanitized bounded projections.

# APIs / interfaces

- CLI examples use shipped commands only.
- Agent-start prompt examples point to goals and packs, not raw planning dumps.

# Failure modes

- Agents may treat docs as permission to execute unsupported work.
- Users may overload scope_refs with non-actionable context if docs are unclear.

# Observability

- Docs smoke records executable examples and warnings.
- Handoff examples record raw-marker warning counts.

# Security / privacy

- Never encourage storage of raw secrets, tokens, provider payloads, cookies, or unrelated raw prompts.
- Queue docs present local delivery state, not canonical runtime history.

# Testing strategy

- Temp-repo docs examples.
- Handoff no-leak checks.
- Goal-only agent-start demo graph smoke.

# Rollout plan

- Apply doctrine while writing Goal 2 public content.
- Use launch checks to block misleading claims.
