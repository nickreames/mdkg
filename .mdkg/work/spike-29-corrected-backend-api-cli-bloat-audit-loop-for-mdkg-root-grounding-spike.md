---
id: spike-29
type: spike
title: Corrected backend API CLI bloat audit loop for mdkg root grounding spike
status: done
priority: 1
parent: loop-4
tags: [loop-template, audit, backend, api, cli, loop-fork, loop-child, spike]
owners: []
links: []
artifacts: []
relates: [loop-4]
blocked_by: []
blocks: []
refs: [loop-4, prop-4, task-691, task-692, test-366, template://loops/backend-api-cli-bloat-audit]
context_refs: []
evidence_refs: []
aliases: []
skills: [pursue-mdkg-loop]
created: 2026-07-06
updated: 2026-07-06
---
# Research Question

What source-grounded context, constraints, risks, and viable options should Corrected backend API CLI bloat audit loop for mdkg root use for mdkg root repository?

# Context And Constraints

- This spike prepares `loop-4`; it does not replace the backend/API/CLI bloat audit loop.
- The loop is read-only by default and may create mdkg evidence, proposals, decisions, tasks, tests, checkpoints, and open questions.
- External compatibility checks, service calls, downstream repo checks, or behavior-changing work require explicit approval or accepted waiver.
- Local read-only inventory, local tests, local builds, generated help inspection, and mdkg validation are pre-approved for this loop when they do not mutate functional source or provider state.
- `loop-2`, `spike-26`, `task-687`, and `test-363` are preserved as stale fork/superseded evidence.

# Search Plan

- Inspect mdkg context before broad source exploration.
- Read `loop-4`, `task-690`, `test-365`, and `pursue-mdkg-loop` before deciding whether the loop is runnable.
- Resolve pre-run questions about scope priority, local test/build approval, and downstream compatibility checks.
- Inventory command/API surfaces, flags/options, command handlers, output formats, help/docs generation, package/module boundaries, duplicated logic, and compatibility-sensitive surfaces.
- Build the required evidence lane table before execution so blocked lanes can be separated from actionable lanes.
- Use source and web grounding when the loop hits a blocker or when external/current facts are required.

# Findings

Audit date: 2026-07-06.

Pre-run answers:

- Scope: mdkg root repository CLI and backend command implementation.
- Local tests/builds: approved by prior operator instruction for read-only
  audit loops.
- External compatibility checks, service calls, and downstream repo checks: not
  approved for this run and not required to complete local evidence lanes.
- Optimization priority: compatibility first, then simplicity and public CLI
  ergonomics.

Inventory:

- The generated command contract exposes 115 public help targets across 34
  categories.
- Safety metadata classifies 56 targets as read-only, 40 as moderate, 16 as
  mixed, and 3 as high danger.
- `src/cli.ts` is 3,684 lines and contains 34 `print*Help` functions, 16
  subcommand router functions, 217 `requireFlagValue` references, 145
  `parseBooleanFlag` references, and 172 `UsageError` references.
- The largest command handler modules are `work.ts` at 1,709 lines, `fix.ts` at
  1,544 lines, `subgraph.ts` at 1,233 lines, `graph.ts` at 1,128 lines,
  `loop.ts` at 982 lines, `db.ts` at 954 lines, `validate.ts` at 949 lines,
  and `bundle.ts` at 935 lines.
- The highest-flag command targets are `new` with 24 flags, `pack` with 20,
  `skill new` with 10, `init` and `validate` with 9, and several command
  families at 7 or 8.

Source-grounded risks:

- CLI dispatch, help text, flag parsing, help target lists, command-contract
  safety metadata, docs generation, and tests are spread across several files.
  The current checks catch drift, but the architecture still requires repeated
  edits for new command behavior.
- `scripts/generate-command-contract.js` extracts flags from rendered help
  text. This keeps contract generation simple, but it can infer weak flag
  descriptions from notes rather than explicit option metadata.
- `work` and `db queue` are intentionally broad public namespaces. Their
  command handlers are internally cohesive, but their help/contract records are
  grouped more coarsely than the actual leaf actions.
- `new` is the most flag-heavy command and mixes graph work items, design docs,
  and agent workflow file creation. The help is clear, but future additions
  should avoid adding more generic flags unless they apply across most node
  families.

Positive evidence:

- The command contract check passed with hash
  `547c7f55bc28db0e92a38f97ed013414c7d2c45ddb08f1adee00d78692059c1e`.
- Live help for `new`, `pack`, `work`, `db queue`, `loop`, `goal`, `task`,
  `skill`, `subgraph`, and `validate` is coherent enough for current users and
  agents.
- Loop implementation is reasonably isolated: `mdkg loop` has a narrow command
  surface and focused tests in `tests/commands/loop.test.ts`.
- No current behavior failure or compatibility blocker was proven in this audit.

# Options And Tradeoffs

- Option 1: inventory CLI/API surfaces first, then rank simplification opportunities by user-facing risk and implementation effort.
- Option 2: start from internal module boundaries and duplicate logic, then map findings back to public command/API behavior.
- Option 3: produce a proposal-only audit with at least three simplification paths before any implementation goal is created.

# Recommendation

Do not treat this spike as a substitute for the loop execution. It should prepare the corrected loop to run by identifying applicable evidence lanes, open approvals, and scope boundaries. The runner should continue every authorized lane before recommending done, blocked, or waiver decisions.

Recommended audit outcome: accept `prop-4` as the design proposal, keep
`task-691`, `task-692`, and `test-366` as residual simplification work, and do
not block publication on this audit lane unless another release gate requires
internal CLI architecture cleanup first.

# Follow-Up Nodes To Create

- Proposal node for major simplification paths with at least three viable options.
- Fresh task/test nodes only after `loop-4` classifies follow-up work as compatibility-blocking or residual simplification.

Created:

- `prop-4`: simplify CLI command dispatch and command contract surfaces.
- `task-691`: refactor CLI dispatch toward typed command descriptors.
- `task-692`: improve command contract flag extraction and descriptions.
- `test-366`: preserve help and command contract parity during future refactor.

# Skill Candidates

- `select-work-and-ground-context`
- `verify-close-and-checkpoint`

# Evidence And Sources

Template: template://loops/backend-api-cli-bloat-audit

- `src/cli.ts:280`: `printNewHelp`.
- `src/cli.ts:318`: `printLoopHelp`.
- `src/cli.ts:396`: `printDbHelp`.
- `src/cli.ts:518`: `printPackHelp`.
- `src/cli.ts:1007`: `printWorkHelp`.
- `src/cli.ts:1551`: `requireFlagValue`.
- `src/cli.ts:1565`: `parseBooleanFlag`.
- `src/cli.ts:1752`: `runDbSubcommand`.
- `src/cli.ts:2437`: `runWorkSubcommand`.
- `src/cli.ts:2778`: `runLoopSubcommand`.
- `src/cli.ts:3095`: `runCommand`.
- `src/util/argparse.ts:8`: global value/boolean flag registry begins.
- `scripts/cli_help_targets.js:1`: command help target list.
- `scripts/generate-command-contract.js:636`: help-text flag extraction.
- `scripts/generate-command-contract.js:728`: command record generation from
  rendered help.
- `tests/commands/command_contract.test.ts:41`: contract target parity test.
- `tests/commands/loop.test.ts:282`: loop fork materialization coverage.
