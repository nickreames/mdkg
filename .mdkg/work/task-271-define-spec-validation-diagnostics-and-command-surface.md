---
id: task-271
type: task
title: define SPEC validation diagnostics and command surface
status: done
priority: 1
epic: epic-48
parent: goal-8
tags: [spec, validation, diagnostics, cli]
owners: []
links: []
artifacts: []
relates: [goal-8, epic-48, test-102]
blocked_by: [task-268, task-270]
blocks: [task-272, task-276]
refs: [edd-14]
aliases: [spec-validation-diagnostics]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Define future validation behavior and command-surface options for SPEC files.

# Acceptance Criteria

- Diagnostics distinguish fatal errors, warnings, repair suggestions, and
  informational notes.
- Candidate command surfaces are compared, including `mdkg spec validate` and
  integration with existing `mdkg validate` and capability commands.
- This task records a design, not source implementation.

# Test Plan

- `mdkg capability search "SPEC validation diagnostics" --json`
- `mdkg validate`

# Files Affected

- mdkg planning nodes only.

# Implementation Notes

- Compare command-surface options without implementing them.
- Current `mdkg validate` emits `{ action: "validated", ok, warning_count,
  error_count, warnings, errors, report_path? }`. Future SPEC diagnostics
  should preserve that repo-level receipt while adding focused SPEC detail in a
  later implementation task.

# Diagnostics Contract

Future SPEC validation should produce diagnostics that are precise enough for a
human or agent to repair the SPEC without guessing. This task defines the
design only; no source, parser, command, template, or fixture files are changed.

## Diagnostic Classes

- `error`: fatal for canonical validation. Use when a SPEC is unsafe,
  structurally invalid, impossible to index correctly, or violates a required
  canonical contract.
- `warning`: non-fatal but repair-worthy. Use for compatibility windows, weak
  inference, legacy minimal scaffolds, or missing recommended material where
  current mdkg behavior must remain valid.
- `repair`: a machine-readable suggestion attached to an `error` or `warning`,
  not a standalone severity. Repair suggestions should name the section, key,
  file, or command a future agent can change.
- `info`: non-gating context. Use for accepted deferred sections, explicit
  `None`/`Read-only` choices, optional examples, and compatibility
  explanations.

Every diagnostic should include:

- `severity`: `error`, `warning`, or `info`;
- optional `repair` text when a specific fix is known;
- `code`: stable kebab-case identifier such as
  `spec.missing-required-section`;
- `path`: repo-relative file path;
- optional `line` and `heading`;
- `message`: concise human-readable explanation;
- `source`: `section`, `frontmatter`, `template`, `fixture`, `projection`, or
  `capability-index`;
- `gated_by`: the rule source, such as `task-267`, `task-268`, `task-269`, or
  `task-270`.

## Rule Families

Future SPEC diagnostics should cover these families:

- section contract from `task-267`;
- frontmatter contract and unknown-key policy from `task-268`;
- template naming and default-scaffold compatibility from `task-269`;
- positive/negative fixture coverage from `task-270`;
- no-secret and no-product-specific canonical naming policy from `edd-14` and
  `dec-24`;
- capability-index extraction expectations from `task-272`;
- projection drift and no-overwrite policy from later projection tasks.

## Command Surface Options

Candidate command surfaces:

- Extend `mdkg validate`.
  - Pros: keeps the existing repo trust gate canonical, runs before task
    closeout, and preserves current CI habits.
  - Cons: full SPEC diagnostics may be too noisy for users who only want graph
    health.
  - Decision: required integration point. Future implementation should add SPEC
    findings to `mdkg validate` after the diagnostic contract and fixtures are
    implemented.
- Add `mdkg spec validate [path] [--json]`.
  - Pros: focused authoring loop for one SPEC file or fixture corpus; clearer
    than forcing all users through full graph validation.
  - Cons: introduces a new top-level command family and docs surface.
  - Decision: preferred focused command for future implementation after goal-8
    design is complete.
- Add `mdkg validate --specs` or `mdkg validate --profile specs`.
  - Pros: smaller command-surface expansion than a new family.
  - Cons: overloaded `validate` flags can become hard to teach, and the current
    command has intentionally small flags.
  - Decision: acceptable fallback if implementation wants fewer command
    families, but less ergonomic than `mdkg spec validate`.
- Use only `mdkg capability ...`.
  - Pros: capability commands already expose cached SPEC records and search.
  - Cons: capability discovery is read-only cache inspection, not validation.
  - Decision: not sufficient as a validator. Capability commands may surface
    indexed diagnostics later, but they should not become the validation gate.

## Recommended Future Surface

Preferred future shape:

```text
mdkg spec validate [path] [--json] [--strict] [--compat]
mdkg spec validate --fixtures [--json]
mdkg validate [--json]
mdkg capability show <spec-id> --json
```

Semantics:

- `mdkg spec validate` validates one SPEC, a directory, or the default SPEC
  fixture corpus when `--fixtures` is passed.
- `--strict` treats compatibility warnings as errors for canonical promoted
  templates and fixtures.
- `--compat` preserves warning-level behavior for legacy minimal scaffolds.
- `mdkg validate` remains the repo-wide trust gate and should include SPEC
  errors plus warning counts once implemented.
- `mdkg capability show` remains read-only and may display indexed SPEC fields
  and summary diagnostic metadata, but it must not run validation.

## JSON Receipt Shape

Future SPEC validation JSON should be deterministic and close to the existing
`validate` receipt:

```json
{
  "action": "spec.validated",
  "ok": true,
  "target": "path-or-all",
  "strict": false,
  "compat": true,
  "warning_count": 0,
  "error_count": 0,
  "info_count": 0,
  "diagnostics": []
}
```

Repo-wide `mdkg validate --json` should keep its existing top-level shape for
compatibility. A later implementation may add `spec_diagnostics` or
`diagnostics` only after command matrix and tests define the compatibility
impact.

## Deferral Boundary

This node does not implement:

- parser changes;
- `mdkg spec` command dispatch;
- fixture files;
- capability-index changes;
- projection drift checks.

Those remain in `task-272`, `task-276`, and later goal-8 nodes.

# Links / Artifacts

- `goal-8`
- `epic-48`
