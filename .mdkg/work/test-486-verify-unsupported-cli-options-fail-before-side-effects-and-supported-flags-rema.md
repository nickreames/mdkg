---
id: test-486
type: test
title: Verify unsupported CLI options fail before side effects and supported flags remain compatible
status: todo
priority: 1
parent: bug-39
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-39-unknown-option-reproduction.json]
relates: []
blocked_by: [bug-39]
blocks: []
refs: [goal-84, task-828]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-09-12
updated: 2026-09-12
---
# Overview

Verify Bug39 rejects unsupported or wrong-command options before side effects
while retaining all supported CLI options and native Git boundaries.

# Target / Scope

CLI/parser/command-contract dispatch, synchronous and asynchronous entrypoints,
installed help, genuine mutation controls and read-only verification controls.
Owner mdkg-project-agent; Goal84 publication blocker verification.

# Preconditions / Environment

Owned synthetic graphs and subprocess traps under /private/tmp, exact installed
candidate hash, Node24.15.0/24.18.0/26.0.0. Current reproduction also binds actual
published0.5.2. No canonical graph migration, remote Git or provider action.

# Test Cases

- `index --verify --json` rejects without creating/updating any index file.
- Unsupported options on `new`, `task`, `goal`, `work`, `upgrade` and graph
  mutation paths reject before source, lifecycle, events, locks or output writes.
- Wrong-command known flags do not silently turn validation/preview into action.
- Documented global and command aliases, inline/separate values, argument order,
  Boolean forms, help and ordinary positional text remain compatible.
- Missing values and retired options fail explicitly; an adjacent option cannot
  be swallowed and accidentally become an output path or command argument.
- Subprocess traps prove no Git/auth/remote execution on rejected arguments;
  full path/mode/hash inventories cover source, indexes and staged bytes.
- Supported `db index verify` stays observational; explicit `index` still
  rebuilds derived state. Real authorized mutations remain functional.
- Complete tests, CLI contract/help, docs and installed smoke checks pass;
  task828 binds independent acceptance of the actual fix range.

# Results / Evidence

Reproduction confirmed only. Remediation and passing regression evidence remain
open; the linked artifact is not a fix receipt.

# Notes / Follow-ups

- No automatic compatibility waiver. Do not treat the incomplete global parser
  flag registry as the full command contract without inspecting handlers.
- Future source changes invalidate the final package qualification seal.
