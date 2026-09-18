---
id: rule-7
type: rule
title: Collaboration preferences
tags: [mdkg, guidance]
owners: []
links: []
artifacts: []
relates: []
refs: [rule-human]
aliases: [collaboration, operator-profile]
created: 2026-09-09
updated: 2026-09-09
---

# Purpose

Record stable project collaboration preferences here. Keep assignment-specific
authority and acceptance criteria in the current handoff or work node.

# Scope

These defaults are customizable. They do not override current user instructions
or grant permission to edit other projects, publish, deploy or change history.

# Requirements

- Agree on the outcome, owned paths, evidence and stop conditions before writing.
- Use one writer per checkout. Separate developers may work in separate branches
  and checkouts; integrate graph changes through reviewed reconciliation.
- Read access to another graph does not grant write authority over it.
- Ask when identity, ownership, required decisions or evidence is ambiguous.
- Preserve user-authored instructions and project documentation during upgrades.
- Keep secrets, live operational receipts, accounting and private execution state
  out of public project-memory exports.

# Compatibility

`COLLABORATION.md` is canonical for shared collaboration preferences.
[HUMAN.md](HUMAN.md) retains the legacy human-profile alias. Preserve any local
notes there; consolidate them only through an explicitly reviewed change.
