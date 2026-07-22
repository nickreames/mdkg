---
id: dec-86
type: dec
title: Authorize the local-only mdkg test CI skill and harness audit
status: accepted
tags: [loop, audit, tests, ci, skills, local-only]
owners: []
links: []
artifacts: []
relates: [loop-7]
refs: [loop-7]
aliases: []
created: 2026-07-17
updated: 2026-07-17
---
# Context

The scoped `root:loop-7` fork must be ready to run without inheriting ambiguity
from the reusable template. The audit needs exact repository boundaries,
current local execution authority, an explicit skill-projection ownership
model, and a fail-closed policy for generated output and external access.

The reusable template remains unchanged. This decision applies only to the
scoped fork and its materialized children.

# Decision

## Scope And Exclusions

The audit includes:

- root package, TypeScript build, test, and command configuration;
- `.github/workflows/release-readiness.yml`, `src/`, `tests/`, and `scripts/`;
- docs and mdkg-dev package/build integration as reached through root CI,
  release, and smoke commands;
- canonical `.mdkg/skills`, configured `.agents/skills` and
  `.claude/skills` mirrors, and governed public init skill seeds;
- `AGENT_START.md`, `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`,
  `CLI_COMMAND_MATRIX.md`, relevant core guidance, agent workflow docs, and
  representative example harnesses.

The audit excludes functional implementation, duplicate/lint, security
rediscovery, stack modernization, product-design/UX, and user-story audits.
Ignored build output, caches, dependencies, runtime databases, packs, bundles,
archives, and temporary fixtures are not source-quality findings.

## CI Evidence Source Policy

Checked-in workflow/configuration and current local receipts are sufficient for
this run. GitHub, CI-provider, registry, advisory, browser-session, and other
network/API calls are not requested or authorized. Historical mdkg checkpoints
may provide context but cannot satisfy a current evidence lane.

## Local Execution Budget

Use `/opt/homebrew/opt/node@24/bin` so local commands run on Node `24.16.0` and
npm `11.13.0`. Run one bounded pass each of:

- `npm run test:coverage` with a 30-minute limit;
- `npm run ci:release` with the workflow's 30-minute limit; and
- `npm run prepublishOnly` with a 60-minute limit.

Also run offline dependency-tree inspection, mdkg skill list/validation,
canonical/projection comparisons, graph validation, and Git boundary checks.
Do not automatically retry an entire ladder. A failure or timeout is audit
evidence and does not authorize a source fix.

`npm ci` is inspected as a workflow requirement but is not executed because it
replaces dependencies and may require registry access. Existing dependencies
may be inspected and used with npm offline, audit-disabled, fund-disabled, and
a dedicated temporary cache.

Node `24.16.0` satisfies the package engine and the floating `24.x` workflow
row. The audit must not claim direct execution of the exact `24.15.0` row.

## Authoritative Skill Projection Contract

`.mdkg/skills` is canonical. `.agents/skills` and `.claude/skills` are managed
configured projections to compare, never edit or synchronize in this audit.
Public init seeds are a governed subset rather than automatic copies of every
repository skill. In particular, `dec-85` requires
`release-mdkg-package` to remain repository-local and absent from public
defaults. `mdkg skill sync` is prohibited.

## Generated Output Policy

Ignored root/site `dist` directories, ignored caches, and dedicated
`/private/tmp/mdkg-test-ci-audit-loop-7/` fixtures are allowed. Compact audit
evidence may be written under
`.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/`.

Tracked generated output, functional files, tests, workflows, skill sources,
mirrors, public seeds, dependencies, and lockfiles must not change. Capture Git
state before and after local commands. If a command changes an unauthorized
tracked path, stop that lane, record the exact drift, preserve unrelated user
work, and do not reset or restore it automatically.

# Alternatives considered

- Use live CI-provider and registry evidence. Rejected because this fork is
  explicitly local-only and those calls require separate authority.
- Allow skill sync or repairs during the audit. Rejected because the loop is
  read-only at functional surfaces and should create follow-up work instead.
- Attach the repository-root scope to an unrelated goal QID. Rejected; the
  descriptive repository scope plus explicit context refs is more truthful.
- Execute only representative smokes. Rejected in favor of the requested full
  local `prepublishOnly` ladder.

# Consequences

- All five pre-run identities on `root:loop-7` may bind to this accepted
  decision.
- Local inspection, Node 24 verification, bounded mdkg evidence, and justified
  follow-up task/test creation are authorized.
- External/provider/network actions remain optional, approval-gated, and
  unrequested, so no approval receipt is required for readiness.
- The audit can report failures and gaps but cannot implement fixes.
- No waiver exists by default; a future lane waiver requires both a same-lane
  accepted decision and separate verified approval.

# Links / references

- `root:loop-7`
- `root:chk-426`
- `root:chk-512`
- `root:chk-531`
- `root:chk-540`
- `root:dec-85`
