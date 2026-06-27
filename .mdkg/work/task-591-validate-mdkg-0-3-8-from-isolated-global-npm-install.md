---
id: task-591
type: task
title: validate mdkg 0.3.8 from isolated global npm install
status: backlog
priority: 1
parent: goal-40
tags: [release, post-publish, npm, tmp, 0-3-8]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-589]
blocks: [test-300]
refs: [task-589]
context_refs: [goal-39, chk-280]
evidence_refs: []
aliases: [isolated-global-install-validation, tmp-global-mdkg-0-3-8, post-publish-mdkg-latest]
skills: [verify-close-and-checkpoint]
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Validate the published `mdkg@0.3.8` package from a fresh npm registry install
using a local temporary global prefix. This proves the public package works
outside the checkout and catches missing files, stale generated artifacts, or
installation-path assumptions.

# Acceptance Criteria

- The validation installs `mdkg@latest` from `https://registry.npmjs.org/` into
  a local tmp prefix such as `/private/tmp/mdkg-0.3.8-global`.
- The installed binary reports version `0.3.8`.
- A fresh tmp repo initialized with the installed binary validates cleanly.
- New manifest scaffolding creates `MANIFEST.md` with `type: manifest`, not
  `SPEC.md`.
- Manifest command and capability discovery surfaces work from the installed
  binary.
- A legacy `SPEC.md` temp fixture is migrated by `mdkg upgrade --apply` to
  `MANIFEST.md` with `type: manifest`.
- Evidence records the temp root, npm prefix, installed binary path, and
  command pass/fail status.

# Files Affected

- No repo source files should change.
- Temporary files under `/private/tmp/mdkg-0.3.8-*`.
- mdkg graph evidence/checkpoints may be written.

# Implementation Notes

- Use a local prefix instead of mutating the user's real global npm prefix:
  `NPM_CONFIG_PREFIX=/private/tmp/mdkg-0.3.8-global npm install -g mdkg@latest
  --registry=https://registry.npmjs.org/`.
- Run the installed binary via the explicit absolute path, for example
  `/private/tmp/mdkg-0.3.8-global/bin/mdkg`.
- Keep the tmp workspace outside this repo so validation does not accidentally
  use checkout-local files.
- Do not include npm auth details or raw npm config in mdkg evidence.

# Test Plan

- `rm -rf /private/tmp/mdkg-0.3.8-global /private/tmp/mdkg-0.3.8-postpublish`
- `NPM_CONFIG_PREFIX=/private/tmp/mdkg-0.3.8-global npm install -g mdkg@latest
  --registry=https://registry.npmjs.org/`
- `/private/tmp/mdkg-0.3.8-global/bin/mdkg --version`
- create `/private/tmp/mdkg-0.3.8-postpublish/workspace`
- run installed `mdkg init --agent --json` in that workspace
- run installed `mdkg new manifest "Post publish sample capability" --id
  agent.post-publish-sample --json`
- assert a `MANIFEST.md` file exists and no generated `SPEC.md` file exists for
  the new manifest
- run installed `mdkg manifest list --json`
- run installed `mdkg manifest show agent.post-publish-sample --json`
- run installed `mdkg manifest validate agent.post-publish-sample --json`
- run installed `mdkg capability search "post publish sample" --json`
- create or rename a legacy `SPEC.md` fixture with `type: spec`
- run installed `mdkg upgrade --dry-run --json`
- run installed `mdkg upgrade --apply --json`
- assert the legacy `SPEC.md` fixture was renamed to `MANIFEST.md` and
  frontmatter is `type: manifest`
- run installed `mdkg index`
- run installed `mdkg validate --json`
- run installed `mdkg status --json`

# Links / Artifacts

- `task-589`
- `test-300`
