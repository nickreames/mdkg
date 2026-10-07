# Generated CLI Reference

<!-- generated-from: dist/command-contract.json -->
<!-- contract-hash: c99d532a800fc3d409c8678e2a2d5671928a2246f90c32f9c4981032a2e54519 -->

This generated page is the broad user-facing command reference. Start with the common command groups in the reference home, then use this page when you need the complete command list.

The page is generated from current command metadata in `dist/command-contract.json`, which keeps usage, flags, output formats, and safety notes aligned with the CLI.

- Tool: mdkg
- Package version: 0.6.1
- Schema version: 1
- Command count: 114
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
- git: 2
- global: 1
- goal: 13
- graph: 8
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

## Concrete command options

Options are admitted for the exact command below, not every command in its family or every creation type. Unknown or wrong-command options, missing values, and malformed Boolean/integer syntax are rejected before root/configuration discovery. Valid-value domains, incompatible modes and graph-dependent constraints remain subject to command validation. All commands also accept `--root`, `--help` and `--version`.

Boolean values use `=true` or `=false`; `init --agent` also preserves its legacy separate `true` or `false` value. Value options accept a separate value or `=value`; use `--` before option-looking positional text. Aliases retain the same command boundary as their canonical option. `pack --list-profiles` accepts no other command options.

