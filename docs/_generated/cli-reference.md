# Generated CLI Reference

<!-- generated-from: dist/command-contract.json -->
<!-- contract-hash: 35018c8d8e9827545d061882bc55ea42d3bdbfff1224ab6414aa8e53a443e4a0 -->

This generated page is the broad user-facing command reference. Start with the common command groups in the reference home, then use this page when you need the complete command list.

The page is generated from current command metadata in `dist/command-contract.json`, which keeps usage, flags, output formats, and safety notes aligned with the CLI.

- Tool: mdkg
- Package version: 0.4.0
- Schema version: 1
- Command count: 102
- Categories: archive, bundle, capability, checkpoint, db, doctor, event, fix, format, global, goal, graph, guide, handoff, index, init, list, manifest, mcp, new, next, pack, search, show, skill, spec, status, subgraph, task, upgrade, validate, work, workspace

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
- global: 1
- goal: 13
- graph: 5
- guide: 1
- handoff: 1
- index: 1
- init: 1
- list: 1
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
mdkg archive compress <id-or-archive-uri|--all> [--json]
```

### Examples

```bash
mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--json]
mdkg archive list [--kind source|artifact] [--visibility private|internal|public] [--json]
mdkg archive show <id-or-archive-uri> [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

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
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

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
mdkg archive compress <id-or-archive-uri> [--ws <alias>] [--json]
mdkg archive compress --all [--json]
```

### Examples

```bash
mdkg archive compress --all [--json]
mdkg archive compress <id-or-archive-uri> [--ws <alias>] [--json]
```

### Common flags

- `--all [--json]`: mdkg archive compress --all [--json]
- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: refresh-archive-zip-cache
- Read paths: .mdkg/**
- Write paths: .mdkg/archive/**, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: zip-temp-rename
- Receipts: archive-compress-receipt

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
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

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
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

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

- `--help`: --help, -h          Show help
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
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

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
- `--lease-ms <ms>`: mdkg db queue claim <queue> --lease-owner <owner> --lease-ms <ms> [--json]
- `--lease-owner <owner>`: mdkg db queue claim <queue> --lease-owner <owner> --lease-ms <ms> [--json]
- `--payload-json <json>`: mdkg db queue enqueue <queue> <message-id> --payload-json <json>|--payload-file <path> [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

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
- `--root`: --root, -r <path>   Run against a specific repo root
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

- `--error <text>`: mdkg db queue fail <queue> <message-id> --lease-owner <owner> --error <text> [--retry-after-ms <ms>] [--json]
- `--help`: --help, -h          Show help
- `--lease-ms <ms>`: mdkg db queue claim <queue> --lease-owner <owner> --lease-ms <ms> [--json]
- `--lease-owner <owner>`: mdkg db queue claim <queue> --lease-owner <owner> --lease-ms <ms> [--json]
- `--payload-json <json>`: mdkg db queue enqueue <queue> <message-id> --payload-json <json>|--payload-file <path> [--dedupe-key <key>] [--available-at-ms <ms>] [--max-attempts <n>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

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
- `--root`: --root, -r <path>   Run against a specific repo root
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
- `--json`: --json                Emit machine-readable JSON output
- `--root`: --root, -r <path>   Run against a specific repo root
- `--strict`: --strict              Fail on stale selected-goal, DB, and generated cache health issues
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
- `--kind <kind>`: mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...> [options] [--json]
- `--refs <id,...>`: mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...> [options] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--status <ok|error|retry|skipped>`: mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...> [options] [--json]
- `--version`: --version, -V       Show version

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

- `--help`: --help, -h          Show help
- `--kind <kind>`: mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...>
- `--refs <id,...>`: mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...>
- `--root`: --root, -r <path>   Run against a specific repo root
- `--status <ok|error|retry|skipped>`: mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...>
- `--version`: --version, -V       Show version

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
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

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

- `--help`: --help, -h          Show help
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

- `--base-ref <ref>`: --base-ref <ref>      Prefer IDs that already exist at a Git base ref
- `--family ids`: --family ids          Explicit apply family; ids is the only supported apply family
- `--help`: --help, -h          Show help
- `--json`: --json                Emit machine-readable JSON output
- `--root`: --root, -r <path>   Run against a specific repo root
- `--target <id-or-qid>`: --target <id-or-qid>  Optional duplicate ID target
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

- `--apply it`: - without --apply it is equivalent to `mdkg fix plan --family ids`
- `--base-ref <ref>`: --base-ref <ref>      Prefer IDs that already exist at a Git base ref
- `--family ids``: - without --apply it is equivalent to `mdkg fix plan --family ids`
- `--help`: --help, -h          Show help
- `--json`: --json                Emit machine-readable JSON output
- `--root`: --root, -r <path>   Run against a specific repo root
- `--target <id-or-qid>`: --target <id-or-qid>  Optional duplicate ID target
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

- `--base-ref <ref>`: --base-ref <ref>      Prefer IDs that already exist at a Git base ref
- `--family ids``: - ids-family duplicate-id repairs can be applied with `mdkg fix apply --family ids`
- `--help`: --help, -h          Show help
- `--json`: --json                Emit machine-readable JSON output
- `--root`: --root, -r <path>   Run against a specific repo root
- `--target <id-or-qid>`: --target <id-or-qid>  Optional node target for family planners
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
- `--limit controls`: --summary emits bounded heading-change samples for agent/CI logs; --limit controls the sample size.
- `--root`: --root, -r <path>   Run against a specific repo root
- `--summary emits`: --summary emits bounded heading-change samples for agent/CI logs; --limit controls the sample size.
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
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

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
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

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
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

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
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

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
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

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
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

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
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

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

- `--help`: --help, -h          Show help
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
- `--root`: --root, -r <path>   Run against a specific repo root
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

- `--apply is`: - defaults to dry-run unless --apply is supplied
- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--select-goal requires`: - --select-goal requires --start-goal; on apply it activates the imported start goal, pauses competing active root goals, validates, then writes selected-goal state
- `--start-goal`: - --select-goal requires --start-goal; on apply it activates the imported start goal, pauses competing active root goals, validates, then writes selected-goal state
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

- `--help`: --help, -h          Show help
- `--out must`: - --out must stay inside the repo root
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

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

- `--help`: --help, -h          Show help
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

none

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
- `--epic <id>`: --epic <id>                Epic id
- `--help`: --help, -h          Show help
- `--id <portable-id>`: Use --id <portable-id> with these types for semantic ids like agent.image-worker.
- `--links`: --links --artifacts --refs --aliases --owners --cases --supersedes
- `--next`: --parent --prev --next --relates --blocked-by --blocks
- `--owners`: --links --artifacts --refs --aliases --owners --cases --supersedes
- `--parent`: --parent --prev --next --relates --blocked-by --blocks
- `--priority <0..9>`: --priority <0..9>          Work item priority
- `--refs`: --links --artifacts --refs --aliases --owners --cases --supersedes
- `--root`: --root, -r <path>   Run against a specific repo root
- `--run-id <id>`: --run-id <id>              Optional event run id when event logging is enabled
- 7 additional flags omitted from this generated summary.

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
- `--meta for`: Shows full body content. Use --meta for card + metadata only.
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
- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--tags`: Use stage tags like `stage:plan`, `stage:execute`, and `stage:review` with --tags.
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

- `--help`: --help, -h          Show help
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
- `--json`: --json                Emit machine-readable JSON output
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

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--target <path>`: mdkg subgraph materialize [alias|--all] --target <path> [--clean] [--gitignore] [--json]
- `--version`: --version, -V       Show version

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
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

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

- `--help`: --help, -h          Show help
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

- `--help`: --help, -h          Show help
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

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

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

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

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
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

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

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

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

- `--apply`: --apply               Apply safe managed init asset upgrades
- `--dry-run`: --dry-run             Preview upgrade changes without writing files (default)
- `--help`: --help, -h          Show help
- `--json`: --json                Emit machine-readable upgrade receipt
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
mdkg validate [--out <path>] [--json-out <path>] [--quiet] [--changed-only] [--summary] [--limit <n>] [--json]
```

### Examples

```bash
mdkg validate [--out <path>] [--json-out <path>] [--quiet] [--changed-only] [--summary] [--limit <n>] [--json]
```

### Common flags

- `--changed-only filters`: --changed-only filters warning presentation to changed .mdkg files while full graph errors still run.
- `--help`: --help, -h          Show help
- `--json-out writes`: --out writes the compatibility text report; --json-out writes a clean full JSON receipt.
- `--limit controls`: --summary emits bounded warning samples for agent/CI logs; --limit controls the sample size.
- `--out writes`: --out writes the compatibility text report; --json-out writes a clean full JSON receipt.
- `--root`: --root, -r <path>   Run against a specific repo root
- `--summary emits`: --summary emits bounded warning samples for agent/CI logs; --limit controls the sample size.
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

Use for SPEC, WORK, WORK_ORDER, and RECEIPT workflow surfaces.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg work contract new ...
mdkg work trigger <work-or-capability-ref> ...
mdkg work order new|status|update ...
mdkg work receipt new|verify|update ...
mdkg work artifact add ...
mdkg work validate [<id-or-qid>] [--type <workflow-type>] [--json]
```

### Examples

```bash
mdkg work contract new ...
mdkg work order new|status|update ...
mdkg work trigger <work-or-capability-ref> ...
```

### Common flags

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
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

Use for SPEC, WORK, WORK_ORDER, and RECEIPT workflow surfaces.

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

Use for SPEC, WORK, WORK_ORDER, and RECEIPT workflow surfaces.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--required-capabilities <...>] [--pricing-model <...>] [--json]
```

### Examples

```bash
mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--required-capabilities <...>] [--pricing-model <...>] [--json]
```

### Common flags

- `--agent-id <agent.id>`: mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--required-capabilities <...>] [--pricing-model <...>] [--json]
- `--help`: --help, -h          Show help
- `--id <work.id>`: mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--required-capabilities <...>] [--pricing-model <...>] [--json]
- `--inputs <...>`: mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--required-capabilities <...>] [--pricing-model <...>] [--json]
- `--kind <kind>`: mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--required-capabilities <...>] [--pricing-model <...>] [--json]
- `--outputs <...>`: mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--required-capabilities <...>] [--pricing-model <...>] [--json]
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

