---
id: prop-4
type: prop
title: Simplify CLI command dispatch and command contract surfaces
tags: [loop-followup, cli, bloat, proposal]
owners: []
links: []
artifacts: []
relates: [loop-4]
refs: [loop-4, spike-29, task-690, test-365, task-691, task-692, test-366]
aliases: []
created: 2026-07-06
updated: 2026-07-06
---
# Summary

Refactor mdkg CLI internals toward typed command descriptors so dispatch,
help text, command-contract metadata, and tests can share one source of
command truth while preserving the current public command surface.

# Motivation

The backend/API/CLI bloat audit found no immediate behavior failure, but it did
find maintainability pressure in the current command architecture:

- `src/cli.ts` is the live command router and help source, currently 3,684 lines.
- The generated command contract contains 115 public help targets across 34
  categories.
- `src/cli.ts` manually repeats flag parsing at many call sites, including 217
  `requireFlagValue` references and 145 `parseBooleanFlag` references.
- `src/util/argparse.ts` maintains global value/boolean flag sets that must stay
  aligned with every command family.
- `scripts/generate-command-contract.js` derives contract flags from help text,
  which is useful but can produce weak descriptions when a flag appears in a
  note rather than an option definition.

This matters because mdkg is becoming a broad agent-facing CLI. The public
surface can stay broad, but the internal command metadata should become easier
to inspect, test, and extend without adding accidental drift.

# Proposal

Recommended path:

1. Introduce typed command descriptors behind the existing CLI.
   - Keep `mdkg <command>` syntax unchanged.
   - Describe usage, args, flags, output formats, safety metadata, and handler
     binding in structured TypeScript.
   - Migrate one command family at a time, starting with a lower-risk family
     such as `loop`, `skill`, or `task`.
2. Generate help text and command contract records from descriptors.
   - Keep current help output stable at first.
   - Replace broad help-text scraping with explicit flag descriptions.
   - Keep `scripts/cli_help_targets.js` only as a compatibility/check surface
     until descriptors can enumerate targets.
3. Split oversized command modules only when descriptors expose clear seams.
   - Strong first candidates are `work`, `db queue`, and `subgraph`.
   - Preserve public command names and JSON envelopes.

# Impact

- Users and agents see the same public CLI, but command metadata becomes more
  precise and easier to validate.
- Command-contract flag descriptions become authoritative instead of inferred
  from prose.
- Future command additions should require fewer synchronized edits across
  `src/cli.ts`, `src/util/argparse.ts`, help tests, CLI matrix generation, and
  safety metadata.
- Refactors can be gated by existing parity checks: command contract, CLI help
  matrix, docs check, and focused command tests.

# Risks

- The main risk is breaking a stable public CLI while moving internals. Mitigate
  with descriptor-by-descriptor migration and snapshot/contract checks.
- A descriptor system can become over-abstracted. Keep descriptors close to
  current command behavior and migrate only when they remove duplication.
- Generated help text may lose hand-authored nuance. Preserve a freeform notes
  field and compare generated output against the current help matrix before
  switching commands over.

# Alternatives

- Option 1: descriptor-first migration. Build a minimal descriptor model and
  migrate one command family at a time. This is the recommended path because it
  directly reduces drift while preserving compatibility.
- Option 2: split large handler files without descriptors. This is faster for
  local readability, but it does not solve help/contract/parser drift.
- Option 3: keep current architecture and add stricter tests only. This has the
  lowest short-term risk but leaves the underlying bloat in place.

# Next Steps

- Work `task-691` as residual simplification when implementation bandwidth is
  available.
- Work `task-692` if command-contract consumers need better flag descriptions
  before the broader descriptor migration.
- Use `test-366` as the regression gate for any CLI bloat refactor.