| Command | Accepted command options |
| --- | --- |
| `mdkg init` | `--force`, `--agent`, `--graph-only`, `--no-update-ignores`, `--update-gitignore`, `--update-npmignore`, `--update-dockerignore` |
| `mdkg upgrade` | `--dry-run`, `--apply`, `--resume`, `--recover`, `--plan-hash <value>`, `--only <value>`, `--json` |
| `mdkg guide` | none |
| `mdkg index` | `--tolerant` |
| `mdkg new` | `--id <value>`, `--ws <value>`, `--status <value>`, `--priority <integer>`, `--epic <value>`, `--parent <value>`, `--prev <value>`, `--next <value>`, `--relates <value>`, `--blocked-by <value>`, `--blocks <value>`, `--links <value>`, `--artifacts <value>`, `--refs <value>`, `--aliases <value>`, `--skills <value>`, `--cases <value>`, `--tags <value>`, `--owners <value>`, `--supersedes <value>`, `--template <value>`, `--contract-profile <value>`, `--validation-policy-ref <value>`, `--evidence-policy-ref <value>`, `--receipt-kind <value>`, `--redaction-class <value>`, `--no-cache`, `--no-reindex`, `--run-id <value>`, `--json` |
| `mdkg show` | `--ws <value>`, `--meta`, `--json`, `--xml`, `--toon`, `--md`, `--no-cache`, `--no-reindex` |
| `mdkg list` | `--ws <value>`, `--type <value>`, `--status <value>`, `--epic <value>`, `--priority <integer>`, `--blocked`, `--tags <value>`, `--tags-mode <value>`, `--json`, `--xml`, `--toon`, `--md`, `--no-cache`, `--no-reindex` |
| `mdkg search` | `--ws <value>`, `--type <value>`, `--status <value>`, `--tags <value>`, `--tags-mode <value>`, `--limit <integer>`, `--json`, `--xml`, `--toon`, `--md`, `--no-cache`, `--no-reindex` |
| `mdkg pack` | `--ws <value>`, `--depth <integer>`, `--edges <value>`, `--verbose`, `--concise`, `--strip-code`, `--format <value>`, `--pack-profile <value>`, `--max-code-lines <integer>`, `--max-chars <integer>`, `--max-lines <integer>`, `--max-tokens <integer>`, `--skills <value>`, `--skills-depth <value>`, `--visibility <value>`, `--dry-run`, `--stats`, `--stats-out <value>`, `--truncation-report <value>`, `--out <value>`, `--list-profiles`, `--no-cache`, `--no-reindex` |
| `mdkg handoff create` | `--ws <value>`, `--out <value>`, `--depth <integer>`, `--json` |
| `mdkg next` | `--ws <value>`, `--no-cache`, `--no-reindex` |
| `mdkg checkpoint new` | `--ws <value>`, `--json`, `--run-id <value>`, `--note <value>`, `--relates <value>`, `--scope <value>`, `--kind <value>`, `--status <value>`, `--priority <integer>`, `--template <value>` |
| `mdkg validate` | `--out <value>`, `--json-out <value>`, `--quiet`, `--changed-only`, `--summary`, `--limit <integer>`, `--json` |
| `mdkg status` | `--json` |
| `mdkg mcp serve` | `--stdio` |
| `mdkg fix plan` | `--family <value>`, `--target <value>`, `--base-ref <value>`, `--json` |
| `mdkg fix apply` | `--family <value>`, `--target <value>`, `--base-ref <value>`, `--json` |
| `mdkg fix ids` | `--target <value>`, `--base-ref <value>`, `--apply`, `--json` |
| `mdkg format` | `--headings`, `--dry-run`, `--apply`, `--summary`, `--limit <integer>`, `--json` |
| `mdkg doctor` | `--strict`, `--json`, `--no-cache`, `--no-reindex` |
| `mdkg workspace ls` | `--json` |
| `mdkg workspace add` | `--mdkg-dir <value>`, `--visibility <value>`, `--json` |
| `mdkg workspace rm` | `--json` |
| `mdkg workspace enable` | `--json` |
| `mdkg workspace disable` | `--json` |
| `mdkg db index rebuild` | `--tolerant`, `--json` |
| `mdkg db index status` | `--tolerant`, `--json` |
| `mdkg db index verify` | `--tolerant`, `--json` |
| `mdkg db init` | `--json` |
| `mdkg db migrate` | `--json` |
| `mdkg db verify` | `--json` |
| `mdkg db stats` | `--json` |
| `mdkg db queue create` | `--paused`, `--reason <value>`, `--json` |
| `mdkg db queue contract` | `--json` |
| `mdkg db queue pause` | `--reason <value>`, `--json` |
| `mdkg db queue resume` | `--json` |
| `mdkg db queue enqueue` | `--payload-json <value>`, `--payload-file <value>`, `--dedupe-key <value>`, `--available-at-ms <integer>`, `--max-attempts <integer>`, `--json` |
| `mdkg db queue claim` | `--lease-owner <value>`, `--lease-ms <integer>`, `--json` |
| `mdkg db queue ack` | `--lease-owner <value>`, `--json` |
| `mdkg db queue fail` | `--lease-owner <value>`, `--error <value>`, `--retry-after-ms <integer>`, `--json` |
| `mdkg db queue dead-letter` | `--lease-owner <value>`, `--error <value>`, `--json` |
| `mdkg db queue release-expired` | `--json` |
| `mdkg db queue stats` | `--json` |
| `mdkg db queue list` | `--status <value>`, `--limit <integer>`, `--json` |
| `mdkg db queue show` | `--json` |
| `mdkg db snapshot seal` | `--queue-policy <value>`, `--json` |
| `mdkg db snapshot verify` | `--json` |
| `mdkg db snapshot status` | `--json` |
| `mdkg db snapshot dump` | `--snapshot <value>`, `--out <value>`, `--json` |
| `mdkg db snapshot diff` | `--json` |
| `mdkg capability list` | `--kind <value>`, `--visibility <value>`, `--json`, `--no-cache`, `--no-reindex` |
| `mdkg capability search` | `--kind <value>`, `--visibility <value>`, `--json`, `--no-cache`, `--no-reindex` |
| `mdkg capability show` | `--json`, `--no-cache`, `--no-reindex` |
| `mdkg capability resolve` | `--kind <value>`, `--visibility <value>`, `--requires <value>`, `--fresh-only`, `--json`, `--no-cache`, `--no-reindex` |
| `mdkg manifest list` | `--json`, `--no-cache`, `--no-reindex` |
| `mdkg manifest show` | `--json`, `--no-cache`, `--no-reindex` |
| `mdkg manifest validate` | `--json`, `--no-cache`, `--no-reindex` |
| `mdkg spec list` | `--json`, `--no-cache`, `--no-reindex` |
| `mdkg spec show` | `--json`, `--no-cache`, `--no-reindex` |
| `mdkg spec validate` | `--json`, `--no-cache`, `--no-reindex` |
| `mdkg archive add` | `--id <value>`, `--ws <value>`, `--kind <value>`, `--title <value>`, `--refs <value>`, `--relates <value>`, `--visibility <value>`, `--json` |
| `mdkg archive list` | `--ws <value>`, `--kind <value>`, `--visibility <value>`, `--json` |
| `mdkg archive show` | `--ws <value>`, `--json` |
| `mdkg archive verify` | `--ws <value>`, `--json` |
| `mdkg archive compress` | `--all`, `--ws <value>`, `--json` |
| `mdkg bundle create` | `--pack-profile <value>`, `--ws <value>`, `--out <value>`, `--json` |
| `mdkg bundle list` | `--json` |
| `mdkg bundle show` | `--json` |
| `mdkg bundle verify` | `--json` |
| `mdkg graph migrate` | `--graph-id <value>`, `--origin <value>`, `--ancestor <value>`, `--decisions <value>`, `--apply`, `--plan-hash <value>`, `--json` |
| `mdkg graph reconcile` | `--ancestor <value>`, `--incoming <value>`, `--target <value>`, `--decisions <value>`, `--apply`, `--plan-hash <value>`, `--json` |
| `mdkg graph recover` | `--resume`, `--rollback`, `--lock-evidence <value>`, `--confirm-quiescent`, `--json` |
| `mdkg graph clone` | `--target <value>`, `--json` |
| `mdkg graph fork` | `--target <value>`, `--start-goal <value>`, `--json` |
| `mdkg graph import-template` | `--start-goal <value>`, `--id-prefix <value>`, `--dry-run`, `--apply`, `--select-goal`, `--json` |
| `mdkg graph refs` | `--ws <value>`, `--json` |
| `mdkg git inspect` | `--json` |
| `mdkg subgraph add` | `--visibility <value>`, `--pack-profile <value>`, `--source-path <value>`, `--source-repo <value>`, `--max-stale-seconds <integer>`, `--json` |
| `mdkg subgraph list` | `--json` |
| `mdkg subgraph show` | `--json` |
| `mdkg subgraph rm` | `--json` |
| `mdkg subgraph remove` | `--json` |
| `mdkg subgraph enable` | `--json` |
| `mdkg subgraph disable` | `--json` |
| `mdkg subgraph verify` | `--all`, `--json` |
| `mdkg subgraph refresh` | `--all`, `--json` |
| `mdkg subgraph audit` | `--all`, `--target <value>`, `--json` |
| `mdkg subgraph upgrade-plan` | `--all`, `--json` |
| `mdkg subgraph sync` | `--all`, `--dry-run`, `--allow-dirty`, `--json` |
| `mdkg subgraph materialize` | `--all`, `--target <value>`, `--clean`, `--gitignore`, `--json` |
| `mdkg work trigger` | `--id <value>`, `--title <value>`, `--requester <value>`, `--enqueue <value>`, `--ws <value>`, `--json` |
| `mdkg work validate` | `--type <value>`, `--ws <value>`, `--json` |
| `mdkg work contract new` | `--id <value>`, `--agent-id <value>`, `--kind <value>`, `--inputs <value>`, `--outputs <value>`, `--required-capabilities <value>`, `--contract-profile <value>`, `--ws <value>`, `--json` |
| `mdkg work order new` | `--id <value>`, `--work-id <value>`, `--requester <value>`, `--request-ref <value>`, `--trigger-ref <value>`, `--payload-hash <value>`, `--input-refs <value>`, `--queue-refs <value>`, `--requested-outputs <value>`, `--constraint-refs <value>`, `--contract-profile <value>`, `--validation-policy-ref <value>`, `--evidence-policy-ref <value>`, `--ws <value>`, `--json` |
| `mdkg work order update` | `--status <value>`, `--add-input-refs <value>`, `--add-queue-refs <value>`, `--add-artifacts <value>`, `--ws <value>`, `--json` |
| `mdkg work order status` | `--ws <value>`, `--json` |
| `mdkg work receipt new` | `--id <value>`, `--work-order-id <value>`, `--outcome <value>`, `--receipt-status <value>`, `--cost-ref <value>`, `--redaction-policy <value>`, `--artifacts <value>`, `--proof-refs <value>`, `--attestation-refs <value>`, `--evidence-hashes <value>`, `--input-hashes <value>`, `--output-hashes <value>`, `--contract-profile <value>`, `--validation-policy-ref <value>`, `--evidence-policy-ref <value>`, `--receipt-kind <value>`, `--redaction-class <value>`, `--ws <value>`, `--json` |
| `mdkg work receipt update` | `--receipt-status <value>`, `--add-artifacts <value>`, `--add-proof-refs <value>`, `--add-attestation-refs <value>`, `--add-evidence-hashes <value>`, `--ws <value>`, `--json` |
| `mdkg work receipt verify` | `--ws <value>`, `--json` |
| `mdkg work artifact add` | `--id <value>`, `--kind <value>`, `--ws <value>`, `--json` |
| `mdkg skill new` | `--description <value>`, `--tags <value>`, `--authors <value>`, `--links <value>`, `--with-scripts`, `--force`, `--run-id <value>`, `--json` |
| `mdkg skill list` | `--tags <value>`, `--tags-mode <value>`, `--json`, `--xml`, `--toon`, `--md`, `--no-cache`, `--no-reindex` |
| `mdkg skill search` | `--tags <value>`, `--tags-mode <value>`, `--json`, `--xml`, `--toon`, `--md`, `--no-cache`, `--no-reindex` |
| `mdkg skill show` | `--meta`, `--json`, `--xml`, `--toon`, `--md`, `--no-cache`, `--no-reindex` |
| `mdkg skill validate` | `--json` |
| `mdkg skill sync` | `--force`, `--json` |
| `mdkg loop list` | `--ws <value>`, `--json`, `--no-cache`, `--no-reindex` |
| `mdkg loop show` | `--meta`, `--ws <value>`, `--json`, `--no-cache`, `--no-reindex` |
| `mdkg loop fork` | `--scope <value>`, `--title <value>`, `--materialization <value>`, `--planning-only`, `--no-children`, `--dry-run`, `--run-id <value>`, `--ws <value>`, `--json`, `--no-cache`, `--no-reindex` |
| `mdkg loop plan` | `--ws <value>`, `--json`, `--no-cache`, `--no-reindex` |
| `mdkg loop next` | `--ws <value>`, `--json`, `--no-cache`, `--no-reindex` |
| `mdkg loop runs` | `--ws <value>`, `--json`, `--no-cache`, `--no-reindex` |
| `mdkg goal show` | `--ws <value>`, `--json` |
| `mdkg goal select` | `--ws <value>`, `--json` |
| `mdkg goal activate` | `--ws <value>`, `--json` |
| `mdkg goal current` | `--ws <value>`, `--json` |
| `mdkg goal clear` | `--json` |
| `mdkg goal next` | `--ws <value>`, `--json` |
| `mdkg goal claim` | `--ws <value>`, `--json` |
| `mdkg goal evaluate` | `--ws <value>`, `--json` |
| `mdkg goal pause` | `--ws <value>`, `--json` |
| `mdkg goal resume` | `--ws <value>`, `--json` |
| `mdkg goal done` | `--ws <value>`, `--json` |
| `mdkg goal archive` | `--ws <value>`, `--json` |
| `mdkg task start` | `--ws <value>`, `--json`, `--run-id <value>`, `--note <value>` |
| `mdkg task update` | `--status <value>`, `--priority <integer>`, `--add-artifacts <value>`, `--add-links <value>`, `--add-refs <value>`, `--add-skills <value>`, `--add-tags <value>`, `--add-blocked-by <value>`, `--clear-blocked-by`, `--ws <value>`, `--json`, `--run-id <value>`, `--note <value>` |
| `mdkg task done` | `--add-artifacts <value>`, `--add-links <value>`, `--add-refs <value>`, `--checkpoint <value>`, `--checkpoint-kind <value>`, `--ws <value>`, `--json`, `--run-id <value>`, `--note <value>` |
| `mdkg event enable` | `--ws <value>`, `--json` |
| `mdkg event append` | `--kind <value>`, `--status <value>`, `--refs <value>`, `--artifacts <value>`, `--notes <value>`, `--run-id <value>`, `--agent <value>`, `--skill <value>`, `--tool <value>`, `--ws <value>`, `--json` |
| `mdkg new rule` | `--ws <value>`, `--relates <value>`, `--links <value>`, `--artifacts <value>`, `--refs <value>`, `--aliases <value>`, `--tags <value>`, `--owners <value>`, `--template <value>`, `--no-cache`, `--no-reindex`, `--run-id <value>`, `--json` |
| `mdkg new prd` | `--ws <value>`, `--relates <value>`, `--links <value>`, `--artifacts <value>`, `--refs <value>`, `--aliases <value>`, `--tags <value>`, `--owners <value>`, `--template <value>`, `--no-cache`, `--no-reindex`, `--run-id <value>`, `--json` |
| `mdkg new edd` | `--ws <value>`, `--relates <value>`, `--links <value>`, `--artifacts <value>`, `--refs <value>`, `--aliases <value>`, `--tags <value>`, `--owners <value>`, `--template <value>`, `--no-cache`, `--no-reindex`, `--run-id <value>`, `--json` |
| `mdkg new dec` | `--ws <value>`, `--status <value>`, `--relates <value>`, `--links <value>`, `--artifacts <value>`, `--refs <value>`, `--aliases <value>`, `--tags <value>`, `--owners <value>`, `--supersedes <value>`, `--template <value>`, `--no-cache`, `--no-reindex`, `--run-id <value>`, `--json` |
| `mdkg new prop` | `--ws <value>`, `--relates <value>`, `--links <value>`, `--artifacts <value>`, `--refs <value>`, `--aliases <value>`, `--tags <value>`, `--owners <value>`, `--template <value>`, `--no-cache`, `--no-reindex`, `--run-id <value>`, `--json` |
| `mdkg new goal` | `--ws <value>`, `--status <value>`, `--priority <integer>`, `--epic <value>`, `--parent <value>`, `--prev <value>`, `--next <value>`, `--relates <value>`, `--blocked-by <value>`, `--blocks <value>`, `--links <value>`, `--artifacts <value>`, `--refs <value>`, `--aliases <value>`, `--skills <value>`, `--tags <value>`, `--owners <value>`, `--template <value>`, `--no-cache`, `--no-reindex`, `--run-id <value>`, `--json` |
| `mdkg new loop` | `--ws <value>`, `--status <value>`, `--priority <integer>`, `--epic <value>`, `--parent <value>`, `--prev <value>`, `--next <value>`, `--relates <value>`, `--blocked-by <value>`, `--blocks <value>`, `--links <value>`, `--artifacts <value>`, `--refs <value>`, `--aliases <value>`, `--skills <value>`, `--tags <value>`, `--owners <value>`, `--template <value>`, `--no-cache`, `--no-reindex`, `--run-id <value>`, `--json` |
| `mdkg new epic` | `--ws <value>`, `--status <value>`, `--priority <integer>`, `--epic <value>`, `--parent <value>`, `--prev <value>`, `--next <value>`, `--relates <value>`, `--blocked-by <value>`, `--blocks <value>`, `--links <value>`, `--artifacts <value>`, `--refs <value>`, `--aliases <value>`, `--skills <value>`, `--tags <value>`, `--owners <value>`, `--template <value>`, `--no-cache`, `--no-reindex`, `--run-id <value>`, `--json` |
| `mdkg new feat` | `--ws <value>`, `--status <value>`, `--priority <integer>`, `--epic <value>`, `--parent <value>`, `--prev <value>`, `--next <value>`, `--relates <value>`, `--blocked-by <value>`, `--blocks <value>`, `--links <value>`, `--artifacts <value>`, `--refs <value>`, `--aliases <value>`, `--skills <value>`, `--tags <value>`, `--owners <value>`, `--template <value>`, `--no-cache`, `--no-reindex`, `--run-id <value>`, `--json` |
| `mdkg new task` | `--ws <value>`, `--status <value>`, `--priority <integer>`, `--epic <value>`, `--parent <value>`, `--prev <value>`, `--next <value>`, `--relates <value>`, `--blocked-by <value>`, `--blocks <value>`, `--links <value>`, `--artifacts <value>`, `--refs <value>`, `--aliases <value>`, `--skills <value>`, `--tags <value>`, `--owners <value>`, `--template <value>`, `--no-cache`, `--no-reindex`, `--run-id <value>`, `--json` |
| `mdkg new bug` | `--ws <value>`, `--status <value>`, `--priority <integer>`, `--epic <value>`, `--parent <value>`, `--prev <value>`, `--next <value>`, `--relates <value>`, `--blocked-by <value>`, `--blocks <value>`, `--links <value>`, `--artifacts <value>`, `--refs <value>`, `--aliases <value>`, `--skills <value>`, `--tags <value>`, `--owners <value>`, `--template <value>`, `--no-cache`, `--no-reindex`, `--run-id <value>`, `--json` |
| `mdkg new spike` | `--ws <value>`, `--status <value>`, `--priority <integer>`, `--epic <value>`, `--parent <value>`, `--prev <value>`, `--next <value>`, `--relates <value>`, `--blocked-by <value>`, `--blocks <value>`, `--links <value>`, `--artifacts <value>`, `--refs <value>`, `--aliases <value>`, `--skills <value>`, `--tags <value>`, `--owners <value>`, `--template <value>`, `--no-cache`, `--no-reindex`, `--run-id <value>`, `--json` |
| `mdkg new checkpoint` | `--ws <value>`, `--status <value>`, `--priority <integer>`, `--epic <value>`, `--parent <value>`, `--prev <value>`, `--next <value>`, `--relates <value>`, `--blocked-by <value>`, `--blocks <value>`, `--links <value>`, `--artifacts <value>`, `--refs <value>`, `--aliases <value>`, `--skills <value>`, `--tags <value>`, `--owners <value>`, `--template <value>`, `--no-cache`, `--no-reindex`, `--run-id <value>`, `--json` |
| `mdkg new test` | `--ws <value>`, `--status <value>`, `--priority <integer>`, `--epic <value>`, `--parent <value>`, `--prev <value>`, `--next <value>`, `--relates <value>`, `--blocked-by <value>`, `--blocks <value>`, `--links <value>`, `--artifacts <value>`, `--refs <value>`, `--aliases <value>`, `--skills <value>`, `--cases <value>`, `--tags <value>`, `--owners <value>`, `--template <value>`, `--no-cache`, `--no-reindex`, `--run-id <value>`, `--json` |
| `mdkg new manifest` | `--id <value>`, `--ws <value>`, `--relates <value>`, `--links <value>`, `--artifacts <value>`, `--refs <value>`, `--aliases <value>`, `--tags <value>`, `--owners <value>`, `--template <value>`, `--contract-profile <value>`, `--validation-policy-ref <value>`, `--evidence-policy-ref <value>`, `--no-cache`, `--no-reindex`, `--run-id <value>`, `--json` |
| `mdkg new spec` | `--id <value>`, `--ws <value>`, `--relates <value>`, `--links <value>`, `--artifacts <value>`, `--refs <value>`, `--aliases <value>`, `--tags <value>`, `--owners <value>`, `--template <value>`, `--contract-profile <value>`, `--validation-policy-ref <value>`, `--evidence-policy-ref <value>`, `--no-cache`, `--no-reindex`, `--run-id <value>`, `--json` |
| `mdkg new work` | `--id <value>`, `--ws <value>`, `--relates <value>`, `--links <value>`, `--artifacts <value>`, `--refs <value>`, `--aliases <value>`, `--tags <value>`, `--owners <value>`, `--template <value>`, `--contract-profile <value>`, `--no-cache`, `--no-reindex`, `--run-id <value>`, `--json` |
| `mdkg new work_order` | `--id <value>`, `--ws <value>`, `--relates <value>`, `--links <value>`, `--artifacts <value>`, `--refs <value>`, `--aliases <value>`, `--tags <value>`, `--owners <value>`, `--template <value>`, `--contract-profile <value>`, `--validation-policy-ref <value>`, `--evidence-policy-ref <value>`, `--no-cache`, `--no-reindex`, `--run-id <value>`, `--json` |
| `mdkg new receipt` | `--id <value>`, `--ws <value>`, `--relates <value>`, `--links <value>`, `--artifacts <value>`, `--refs <value>`, `--aliases <value>`, `--tags <value>`, `--owners <value>`, `--template <value>`, `--contract-profile <value>`, `--validation-policy-ref <value>`, `--evidence-policy-ref <value>`, `--receipt-kind <value>`, `--redaction-class <value>`, `--no-cache`, `--no-reindex`, `--run-id <value>`, `--json` |
| `mdkg new feedback` | `--id <value>`, `--ws <value>`, `--relates <value>`, `--links <value>`, `--artifacts <value>`, `--refs <value>`, `--aliases <value>`, `--tags <value>`, `--owners <value>`, `--template <value>`, `--no-cache`, `--no-reindex`, `--run-id <value>`, `--json` |
| `mdkg new dispute` | `--id <value>`, `--ws <value>`, `--relates <value>`, `--links <value>`, `--artifacts <value>`, `--refs <value>`, `--aliases <value>`, `--tags <value>`, `--owners <value>`, `--template <value>`, `--no-cache`, `--no-reindex`, `--run-id <value>`, `--json` |
| `mdkg new proposal` | `--id <value>`, `--ws <value>`, `--relates <value>`, `--links <value>`, `--artifacts <value>`, `--refs <value>`, `--aliases <value>`, `--tags <value>`, `--owners <value>`, `--template <value>`, `--no-cache`, `--no-reindex`, `--run-id <value>`, `--json` |

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

