# Generated CLI Reference

<!-- generated-from: dist/command-contract.json -->
<!-- contract-hash: 35e7a82190d09c19eb3c8823980d8f2b33b6a3aadfc4cf7f8c6f8249fadcdd71 -->

This generated page is the broad user-facing command reference. Start with the common command groups in the reference home, then use this page when you need the complete command list.

The page is generated from current command metadata in `dist/command-contract.json`, which keeps usage, flags, output formats, and safety notes aligned with the CLI.

- Tool: mdkg
- Package version: 0.5.1
- Schema version: 1
- Command count: 117
- Categories: archive, bundle, capability, checkpoint, db, doctor, event, fix, format, git, global, goal, graph, guide, handoff, index, init, list, loop, manifest, mcp, new, next, pack, search, show, skill, spec, status, subgraph, task, upgrade, validate, work, workspace

## Categories

- archive: 6
- bundle: 6
- capability: 4
- checkpoint: 1
- db: 4
- doctor: 1
- event: 3
- fix: 4
- format: 1
- git: 8
- global: 1
- goal: 13
- graph: 5
- guide: 1
- handoff: 1
- index: 1
- init: 1
- list: 1
- loop: 7
- manifest: 4
- mcp: 2
- new: 1
- next: 1
- pack: 1
- search: 1
- show: 1
- skill: 7
- spec: 4
- status: 1
- subgraph: 11
- task: 4
- upgrade: 1
- validate: 1
- work: 7
- workspace: 1

## archive

mdkg archive command

- Command: `mdkg archive`
- Mode: Mutating command
- Public status: stable / public
- Danger level: mixed

### When to use

