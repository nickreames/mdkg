# Contributing to mdkg

mdkg is a local-first CLI for deterministic project memory. Contributions should preserve that shape: file-based, inspectable in git, deterministic when possible, and useful to both humans and agents.

## Prompt Requests Before Pull Requests

The preferred contribution path is a Prompt Request: describe intent clearly enough that a maintainer, human contributor, or coding agent can turn it into a correct patch.

This is inspired by the OpenClaw creator's framing of Prompt Requests over Pull Requests. The point is not to reject code; it is to make user intent first-class. Many useful contributors know the workflow problem better than the codebase. mdkg should capture that intent before debating implementation details.

Use a Prompt Request when you want to propose:
- a new command or flag
- a docs or onboarding improvement
- a validation rule
- a workflow standard
- a bug report with expected behavior
- an agent-facing convention or template

A good Prompt Request includes:
- the goal in plain language
- the current behavior or gap
- the desired behavior
- one or two example commands or markdown snippets
- acceptance criteria
- any constraints, such as backwards compatibility or public naming

Code Pull Requests are still welcome when the implementation is clear, scoped, tested, and linked to the intent it serves.

## Public Naming

mdkg's public standard language is generic agent workflow language.

Use:
- `agent workflow files`
- `agent workflow docs`
- `mdkg init --agent`
- `skill.<slug>` for skill proposal targets
- `extensions.<vendor>` for vendor extension metadata

Avoid new public API or docs language that makes mdkg look tied to one product or runtime. ochatr.ai is a pioneering adopter and may use `ochatr_*` extension metadata, but the base mdkg schema should stay vendor-neutral.

## Development Loop

Install dependencies when npm is available:

```bash
npm install
```

Core checks:

```bash
npm run build
npm run test
npm run cli:check
node dist/cli.js validate
```

Release smoke checks:

```bash
npm run smoke:consumer
npm pack --dry-run
```

If the local toolchain is incomplete, document exactly what was blocked and run the checks that are still possible, such as:

```bash
git diff --check
node --check scripts/postinstall.js
```

## Working in the mdkg Repo

This repo dogfoods mdkg. Before a substantial change:

1. Read `AGENT_START.md`.
2. Inspect relevant source and tests.
3. Use `CLI_COMMAND_MATRIX.md` for the command surface.
4. Keep source behavior and docs aligned.
5. Add focused tests for new user-visible behavior.
6. Run `mdkg validate` after building when possible.

Do not commit generated index or pack outputs. Keep `.mdkg/index/` and `.mdkg/pack/` ignored.

## Change Requirements

Good patches are:
- small enough to review
- explicit about public interface changes
- covered by focused tests
- documented in `README.md`, `CLI_COMMAND_MATRIX.md`, or `CHANGELOG.md` when behavior changes
- careful with existing dirty worktree changes

For agent workflow files, update tests and fixtures when changing:
- accepted frontmatter fields
- validation rules
- `mdkg new` scaffolding
- pack/search/show output

For release work, update:
- `package.json`
- `package-lock.json`
- `README.md`
- `CLI_COMMAND_MATRIX.md`
- `CHANGELOG.md`
- init assets under `assets/init/` when generated starter docs change

## Pull Request Guidance

When submitting code, include:
- linked Prompt Request or short intent statement
- summary of behavior changes
- tests run and any blocked checks
- docs updated or reason docs were not needed
- compatibility notes for existing mdkg repos

Do not include unrelated formatting churn or generated artifacts unless the change requires them.

## Security and Secrets

Do not put secrets in mdkg nodes, packs, events, fixtures, or test outputs. mdkg is project memory, not a secret store.

Report security-sensitive issues privately until a safe disclosure path is established.