- `--all`: mdkg archive compress <id-or-archive-uri-or-qid|--all> [--ws <local-alias>] [--json]
- `--help`: --help, -h          Show help
- `--id <archive.id>`: mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--json]
- `--json`: mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--json]
- `--kind source|artifact`: mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--json]
- `--refs <value>`: archive add: --id <value> --ws <value> --kind <value> --title <value> --refs <value> --relates <value> --visibility <value> --json
- `--relates <value>`: archive add: --id <value> --ws <value> --kind <value> --title <value> --refs <value> --relates <value> --visibility <value> --json
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--title <value>`: archive add: --id <value> --ws <value> --kind <value> --title <value> --refs <value> --relates <value> --visibility <value> --json
- `--version`: --version, -V       Show version
- `--visibility private|internal|public`: mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--json]
- `--ws <local-alias>`: mdkg archive compress <id-or-archive-uri-or-qid|--all> [--ws <local-alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-write-archive-sidecars
- Read paths: .mdkg/**
- Write paths: .mdkg/archive/**, .mdkg/index/**, .mdkg/index/write.lock/**, <configured-index-cache-paths>, <workspace-mdkg>/archive/**, <workspace-mdkg>/work/events/events.jsonl
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--title <title>`: mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--title <title>] [--refs <...>] [--relates <...>] [--json]
- `--version`: --version, -V       Show version
- `--visibility private|internal|public`: mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--title <title>] [--refs <...>] [--relates <...>] [--json]
- `--ws <value>`: archive add: --id <value> --ws <value> --kind <value> --title <value> --refs <value> --relates <value> --visibility <value> --json

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-archive-sidecar
- Read paths: .mdkg/**
- Write paths: .mdkg/archive/**, .mdkg/index/**, .mdkg/index/write.lock/**, <configured-index-cache-paths>, <workspace-mdkg>/archive/**, <workspace-mdkg>/work/events/events.jsonl
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

- `--all`: mdkg archive compress --all [--ws <local-alias>] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg archive compress <id-or-archive-uri-or-qid> [--ws <local-alias>] [--json]
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <local-alias>`: mdkg archive compress <id-or-archive-uri-or-qid> [--ws <local-alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: refresh-local-workspace-archive-zip-caches
- Read paths: .mdkg/**
- Write paths: .mdkg/archive/**, .mdkg/index/**, .mdkg/index/write.lock/**, <configured-index-cache-paths>, <workspace-mdkg>/archive/**, <workspace-mdkg>/work/events/events.jsonl
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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
- `--out <path>`: mdkg bundle create [--profile private|public] [--ws <alias|all>] [--output <path>] [--json]
- `--pack-profile private|public`: mdkg bundle create [--profile private|public] [--ws <alias|all>] [--output <path>] [--json]
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias|all>`: mdkg bundle create [--profile private|public] [--ws <alias|all>] [--output <path>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-write-mdkg-bundles
- Read paths: .mdkg/**
- Write paths: .mdkg/bundles/**, <--out>, <configured-bundle-output-dir>/**
- Lock policy: no-command-level-mutation-lock; output-custody-preflight-for-create
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
- `--out <path>`: mdkg bundle create [--profile private|public] [--ws <alias|all>] [--output <path>] [--json]
- `--pack-profile private|public`: mdkg bundle create [--profile private|public] [--ws <alias|all>] [--output <path>] [--json]
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias|all>`: mdkg bundle create [--profile private|public] [--ws <alias|all>] [--output <path>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-bundle-zip
- Read paths: .mdkg/**
- Write paths: .mdkg/bundles/**, <--out>, <configured-bundle-output-dir>/**
- Lock policy: no-command-level-mutation-lock; output-custody-preflight
- Atomic write policy: zip-temp-rename
- Receipts: bundle-create-receipt

### Related commands

`mdkg bundle`, `mdkg bundle import`, `mdkg bundle list`, `mdkg bundle show`, `mdkg bundle verify`

## bundle import

mdkg bundle import command

- Command: `mdkg bundle import`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for portable graph bundle creation, verification, and import.

Beginner safety: Safe for initial grounding. It should not change repository files.

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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text
- Dry run: {"supported":false}
- Side effects: none
- Read paths: .mdkg/**
- Write paths: none
- Lock policy: none-read-only
- Atomic write policy: none-read-only
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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
- `--no-cache`: capability list: --kind <value> --visibility <value> --json --no-cache --no-reindex
- `--no-reindex`: capability list: --kind <value> --visibility <value> --json --no-cache --no-reindex
- `--requires <capability>`: mdkg capability resolve [query] [--requires <capability>] [--fresh-only] [--json]
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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
- `--no-cache`: capability list: --kind <value> --visibility <value> --json --no-cache --no-reindex
- `--no-reindex`: capability list: --kind <value> --visibility <value> --json --no-cache --no-reindex
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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
- `--no-cache`: capability search: --kind <value> --visibility <value> --json --no-cache --no-reindex
- `--no-reindex`: capability search: --kind <value> --visibility <value> --json --no-cache --no-reindex
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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
- `--no-cache`: capability show: --json --no-cache --no-reindex
- `--no-reindex`: capability show: --json --no-cache --no-reindex
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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
- `--priority <integer>`: checkpoint new: --ws <value> --json --run-id <value> --note <value> --relates <value> --scope <value> --kind <value> --status <value> --priority <integer> --template <value>
- `--relates <id,id,...>`: [--relates <id,id,...>] [--scope <id,id,...>] [--run-id <id>] [--note "<text>"]
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--run-id <id>`: [--relates <id,id,...>] [--scope <id,id,...>] [--run-id <id>] [--note "<text>"]
- `--scope <id,id,...>`: [--relates <id,id,...>] [--scope <id,id,...>] [--run-id <id>] [--note "<text>"]
- `--status <value>`: checkpoint new: --ws <value> --json --run-id <value> --note <value> --relates <value> --scope <value> --kind <value> --status <value> --priority <integer> --template <value>
- `--template <value>`: checkpoint new: --ws <value> --json --run-id <value> --note <value> --relates <value> --scope <value> --kind <value> --status <value> --priority <integer> --template <value>
- `--version`: --version, -V       Show version
- 1 additional flags omitted from this generated summary.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-checkpoint-node
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/work/events/events.jsonl
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

- `--available-at-ms <integer>`: db queue enqueue: --payload-json <value> --payload-file <value> --dedupe-key <value> --available-at-ms <integer> --max-attempts <integer> --json
- `--dedupe-key <value>`: db queue enqueue: --payload-json <value> --payload-file <value> --dedupe-key <value> --available-at-ms <integer> --max-attempts <integer> --json
- `--error <value>`: db queue fail: --lease-owner <value> --error <value> --retry-after-ms <integer> --json
- `--help`: --help, -h          Show help
- `--json`: mdkg db index rebuild [--tolerant] [--json]
- `--lease-ms <ms>`: mdkg db queue claim <queue> --lease-owner <owner> --lease-ms <ms> [--json]
- `--lease-owner <owner>`: mdkg db queue claim <queue> --lease-owner <owner> --lease-ms <ms> [--json]
- `--limit <integer>`: db queue list: --status <value> --limit <integer> --json
- `--max-attempts <integer>`: db queue enqueue: --payload-json <value> --payload-file <value> --dedupe-key <value> --available-at-ms <integer> --max-attempts <integer> --json
- `--out <path>`: mdkg db snapshot dump [--snapshot <path>] [--output <path>] [--json]
- `--paused`: mdkg db queue create <queue> [--paused] [--reason <text>] [--json]
- `--payload-file <path>`: mdkg db queue enqueue <queue> <message-id> --payload-json <json>|--payload-file <path> [--json]
- 9 additional flags omitted from this generated summary.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-write-project-db-and-snapshots
- Read paths: .mdkg/**
- Write paths: .mdkg/config.json, .mdkg/db/**, .mdkg/index/**, .mdkg/index/write.lock/**, <--out>, <configured-project-db-runtime>, <configured-project-db-state>
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--tolerant`: mdkg db index rebuild [--tolerant] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-rebuild-sqlite-index
- Read paths: .mdkg/**
- Write paths: .mdkg/index/**, .mdkg/index/write.lock/**, <configured-index-cache-paths>
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
- `--payload-file <path>`: mdkg db queue enqueue <queue> <message-id> --payload-json <json>|--payload-file <path> [--dedupe-key <key>] [--available-at-ms <ms>] [--max-attempts <n>] [--json]
- `--payload-json <json>`: mdkg db queue enqueue <queue> <message-id> --payload-json <json>|--payload-file <path> [--dedupe-key <key>] [--available-at-ms <ms>] [--max-attempts <n>] [--json]
- 5 additional flags omitted from this generated summary.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: emit-read-only-adapter-contract, read-or-write-local-project-db-queue-delivery-state
- Read paths: .mdkg/**
- Write paths: .mdkg/db/runtime/**, .mdkg/index/write.lock/**, <configured-project-db-runtime>
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
- `--out <path>`: mdkg db snapshot dump [--snapshot <path>] [--output <path>] [--json]
- `--queue-policy drain|paused`: mdkg db snapshot seal [--queue-policy drain|paused] [--json]
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--snapshot <path>`: mdkg db snapshot dump [--snapshot <path>] [--output <path>] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-seal-project-db-snapshot
- Read paths: .mdkg/**
- Write paths: .mdkg/db/state/**, .mdkg/index/write.lock/**, <--out>, <configured-project-db-runtime>, <configured-project-db-state>
- Lock policy: mutation-lock-required-for-seal
- Atomic write policy: atomic-file-writes
- Receipts: snapshot-receipt

### Related commands

`mdkg db`, `mdkg db index`, `mdkg db queue`

## doctor

mdkg doctor command

- Command: `mdkg doctor`
- Mode: Mutating command
- Public status: stable / public
- Danger level: mixed

### When to use

Use this command when the matching command family is the current workflow surface.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

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
- `--no-cache`: doctor: --strict --json --no-cache --no-reindex
- `--no-reindex`: doctor: --strict --json --no-cache --no-reindex
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--strict`: mdkg doctor [--strict] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: may-refresh-derived-caches-unless-strict-or-no-reindex
- Read paths: .mdkg/**
- Write paths: .mdkg/index/**, <configured-index-cache-paths>
- Lock policy: no-command-level-mutation-lock; cache-writers-own-their-write-policy
- Atomic write policy: atomic-derived-cache-writes
- Receipts: doctor-receipt

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

- `--agent <value>`: event append: --kind <value> --status <value> --refs <value> --artifacts <value> --notes <value> --run-id <value> --agent <value> --skill <value> --tool <value> --ws <value> --json
- `--artifacts <value>`: event append: --kind <value> --status <value> --refs <value> --artifacts <value> --notes <value> --run-id <value> --agent <value> --skill <value> --tool <value> --ws <value> --json
- `--help`: --help, -h          Show help
- `--json`: mdkg event enable [--ws <alias>] [--json]
- `--kind <kind>`: mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...> [options] [--json]
- `--notes <value>`: event append: --kind <value> --status <value> --refs <value> --artifacts <value> --notes <value> --run-id <value> --agent <value> --skill <value> --tool <value> --ws <value> --json
- `--refs <id,...>`: mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...> [options] [--json]
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--run-id <value>`: event append: --kind <value> --status <value> --refs <value> --artifacts <value> --notes <value> --run-id <value> --agent <value> --skill <value> --tool <value> --ws <value> --json
- `--skill <value>`: event append: --kind <value> --status <value> --refs <value> --artifacts <value> --notes <value> --run-id <value> --agent <value> --skill <value> --tool <value> --ws <value> --json
- `--status <ok|error|retry|skipped>`: mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...> [options] [--json]
- `--tool <value>`: event append: --kind <value> --status <value> --refs <value> --artifacts <value> --notes <value> --run-id <value> --agent <value> --skill <value> --tool <value> --ws <value> --json
- 2 additional flags omitted from this generated summary.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-append-jsonl-event-log
- Read paths: .mdkg/**
- Write paths: .mdkg/index/write.lock/**, .mdkg/work/events/events.jsonl, <workspace-mdkg>/work/events/events.jsonl
- Lock policy: mutation-lock-for-v2-append; no-command-lock-for-legacy-append-or-enable
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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
- Write paths: .mdkg/index/write.lock/**, .mdkg/work/events/events.jsonl, <workspace-mdkg>/work/events/events.jsonl
- Lock policy: mutation-lock-required-for-v2; no-command-lock-for-legacy
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg event enable [--ws <alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-event-log
- Read paths: .mdkg/**
- Write paths: .mdkg/work/events/events.jsonl, <workspace-mdkg>/work/events/events.jsonl
- Lock policy: no-command-level-mutation-lock; exclusive-log-create
- Atomic write policy: exclusive-create
- Receipts: event-enable-receipt

### Related commands

`mdkg event`, `mdkg event append`

## fix

mdkg fix command

- Command: `mdkg fix`
- Mode: Mutating command
- Public status: stable / public
- Danger level: mixed

### When to use

Use for dry-run repair planning and selected graph repairs.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--target <id-or-qid>`: mdkg fix plan [--family index|refs|ids|all] [--target <id-or-qid>] [--base-ref <ref>] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: preview-or-apply-reviewed-duplicate-id-repair
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/work/events/events.jsonl
- Lock policy: mutation-lock-required-for-apply
- Atomic write policy: atomic-file-writes
- Receipts: fix-apply-receipt, fix-plan-receipt

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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--target <id-or-qid>`: mdkg fix apply [--family ids] [--target <id-or-qid>] [--base-ref <ref>] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false,"apply_supported":true,"apply_family":"ids"}
- Side effects: rebuild-derived-indexes, rewrite-duplicate-node-ids
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/work/events/events.jsonl
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
- `--help`: --help, -h          Show help
- `--json`: mdkg fix ids [--target <id-or-qid>] [--base-ref <ref>] [--apply] [--json]
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--target <id-or-qid>`: mdkg fix ids [--target <id-or-qid>] [--base-ref <ref>] [--apply] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":true,"default":true,"apply_flag":"--apply","apply_supported":true,"apply_family":"ids"}
- Side effects: plan-or-rewrite-duplicate-node-ids, rebuild-derived-indexes-when-apply
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/work/events/events.jsonl
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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

- `--apply`: --headings adds missing recommended body headings; it defaults to dry-run and requires --apply to write files.
- `--dry-run`: format: --headings --dry-run --apply --summary --limit <integer> --json
- `--headings`: mdkg format --headings [--dry-run|--apply] [--summary] [--limit <n>] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg format --headings [--dry-run|--apply] [--summary] [--limit <n>] [--json]
- `--limit <n>`: mdkg format --headings [--dry-run|--apply] [--summary] [--limit <n>] [--json]
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--summary`: mdkg format --headings [--dry-run|--apply] [--summary] [--limit <n>] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":true,"requires":"--headings","default_when":"--headings without --apply","flag":"--dry-run","side_effects":["acquire-and-release-mutation-lock"],"write_paths":[".mdkg/index/write.lock/**"]}
- Side effects: normalize-graph-markdown
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/work/events/events.jsonl
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-file-writes
- Receipts: format-receipt

### Related commands

none

## git

mdkg git command

- Command: `mdkg git`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for read-only local Git state and sanitized revision descriptors. Use native Git for branches, worktrees, commits and remote operations; authentication stays external.

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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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

`mdkg git inspect`

## git inspect

mdkg git inspect command

- Command: `mdkg git inspect`
- Mode: Read-only command
- Public status: stable / public
- Danger level: read-only

### When to use

Use for read-only local Git state and sanitized revision descriptors. Use native Git for branches, worktrees, commits and remote operations; authentication stays external.

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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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

`mdkg git`

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

- `--help`: Run `mdkg help <command>` or `mdkg <command> --help` for details.
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <value>`: goal show: --ws <value> --json

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-update-selected-goal-state
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/state/selected-goal.json, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/work/events/events.jsonl
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg goal activate <goal-id-or-qid> [--ws <alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: activate-goal-and-pause-competing-goals
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/state/selected-goal.json, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/work/events/events.jsonl
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg goal archive <goal-id-or-qid> [--ws <alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: archive-goal
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/state/selected-goal.json, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/work/events/events.jsonl
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg goal claim <work-id-or-qid> [--ws <alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: claim-goal-active-node
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/state/selected-goal.json, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/work/events/events.jsonl
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: clear-selected-goal
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/state/selected-goal.json, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/work/events/events.jsonl
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg goal done <goal-id-or-qid> [--ws <alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: complete-goal
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/state/selected-goal.json, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/work/events/events.jsonl
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg goal pause <goal-id-or-qid> [--ws <alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: pause-goal
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/state/selected-goal.json, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/work/events/events.jsonl
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg goal resume <goal-id-or-qid> [--ws <alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: resume-goal
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/state/selected-goal.json, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/work/events/events.jsonl
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg goal select <goal-id-or-qid> [--ws <alias>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: select-goal
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/state/selected-goal.json, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/work/events/events.jsonl
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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
- Mode: Mutating command
- Public status: stable / public
- Danger level: mixed

### When to use

Use for graph references, clone/fork/import, and graph movement workflows.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

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

- `--ancestor <value>`: graph migrate: --graph-id <value> --origin <value> --ancestor <value> --decisions <value> --apply --plan-hash <value> --json
- `--apply`: mdkg graph import-template <source-bundle-or-mdkg-dir> [--start-goal <goal-id>] [--select-goal] [--id-prefix <prefix>] [--dry-run] [--apply] [--json]
- `--confirm-quiescent`: graph recover: --resume --rollback --lock-evidence <value> --confirm-quiescent --json
- `--decisions <value>`: graph migrate: --graph-id <value> --origin <value> --ancestor <value> --decisions <value> --apply --plan-hash <value> --json
- `--dry-run`: mdkg graph import-template <source-bundle-or-mdkg-dir> [--start-goal <goal-id>] [--select-goal] [--id-prefix <prefix>] [--dry-run] [--apply] [--json]
- `--graph-id <value>`: graph migrate: --graph-id <value> --origin <value> --ancestor <value> --decisions <value> --apply --plan-hash <value> --json
- `--help`: --help, -h          Show help
- `--id-prefix <prefix>`: mdkg graph import-template <source-bundle-or-mdkg-dir> [--start-goal <goal-id>] [--select-goal] [--id-prefix <prefix>] [--dry-run] [--apply] [--json]
- `--incoming <value>`: graph reconcile: --ancestor <value> --incoming <value> --target <value> --decisions <value> --apply --plan-hash <value> --json
- `--json`: mdkg graph clone <source-bundle-or-mdkg-dir> --target <path> [--json]
- `--lock-evidence <value>`: graph recover: --resume --rollback --lock-evidence <value> --confirm-quiescent --json
- `--origin <value>`: graph migrate: --graph-id <value> --origin <value> --ancestor <value> --decisions <value> --apply --plan-hash <value> --json
- 9 additional flags omitted from this generated summary.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-write-graph-transport-identity-and-reconciliation-state
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/graph.json, .mdkg/identity/**, .mdkg/index/**, .mdkg/state/**, .mdkg/work/events/events.jsonl, <--target>/**, <configured-index-cache-paths>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/work/events/events.jsonl
- Lock policy: operation-specific; target-index-lock-for-clone-fork; mutation-lock-for-apply
- Atomic write policy: operation-specific-exclusive-create-or-journaled-atomic-writes
- Receipts: graph-receipt

### Related commands

`mdkg graph clone`, `mdkg graph fork`, `mdkg graph import-template`, `mdkg graph migrate`, `mdkg graph reconcile`

## graph clone

mdkg graph clone command

- Command: `mdkg graph clone`
- Mode: Mutating command
- Public status: stable / public
- Danger level: mixed

### When to use

Use for graph references, clone/fork/import, and graph movement workflows.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--target <path>`: mdkg graph clone <source-bundle-or-mdkg-dir> --target <path> [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-new-target-graph-and-derived-indexes
- Read paths: .mdkg/**
- Write paths: <--target>/**
- Lock policy: exclusive-empty-target-admission-and-target-index-lock
- Atomic write policy: exclusive-file-creation; failed-target-may-remain
- Receipts: graph-clone-receipt

### Related commands

`mdkg graph`, `mdkg graph fork`, `mdkg graph import-template`, `mdkg graph migrate`, `mdkg graph reconcile`

## graph fork

mdkg graph fork command

- Command: `mdkg graph fork`
- Mode: Mutating command
- Public status: stable / public
- Danger level: mixed

### When to use

Use for graph references, clone/fork/import, and graph movement workflows.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--start-goal <goal-id>`: mdkg graph fork <source-bundle-or-mdkg-dir> --target <path> [--start-goal <goal-id>] [--json]
- `--target <path>`: mdkg graph fork <source-bundle-or-mdkg-dir> --target <path> [--start-goal <goal-id>] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-independent-target-graph-and-optional-selected-goal
- Read paths: .mdkg/**
- Write paths: <--target>/**
- Lock policy: exclusive-empty-target-admission-and-target-index-lock
- Atomic write policy: exclusive-file-creation; failed-target-may-remain
- Receipts: graph-fork-receipt

### Related commands

`mdkg graph`, `mdkg graph clone`, `mdkg graph import-template`, `mdkg graph migrate`, `mdkg graph reconcile`

## graph import-template

mdkg graph import-template command

- Command: `mdkg graph import-template`
- Mode: Mutating command
- Public status: stable / public
- Danger level: mixed

### When to use

Use for graph references, clone/fork/import, and graph movement workflows.

Beginner safety: Prefer the dry-run or plan mode before applying changes.

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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--select-goal`: mdkg graph import-template <source-bundle-or-mdkg-dir> [--start-goal <goal-id>] [--select-goal] [--id-prefix <prefix>] [--dry-run] [--apply] [--json]
- `--start-goal <goal-id>`: mdkg graph import-template <source-bundle-or-mdkg-dir> [--start-goal <goal-id>] [--select-goal] [--id-prefix <prefix>] [--dry-run] [--apply] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":true,"default":true,"apply_flag":"--apply","side_effects":["none"],"write_paths":[]}
- Side effects: preview-or-import-template-nodes-and-identity-provenance
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/identity/**, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/state/selected-goal.json, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/work/events/events.jsonl
- Lock policy: mutation-lock-required-for-apply
- Atomic write policy: exclusive-node-creation-and-atomic-state-writes
- Receipts: graph-import-template-receipt

### Related commands

`mdkg graph`, `mdkg graph clone`, `mdkg graph fork`, `mdkg graph migrate`, `mdkg graph reconcile`

## graph migrate

mdkg graph migrate command

- Command: `mdkg graph migrate`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use for graph references, clone/fork/import, and graph movement workflows.

Beginner safety: Prefer the dry-run or plan mode before applying changes.

### Usage

```text
mdkg graph migrate --graph-id <uuid> --origin <uuid> [--ancestor <ref>] [--decisions <path>] [--apply --plan-hash <sha256>] [--json]
```

### Examples

```bash
mdkg graph migrate --graph-id <uuid> --origin <uuid> [--ancestor <ref>] [--decisions <path>] [--apply --plan-hash <sha256>] [--json]
```

### Common flags

- `--ancestor <ref>`: mdkg graph migrate --graph-id <uuid> --origin <uuid> [--ancestor <ref>] [--decisions <path>] [--apply --plan-hash <sha256>] [--json]
- `--apply`: mdkg graph migrate --graph-id <uuid> --origin <uuid> [--ancestor <ref>] [--decisions <path>] [--apply --plan-hash <sha256>] [--json]
- `--decisions <path>`: mdkg graph migrate --graph-id <uuid> --origin <uuid> [--ancestor <ref>] [--decisions <path>] [--apply --plan-hash <sha256>] [--json]
- `--graph-id <uuid>`: mdkg graph migrate --graph-id <uuid> --origin <uuid> [--ancestor <ref>] [--decisions <path>] [--apply --plan-hash <sha256>] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg graph migrate --graph-id <uuid> --origin <uuid> [--ancestor <ref>] [--decisions <path>] [--apply --plan-hash <sha256>] [--json]
- `--origin <uuid>`: mdkg graph migrate --graph-id <uuid> --origin <uuid> [--ancestor <ref>] [--decisions <path>] [--apply --plan-hash <sha256>] [--json]
- `--plan-hash <sha256>`: mdkg graph migrate --graph-id <uuid> --origin <uuid> [--ancestor <ref>] [--decisions <path>] [--apply --plan-hash <sha256>] [--json]
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":true,"default":true,"flag":"--apply"}
- Side effects: preview-or-apply-reviewed-identity-migration
- Read paths: .mdkg/**, <local-git-objects-and-index>
- Write paths: .mdkg/graph.json, .mdkg/identity/migrations/**, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/state/identity-transactions/**, <reviewed-authored-graph-paths>
- Lock policy: mutation-lock-required-for-apply
- Atomic write policy: hash-bound-journal-and-per-file-atomic-writes
- Receipts: graph-migration-plan, graph-transaction-receipt

### Related commands

`mdkg graph`, `mdkg graph clone`, `mdkg graph fork`, `mdkg graph import-template`, `mdkg graph reconcile`

## graph reconcile

mdkg graph reconcile command

- Command: `mdkg graph reconcile`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use for graph references, clone/fork/import, and graph movement workflows.

Beginner safety: Prefer the dry-run or plan mode before applying changes.

### Usage

```text
mdkg graph reconcile --ancestor <ref> --incoming <ref> [--target <HEAD-ref>] [--decisions <path>] [--apply --plan-hash <sha256>] [--json]
```

### Examples

```bash
mdkg graph reconcile --ancestor <ref> --incoming <ref> [--target <HEAD-ref>] [--decisions <path>] [--apply --plan-hash <sha256>] [--json]
```

### Common flags

- `--ancestor <ref>`: mdkg graph reconcile --ancestor <ref> --incoming <ref> [--target <HEAD-ref>] [--decisions <path>] [--apply --plan-hash <sha256>] [--json]
- `--apply`: mdkg graph reconcile --ancestor <ref> --incoming <ref> [--target <HEAD-ref>] [--decisions <path>] [--apply --plan-hash <sha256>] [--json]
- `--decisions <path>`: mdkg graph reconcile --ancestor <ref> --incoming <ref> [--target <HEAD-ref>] [--decisions <path>] [--apply --plan-hash <sha256>] [--json]
- `--help`: --help, -h          Show help
- `--incoming <ref>`: mdkg graph reconcile --ancestor <ref> --incoming <ref> [--target <HEAD-ref>] [--decisions <path>] [--apply --plan-hash <sha256>] [--json]
- `--json`: mdkg graph reconcile --ancestor <ref> --incoming <ref> [--target <HEAD-ref>] [--decisions <path>] [--apply --plan-hash <sha256>] [--json]
- `--plan-hash <sha256>`: mdkg graph reconcile --ancestor <ref> --incoming <ref> [--target <HEAD-ref>] [--decisions <path>] [--apply --plan-hash <sha256>] [--json]
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--target <HEAD-ref>`: mdkg graph reconcile --ancestor <ref> --incoming <ref> [--target <HEAD-ref>] [--decisions <path>] [--apply --plan-hash <sha256>] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":true,"default":true,"flag":"--apply"}
- Side effects: preview-or-apply-reviewed-identity-reconciliation
- Read paths: .mdkg/**, <decisions-json>, <local-git-history-and-index>
- Write paths: .mdkg/identity/**, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/state/identity-transactions/**, <reviewed-authored-graph-paths>
- Lock policy: mutation-lock-required-for-apply
- Atomic write policy: hash-bound-journal-and-per-file-atomic-writes
- Receipts: graph-reconciliation-noop, graph-reconciliation-plan, graph-transaction-receipt

### Related commands

`mdkg graph`, `mdkg graph clone`, `mdkg graph fork`, `mdkg graph import-template`, `mdkg graph migrate`

## graph recover

mdkg graph recover command

- Command: `mdkg graph recover`
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use for graph references, clone/fork/import, and graph movement workflows.

Beginner safety: Prefer the dry-run or plan mode before applying changes.

### Usage

```text
mdkg graph recover <plan-hash> [--resume|--rollback] [--lock-evidence <sha256>] [--confirm-quiescent] [--json]
```

### Examples

```bash
mdkg graph recover <plan-hash> [--resume|--rollback] [--lock-evidence <sha256>] [--confirm-quiescent] [--json]
```

### Common flags

- `--confirm-quiescent`: mdkg graph recover <plan-hash> [--resume|--rollback] [--lock-evidence <sha256>] [--confirm-quiescent] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg graph recover <plan-hash> [--resume|--rollback] [--lock-evidence <sha256>] [--confirm-quiescent] [--json]
- `--lock-evidence <sha256>`: mdkg graph recover <plan-hash> [--resume|--rollback] [--lock-evidence <sha256>] [--confirm-quiescent] [--json]
- `--resume`: mdkg graph recover <plan-hash> [--resume|--rollback] [--lock-evidence <sha256>] [--confirm-quiescent] [--json]
- `--rollback`: mdkg graph recover <plan-hash> [--resume|--rollback] [--lock-evidence <sha256>] [--confirm-quiescent] [--json]
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":true,"default":true}
- Side effects: inspect-or-resume-or-roll-back-reviewed-graph-transaction
- Read paths: .mdkg/**, <local-git-objects-and-index>
- Write paths: .mdkg/graph.json, .mdkg/identity/**, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/state/identity-transactions/**, <reviewed-authored-graph-paths>
- Lock policy: mutation-lock-and-explicit-quiescence-with-fresh-recovery-evidence
- Atomic write policy: exact-owned-bytes-and-checkout-lock-journal-custody
- Receipts: graph-transaction-inspect, graph-transaction-receipt

### Related commands

`mdkg graph`, `mdkg graph clone`, `mdkg graph fork`, `mdkg graph import-template`, `mdkg graph migrate`

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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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

`mdkg graph`, `mdkg graph clone`, `mdkg graph fork`, `mdkg graph import-template`, `mdkg graph migrate`

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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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
- Mode: Mutating command
- Public status: stable / public
- Danger level: moderate

### When to use

Use for sanitized transfer prompts between humans and agents.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg handoff create <id-or-qid> [--ws <alias>] [--depth <n>] [--out <path>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-sanitized-agent-handoff-when-out-is-provided, may-refresh-derived-caches-even-for-stdout
- Read paths: .mdkg/**
- Write paths: .mdkg/handoffs/**, .mdkg/index/**, <--out>, <configured-index-cache-paths>
- Lock policy: no-command-level-mutation-lock; cache-writers-own-their-write-policy
- Atomic write policy: atomic-output-and-derived-cache-writes
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--tolerant`: mdkg index [--tolerant]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text
- Dry run: {"supported":false}
- Side effects: rebuild-generated-index-cache
- Read paths: .mdkg/**
- Write paths: .mdkg/index/**, .mdkg/index/write.lock/**, <configured-index-cache-paths>
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

- `--agent`: --agent               Compatibility alias for compact agent setup (default)
- `--force`: --force               Overwrite existing mdkg files
- `--graph-only`: --graph-only          Create graph scaffold without agent setup
- `--help`: --help, -h          Show help
- `--no-update-ignores`: --no-update-ignores   Skip default .gitignore/.npmignore updates
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--update-dockerignore`: --update-dockerignore Append mdkg ignore entries
- `--update-gitignore`: --update-gitignore    Append mdkg ignore entries
- `--update-npmignore`: --update-npmignore    Append mdkg ignore entries
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text
- Dry run: {"supported":false}
- Side effects: initialize-mdkg-scaffold
- Read paths: .mdkg/**
- Write paths: .agents/skills/**, .claude/skills/**, .dockerignore, .gitignore, .mdkg/**, .npmignore, AGENTS.md, AGENT_START.md, CLI_COMMAND_MATRIX.md, llms.txt
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
- `--md`: [--json|--xml|--toon|--md]
- `--no-cache`: list: --ws <value> --type <value> --status <value> --epic <value> --priority <integer> --blocked --tags <value> --tags-mode <value> --json --xml --toon --md --no-cache --no-reindex
- `--no-reindex`: list: --ws <value> --type <value> --status <value> --epic <value> --priority <integer> --blocked --tags <value> --tags-mode <value> --json --xml --toon --md --no-cache --no-reindex
- `--priority <n>`: [--priority <n>] [--blocked] [--tags <tag,tag,...>] [--tags-mode any|all]
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--status <status>`: mdkg list [--type <type>] [--status <status>] [--ws <alias>] [--epic <id>]
- `--tags <tag,tag,...>`: [--priority <n>] [--blocked] [--tags <tag,tag,...>] [--tags-mode any|all]
- `--tags-mode any|all`: [--priority <n>] [--blocked] [--tags <tag,tag,...>] [--tags-mode any|all]
- 5 additional flags omitted from this generated summary.

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

- `--dry-run`: Accepted boolean option; see the concrete command admission contract.
- `--help`: Accepted boolean option; see the concrete command admission contract.
- `--json`: Emit deterministic JSON instead of text.
- `--materialization <value>`: Accepted value option; see the concrete command admission contract.
- `--meta`: Accepted boolean option; see the concrete command admission contract.
- `--no-cache`: Build a non-persisting in-memory index projection instead of reading the cache.
- `--no-children`: Accepted boolean option; see the concrete command admission contract.
- `--no-reindex`: Do not rebuild a stale or missing index projection.
- `--planning-only`: Accepted boolean option; see the concrete command admission contract.
- `--root <path>`: Run against a specific repository root; -r is the short alias.
- `--run-id <id>`: Attach an optional run id to the fork event when event logging is enabled.
- `--scope <value>`: Accepted value option; see the concrete command admission contract.
- 3 additional flags omitted from this generated summary.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":true,"commands":["fork"]}
- Side effects: read-or-write-loop-graph-state
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/work/events/events.jsonl
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

- `--dry-run`: Plan the fork without writing loop or child nodes.
- `--help`: Accepted boolean option; see the concrete command admission contract.
- `--json`: Emit deterministic JSON instead of text.
- `--materialization <mode>`: Child materialization mode: default_children, planning_only, or manual.
- `--no-cache`: Build a non-persisting in-memory index projection instead of reading the cache.
- `--no-children`: Alias for planning-only materialization.
- `--no-reindex`: Do not rebuild a stale or missing index projection.
- `--planning-only`: Create only the scoped loop shell.
- `--root <path>`: Run against a specific repository root; -r is the short alias.
- `--run-id <id>`: Attach an optional run id to the fork event when event logging is enabled.
- `--scope <scope>`: Scope ref, qid, URI, path, or description for the scoped loop.
- `--title <title>`: Override the generated scoped loop title.
- 2 additional flags omitted from this generated summary.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":true,"flag":"--dry-run","side_effects":["none"],"write_paths":[],"reserves_ids":false}
- Side effects: append-loop-fork-event-when-event-logging-is-enabled, create-scoped-loop-and-optional-child-nodes, rebuild-derived-indexes-when-auto-reindex-is-enabled, reserve-sqlite-node-ids-when-configured
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/work/events/events.jsonl
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

- `--help`: Accepted boolean option; see the concrete command admission contract.
- `--json`: Emit deterministic JSON instead of text.
- `--no-cache`: Build a non-persisting in-memory index projection instead of reading the cache.
- `--no-reindex`: Do not rebuild a stale or missing index projection.
- `--root <path>`: Run against a specific repository root; -r is the short alias.
- `--version`: Accepted boolean option; see the concrete command admission contract.
- `--ws <alias>`: Resolve the command against one workspace alias.

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

- `--help`: Accepted boolean option; see the concrete command admission contract.
- `--json`: Emit deterministic JSON instead of text.
- `--no-cache`: Build a non-persisting in-memory index projection instead of reading the cache.
- `--no-reindex`: Do not rebuild a stale or missing index projection.
- `--root <path>`: Run against a specific repository root; -r is the short alias.
- `--version`: Accepted boolean option; see the concrete command admission contract.
- `--ws <alias>`: Resolve the command against one workspace alias.

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

- `--help`: Accepted boolean option; see the concrete command admission contract.
- `--json`: Emit deterministic JSON instead of text.
- `--no-cache`: Build a non-persisting in-memory index projection instead of reading the cache.
- `--no-reindex`: Do not rebuild a stale or missing index projection.
- `--root <path>`: Run against a specific repository root; -r is the short alias.
- `--version`: Accepted boolean option; see the concrete command admission contract.
- `--ws <alias>`: Resolve the command against one workspace alias.

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

- `--help`: Accepted boolean option; see the concrete command admission contract.
- `--json`: Emit deterministic JSON instead of text.
- `--no-cache`: Build a non-persisting in-memory index projection instead of reading the cache.
- `--no-reindex`: Do not rebuild a stale or missing index projection.
- `--root <path>`: Run against a specific repository root; -r is the short alias.
- `--version`: Accepted boolean option; see the concrete command admission contract.
- `--ws <alias>`: Resolve the command against one workspace alias.

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

- `--help`: Accepted boolean option; see the concrete command admission contract.
- `--json`: Emit deterministic JSON instead of text.
- `--meta`: Show metadata without the full body.
- `--no-cache`: Build a non-persisting in-memory index projection instead of reading the cache.
- `--no-reindex`: Do not rebuild a stale or missing index projection.
- `--root <path>`: Run against a specific repository root; -r is the short alias.
- `--version`: Accepted boolean option; see the concrete command admission contract.
- `--ws <alias>`: Resolve the command against one workspace alias.

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
- `--no-cache`: manifest list: --json --no-cache --no-reindex
- `--no-reindex`: manifest list: --json --no-cache --no-reindex
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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
- `--no-cache`: manifest list: --json --no-cache --no-reindex
- `--no-reindex`: manifest list: --json --no-cache --no-reindex
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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
- `--no-cache`: manifest show: --json --no-cache --no-reindex
- `--no-reindex`: manifest show: --json --no-cache --no-reindex
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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
- `--no-cache`: manifest validate: --json --no-cache --no-reindex
- `--no-reindex`: manifest validate: --json --no-cache --no-reindex
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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
- `--root <value>`: - starts one local Model Context Protocol server bound to the selected --root
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

- `--aliases <value>`: --links --artifacts --refs --aliases --owners --cases --supersedes
- `--artifacts <value>`: --links --artifacts --refs --aliases --owners --cases --supersedes
- `--blocked-by <value>`: --parent --prev --next --relates --blocked-by --blocks
- `--blocks <value>`: --parent --prev --next --relates --blocked-by --blocks
- `--cases <value>`: --links --artifacts --refs --aliases --owners --cases --supersedes
- `--contract-profile <name>`: --contract-profile <name>  Optional MANIFEST/WORK/WORK_ORDER/RECEIPT validation profile metadata
- `--epic <id>`: --epic <id>                Epic id
- `--evidence-policy-ref <ref>`: --evidence-policy-ref <ref> Optional MANIFEST/WORK_ORDER/RECEIPT evidence policy ref
- `--help`: --help, -h          Show help
- `--id <portable-id>`: Use --id <portable-id> with these types for semantic ids like agent.image-worker.
- `--json`: mdkg new <type> "<title>" [options] [--json]
- `--links <value>`: --links --artifacts --refs --aliases --owners --cases --supersedes
- 21 additional flags omitted from this generated summary.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-graph-node
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/work/events/events.jsonl
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
- `--no-cache`: next: --ws <value> --no-cache --no-reindex
- `--no-reindex`: next: --ws <value> --no-cache --no-reindex
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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
- Mode: Mutating command
- Public status: stable / public
- Danger level: mixed

### When to use

Use to assemble deterministic context for one bounded work item.

Beginner safety: Prefer the dry-run or plan mode before applying changes.

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

- `--concise`: pack: --ws <value> --depth <integer> --edges <value> --verbose --concise --strip-code --format <value> --pack-profile <value> --max-code-lines <integer> --max-chars <integer> --max-lines <integer> --max-tokens <integer> --skills <value> --skills-depth <value> --visibility <value> --dry-run --stats --stats-out <value> --truncation-report <value> --out <value> --list-profiles --no-cache --no-reindex
- `--depth <integer>`: --depth --edges --strip-code --max-code-lines --max-chars --max-lines --max-tokens
- `--dry-run`: --dry-run                Preview selection/order/stats without writing files
- `--edges <value>`: --depth --edges --strip-code --max-code-lines --max-chars --max-lines --max-tokens
- `--format <fmt>`: -f, --format <fmt>           Output format: md|json|toon|xml (default md)
- `--help`: --help, -h          Show help
- `--list-profiles`: mdkg pack --list-profiles
- `--max-chars <integer>`: --depth --edges --strip-code --max-code-lines --max-chars --max-lines --max-tokens
- `--max-code-lines <integer>`: --depth --edges --strip-code --max-code-lines --max-chars --max-lines --max-tokens
- `--max-lines <integer>`: --depth --edges --strip-code --max-code-lines --max-chars --max-lines --max-tokens
- `--max-tokens <integer>`: --depth --edges --strip-code --max-code-lines --max-chars --max-lines --max-tokens
- `--no-cache`: pack: --ws <value> --depth <integer> --edges <value> --verbose --concise --strip-code --format <value> --pack-profile <value> --max-code-lines <integer> --max-chars <integer> --max-lines <integer> --max-tokens <integer> --skills <value> --skills-depth <value> --visibility <value> --dry-run --stats --stats-out <value> --truncation-report <value> --out <value> --list-profiles --no-cache --no-reindex
- 14 additional flags omitted from this generated summary.

### Output and safety

- Output formats: text
- Dry run: {"supported":true,"flag":"--dry-run","side_effects":["none"],"write_paths":[]}
- Side effects: write-pack-and-optional-statistics-or-truncation-reports
- Read paths: .mdkg/**
- Write paths: .mdkg/pack/**, <--out>, <--stats-out>, <--truncation-report>, <pack-output>.stats.json, <pack-output>.truncation.json
- Lock policy: no-command-level-mutation-lock; output-custody-preflight
- Atomic write policy: atomic-output-replacement
- Receipts: pack-output, pack-statistics, pack-truncation-report

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
- `--md`: [--tags <tag,tag,...>] [--tags-mode any|all] [--limit <n>] [--json|--xml|--toon|--md]
- `--no-cache`: search: --ws <value> --type <value> --status <value> --tags <value> --tags-mode <value> --limit <integer> --json --xml --toon --md --no-cache --no-reindex
- `--no-reindex`: search: --ws <value> --type <value> --status <value> --tags <value> --tags-mode <value> --limit <integer> --json --xml --toon --md --no-cache --no-reindex
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--status <status>`: mdkg search "<query>" [--type <type>] [--status <status>] [--ws <alias>]
- `--tags <tag,tag,...>`: [--tags <tag,tag,...>] [--tags-mode any|all] [--limit <n>] [--json|--xml|--toon|--md]
- `--tags-mode any|all`: [--tags <tag,tag,...>] [--tags-mode any|all] [--limit <n>] [--json|--xml|--toon|--md]
- `--toon`: [--tags <tag,tag,...>] [--tags-mode any|all] [--limit <n>] [--json|--xml|--toon|--md]
- `--type <type>`: mdkg search "<query>" [--type <type>] [--status <status>] [--ws <alias>]
- 3 additional flags omitted from this generated summary.

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
- `--md`: mdkg show <id-or-qid> [--ws <alias>] [--meta] [--json|--xml|--toon|--md]
- `--meta`: mdkg show <id-or-qid> [--ws <alias>] [--meta] [--json|--xml|--toon|--md]
- `--no-cache`: show: --ws <value> --meta --json --xml --toon --md --no-cache --no-reindex
- `--no-reindex`: show: --ws <value> --meta --json --xml --toon --md --no-cache --no-reindex
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--toon`: mdkg show <id-or-qid> [--ws <alias>] [--meta] [--json|--xml|--toon|--md]
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg show <id-or-qid> [--ws <alias>] [--meta] [--json|--xml|--toon|--md]
- `--xml`: mdkg show <id-or-qid> [--ws <alias>] [--meta] [--json|--xml|--toon|--md]

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

- `--authors <value>`: skill new: --description <value> --tags <value> --authors <value> --links <value> --with-scripts --force --run-id <value> --json
- `--description "<description>"`: mdkg skill new <slug> "<name>" --description "<description>" [options] [--json]
- `--force`: mdkg skill sync [--force] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg skill new <slug> "<name>" --description "<description>" [options] [--json]
- `--links <value>`: skill new: --description <value> --tags <value> --authors <value> --links <value> --with-scripts --force --run-id <value> --json
- `--md`: mdkg skill list [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
- `--meta`: mdkg skill show <slug> [--meta] [--json|--xml|--toon|--md]
- `--no-cache`: skill list: --tags <value> --tags-mode <value> --json --xml --toon --md --no-cache --no-reindex
- `--no-reindex`: skill list: --tags <value> --tags-mode <value> --json --xml --toon --md --no-cache --no-reindex
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--run-id <value>`: skill new: --description <value> --tags <value> --authors <value> --links <value> --with-scripts --force --run-id <value> --json
- 6 additional flags omitted from this generated summary.

### Output and safety

- Output formats: text, json, xml, toon, md
- Dry run: {"supported":false}
- Side effects: read-or-write-skills-and-agent-mirrors
- Read paths: .mdkg/**
- Write paths: .agents/skills/**, .claude/skills/**, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/skills/**, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <configured-skill-mirror-roots>/**, <configured-skills-root>/**
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
- `--md`: mdkg skill list [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
- `--no-cache`: skill list: --tags <value> --tags-mode <value> --json --xml --toon --md --no-cache --no-reindex
- `--no-reindex`: skill list: --tags <value> --tags-mode <value> --json --xml --toon --md --no-cache --no-reindex
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--tags <tag,tag,...>`: mdkg skill list [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
- `--tags-mode any|all`: mdkg skill list [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
- `--toon`: mdkg skill list [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
- `--version`: --version, -V       Show version
- `--xml`: mdkg skill list [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]

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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--run-id <id>`: --run-id <id>                Optional event run id when event logging is enabled
- `--tags <tag,tag,...>`: --tags <tag,tag,...>         Optional skill tags
- `--version`: --version, -V       Show version
- `--with-scripts`: --with-scripts               Create scripts/ in the scaffold

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-skill
- Read paths: .mdkg/**
- Write paths: .agents/skills/**, .claude/skills/**, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/skills/**, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <configured-skill-mirror-roots>/**, <configured-skills-root>/**
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
- `--md`: mdkg skill search "<query>" [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
- `--no-cache`: skill search: --tags <value> --tags-mode <value> --json --xml --toon --md --no-cache --no-reindex
- `--no-reindex`: skill search: --tags <value> --tags-mode <value> --json --xml --toon --md --no-cache --no-reindex
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--tags <tag,tag,...>`: mdkg skill search "<query>" [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
- `--tags-mode any|all`: mdkg skill search "<query>" [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
- `--toon`: mdkg skill search "<query>" [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]
- `--version`: --version, -V       Show version
- `--xml`: mdkg skill search "<query>" [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]

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
- `--md`: mdkg skill show <slug> [--meta] [--json|--xml|--toon|--md]
- `--meta`: mdkg skill show <slug> [--meta] [--json|--xml|--toon|--md]
- `--no-cache`: skill show: --meta --json --xml --toon --md --no-cache --no-reindex
- `--no-reindex`: skill show: --meta --json --xml --toon --md --no-cache --no-reindex
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--toon`: mdkg skill show <slug> [--meta] [--json|--xml|--toon|--md]
- `--version`: --version, -V       Show version
- `--xml`: mdkg skill show <slug> [--meta] [--json|--xml|--toon|--md]

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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: refresh-agent-skill-mirrors
- Read paths: .mdkg/**
- Write paths: .agents/skills/**, .claude/skills/**, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/skills/**, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <configured-skill-mirror-roots>/**, <configured-skills-root>/**
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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
- `--no-cache`: spec list: --json --no-cache --no-reindex
- `--no-reindex`: spec list: --json --no-cache --no-reindex
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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
- `--no-cache`: spec list: --json --no-cache --no-reindex
- `--no-reindex`: spec list: --json --no-cache --no-reindex
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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
- `--no-cache`: spec show: --json --no-cache --no-reindex
- `--no-reindex`: spec show: --json --no-cache --no-reindex
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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
- `--no-cache`: spec validate: --json --no-cache --no-reindex
- `--no-reindex`: spec validate: --json --no-cache --no-reindex
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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

- `--all`: mdkg subgraph verify [alias|--all] [--json]
- `--allow-dirty`: mdkg subgraph sync [alias|--all] [--dry-run] [--allow-dirty] [--json]
- `--clean`: mdkg subgraph materialize [alias|--all] --target <path> [--clean] [--gitignore] [--json]
- `--dry-run`: mdkg subgraph sync [alias|--all] [--dry-run] [--allow-dirty] [--json]
- `--gitignore`: mdkg subgraph materialize [alias|--all] --target <path> [--clean] [--gitignore] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]
- `--max-stale-seconds <seconds>`: mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]
- `--pack-profile private|public`: mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--source-path <path>`: mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]
- `--source-repo <ref>`: mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]
- 3 additional flags omitted from this generated summary.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":true,"commands":["sync"]}
- Side effects: read-or-write-subgraph-config-and-materialized-trees
- Read paths: .mdkg/**
- Write paths: .mdkg/config.json, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/subgraphs/**, <--target>/**, <configured-index-cache-paths>, <configured-subgraph-bundle-paths>
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
- `--pack-profile private|public`: mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--source-path <path>`: mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]
- `--source-repo <ref>`: mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]
- `--version`: --version, -V       Show version
- `--visibility private|internal|public`: mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: register-subgraph
- Read paths: .mdkg/**
- Write paths: .mdkg/config.json, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/subgraphs/**, <--target>/**, <configured-index-cache-paths>, <configured-subgraph-bundle-paths>
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: disable-subgraph-registration
- Read paths: .mdkg/**
- Write paths: .mdkg/config.json, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/subgraphs/**, <--target>/**, <configured-index-cache-paths>, <configured-subgraph-bundle-paths>
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: enable-subgraph-registration
- Read paths: .mdkg/**
- Write paths: .mdkg/config.json, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/subgraphs/**, <--target>/**, <configured-index-cache-paths>, <configured-subgraph-bundle-paths>
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg subgraph materialize [alias|--all] --target <path> [--clean] [--gitignore] [--json]
```

### Examples

```bash
mdkg subgraph materialize [alias|--all] --target <path> [--clean] [--gitignore] [--json]
```

### Common flags

- `--all`: mdkg subgraph materialize [alias|--all] --target <path> [--clean] [--gitignore] [--json]
- `--clean`: mdkg subgraph materialize [alias|--all] --target <path> [--clean] [--gitignore] [--json]
- `--gitignore`: mdkg subgraph materialize [alias|--all] --target <path> [--clean] [--gitignore] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg subgraph materialize [alias|--all] --target <path> [--clean] [--gitignore] [--json]
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--target <path>`: mdkg subgraph materialize [alias|--all] --target <path> [--clean] [--gitignore] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: replace-owned-generated-tree-with-clean, write-materialized-read-only-inspection-tree
- Read paths: .mdkg/**
- Write paths: .mdkg/index/write.lock/**, <--target>/.gitignore, <--target>/<alias>/**
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

- `--all`: mdkg subgraph refresh [alias|--all] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg subgraph refresh [alias|--all] [--json]
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: reload-configured-bundle-snapshots-and-rebuild-derived-indexes
- Read paths: .mdkg/**
- Write paths: .mdkg/index/**, .mdkg/index/write.lock/**, <configured-index-cache-paths>
- Lock policy: mutation-lock-required
- Atomic write policy: atomic-derived-cache-writes
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: remove-subgraph-registration
- Read paths: .mdkg/**
- Write paths: .mdkg/config.json, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/subgraphs/**, <--target>/**, <configured-index-cache-paths>, <configured-subgraph-bundle-paths>
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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

- `--all`: mdkg subgraph sync [alias|--all] [--dry-run] [--allow-dirty] [--json]
- `--allow-dirty`: mdkg subgraph sync [alias|--all] [--dry-run] [--allow-dirty] [--json]
- `--dry-run`: mdkg subgraph sync [alias|--all] [--dry-run] [--allow-dirty] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg subgraph sync [alias|--all] [--dry-run] [--allow-dirty] [--json]
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":true,"default":false,"flag":"--dry-run"}
- Side effects: refresh-root-owned-subgraph-bundles
- Read paths: .mdkg/**
- Write paths: .mdkg/config.json, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/subgraphs/**, <--target>/**, <configured-index-cache-paths>, <configured-subgraph-bundle-paths>
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

- `--all`: mdkg subgraph verify [alias|--all] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg subgraph verify [alias|--all] [--json]
- `--root <value>`: --root, -r <path>   Run against a specific repo root
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

- `--add-artifacts <value>`: task update: --status <value> --priority <integer> --add-artifacts <value> --add-links <value> --add-refs <value> --add-skills <value> --add-tags <value> --add-blocked-by <value> --clear-blocked-by --ws <value> --json --run-id <value> --note <value>
- `--add-blocked-by <value>`: task update: --status <value> --priority <integer> --add-artifacts <value> --add-links <value> --add-refs <value> --add-skills <value> --add-tags <value> --add-blocked-by <value> --clear-blocked-by --ws <value> --json --run-id <value> --note <value>
- `--add-links <value>`: task update: --status <value> --priority <integer> --add-artifacts <value> --add-links <value> --add-refs <value> --add-skills <value> --add-tags <value> --add-blocked-by <value> --clear-blocked-by --ws <value> --json --run-id <value> --note <value>
- `--add-refs <value>`: task update: --status <value> --priority <integer> --add-artifacts <value> --add-links <value> --add-refs <value> --add-skills <value> --add-tags <value> --add-blocked-by <value> --clear-blocked-by --ws <value> --json --run-id <value> --note <value>
- `--add-skills <value>`: task update: --status <value> --priority <integer> --add-artifacts <value> --add-links <value> --add-refs <value> --add-skills <value> --add-tags <value> --add-blocked-by <value> --clear-blocked-by --ws <value> --json --run-id <value> --note <value>
- `--add-tags <value>`: task update: --status <value> --priority <integer> --add-artifacts <value> --add-links <value> --add-refs <value> --add-skills <value> --add-tags <value> --add-blocked-by <value> --clear-blocked-by --ws <value> --json --run-id <value> --note <value>
- `--checkpoint "<title>"`: mdkg task done <id-or-qid> [--checkpoint "<title>"] [--checkpoint-kind implementation|test-proof|goal-closeout|audit|handoff] [options] [--json]
- `--checkpoint-kind implementation|test-proof|goal-closeout|audit|handoff`: mdkg task done <id-or-qid> [--checkpoint "<title>"] [--checkpoint-kind implementation|test-proof|goal-closeout|audit|handoff] [options] [--json]
- `--clear-blocked-by`: task update: --status <value> --priority <integer> --add-artifacts <value> --add-links <value> --add-refs <value> --add-skills <value> --add-tags <value> --add-blocked-by <value> --clear-blocked-by --ws <value> --json --run-id <value> --note <value>
- `--help`: --help, -h          Show help
- `--json`: mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"] [--json]
- `--note "<text>"`: mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"] [--json]
- 6 additional flags omitted from this generated summary.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-update-task-lifecycle
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/work/events/events.jsonl
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--run-id <id>`: [--add-refs <id,...>] [--checkpoint "<title>"] [--checkpoint-kind implementation|test-proof|goal-closeout|audit|handoff] [--run-id <id>] [--note "<text>"] [--json]
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg task done <id-or-qid> [--ws <alias>] [--add-artifacts <a,...>] [--add-links <l,...>]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: complete-task
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/work/events/events.jsonl
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--run-id <id>`: mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"] [--json]
- `--version`: --version, -V       Show version
- `--ws <alias>`: mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"] [--json]

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: start-task
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/work/events/events.jsonl
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- 4 additional flags omitted from this generated summary.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: update-task
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/work/events/events.jsonl
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
mdkg upgrade [--dry-run | --apply | --resume | --recover] [--plan-hash <sha256>] [--only <paths>] [--json]
```

### Examples

```bash
mdkg upgrade [--dry-run | --apply | --resume | --recover] [--plan-hash <sha256>] [--only <paths>] [--json]
```

### Common flags

- `--apply`: mdkg upgrade [--dry-run | --apply | --resume | --recover] [--plan-hash <sha256>] [--only <paths>] [--json]
- `--dry-run`: mdkg upgrade [--dry-run | --apply | --resume | --recover] [--plan-hash <sha256>] [--only <paths>] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg upgrade [--dry-run | --apply | --resume | --recover] [--plan-hash <sha256>] [--only <paths>] [--json]
- `--only <paths>`: mdkg upgrade [--dry-run | --apply | --resume | --recover] [--plan-hash <sha256>] [--only <paths>] [--json]
- `--plan-hash <sha256>`: mdkg upgrade [--dry-run | --apply | --resume | --recover] [--plan-hash <sha256>] [--only <paths>] [--json]
- `--recover`: mdkg upgrade [--dry-run | --apply | --resume | --recover] [--plan-hash <sha256>] [--only <paths>] [--json]
- `--resume`: mdkg upgrade [--dry-run | --apply | --resume | --recover] [--plan-hash <sha256>] [--only <paths>] [--json]
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":true,"default":true,"flag":"--apply"}
- Side effects: preview-or-apply-managed-scaffold-upgrade
- Read paths: .mdkg/**
- Write paths: .agents/skills/**, .claude/skills/**, .dockerignore, .gitignore, .mdkg/**, .mdkg/index/write.lock/**, .npmignore, AGENTS.md, AGENT_START.md, CLI_COMMAND_MATRIX.md, llms.txt
- Lock policy: mutation-lock-required-for-apply
- Atomic write policy: atomic-file-writes
- Receipts: upgrade-apply-receipt, upgrade-plan

### Related commands

none

## validate

mdkg validate command

- Command: `mdkg validate`
- Mode: Mutating command
- Public status: stable / public
- Danger level: mixed

### When to use

Use before closeout to check graph integrity and warning categories.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

### Usage

```text
mdkg validate [--out <path>] [--json-out <path>] [--quiet] [--changed-only] [--summary] [--limit <n>] [--json]
```

### Examples

```bash
mdkg validate [--out <path>] [--json-out <path>] [--quiet] [--changed-only] [--summary] [--limit <n>] [--json]
```

### Common flags

- `--changed-only`: mdkg validate [--out <path>] [--json-out <path>] [--quiet] [--changed-only] [--summary] [--limit <n>] [--json]
- `--help`: --help, -h          Show help
- `--json`: mdkg validate [--out <path>] [--json-out <path>] [--quiet] [--changed-only] [--summary] [--limit <n>] [--json]
- `--json-out <path>`: mdkg validate [--out <path>] [--json-out <path>] [--quiet] [--changed-only] [--summary] [--limit <n>] [--json]
- `--limit <n>`: mdkg validate [--out <path>] [--json-out <path>] [--quiet] [--changed-only] [--summary] [--limit <n>] [--json]
- `--out <path>`: mdkg validate [--out <path>] [--json-out <path>] [--quiet] [--changed-only] [--summary] [--limit <n>] [--json]
- `--quiet`: mdkg validate [--out <path>] [--json-out <path>] [--quiet] [--changed-only] [--summary] [--limit <n>] [--json]
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--summary`: mdkg validate [--out <path>] [--json-out <path>] [--quiet] [--changed-only] [--summary] [--limit <n>] [--json]
- `--version`: --version, -V       Show version

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: write-explicit-report-when-out-or-json-out-is-provided
- Read paths: .mdkg/**
- Write paths: <--json-out>, <--out>
- Lock policy: no-command-level-mutation-lock
- Atomic write policy: direct-report-writes-not-transactional
- Receipts: validation-receipt

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
mdkg work validate [<id-or-qid>] [--type <workflow-type>] [--json]
```

### Examples

```bash
mdkg work contract new ...
mdkg work order new|status|update ...
mdkg work trigger <work-or-capability-ref> ...
```

### Common flags

- `--add-artifacts <value>`: work order update: --status <value> --add-input-refs <value> --add-queue-refs <value> --add-artifacts <value> --ws <value> --json
- `--add-attestation-refs <value>`: work receipt update: --receipt-status <value> --add-artifacts <value> --add-proof-refs <value> --add-attestation-refs <value> --add-evidence-hashes <value> --ws <value> --json
- `--add-evidence-hashes <value>`: work receipt update: --receipt-status <value> --add-artifacts <value> --add-proof-refs <value> --add-attestation-refs <value> --add-evidence-hashes <value> --ws <value> --json
- `--add-input-refs <value>`: work order update: --status <value> --add-input-refs <value> --add-queue-refs <value> --add-artifacts <value> --ws <value> --json
- `--add-proof-refs <value>`: work receipt update: --receipt-status <value> --add-artifacts <value> --add-proof-refs <value> --add-attestation-refs <value> --add-evidence-hashes <value> --ws <value> --json
- `--add-queue-refs <value>`: work order update: --status <value> --add-input-refs <value> --add-queue-refs <value> --add-artifacts <value> --ws <value> --json
- `--agent-id <value>`: work contract new: --id <value> --agent-id <value> --kind <value> --inputs <value> --outputs <value> --required-capabilities <value> --contract-profile <value> --ws <value> --json
- `--artifacts <value>`: work receipt new: --id <value> --work-order-id <value> --outcome <value> --receipt-status <value> --cost-ref <value> --redaction-policy <value> --artifacts <value> --proof-refs <value> --attestation-refs <value> --evidence-hashes <value> --input-hashes <value> --output-hashes <value> --contract-profile <value> --validation-policy-ref <value> --evidence-policy-ref <value> --receipt-kind <value> --redaction-class <value> --ws <value> --json
- `--attestation-refs <value>`: work receipt new: --id <value> --work-order-id <value> --outcome <value> --receipt-status <value> --cost-ref <value> --redaction-policy <value> --artifacts <value> --proof-refs <value> --attestation-refs <value> --evidence-hashes <value> --input-hashes <value> --output-hashes <value> --contract-profile <value> --validation-policy-ref <value> --evidence-policy-ref <value> --receipt-kind <value> --redaction-class <value> --ws <value> --json
- `--constraint-refs <value>`: work order new: --id <value> --work-id <value> --requester <value> --request-ref <value> --trigger-ref <value> --payload-hash <value> --input-refs <value> --queue-refs <value> --requested-outputs <value> --constraint-refs <value> --contract-profile <value> --validation-policy-ref <value> --evidence-policy-ref <value> --ws <value> --json
- `--contract-profile <value>`: work contract new: --id <value> --agent-id <value> --kind <value> --inputs <value> --outputs <value> --required-capabilities <value> --contract-profile <value> --ws <value> --json
- `--cost-ref <value>`: work receipt new: --id <value> --work-order-id <value> --outcome <value> --receipt-status <value> --cost-ref <value> --redaction-policy <value> --artifacts <value> --proof-refs <value> --attestation-refs <value> --evidence-hashes <value> --input-hashes <value> --output-hashes <value> --contract-profile <value> --validation-policy-ref <value> --evidence-policy-ref <value> --receipt-kind <value> --redaction-class <value> --ws <value> --json
- 34 additional flags omitted from this generated summary.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: read-or-write-work-contract-mirrors
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/archive/**, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <configured-project-db-runtime>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/archive/**, <workspace-mdkg>/work/events/events.jsonl
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <value>`: work artifact add: --id <value> --kind <value> --ws <value> --json

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-work-artifact-record-and-update-owning-order-or-receipt
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/archive/**, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/archive/**, <workspace-mdkg>/work/events/events.jsonl
- Lock policy: mutation-lock-required
- Atomic write policy: exclusive-archive-create-and-atomic-node-update
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
mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--contract-profile <name>] [--required-capabilities <...>] [--json]
```

### Examples

```bash
mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--contract-profile <name>] [--required-capabilities <...>] [--json]
```

### Common flags

- `--agent-id <agent.id>`: mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--contract-profile <name>] [--required-capabilities <...>] [--json]
- `--contract-profile <name>`: mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--contract-profile <name>] [--required-capabilities <...>] [--json]
- `--help`: --help, -h          Show help
- `--id <work.id>`: mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--contract-profile <name>] [--required-capabilities <...>] [--json]
- `--inputs <...>`: mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--contract-profile <name>] [--required-capabilities <...>] [--json]
- `--json`: mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--contract-profile <name>] [--required-capabilities <...>] [--json]
- `--kind <kind>`: mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--contract-profile <name>] [--required-capabilities <...>] [--json]
- `--outputs <...>`: mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--contract-profile <name>] [--required-capabilities <...>] [--json]
- `--required-capabilities <...>`: mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--contract-profile <name>] [--required-capabilities <...>] [--json]
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--ws <value>`: work contract new: --id <value> --agent-id <value> --kind <value> --inputs <value> --outputs <value> --required-capabilities <value> --contract-profile <value> --ws <value> --json

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-or-update-work-contract
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/work/events/events.jsonl
- Lock policy: mutation-lock-required
- Atomic write policy: exclusive-create-or-atomic-file-write
- Receipts: work-contract-receipt

### Related commands

`mdkg work`, `mdkg work artifact`, `mdkg work order`, `mdkg work receipt`, `mdkg work trigger`

## work order

mdkg work order command

- Command: `mdkg work order`
- Mode: Mutating command
- Public status: stable / public
- Danger level: mixed

### When to use

Use for MANIFEST, legacy SPEC, WORK, WORK_ORDER, and RECEIPT workflow surfaces.

Beginner safety: Run read-only grounding commands first, then use this only when you intend to update mdkg state.

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
- `--constraint-refs <value>`: work order new: --id <value> --work-id <value> --requester <value> --request-ref <value> --trigger-ref <value> --payload-hash <value> --input-refs <value> --queue-refs <value> --requested-outputs <value> --constraint-refs <value> --contract-profile <value> --validation-policy-ref <value> --evidence-policy-ref <value> --ws <value> --json
- `--contract-profile <name>`: mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--contract-profile <name>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]
- `--evidence-policy-ref <ref>`: mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--contract-profile <name>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]
- `--help`: --help, -h          Show help
- `--id <order.id>`: mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--contract-profile <name>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]
- `--input-refs <...>`: mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--contract-profile <name>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]
- `--json`: mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--contract-profile <name>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]
- `--payload-hash <sha256:...>`: mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--contract-profile <name>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]
- `--queue-refs <...>`: mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--contract-profile <name>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]
- 10 additional flags omitted from this generated summary.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-or-update-work-order; status-is-observational
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/work/**/WORK_ORDER.md, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/work/events/events.jsonl
- Lock policy: mutation-lock-required-for-new-update
- Atomic write policy: exclusive-create-or-atomic-file-write
- Receipts: work-order-receipt, work-order-status

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
- `--artifacts <value>`: work receipt new: --id <value> --work-order-id <value> --outcome <value> --receipt-status <value> --cost-ref <value> --redaction-policy <value> --artifacts <value> --proof-refs <value> --attestation-refs <value> --evidence-hashes <value> --input-hashes <value> --output-hashes <value> --contract-profile <value> --validation-policy-ref <value> --evidence-policy-ref <value> --receipt-kind <value> --redaction-class <value> --ws <value> --json
- `--attestation-refs <value>`: work receipt new: --id <value> --work-order-id <value> --outcome <value> --receipt-status <value> --cost-ref <value> --redaction-policy <value> --artifacts <value> --proof-refs <value> --attestation-refs <value> --evidence-hashes <value> --input-hashes <value> --output-hashes <value> --contract-profile <value> --validation-policy-ref <value> --evidence-policy-ref <value> --receipt-kind <value> --redaction-class <value> --ws <value> --json
- `--contract-profile <name>`: mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected|superseded] [--redaction-policy refs_and_hashes_only|redacted_summary|external_private] [--contract-profile <name>] [--receipt-kind <kind>] [--redaction-class <class>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--evidence-hashes <sha256:...>] [--json]
- `--cost-ref <value>`: work receipt new: --id <value> --work-order-id <value> --outcome <value> --receipt-status <value> --cost-ref <value> --redaction-policy <value> --artifacts <value> --proof-refs <value> --attestation-refs <value> --evidence-hashes <value> --input-hashes <value> --output-hashes <value> --contract-profile <value> --validation-policy-ref <value> --evidence-policy-ref <value> --receipt-kind <value> --redaction-class <value> --ws <value> --json
- `--evidence-hashes <sha256:...>`: mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected|superseded] [--redaction-policy refs_and_hashes_only|redacted_summary|external_private] [--contract-profile <name>] [--receipt-kind <kind>] [--redaction-class <class>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--evidence-hashes <sha256:...>] [--json]
- `--evidence-policy-ref <ref>`: mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected|superseded] [--redaction-policy refs_and_hashes_only|redacted_summary|external_private] [--contract-profile <name>] [--receipt-kind <kind>] [--redaction-class <class>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--evidence-hashes <sha256:...>] [--json]
- `--help`: --help, -h          Show help
- `--id <receipt.id>`: mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected|superseded] [--redaction-policy refs_and_hashes_only|redacted_summary|external_private] [--contract-profile <name>] [--receipt-kind <kind>] [--redaction-class <class>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--evidence-hashes <sha256:...>] [--json]
- 14 additional flags omitted from this generated summary.

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-or-update-work-receipt
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/work/**/RECEIPT.md, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/work/events/events.jsonl
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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--title "<title>"`: mdkg work trigger <work-or-capability-ref> [--id <order.id>] [--title "<title>"] [--requester <ref>] [--enqueue <queue>] [--json]
- `--version`: --version, -V       Show version
- `--ws <value>`: work trigger: --id <value> --title <value> --requester <value> --enqueue <value> --ws <value> --json

### Output and safety

- Output formats: text, json
- Dry run: {"supported":false}
- Side effects: create-submitted-work-order-and-optionally-enqueue-message
- Read paths: .mdkg/**
- Write paths: .mdkg/**/*.md, .mdkg/index/**, .mdkg/index/write.lock/**, .mdkg/work/**/WORK_ORDER.md, .mdkg/work/events/events.jsonl, <configured-index-cache-paths>, <configured-project-db-runtime>, <workspace-mdkg>/**/*.md, <workspace-mdkg>/work/events/events.jsonl
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
mdkg work validate [<id-or-qid>] [--type manifest|spec|work|work_order|receipt|feedback|dispute|proposal] [--json]
```

