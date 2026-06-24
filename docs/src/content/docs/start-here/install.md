---
title: Install
description: Install mdkg and initialize a git-native project memory graph.
---

## Requirements

- Node.js `>=24.15.0`
- npm for the primary global install path
- A Git repository when you want reviewable project memory

Check your runtime:

```bash
node --version
npm --version
```

## Install globally

```bash
npm install -g mdkg
mdkg --version
```

The public-alpha install path promotes the globally installed CLI because that is the path covered by release validation. One-off runners such as `npx`, `pnpm dlx`, and `bunx` may be useful later, but verify them in your own tooling before documenting them for a team.

Package-manager notes:

- The npm package publishes the `mdkg` binary and validates global install in release smoke tests.
- Keep one canonical global CLI on your machine when comparing behavior across repos.
- If a repo pins a local toolchain, use the repo docs first and then compare with `mdkg --version`.
- Do not put npm tokens, registry credentials, or private package config in mdkg graph nodes or checkpoints.
- Low dependency is part of mdkg's security posture: Markdown and Git stay authoritative, generated caches are rebuildable, and optional SQLite-backed state remains local infrastructure.

## Initialize a repo

```bash
mdkg init --agent
mdkg index
mdkg status
mdkg validate
```

`mdkg index` builds rebuildable access caches. Markdown files remain the durable source of truth.

Expected result:

- `.mdkg/` exists and contains repo-owned project memory.
- agent startup guidance exists for coding agents.
- `mdkg status` reports graph, git, selected-goal, cache, and optional project DB state.
- `mdkg validate` either passes or gives actionable warnings/errors to fix before closeout.

Next, run the [quickstart](/start-here/quickstart/) or read [Local-first and Low-dependency](/concepts/local-first-low-dependency/) before introducing mdkg to a larger repo.
