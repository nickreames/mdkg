# Claude Instructions

This project uses mdkg to manage tasks and context.

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

## Before making changes

- Run `mdkg pack <task-id> --verbose`.
- Follow linked rules and decisions.

## After making changes

- Update frontmatter fields and `updated: YYYY-MM-DD`.
- Run `mdkg validate` and fix any errors.
- If frontmatter is inconsistent, run `mdkg format`.

## Repo-specific notes

Add build, test, and release instructions here.