### Examples

```bash
mdkg work validate [<id-or-qid>] [--type manifest|spec|work|work_order|receipt|feedback|dispute|proposal] [--json]
```

### Common flags

- `--help`: --help, -h          Show help
- `--json`: mdkg work validate [<id-or-qid>] [--type manifest|spec|work|work_order|receipt|feedback|dispute|proposal] [--json]
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--type manifest|spec|work|work_order|receipt|feedback|dispute|proposal`: mdkg work validate [<id-or-qid>] [--type manifest|spec|work|work_order|receipt|feedback|dispute|proposal] [--json]
- `--version`: --version, -V       Show version
- `--ws <value>`: work validate: --type <value> --ws <value> --json

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
- `--root <value>`: --root, -r <path>   Run against a specific repo root
- `--version`: --version, -V       Show version
- `--visibility <level>`: mdkg workspace add <alias> <path> [--mdkg-dir <dir>] [--visibility <level>] [--json]

### Output and safety

- Output formats: text, json, md
- Dry run: {"supported":false}
- Side effects: read-or-update-workspace-config
- Read paths: .mdkg/**
- Write paths: .mdkg/config.json, .mdkg/index/**, .mdkg/index/write.lock/**, <configured-index-cache-paths>, <workspace-mdkg>/core/, <workspace-mdkg>/design/, <workspace-mdkg>/work/
- Lock policy: mutation-lock-required-for-add-rm-enable-disable
- Atomic write policy: atomic-config-write
- Receipts: workspace-receipt

### Related commands

none

