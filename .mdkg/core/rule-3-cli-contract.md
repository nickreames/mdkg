---
id: rule-3
type: rule
title: CLI discovery and reviewed operations
tags: [mdkg, guidance]
owners: []
links: []
artifacts: []
relates: []
refs: []
aliases: []
created: 2026-09-09
updated: 2026-09-09
---

# Purpose

Use the installed CLI contract instead of remembered or guessed commands.

# Scope

Run mdkg from a configured project root. Use `mdkg help <command>` for flags,
output formats and errors; the installed command reference is supporting detail.

# Requirements

- Inspection and previews do not grant authority to apply changes.
- Review upgrade, migration and reconciliation plans before applying them.
- If inputs change, obtain a fresh plan; do not bypass stale-plan checks.
- Explicit v2 adoption is separate from ordinary initialization or scaffold upgrade.
- Keep Git staging, commits and integration separate from semantic graph changes.
- Selection and transient execution ownership are not shared graph identity.
- On failure inspect the diagnostic and supported recovery path; do not retry a
  mutation blindly or guess undocumented commands.

# Validation

Check exit status and the receipt together, then validate the resulting graph.
A success message is not a substitute for task-specific acceptance evidence.
