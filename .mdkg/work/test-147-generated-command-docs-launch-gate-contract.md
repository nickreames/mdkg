---
id: test-147
type: test
title: generated command docs launch gate contract
status: todo
priority: 2
epic: epic-78
parent: goal-15
tags: [command-contract, generated-docs, docs-gate]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-355]
blocks: []
refs: []
aliases: []
skills: []
cases: [command contract generated, public reference generated, docs drift check fails on mismatch]
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Validate that public command docs are generated from mdkg-native command
metadata and fail when docs drift from the CLI contract.

# Target / Scope

- `task-355`
- generated command reference docs
- command contract metadata

# Preconditions / Environment

- Built CLI available through `dist/cli.js`.
- Command contract generation enabled.
- Public docs output path or package docs fixture available.

# Test Cases

- Generate command contract and public docs from a clean tree.
- Assert public docs include all public commands and exclude internal-only
  helper surfaces.
- Mutate a fixture or generated source in a controlled way and assert the drift
  check fails.
- Confirm diagnostics explain the mismatch without corrupting JSON stdout for
  JSON-producing commands.

# Results / Evidence

- Pending.

# Notes / Follow-ups

- OpenCLI projection remains optional; mdkg-native metadata remains canonical.
