# Install

## Requirements

- Node.js `>=24.15.0`
- npm for the primary global install path
- A Git repository when you want reviewable project memory

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

One-off runners such as `npx`, `pnpm dlx`, and `bunx` may be useful later, but the public-alpha install path promotes the globally installed CLI because that is the path covered by release validation.

Package-manager notes:

- The npm package publishes the `mdkg` binary and validates global install in release smoke tests.
- Keep one canonical global CLI on your machine when comparing behavior across repos.
- If a repo pins a local toolchain, use the repo docs first and then compare with `mdkg --version`.
- Do not put npm tokens, registry credentials, or private package config in mdkg graph nodes or checkpoints.

## Initialize A Repo

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

## Customize After Init

Use `.mdkg/config.json` for organization-specific overlays after the first
init. Keep the mdkg CLI kernel installed from npm, then let repo config describe
local standards and generated mirror targets.

Common customization surfaces:

- organization standards and local core-doc preferences in `.mdkg/config.json`
- canonical skills under `.mdkg/skills/`
- arbitrary contained skill mirror target paths configured from `.mdkg/config.json`
- `COLLABORATION.md` as the canonical operator profile
- `HUMAN.md` as a one-release legacy alias for older prompts

Preview scaffold changes before applying them:

```bash
mdkg upgrade
mdkg upgrade --json
mdkg upgrade --apply
```

`mdkg upgrade --apply` updates mdkg-managed assets only after the dry-run receipt
is reviewable. It preserves local overlays, customized docs, customized skills,
and configured mirror paths instead of turning every repo into a fork of mdkg.

For capability files, use canonical `MANIFEST.md` naming in new work. Legacy
`SPEC.md` files and `mdkg spec ...` commands remain compatibility aliases for
one release, but new docs and skills should prefer `mdkg manifest ...` and
`mdkg new manifest`.
