---
id: rule-4
type: rule
title: mdkg repo safety (ignore rules, publish safety, deployment safety)
tags: [mdkg, publishing, safety]
owners: []
links: []
artifacts: []
relates: []
refs: []
aliases: []
created: 2026-01-06
updated: 2026-01-14
---

# Repo safety and ignores

mdkg content may contain sensitive notes and internal project planning. This rule defines how to prevent `.mdkg/` content from leaking into build artifacts, containers, and npm packages.

## Safety goals

- `.mdkg/` must not be shipped to production deployments.
- `.mdkg/` must not be published to npm.
- `.mdkg/index/` must never be committed.

## Git ignore requirements

The repo MUST ignore at minimum:

- `node_modules/`
- `dist/`
- `.mdkg/index/`
- `.mdkg/pack/`

Recommended `.gitignore` entries:
- `.mdkg/index/`
- `.mdkg/index/**`
- `.mdkg/pack/`

## npm publish safety (required)

The npm package MUST publish only the compiled CLI output and essential docs.

Required approach:
- Use `package.json` `"files"` whitelist to ship only:
  - `dist/`
  - `README.md`
  - `LICENSE`

This approach is preferred over blacklists.

Additional belt-and-suspenders:
- Add `.npmignore` that excludes `.mdkg/` and other repo internals, even if `"files"` exists.

## Container and deployment safety (recommended)

If the repo is containerized:
- `.dockerignore` SHOULD exclude:
  - `.mdkg/`
  - `.mdkg/index/`
  - `node_modules/`
  - `dist/` (if built in container)
  - any other local artifacts

For application builds:
- Build tooling SHOULD exclude `.mdkg/` (e.g., tsconfig excludes, bundlers exclude dot-folders).

## mdkg init behavior

`mdkg init` MAY offer optional flags to append ignore entries:

- `--update-gitignore`
- `--update-npmignore`
- `--update-dockerignore`

In v1, mdkg should default to **not** editing user files without an explicit flag.

## Index safety

- `.mdkg/index/` is generated.
- Index files may contain extracted metadata and could expose sensitive strings.
- Index files MUST be ignored from git.
- Index rebuild should be deterministic and safe to regenerate at any time.

## Workspace safety

Workspace-local `.mdkg/` directories (near code) should follow the same rules:
- the content is source-of-truth docs (tracked)
- the workspace-local index folder (if present) should be ignored
- templates remain global (root) in v1

## Summary checklist

- ✅ `.mdkg/index/` ignored
- ✅ npm publishes only `dist/`, `README.md`, `LICENSE`
- ✅ optional `.npmignore` excludes `.mdkg/`
- ✅ `.dockerignore` excludes `.mdkg/` when applicable
