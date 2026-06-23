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

One-off runners such as `npx`, `pnpm dlx`, and `bunx` may be useful later, but the public-alpha install path promotes the globally installed CLI because that is the path covered by release validation.

## Initialize a repo

```bash
mdkg init --agent
mdkg index
mdkg status
mdkg validate
```

`mdkg index` builds rebuildable access caches. Markdown files remain the durable source of truth.
