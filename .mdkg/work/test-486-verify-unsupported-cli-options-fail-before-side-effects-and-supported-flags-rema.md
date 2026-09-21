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
artifacts: [.mdkg/artifacts/goal-84/bug-39-unknown-option-reproduction.json, .mdkg/artifacts/goal-86/bug-39-local-verification.json]
relates: []
blocked_by: [bug-39, task-827]
blocks: []
refs: [task-828]
context_refs: [goal-86, dec-96, goal-84]
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-09-12
updated: 2026-09-15
---

# Current Successor Contract - 2026-09-13

Unknown/wrong-command options, missing values and malformed Boolean/integer syntax
fail in both entrypoints before config, files, Git index, cache, events,
authentication or subprocess effects. Preserve valid flags/aliases/positionals
and real mutation controls. Supported-option domain, mode and graph-semantic
validation remain separate; no universal pre-config guarantee is inferred for
every invalid invocation.

This test no longer waits for task826 or Bug7 aggregate closure. Its updated
implementation prerequisites lead into installed cases; task826 consumes the
results. Record historical/current-intermediate/final-artifact-pass/failure/
unverified states. Final qualification uses one frozen0.6.0 tarball; macOS/Linux
completeness is independently bound by test487. Task828 remains independent
acceptance, not an upstream requirement for these test results.

The earlier sections below retain their historical evidence. This current addendum,
updated dependencies, goal-86 and dec-96 govern the remaining work. Planning
authoring is not execution, qualification, a writer claim, or publication.

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

Current-intermediate evidence on2026-09-15: Bug39's local remedy passes1,463
discovered source tests and126 focused tests, with CLI/contract/docs/workflow
parity. The exact intermediate0.5.2 tarball with SHA256
0a08f31c0bda67674a4acca7fce30c2ab01f00e8799deeaf17ae33a41cb52d20
passes194 process refusals,388 direct-entrypoint refusals,41 unindexed-graph
refusals and seven positive controls on each required Node runtime on macOS.
Complete inventories and subprocess traps show no rejected-input effects.
The attached bug-39-local-verification.json binds source/package/runtime hashes,
review corrections and full-suite failure dispositions. This test remains todo
until the finalized0.6.0 artifact and required platform matrix are qualified.

Historical initial state: reproduction confirmed only; the older reproduction
artifact was not a fix receipt and remains unchanged.

# Notes / Follow-ups

- No automatic compatibility waiver. Do not treat the incomplete global parser
  flag registry as the full command contract without inspecting handlers.
- Future source changes invalidate the final package qualification seal.
