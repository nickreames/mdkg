---
id: edd-23
type: edd
title: mdkg dev launch gate and information architecture
tags: [mdkg-dev, docs, seo, launch, 0-4-0]
owners: []
links: []
artifacts: [dist/command-contract.json, scripts/smoke-command-docs.js]
relates: []
refs: [goal-13, epic-72, epic-73, task-330, edd-22]
aliases: []
created: 2026-06-09
updated: 2026-06-09
---
# Overview

Plan the `mdkg.dev` public docs and marketing launch gate after the generated
command docs contract became credible. This design does not implement a site.
It defines the information architecture, generated command-reference inputs,
SEO claim boundaries, and release gates that must be satisfied before public
launch work can begin.

The core positioning is practical and evidence-backed: mdkg is a local-first
Markdown knowledge graph and CLI for durable AI/human project memory, with
scriptable graph operations, project DB primitives, public local queue command
surface, generated command metadata, and safety-oriented repair planning.

# Architecture

`mdkg.dev` should have three public content layers:

1. Outcome guides: concise workflows that explain what a user can accomplish.
   These should be written by hand and stay tied to shipped capabilities.
2. Generated command reference: command pages generated from
   `dist/command-contract.json`, not hand-maintained command tables.
3. Release and safety posture: pages that explain local-first boundaries,
   dry-run repair planning, subgraph ownership, queue snapshot policy, and
   deferred execution surfaces.

Recommended first sitemap:

- `/`: product overview, install command, current stable version, and three
  outcome paths.
- `/docs/get-started`: initialize a repo, create nodes, search/show/pack, and
  validate.
- `/docs/agent-memory`: AGENT_START, skills, SPEC/WORK/ORDER/RECEIPT mirrors,
  and no-execution trigger boundaries.
- `/docs/project-db`: db init/migrate/verify/stats/snapshot, queue CLI, and
  internal-only event/reducer/lease/materializer boundaries.
- `/docs/queues`: public `mdkg db queue ...` lifecycle, pause/drain snapshot
  policy, and local-only delivery semantics.
- `/docs/subgraphs`: root-owned bundle snapshots, sync/materialize/audit,
  upgrade-plan, dirty child repo refusal, and no child repo mutation.
- `/docs/repair`: `mdkg status`, `mdkg doctor --strict`, `mdkg fix plan`, branch
  duplicate-ID planning, and no `fix apply` yet.
- `/docs/command-reference`: generated index from command contract.
- `/docs/command-reference/<command>`: generated command pages.
- `/changelog`: curated release notes with package version.
- `/security`: local-first privacy boundaries and secret-handling policy.

# Data model

Site-generation inputs:

- `dist/command-contract.json`: canonical command metadata.
- `CLI_COMMAND_MATRIX.md`: human-readable command matrix, still checked against
  help output, but not the public command-reference source of truth.
- `CHANGELOG.md`: release narrative.
- `README.md` and seeded init docs: onboarding copy source.
- mdkg graph nodes: roadmap/proof references for launch readiness, not public
  content by default.

Command-reference page fields should come from the contract:

- path, usage, args, flags, output formats, JSON schema ref, side effects,
  read/write paths, dry-run support, visibility, receipt actions, lock/atomic
  policy, danger level, and examples.

Only `visibility: public` records should be included in public docs.

# APIs / interfaces

Internal build interfaces:

- `npm run build` generates `dist/command-contract.json`.
- `npm run cli:contract` fails on command contract drift.
- `npm run smoke:command-docs` proves generated command docs can be rendered
  from the packaged contract and representative examples execute in a temp repo.

Future website build interfaces:

- `mdkg.dev` docs generator reads the mdkg-native contract and emits public-safe
  command reference pages.
- Optional OpenCLI projection can be generated from the mdkg-native contract,
  but it must remain a projection.
- Website build must fail if command reference pages are edited without
  contract input or if generated examples cannot execute.

# Failure modes

- Command docs drift from CLI behavior: block with `cli:contract`,
  `smoke:command-docs`, and generated-page hash checks.
- Marketing claims outrun shipped safety posture: block launch if pages claim
  worker execution, public event/reducer/lease/materializer CLI, hosted queue,
  arbitrary SQL, or automated downstream mutation.
- Internal/private metadata leaks: filter command records by `visibility:
  public`, ban local absolute paths and env/token strings in generated docs,
  and keep mdkg graph packs private unless explicitly public-safe.
- Examples rot: every guide-level example must have a temp-repo smoke or be
  tagged as conceptual.
- Version drift: launch must state the exact npm version being documented and
  pass package dry-run checks for that version.

# Observability

Launch readiness should report:

- package version and npm latest being documented.
- command contract hash.
- generated command count.
- smoke temp root for command-docs proof.
- result of `npm run prepublishOnly`.
- result of website docs-generation smoke once the site exists.

Generated pages should include hidden build metadata such as command contract
hash and package version so drift reports can point to the exact source.

# Security / privacy

- Do not publish private mdkg graph text, private archive source, local paths,
  npm tokens, auth headers, cookies, or user-specific temp paths.
- Position queue support as local `node:sqlite` delivery state, not hosted queue
  infrastructure or canonical event history.
- Position work trigger as mirror/order creation and optional queue delivery,
  not public worker execution.
- State that public event/reducer/lease/materializer CLI surfaces are deferred;
  internal helpers exist for local project DB implementation.
- State that `fix plan` is dry-run/read-only and `fix apply` is not shipped.
- State that subgraph operations preserve child repo ownership and do not mutate
  child repos from the root.

# Testing strategy

Pre-launch required checks:

- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `node dist/cli.js validate --json`
- `npm run smoke:command-docs`
- `npm run prepublishOnly`
- `node scripts/assert-publish-ready.js`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`
- future website build and generated-docs smoke
- `git diff --check`

Website-specific tests, when implemented:

- generated command-reference pages match `dist/command-contract.json`.
- public guide examples execute in a temp repo or are explicitly marked
  conceptual.
- sitemap and metadata are generated for SEO.
- no hidden/internal command records are emitted.
- no local absolute paths or token-like strings appear in the generated site.

# Rollout plan

1. Keep `mdkg.dev` implementation out of `goal-13`; this goal only establishes
   launch readiness and gates.
2. Publish the next mdkg package only through the existing explicit publish
   process: full gates, registry guard, real publish, global install, temp E2E.
3. Create a separate mdkg.dev implementation goal after package release
   direction is approved.
4. Build the generated command-reference pipeline before writing marketing
   pages.
5. Add website docs smoke and SEO checks.
6. Review claims against shipped capabilities and deferred surfaces.
7. Launch only after package, generated docs, website build, and no-leak checks
   pass.

Deferred surfaces that must not be marketed as shipped:

- public worker execution.
- public event/reducer/lease/materializer CLI.
- downstream migration automation that mutates child repos.
- hosted queue/event store behavior.
- arbitrary SQL access.
