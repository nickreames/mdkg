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
mdkg index
mdkg new task "..." --status todo --priority 1
mdkg list --status todo
mdkg pack <id> --verbose
mdkg validate
```

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
