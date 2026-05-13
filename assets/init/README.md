# mdkg Workspace Guide

This repository is initialized for mdkg.

## Layout

- `core/`: rules, operating guide, and pinned docs
- `design/`: product/engineering decision records
- `work/`: epics, tasks, bugs, tests, checkpoints
- `templates/`: default node templates
- `index/`: generated index cache (do not commit)
- `pack/`: generated context packs (do not commit)

## First Commands

```bash
mdkg init --llm --agent
mdkg upgrade
mdkg search "..."
mdkg show <id>
mdkg pack <id>
mdkg validate
```

Agent workflow docs can use semantic ids:

```bash
mdkg new spec "image worker" --id agent.image-worker
mdkg new work "generate image" --id work.generate-image
```

Read `AGENT_START.md` first when this repo includes it.

## Pack Profiles

- `--pack-profile standard`: full body (current default behavior)
- `--pack-profile concise`: summary body with code stripped by default
- `--pack-profile headers`: metadata-only body (`none`)

`--max-tokens` is a heuristic limit based on `chars / 4`.

## Safety

Ensure ignore files include:

- `.mdkg/index/`
- `.mdkg/pack/`

Recommended:

```bash
mdkg init --update-gitignore --update-npmignore
```

## Upgrade

`mdkg upgrade` previews safe scaffold updates for existing workspaces and writes nothing by default.

Use `mdkg upgrade --apply` only after reviewing the receipt. Local customizations are preserved and reported instead of overwritten.
