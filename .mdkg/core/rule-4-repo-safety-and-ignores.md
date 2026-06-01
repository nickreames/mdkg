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
- Generated JSON index, temp, lock, WAL, SHM, and journal files under `.mdkg/index/` must not be committed.
- `.mdkg/index/mdkg.sqlite` is a rebuildable access cache and may be committed when the repo intentionally tracks it and it stays reasonably small.
- `.mdkg/state/` stores local workflow convenience state and must not be committed.
- `.mdkg/bundles/` may be committed only when the repo intentionally tracks private or public snapshot bundles.

## Git ignore requirements

The repo MUST ignore at minimum:

- `node_modules/`
- `dist/`
- `.mdkg/index/*.json`
- `.mdkg/index/*.tmp`
- `.mdkg/index/write.lock/`
- `.mdkg/index/*.sqlite-wal`
- `.mdkg/index/*.sqlite-shm`
- `.mdkg/index/*.sqlite-journal`
- `.mdkg/state/`
- `.mdkg/pack/`
- `.mdkg/archive/**/source/`

Recommended `.gitignore` entries:
- `.mdkg/index/*.json`
- `.mdkg/index/*.tmp`
- `.mdkg/index/write.lock/`
- `.mdkg/index/*.sqlite-wal`
- `.mdkg/index/*.sqlite-shm`
- `.mdkg/index/*.sqlite-journal`
- `.mdkg/state/`
- `.mdkg/pack/`
- `.mdkg/archive/**/source/`

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
  - `.mdkg/index/*.json`
  - `.mdkg/index/*.tmp`
  - `.mdkg/index/write.lock/`
  - `.mdkg/index/*.sqlite-wal`
  - `.mdkg/index/*.sqlite-shm`
  - `.mdkg/index/*.sqlite-journal`
  - `node_modules/`
  - `dist/` (if built in container)
  - any other local artifacts

For application builds:
- Build tooling SHOULD exclude `.mdkg/` (e.g., tsconfig excludes, bundlers exclude dot-folders).

## mdkg init behavior

`mdkg init` updates ignore files by default for safety:

- `.gitignore` appends generated index cache/temp/lock patterns, `.mdkg/state/`, `.mdkg/pack/`, and raw archive source ignores.
- `.npmignore` appends `.mdkg/`, generated index cache/temp/lock patterns, and `.mdkg/pack/`.
- `--no-update-ignores` disables these default writes

Explicit flags remain available and take precedence:

- `--update-gitignore`
- `--update-npmignore`
- `--update-dockerignore`

## Index safety

- `.mdkg/index/` contains generated caches.
- JSON index files may contain extracted metadata and could expose sensitive strings; they MUST be ignored from git.
- `.mdkg/index/mdkg.sqlite` contains the same rebuildable access data and may be committed only by explicit repo policy; `mdkg doctor` warns when it exceeds `index.sqlite_commit_warning_bytes`.
- `.mdkg/state/` contains local workflow convenience state such as selected goals and MUST stay ignored.
- Index rebuild should be deterministic and safe to regenerate at any time.

## Bundle safety

- `.mdkg/bundles/` stores explicit snapshot artifacts and is not ignored by default.
- Private bundles may include sensitive authored mdkg content and should stay in private repos.
- Public bundles must be created with `mdkg bundle create --profile public` so private graph, archive, and subgraph refs fail closed.
- Public-safe packs must be created with `mdkg pack <id> --visibility public`; internal-safe packs use `--visibility internal`. These filters do not redact Markdown body text.
- Bundle ZIPs must exclude `.mdkg/pack/`, existing `.mdkg/index/`, nested `.mdkg/bundles/`, and raw `.mdkg/archive/**/source/` files.
- Repos that track archive caches or bundles should refresh in this order before commit: `mdkg archive compress --all`, `mdkg archive verify --json`, `mdkg bundle create --profile private`, then bundle verify.

## Archive safety

- Archive sidecar `.md` files and deterministic `.zip` caches are the commit-eligible evidence record.
- Raw copied sources under `.mdkg/archive/**/source/` stay ignored by default.
- `mdkg validate` and `mdkg archive verify` must both check ZIP cache hash, ZIP readability, payload hash, and payload byte size.
- Outside-repo archive sources must be recorded as redacted labels such as `external:key_input_doc.pdf`, not absolute local paths.
- `mdkg doctor` warns when committed archive ZIP caches exceed `archive.large_cache_warning_bytes`; this is advisory and does not block validation.

## Workspace safety

Workspace-local `.mdkg/` directories (near code) should follow the same rules:
- the content is source-of-truth docs (tracked)
- the workspace-local index folder (if present) should be ignored
- templates remain global (root) in v1

## Summary checklist

- ✅ generated JSON index/temp/lock files ignored
- ✅ local `.mdkg/state/` ignored
- ✅ `.mdkg/index/mdkg.sqlite` committed only by explicit repo policy
- ✅ event logs are committed by default unless a repo chooses to ignore them manually
- ✅ npm publishes only `dist/`, `README.md`, `LICENSE`
- ✅ optional `.npmignore` excludes `.mdkg/`
- ✅ `.dockerignore` excludes `.mdkg/` when applicable
