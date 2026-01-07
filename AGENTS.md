# Repository Guidelines

## Project Structure & Module Organization

This repository currently contains only mdkg configuration data. The working files live under the `.mdkg/` directory.

- `.mdkg/config.json` stores the mdkg tool configuration.
- No application source, tests, or assets are present yet.

When adding code, keep related files grouped (e.g., `src/`, `tests/`, `assets/`) and update this guide to reflect the new layout.

## Build, Test, and Development Commands

No build, test, or runtime commands are defined in the current repository. If you introduce a build system or task runner, document the exact commands here (for example, `make build`, `npm test`, or `./scripts/dev`).

## Coding Style & Naming Conventions

There is no project-specific style guide yet. Follow these defaults until a codebase is added:

- JSON files should use 2-space indentation, matching `.mdkg/config.json`.
- Use clear, lowercase filenames with hyphens for new Markdown or config files (example: `project-notes.md`).
- Keep files ASCII unless a feature requires Unicode.

## Testing Guidelines

No testing framework is configured. If you add tests, document the framework, naming scheme (e.g., `*_test.py`, `*.spec.ts`), and how to run them.

## Commit & Pull Request Guidelines

This directory is not initialized as a Git repository, so no commit history or conventions exist. If you add Git history, define a commit format and PR expectations here (issue links, change summary, screenshots for UI changes, etc.).

## Configuration Notes

The mdkg configuration expects a `.mdkg/` folder at the repository root. If you relocate or rename this directory, update `.mdkg/config.json` accordingly.