Use for SPEC, WORK, WORK_ORDER, and RECEIPT workflow surfaces.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]
mdkg work order status <id-or-qid> [--json]
mdkg work order update <id-or-qid> [--status <status>] [--add-input-refs <...>] [--add-queue-refs <...>] [--add-artifacts <...>] [--json]
```

### Examples

```bash
mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]
mdkg work order status <id-or-qid> [--json]
mdkg work order update <id-or-qid> [--status <status>] [--add-input-refs <...>] [--add-queue-refs <...>] [--add-artifacts <...>] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--id <order.id>`: mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]
- `--requester <ref>`: mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--work-id <work.id>`: mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]

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

Use for SPEC, WORK, WORK_ORDER, and RECEIPT workflow surfaces.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected|superseded] [--redaction-policy refs_and_hashes_only|redacted_summary|external_private] [--evidence-hashes <sha256:...>] [--json]
mdkg work receipt verify <id-or-qid> [--json]
mdkg work receipt update <id-or-qid> [--receipt-status <status>] [--add-artifacts <...>] [--add-proof-refs <...>] [--add-attestation-refs <...>] [--add-evidence-hashes <sha256:...>] [--json]
```

### Examples

```bash
mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected|superseded] [--redaction-policy refs_and_hashes_only|redacted_summary|external_private] [--evidence-hashes <sha256:...>] [--json]
mdkg work receipt update <id-or-qid> [--receipt-status <status>] [--add-artifacts <...>] [--add-proof-refs <...>] [--add-attestation-refs <...>] [--add-evidence-hashes <sha256:...>] [--json]
mdkg work receipt verify <id-or-qid> [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--id <receipt.id>`: mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected|superseded] [--redaction-policy refs_and_hashes_only|redacted_summary|external_private] [--evidence-hashes <sha256:...>] [--json]
- `--outcome success|partial|failure`: mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected|superseded] [--redaction-policy refs_and_hashes_only|redacted_summary|external_private] [--evidence-hashes <sha256:...>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--work-order-id <order.id>`: mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected|superseded] [--redaction-policy refs_and_hashes_only|redacted_summary|external_private] [--evidence-hashes <sha256:...>] [--json]

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

Use for SPEC, WORK, WORK_ORDER, and RECEIPT workflow surfaces.

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

- `--help`: --help, -h          Show help
- `--id order.example-1`: mdkg work trigger work.example --id order.example-1 --requester user://example --json
- `--json`: mdkg work trigger work.example --id order.example-1 --requester user://example --json
- `--requester user://example`: mdkg work trigger work.example --id order.example-1 --requester user://example --json
- `--root`: --root, -r <path>   Run against a specific repo root
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

Use for SPEC, WORK, WORK_ORDER, and RECEIPT workflow surfaces.

Beginner safety: Safe for initial grounding. It should not change repository files.

### Usage

```text
mdkg work validate [<id-or-qid>] [--type manifest|spec|work|work_order|receipt|feedback|dispute|proposal] [--json]
```

### Examples

```bash
mdkg work validate [<id-or-qid>] [--type manifest|spec|work|work_order|receipt|feedback|dispute|proposal] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
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
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

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

