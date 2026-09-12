---
id: bug-39
type: bug
title: Reject unsupported command options before dispatch and unintended writes
status: todo
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-39-unknown-option-reproduction.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-84, goal-83, task-828, test-486]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-09-12
updated: 2026-09-12
---
# Overview

Goal: reject unsupported command options before dispatch, filesystem changes or
subprocesses. Owner mdkg-project-agent. A request that looks observational can
silently execute a mutating command because unrecognized options are ignored.
This is a functional publication blocker, not a new Standard scan finding.

# Reproduction Steps

1. Initialize an owned disposable graph using the actual installed 0.5.2 package
   or the current intermediate candidate on Node24.18.0.
2. Inventory file hashes, then run `mdkg index --verify --json`.
3. Both packages exit zero and change capabilities.json, global.json, skills.json,
   subgraphs.json and mdkg.sqlite. No authored-source or staged-content loss was
   observed. The fixture is removed after preserving the sanitized receipt.
4. The supported observational command is `mdkg db index verify --json`.

# Expected vs Actual

- Expected: unsupported options produce a usage error before command effects.
- Actual: the parser retains unknown options and dispatch ignores them; an index
  rebuild runs despite the unsupported verify request. Current Bug37 guards the
  explicitly retired consumer options but does not fix general option handling.

# Suspected Cause

src/util/argparse.ts accepts unregistered flags. src/cli.ts command dispatch
checks known arguments but has no complete command-specific unsupported-option
gate. Do not assume the global parser registry is a complete supported surface:
some legitimate command options are currently consumed directly by handlers.

# Fix Plan

Inventory current handler/help/command-contract options, aliases, value forms
and command paths. Establish one explicit supported-option contract that rejects
unknown or wrong-command options before config discovery and dispatch in both
synchronous and asynchronous entrypoints. Preserve documented aliases, valid
options and ordinary positional text; do not infer new commands or meanings.
Retired-command refusal remains strict. Follow the rejected input into output,
Git, cache, event and authentication sinks; no fallback execution is acceptable.

Allowed: scoped CLI/parser/command-contract source, direct regression and
installed fixtures, required generated references and mdkg evidence. Local
explicit-path commit only after review. No Git wrapping, remote operations,
canonical migration/bundle refresh, consumer policy or unrelated repairs. Stop
for an ambiguous supported behavior requiring a new product decision.

Done when test486 proves the failing cases and passing compatibility controls,
the complete test/contract/docs checks pass, and task828 independently reviews
the final source range. Leave unclaimed until it becomes the owned work item.

# Test Plan

Test486 owns negative and positive option matrices. Include unknown options on
mutators, wrong-command known flags, inline/separate values, aliases, flags
before/after command positionals, malformed/missing values, help outside a graph,
and both entrypoints. Full fixture inventories and subprocess traps must show
zero changes on rejected input. Installed cases use Node24.15.0/24.18.0/26.0.0.
Keep genuine mutation and observational controls to avoid making commands inert.

# Links / Artifacts

- `.mdkg/artifacts/goal-84/bug-39-unknown-option-reproduction.json`
- root:chk-606 raised the initial observation; this reproduction confirms it.
- root:test-486; root:task-828. Publication remains blocked; no waiver.
