---
id: edd-43
type: edd
title: public command-example validation and docs quality automation
tags: [mdkg-dev, docs, automation]
owners: []
links: []
artifacts: []
relates: [goal-34, task-537, task-544, test-261, test-265]
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24, edd-39]
aliases: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Public docs now include enough command examples that drift is a product risk. Pass-4 treats command examples as a tested interface, not hand-authored copy that can silently rot.

# Architecture

- Add a docs command-example check that scans public Markdown, MDX, and Astro content for shell fences and known inline command examples.
- Validate canonical commands against `dist/command-contract.json`, `mdkg help`, or focused CLI execution.
- Keep an explicit allowlist for illustrative examples and placeholders.
- Expand generated CLI reference from command metadata so public docs become useful without duplicating the full matrix manually.

# Data model

- Example record: source path, line or block id, command text, validation mode, placeholder policy, beginner or advanced label, and result.
- Generated reference record: command name, purpose, usage, flags, read-only or mutating status, output formats, examples, related docs, and alpha level.

# APIs / interfaces

- Future script: `npm run docs:check-commands`.
- Existing broad docs gate: `npm run docs:check`.
- Generated source: `dist/command-contract.json`.

# Failure modes

- Placeholder examples produce false positives; solve with explicit illustrative markers.
- Commands require repo state; solve with help/contract validation unless a smoke fixture can safely execute them.
- Reference pages become too exhaustive; keep beginner pages curated and move broad metadata to reference.

# Observability

Command-check receipts should summarize scanned files, checked examples, skipped illustrative examples, failures, and generated-reference freshness.

# Security / privacy

Checks must not execute commands that transmit data or mutate external services. Public examples must not include tokens, private prompts, provider payloads, or secrets.

# Testing strategy

Unit tests cover parser/allowlist behavior. Pass-4 smoke covers public examples, generated reference freshness, copy-safe command blocks, and maintainer-facing command contract labeling.

# Rollout plan

Implement report/fail-fast local scripts first, then wire them into `docs:check` and `smoke:mdkg-dev-polish-pass4` when stable.
