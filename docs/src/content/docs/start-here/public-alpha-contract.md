---
title: Public Alpha Contract
description: What is stable enough to try today and what remains advanced alpha.
---

Markdown Knowledge Graph is a developer preview and pre-v1 public alpha.

It is usable today, but graph, cache, bundle, and database contracts may change before v1. Markdown files in your repo remain the durable source of truth.

## Stable enough to try

- `mdkg init --agent`
- graph search/show/list/next
- goals, tasks, tests, bugs, features, spikes, checkpoints
- deterministic packs
- handoffs
- validation/status/doctor/fix planning
- skill source and mirrors

Stable enough to try does not mean production-ready for every team. Start with a small repo, keep commits reviewable, and run validation before handoff or closeout.

## Advanced alpha

- project DB and queues
- subgraphs and bundles
- graph clone/fork/import-template
- read-only MCP
- workflow mirror files

Advanced alpha surfaces are documented for early adopters, but they are not required for the first five minutes.

## Boundaries

mdkg does not host your repo, run agents, deploy code, call model providers, execute skill scripts, or provide comprehensive secret scanning. Keep secrets and raw production payloads out of mdkg graph state.
