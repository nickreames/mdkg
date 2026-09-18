---
id: bug-39
type: bug
title: Reject unsupported command options before dispatch and unintended writes
status: done
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-39-unknown-option-reproduction.json, .mdkg/artifacts/goal-86/bug-39-local-verification.json]
relates: []
blocked_by: [bug-17]
blocks: []
refs: [task-828, test-486]
context_refs: [goal-86, dec-96, goal-84, goal-83]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-12
updated: 2026-09-15
---

# Current Successor Contract - 2026-09-13

2026-09-15 local implementation acceptance: the pure option gate now covers 151
concrete command paths, including 22 creation-type variants, before both CLI
entrypoints discover configuration or attempt effects. Candidate review found
two reproducible gaps (explicit init-help agent overload and type-specific new
options); both are corrected and separately re-reviewed. Full source discovery
passes 1,463 tests; focused compatibility/containment coverage passes 126 tests.
One unchanged intermediate installed tarball passes 194 process refusals, 388
direct-entrypoint refusals, 41 unindexed-graph refusals and seven positive controls
on each Node24.15.0/24.18.0/26.0.0 on macOS. Evidence is
.mdkg/artifacts/goal-86/bug-39-local-verification.json.

This closes the bounded implementation obligation, not final test486, task828,
Standard or macOS/Linux launch qualification. The intermediate package still
identifies as0.5.2; no0.6.0 seal or release readiness is claimed. Early admission
covers unsupported/wrong-command flags, missing values and malformed Boolean/
integer syntax. Supported-option domain, mode and graph semantics remain their
existing command validation; this is not a universal zero-effect promise for
every possible invalid command. Full-suite fixtures formerly using ignored
flags now reach their intended archive, metadata and containment paths. No
security gate, source assertion or historical finding was waived.

Retain this bug and test486, not a duplicate finding. Inventory all real command
options and enforce early refusal before config and all side effects, in both
entrypoints. Positive compatibility controls remain mandatory. Local implementation
closure precedes final installed test486 and independent task828; do not create
a bug/test/review completion cycle.

The earlier sections below retain their historical evidence. This current addendum,
updated dependencies, goal-86 and dec-96 govern the remaining work. Planning
authoring is not execution, qualification, a writer claim, or publication.

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
