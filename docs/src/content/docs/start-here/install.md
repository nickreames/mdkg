---
title: Install
description: Install mdkg and initialize a git-native project memory graph.
---

## Requirements

- Node.js `>=24.18.0 <25` for the unpublished 0.6.3 candidate
- npm for the primary global install path
- A Git repository when you want reviewable project memory

The candidate requires built-in SQLite `deserialize`, `setAuthorizer` and
`enableDefensive`, plus `process.availableMemory`. Other Node majors are not
implicitly supported. Unsupported runtimes fail before workspace discovery;
help/version remain available. This is Node-only implementation, not proof of
every operating system: macOS/Linux final qualification remains required and
Windows remains unqualified. Published 0.5.2 has its own runtime contract.

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

The supported public-alpha install path uses the globally installed CLI. One-off runners such as `npx`, `pnpm dlx`, and `bunx` may be useful later, but verify them in your own tooling before documenting them for a team.

Package-manager notes:

- The npm package publishes the `mdkg` binary and validates global install in package smoke tests.
- Keep one canonical global CLI on your machine when comparing behavior across repos.
- If a repo pins a local toolchain, use the repo docs first and then compare with `mdkg --version`.
- Do not put npm tokens, registry credentials, or private package config in mdkg graph nodes or checkpoints.
- Low dependency is part of mdkg's security posture: Markdown and Git stay authoritative, generated caches are rebuildable, and optional SQLite-backed state remains local infrastructure.

## Initialize a repo

```bash
mdkg init
mdkg index
mdkg status
mdkg validate
```

`mdkg index` builds rebuildable access caches. Markdown files remain the durable source of truth.

The 0.6.3 candidate defaults to compact agent setup. Root `AGENTS.md` routes to `.mdkg/AGENT_START.md`; generated command discovery lives
under `.mdkg`. Both native skill mirrors remain defaults; existing `CLAUDE.md`
contents are preserved and a missing legacy wrapper is not recreated. Use `mdkg init --graph-only` to omit agent setup, or
`mdkg init --agent` for its compatibility spelling. Published 0.5.2 used an
opt-in agent layout; confirm your installed version before using candidate
instructions. Initialization preserves project README, LICENSE, website
discovery assets and user content outside mdkg-managed instruction sections.

Expected result:

- `.mdkg/` exists and contains repo-owned project memory.
- agent startup guidance exists for coding agents.
- `mdkg status` reports graph, git, selected-goal, cache, and optional project DB state.
- `mdkg validate` either passes or gives actionable warnings/errors to fix before closeout.

## Customize after init

Use `.mdkg/config.json` for organization-specific overlays after the first
init. Keep the mdkg CLI kernel installed from npm, then let repo config describe
local standards and generated mirror targets.

Common customization surfaces:

- organization standards and local core-doc preferences in `.mdkg/config.json`
- canonical skills under `.mdkg/skills/`
- arbitrary contained skill mirror target paths configured from `.mdkg/config.json`
- `.mdkg/core/COLLABORATION.md` as the canonical operator profile
- `.mdkg/core/HUMAN.md` as a one-release legacy alias for older prompts

Preview scaffold changes before applying them:

```bash
mdkg upgrade
mdkg upgrade --json
```

Review `safe_to_apply`, `will_write_paths`, conflicts and `apply_side_effects`.
Replace `PLAN_HASH` with the exact `plan_hash` from that preview:

```bash
mdkg upgrade --apply --plan-hash PLAN_HASH
```

Pending writes require the reviewed hash; changed inputs invalidate it. Upgrades preserve
local overlays, customized docs, customized skills and configured mirror paths.
User bytes outside managed root sections survive; edits inside an owned section
are conflicts, not permission to overwrite. Legacy root guides are redirected
only when provenance proves they are known generated content. Maintained project
docs and public `llms.txt` assets are not owned merely because of their names.

For an interrupted transaction, use the hash retained from its reviewed preview with
`mdkg upgrade --resume --plan-hash PLAN_HASH` to finish, or
`mdkg upgrade --recover --plan-hash PLAN_HASH` to restore operation-owned bytes.
Both paths reject intervening user edits instead of discarding them. Review a
fresh preview after recovery; do not delete the journal to bypass a conflict.

For adopted v2 graphs, upgrade preserves identities and aliases rather than
inventing identities for missing seed nodes. Use explicit graph creation or
reintroduction for those nodes. New journals bind graph-format bytes and preview
dependencies and every approved operation; changes to those inputs block both
continuation paths. Unbound schema1/2 journals remain inspectable but cannot
automatically resume or recover on any graph version. Preserve the journal and
affected files for explicit investigation. Do not accept a replacement approval
hash from edited journal data. This verifies local approval consistency, not
external attestation.

For capability files, use canonical `MANIFEST.md` naming in new work. Legacy
`SPEC.md` files and `mdkg spec ...` commands remain compatibility aliases for
one release, but new docs and skills should prefer `mdkg manifest ...` and
`mdkg new manifest`.

Next, run the [quickstart](/start-here/quickstart/) or read [Local-first and Low-dependency](/concepts/local-first-low-dependency/) before introducing mdkg to a larger repo.
