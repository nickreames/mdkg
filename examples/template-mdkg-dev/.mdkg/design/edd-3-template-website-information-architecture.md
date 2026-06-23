---
id: edd-3
type: edd
title: Template website information architecture
tags: [template, information-architecture, mdkg-dev]
owners: []
links: []
artifacts: []
relates: []
refs: [goal-1]
aliases: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

A clone/forkable template graph for generating disposable mdkg.dev-style website candidates.

# Architecture

- `README.md` explains the goal-only start command.
- `WEBSITE_TEMPLATE_BRIEF.md` states page, preview, and launch boundaries.
- `goal-1` owns the candidate website build.
- `spike-1` selects audience and visual direction.
- `task-1` builds the local candidate.
- `test-1` proves clone/fork and preview-boundary behavior.
- `chk-1` seeds checkpoint expectations.

# Data model

- goal: umbrella objective and routing.
- spike: audience/visual direction research.
- task: local candidate implementation.
- test: clone and validation contract.
- checkpoint: closeout and promotion decision.

# APIs / interfaces

- local mdkg CLI commands only for the first pass.
- optional Vercel preview is a future explicit goal, not this template default.

# Failure modes

- Candidate claims become too strong: soften copy and update evidence.
- Template deploys accidentally: remove deploy config and record boundary violation.
- Candidate should be promoted: create a new preview/promotion goal.

# Observability

- command receipts in checkpoints.
- `mdkg validate --json`.
- `mdkg pack goal-1 --profile concise`.

# Security / privacy

- Public-safe markdown only.
- No credentials, analytics IDs, raw prompts, or production deployment config.

# Testing strategy

- `test-1` plus local build/check selected by `spike-1`.

# Rollout plan

Keep local-only by default; preview and durable demo promotion require explicit human approval.
