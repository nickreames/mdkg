# Generated CLI Reference

<!-- generated-from: dist/command-contract.json -->
<!-- contract-hash: bb6d15e23a09b9a013aed406eac42e4e90f8ef6cb799759198a7777b3527ca74 -->

This file is generated. Do not hand-edit command metadata here; update the command contract source and rerun `npm run docs:generate`.

- Tool: mdkg
- Package version: 0.3.7
- Schema version: 1
- Command count: 98
- Categories: archive, bundle, capability, checkpoint, db, doctor, event, fix, format, global, goal, graph, guide, handoff, index, init, list, mcp, new, next, pack, search, show, skill, spec, status, subgraph, task, upgrade, validate, work, workspace

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

- Category: archive
- Status: stable
- Visibility: public
- Danger level: mixed
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-write-archive-sidecars
- Read paths: .mdkg/**
- Write paths: .mdkg/archive/**, .mdkg/index/**
- Lock policy: mutation-lock-required-for-add-compress
- Atomic write policy: atomic-file-writes-and-zip-temp-rename
- Receipts: archive-receipt

Usage:

```text
mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--json]
mdkg archive list [--kind source|artifact] [--visibility private|internal|public] [--json]
mdkg archive show <id-or-archive-uri> [--json]
mdkg archive verify [id-or-archive-uri] [--json]
mdkg archive compress <id-or-archive-uri|--all> [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## archive add

mdkg archive add command

- Category: archive
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-archive-sidecar
- Read paths: .mdkg/**
- Write paths: .mdkg/archive/**, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes-and-zip-temp-rename
- Receipts: archive-add-receipt

Usage:

```text
mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--title <title>] [--refs <...>] [--relates <...>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## archive compress

mdkg archive compress command

- Category: archive
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: refresh-archive-zip-cache
- Read paths: .mdkg/**
- Write paths: .mdkg/archive/**, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: zip-temp-rename
- Receipts: archive-compress-receipt

Usage:

```text
mdkg archive compress <id-or-archive-uri> [--ws <alias>] [--json]
mdkg archive compress --all [--json]
```

Common flags:

- `--all [--json]`: mdkg archive compress --all [--json]
- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## archive list

mdkg archive list command

- Category: archive
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg archive list [--kind source|artifact] [--visibility private|internal|public] [--ws <alias>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## archive show

mdkg archive show command

- Category: archive
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg archive show <id-or-archive-uri> [--ws <alias>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## archive verify

mdkg archive verify command

- Category: archive
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg archive verify [id-or-archive-uri] [--ws <alias>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## bundle

mdkg bundle command

- Category: bundle
- Status: stable
- Visibility: public
- Danger level: mixed
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-write-mdkg-bundles
- Read paths: .mdkg/**
- Write paths: .mdkg/bundles/**, .mdkg/index/**
- Lock policy: mutation-lock-required-for-create-import
- Atomic write policy: zip-temp-rename-and-atomic-file-writes
- Receipts: bundle-receipt

Usage:

```text
mdkg bundle create [--profile private|public] [--ws <alias|all>] [--output <path>] [--json]
mdkg bundle verify [bundle-path] [--json]
mdkg bundle show <bundle-path> [--json]
mdkg bundle list [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## bundle create

mdkg bundle create command

- Category: bundle
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-bundle-zip
- Read paths: .mdkg/**
- Write paths: .mdkg/bundles/**, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: zip-temp-rename
- Receipts: bundle-create-receipt

Usage:

```text
mdkg bundle create [--profile private|public] [--ws <alias|all>] [--output <path>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## bundle import

mdkg bundle import command

- Category: bundle
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text
- Dry run: {"supported":false}
- Side effects: register-imported-subgraph-bundle
- Read paths: .mdkg/**
- Write paths: .mdkg/config.json, .mdkg/index/**, .mdkg/subgraphs/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-config-write
- Receipts: bundle-import-receipt

Usage:

```text
mdkg subgraph add/list/show/rm/enable/disable/verify/refresh/audit/upgrade-plan/sync/materialize ...
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## bundle list

mdkg bundle list command

- Category: bundle
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg bundle list [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## bundle show

mdkg bundle show command

- Category: bundle
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg bundle show <bundle-path> [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## bundle verify

mdkg bundle verify command

- Category: bundle
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg bundle verify [bundle-path] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## capability

mdkg capability command

- Category: capability
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg capability list [--kind <kind>] [--visibility <level>] [--json]
mdkg capability search "<query>" [--kind <kind>] [--visibility <level>] [--json]
mdkg capability show <id-or-qid-or-slug> [--json]
mdkg capability resolve [query] [--requires <capability>] [--fresh-only] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## capability list

mdkg capability list command

- Category: capability
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg capability list [--kind <kind>] [--visibility <level>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## capability search

mdkg capability search command

- Category: capability
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg capability search "<query>" [--kind <kind>] [--visibility <level>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## capability show

mdkg capability show command

- Category: capability
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg capability show <id-or-qid-or-slug> [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## checkpoint

mdkg checkpoint command

- Category: checkpoint
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-checkpoint-node
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: exclusive-create
- Receipts: checkpoint-receipt

Usage:

```text
mdkg checkpoint new <title> [--kind implementation|test-proof|goal-closeout|audit|handoff] [--ws <alias>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## db

mdkg db command

- Category: db
- Status: stable
- Visibility: public
- Danger level: mixed
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-write-project-db-and-snapshots
- Read paths: .mdkg/**
- Write paths: .mdkg/db/**, .mdkg/index/**
- Lock policy: mutation-lock-required-for-init-migrate-queue-snapshot-seal
- Atomic write policy: atomic-file-writes-and-sqlite-transactions
- Receipts: project-db-receipt, queue-receipt, snapshot-receipt

Usage:

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

Common flags:

- `--help`: --help, -h          Show help
- `--lease-ms <ms>`: mdkg db queue claim <queue> --lease-owner <owner> --lease-ms <ms> [--json]
- `--lease-owner <owner>`: mdkg db queue claim <queue> --lease-owner <owner> --lease-ms <ms> [--json]
- `--payload-json <json>`: mdkg db queue enqueue <queue> <message-id> --payload-json <json>|--payload-file <path> [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## db index

mdkg db index command

- Category: db
- Status: stable
- Visibility: public
- Danger level: mixed
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-rebuild-sqlite-index
- Read paths: .mdkg/**
- Write paths: .mdkg/index/**
- Lock policy: mutation-lock-required-for-rebuild
- Atomic write policy: sqlite-transaction-and-temp-files
- Receipts: db-index-receipt

Usage:

```text
mdkg db index rebuild [--tolerant] [--json]
mdkg db index status [--json]
mdkg db index verify [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## db queue

mdkg db queue command

- Category: db
- Status: stable
- Visibility: public
- Danger level: mixed
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: emit-read-only-adapter-contract, read-or-write-local-project-db-queue-delivery-state
- Read paths: .mdkg/**
- Write paths: .mdkg/db/runtime/**
- Lock policy: mutation-lock-required-for-create-pause-resume-enqueue-claim-ack-fail-dead-letter-release-expired
- Atomic write policy: sqlite-transactions
- Receipts: queue-adapter-contract-receipt, queue-receipt

Usage:

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

Common flags:

- `--error <text>`: mdkg db queue fail <queue> <message-id> --lease-owner <owner> --error <text> [--retry-after-ms <ms>] [--json]
- `--help`: --help, -h          Show help
- `--lease-ms <ms>`: mdkg db queue claim <queue> --lease-owner <owner> --lease-ms <ms> [--json]
- `--lease-owner <owner>`: mdkg db queue claim <queue> --lease-owner <owner> --lease-ms <ms> [--json]
- `--payload-json <json>`: mdkg db queue enqueue <queue> <message-id> --payload-json <json>|--payload-file <path> [--dedupe-key <key>] [--available-at-ms <ms>] [--max-attempts <n>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## db snapshot

mdkg db snapshot command

- Category: db
- Status: stable
- Visibility: public
- Danger level: mixed
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-seal-project-db-snapshot
- Read paths: .mdkg/**
- Write paths: .mdkg/db/state/**
- Lock policy: mutation-lock-required-for-seal
- Atomic write policy: atomic-file-writes
- Receipts: snapshot-receipt

Usage:

```text
mdkg db snapshot seal [--queue-policy drain|paused] [--json]
mdkg db snapshot verify [--json]
mdkg db snapshot status [--json]
mdkg db snapshot dump [--snapshot <path>] [--output <path>] [--json]
mdkg db snapshot diff <left-snapshot> <right-snapshot> [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## doctor

mdkg doctor command

- Category: doctor
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg doctor [--strict] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--json`: --json                Emit machine-readable JSON output
- `--root`: --root, -r <path>   Run against a specific repo root
- `--strict`: --strict              Fail on stale selected-goal, DB, and generated cache health issues
- `--version`: --version, -V       Show version

## event

mdkg event command

- Category: event
- Status: stable
- Visibility: public
- Danger level: mixed
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-append-jsonl-event-log
- Read paths: .mdkg/**
- Write paths: .mdkg/events.jsonl
- Lock policy: mutation-lock-required-for-enable-append
- Atomic write policy: append-or-exclusive-create
- Receipts: event-receipt

Usage:

```text
mdkg event enable [--ws <alias>] [--json]
mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...> [options] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--kind <kind>`: mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...> [options] [--json]
- `--refs <id,...>`: mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...> [options] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--status <ok|error|retry|skipped>`: mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...> [options] [--json]
- `--version`: --version, -V       Show version

## event append

mdkg event append command

- Category: event
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: append-event-log-row
- Read paths: .mdkg/**
- Write paths: .mdkg/events.jsonl
- Lock policy: mutation-lock-required
- Atomic write policy: append-only-jsonl
- Receipts: event-append-receipt

Usage:

```text
mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...>
```

Common flags:

- `--help`: --help, -h          Show help
- `--kind <kind>`: mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...>
- `--refs <id,...>`: mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...>
- `--root`: --root, -r <path>   Run against a specific repo root
- `--status <ok|error|retry|skipped>`: mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...>
- `--version`: --version, -V       Show version

## event enable

mdkg event enable command

- Category: event
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-event-log
- Read paths: .mdkg/**
- Write paths: .mdkg/events.jsonl
- Lock policy: mutation-lock-required
- Atomic write policy: exclusive-create
- Receipts: event-enable-receipt

Usage:

```text
mdkg event enable [--ws <alias>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## fix

mdkg fix command

- Category: fix
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg fix plan [--family index|refs|ids|all] [--target <id-or-qid>] [--base-ref <ref>] [--json]
mdkg fix apply [--family ids] [--target <id-or-qid>] [--base-ref <ref>] [--json]
mdkg fix ids [--target <id-or-qid>] [--base-ref <ref>] [--apply] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## fix apply

mdkg fix apply command

- Category: fix
- Status: stable
- Visibility: public
- Danger level: high
- Output formats: text, json
- Dry run: {"supported":false,"apply_supported":true,"apply_family":"ids"}
- Side effects: rebuild-derived-indexes, rewrite-duplicate-node-ids
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: fix-apply-receipt

Usage:

```text
mdkg fix apply [--family ids] [--target <id-or-qid>] [--base-ref <ref>] [--json]
```

Common flags:

- `--base-ref <ref>`: --base-ref <ref>      Prefer IDs that already exist at a Git base ref
- `--family ids`: --family ids          Explicit apply family; ids is the only supported apply family
- `--help`: --help, -h          Show help
- `--json`: --json                Emit machine-readable JSON output
- `--root`: --root, -r <path>   Run against a specific repo root
- `--target <id-or-qid>`: --target <id-or-qid>  Optional duplicate ID target
- `--version`: --version, -V       Show version

## fix ids

mdkg fix ids command

- Category: fix
- Status: stable
- Visibility: public
- Danger level: high
- Output formats: text, json
- Dry run: {"supported":true,"default":true,"apply_flag":"--apply","apply_supported":true,"apply_family":"ids"}
- Side effects: plan-or-rewrite-duplicate-node-ids, rebuild-derived-indexes-when-apply
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required-when-apply
- Atomic write policy: atomic-file-writes-when-apply
- Receipts: fix-apply-receipt, fix-plan-receipt

Usage:

```text
mdkg fix ids [--target <id-or-qid>] [--base-ref <ref>] [--apply] [--json]
```

Common flags:

- `--apply it`: - without --apply it is equivalent to `mdkg fix plan --family ids`
- `--base-ref <ref>`: --base-ref <ref>      Prefer IDs that already exist at a Git base ref
- `--family ids``: - without --apply it is equivalent to `mdkg fix plan --family ids`
- `--help`: --help, -h          Show help
- `--json`: --json                Emit machine-readable JSON output
- `--root`: --root, -r <path>   Run against a specific repo root
- `--target <id-or-qid>`: --target <id-or-qid>  Optional duplicate ID target
- `--version`: --version, -V       Show version

## fix plan

mdkg fix plan command

- Category: fix
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":true,"default":true,"apply_supported":true,"apply_family":"ids"}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: fix-plan-receipt

Usage:

```text
mdkg fix plan [--family index|refs|ids|all] [--target <id-or-qid>] [--base-ref <ref>] [--json]
```

Common flags:

- `--base-ref <ref>`: --base-ref <ref>      Prefer IDs that already exist at a Git base ref
- `--family ids``: - ids-family duplicate-id repairs can be applied with `mdkg fix apply --family ids`
- `--help`: --help, -h          Show help
- `--json`: --json                Emit machine-readable JSON output
- `--root`: --root, -r <path>   Run against a specific repo root
- `--target <id-or-qid>`: --target <id-or-qid>  Optional node target for family planners
- `--version`: --version, -V       Show version

## format

mdkg format command

- Category: format
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":true,"default":false,"flag":"--dry-run"}
- Side effects: normalize-graph-markdown
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: format-receipt

Usage:

```text
mdkg format
mdkg format --headings [--dry-run|--apply] [--summary] [--limit <n>] [--json]
```

Common flags:

- `--apply to`: --headings adds missing recommended body headings; it defaults to dry-run and requires --apply to write files.
- `--headings [--dry-run|--apply]`: mdkg format --headings [--dry-run|--apply] [--summary] [--limit <n>] [--json]
- `--help`: --help, -h          Show help
- `--limit controls`: --summary emits bounded heading-change samples for agent/CI logs; --limit controls the sample size.
- `--root`: --root, -r <path>   Run against a specific repo root
- `--summary emits`: --summary emits bounded heading-change samples for agent/CI logs; --limit controls the sample size.
- `--version`: --version, -V       Show version

## global

mdkg - Markdown Knowledge Graph

- Category: global
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg <command> [options]
```

Common flags:

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

## goal

mdkg goal command

- Category: goal
- Status: stable
- Visibility: public
- Danger level: mixed
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-update-selected-goal-state
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required-for-select-clear-claim-pause-resume-done
- Atomic write policy: atomic-file-writes
- Receipts: goal-receipt

Usage:

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

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## goal activate

mdkg goal activate command

- Category: goal
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: activate-goal-and-pause-competing-goals
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: goal-state-receipt

Usage:

```text
mdkg goal activate <goal-id-or-qid> [--ws <alias>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## goal archive

mdkg goal archive command

- Category: goal
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: archive-goal
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: goal-state-receipt

Usage:

```text
mdkg goal archive <goal-id-or-qid> [--ws <alias>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## goal claim

mdkg goal claim command

- Category: goal
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: claim-goal-active-node
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: goal-state-receipt

Usage:

```text
mdkg goal claim <work-id-or-qid> [--ws <alias>] [--json]
mdkg goal claim <goal-id-or-qid> <work-id-or-qid> [--ws <alias>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## goal clear

mdkg goal clear command

- Category: goal
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: clear-selected-goal
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: goal-state-receipt

Usage:

```text
mdkg goal clear [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## goal current

mdkg goal current command

- Category: goal
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg goal current [--ws <alias>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## goal done

mdkg goal done command

- Category: goal
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: complete-goal
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: goal-state-receipt

Usage:

```text
mdkg goal done <goal-id-or-qid> [--ws <alias>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## goal evaluate

mdkg goal evaluate command

- Category: goal
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg goal evaluate <goal-id-or-qid> [--ws <alias>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## goal next

mdkg goal next command

- Category: goal
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg goal next [goal-id-or-qid] [--ws <alias>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## goal pause

mdkg goal pause command

- Category: goal
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: pause-goal
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: goal-state-receipt

Usage:

```text
mdkg goal pause <goal-id-or-qid> [--ws <alias>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## goal resume

mdkg goal resume command

- Category: goal
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: resume-goal
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: goal-state-receipt

Usage:

```text
mdkg goal resume <goal-id-or-qid> [--ws <alias>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## goal select

mdkg goal select command

- Category: goal
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: select-goal
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: goal-state-receipt

Usage:

```text
mdkg goal select <goal-id-or-qid> [--ws <alias>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## goal show

mdkg goal show command

- Category: goal
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg goal show <goal-id-or-qid> [--ws <alias>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## graph

mdkg graph command

- Category: graph
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg graph clone <source-bundle-or-mdkg-dir> --target <path> [--json]
mdkg graph fork <source-bundle-or-mdkg-dir> --target <path> [--start-goal <goal-id>] [--json]
mdkg graph import-template <source-bundle-or-mdkg-dir> [--start-goal <goal-id>] [--select-goal] [--id-prefix <prefix>] [--dry-run] [--apply] [--json]
mdkg graph refs <id-or-qid> [--ws <alias>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--target <path>`: mdkg graph clone <source-bundle-or-mdkg-dir> --target <path> [--json]
- `--version`: --version, -V       Show version

## graph clone

mdkg graph clone command

- Category: graph
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg graph clone <source-bundle-or-mdkg-dir> --target <path> [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--target <path>`: mdkg graph clone <source-bundle-or-mdkg-dir> --target <path> [--json]
- `--version`: --version, -V       Show version

## graph fork

mdkg graph fork command

- Category: graph
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg graph fork <source-bundle-or-mdkg-dir> --target <path> [--start-goal <goal-id>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--target <path>`: mdkg graph fork <source-bundle-or-mdkg-dir> --target <path> [--start-goal <goal-id>] [--json]
- `--version`: --version, -V       Show version

## graph import-template

mdkg graph import-template command

- Category: graph
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg graph import-template <source-bundle-or-mdkg-dir> [--start-goal <goal-id>] [--select-goal] [--id-prefix <prefix>] [--dry-run] [--apply] [--json]
```

Common flags:

- `--apply is`: - defaults to dry-run unless --apply is supplied
- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--select-goal requires`: - --select-goal requires --start-goal; on apply it activates the imported start goal, pauses competing active root goals, validates, then writes selected-goal state
- `--start-goal`: - --select-goal requires --start-goal; on apply it activates the imported start goal, pauses competing active root goals, validates, then writes selected-goal state
- `--version`: --version, -V       Show version

## graph refs

mdkg graph refs command

- Category: graph
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: graph-refs-receipt

Usage:

```text
mdkg graph refs <id-or-qid> [--ws <alias>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## guide

mdkg guide command

- Category: guide
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg guide
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## handoff

mdkg handoff command

- Category: handoff
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-sanitized-agent-handoff-when-out-is-provided
- Read paths: .mdkg/**
- Write paths: .mdkg/handoffs/**
- Lock policy: not-required-for-stdout-output
- Atomic write policy: atomic-file-write-when-out-is-provided
- Receipts: handoff-receipt

Usage:

```text
mdkg handoff create <id-or-qid> [--ws <alias>] [--depth <n>] [--out <path>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--out must`: - --out must stay inside the repo root
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## index

mdkg index command

- Category: index
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text
- Dry run: {"supported":false}
- Side effects: rebuild-generated-index-cache
- Read paths: .mdkg/**
- Write paths: .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: sqlite-transaction-and-atomic-cache-write
- Receipts: index-rebuild-receipt

Usage:

```text
mdkg index [--tolerant]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## init

mdkg init command

- Category: init
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text
- Dry run: {"supported":false}
- Side effects: initialize-mdkg-scaffold
- Read paths: .mdkg/**
- Write paths: .mdkg/**, AGENTS.md, AGENT_START.md, CLAUDE.md, CLI_COMMAND_MATRIX.md, llms.txt
- Lock policy: not-required-before-mdkg-config-exists
- Atomic write policy: exclusive-create-and-atomic-file-writes
- Receipts: init-summary

Usage:

```text
mdkg init [options]
```

Common flags:

- `--agent`: --agent               Create the complete agent bootstrap, skills, events, and mirrors
- `--force`: --force               Overwrite existing mdkg files
- `--help`: --help, -h          Show help
- `--no-update-ignores`: --no-update-ignores   Skip default .gitignore/.npmignore updates
- `--root`: --root, -r <path>   Run against a specific repo root
- `--update-dockerignore Append`: --update-dockerignore Append mdkg ignore entries
- `--update-gitignore`: --update-gitignore    Append mdkg ignore entries
- `--update-npmignore`: --update-npmignore    Append mdkg ignore entries
- `--version`: --version, -V       Show version

## list

mdkg list command

- Category: list
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json, xml, toon, md
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg list [--type <type>] [--status <status>] [--ws <alias>] [--epic <id>]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## mcp

mdkg mcp command

- Category: mcp
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg mcp serve --stdio
```

Common flags:

- `--help`: --help, -h          Show help
- `--root <path>`: - use --root <path> to select the mdkg graph explicitly
- `--stdio`: mdkg mcp serve --stdio
- `--version`: --version, -V       Show version

## mcp serve

mdkg mcp serve command

- Category: mcp
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg mcp serve --stdio
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: - starts one local Model Context Protocol server bound to the selected --root
- `--stdio`: mdkg mcp serve --stdio
- `--version`: --version, -V       Show version

## new

mdkg new command

- Category: new
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-graph-node
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: exclusive-create
- Receipts: node-create-receipt

Usage:

```text
mdkg new <type> "<title>" [options] [--json]
```

Common flags:

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

## next

mdkg next command

- Category: next
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg next [<id-or-qid>] [--ws <alias>]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## pack

mdkg pack command

- Category: pack
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg pack <id-or-qid> [options]
mdkg pack --list-profiles
```

Common flags:

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

## search

mdkg search command

- Category: search
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json, xml, toon, md
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg search "<query>" [--type <type>] [--status <status>] [--ws <alias>]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## show

mdkg show command

- Category: show
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json, xml, toon, md
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg show <id-or-qid> [--ws <alias>] [--meta] [--json|--xml|--toon|--md]
```

Common flags:

- `--help`: --help, -h          Show help
- `--meta for`: Shows full body content. Use --meta for card + metadata only.
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## skill

mdkg skill command

- Category: skill
- Status: stable
- Visibility: public
- Danger level: mixed
- Output formats: text, json, xml, toon, md
- Dry run: {"supported":false}
- Side effects: read-or-write-skills-and-agent-mirrors
- Read paths: .mdkg/**
- Write paths: .agents/skills/**, .claude/skills/**, .mdkg/index/**, .mdkg/skills/**
- Lock policy: mutation-lock-required-for-new-sync
- Atomic write policy: exclusive-create-and-atomic-file-writes
- Receipts: skill-receipt

Usage:

```text
mdkg skill new <slug> "<name>" --description "<description>" [options] [--json]
mdkg skill list [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
mdkg skill show <slug> [--meta] [--json|--xml|--toon|--md]
mdkg skill search "<query>" [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
mdkg skill validate [<slug>] [--json]
mdkg skill sync [--force] [--json]
```

Common flags:

- `--description "<description>"`: mdkg skill new <slug> "<name>" --description "<description>" [options] [--json]
- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--tags`: Use stage tags like `stage:plan`, `stage:execute`, and `stage:review` with --tags.
- `--version`: --version, -V       Show version

## skill list

mdkg skill list command

- Category: skill
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json, xml, toon, md
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg skill list [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## skill new

mdkg skill new command

- Category: skill
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-skill
- Read paths: .mdkg/**
- Write paths: .agents/skills/**, .claude/skills/**, .mdkg/index/**, .mdkg/skills/**
- Lock policy: mutation-lock-required
- Atomic write policy: exclusive-create
- Receipts: skill-new-receipt

Usage:

```text
mdkg skill new <slug> "<name>" --description "<description>" [options] [--json]
```

Common flags:

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

## skill search

mdkg skill search command

- Category: skill
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json, xml, toon, md
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg skill search "<query>" [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## skill show

mdkg skill show command

- Category: skill
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json, xml, toon, md
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg skill show <slug> [--meta] [--json|--xml|--toon|--md]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## skill sync

mdkg skill sync command

- Category: skill
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: refresh-agent-skill-mirrors
- Read paths: .mdkg/**
- Write paths: .agents/skills/**, .claude/skills/**, .mdkg/index/**, .mdkg/skills/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: skill-sync-receipt

Usage:

```text
mdkg skill sync [--force] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## skill validate

mdkg skill validate command

- Category: skill
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg skill validate [<slug>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## spec

mdkg spec command

- Category: spec
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg spec list [--json]
mdkg spec show <id-or-qid-or-alias> [--json]
mdkg spec validate [<id-or-qid-or-alias>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## spec list

mdkg spec list command

- Category: spec
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg spec list [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## spec show

mdkg spec show command

- Category: spec
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg spec show <id-or-qid-or-alias> [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## spec validate

mdkg spec validate command

- Category: spec
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg spec validate [<id-or-qid-or-alias>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## status

mdkg status command

- Category: status
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: operator-status-receipt

Usage:

```text
mdkg status [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--json`: --json                Emit machine-readable JSON output
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## subgraph

mdkg subgraph command

- Category: subgraph
- Status: stable
- Visibility: public
- Danger level: mixed
- Output formats: text, json
- Dry run: {"supported":true,"commands":["sync","materialize","audit","upgrade-plan"]}
- Side effects: read-or-write-subgraph-config-and-materialized-trees
- Read paths: .mdkg/**
- Write paths: .mdkg/config.json, .mdkg/index/**, .mdkg/subgraphs/**
- Lock policy: mutation-lock-required-for-add-rm-enable-disable-sync-materialize
- Atomic write policy: atomic-config-writes-and-temp-tree-rename
- Receipts: subgraph-receipt

Usage:

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

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--target <path>`: mdkg subgraph materialize [alias|--all] --target <path> [--clean] [--gitignore] [--json]
- `--version`: --version, -V       Show version

## subgraph add

mdkg subgraph add command

- Category: subgraph
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: register-subgraph
- Read paths: .mdkg/**
- Write paths: .mdkg/config.json, .mdkg/index/**, .mdkg/subgraphs/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-config-write
- Receipts: subgraph-add-receipt

Usage:

```text
mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## subgraph disable

mdkg subgraph disable command

- Category: subgraph
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: disable-subgraph-registration
- Read paths: .mdkg/**
- Write paths: .mdkg/config.json, .mdkg/index/**, .mdkg/subgraphs/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-config-write
- Receipts: subgraph-disable-receipt

Usage:

```text
mdkg subgraph disable <alias> [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## subgraph enable

mdkg subgraph enable command

- Category: subgraph
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: enable-subgraph-registration
- Read paths: .mdkg/**
- Write paths: .mdkg/config.json, .mdkg/index/**, .mdkg/subgraphs/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-config-write
- Receipts: subgraph-enable-receipt

Usage:

```text
mdkg subgraph enable <alias> [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## subgraph list

mdkg subgraph list command

- Category: subgraph
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg subgraph list [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## subgraph materialize

mdkg subgraph materialize command

- Category: subgraph
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":true,"flag":"--dry-run"}
- Side effects: write-materialized-read-only-inspection-tree
- Read paths: .mdkg/**
- Write paths: .mdkg/subgraphs/**
- Lock policy: mutation-lock-required-for-write
- Atomic write policy: temp-tree-rename
- Receipts: subgraph-materialize-receipt

Usage:

```text
mdkg subgraph materialize [alias|--all] --target <path> [--clean] [--gitignore] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--target <path>`: mdkg subgraph materialize [alias|--all] --target <path> [--clean] [--gitignore] [--json]
- `--version`: --version, -V       Show version

## subgraph refresh

mdkg subgraph refresh command

- Category: subgraph
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: refresh-root-owned-subgraph-bundle
- Read paths: .mdkg/**
- Write paths: .mdkg/config.json, .mdkg/index/**, .mdkg/subgraphs/**
- Lock policy: mutation-lock-required
- Atomic write policy: bundle-temp-rename
- Receipts: subgraph-refresh-receipt

Usage:

```text
mdkg subgraph refresh [alias|--all] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## subgraph rm

mdkg subgraph rm command

- Category: subgraph
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: remove-subgraph-registration
- Read paths: .mdkg/**
- Write paths: .mdkg/config.json, .mdkg/index/**, .mdkg/subgraphs/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-config-write
- Receipts: subgraph-rm-receipt

Usage:

```text
mdkg subgraph rm <alias> [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## subgraph show

mdkg subgraph show command

- Category: subgraph
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg subgraph show <alias> [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## subgraph sync

mdkg subgraph sync command

- Category: subgraph
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":true,"default":false,"flag":"--dry-run"}
- Side effects: refresh-root-owned-subgraph-bundles
- Read paths: .mdkg/**
- Write paths: .mdkg/config.json, .mdkg/index/**, .mdkg/subgraphs/**
- Lock policy: mutation-lock-required-for-apply
- Atomic write policy: bundle-temp-rename-and-atomic-config-write
- Receipts: subgraph-sync-receipt

Usage:

```text
mdkg subgraph sync [alias|--all] [--dry-run] [--allow-dirty] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## subgraph verify

mdkg subgraph verify command

- Category: subgraph
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg subgraph verify [alias|--all] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## task

mdkg task command

- Category: task
- Status: stable
- Visibility: public
- Danger level: mixed
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-update-task-lifecycle
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required-for-start-update-done
- Atomic write policy: atomic-file-writes
- Receipts: task-receipt

Usage:

```text
mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"] [--json]
mdkg task update <id-or-qid> [options] [--json]
mdkg task done <id-or-qid> [--checkpoint "<title>"] [--checkpoint-kind implementation|test-proof|goal-closeout|audit|handoff] [options] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## task done

mdkg task done command

- Category: task
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: complete-task
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: task-receipt

Usage:

```text
mdkg task done <id-or-qid> [--ws <alias>] [--add-artifacts <a,...>] [--add-links <l,...>]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## task start

mdkg task start command

- Category: task
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: start-task
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: task-receipt

Usage:

```text
mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## task update

mdkg task update command

- Category: task
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: update-task
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: task-receipt

Usage:

```text
mdkg task update <id-or-qid> [--ws <alias>] [--status <status>] [--priority <n>]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## upgrade

mdkg upgrade command

- Category: upgrade
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":true,"default":true,"flag":"--apply"}
- Side effects: preview-or-apply-managed-scaffold-upgrade
- Read paths: .mdkg/**
- Write paths: .mdkg/**, AGENTS.md, AGENT_START.md, CLAUDE.md, CLI_COMMAND_MATRIX.md, llms.txt
- Lock policy: mutation-lock-required-for-apply
- Atomic write policy: atomic-file-writes
- Receipts: upgrade-apply-receipt, upgrade-plan

Usage:

```text
mdkg upgrade [--dry-run] [--apply] [--json]
```

Common flags:

- `--apply`: --apply               Apply safe managed init asset upgrades
- `--dry-run`: --dry-run             Preview upgrade changes without writing files (default)
- `--help`: --help, -h          Show help
- `--json`: --json                Emit machine-readable upgrade receipt
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## validate

mdkg validate command

- Category: validate
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg validate [--out <path>] [--json-out <path>] [--quiet] [--changed-only] [--summary] [--limit <n>] [--json]
```

Common flags:

- `--changed-only filters`: --changed-only filters warning presentation to changed .mdkg files while full graph errors still run.
- `--help`: --help, -h          Show help
- `--json-out writes`: --out writes the compatibility text report; --json-out writes a clean full JSON receipt.
- `--limit controls`: --summary emits bounded warning samples for agent/CI logs; --limit controls the sample size.
- `--out writes`: --out writes the compatibility text report; --json-out writes a clean full JSON receipt.
- `--root`: --root, -r <path>   Run against a specific repo root
- `--summary emits`: --summary emits bounded warning samples for agent/CI logs; --limit controls the sample size.
- `--version`: --version, -V       Show version

## work

mdkg work command

- Category: work
- Status: stable
- Visibility: public
- Danger level: mixed
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-write-work-contract-mirrors
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required-for-contract-trigger-receipt-artifact-writes
- Atomic write policy: exclusive-create-and-atomic-file-writes
- Receipts: work-contract-receipt, work-order-receipt, work-receipt-receipt

Usage:

```text
mdkg work contract new ...
mdkg work trigger <work-or-capability-ref> ...
mdkg work order new|status|update ...
mdkg work receipt new|verify|update ...
mdkg work artifact add ...
mdkg work validate [<id-or-qid>] [--type <workflow-type>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## work artifact

mdkg work artifact command

- Category: work
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-work-artifact-record
- Read paths: .mdkg/**
- Write paths: .mdkg/artifacts/**, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: exclusive-create
- Receipts: work-artifact-receipt

Usage:

```text
mdkg work artifact add <order-or-receipt-id-or-qid> <file> [--id <archive.id>] [--kind source|artifact] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## work contract

mdkg work contract command

- Category: work
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-or-update-work-contract
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**
- Lock policy: mutation-lock-required
- Atomic write policy: exclusive-create-or-atomic-file-write
- Receipts: work-contract-receipt

Usage:

```text
mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--required-capabilities <...>] [--pricing-model <...>] [--json]
```

Common flags:

- `--agent-id <agent.id>`: mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--required-capabilities <...>] [--pricing-model <...>] [--json]
- `--help`: --help, -h          Show help
- `--id <work.id>`: mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--required-capabilities <...>] [--pricing-model <...>] [--json]
- `--inputs <...>`: mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--required-capabilities <...>] [--pricing-model <...>] [--json]
- `--kind <kind>`: mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--required-capabilities <...>] [--pricing-model <...>] [--json]
- `--outputs <...>`: mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--required-capabilities <...>] [--pricing-model <...>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## work order

mdkg work order command

- Category: work
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: none

Usage:

```text
mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]
mdkg work order status <id-or-qid> [--json]
mdkg work order update <id-or-qid> [--status <status>] [--add-input-refs <...>] [--add-queue-refs <...>] [--add-artifacts <...>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--id <order.id>`: mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]
- `--requester <ref>`: mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--work-id <work.id>`: mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]

## work receipt

mdkg work receipt command

- Category: work
- Status: stable
- Visibility: public
- Danger level: mixed
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-or-update-work-receipt
- Read paths: .mdkg/**
- Write paths: .mdkg/index/**, .mdkg/receipts/**
- Lock policy: mutation-lock-required-for-new-update
- Atomic write policy: exclusive-create-or-atomic-file-write
- Receipts: work-receipt-receipt, work-receipt-verify-receipt

Usage:

```text
mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected|superseded] [--redaction-policy refs_and_hashes_only|redacted_summary|external_private] [--evidence-hashes <sha256:...>] [--json]
mdkg work receipt verify <id-or-qid> [--json]
mdkg work receipt update <id-or-qid> [--receipt-status <status>] [--add-artifacts <...>] [--add-proof-refs <...>] [--add-attestation-refs <...>] [--add-evidence-hashes <sha256:...>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--id <receipt.id>`: mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected|superseded] [--redaction-policy refs_and_hashes_only|redacted_summary|external_private] [--evidence-hashes <sha256:...>] [--json]
- `--outcome success|partial|failure`: mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected|superseded] [--redaction-policy refs_and_hashes_only|redacted_summary|external_private] [--evidence-hashes <sha256:...>] [--json]
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--work-order-id <order.id>`: mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected|superseded] [--redaction-policy refs_and_hashes_only|redacted_summary|external_private] [--evidence-hashes <sha256:...>] [--json]

## work trigger

mdkg work trigger command

- Category: work
- Status: stable
- Visibility: public
- Danger level: moderate
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-submitted-work-order-and-optionally-enqueue-message
- Read paths: .mdkg/**
- Write paths: .mdkg/db/**, .mdkg/index/**, .mdkg/work_orders/**
- Lock policy: mutation-lock-required
- Atomic write policy: exclusive-create-and-sqlite-transaction
- Receipts: work-trigger-receipt

Usage:

```text
mdkg work trigger <work-or-capability-ref> [--id <order.id>] [--title "<title>"] [--requester <ref>] [--enqueue <queue>] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--id order.example-1`: mdkg work trigger work.example --id order.example-1 --requester user://example --json
- `--json`: mdkg work trigger work.example --id order.example-1 --requester user://example --json
- `--requester user://example`: mdkg work trigger work.example --id order.example-1 --requester user://example --json
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## work validate

mdkg work validate command

- Category: work
- Status: stable
- Visibility: public
- Danger level: read-only
- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
- Receipts: work-validate-receipt

Usage:

```text
mdkg work validate [<id-or-qid>] [--type spec|work|work_order|receipt|feedback|dispute|proposal] [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

## workspace

mdkg workspace command

- Category: workspace
- Status: stable
- Visibility: public
- Danger level: mixed
- Output formats: text, json, md
- Dry run: {"supported":false}
- Side effects: read-or-update-workspace-config
- Read paths: .mdkg/**
- Write paths: .mdkg/config.json, .mdkg/index/**
- Lock policy: mutation-lock-required-for-add-rm-enable-disable
- Atomic write policy: atomic-config-write
- Receipts: workspace-receipt

Usage:

```text
mdkg workspace ls [--json]
mdkg workspace add <alias> <path> [--mdkg-dir <dir>] [--visibility <level>] [--json]
mdkg workspace rm <alias> [--json]
mdkg workspace enable <alias> [--json]
mdkg workspace disable <alias> [--json]
```

Common flags:

- `--help`: --help, -h          Show help
- `--root`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

