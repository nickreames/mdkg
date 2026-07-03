---
id: test-332
type: test
title: validate package release gates and consumer dependency handoff
status: done
priority: 1
tags: [goal-48, release, consumer-boundary]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-48]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-02
updated: 2026-07-02
---
# Overview

Validate the eventual package/release gate and runtime-consumer handoff before
mdkg declares generic contract-profile support ready for Omni Room consumers.

# Target / Scope

- `task-635`
- `task-636`
- Later release execution gates and downstream dependency guidance.

# Preconditions / Environment

- Candidate implementation tasks are complete in a later execution pass.
- Package version and registry state are resolved live during that pass.

# Test Cases

- Local build, unit tests, CLI checks, docs/reference checks, workflow
  validation, scaffold/upgrade smoke, and relevant package smokes pass.
- `npm pack --dry-run --json` or successor package review shows expected
  payload without accidental docs/template/source omissions.
- Runtime-consumer handoff does not hardcode a future mdkg version and does not
  require unreleased flags without an experimental/local caveat.
- Closeout records exact changed files, validation receipts, local commit SHA,
  remaining dirty state, and no-push status.

# Results / Evidence

Pass for the planning contract.

- `task-635` states that stable Omni Room/runtime consumption requires an
  actual released mdkg package version resolved during a later execution pass,
  not a hardcoded future version from this planning goal.
- `task-635` permits pre-release local/experimental use only with explicit
  caveats, fallback parsing, no public contract promise, and runtime-owned
  validation.
- `task-635` separates mdkg source implementation, npm release, runtime
  adoption, root/subgraph refresh, and downstream deployment gates.
- `task-636` lists the future prepublish gates, npm pack/publish dry-run
  checks, registry checks, post-release install validation, and closeout
  evidence requirements.
- This planning pass performed no real publish, version bump, tag, push, npm
  package mutation, or downstream repo mutation.

# Notes / Follow-ups

- A later release execution goal must rerun package/build/registry gates live
  before recommending publish readiness.
