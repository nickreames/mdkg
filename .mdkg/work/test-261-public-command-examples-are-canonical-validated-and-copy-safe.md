---
id: test-261
type: test
title: public command examples are canonical validated and copy-safe
status: done
priority: 1
epic: epic-173
parent: goal-34
tags: [mdkg-dev, commands]
owners: []
links: []
artifacts: []
relates: [goal-34, task-537]
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24, edd-43]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: [command-contract-validation, placeholder-allowlist, copy-safe-blocks]
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Verify public command examples are accurate, canonical, and safe to copy.

# Target / Scope

Public Markdown/MDX/Astro command blocks and command-example validation script.

# Preconditions / Environment

Built command contract and docs source.

# Test Cases

- Public examples validate against command contract, help, or safe execution.
- Placeholder examples are consistently marked illustrative.
- Copyable blocks omit prompts and preserve line continuations.
- Known-invalid examples fail the check during development.

# Results / Evidence

Pending implementation.

# Notes / Follow-ups

- None.
