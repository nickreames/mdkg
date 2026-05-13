# CLI Command Matrix

This file is the canonical command reference for mdkg in this repository.

Verify live help with:
- `mdkg --help`
- `mdkg help <command>`

Primary commands:
- `mdkg init`
- `mdkg upgrade [--dry-run] [--apply] [--json]`
- `mdkg new`
- `mdkg show`
- `mdkg list`
- `mdkg search`
- `mdkg pack`
- `mdkg skill`
- `mdkg task`
- `mdkg validate`

Validation commands:
- `mdkg validate [--out <path>] [--quiet] [--json]`

Node creation commands:
- `mdkg new <type> "<title>" [options] [--json]`

Agent workflow file type creation:
- `mdkg new spec "<title>" [options] [--json]`
- `mdkg new work "<title>" [options] [--json]`
- `mdkg new work_order "<title>" [options] [--json]`
- `mdkg new receipt "<title>" [options] [--json]`
- `mdkg new feedback "<title>" [options] [--json]`
- `mdkg new dispute "<title>" [options] [--json]`
- `mdkg new proposal "<title>" [options] [--json]`
- `mdkg new spec "image worker" --id agent.image-worker`
- `mdkg new work "generate image" --id work.generate-image`

Agent workflow notes:
- `--id <portable-id>` is only for agent workflow file types.
- `spec` and `work` scaffold as validation-clean standalone docs.
- `work_order`, `receipt`, `feedback`, `dispute`, and `proposal` need real refs before strict `mdkg validate` passes.

Workspace registry commands:
- `mdkg workspace ls [--json]`
- `mdkg workspace add <alias> <path> [--mdkg-dir <dir>] [--json]`
- `mdkg workspace rm <alias> [--json]`
- `mdkg workspace enable <alias> [--json]`
- `mdkg workspace disable <alias> [--json]`

Event log commands:
- `mdkg event enable [--ws <alias>] [--json]`
- `mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...> [options] [--json]`

Task mutation commands:
- `mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"] [--json]`
- `mdkg task update <id-or-qid> [options] [--json]`
- `mdkg task done <id-or-qid> [--checkpoint "<title>"] [options] [--json]`

Checkpoint commands:
- `mdkg checkpoint new <title> [--ws <alias>] [--json]`

Agent bootstrap:
- `mdkg init --llm`
- `mdkg init --agent`
- `mdkg init --llm --agent`
- published bootstrap config is root-only by default

Upgrade:
- `mdkg upgrade` previews safe scaffold updates and writes nothing by default
- `mdkg upgrade --apply` updates only managed or unchanged init assets
- JSON receipts include `safe_to_apply`, `will_write_paths`, `preserved_customizations`, `blocking_conflicts`, and `apply_side_effects`
- customized docs, templates, skills, and core files are preserved and reported
- ignored event logs are skipped with guidance to run `mdkg event enable`

Skill discovery:
- `mdkg skill list --tags stage:plan --json`
- `mdkg skill search "<query>" --json`
- `mdkg skill show <slug> --json`
- `mdkg skill validate [<slug>] [--json]`
- `mdkg skill sync [--force] [--json]`

Discovery/show export flags:
- `--json`
- `--xml`
- `--toon`
- `--md`
