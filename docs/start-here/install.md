# Install

## Requirements

- Node.js `>=24.15.0`
- npm for the primary install path
- A Git repository if you want reviewable project memory

Check your runtime:

```bash
node --version
npm --version
```

## Install Globally

```bash
npm install -g mdkg
mdkg --version
```

One-off runners such as `npx`, `pnpm dlx`, and `bunx` are useful candidates, but launch copy should promote them only after the smoke tests verify their behavior.

## Initialize A Repo

```bash
mdkg init --agent
mdkg index
mdkg status
mdkg validate
```

`mdkg index` builds rebuildable access caches. Markdown files remain the durable source of truth.
