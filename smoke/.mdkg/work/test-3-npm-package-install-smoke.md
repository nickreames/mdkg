---
id: test-3
type: test
title: npm package install smoke
status: done
priority: 2
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
cases: [local-install, global-install, help-command, init-command, new-task]
created: 2026-01-22
updated: 2026-01-22
---
# Overview

Verify the published mdkg package installs and runs via local (npx) and global installs.

# Target / Scope

Standard npm usage paths: local install, global install, help/guide output, init flow, and new work item creation.

# Preconditions / Environment

- Node + npm available.
- Network access to npm registry.
- Global npm prefix set to `~/.npm-global` to avoid /usr/local permissions.

# Test Cases

- local-install: `npm install mdkg@0.0.2` + `npx mdkg help` + `npx mdkg init --llm`
- global-install: `npm install -g mdkg@0.0.2` (with `npm config set prefix "$HOME/.npm-global"`)
- help-command: `mdkg help` and `mdkg help new`
- init-command: `mdkg init --llm --root .context/smoke-global`
- new-task: `mdkg new test "npm package install smoke" --ws smoke --status done --priority 2 --cases ...`

# Results / Evidence

- Local install + npx commands succeeded in `.context/npm-smoke`.
- Global install succeeded under `~/.npm-global`; help/new/guide/init commands succeeded.

# Notes / Follow-ups

- Initial global install to `/usr/local` failed with EACCES; resolved by setting npm prefix.
