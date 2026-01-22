# Repository Guidelines

## Project Structure & Module Organization

This repository contains the mdkg CLI source plus mdkg configuration data.

- `src/` holds the TypeScript CLI implementation.
- `src/templates/` holds template loading and rendering helpers.
- `tests/` holds unit tests compiled to `dist/tests/`.
- `scripts/` contains build helpers.
- `assets/` contains init-time templates (AGENTS/CLAUDE docs).
- `.mdkg/` stores mdkg configuration and docs (`.mdkg/config.json`).

## mdkg Quickstart

- `mdkg init --llm`
- `mdkg index`
- `mdkg new task "..." --status todo --priority 1`
- `mdkg list --status todo`
- `mdkg pack <id> --verbose`
- `mdkg validate`

When adding code, keep related files grouped (e.g., `src/`, `tests/`, `assets/`) and update this guide to reflect the new layout.

## Build, Test, and Development Commands

Build and test commands:

- `npm run build`
- `npm run test`

## Coding Style & Naming Conventions

There is no project-specific style guide yet. Follow these defaults until a codebase is added:

- JSON files should use 2-space indentation, matching `.mdkg/config.json`.
- Use clear, lowercase filenames with hyphens for new Markdown or config files (example: `project-notes.md`).
- Keep files ASCII unless a feature requires Unicode.

## Testing Guidelines

We use Node's built-in test runner. Tests live under `tests/` and use `*.test.ts` naming.

- `npm run test`

## Commit & Pull Request Guidelines

No commit or PR conventions are defined yet. If you add them, document the format and expectations here (issue links, change summary, screenshots for UI changes, etc.).

## Configuration Notes

The mdkg configuration expects a `.mdkg/` folder at the repository root. If you relocate or rename this directory, update `.mdkg/config.json` accordingly.