Use for source evidence bundles and archive receipts.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--json]
mdkg archive list [--kind source|artifact] [--visibility private|internal|public] [--json]
mdkg archive show <id-or-archive-uri> [--json]
mdkg archive verify [id-or-archive-uri] [--json]
mdkg archive compress <id-or-archive-uri-or-qid|--all> [--ws <local-alias>] [--json]
```

### Examples

```bash
mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--json]
mdkg archive list [--kind source|artifact] [--visibility private|internal|public] [--json]
mdkg archive show <id-or-archive-uri> [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--id <archive.id>`: mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--json]
- `--json`: mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--json]
- `--kind source|artifact`: mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--visibility private|internal|public`: mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--json]
- `--ws <local-alias>`: mdkg archive compress <id-or-archive-uri-or-qid|--all> [--ws <local-alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-write-archive-sidecars
- Read paths: .mdkg/**
- Write paths: .mdkg/archive/**, .mdkg/index/**
- Lock policy: mutation-lock-required-for-add-compress
- Atomic write policy: atomic-file-writes-and-zip-temp-rename
- Receipts: archive-receipt

### Related commands

`mdkg archive add`, `mdkg archive compress`, `mdkg archive list`, `mdkg archive show`, `mdkg archive verify`

## archive add

mdkg archive add command

- Command: `mdkg archive add`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use for source evidence bundles and archive receipts.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--title <title>] [--refs <...>] [--relates <...>] [--json]
```

### Examples

```bash
mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--title <title>] [--refs <...>] [--relates <...>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--id <archive.id>`: mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--title <title>] [--refs <...>] [--relates <...>] [--json]
- `--json`: mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--title <title>] [--refs <...>] [--relates <...>] [--json]
- `--kind source|artifact`: mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--title <title>] [--refs <...>] [--relates <...>] [--json]
- `--refs <...>`: mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--title <title>] [--refs <...>] [--relates <...>] [--json]
- `--relates <...>`: mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--title <title>] [--refs <...>] [--relates <...>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--title <title>`: mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--title <title>] [--refs <...>] [--relates <...>] [--json]
- `--version`: --version, -V       Show version
- `--visibility private|internal|public`: mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--title <title>] [--refs <...>] [--relates <...>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-archive-sidecar
- Read paths: .mdkg/**
- Write paths: .mdkg/archive/**, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes-and-zip-temp-rename
- Receipts: archive-add-receipt

### Related commands

`mdkg archive`, `mdkg archive compress`, `mdkg archive list`, `mdkg archive show`, `mdkg archive verify`

## archive compress

mdkg archive compress command

- Command: `mdkg archive compress`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use for source evidence bundles and archive receipts.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg archive compress <id-or-archive-uri-or-qid> [--ws <local-alias>] [--json]
mdkg archive compress --all [--ws <local-alias>] [--json]
```

### Examples

```bash
mdkg archive compress --all [--ws <local-alias>] [--json]
mdkg archive compress <id-or-archive-uri-or-qid> [--ws <local-alias>] [--json]
```

### Common flags

- `--all [--ws <local-alias>]`: mdkg archive compress --all [--ws <local-alias>] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg archive compress <id-or-archive-uri-or-qid> [--ws <local-alias>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <local-alias>`: mdkg archive compress <id-or-archive-uri-or-qid> [--ws <local-alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: refresh-local-workspace-archive-zip-caches
- Read paths: .mdkg/**
- Write paths: .mdkg/archive/**, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: full-selection-preflight-then-per-file-atomic-replacement
- Receipts: archive-compress-receipt, archive-workspace-selection-receipt, read-only-exclusion-receipt

### Related commands

`mdkg archive`, `mdkg archive add`, `mdkg archive list`, `mdkg archive show`, `mdkg archive verify`

## archive list

mdkg archive list command

- Command: `mdkg archive list`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for source evidence bundles and archive receipts.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg archive list [--kind source|artifact] [--visibility private|internal|public] [--ws <alias>] [--json]
```

### Examples

```bash
mdkg archive list [--kind source|artifact] [--visibility private|internal|public] [--ws <alias>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg archive list [--kind source|artifact] [--visibility private|internal|public] [--ws <alias>] [--json]
- `--kind source|artifact`: mdkg archive list [--kind source|artifact] [--visibility private|internal|public] [--ws <alias>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--visibility private|internal|public`: mdkg archive list [--kind source|artifact] [--visibility private|internal|public] [--ws <alias>] [--json]
- `--ws <alias>`: mdkg archive list [--kind source|artifact] [--visibility private|internal|public] [--ws <alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg archive`, `mdkg archive add`, `mdkg archive compress`, `mdkg archive show`, `mdkg archive verify`

## archive show

mdkg archive show command

- Command: `mdkg archive show`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for source evidence bundles and archive receipts.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg archive show <id-or-archive-uri> [--ws <alias>] [--json]
```

### Examples

```bash
mdkg archive show <id-or-archive-uri> [--ws <alias>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg archive show <id-or-archive-uri> [--ws <alias>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg archive show <id-or-archive-uri> [--ws <alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg archive`, `mdkg archive add`, `mdkg archive compress`, `mdkg archive list`, `mdkg archive verify`

## archive verify

mdkg archive verify command

- Command: `mdkg archive verify`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for source evidence bundles and archive receipts.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg archive verify [id-or-archive-uri] [--ws <alias>] [--json]
```

### Examples

```bash
mdkg archive verify [id-or-archive-uri] [--ws <alias>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg archive verify [id-or-archive-uri] [--ws <alias>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg archive verify [id-or-archive-uri] [--ws <alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg archive`, `mdkg archive add`, `mdkg archive compress`, `mdkg archive list`, `mdkg archive show`

## bundle

mdkg bundle command

- Command: `mdkg bundle`
- Mode: Mutating command
- Public status: stable / public
- Danger level: mixed

### When to use

Use for portable graph bundle creation, verification, and import.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg bundle create [--profile private|public] [--ws <alias|all>] [--output <path>] [--json]
mdkg bundle verify [bundle-path] [--json]
mdkg bundle show <bundle-path> [--json]
mdkg bundle list [--json]
```

### Examples

```bash
mdkg bundle create [--profile private|public] [--ws <alias|all>] [--output <path>] [--json]
mdkg bundle show <bundle-path> [--json]
mdkg bundle verify [bundle-path] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg bundle create [--profile private|public] [--ws <alias|all>] [--output <path>] [--json]
- `--output <path>`: mdkg bundle create [--profile private|public] [--ws <alias|all>] [--output <path>] [--json]
- `--profile private|public`: mdkg bundle create [--profile private|public] [--ws <alias|all>] [--output <path>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias|all>`: mdkg bundle create [--profile private|public] [--ws <alias|all>] [--output <path>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-write-mdkg-bundles
- Read paths: .mdkg/**
- Write paths: .mdkg/bundles/**, .mdkg/index/**
- Lock policy: mutation-lock-required-for-create-import
- Atomic write policy: zip-temp-rename-and-atomic-file-writes
- Receipts: bundle-receipt

### Related commands

`mdkg bundle create`, `mdkg bundle import`, `mdkg bundle list`, `mdkg bundle show`, `mdkg bundle verify`

## bundle create

mdkg bundle create command

- Command: `mdkg bundle create`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use for portable graph bundle creation, verification, and import.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg bundle create [--profile private|public] [--ws <alias|all>] [--output <path>] [--json]
```

### Examples

```bash
mdkg bundle create [--profile private|public] [--ws <alias|all>] [--output <path>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg bundle create [--profile private|public] [--ws <alias|all>] [--output <path>] [--json]
- `--output <path>`: mdkg bundle create [--profile private|public] [--ws <alias|all>] [--output <path>] [--json]
- `--profile private|public`: mdkg bundle create [--profile private|public] [--ws <alias|all>] [--output <path>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias|all>`: mdkg bundle create [--profile private|public] [--ws <alias|all>] [--output <path>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-bundle-zip
- Read paths: .mdkg/**
- Write paths: .mdkg/bundles/**, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: zip-temp-rename
- Receipts: bundle-create-receipt

### Related commands

`mdkg bundle`, `mdkg bundle import`, `mdkg bundle list`, `mdkg bundle show`, `mdkg bundle verify`

## bundle import

mdkg bundle import command

- Command: `mdkg bundle import`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use for portable graph bundle creation, verification, and import.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg subgraph add/list/show/rm/enable/disable/verify/refresh/audit/upgrade-plan/sync/materialize ...
```

### Examples

```bash
mdkg subgraph add/list/show/rm/enable/disable/verify/refresh/audit/upgrade-plan/sync/materialize ...
```

### Common flags

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text
- Dry run: {"supported":false}
- Side effects: register-imported-subgraph-bundle
- Read paths: .mdkg/**
- Write paths: .mdkg/config.json, .mdkg/index/**, .mdkg/subgraphs/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-config-write
- Receipts: bundle-import-receipt

### Related commands

`mdkg bundle`, `mdkg bundle create`, `mdkg bundle list`, `mdkg bundle show`, `mdkg bundle verify`

## bundle list

mdkg bundle list command

- Command: `mdkg bundle list`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for portable graph bundle creation, verification, and import.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg bundle list [--json]
```

### Examples

```bash
mdkg bundle list [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg bundle list [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg bundle`, `mdkg bundle create`, `mdkg bundle import`, `mdkg bundle show`, `mdkg bundle verify`

## bundle show

mdkg bundle show command

- Command: `mdkg bundle show`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for portable graph bundle creation, verification, and import.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg bundle show <bundle-path> [--json]
```

### Examples

```bash
mdkg bundle show <bundle-path> [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg bundle show <bundle-path> [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg bundle`, `mdkg bundle create`, `mdkg bundle import`, `mdkg bundle list`, `mdkg bundle verify`

## bundle verify

mdkg bundle verify command

- Command: `mdkg bundle verify`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for portable graph bundle creation, verification, and import.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg bundle verify [bundle-path] [--json]
```

### Examples

```bash
mdkg bundle verify [bundle-path] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg bundle verify [bundle-path] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg bundle`, `mdkg bundle create`, `mdkg bundle import`, `mdkg bundle list`, `mdkg bundle show`

## capability

mdkg capability command

- Command: `mdkg capability`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use this command when the matching command family is the current workflow surface.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg capability list [--kind <kind>] [--visibility <level>] [--json]
mdkg capability search "<query>" [--kind <kind>] [--visibility <level>] [--json]
mdkg capability show <id-or-qid-or-slug> [--json]
mdkg capability resolve [query] [--requires <capability>] [--fresh-only] [--json]
```

### Examples

```bash
mdkg capability list [--kind <kind>] [--visibility <level>] [--json]
mdkg capability search "<query>" [--kind <kind>] [--visibility <level>] [--json]
mdkg capability show <id-or-qid-or-slug> [--json]
```

### Common flags

- `--fresh-only`: mdkg capability resolve [query] [--requires <capability>] [--fresh-only] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg capability list [--kind <kind>] [--visibility <level>] [--json]
- `--kind <kind>`: mdkg capability list [--kind <kind>] [--visibility <level>] [--json]
- `--requires <capability>`: mdkg capability resolve [query] [--requires <capability>] [--fresh-only] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--visibility <level>`: mdkg capability list [--kind <kind>] [--visibility <level>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg capability list`, `mdkg capability search`, `mdkg capability show`

## capability list

mdkg capability list command

- Command: `mdkg capability list`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use this command when the matching command family is the current workflow surface.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg capability list [--kind <kind>] [--visibility <level>] [--json]
```

### Examples

```bash
mdkg capability list [--kind <kind>] [--visibility <level>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg capability list [--kind <kind>] [--visibility <level>] [--json]
- `--kind <kind>`: mdkg capability list [--kind <kind>] [--visibility <level>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--visibility <level>`: mdkg capability list [--kind <kind>] [--visibility <level>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg capability`, `mdkg capability search`, `mdkg capability show`

## capability search

mdkg capability search command

- Command: `mdkg capability search`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use this command when the matching command family is the current workflow surface.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg capability search "<query>" [--kind <kind>] [--visibility <level>] [--json]
```

### Examples

```bash
mdkg capability search "<query>" [--kind <kind>] [--visibility <level>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg capability search "<query>" [--kind <kind>] [--visibility <level>] [--json]
- `--kind <kind>`: mdkg capability search "<query>" [--kind <kind>] [--visibility <level>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--visibility <level>`: mdkg capability search "<query>" [--kind <kind>] [--visibility <level>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg capability`, `mdkg capability list`, `mdkg capability show`

## capability show

mdkg capability show command

- Command: `mdkg capability show`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use this command when the matching command family is the current workflow surface.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg capability show <id-or-qid-or-slug> [--json]
```

### Examples

```bash
mdkg capability show <id-or-qid-or-slug> [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg capability show <id-or-qid-or-slug> [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg capability`, `mdkg capability list`, `mdkg capability search`

## checkpoint

mdkg checkpoint command

- Command: `mdkg checkpoint`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use this command when the matching command family is the current workflow surface.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg checkpoint new <title> [--kind implementation|test-proof|goal-closeout|audit|handoff] [--ws <alias>] [--json]
```

### Examples

```bash
mdkg checkpoint new <title> [--kind implementation|test-proof|goal-closeout|audit|handoff] [--ws <alias>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg checkpoint new <title> [--kind implementation|test-proof|goal-closeout|audit|handoff] [--ws <alias>] [--json]
- `--kind implementation|test-proof|goal-closeout|audit|handoff`: mdkg checkpoint new <title> [--kind implementation|test-proof|goal-closeout|audit|handoff] [--ws <alias>] [--json]
- `--note "<text>"`: [--relates <id,id,...>] [--scope <id,id,...>] [--run-id <id>] [--note "<text>"]
- `--relates <id,id,...>`: [--relates <id,id,...>] [--scope <id,id,...>] [--run-id <id>] [--note "<text>"]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--run-id <id>`: [--relates <id,id,...>] [--scope <id,id,...>] [--run-id <id>] [--note "<text>"]
- `--scope <id,id,...>`: [--relates <id,id,...>] [--scope <id,id,...>] [--run-id <id>] [--note "<text>"]
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg checkpoint new <title> [--kind implementation|test-proof|goal-closeout|audit|handoff] [--ws <alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-checkpoint-node
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: exclusive-create
- Receipts: checkpoint-receipt

### Related commands

none

## db

mdkg db command

- Command: `mdkg db`
- Mode: Mutating command
- Public status: stable / public
- Danger level: mixed

### When to use

Use for local project DB, queue, snapshot, and verification workflows.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg db index rebuild [--tolerant] [--json]
mdkg db index status [--json]
mdkg db index verify [--json]
mdkg db init [--json]
mdkg db migrate [--json]
mdkg db verify [--json]
mdkg db stats [--json]
mdkg db queue create <queue> [--paused] [--reason <text>] [--json]
mdkg db queue enqueue <queue> <message-id> --payload-json <json>|--payload-file <path> [--json]
mdkg db queue claim <queue> --lease-owner <owner> --lease-ms <ms> [--json]
mdkg db queue ack|fail|dead-letter <queue> <message-id> --lease-owner <owner> [--json]
mdkg db queue pause|resume <queue> [--json]
mdkg db queue stats|list|show ... [--json]
mdkg db queue contract [--json]
mdkg db snapshot seal [--queue-policy drain|paused] [--json]
mdkg db snapshot verify [--json]
mdkg db snapshot status [--json]
mdkg db snapshot dump [--snapshot <path>] [--output <path>] [--json]
mdkg db snapshot diff <left-snapshot> <right-snapshot> [--json]
```

### Examples

```bash
mdkg db index rebuild [--tolerant] [--json]
mdkg db index status [--json]
mdkg db index verify [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg db index rebuild [--tolerant] [--json]
- `--lease-ms <ms>`: mdkg db queue claim <queue> --lease-owner <owner> --lease-ms <ms> [--json]
- `--lease-owner <owner>`: mdkg db queue claim <queue> --lease-owner <owner> --lease-ms <ms> [--json]
- `--output <path>`: mdkg db snapshot dump [--snapshot <path>] [--output <path>] [--json]
- `--paused`: mdkg db queue create <queue> [--paused] [--reason <text>] [--json]
- `--payload-json <json>`: mdkg db queue enqueue <queue> <message-id> --payload-json <json>|--payload-file <path> [--json]
- `--queue-policy drain|paused`: mdkg db snapshot seal [--queue-policy drain|paused] [--json]
- `--reason <text>`: mdkg db queue create <queue> [--paused] [--reason <text>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--snapshot <path>`: mdkg db snapshot dump [--snapshot <path>] [--output <path>] [--json]
- `--tolerant`: mdkg db index rebuild [--tolerant] [--json]
- 1 additional flags omitted from this generated summary.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-write-project-db-and-snapshots
- Read paths: .mdkg/**
- Write paths: .mdkg/db/**, .mdkg/index/**
- Lock policy: mutation-lock-required-for-init-migrate-queue-snapshot-seal
- Atomic write policy: atomic-file-writes-and-sqlite-transactions
- Receipts: project-db-receipt, queue-receipt, snapshot-receipt

### Related commands

`mdkg db index`, `mdkg db queue`, `mdkg db snapshot`

## db index

mdkg db index command

- Command: `mdkg db index`
- Mode: Mutating command
- Public status: stable / public
- Danger level: mixed

### When to use

Use for local project DB, queue, snapshot, and verification workflows.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg db index rebuild [--tolerant] [--json]
mdkg db index status [--json]
mdkg db index verify [--json]
```

### Examples

```bash
mdkg db index rebuild [--tolerant] [--json]
mdkg db index status [--json]
mdkg db index verify [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg db index rebuild [--tolerant] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--tolerant`: mdkg db index rebuild [--tolerant] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-rebuild-sqlite-index
- Read paths: .mdkg/**
- Write paths: .mdkg/index/**
- Lock policy: mutation-lock-required-for-rebuild
- Atomic write policy: sqlite-transaction-and-temp-files
- Receipts: db-index-receipt

### Related commands

`mdkg db`, `mdkg db queue`, `mdkg db snapshot`

## db queue

mdkg db queue command

- Command: `mdkg db queue`
- Mode: Mutating command
- Public status: stable / public
- Danger level: mixed

### When to use

Use for local project DB, queue, snapshot, and verification workflows.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg db queue create <queue> [--paused] [--reason <text>] [--json]
mdkg db queue pause <queue> [--reason <text>] [--json]
mdkg db queue resume <queue> [--json]
mdkg db queue enqueue <queue> <message-id> --payload-json <json>|--payload-file <path> [--dedupe-key <key>] [--available-at-ms <ms>] [--max-attempts <n>] [--json]
mdkg db queue claim <queue> --lease-owner <owner> --lease-ms <ms> [--json]
mdkg db queue ack <queue> <message-id> --lease-owner <owner> [--json]
mdkg db queue fail <queue> <message-id> --lease-owner <owner> --error <text> [--retry-after-ms <ms>] [--json]
mdkg db queue dead-letter <queue> <message-id> --lease-owner <owner> --error <text> [--json]
mdkg db queue release-expired [queue] [--json]
mdkg db queue stats [queue] [--json]
mdkg db queue list <queue> [--status ready|leased|acked|dead_letter|all] [--limit <n>] [--json]
mdkg db queue show <queue> <message-id> [--json]
mdkg db queue contract [--json]
```

### Examples

```bash
mdkg db queue create <queue> [--paused] [--reason <text>] [--json]
mdkg db queue pause <queue> [--reason <text>] [--json]
mdkg db queue resume <queue> [--json]
```

### Common flags

- `--available-at-ms <ms>`: mdkg db queue enqueue <queue> <message-id> --payload-json <json>|--payload-file <path> [--dedupe-key <key>] [--available-at-ms <ms>] [--max-attempts <n>] [--json]
- `--dedupe-key <key>`: mdkg db queue enqueue <queue> <message-id> --payload-json <json>|--payload-file <path> [--dedupe-key <key>] [--available-at-ms <ms>] [--max-attempts <n>] [--json]
- `--error <text>`: mdkg db queue fail <queue> <message-id> --lease-owner <owner> --error <text> [--retry-after-ms <ms>] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg db queue create <queue> [--paused] [--reason <text>] [--json]
- `--lease-ms <ms>`: mdkg db queue claim <queue> --lease-owner <owner> --lease-ms <ms> [--json]
- `--lease-owner <owner>`: mdkg db queue claim <queue> --lease-owner <owner> --lease-ms <ms> [--json]
- `--limit <n>`: mdkg db queue list <queue> [--status ready|leased|acked|dead_letter|all] [--limit <n>] [--json]
- `--max-attempts <n>`: mdkg db queue enqueue <queue> <message-id> --payload-json <json>|--payload-file <path> [--dedupe-key <key>] [--available-at-ms <ms>] [--max-attempts <n>] [--json]
- `--paused`: mdkg db queue create <queue> [--paused] [--reason <text>] [--json]
- `--payload-json <json>`: mdkg db queue enqueue <queue> <message-id> --payload-json <json>|--payload-file <path> [--dedupe-key <key>] [--available-at-ms <ms>] [--max-attempts <n>] [--json]
- `--reason <text>`: mdkg db queue create <queue> [--paused] [--reason <text>] [--json]
- 4 additional flags omitted from this generated summary.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: emit-read-only-adapter-contract, read-or-write-local-project-db-queue-delivery-state
- Read paths: .mdkg/**
- Write paths: .mdkg/db/runtime/**
- Lock policy: mutation-lock-required-for-create-pause-resume-enqueue-claim-ack-fail-dead-letter-release-expired
- Atomic write policy: sqlite-transactions
- Receipts: queue-adapter-contract-receipt, queue-receipt

### Related commands

`mdkg db`, `mdkg db index`, `mdkg db snapshot`

## db snapshot

mdkg db snapshot command

- Command: `mdkg db snapshot`
- Mode: Mutating command
- Public status: stable / public
- Danger level: mixed

### When to use

Use for local project DB, queue, snapshot, and verification workflows.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg db snapshot seal [--queue-policy drain|paused] [--json]
mdkg db snapshot verify [--json]
mdkg db snapshot status [--json]
mdkg db snapshot dump [--snapshot <path>] [--output <path>] [--json]
mdkg db snapshot diff <left-snapshot> <right-snapshot> [--json]
```

### Examples

```bash
mdkg db snapshot seal [--queue-policy drain|paused] [--json]
mdkg db snapshot status [--json]
mdkg db snapshot verify [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg db snapshot seal [--queue-policy drain|paused] [--json]
- `--output <path>`: mdkg db snapshot dump [--snapshot <path>] [--output <path>] [--json]
- `--queue-policy drain|paused`: mdkg db snapshot seal [--queue-policy drain|paused] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--snapshot <path>`: mdkg db snapshot dump [--snapshot <path>] [--output <path>] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-seal-project-db-snapshot
- Read paths: .mdkg/**
- Write paths: .mdkg/db/state/**
- Lock policy: mutation-lock-required-for-seal
- Atomic write policy: atomic-file-writes
- Receipts: snapshot-receipt

### Related commands

`mdkg db`, `mdkg db index`, `mdkg db queue`

## doctor

mdkg doctor command

- Command: `mdkg doctor`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use this command when the matching command family is the current workflow surface.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg doctor [--strict] [--json]
```

### Examples

```bash
mdkg doctor [--strict] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg doctor [--strict] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--strict`: mdkg doctor [--strict] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

none

## event

mdkg event command

- Command: `mdkg event`
- Mode: Mutating command
- Public status: stable / public
- Danger level: mixed

### When to use

Use this command when the matching command family is the current workflow surface.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg event enable [--ws <alias>] [--json]
mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...> [options] [--json]
```

### Examples

```bash
mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...> [options] [--json]
mdkg event enable [--ws <alias>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg event enable [--ws <alias>] [--json]
- `--kind <kind>`: mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...> [options] [--json]
- `--refs <id,...>`: mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...> [options] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--status <ok|error|retry|skipped>`: mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...> [options] [--json]
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg event enable [--ws <alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-append-jsonl-event-log
- Read paths: .mdkg/**
- Write paths: .mdkg/events.jsonl
- Lock policy: mutation-lock-required-for-enable-append
- Atomic write policy: append-or-exclusive-create
- Receipts: event-receipt

### Related commands

`mdkg event append`, `mdkg event enable`

## event append

mdkg event append command

- Command: `mdkg event append`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use this command when the matching command family is the current workflow surface.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...>
```

### Examples

```bash
mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...>
```

### Common flags

- `--agent <name>`: [--agent <name>] [--skill <slug>] [--tool <id>]
- `--artifacts <a,...>`: [--ws <alias>] [--artifacts <a,...>] [--notes "<text>"] [--run-id <id>] [--json]
- `--help`: --help, -h          Show help
- `--json`: [--ws <alias>] [--artifacts <a,...>] [--notes "<text>"] [--run-id <id>] [--json]
- `--kind <kind>`: mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...>
- `--notes "<text>"`: [--ws <alias>] [--artifacts <a,...>] [--notes "<text>"] [--run-id <id>] [--json]
- `--refs <id,...>`: mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...>
- `--root`: --root, -r <path>   Run against a specific repo root
- `--run-id <id>`: [--ws <alias>] [--artifacts <a,...>] [--notes "<text>"] [--run-id <id>] [--json]
- `--skill <slug>`: [--agent <name>] [--skill <slug>] [--tool <id>]
- `--status <ok|error|retry|skipped>`: mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...>
- `--tool <id>`: [--agent <name>] [--skill <slug>] [--tool <id>]
- 2 additional flags omitted from this generated summary.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: append-event-log-row
- Read paths: .mdkg/**
- Write paths: .mdkg/events.jsonl
- Lock policy: mutation-lock-required
- Atomic write policy: append-only-jsonl
- Receipts: event-append-receipt

### Related commands

`mdkg event`, `mdkg event enable`

## event enable

mdkg event enable command

- Command: `mdkg event enable`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use this command when the matching command family is the current workflow surface.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg event enable [--ws <alias>] [--json]
```

### Examples

```bash
mdkg event enable [--ws <alias>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg event enable [--ws <alias>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg event enable [--ws <alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-event-log
- Read paths: .mdkg/**
- Write paths: .mdkg/events.jsonl
- Lock policy: mutation-lock-required
- Atomic write policy: exclusive-create
- Receipts: event-enable-receipt

### Related commands

`mdkg event`, `mdkg event append`

## fix

mdkg fix command

- Command: `mdkg fix`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for dry-run repair planning and selected graph repairs.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg fix plan [--family index|refs|ids|all] [--target <id-or-qid>] [--base-ref <ref>] [--json]
mdkg fix apply [--family ids] [--target <id-or-qid>] [--base-ref <ref>] [--json]
mdkg fix ids [--target <id-or-qid>] [--base-ref <ref>] [--apply] [--json]
```

### Examples

```bash
mdkg fix apply [--family ids] [--target <id-or-qid>] [--base-ref <ref>] [--json]
mdkg fix ids [--target <id-or-qid>] [--base-ref <ref>] [--apply] [--json]
mdkg fix plan [--family index|refs|ids|all] [--target <id-or-qid>] [--base-ref <ref>] [--json]
```

### Common flags

- `--apply`: mdkg fix ids [--target <id-or-qid>] [--base-ref <ref>] [--apply] [--json]
- `--base-ref <ref>`: mdkg fix plan [--family index|refs|ids|all] [--target <id-or-qid>] [--base-ref <ref>] [--json]
- `--family index|refs|ids|all`: mdkg fix plan [--family index|refs|ids|all] [--target <id-or-qid>] [--base-ref <ref>] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg fix plan [--family index|refs|ids|all] [--target <id-or-qid>] [--base-ref <ref>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--target <id-or-qid>`: mdkg fix plan [--family index|refs|ids|all] [--target <id-or-qid>] [--base-ref <ref>] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg fix apply`, `mdkg fix ids`, `mdkg fix plan`

## fix apply

mdkg fix apply command

- Command: `mdkg fix apply`
- Mode: Mutating command
- Public status: stable / public
- Danger level: high

### When to use

Use for dry-run repair planning and selected graph repairs.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg fix apply [--family ids] [--target <id-or-qid>] [--base-ref <ref>] [--json]
```

### Examples

```bash
mdkg fix apply [--family ids] [--target <id-or-qid>] [--base-ref <ref>] [--json]
```

### Common flags

- `--base-ref <ref>`: mdkg fix apply [--family ids] [--target <id-or-qid>] [--base-ref <ref>] [--json]
- `--family ids`: mdkg fix apply [--family ids] [--target <id-or-qid>] [--base-ref <ref>] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg fix apply [--family ids] [--target <id-or-qid>] [--base-ref <ref>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--target <id-or-qid>`: mdkg fix apply [--family ids] [--target <id-or-qid>] [--base-ref <ref>] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false,"apply_supported":true,"apply_family":"ids"}
- Side effects: rebuild-derived-indexes, rewrite-duplicate-node-ids
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: fix-apply-receipt

### Related commands

`mdkg fix`, `mdkg fix ids`, `mdkg fix plan`

## fix ids

mdkg fix ids command

- Command: `mdkg fix ids`
- Mode: Mutating command
- Public status: stable / public
- Danger level: high

### When to use

Use for dry-run repair planning and selected graph repairs.

Beginner safety: Prefer the dry-run or plan mode before applying changes.

### Usage

```text
mdkg fix ids [--target <id-or-qid>] [--base-ref <ref>] [--apply] [--json]
```

### Examples

```bash
mdkg fix ids [--target <id-or-qid>] [--base-ref <ref>] [--apply] [--json]
```

### Common flags

- `--apply`: mdkg fix ids [--target <id-or-qid>] [--base-ref <ref>] [--apply] [--json]
- `--base-ref <ref>`: mdkg fix ids [--target <id-or-qid>] [--base-ref <ref>] [--apply] [--json]
- `--family ids``: - without --apply it is equivalent to `mdkg fix plan --family ids`
- `--help`: --help, -h          Show help
- `--json`: mdkg fix ids [--target <id-or-qid>] [--base-ref <ref>] [--apply] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--target <id-or-qid>`: mdkg fix ids [--target <id-or-qid>] [--base-ref <ref>] [--apply] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":true,"default":true,"apply_flag":"--apply","apply_supported":true,"apply_family":"ids"}
- Side effects: plan-or-rewrite-duplicate-node-ids, rebuild-derived-indexes-when-apply
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required-when-apply
- Atomic write policy: atomic-file-writes-when-apply
- Receipts: fix-apply-receipt, fix-plan-receipt

### Related commands

`mdkg fix`, `mdkg fix apply`, `mdkg fix plan`

## fix plan

mdkg fix plan command

- Command: `mdkg fix plan`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for dry-run repair planning and selected graph repairs.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg fix plan [--family index|refs|ids|all] [--target <id-or-qid>] [--base-ref <ref>] [--json]
```

### Examples

```bash
mdkg fix plan [--family index|refs|ids|all] [--target <id-or-qid>] [--base-ref <ref>] [--json]
```

### Common flags

- `--base-ref <ref>`: mdkg fix plan [--family index|refs|ids|all] [--target <id-or-qid>] [--base-ref <ref>] [--json]
- `--family index|refs|ids|all`: mdkg fix plan [--family index|refs|ids|all] [--target <id-or-qid>] [--base-ref <ref>] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg fix plan [--family index|refs|ids|all] [--target <id-or-qid>] [--base-ref <ref>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--target <id-or-qid>`: mdkg fix plan [--family index|refs|ids|all] [--target <id-or-qid>] [--base-ref <ref>] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":true,"default":true,"apply_supported":true,"apply_family":"ids"}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: fix-plan-receipt

### Related commands

`mdkg fix`, `mdkg fix apply`, `mdkg fix ids`

## format

mdkg format command

- Command: `mdkg format`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use this command when the matching command family is the current workflow surface.

Beginner safety: Prefer the dry-run or plan mode before applying changes.

### Usage

```text
mdkg format
mdkg format --headings [--dry-run|--apply] [--summary] [--limit <n>] [--json]
```

### Examples

```bash
mdkg format
mdkg format --headings [--dry-run|--apply] [--summary] [--limit <n>] [--json]
```

### Common flags

- `--apply to`: --headings adds missing recommended body headings; it defaults to dry-run and requires --apply to write files.
- `--headings [--dry-run|--apply]`: mdkg format --headings [--dry-run|--apply] [--summary] [--limit <n>] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg format --headings [--dry-run|--apply] [--summary] [--limit <n>] [--json]
- `--limit <n>`: mdkg format --headings [--dry-run|--apply] [--summary] [--limit <n>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--summary`: mdkg format --headings [--dry-run|--apply] [--summary] [--limit <n>] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":true,"default":false,"flag":"--dry-run"}
- Side effects: normalize-graph-markdown
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: format-receipt

### Related commands

none

## git

mdkg git command

- Command: `mdkg git`
- Mode: Mutating command
- Public status: stable / public
- Danger level: mixed

### When to use

Use for Git-backed project clone, fetch, closeout, push-readiness, and explicit push workflows through system Git with external authentication.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg git inspect [--json]
mdkg git materialize --request <file|-> [--json]
mdkg git clone <repository-ref> --target <path> [--branch <name>] [--json]
mdkg git fetch [--remote <name>] [--branch <name>] [--json]
mdkg git closeout [--queue-policy drain|paused] [--output <path>] [--json]
mdkg git push-ready --remote <name> --branch <name> [--json]
mdkg git push --remote <name> --branch <name> [--stage-all --message <text>] [--json]
```

### Examples

```bash
mdkg git clone <repository-ref> --target <path> [--branch <name>] [--json]
mdkg git inspect [--json]
mdkg git materialize --request <file|-> [--json]
```

### Common flags

- `--branch <name>`: mdkg git clone <repository-ref> --target <path> [--branch <name>] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg git inspect [--json]
- `--output <path>`: mdkg git closeout [--queue-policy drain|paused] [--output <path>] [--json]
- `--queue-policy drain|paused`: mdkg git closeout [--queue-policy drain|paused] [--output <path>] [--json]
- `--remote <name>`: mdkg git fetch [--remote <name>] [--branch <name>] [--json]
- `--request <file|->`: mdkg git materialize --request <file|-> [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--stage-all`: mdkg git push --remote <name> --branch <name> [--stage-all --message <text>] [--json]
- `--target <path>`: mdkg git clone <repository-ref> --target <path> [--branch <name>] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: inspect-or-mutate-git-backed-mdkg-project-lifecycle
- Read paths: .mdkg/**
- Write paths: .mdkg/db/**, .mdkg/git/**, .mdkg/index/**
- Lock policy: mutation-lock-required-for-closeout-and-stage-all-push
- Atomic write policy: atomic-file-writes-for-closeout-receipts
- Receipts: git-closeout-receipt, git-inspect-receipt, git-push-ready-receipt, git-push-receipt

### Related commands

`mdkg git clone`, `mdkg git closeout`, `mdkg git fetch`, `mdkg git inspect`, `mdkg git materialize`

## git clone

mdkg git clone command

- Command: `mdkg git clone`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use for Git-backed project clone, fetch, closeout, push-readiness, and explicit push workflows through system Git with external authentication.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg git clone <repository-ref> --target <path> [--branch <name>] [--json]
```

### Examples

```bash
mdkg git clone <repository-ref> --target <path> [--branch <name>] [--json]
```

### Common flags

- `--branch <name>`: mdkg git clone <repository-ref> --target <path> [--branch <name>] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg git clone <repository-ref> --target <path> [--branch <name>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--target <path>`: mdkg git clone <repository-ref> --target <path> [--branch <name>] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: clone-remote-git-repository-into-contained-target
- Read paths: .mdkg/**
- Write paths: <target>/**
- Lock policy: not-required-for-contained-target
- Atomic write policy: delegated-to-system-git
- Receipts: git-clone-receipt

### Related commands

`mdkg git`, `mdkg git closeout`, `mdkg git fetch`, `mdkg git inspect`, `mdkg git materialize`

## git closeout

mdkg git closeout command

- Command: `mdkg git closeout`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use for Git-backed project clone, fetch, closeout, push-readiness, and explicit push workflows through system Git with external authentication.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg git closeout [--queue-policy drain|paused] [--output <path>] [--json]
```

### Examples

```bash
mdkg git closeout [--queue-policy drain|paused] [--output <path>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg git closeout [--queue-policy drain|paused] [--output <path>] [--json]
- `--output <path>`: mdkg git closeout [--queue-policy drain|paused] [--output <path>] [--json]
- `--queue-policy drain|paused`: mdkg git closeout [--queue-policy drain|paused] [--output <path>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: write-static-git-closeout-receipts-and-optional-db-snapshot
- Read paths: .mdkg/**
- Write paths: .mdkg/db/**, .mdkg/git/**, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes-and-sqlite-vacuum-into
- Receipts: git-closeout-receipt

### Related commands

`mdkg git`, `mdkg git clone`, `mdkg git fetch`, `mdkg git inspect`, `mdkg git materialize`

## git fetch

mdkg git fetch command

- Command: `mdkg git fetch`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use for Git-backed project clone, fetch, closeout, push-readiness, and explicit push workflows through system Git with external authentication.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg git fetch [--remote <name>] [--branch <name>] [--json]
```

### Examples

```bash
mdkg git fetch [--remote <name>] [--branch <name>] [--json]
```

### Common flags

- `--branch <name>`: mdkg git fetch [--remote <name>] [--branch <name>] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg git fetch [--remote <name>] [--branch <name>] [--json]
- `--remote <name>`: mdkg git fetch [--remote <name>] [--branch <name>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: fetch-remote-git-refs
- Read paths: .mdkg/**
- Write paths: .git/**
- Lock policy: delegated-to-system-git
- Atomic write policy: delegated-to-system-git
- Receipts: git-fetch-receipt

### Related commands

`mdkg git`, `mdkg git clone`, `mdkg git closeout`, `mdkg git inspect`, `mdkg git materialize`

## git inspect

mdkg git inspect command

- Command: `mdkg git inspect`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for Git-backed project clone, fetch, closeout, push-readiness, and explicit push workflows through system Git with external authentication.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg git inspect [--json]
```

### Examples

```bash
mdkg git inspect [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg git inspect [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: git-inspect-receipt

### Related commands

`mdkg git`, `mdkg git clone`, `mdkg git closeout`, `mdkg git fetch`, `mdkg git materialize`

## git materialize

mdkg git materialize command

- Command: `mdkg git materialize`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use for Git-backed project clone, fetch, closeout, push-readiness, and explicit push workflows through system Git with external authentication.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg git materialize --request <file|-> [--json]
```

### Examples

```bash
mdkg git materialize --request <file|-> [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg git materialize --request <file|-> [--json]
- `--request <file|->`: mdkg git materialize --request <file|-> [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: materialize-verified-git-source-into-contained-destination
- Read paths: <remote-git-objects>, <request-file-or-stdin>
- Write paths: <destination>/**
- Lock policy: not-required-for-contained-destination
- Atomic write policy: same-parent-temporary-tree-rename-after-verification
- Receipts: mdkg.git.materialize.receipt.v1

### Related commands

`mdkg git`, `mdkg git clone`, `mdkg git closeout`, `mdkg git fetch`, `mdkg git inspect`

## git push

mdkg git push command

- Command: `mdkg git push`
- Mode: Mutating command
- Public status: stable / public
- Danger level: high

### When to use

Use for Git-backed project clone, fetch, closeout, push-readiness, and explicit push workflows through system Git with external authentication.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg git push --remote <name> --branch <name> [--json]
mdkg git push --remote <name> --branch <name> --stage-all --message <text> [--queue-policy drain|paused] [--json]
```

### Examples

```bash
mdkg git push --remote <name> --branch <name> --stage-all --message <text> [--queue-policy drain|paused] [--json]
mdkg git push --remote <name> --branch <name> [--json]
```

### Common flags

- `--branch <name>`: mdkg git push --remote <name> --branch <name> [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg git push --remote <name> --branch <name> [--json]
- `--message`: - --stage-all writes closeout evidence, stages all changes, commits with --message, then runs push-ready before pushing
- `--queue-policy drain|paused`: mdkg git push --remote <name> --branch <name> --stage-all --message <text> [--queue-policy drain|paused] [--json]
- `--remote <name>`: mdkg git push --remote <name> --branch <name> [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--stage-all`: mdkg git push --remote <name> --branch <name> --stage-all --message <text> [--queue-policy drain|paused] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: optional-closeout-stage-commit-and-real-git-push
- Read paths: .mdkg/**
- Write paths: .git/**, .mdkg/db/**, .mdkg/git/**, repo-files/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes-plus-system-git
- Receipts: git-push-receipt

### Related commands

`mdkg git`, `mdkg git clone`, `mdkg git closeout`, `mdkg git fetch`, `mdkg git inspect`

## git push-ready

mdkg git push-ready command

- Command: `mdkg git push-ready`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for Git-backed project clone, fetch, closeout, push-readiness, and explicit push workflows through system Git with external authentication.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg git push-ready --remote <name> --branch <name> [--json]
```

### Examples

```bash
mdkg git push-ready --remote <name> --branch <name> [--json]
```

### Common flags

- `--branch <name>`: mdkg git push-ready --remote <name> --branch <name> [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg git push-ready --remote <name> --branch <name> [--json]
- `--remote <name>`: mdkg git push-ready --remote <name> --branch <name> [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: git-push-ready-receipt

### Related commands

`mdkg git`, `mdkg git clone`, `mdkg git closeout`, `mdkg git fetch`, `mdkg git inspect`

## global

mdkg - Markdown Knowledge Graph

- Command: `mdkg global`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use this command when the matching command family is the current workflow surface.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg <command> [options]
```

### Examples

```bash
mdkg <command> [options]
```

### Common flags

- `--agent`: mdkg init --agent
- `--apply`: mdkg upgrade --apply
- `--description "use`: mdkg skill new release-readiness "release readiness audit" --description "use when preparing a release"
- `--dry-run`: mdkg pack <id> --profile concise --dry-run --stats
- `--help`: Run `mdkg help <command>` or `mdkg <command> --help` for details.
- `--json`: mdkg skill list --tags stage:plan --json
- `--priority 1`: mdkg new task "..." --status todo --priority 1
- `--profile concise`: mdkg pack <id> --profile concise --dry-run --stats
- `--root`: --root, -r <path>   Run against a specific repo root
- `--status todo`: mdkg new task "..." --status todo --priority 1
- `--tags stage:plan`: mdkg skill list --tags stage:plan --json
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

none

## goal

mdkg goal command

- Command: `mdkg goal`
- Mode: Mutating command
- Public status: stable / public
- Danger level: mixed

### When to use

Use for long-running objectives, active-node routing, and goal lifecycle.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg goal show <goal-id-or-qid> [--json]
mdkg goal select <goal-id-or-qid> [--json]
mdkg goal activate <goal-id-or-qid> [--json]
mdkg goal current [--json]
mdkg goal next [goal-id-or-qid] [--json]
mdkg goal claim [goal-id-or-qid] <work-id-or-qid> [--json]
mdkg goal evaluate <goal-id-or-qid> [--json]
mdkg goal clear [--json]
mdkg goal pause|resume|done|archive <goal-id-or-qid> [--json]
```

### Examples

```bash
mdkg goal activate <goal-id-or-qid> [--json]
mdkg goal select <goal-id-or-qid> [--json]
mdkg goal show <goal-id-or-qid> [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg goal show <goal-id-or-qid> [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-update-selected-goal-state
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required-for-select-clear-claim-pause-resume-done
- Atomic write policy: atomic-file-writes
- Receipts: goal-receipt

### Related commands

`mdkg goal activate`, `mdkg goal archive`, `mdkg goal claim`, `mdkg goal clear`, `mdkg goal current`

## goal activate

mdkg goal activate command

- Command: `mdkg goal activate`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use for long-running objectives, active-node routing, and goal lifecycle.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg goal activate <goal-id-or-qid> [--ws <alias>] [--json]
```

### Examples

```bash
mdkg goal activate <goal-id-or-qid> [--ws <alias>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg goal activate <goal-id-or-qid> [--ws <alias>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg goal activate <goal-id-or-qid> [--ws <alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: activate-goal-and-pause-competing-goals
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: goal-state-receipt

### Related commands

`mdkg goal`, `mdkg goal archive`, `mdkg goal claim`, `mdkg goal clear`, `mdkg goal current`

## goal archive

mdkg goal archive command

- Command: `mdkg goal archive`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use for long-running objectives, active-node routing, and goal lifecycle.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg goal archive <goal-id-or-qid> [--ws <alias>] [--json]
```

### Examples

```bash
mdkg goal archive <goal-id-or-qid> [--ws <alias>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg goal archive <goal-id-or-qid> [--ws <alias>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg goal archive <goal-id-or-qid> [--ws <alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: archive-goal
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: goal-state-receipt

### Related commands

`mdkg goal`, `mdkg goal activate`, `mdkg goal claim`, `mdkg goal clear`, `mdkg goal current`

## goal claim

mdkg goal claim command

- Command: `mdkg goal claim`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use for long-running objectives, active-node routing, and goal lifecycle.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg goal claim <work-id-or-qid> [--ws <alias>] [--json]
mdkg goal claim <goal-id-or-qid> <work-id-or-qid> [--ws <alias>] [--json]
```

### Examples

```bash
mdkg goal claim <goal-id-or-qid> <work-id-or-qid> [--ws <alias>] [--json]
mdkg goal claim <work-id-or-qid> [--ws <alias>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg goal claim <work-id-or-qid> [--ws <alias>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg goal claim <work-id-or-qid> [--ws <alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: claim-goal-active-node
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: goal-state-receipt

### Related commands

`mdkg goal`, `mdkg goal activate`, `mdkg goal archive`, `mdkg goal clear`, `mdkg goal current`

## goal clear

mdkg goal clear command

- Command: `mdkg goal clear`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use for long-running objectives, active-node routing, and goal lifecycle.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg goal clear [--json]
```

### Examples

```bash
mdkg goal clear [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg goal clear [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: clear-selected-goal
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: goal-state-receipt

### Related commands

`mdkg goal`, `mdkg goal activate`, `mdkg goal archive`, `mdkg goal claim`, `mdkg goal current`

## goal current

mdkg goal current command

- Command: `mdkg goal current`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for long-running objectives, active-node routing, and goal lifecycle.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg goal current [--ws <alias>] [--json]
```

### Examples

```bash
mdkg goal current [--ws <alias>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg goal current [--ws <alias>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg goal current [--ws <alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg goal`, `mdkg goal activate`, `mdkg goal archive`, `mdkg goal claim`, `mdkg goal clear`

## goal done

mdkg goal done command

- Command: `mdkg goal done`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use for long-running objectives, active-node routing, and goal lifecycle.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg goal done <goal-id-or-qid> [--ws <alias>] [--json]
```

### Examples

```bash
mdkg goal done <goal-id-or-qid> [--ws <alias>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg goal done <goal-id-or-qid> [--ws <alias>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg goal done <goal-id-or-qid> [--ws <alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: complete-goal
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: goal-state-receipt

### Related commands

`mdkg goal`, `mdkg goal activate`, `mdkg goal archive`, `mdkg goal claim`, `mdkg goal clear`

## goal evaluate

mdkg goal evaluate command

- Command: `mdkg goal evaluate`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for long-running objectives, active-node routing, and goal lifecycle.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg goal evaluate <goal-id-or-qid> [--ws <alias>] [--json]
```

### Examples

```bash
mdkg goal evaluate <goal-id-or-qid> [--ws <alias>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg goal evaluate <goal-id-or-qid> [--ws <alias>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg goal evaluate <goal-id-or-qid> [--ws <alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg goal`, `mdkg goal activate`, `mdkg goal archive`, `mdkg goal claim`, `mdkg goal clear`

## goal next

mdkg goal next command

- Command: `mdkg goal next`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for long-running objectives, active-node routing, and goal lifecycle.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg goal next [goal-id-or-qid] [--ws <alias>] [--json]
```

### Examples

```bash
mdkg goal next [goal-id-or-qid] [--ws <alias>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg goal next [goal-id-or-qid] [--ws <alias>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg goal next [goal-id-or-qid] [--ws <alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg goal`, `mdkg goal activate`, `mdkg goal archive`, `mdkg goal claim`, `mdkg goal clear`

## goal pause

mdkg goal pause command

- Command: `mdkg goal pause`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use for long-running objectives, active-node routing, and goal lifecycle.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg goal pause <goal-id-or-qid> [--ws <alias>] [--json]
```

### Examples

```bash
mdkg goal pause <goal-id-or-qid> [--ws <alias>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg goal pause <goal-id-or-qid> [--ws <alias>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg goal pause <goal-id-or-qid> [--ws <alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: pause-goal
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: goal-state-receipt

### Related commands

`mdkg goal`, `mdkg goal activate`, `mdkg goal archive`, `mdkg goal claim`, `mdkg goal clear`

## goal resume

mdkg goal resume command

- Command: `mdkg goal resume`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use for long-running objectives, active-node routing, and goal lifecycle.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg goal resume <goal-id-or-qid> [--ws <alias>] [--json]
```

### Examples

```bash
mdkg goal resume <goal-id-or-qid> [--ws <alias>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg goal resume <goal-id-or-qid> [--ws <alias>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg goal resume <goal-id-or-qid> [--ws <alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: resume-goal
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: goal-state-receipt

### Related commands

`mdkg goal`, `mdkg goal activate`, `mdkg goal archive`, `mdkg goal claim`, `mdkg goal clear`

## goal select

mdkg goal select command

- Command: `mdkg goal select`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use for long-running objectives, active-node routing, and goal lifecycle.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg goal select <goal-id-or-qid> [--ws <alias>] [--json]
```

### Examples

```bash
mdkg goal select <goal-id-or-qid> [--ws <alias>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg goal select <goal-id-or-qid> [--ws <alias>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg goal select <goal-id-or-qid> [--ws <alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: select-goal
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: goal-state-receipt

### Related commands

`mdkg goal`, `mdkg goal activate`, `mdkg goal archive`, `mdkg goal claim`, `mdkg goal clear`

## goal show

mdkg goal show command

- Command: `mdkg goal show`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for long-running objectives, active-node routing, and goal lifecycle.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg goal show <goal-id-or-qid> [--ws <alias>] [--json]
```

### Examples

```bash
mdkg goal show <goal-id-or-qid> [--ws <alias>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg goal show <goal-id-or-qid> [--ws <alias>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg goal show <goal-id-or-qid> [--ws <alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg goal`, `mdkg goal activate`, `mdkg goal archive`, `mdkg goal claim`, `mdkg goal clear`

## graph

mdkg graph command

- Command: `mdkg graph`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for graph references, clone/fork/import, and graph movement workflows.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg graph clone <source-bundle-or-mdkg-dir> --target <path> [--json]
mdkg graph fork <source-bundle-or-mdkg-dir> --target <path> [--start-goal <goal-id>] [--json]
mdkg graph import-template <source-bundle-or-mdkg-dir> [--start-goal <goal-id>] [--select-goal] [--id-prefix <prefix>] [--dry-run] [--apply] [--json]
mdkg graph refs <id-or-qid> [--ws <alias>] [--json]
```

### Examples

```bash
mdkg graph clone <source-bundle-or-mdkg-dir> --target <path> [--json]
mdkg graph fork <source-bundle-or-mdkg-dir> --target <path> [--start-goal <goal-id>] [--json]
mdkg graph import-template <source-bundle-or-mdkg-dir> [--start-goal <goal-id>] [--select-goal] [--id-prefix <prefix>] [--dry-run] [--apply] [--json]
```

### Common flags

- `--apply`: mdkg graph import-template <source-bundle-or-mdkg-dir> [--start-goal <goal-id>] [--select-goal] [--id-prefix <prefix>] [--dry-run] [--apply] [--json]
- `--dry-run`: mdkg graph import-template <source-bundle-or-mdkg-dir> [--start-goal <goal-id>] [--select-goal] [--id-prefix <prefix>] [--dry-run] [--apply] [--json]
- `--help`: --help, -h          Show help
- `--id-prefix <prefix>`: mdkg graph import-template <source-bundle-or-mdkg-dir> [--start-goal <goal-id>] [--select-goal] [--id-prefix <prefix>] [--dry-run] [--apply] [--json]
- `--json`: mdkg graph clone <source-bundle-or-mdkg-dir> --target <path> [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--select-goal`: mdkg graph import-template <source-bundle-or-mdkg-dir> [--start-goal <goal-id>] [--select-goal] [--id-prefix <prefix>] [--dry-run] [--apply] [--json]
- `--start-goal <goal-id>`: mdkg graph fork <source-bundle-or-mdkg-dir> --target <path> [--start-goal <goal-id>] [--json]
- `--target <path>`: mdkg graph clone <source-bundle-or-mdkg-dir> --target <path> [--json]
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg graph refs <id-or-qid> [--ws <alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg graph clone`, `mdkg graph fork`, `mdkg graph import-template`, `mdkg graph refs`

## graph clone

mdkg graph clone command

- Command: `mdkg graph clone`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for graph references, clone/fork/import, and graph movement workflows.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg graph clone <source-bundle-or-mdkg-dir> --target <path> [--json]
```

### Examples

```bash
mdkg graph clone <source-bundle-or-mdkg-dir> --target <path> [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg graph clone <source-bundle-or-mdkg-dir> --target <path> [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--target <path>`: mdkg graph clone <source-bundle-or-mdkg-dir> --target <path> [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg graph`, `mdkg graph fork`, `mdkg graph import-template`, `mdkg graph refs`

## graph fork

mdkg graph fork command

- Command: `mdkg graph fork`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for graph references, clone/fork/import, and graph movement workflows.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg graph fork <source-bundle-or-mdkg-dir> --target <path> [--start-goal <goal-id>] [--json]
```

### Examples

```bash
mdkg graph fork <source-bundle-or-mdkg-dir> --target <path> [--start-goal <goal-id>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg graph fork <source-bundle-or-mdkg-dir> --target <path> [--start-goal <goal-id>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--start-goal <goal-id>`: mdkg graph fork <source-bundle-or-mdkg-dir> --target <path> [--start-goal <goal-id>] [--json]
- `--target <path>`: mdkg graph fork <source-bundle-or-mdkg-dir> --target <path> [--start-goal <goal-id>] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg graph`, `mdkg graph clone`, `mdkg graph import-template`, `mdkg graph refs`

## graph import-template

mdkg graph import-template command

- Command: `mdkg graph import-template`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for graph references, clone/fork/import, and graph movement workflows.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg graph import-template <source-bundle-or-mdkg-dir> [--start-goal <goal-id>] [--select-goal] [--id-prefix <prefix>] [--dry-run] [--apply] [--json]
```

### Examples

```bash
mdkg graph import-template <source-bundle-or-mdkg-dir> [--start-goal <goal-id>] [--select-goal] [--id-prefix <prefix>] [--dry-run] [--apply] [--json]
```

### Common flags

- `--apply`: mdkg graph import-template <source-bundle-or-mdkg-dir> [--start-goal <goal-id>] [--select-goal] [--id-prefix <prefix>] [--dry-run] [--apply] [--json]
- `--dry-run`: mdkg graph import-template <source-bundle-or-mdkg-dir> [--start-goal <goal-id>] [--select-goal] [--id-prefix <prefix>] [--dry-run] [--apply] [--json]
- `--help`: --help, -h          Show help
- `--id-prefix <prefix>`: mdkg graph import-template <source-bundle-or-mdkg-dir> [--start-goal <goal-id>] [--select-goal] [--id-prefix <prefix>] [--dry-run] [--apply] [--json]
- `--json`: mdkg graph import-template <source-bundle-or-mdkg-dir> [--start-goal <goal-id>] [--select-goal] [--id-prefix <prefix>] [--dry-run] [--apply] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--select-goal`: mdkg graph import-template <source-bundle-or-mdkg-dir> [--start-goal <goal-id>] [--select-goal] [--id-prefix <prefix>] [--dry-run] [--apply] [--json]
- `--start-goal <goal-id>`: mdkg graph import-template <source-bundle-or-mdkg-dir> [--start-goal <goal-id>] [--select-goal] [--id-prefix <prefix>] [--dry-run] [--apply] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg graph`, `mdkg graph clone`, `mdkg graph fork`, `mdkg graph refs`

## graph refs

mdkg graph refs command

- Command: `mdkg graph refs`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for graph references, clone/fork/import, and graph movement workflows.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg graph refs <id-or-qid> [--ws <alias>] [--json]
```

### Examples

```bash
mdkg graph refs <id-or-qid> [--ws <alias>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg graph refs <id-or-qid> [--ws <alias>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg graph refs <id-or-qid> [--ws <alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: graph-refs-receipt

### Related commands

`mdkg graph`, `mdkg graph clone`, `mdkg graph fork`, `mdkg graph import-template`

## guide

mdkg guide command

- Command: `mdkg guide`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use this command when the matching command family is the current workflow surface.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg guide
```

### Examples

```bash
mdkg guide
```

### Common flags

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

none

## handoff

mdkg handoff command

- Command: `mdkg handoff`
- Mode: Generated artifact command
- Public status: stable / public
- Danger level: moderate

### When to use

Use for sanitized transfer prompts between humans and agents.

Beginner safety: Review generated output before sharing it outside the repository.

### Usage

```text
mdkg handoff create <id-or-qid> [--ws <alias>] [--depth <n>] [--out <path>] [--json]
```

### Examples

```bash
mdkg handoff create <id-or-qid> [--ws <alias>] [--depth <n>] [--out <path>] [--json]
```

### Common flags

- `--depth <n>`: mdkg handoff create <id-or-qid> [--ws <alias>] [--depth <n>] [--out <path>] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg handoff create <id-or-qid> [--ws <alias>] [--depth <n>] [--out <path>] [--json]
- `--out <path>`: mdkg handoff create <id-or-qid> [--ws <alias>] [--depth <n>] [--out <path>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg handoff create <id-or-qid> [--ws <alias>] [--depth <n>] [--out <path>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-sanitized-agent-handoff-when-out-is-provided
- Read paths: .mdkg/**
- Write paths: .mdkg/handoffs/**
- Lock policy: not-required-for-stdout-output
- Atomic write policy: atomic-file-write-when-out-is-provided
- Receipts: handoff-receipt

### Related commands

none

## index

mdkg index command

- Command: `mdkg index`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use to rebuild generated search, skill, capability, and subgraph indexes.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg index [--tolerant]
```

### Examples

```bash
mdkg index [--tolerant]
```

### Common flags

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--tolerant`: mdkg index [--tolerant]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text
- Dry run: {"supported":false}
- Side effects: rebuild-generated-index-cache
- Read paths: .mdkg/**
- Write paths: .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: sqlite-transaction-and-atomic-cache-write
- Receipts: index-rebuild-receipt

### Related commands

none

## init

mdkg init command

- Command: `mdkg init`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use this command when the matching command family is the current workflow surface.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg init [options]
```

### Examples

```bash
mdkg init [options]
```

### Common flags

- `--agent`: --agent               Create the complete agent bootstrap, skills, events, and mirrors
- `--force`: --force               Overwrite existing mdkg files
- `--help`: --help, -h          Show help
- `--no-update-ignores`: --no-update-ignores   Skip default .gitignore/.npmignore updates
- `--root`: --root, -r <path>   Run against a specific repo root
- `--update-dockerignore Append`: --update-dockerignore Append mdkg ignore entries
- `--update-gitignore`: --update-gitignore    Append mdkg ignore entries
- `--update-npmignore`: --update-npmignore    Append mdkg ignore entries
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text
- Dry run: {"supported":false}
- Side effects: initialize-mdkg-scaffold
- Read paths: .mdkg/**
- Write paths: .mdkg/**, AGENTS.md, AGENT_START.md, CLAUDE.md, CLI_COMMAND_MATRIX.md, llms.txt
- Lock policy: not-required-before-mdkg-config-exists
- Atomic write policy: exclusive-create-and-atomic-file-writes
- Receipts: init-summary

### Related commands

none

## list

mdkg list command

- Command: `mdkg list`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use this command when the matching command family is the current workflow surface.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg list [--type <type>] [--status <status>] [--ws <alias>] [--epic <id>]
```

### Examples

```bash
mdkg list [--type <type>] [--status <status>] [--ws <alias>] [--epic <id>]
```

### Common flags

- `--blocked`: [--priority <n>] [--blocked] [--tags <tag,tag,...>] [--tags-mode any|all]
- `--epic <id>`: mdkg list [--type <type>] [--status <status>] [--ws <alias>] [--epic <id>]
- `--help`: --help, -h          Show help
- `--json`: [--json|--xml|--toon|--md]
- `--priority <n>`: [--priority <n>] [--blocked] [--tags <tag,tag,...>] [--tags-mode any|all]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--status <status>`: mdkg list [--type <type>] [--status <status>] [--ws <alias>] [--epic <id>]
- `--tags <tag,tag,...>`: [--priority <n>] [--blocked] [--tags <tag,tag,...>] [--tags-mode any|all]
- `--tags-mode any|all`: [--priority <n>] [--blocked] [--tags <tag,tag,...>] [--tags-mode any|all]
- `--type <type>`: mdkg list [--type <type>] [--status <status>] [--ws <alias>] [--epic <id>]
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg list [--type <type>] [--status <status>] [--ws <alias>] [--epic <id>]

### Output and safety

- Output formats: text, json, xml, toon, md
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

none

## loop

mdkg loop command

- Command: `mdkg loop`
- Mode: Mutating command
- Public status: stable / public
- Danger level: mixed

### When to use

Use for reusable loop templates, scoped loop forks, readiness planning, next-action routing, and loop run/evidence inspection.

Beginner safety: Prefer the dry-run or plan mode before applying changes.

### Usage

```text
mdkg loop list [--ws <alias>] [--json]
mdkg loop show <loop-or-template> [--meta] [--ws <alias>] [--json]
mdkg loop fork <template> --scope <scope> [--title <title>] [--materialization default_children|planning_only|manual] [--planning-only] [--no-children] [--dry-run] [--run-id <id>] [--ws <alias>] [--json]
mdkg loop plan <loop> [--ws <alias>] [--json]
mdkg loop next <loop> [--ws <alias>] [--json]
mdkg loop runs <loop> [--ws <alias>] [--json]
```

### Examples

```bash
mdkg loop fork <template> --scope <scope> [--title <title>] [--materialization default_children|planning_only|manual] [--planning-only] [--no-children] [--dry-run] [--run-id <id>] [--ws <alias>] [--json]
mdkg loop list [--ws <alias>] [--json]
mdkg loop show <loop-or-template> [--meta] [--ws <alias>] [--json]
```

### Common flags

- `--root <path>`: Run against a specific repository root; -r is the short alias.
- `--ws <alias>`: Resolve the command against one workspace alias.
- `--json`: Emit deterministic JSON instead of text.
- `--no-cache`: Build a non-persisting in-memory index projection instead of reading the cache.
- `--no-reindex`: Do not rebuild a stale or missing index projection.
- `--run-id <id>`: Attach an optional run id to the fork event when event logging is enabled.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":true,"commands":["fork"]}
- Side effects: read-or-write-loop-graph-state
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/events/*.jsonl, .mdkg/index/**
- Lock policy: mutation-lock-required-for-fork
- Atomic write policy: exclusive-create-and-atomic-file-writes
- Receipts: loop-receipt

### Related commands

`mdkg loop fork`, `mdkg loop list`, `mdkg loop next`, `mdkg loop plan`, `mdkg loop runs`

## loop fork

mdkg loop fork command

- Command: `mdkg loop fork`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use for reusable loop templates, scoped loop forks, readiness planning, next-action routing, and loop run/evidence inspection.

Beginner safety: Prefer the dry-run or plan mode before applying changes.

### Usage

```text
mdkg loop fork <template> --scope <scope> [--title <title>] [--materialization <mode>] [--planning-only] [--no-children] [--dry-run] [--run-id <id>] [--ws <alias>] [--no-cache] [--no-reindex] [--json]
```

### Examples

```bash
mdkg loop fork <template> --scope <scope> [--title <title>] [--materialization <mode>] [--planning-only] [--no-children] [--dry-run] [--run-id <id>] [--ws <alias>] [--no-cache] [--no-reindex] [--json]
```

### Common flags

- `--scope <scope>`: Scope ref, qid, URI, path, or description for the scoped loop.
- `--title <title>`: Override the generated scoped loop title.
- `--materialization <mode>`: Child materialization mode: default_children, planning_only, or manual.
- `--planning-only`: Create only the scoped loop shell.
- `--no-children`: Alias for planning-only materialization.
- `--dry-run`: Plan the fork without writing loop or child nodes.
- `--run-id <id>`: Attach an optional run id to the fork event when event logging is enabled.
- `--root <path>`: Run against a specific repository root; -r is the short alias.
- `--ws <alias>`: Resolve the command against one workspace alias.
- `--json`: Emit deterministic JSON instead of text.
- `--no-cache`: Build a non-persisting in-memory index projection instead of reading the cache.
- `--no-reindex`: Do not rebuild a stale or missing index projection.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":true,"flag":"--dry-run","side_effects":["none"],"write_paths":[],"reserves_ids":false}
- Side effects: append-loop-fork-event-when-event-logging-is-enabled, create-scoped-loop-and-optional-child-nodes, rebuild-derived-indexes-when-auto-reindex-is-enabled, reserve-sqlite-node-ids-when-configured
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/events/*.jsonl, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: exclusive-create-and-atomic-file-writes
- Receipts: loop-fork-receipt

### Related commands

`mdkg loop`, `mdkg loop list`, `mdkg loop next`, `mdkg loop plan`, `mdkg loop runs`

## loop list

mdkg loop list command

- Command: `mdkg loop list`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for reusable loop templates, scoped loop forks, readiness planning, next-action routing, and loop run/evidence inspection.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg loop list [--ws <alias>] [--no-cache] [--no-reindex] [--json]
```

### Examples

```bash
mdkg loop list [--ws <alias>] [--no-cache] [--no-reindex] [--json]
```

### Common flags

- `--root <path>`: Run against a specific repository root; -r is the short alias.
- `--ws <alias>`: Resolve the command against one workspace alias.
- `--json`: Emit deterministic JSON instead of text.
- `--no-cache`: Build a non-persisting in-memory index projection instead of reading the cache.
- `--no-reindex`: Do not rebuild a stale or missing index projection.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: loop-list-receipt

### Related commands

`mdkg loop`, `mdkg loop fork`, `mdkg loop next`, `mdkg loop plan`, `mdkg loop runs`

## loop next

mdkg loop next command

- Command: `mdkg loop next`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for reusable loop templates, scoped loop forks, readiness planning, next-action routing, and loop run/evidence inspection.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg loop next <loop> [--ws <alias>] [--no-cache] [--no-reindex] [--json]
```

### Examples

```bash
mdkg loop next <loop> [--ws <alias>] [--no-cache] [--no-reindex] [--json]
```

### Common flags

- `--root <path>`: Run against a specific repository root; -r is the short alias.
- `--ws <alias>`: Resolve the command against one workspace alias.
- `--json`: Emit deterministic JSON instead of text.
- `--no-cache`: Build a non-persisting in-memory index projection instead of reading the cache.
- `--no-reindex`: Do not rebuild a stale or missing index projection.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: loop-next-receipt

### Related commands

`mdkg loop`, `mdkg loop fork`, `mdkg loop list`, `mdkg loop plan`, `mdkg loop runs`

## loop plan

mdkg loop plan command

- Command: `mdkg loop plan`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for reusable loop templates, scoped loop forks, readiness planning, next-action routing, and loop run/evidence inspection.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg loop plan <loop> [--ws <alias>] [--no-cache] [--no-reindex] [--json]
```

### Examples

```bash
mdkg loop plan <loop> [--ws <alias>] [--no-cache] [--no-reindex] [--json]
```

### Common flags

- `--root <path>`: Run against a specific repository root; -r is the short alias.
- `--ws <alias>`: Resolve the command against one workspace alias.
- `--json`: Emit deterministic JSON instead of text.
- `--no-cache`: Build a non-persisting in-memory index projection instead of reading the cache.
- `--no-reindex`: Do not rebuild a stale or missing index projection.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: loop-plan-receipt

### Related commands

`mdkg loop`, `mdkg loop fork`, `mdkg loop list`, `mdkg loop next`, `mdkg loop runs`

## loop runs

mdkg loop runs command

- Command: `mdkg loop runs`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for reusable loop templates, scoped loop forks, readiness planning, next-action routing, and loop run/evidence inspection.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg loop runs <loop> [--ws <alias>] [--no-cache] [--no-reindex] [--json]
```

### Examples

```bash
mdkg loop runs <loop> [--ws <alias>] [--no-cache] [--no-reindex] [--json]
```

### Common flags

- `--root <path>`: Run against a specific repository root; -r is the short alias.
- `--ws <alias>`: Resolve the command against one workspace alias.
- `--json`: Emit deterministic JSON instead of text.
- `--no-cache`: Build a non-persisting in-memory index projection instead of reading the cache.
- `--no-reindex`: Do not rebuild a stale or missing index projection.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: loop-runs-receipt

### Related commands

`mdkg loop`, `mdkg loop fork`, `mdkg loop list`, `mdkg loop next`, `mdkg loop plan`

## loop show

mdkg loop show command

- Command: `mdkg loop show`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for reusable loop templates, scoped loop forks, readiness planning, next-action routing, and loop run/evidence inspection.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg loop show <loop-or-template> [--meta] [--ws <alias>] [--no-cache] [--no-reindex] [--json]
```

### Examples

```bash
mdkg loop show <loop-or-template> [--meta] [--ws <alias>] [--no-cache] [--no-reindex] [--json]
```

### Common flags

- `--meta`: Show metadata without the full body.
- `--root <path>`: Run against a specific repository root; -r is the short alias.
- `--ws <alias>`: Resolve the command against one workspace alias.
- `--json`: Emit deterministic JSON instead of text.
- `--no-cache`: Build a non-persisting in-memory index projection instead of reading the cache.
- `--no-reindex`: Do not rebuild a stale or missing index projection.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: loop-show-receipt

### Related commands

`mdkg loop`, `mdkg loop fork`, `mdkg loop list`, `mdkg loop next`, `mdkg loop plan`

## manifest

mdkg manifest command

- Command: `mdkg manifest`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use this command when the matching command family is the current workflow surface.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg manifest list [--json]
mdkg manifest show <id-or-qid-or-alias> [--json]
mdkg manifest validate [<id-or-qid-or-alias>] [--json]
```

### Examples

```bash
mdkg manifest list [--json]
mdkg manifest show <id-or-qid-or-alias> [--json]
mdkg manifest validate [<id-or-qid-or-alias>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg manifest list [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg manifest list`, `mdkg manifest show`, `mdkg manifest validate`

## manifest list

mdkg manifest list command

- Command: `mdkg manifest list`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use this command when the matching command family is the current workflow surface.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg manifest list [--json]
```

### Examples

```bash
mdkg manifest list [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg manifest list [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg manifest`, `mdkg manifest show`, `mdkg manifest validate`

## manifest show

mdkg manifest show command

- Command: `mdkg manifest show`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use this command when the matching command family is the current workflow surface.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg manifest show <id-or-qid-or-alias> [--json]
```

### Examples

```bash
mdkg manifest show <id-or-qid-or-alias> [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg manifest show <id-or-qid-or-alias> [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg manifest`, `mdkg manifest list`, `mdkg manifest validate`

## manifest validate

mdkg manifest validate command

- Command: `mdkg manifest validate`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use this command when the matching command family is the current workflow surface.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg manifest validate [<id-or-qid-or-alias>] [--json]
```

### Examples

```bash
mdkg manifest validate [<id-or-qid-or-alias>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg manifest validate [<id-or-qid-or-alias>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg manifest`, `mdkg manifest list`, `mdkg manifest show`

## mcp

mdkg mcp command

- Command: `mdkg mcp`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for the local read-only MCP server surface.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg mcp serve --stdio
```

### Examples

```bash
mdkg mcp serve --stdio
```

### Common flags

- `--help`: --help, -h          Show help
- `--root <path>`: - use --root <path> to select the mdkg graph explicitly
- `--stdio`: mdkg mcp serve --stdio
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg mcp serve`

## mcp serve

mdkg mcp serve command

- Command: `mdkg mcp serve`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for the local read-only MCP server surface.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg mcp serve --stdio
```

### Examples

```bash
mdkg mcp serve --stdio
```

### Common flags

- `--help`: --help, -h          Show help
- `--root`: - starts one local Model Context Protocol server bound to the selected --root
- `--stdio`: mdkg mcp serve --stdio
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg mcp`

## new

mdkg new command

- Command: `mdkg new`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use to create graph nodes and workflow records.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg new <type> "<title>" [options] [--json]
```

### Examples

```bash
mdkg new <type> "<title>" [options] [--json]
```

### Common flags

- `--blocked-by`: --parent --prev --next --relates --blocked-by --blocks
- `--contract-profile <name>`: --contract-profile <name>  Optional MANIFEST/WORK/WORK_ORDER/RECEIPT validation profile metadata
- `--epic <id>`: --epic <id>                Epic id
- `--evidence-policy-ref <ref>`: --evidence-policy-ref <ref> Optional MANIFEST/WORK_ORDER/RECEIPT evidence policy ref
- `--help`: --help, -h          Show help
- `--id <portable-id>`: Use --id <portable-id> with these types for semantic ids like agent.image-worker.
- `--json`: mdkg new <type> "<title>" [options] [--json]
- `--links`: --links --artifacts --refs --aliases --owners --cases --supersedes
- `--next`: --parent --prev --next --relates --blocked-by --blocks
- `--owners`: --links --artifacts --refs --aliases --owners --cases --supersedes
- `--parent`: --parent --prev --next --relates --blocked-by --blocks
- `--priority <0..9>`: --priority <0..9>          Work item priority
- 13 additional flags omitted from this generated summary.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-graph-node
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: exclusive-create
- Receipts: node-create-receipt

### Related commands

none

## next

mdkg next command

- Command: `mdkg next`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use this command when the matching command family is the current workflow surface.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg next [<id-or-qid>] [--ws <alias>]
```

### Examples

```bash
mdkg next [<id-or-qid>] [--ws <alias>]
```

### Common flags

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg next [<id-or-qid>] [--ws <alias>]

### Output and safety

- Output formats: text
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

none

## pack

mdkg pack command

- Command: `mdkg pack`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use to assemble deterministic context for one bounded work item.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg pack <id-or-qid> [options]
mdkg pack --list-profiles
```

### Examples

```bash
mdkg pack --list-profiles
mdkg pack <id-or-qid> [options]
```

### Common flags

- `--depth`: --depth --edges --strip-code --max-code-lines --max-chars --max-lines --max-tokens
- `--dry-run`: --dry-run                Preview selection/order/stats without writing files
- `--edges accepts`: --edges accepts parent, epic, relates, blocked_by, blocks, prev, next, context_refs, evidence_refs
- `--format <fmt>`: -f, --format <fmt>           Output format: md|json|toon|xml (default md)
- `--help`: --help, -h          Show help
- `--list-profiles`: mdkg pack --list-profiles
- `--max-chars`: --depth --edges --strip-code --max-code-lines --max-chars --max-lines --max-tokens
- `--max-tokens`: --depth --edges --strip-code --max-code-lines --max-chars --max-lines --max-tokens
- `--out <path>`: -o, --out <path>             Output file path
- `--profile <name>`: --profile <name>         Body profile: standard|concise|headers (default standard)
- `--root`: --root, -r <path>   Run against a specific repo root
- `--skills <mode>`: --skills <mode>          Skill inclusion: none|auto|<slug,slug,...> (default auto)
- 8 additional flags omitted from this generated summary.

### Output and safety

- Output formats: text
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

none

## search

mdkg search command

- Command: `mdkg search`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use to discover graph records by text, kind, or capability.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg search "<query>" [--type <type>] [--status <status>] [--ws <alias>]
```

### Examples

```bash
mdkg search "<query>" [--type <type>] [--status <status>] [--ws <alias>]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: [--tags <tag,tag,...>] [--tags-mode any|all] [--limit <n>] [--json|--xml|--toon|--md]
- `--limit <n>`: [--tags <tag,tag,...>] [--tags-mode any|all] [--limit <n>] [--json|--xml|--toon|--md]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--status <status>`: mdkg search "<query>" [--type <type>] [--status <status>] [--ws <alias>]
- `--tags <tag,tag,...>`: [--tags <tag,tag,...>] [--tags-mode any|all] [--limit <n>] [--json|--xml|--toon|--md]
- `--tags-mode any|all`: [--tags <tag,tag,...>] [--tags-mode any|all] [--limit <n>] [--json|--xml|--toon|--md]
- `--type <type>`: mdkg search "<query>" [--type <type>] [--status <status>] [--ws <alias>]
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg search "<query>" [--type <type>] [--status <status>] [--ws <alias>]

### Output and safety

- Output formats: text, json, xml, toon, md
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

none

## show

mdkg show command

- Command: `mdkg show`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use to inspect a specific graph node or record.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg show <id-or-qid> [--ws <alias>] [--meta] [--json|--xml|--toon|--md]
```

### Examples

```bash
mdkg show <id-or-qid> [--ws <alias>] [--meta] [--json|--xml|--toon|--md]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg show <id-or-qid> [--ws <alias>] [--meta] [--json|--xml|--toon|--md]
- `--meta`: mdkg show <id-or-qid> [--ws <alias>] [--meta] [--json|--xml|--toon|--md]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg show <id-or-qid> [--ws <alias>] [--meta] [--json|--xml|--toon|--md]

### Output and safety

- Output formats: text, json, xml, toon, md
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

none

## skill

mdkg skill command

- Command: `mdkg skill`
- Mode: Mutating command
- Public status: stable / public
- Danger level: mixed

### When to use

Use to manage repo-local skills and generated tool mirrors.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg skill new <slug> "<name>" --description "<description>" [options] [--json]
mdkg skill list [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
mdkg skill show <slug> [--meta] [--json|--xml|--toon|--md]
mdkg skill search "<query>" [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
mdkg skill validate [<slug>] [--json]
mdkg skill sync [--force] [--json]
```

### Examples

```bash
mdkg skill list [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
mdkg skill new <slug> "<name>" --description "<description>" [options] [--json]
mdkg skill show <slug> [--meta] [--json|--xml|--toon|--md]
```

### Common flags

- `--description "<description>"`: mdkg skill new <slug> "<name>" --description "<description>" [options] [--json]
- `--force`: mdkg skill sync [--force] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg skill new <slug> "<name>" --description "<description>" [options] [--json]
- `--meta`: mdkg skill show <slug> [--meta] [--json|--xml|--toon|--md]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--tags <tag,tag,...>`: mdkg skill list [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
- `--tags-mode any|all`: mdkg skill list [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json, xml, toon, md
- Dry run: {"supported":false}
- Side effects: read-or-write-skills-and-agent-mirrors
- Read paths: .mdkg/**
- Write paths: .agents/skills/**, .claude/skills/**, .mdkg/index/**, .mdkg/skills/**
- Lock policy: mutation-lock-required-for-new-sync
- Atomic write policy: exclusive-create-and-atomic-file-writes
- Receipts: skill-receipt

### Related commands

`mdkg skill list`, `mdkg skill new`, `mdkg skill search`, `mdkg skill show`, `mdkg skill sync`

## skill list

mdkg skill list command

- Command: `mdkg skill list`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use to manage repo-local skills and generated tool mirrors.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg skill list [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
```

### Examples

```bash
mdkg skill list [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg skill list [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--tags <tag,tag,...>`: mdkg skill list [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
- `--tags-mode any|all`: mdkg skill list [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json, xml, toon, md
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg skill`, `mdkg skill new`, `mdkg skill search`, `mdkg skill show`, `mdkg skill sync`

## skill new

mdkg skill new command

- Command: `mdkg skill new`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use to manage repo-local skills and generated tool mirrors.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg skill new <slug> "<name>" --description "<description>" [options] [--json]
```

### Examples

```bash
mdkg skill new <slug> "<name>" --description "<description>" [options] [--json]
```

### Common flags

- `--authors <name,name,...>`: --authors <name,name,...>    Optional authors list
- `--description "<description>"`: mdkg skill new <slug> "<name>" --description "<description>" [options] [--json]
- `--force`: --force                      Overwrite existing SKILL.md
- `--help`: --help, -h          Show help
- `--json`: mdkg skill new <slug> "<name>" --description "<description>" [options] [--json]
- `--links <url,url,...>`: --links <url,url,...>        Optional links list
- `--root`: --root, -r <path>   Run against a specific repo root
- `--run-id <id>`: --run-id <id>                Optional event run id when event logging is enabled
- `--tags <tag,tag,...>`: --tags <tag,tag,...>         Optional skill tags
- `--version`: --version, -V       Show version
- `--with-scripts`: --with-scripts               Create scripts/ in the scaffold

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-skill
- Read paths: .mdkg/**
- Write paths: .agents/skills/**, .claude/skills/**, .mdkg/index/**, .mdkg/skills/**
- Lock policy: mutation-lock-required
- Atomic write policy: exclusive-create
- Receipts: skill-new-receipt

### Related commands

`mdkg skill`, `mdkg skill list`, `mdkg skill search`, `mdkg skill show`, `mdkg skill sync`

## skill search

mdkg skill search command

- Command: `mdkg skill search`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use to manage repo-local skills and generated tool mirrors.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg skill search "<query>" [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
```

### Examples

```bash
mdkg skill search "<query>" [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg skill search "<query>" [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--tags <tag,tag,...>`: mdkg skill search "<query>" [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
- `--tags-mode any|all`: mdkg skill search "<query>" [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json, xml, toon, md
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg skill`, `mdkg skill list`, `mdkg skill new`, `mdkg skill show`, `mdkg skill sync`

## skill show

mdkg skill show command

- Command: `mdkg skill show`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use to manage repo-local skills and generated tool mirrors.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg skill show <slug> [--meta] [--json|--xml|--toon|--md]
```

### Examples

```bash
mdkg skill show <slug> [--meta] [--json|--xml|--toon|--md]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg skill show <slug> [--meta] [--json|--xml|--toon|--md]
- `--meta`: mdkg skill show <slug> [--meta] [--json|--xml|--toon|--md]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json, xml, toon, md
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg skill`, `mdkg skill list`, `mdkg skill new`, `mdkg skill search`, `mdkg skill sync`

## skill sync

mdkg skill sync command

- Command: `mdkg skill sync`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use to manage repo-local skills and generated tool mirrors.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg skill sync [--force] [--json]
```

### Examples

```bash
mdkg skill sync [--force] [--json]
```

### Common flags

- `--force`: mdkg skill sync [--force] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg skill sync [--force] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: refresh-agent-skill-mirrors
- Read paths: .mdkg/**
- Write paths: .agents/skills/**, .claude/skills/**, .mdkg/index/**, .mdkg/skills/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: skill-sync-receipt

### Related commands

`mdkg skill`, `mdkg skill list`, `mdkg skill new`, `mdkg skill search`, `mdkg skill show`

## skill validate

mdkg skill validate command

- Command: `mdkg skill validate`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use to manage repo-local skills and generated tool mirrors.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg skill validate [<slug>] [--json]
```

### Examples

```bash
mdkg skill validate [<slug>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg skill validate [<slug>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg skill`, `mdkg skill list`, `mdkg skill new`, `mdkg skill search`, `mdkg skill show`

## spec

mdkg spec command

- Command: `mdkg spec`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use this command when the matching command family is the current workflow surface.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg spec list [--json]
mdkg spec show <id-or-qid-or-alias> [--json]
mdkg spec validate [<id-or-qid-or-alias>] [--json]
```

### Examples

```bash
mdkg spec list [--json]
mdkg spec show <id-or-qid-or-alias> [--json]
mdkg spec validate [<id-or-qid-or-alias>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg spec list [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg spec list`, `mdkg spec show`, `mdkg spec validate`

## spec list

mdkg spec list command

- Command: `mdkg spec list`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use this command when the matching command family is the current workflow surface.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg spec list [--json]
```

### Examples

```bash
mdkg spec list [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg spec list [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg spec`, `mdkg spec show`, `mdkg spec validate`

## spec show

mdkg spec show command

- Command: `mdkg spec show`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use this command when the matching command family is the current workflow surface.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg spec show <id-or-qid-or-alias> [--json]
```

### Examples

```bash
mdkg spec show <id-or-qid-or-alias> [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg spec show <id-or-qid-or-alias> [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg spec`, `mdkg spec list`, `mdkg spec validate`

## spec validate

mdkg spec validate command

- Command: `mdkg spec validate`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use this command when the matching command family is the current workflow surface.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg spec validate [<id-or-qid-or-alias>] [--json]
```

### Examples

```bash
mdkg spec validate [<id-or-qid-or-alias>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg spec validate [<id-or-qid-or-alias>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg spec`, `mdkg spec list`, `mdkg spec show`

## status

mdkg status command

- Command: `mdkg status`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for operator-readable repo, graph, cache, DB, and selected-goal health.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg status [--json]
```

### Examples

```bash
mdkg status [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg status [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: operator-status-receipt

### Related commands

none

## subgraph

mdkg subgraph command

- Command: `mdkg subgraph`
- Mode: Mutating command
- Public status: stable / public
- Danger level: mixed

### When to use

Use to inspect and refresh child graph bundles from a parent repo.

Beginner safety: Prefer the dry-run or plan mode before applying changes.

### Usage

```text
mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]
mdkg subgraph list [--json]
mdkg subgraph show <alias> [--json]
mdkg subgraph rm <alias> [--json]
mdkg subgraph enable <alias> [--json]
mdkg subgraph disable <alias> [--json]
mdkg subgraph verify [alias|--all] [--json]
mdkg subgraph refresh [alias|--all] [--json]
mdkg subgraph audit [alias|--all] [--target <path>] [--json]
mdkg subgraph upgrade-plan [alias|--all] [--json]
mdkg subgraph sync [alias|--all] [--dry-run] [--allow-dirty] [--json]
mdkg subgraph materialize [alias|--all] --target <path> [--clean] [--gitignore] [--json]
```

### Examples

```bash
mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]
mdkg subgraph list [--json]
mdkg subgraph show <alias> [--json]
```

### Common flags

- `--allow-dirty`: mdkg subgraph sync [alias|--all] [--dry-run] [--allow-dirty] [--json]
- `--clean`: mdkg subgraph materialize [alias|--all] --target <path> [--clean] [--gitignore] [--json]
- `--dry-run`: mdkg subgraph sync [alias|--all] [--dry-run] [--allow-dirty] [--json]
- `--gitignore`: mdkg subgraph materialize [alias|--all] --target <path> [--clean] [--gitignore] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]
- `--max-stale-seconds <seconds>`: mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]
- `--profile private|public`: mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--source-path <path>`: mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]
- `--source-repo <ref>`: mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]
- `--target <path>`: mdkg subgraph audit [alias|--all] [--target <path>] [--json]
- 2 additional flags omitted from this generated summary.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":true,"commands":["sync","materialize","audit","upgrade-plan"]}
- Side effects: read-or-write-subgraph-config-and-materialized-trees
- Read paths: .mdkg/**
- Write paths: .mdkg/config.json, .mdkg/index/**, .mdkg/subgraphs/**
- Lock policy: mutation-lock-required-for-add-rm-enable-disable-sync-materialize
- Atomic write policy: atomic-config-writes-and-temp-tree-rename
- Receipts: subgraph-receipt

### Related commands

`mdkg subgraph add`, `mdkg subgraph disable`, `mdkg subgraph enable`, `mdkg subgraph list`, `mdkg subgraph materialize`

## subgraph add

mdkg subgraph add command

- Command: `mdkg subgraph add`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use to inspect and refresh child graph bundles from a parent repo.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]
```

### Examples

```bash
mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]
- `--max-stale-seconds <seconds>`: mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]
- `--profile private|public`: mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--source-path <path>`: mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]
- `--source-repo <ref>`: mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]
- `--version`: --version, -V       Show version
- `--visibility private|internal|public`: mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: register-subgraph
- Read paths: .mdkg/**
- Write paths: .mdkg/config.json, .mdkg/index/**, .mdkg/subgraphs/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-config-write
- Receipts: subgraph-add-receipt

### Related commands

`mdkg subgraph`, `mdkg subgraph disable`, `mdkg subgraph enable`, `mdkg subgraph list`, `mdkg subgraph materialize`

## subgraph disable

mdkg subgraph disable command

- Command: `mdkg subgraph disable`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use to inspect and refresh child graph bundles from a parent repo.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg subgraph disable <alias> [--json]
```

### Examples

```bash
mdkg subgraph disable <alias> [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg subgraph disable <alias> [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: disable-subgraph-registration
- Read paths: .mdkg/**
- Write paths: .mdkg/config.json, .mdkg/index/**, .mdkg/subgraphs/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-config-write
- Receipts: subgraph-disable-receipt

### Related commands

`mdkg subgraph`, `mdkg subgraph add`, `mdkg subgraph enable`, `mdkg subgraph list`, `mdkg subgraph materialize`

## subgraph enable

mdkg subgraph enable command

- Command: `mdkg subgraph enable`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use to inspect and refresh child graph bundles from a parent repo.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg subgraph enable <alias> [--json]
```

### Examples

```bash
mdkg subgraph enable <alias> [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg subgraph enable <alias> [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: enable-subgraph-registration
- Read paths: .mdkg/**
- Write paths: .mdkg/config.json, .mdkg/index/**, .mdkg/subgraphs/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-config-write
- Receipts: subgraph-enable-receipt

### Related commands

`mdkg subgraph`, `mdkg subgraph add`, `mdkg subgraph disable`, `mdkg subgraph list`, `mdkg subgraph materialize`

## subgraph list

mdkg subgraph list command

- Command: `mdkg subgraph list`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use to inspect and refresh child graph bundles from a parent repo.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg subgraph list [--json]
```

### Examples

```bash
mdkg subgraph list [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg subgraph list [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg subgraph`, `mdkg subgraph add`, `mdkg subgraph disable`, `mdkg subgraph enable`, `mdkg subgraph materialize`

## subgraph materialize

mdkg subgraph materialize command

- Command: `mdkg subgraph materialize`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use to inspect and refresh child graph bundles from a parent repo.

Beginner safety: Prefer the dry-run or plan mode before applying changes.

### Usage

```text
mdkg subgraph materialize [alias|--all] --target <path> [--clean] [--gitignore] [--json]
```

### Examples

```bash
mdkg subgraph materialize [alias|--all] --target <path> [--clean] [--gitignore] [--json]
```

### Common flags

- `--clean`: mdkg subgraph materialize [alias|--all] --target <path> [--clean] [--gitignore] [--json]
- `--gitignore`: mdkg subgraph materialize [alias|--all] --target <path> [--clean] [--gitignore] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg subgraph materialize [alias|--all] --target <path> [--clean] [--gitignore] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--target <path>`: mdkg subgraph materialize [alias|--all] --target <path> [--clean] [--gitignore] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":true,"flag":"--dry-run"}
- Side effects: write-materialized-read-only-inspection-tree
- Read paths: .mdkg/**
- Write paths: .mdkg/subgraphs/**
- Lock policy: mutation-lock-required-for-write
- Atomic write policy: temp-tree-rename
- Receipts: subgraph-materialize-receipt

### Related commands

`mdkg subgraph`, `mdkg subgraph add`, `mdkg subgraph disable`, `mdkg subgraph enable`, `mdkg subgraph list`

## subgraph refresh

mdkg subgraph refresh command

- Command: `mdkg subgraph refresh`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use to inspect and refresh child graph bundles from a parent repo.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg subgraph refresh [alias|--all] [--json]
```

### Examples

```bash
mdkg subgraph refresh [alias|--all] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg subgraph refresh [alias|--all] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: refresh-root-owned-subgraph-bundle
- Read paths: .mdkg/**
- Write paths: .mdkg/config.json, .mdkg/index/**, .mdkg/subgraphs/**
- Lock policy: mutation-lock-required
- Atomic write policy: bundle-temp-rename
- Receipts: subgraph-refresh-receipt

### Related commands

`mdkg subgraph`, `mdkg subgraph add`, `mdkg subgraph disable`, `mdkg subgraph enable`, `mdkg subgraph list`

## subgraph rm

mdkg subgraph rm command

- Command: `mdkg subgraph rm`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use to inspect and refresh child graph bundles from a parent repo.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg subgraph rm <alias> [--json]
```

### Examples

```bash
mdkg subgraph rm <alias> [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg subgraph rm <alias> [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: remove-subgraph-registration
- Read paths: .mdkg/**
- Write paths: .mdkg/config.json, .mdkg/index/**, .mdkg/subgraphs/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-config-write
- Receipts: subgraph-rm-receipt

### Related commands

`mdkg subgraph`, `mdkg subgraph add`, `mdkg subgraph disable`, `mdkg subgraph enable`, `mdkg subgraph list`

## subgraph show

mdkg subgraph show command

- Command: `mdkg subgraph show`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use to inspect and refresh child graph bundles from a parent repo.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg subgraph show <alias> [--json]
```

### Examples

```bash
mdkg subgraph show <alias> [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg subgraph show <alias> [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg subgraph`, `mdkg subgraph add`, `mdkg subgraph disable`, `mdkg subgraph enable`, `mdkg subgraph list`

## subgraph sync

mdkg subgraph sync command

- Command: `mdkg subgraph sync`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use to inspect and refresh child graph bundles from a parent repo.

Beginner safety: Prefer the dry-run or plan mode before applying changes.

### Usage

```text
mdkg subgraph sync [alias|--all] [--dry-run] [--allow-dirty] [--json]
```

### Examples

```bash
mdkg subgraph sync [alias|--all] [--dry-run] [--allow-dirty] [--json]
```

### Common flags

- `--allow-dirty`: mdkg subgraph sync [alias|--all] [--dry-run] [--allow-dirty] [--json]
- `--dry-run`: mdkg subgraph sync [alias|--all] [--dry-run] [--allow-dirty] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg subgraph sync [alias|--all] [--dry-run] [--allow-dirty] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":true,"default":false,"flag":"--dry-run"}
- Side effects: refresh-root-owned-subgraph-bundles
- Read paths: .mdkg/**
- Write paths: .mdkg/config.json, .mdkg/index/**, .mdkg/subgraphs/**
- Lock policy: mutation-lock-required-for-apply
- Atomic write policy: bundle-temp-rename-and-atomic-config-write
- Receipts: subgraph-sync-receipt

### Related commands

`mdkg subgraph`, `mdkg subgraph add`, `mdkg subgraph disable`, `mdkg subgraph enable`, `mdkg subgraph list`

## subgraph verify

mdkg subgraph verify command

- Command: `mdkg subgraph verify`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use to inspect and refresh child graph bundles from a parent repo.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg subgraph verify [alias|--all] [--json]
```

### Examples

```bash
mdkg subgraph verify [alias|--all] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg subgraph verify [alias|--all] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg subgraph`, `mdkg subgraph add`, `mdkg subgraph disable`, `mdkg subgraph enable`, `mdkg subgraph list`

## task

mdkg task command

- Command: `mdkg task`
- Mode: Mutating command
- Public status: stable / public
- Danger level: mixed

### When to use

Use to start, update, and close task-like work nodes with evidence.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"] [--json]
mdkg task update <id-or-qid> [options] [--json]
mdkg task done <id-or-qid> [--checkpoint "<title>"] [--checkpoint-kind implementation|test-proof|goal-closeout|audit|handoff] [options] [--json]
```

### Examples

```bash
mdkg task done <id-or-qid> [--checkpoint "<title>"] [--checkpoint-kind implementation|test-proof|goal-closeout|audit|handoff] [options] [--json]
mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"] [--json]
mdkg task update <id-or-qid> [options] [--json]
```

### Common flags

- `--checkpoint "<title>"`: mdkg task done <id-or-qid> [--checkpoint "<title>"] [--checkpoint-kind implementation|test-proof|goal-closeout|audit|handoff] [options] [--json]
- `--checkpoint-kind implementation|test-proof|goal-closeout|audit|handoff`: mdkg task done <id-or-qid> [--checkpoint "<title>"] [--checkpoint-kind implementation|test-proof|goal-closeout|audit|handoff] [options] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"] [--json]
- `--note "<text>"`: mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--run-id <id>`: mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"] [--json]
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-update-task-lifecycle
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required-for-start-update-done
- Atomic write policy: atomic-file-writes
- Receipts: task-receipt

### Related commands

`mdkg task done`, `mdkg task start`, `mdkg task update`

## task done

mdkg task done command

- Command: `mdkg task done`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use to start, update, and close task-like work nodes with evidence.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg task done <id-or-qid> [--ws <alias>] [--add-artifacts <a,...>] [--add-links <l,...>]
```

### Examples

```bash
mdkg task done <id-or-qid> [--ws <alias>] [--add-artifacts <a,...>] [--add-links <l,...>]
```

### Common flags

- `--add-artifacts <a,...>`: mdkg task done <id-or-qid> [--ws <alias>] [--add-artifacts <a,...>] [--add-links <l,...>]
- `--add-links <l,...>`: mdkg task done <id-or-qid> [--ws <alias>] [--add-artifacts <a,...>] [--add-links <l,...>]
- `--add-refs <id,...>`: [--add-refs <id,...>] [--checkpoint "<title>"] [--checkpoint-kind implementation|test-proof|goal-closeout|audit|handoff] [--run-id <id>] [--note "<text>"] [--json]
- `--checkpoint "<title>"`: [--add-refs <id,...>] [--checkpoint "<title>"] [--checkpoint-kind implementation|test-proof|goal-closeout|audit|handoff] [--run-id <id>] [--note "<text>"] [--json]
- `--checkpoint-kind implementation|test-proof|goal-closeout|audit|handoff`: [--add-refs <id,...>] [--checkpoint "<title>"] [--checkpoint-kind implementation|test-proof|goal-closeout|audit|handoff] [--run-id <id>] [--note "<text>"] [--json]
- `--help`: --help, -h          Show help
- `--json`: [--add-refs <id,...>] [--checkpoint "<title>"] [--checkpoint-kind implementation|test-proof|goal-closeout|audit|handoff] [--run-id <id>] [--note "<text>"] [--json]
- `--note "<text>"`: [--add-refs <id,...>] [--checkpoint "<title>"] [--checkpoint-kind implementation|test-proof|goal-closeout|audit|handoff] [--run-id <id>] [--note "<text>"] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--run-id <id>`: [--add-refs <id,...>] [--checkpoint "<title>"] [--checkpoint-kind implementation|test-proof|goal-closeout|audit|handoff] [--run-id <id>] [--note "<text>"] [--json]
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg task done <id-or-qid> [--ws <alias>] [--add-artifacts <a,...>] [--add-links <l,...>]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: complete-task
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: task-receipt

### Related commands

`mdkg task`, `mdkg task start`, `mdkg task update`

## task start

mdkg task start command

- Command: `mdkg task start`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use to start, update, and close task-like work nodes with evidence.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"] [--json]
```

### Examples

```bash
mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"] [--json]
- `--note "<text>"`: mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--run-id <id>`: mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"] [--json]
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: start-task
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: task-receipt

### Related commands

`mdkg task`, `mdkg task done`, `mdkg task update`

## task update

mdkg task update command

- Command: `mdkg task update`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use to start, update, and close task-like work nodes with evidence.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg task update <id-or-qid> [--ws <alias>] [--status <status>] [--priority <n>]
```

### Examples

```bash
mdkg task update <id-or-qid> [--ws <alias>] [--status <status>] [--priority <n>]
```

### Common flags

- `--add-artifacts <a,...>`: [--add-artifacts <a,...>] [--add-links <l,...>] [--add-refs <id,...>]
- `--add-blocked-by <id,...>`: [--add-skills <slug,...>] [--add-tags <tag,...>] [--add-blocked-by <id,...>]
- `--add-links <l,...>`: [--add-artifacts <a,...>] [--add-links <l,...>] [--add-refs <id,...>]
- `--add-refs <id,...>`: [--add-artifacts <a,...>] [--add-links <l,...>] [--add-refs <id,...>]
- `--add-skills <slug,...>`: [--add-skills <slug,...>] [--add-tags <tag,...>] [--add-blocked-by <id,...>]
- `--add-tags <tag,...>`: [--add-skills <slug,...>] [--add-tags <tag,...>] [--add-blocked-by <id,...>]
- `--clear-blocked-by`: [--clear-blocked-by] [--run-id <id>] [--note "<text>"] [--json]
- `--help`: --help, -h          Show help
- `--json`: [--clear-blocked-by] [--run-id <id>] [--note "<text>"] [--json]
- `--note "<text>"`: [--clear-blocked-by] [--run-id <id>] [--note "<text>"] [--json]
- `--priority <n>`: mdkg task update <id-or-qid> [--ws <alias>] [--status <status>] [--priority <n>]
- `--root`: --root, -r <path>   Run against a specific repo root
- 4 additional flags omitted from this generated summary.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: update-task
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: task-receipt

### Related commands

`mdkg task`, `mdkg task done`, `mdkg task start`

## upgrade

mdkg upgrade command

- Command: `mdkg upgrade`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use this command when the matching command family is the current workflow surface.

Beginner safety: Prefer the dry-run or plan mode before applying changes.

### Usage

```text
mdkg upgrade [--dry-run] [--apply] [--json]
```

### Examples

```bash
mdkg upgrade [--dry-run] [--apply] [--json]
```

### Common flags

- `--apply`: mdkg upgrade [--dry-run] [--apply] [--json]
- `--dry-run`: mdkg upgrade [--dry-run] [--apply] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg upgrade [--dry-run] [--apply] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":true,"default":true,"flag":"--apply"}
- Side effects: preview-or-apply-managed-scaffold-upgrade
- Read paths: .mdkg/**
- Write paths: .mdkg/**, AGENTS.md, AGENT_START.md, CLAUDE.md, CLI_COMMAND_MATRIX.md, llms.txt
- Lock policy: mutation-lock-required-for-apply
- Atomic write policy: atomic-file-writes
- Receipts: upgrade-apply-receipt, upgrade-plan

### Related commands

none

## validate

mdkg validate command

- Command: `mdkg validate`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use before closeout to check graph integrity and warning categories.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg validate [--out <path>] [--json-out <path>] [--quiet] [--changed-only] [--summary] [--limit <n>] [--profile <name>] [--json]
```

### Examples

```bash
mdkg validate [--out <path>] [--json-out <path>] [--quiet] [--changed-only] [--summary] [--limit <n>] [--profile <name>] [--json]
```

### Common flags

- `--changed-only`: mdkg validate [--out <path>] [--json-out <path>] [--quiet] [--changed-only] [--summary] [--limit <n>] [--profile <name>] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg validate [--out <path>] [--json-out <path>] [--quiet] [--changed-only] [--summary] [--limit <n>] [--profile <name>] [--json]
- `--json-out <path>`: mdkg validate [--out <path>] [--json-out <path>] [--quiet] [--changed-only] [--summary] [--limit <n>] [--profile <name>] [--json]
- `--limit <n>`: mdkg validate [--out <path>] [--json-out <path>] [--quiet] [--changed-only] [--summary] [--limit <n>] [--profile <name>] [--json]
- `--out <path>`: mdkg validate [--out <path>] [--json-out <path>] [--quiet] [--changed-only] [--summary] [--limit <n>] [--profile <name>] [--json]
- `--profile <name>`: mdkg validate [--out <path>] [--json-out <path>] [--quiet] [--changed-only] [--summary] [--limit <n>] [--profile <name>] [--json]
- `--quiet`: mdkg validate [--out <path>] [--json-out <path>] [--quiet] [--changed-only] [--summary] [--limit <n>] [--profile <name>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--summary`: mdkg validate [--out <path>] [--json-out <path>] [--quiet] [--changed-only] [--summary] [--limit <n>] [--profile <name>] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

none

## work

mdkg work command

- Command: `mdkg work`
- Mode: Mutating command
- Public status: stable / public
- Danger level: mixed

### When to use

Use for MANIFEST, legacy SPEC, WORK, WORK_ORDER, and RECEIPT workflow surfaces.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg work contract new ...
mdkg work trigger <work-or-capability-ref> ...
mdkg work order new|status|update ...
mdkg work receipt new|verify|update ...
mdkg work artifact add ...
mdkg work validate [<id-or-qid>] [--type <workflow-type>] [--profile <name>] [--json]
```

### Examples

```bash
mdkg work contract new ...
mdkg work order new|status|update ...
mdkg work trigger <work-or-capability-ref> ...
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg work validate [<id-or-qid>] [--type <workflow-type>] [--profile <name>] [--json]
- `--profile <name>`: mdkg work validate [<id-or-qid>] [--type <workflow-type>] [--profile <name>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--type <workflow-type>`: mdkg work validate [<id-or-qid>] [--type <workflow-type>] [--profile <name>] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-write-work-contract-mirrors
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required-for-contract-trigger-receipt-artifact-writes
- Atomic write policy: exclusive-create-and-atomic-file-writes
- Receipts: work-contract-receipt, work-order-receipt, work-receipt-receipt

### Related commands

`mdkg work artifact`, `mdkg work contract`, `mdkg work order`, `mdkg work receipt`, `mdkg work trigger`

## work artifact

mdkg work artifact command

- Command: `mdkg work artifact`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use for MANIFEST, legacy SPEC, WORK, WORK_ORDER, and RECEIPT workflow surfaces.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg work artifact add <order-or-receipt-id-or-qid> <file> [--id <archive.id>] [--kind source|artifact] [--json]
```

### Examples

```bash
mdkg work artifact add <order-or-receipt-id-or-qid> <file> [--id <archive.id>] [--kind source|artifact] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--id <archive.id>`: mdkg work artifact add <order-or-receipt-id-or-qid> <file> [--id <archive.id>] [--kind source|artifact] [--json]
- `--json`: mdkg work artifact add <order-or-receipt-id-or-qid> <file> [--id <archive.id>] [--kind source|artifact] [--json]
- `--kind source|artifact`: mdkg work artifact add <order-or-receipt-id-or-qid> <file> [--id <archive.id>] [--kind source|artifact] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-work-artifact-record
- Read paths: .mdkg/**
- Write paths: .mdkg/artifacts/**, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: exclusive-create
- Receipts: work-artifact-receipt

### Related commands

`mdkg work`, `mdkg work contract`, `mdkg work order`, `mdkg work receipt`, `mdkg work trigger`

## work contract

mdkg work contract command

- Command: `mdkg work contract`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use for MANIFEST, legacy SPEC, WORK, WORK_ORDER, and RECEIPT workflow surfaces.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--contract-profile <name>] [--required-capabilities <...>] [--pricing-model <...>] [--json]
```

### Examples

```bash
mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--contract-profile <name>] [--required-capabilities <...>] [--pricing-model <...>] [--json]
```

### Common flags

- `--agent-id <agent.id>`: mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--contract-profile <name>] [--required-capabilities <...>] [--pricing-model <...>] [--json]
- `--contract-profile <name>`: mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--contract-profile <name>] [--required-capabilities <...>] [--pricing-model <...>] [--json]
- `--help`: --help, -h          Show help
- `--id <work.id>`: mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--contract-profile <name>] [--required-capabilities <...>] [--pricing-model <...>] [--json]
- `--inputs <...>`: mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--contract-profile <name>] [--required-capabilities <...>] [--pricing-model <...>] [--json]
- `--json`: mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--contract-profile <name>] [--required-capabilities <...>] [--pricing-model <...>] [--json]
- `--kind <kind>`: mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--contract-profile <name>] [--required-capabilities <...>] [--pricing-model <...>] [--json]
- `--outputs <...>`: mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--contract-profile <name>] [--required-capabilities <...>] [--pricing-model <...>] [--json]
- `--pricing-model <...>`: mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--contract-profile <name>] [--required-capabilities <...>] [--pricing-model <...>] [--json]
- `--required-capabilities <...>`: mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--contract-profile <name>] [--required-capabilities <...>] [--pricing-model <...>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-or-update-work-contract
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: exclusive-create-or-atomic-file-write
- Receipts: work-contract-receipt

### Related commands

`mdkg work`, `mdkg work artifact`, `mdkg work order`, `mdkg work receipt`, `mdkg work trigger`

## work order

mdkg work order command

- Command: `mdkg work order`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for MANIFEST, legacy SPEC, WORK, WORK_ORDER, and RECEIPT workflow surfaces.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--contract-profile <name>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]
mdkg work order status <id-or-qid> [--json]
mdkg work order update <id-or-qid> [--status <status>] [--add-input-refs <...>] [--add-queue-refs <...>] [--add-artifacts <...>] [--json]
```

### Examples

```bash
mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--contract-profile <name>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]
mdkg work order status <id-or-qid> [--json]
mdkg work order update <id-or-qid> [--status <status>] [--add-input-refs <...>] [--add-queue-refs <...>] [--add-artifacts <...>] [--json]
```

### Common flags

- `--add-artifacts <...>`: mdkg work order update <id-or-qid> [--status <status>] [--add-input-refs <...>] [--add-queue-refs <...>] [--add-artifacts <...>] [--json]
- `--add-input-refs <...>`: mdkg work order update <id-or-qid> [--status <status>] [--add-input-refs <...>] [--add-queue-refs <...>] [--add-artifacts <...>] [--json]
- `--add-queue-refs <...>`: mdkg work order update <id-or-qid> [--status <status>] [--add-input-refs <...>] [--add-queue-refs <...>] [--add-artifacts <...>] [--json]
- `--contract-profile <name>`: mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--contract-profile <name>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]
- `--evidence-policy-ref <ref>`: mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--contract-profile <name>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]
- `--help`: --help, -h          Show help
- `--id <order.id>`: mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--contract-profile <name>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]
- `--input-refs <...>`: mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--contract-profile <name>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]
- `--json`: mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--contract-profile <name>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]
- `--payload-hash <sha256:...>`: mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--contract-profile <name>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]
- `--queue-refs <...>`: mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--contract-profile <name>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]
- `--request-ref <ref>`: mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--contract-profile <name>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]
- 8 additional flags omitted from this generated summary.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

### Related commands

`mdkg work`, `mdkg work artifact`, `mdkg work contract`, `mdkg work receipt`, `mdkg work trigger`

## work receipt

mdkg work receipt command

- Command: `mdkg work receipt`
- Mode: Mutating command
- Public status: stable / public
- Danger level: mixed

### When to use

Use for MANIFEST, legacy SPEC, WORK, WORK_ORDER, and RECEIPT workflow surfaces.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected|superseded] [--redaction-policy refs_and_hashes_only|redacted_summary|external_private] [--contract-profile <name>] [--receipt-kind <kind>] [--redaction-class <class>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--evidence-hashes <sha256:...>] [--json]
mdkg work receipt verify <id-or-qid> [--json]
mdkg work receipt update <id-or-qid> [--receipt-status <status>] [--add-artifacts <...>] [--add-proof-refs <...>] [--add-attestation-refs <...>] [--add-evidence-hashes <sha256:...>] [--json]
```

### Examples

```bash
mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected|superseded] [--redaction-policy refs_and_hashes_only|redacted_summary|external_private] [--contract-profile <name>] [--receipt-kind <kind>] [--redaction-class <class>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--evidence-hashes <sha256:...>] [--json]
mdkg work receipt update <id-or-qid> [--receipt-status <status>] [--add-artifacts <...>] [--add-proof-refs <...>] [--add-attestation-refs <...>] [--add-evidence-hashes <sha256:...>] [--json]
mdkg work receipt verify <id-or-qid> [--json]
```

### Common flags

- `--add-artifacts <...>`: mdkg work receipt update <id-or-qid> [--receipt-status <status>] [--add-artifacts <...>] [--add-proof-refs <...>] [--add-attestation-refs <...>] [--add-evidence-hashes <sha256:...>] [--json]
- `--add-attestation-refs <...>`: mdkg work receipt update <id-or-qid> [--receipt-status <status>] [--add-artifacts <...>] [--add-proof-refs <...>] [--add-attestation-refs <...>] [--add-evidence-hashes <sha256:...>] [--json]
- `--add-evidence-hashes <sha256:...>`: mdkg work receipt update <id-or-qid> [--receipt-status <status>] [--add-artifacts <...>] [--add-proof-refs <...>] [--add-attestation-refs <...>] [--add-evidence-hashes <sha256:...>] [--json]
- `--add-proof-refs <...>`: mdkg work receipt update <id-or-qid> [--receipt-status <status>] [--add-artifacts <...>] [--add-proof-refs <...>] [--add-attestation-refs <...>] [--add-evidence-hashes <sha256:...>] [--json]
- `--contract-profile <name>`: mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected|superseded] [--redaction-policy refs_and_hashes_only|redacted_summary|external_private] [--contract-profile <name>] [--receipt-kind <kind>] [--redaction-class <class>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--evidence-hashes <sha256:...>] [--json]
- `--evidence-hashes <sha256:...>`: mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected|superseded] [--redaction-policy refs_and_hashes_only|redacted_summary|external_private] [--contract-profile <name>] [--receipt-kind <kind>] [--redaction-class <class>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--evidence-hashes <sha256:...>] [--json]
- `--evidence-policy-ref <ref>`: mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected|superseded] [--redaction-policy refs_and_hashes_only|redacted_summary|external_private] [--contract-profile <name>] [--receipt-kind <kind>] [--redaction-class <class>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--evidence-hashes <sha256:...>] [--json]
- `--help`: --help, -h          Show help
- `--id <receipt.id>`: mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected|superseded] [--redaction-policy refs_and_hashes_only|redacted_summary|external_private] [--contract-profile <name>] [--receipt-kind <kind>] [--redaction-class <class>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--evidence-hashes <sha256:...>] [--json]
- `--json`: mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected|superseded] [--redaction-policy refs_and_hashes_only|redacted_summary|external_private] [--contract-profile <name>] [--receipt-kind <kind>] [--redaction-class <class>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--evidence-hashes <sha256:...>] [--json]
- `--outcome success|partial|failure`: mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected|superseded] [--redaction-policy refs_and_hashes_only|redacted_summary|external_private] [--contract-profile <name>] [--receipt-kind <kind>] [--redaction-class <class>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--evidence-hashes <sha256:...>] [--json]
- `--receipt-kind <kind>`: mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected|superseded] [--redaction-policy refs_and_hashes_only|redacted_summary|external_private] [--contract-profile <name>] [--receipt-kind <kind>] [--redaction-class <class>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--evidence-hashes <sha256:...>] [--json]
- 7 additional flags omitted from this generated summary.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-or-update-work-receipt
- Read paths: .mdkg/**
- Write paths: .mdkg/index/**, .mdkg/receipts/**
- Lock policy: mutation-lock-required-for-new-update
- Atomic write policy: exclusive-create-or-atomic-file-write
- Receipts: work-receipt-receipt, work-receipt-verify-receipt

### Related commands

`mdkg work`, `mdkg work artifact`, `mdkg work contract`, `mdkg work order`, `mdkg work trigger`

## work trigger

mdkg work trigger command

- Command: `mdkg work trigger`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use for MANIFEST, legacy SPEC, WORK, WORK_ORDER, and RECEIPT workflow surfaces.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg work trigger <work-or-capability-ref> [--id <order.id>] [--title "<title>"] [--requester <ref>] [--enqueue <queue>] [--json]
```

### Examples

```bash
mdkg work trigger <work-or-capability-ref> [--id <order.id>] [--title "<title>"] [--requester <ref>] [--enqueue <queue>] [--json]
```

### Common flags

- `--enqueue <queue>`: mdkg work trigger <work-or-capability-ref> [--id <order.id>] [--title "<title>"] [--requester <ref>] [--enqueue <queue>] [--json]
- `--help`: --help, -h          Show help
- `--id <order.id>`: mdkg work trigger <work-or-capability-ref> [--id <order.id>] [--title "<title>"] [--requester <ref>] [--enqueue <queue>] [--json]
- `--json`: mdkg work trigger <work-or-capability-ref> [--id <order.id>] [--title "<title>"] [--requester <ref>] [--enqueue <queue>] [--json]
- `--requester <ref>`: mdkg work trigger <work-or-capability-ref> [--id <order.id>] [--title "<title>"] [--requester <ref>] [--enqueue <queue>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--title "<title>"`: mdkg work trigger <work-or-capability-ref> [--id <order.id>] [--title "<title>"] [--requester <ref>] [--enqueue <queue>] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-submitted-work-order-and-optionally-enqueue-message
- Read paths: .mdkg/**
- Write paths: .mdkg/db/**, .mdkg/index/**, .mdkg/work_orders/**
- Lock policy: mutation-lock-required
- Atomic write policy: exclusive-create-and-sqlite-transaction
- Receipts: work-trigger-receipt

### Related commands

`mdkg work`, `mdkg work artifact`, `mdkg work contract`, `mdkg work order`, `mdkg work receipt`

## work validate

mdkg work validate command

- Command: `mdkg work validate`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for MANIFEST, legacy SPEC, WORK, WORK_ORDER, and RECEIPT workflow surfaces.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg work validate [<id-or-qid>] [--type manifest|spec|work|work_order|receipt|feedback|dispute|proposal] [--profile <name>] [--json]
```

### Examples

```bash
mdkg work validate [<id-or-qid>] [--type manifest|spec|work|work_order|receipt|feedback|dispute|proposal] [--profile <name>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg work validate [<id-or-qid>] [--type manifest|spec|work|work_order|receipt|feedback|dispute|proposal] [--profile <name>] [--json]
- `--profile <name>`: mdkg work validate [<id-or-qid>] [--type manifest|spec|work|work_order|receipt|feedback|dispute|proposal] [--profile <name>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--type manifest|spec|work|work_order|receipt|feedback|dispute|proposal`: mdkg work validate [<id-or-qid>] [--type manifest|spec|work|work_order|receipt|feedback|dispute|proposal] [--profile <name>] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: work-validate-receipt

### Related commands

`mdkg work`, `mdkg work artifact`, `mdkg work contract`, `mdkg work order`, `mdkg work receipt`

## workspace

mdkg workspace command

- Command: `mdkg workspace`
- Mode: Mutating command
- Public status: stable / public
- Danger level: mixed

### When to use

Use this command when the matching command family is the current workflow surface.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg workspace ls [--json]
mdkg workspace add <alias> <path> [--mdkg-dir <dir>] [--visibility <level>] [--json]
mdkg workspace rm <alias> [--json]
mdkg workspace enable <alias> [--json]
mdkg workspace disable <alias> [--json]
```

### Examples

```bash
mdkg workspace add <alias> <path> [--mdkg-dir <dir>] [--visibility <level>] [--json]
mdkg workspace ls [--json]
mdkg workspace rm <alias> [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg workspace ls [--json]
- `--mdkg-dir <dir>`: mdkg workspace add <alias> <path> [--mdkg-dir <dir>] [--visibility <level>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--visibility <level>`: mdkg workspace add <alias> <path> [--mdkg-dir <dir>] [--visibility <level>] [--json]

### Output and safety

- Output formats: text, json, md
- Dry run: {"supported":false}
- Side effects: read-or-update-workspace-config
- Read paths: .mdkg/**
- Write paths: .mdkg/config.json, .mdkg/index/**
- Lock policy: mutation-lock-required-for-add-rm-enable-disable
- Atomic write policy: atomic-config-write
- Receipts: workspace-receipt

### Related commands

none

