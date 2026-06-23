---
id: edd-3
type: edd
title: Demo flow information architecture
tags: [demo, information-architecture, mdkg-dev]
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

A tiny live-demo information architecture for showing mdkg as the starting context for agentic coding work.

# Architecture

- `README.md` explains the start command.
- `DEMO_BRIEF.md` states the story beats and boundaries.
- `goal-1` owns the demo.
- `spike-1` chooses the audience/proof path.
- `task-1` builds the local artifact.
- `test-1` proves the goal-only start and validation flow.
- `chk-1` seeds checkpoint expectations.

# Data model

- goal: umbrella objective and routing.
- spike: research decision before implementation.
- task: concrete artifact work.
- test: local validation contract.
- checkpoint: closeout evidence.

# APIs / interfaces

- local mdkg CLI commands only.
- no deployed API or external service.

# Failure modes

- Demo becomes too large: shrink to static artifact.
- Demo leaks private context: remove content and record a checkpoint warning.
- Demo needs deployment: create a separate future goal.

# Observability

- command receipts in checkpoints.
- `mdkg validate --json`.
- `mdkg pack goal-1 --profile concise`.

# Security / privacy

- Public-safe markdown only.
- No raw prompts, credentials, provider payloads, or local absolute paths.

# Testing strategy

- `test-1` plus `mdkg validate --json`.

# Rollout plan

Keep local-only until an explicit promotion goal is created.
