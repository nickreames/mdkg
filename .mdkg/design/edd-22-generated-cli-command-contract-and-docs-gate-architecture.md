---
id: edd-22
type: edd
title: generated cli command contract and docs gate architecture
tags: [cli-spec, command-contract, docs, mdkg-dev, 0-3-8, 0-3-9]
owners: []
links: []
artifacts: []
relates: []
refs: []
aliases: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

mdkg needs generated command documentation before `mdkg.dev` publishes public
command reference pages. The existing `scripts/cli_help_snapshot.js` proves help
usage lines remain listed in `CLI_COMMAND_MATRIX.md`, but it is intentionally
too shallow to become the public docs source of truth: it does not classify
mutating behavior, JSON shapes, receipts, read/write paths, dry-run support, or
operator risk.

This design defines an mdkg-native CLI command contract as the canonical command
metadata layer. OpenCLI or website-specific formats can be generated from this
contract later, but they must remain projections. The source of truth should be
generated from the shipped CLI code, curated command metadata, and checked into
release gates so docs drift is caught before publish.

# Architecture

The generated contract has four layers:

1. Command registry: a source-side registry that enumerates every public command
   path, subcommand, aliases, visibility, and command family.
2. Behavior metadata: curated fields for mutation policy, read/write paths,
   dry-run support, receipt type, danger level, output formats, examples, and
   docs category.
3. Generated artifact: deterministic JSON written by a script such as
   `scripts/generate-command-contract.js` and published in package assets, for
   example `dist/command-contract.json`.
4. Projections: `CLI_COMMAND_MATRIX.md`, mdkg.dev command reference, and
   optional OpenCLI output derive from the generated contract instead of
   becoming separate sources of truth.

`scripts/cli_help_snapshot.js` should either consume the same registry or be
replaced by a stricter contract check. Help text remains useful UX, but
documentation correctness should be validated against structured metadata.

# Data model

Top-level envelope:

- `schema_version`: integer, starting at `1`.
- `generated_at`: ISO timestamp, excluded from drift hashes where needed.
- `tool`: `mdkg`.
- `package_version`: package version at generation time.
- `commands`: sorted list of command records.
- `projections`: generated projection metadata, including command matrix,
  mdkg.dev input, and optional OpenCLI output paths when present.
- `contract_hash`: stable hash over canonical command records.

Command record fields:

- `path`: command path array, for example `["db", "queue", "enqueue"]`.
- `usage`: usage lines exactly as help exposes them.
- `summary`: short docs sentence.
- `description`: longer docs summary when needed.
- `category`: `core`, `graph`, `agent`, `project-db`, `archive`, `subgraph`,
  `operator`, `repair`, `admin`, or `generated`.
- `status`: `stable`, `preview`, `deprecated`, or `removed-compat`.
- `visibility`: `public`, `internal`, or `hidden`.
- `aliases`: command aliases or compatibility command paths.
- `args`: positional argument specs with name, required, repeatable, and
  allowed value metadata.
- `flags`: option specs with type, default, repeatability, conflicts, implies,
  and structured-output behavior.
- `output_formats`: supported output modes such as `text`, `json`, `xml`,
  `toon`, and `md`.
- `json_schema`: inline schema or `$ref` for JSON stdout.
- `exit_codes`: stable exit code meanings.
- `side_effects`: `none`, `read-files`, `write-graph`, `write-config`,
  `write-index`, `write-db`, `write-archive`, `write-bundle`,
  `write-subgraph`, `write-output-path`, or `external-process`.
- `read_paths`: path globs read by the command.
- `write_paths`: path globs written by the command.
- `lock_policy`: `not-needed`, `mutation-lock`, `sqlite-transaction`,
  `exclusive-create`, or `external`.
- `atomic_write_policy`: `none`, `atomic-rename`, `exclusive-create`,
  `sqlite-transaction`, or `temp-dir-rename`.
- `dry_run`: `supported`, `not-applicable`, `not-supported`, or
  `required-before-apply`.
- `receipts`: receipt action names emitted by JSON output.
- `danger_level`: `read-only`, `local-write`, `repair-plan`, `destructive`,
  `external-effect`, or `publish`.
- `examples`: executable examples with setup requirements and expected output
  format.
- `docs`: docs slug, guide links, related commands, and mdkg.dev reference
  placement.

# APIs / interfaces

Internal generation interfaces:

- `npm run cli:contract` should build or check the mdkg-native command
  contract.
- `node scripts/generate-command-contract.js --check` should fail if generated
  artifacts drift from source metadata and help output.
- `node scripts/generate-command-contract.js --write` should refresh generated
  artifacts deterministically.

Public/read interfaces after implementation:

- A committed or packaged `dist/command-contract.json` should be available for
  downstream docs tooling.
- A future `mdkg command contract --json` command may expose the same contract,
  but it is not required for the first implementation if the package artifact
  and script are sufficient.
- OpenCLI export is optional and must be generated from the mdkg-native
  contract, never maintained as the canonical metadata.

# Failure modes

- Missing command record: generation fails when a help target exists without a
  contract record.
- Stale help or matrix: `--check` fails and reports missing command paths or
  drifted usage lines.
- Undocumented mutating command: generation fails when `side_effects`,
  `write_paths`, `lock_policy`, or `danger_level` are absent for a command that
  mutates state.
- JSON contract drift: stable hash changes and the check reports the command
  records that changed.
- Example drift: docs-readiness smoke fails when examples cannot execute in a
  temp repo.
- Projection drift: mdkg.dev/OpenCLI projection check fails while the
  mdkg-native contract remains canonical.

# Observability

- Contract generation prints a concise receipt with command count, hash,
  artifact paths, projection paths, and drift status.
- JSON checks keep machine-readable output on stdout and diagnostics on stderr.
- Publish readiness asserts that the built package includes the contract and
  that the contract hash matches source generation.
- Docs-readiness smoke reports temp repo path, examples executed, and command
  docs generated from contract output.

# Security / privacy

- The contract must not include environment variables, npm tokens, local user
  paths outside generated temp paths, or raw private graph content.
- Examples should use synthetic IDs, local temp repos, and no network/provider
  actions.
- Commands with external effects, publish behavior, destructive behavior, or
  secret-sensitive surfaces must carry explicit `danger_level` and `docs`
  warnings.
- mdkg.dev may publish public command metadata only after filtering out hidden
  or internal command records.

# Testing strategy

- Unit tests validate schema shape, sorted command paths, stable contract hash,
  complete help-target coverage, and required safety metadata for mutating
  commands.
- CLI parity tests ensure every command usage line in help exists in the
  contract and every public contract path has help coverage.
- A packed temp-repo smoke generates docs/reference artifacts from the packaged
  contract and executes representative examples.
- Publish-readiness checks require the built contract artifact and fail if the
  old hand-maintained command matrix is the only command reference.
- `mdkg.dev` launch planning remains blocked until generated docs evidence
  exists.

# Rollout plan

1. `task-328`: capture this design and follow-on nodes.
2. `task-345`: implement mdkg-native command contract generator and schema.
3. `test-141`: validate command contract schema, help coverage, and drift
   checks.
4. `task-346`: add docs-readiness smoke, generated docs projection, package
   gate, and publish-readiness assertions.
5. `test-131`: validate mdkg.dev command docs remain blocked until generated
   command docs exist and examples pass.
6. `task-330`: plan mdkg.dev launch using generated contract outputs as the
   command reference input.

No public mdkg.dev command reference should ship from hand-maintained tables
alone.
