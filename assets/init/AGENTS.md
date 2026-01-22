# Agent Guidelines

This repo uses mdkg for tasks, decisions, and context packs.

## Quickstart

- `mdkg init --llm`
- `mdkg index`
- `mdkg new task "..." --status todo --priority 1`
- `mdkg list --status todo`
- `mdkg pack <id> --verbose`
- `mdkg validate`

## Core commands

- `mdkg init` (scaffold .mdkg and optional agent docs)
- `mdkg guide` (print the repo guide)
- `mdkg new <type> "<title>"` (create nodes)
- `mdkg list` / `mdkg show` / `mdkg search`
- `mdkg pack` (context bundles)
- `mdkg next` (priority/chain)
- `mdkg validate` / `mdkg format`

## Getting context

- Run `mdkg list --status todo` to find work items.
- Before coding, run `mdkg pack <task-id> --verbose`.
- Read linked rules and decisions in the pack.

## Editing rules

- Keep frontmatter valid and lowercase.
- Update `updated: YYYY-MM-DD` when you make changes.
- Use `links:` and `artifacts:` for anything you want searchable.

## Validation

- Run `mdkg validate` after edits.
- Run `mdkg format` if frontmatter drifts.

## Project-specific notes

Add repo-specific build/test commands and conventions here.
