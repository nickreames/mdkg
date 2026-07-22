---
id: spike-32
type: spike
title: mdkg test CI skill and harness infrastructure audit grounding spike
status: done
priority: 1
parent: loop-7
tags: [loop-template, audit, tests, ci, skills, loop-fork, loop-child, spike]
owners: []
links: []
artifacts: [.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/test-command-inventory.json, .mdkg/artifacts/loop-7/test-ci-skill-infrastructure/ci-parity-matrix.json, .mdkg/artifacts/loop-7/test-ci-skill-infrastructure/smoke-coverage-map.json, .mdkg/artifacts/loop-7/test-ci-skill-infrastructure/skill-projection-inventory.json, .mdkg/artifacts/loop-7/test-ci-skill-infrastructure/harness-guidance-map.md]
relates: [loop-7]
blocked_by: []
blocks: [test-461, task-801]
refs: [loop-7, dec-86, template://loops/test-ci-skill-infrastructure-audit]
context_refs: [root:dec-86, root:chk-426, root:chk-512, root:chk-531, root:chk-540, root:dec-85]
evidence_refs: []
aliases: []
skills: [pursue-mdkg-loop]
created: 2026-07-17
updated: 2026-07-17
---
# Research Question

What test, build, CI, smoke, skill-projection, public-seed, and harness surfaces
exist in the current mdkg repository; who owns each surface; and where do
coverage, parity, duplication, or guidance gaps create concrete user or
maintenance risk?

# Context And Constraints

`root:loop-7` is a local-only readonly audit. `root:dec-86` authorizes source
inspection, bounded Node 24 verification, mdkg evidence, and justified
follow-up nodes while prohibiting functional edits, skill synchronization,
external calls, and publication actions.

# Scope

- Root package, lock, TypeScript configuration, `src/`, `tests/`, and all npm
  scripts in `package.json`.
- `.github/workflows/release-readiness.yml` and every command it invokes.
- `scripts/`, including all current `smoke:*` aliases and their fixture,
  generated-output, runtime, and network behavior.
- docs and mdkg-dev package/build integration reached by root gates.
- `.mdkg/config.json`, skill registry, all canonical skills, configured
  `.agents`/`.claude` mirrors, public init skill seeds, and relevant skill tests.
- Startup, collaboration, contributing, CLI, agent-workflow, loop, and
  representative example harness guidance.

# Exclusions And Boundaries

- No provider, registry, advisory, or web calls.
- No implementation, skill sync, dependency installation, generated refresh,
  or tracked source change.
- Treat ignored outputs and dependencies as owned execution products, not as
  source-quality findings.
- Preserve intentional public-seed exclusions under `dec-85`.

# Options And Tradeoffs

- Local source plus current receipts is the selected evidence path. It is
  reproducible and authorized but cannot prove live provider state.
- Historical checkpoints may explain ownership and prior behavior, but using
  them as current proof would make the audit stale.
- Provider/API evidence could fill remote-only gaps, but remains unrequested
  and would need a separately bound approval.

# Search Plan

1. Enumerate package scripts, compiled test families, workspace commands, and
   current smoke aliases directly from source; record counts and ownership.
2. Expand `ci:release` and `prepublishOnly` into a command/gate matrix,
   including runtime, timeout, dependency, generated-write, and network policy.
3. Map each smoke alias to subsystem risk and its CI, prepublish, or manual-only
   coverage.
4. Inventory canonical skills, configured projections, public seeds, registry
   metadata, validation tests, and intentional projection differences.
5. Map harness instructions to their owning source and flag only contradictions
   or omissions with execution impact.
6. Record exact unknowns and lane-specific recovery options without stopping
   other inventory work.

# Required Artifacts

- `test-command-inventory.json`
- `ci-parity-matrix.json`
- `smoke-coverage-map.json`
- `skill-projection-inventory.json`
- `harness-guidance-map.md`

Each artifact must be compact, deterministic, source-linked, and free of raw
secrets, prompts, provider payloads, or bulky logs.

# Acceptance Criteria

- Every current package script, test family, workflow step, and smoke alias is
  inventoried and assigned an owner/surface.
- CI, local, and prepublish relationships are explicit; presence in
  `prepublishOnly` is not mislabeled as CI coverage.
- Canonical, configured-mirror, public-seed, repository-local-only, and
  generated-dist skill roles are distinguished.
- Harness findings are tied to concrete execution risk rather than style.
- All unresolved questions have a recorded blocker class and recovery path.
- No tracked functional path changes.

# Findings

- The root package exposes 65 scripts: 47 smoke aliases, five docs scripts,
  three test scripts, three CLI scripts, two build scripts, and five remaining
  lifecycle/CI/security entries. The 47 aliases resolve to 46 physical smoke
  programs because `smoke:bundle-import` delegates to `smoke:subgraph`.
- The test tree contains 90 executable test files and 676 source-defined runtime
  test identities across commands, core, graph, pack, util, and two root MJS
  release/security files. `test:coverage` reaches the 88 compiled TypeScript
  test files and 658 identities, but not the two root MJS files; it declares no
  threshold or durable artifact and is absent from CI and prepublish gates.
- The checked-in workflow runs one 30-minute Ubuntu job for Node `24.15.0` and
  `24.x`, with root `npm ci` followed by `npm run ci:release`. Local Node 24.16
  can exercise the floating row's command surface but cannot prove Ubuntu or
  exact-24.15 parity.
- `ci:release` has eight direct gates and only two smoke aliases.
  `prepublishOnly` has 53 direct gates and effectively covers all 47 smoke
  aliases, but recursive composition and `npm pack` lifecycle hooks expand to
  an estimated eight root builds in CI and 87 root builds plus 12 docs and 17
  mdkg-dev builds during prepublish.
- The full prepublish ladder is not clean-install self-contained. Root is not an
  npm workspace, so root `npm ci` does not install docs or mdkg-dev dependency
  trees; docs smokes assume dependencies already exist, while one mdkg-dev path
  conditionally invokes nested `npm ci` and can require registry/cache state.
- All eight canonical skill bodies are byte-identical in both configured
  `.agents` and `.claude` mirrors. Six public seeds exist; three are equal,
  `release-mdkg-package` is intentionally absent under `dec-85`,
  `service-boundary-ownership-check` is repository-local, and three public
  bodies diverge without a declared exact-versus-reviewed-snapshot contract.
- Existing init and publish guardrails assert membership and selected content,
  but cannot distinguish an accepted public snapshot from an accidentally
  stale projection.
- Harness guidance has two execution-impact gaps: the root and public active
  loop quickstarts omit deterministic `mdkg loop next` routing, and
  `CONTRIBUTING.md` says all index outputs should be ignored even though this
  repository intentionally tracks `.mdkg/index/mdkg.sqlite`.

# Recommendation

Proceed to the single-pass Node 24 verification child. Treat current dependency
trees as environmental evidence rather than proof of clean-install
reproducibility, force npm offline, record each command independently, and stop
only the affected lane if it creates a tracked non-mdkg change. The synthesis
child should prioritize clean-install/release-ladder determinism, build
amplification, coverage enforcement, public-seed currentness, smoke risk tiers,
and the two harness contradictions. Do not change any implementation surface in
this audit.

# Follow-Up Nodes To Create

Create only recovery nodes needed to unblock evidence collection. Residual
implementation tasks/tests belong to `task-801` after validation.

# Skill Candidates

- Consider teaching `pursue-mdkg-loop` or startup validation to assert that the
  active-loop quickstart includes `loop next`; do not edit the skill here.
- Public seed membership/currentness is a product contract and test gap, not a
  reason to run `mdkg skill sync` during this audit.

# Evidence And Sources

- `root:loop-7`
- `root:dec-86`
- Template: `template://loops/test-ci-skill-infrastructure-audit`
- `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/test-command-inventory.json`
- `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/ci-parity-matrix.json`
- `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/smoke-coverage-map.json`
- `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/skill-projection-inventory.json`
- `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/harness-guidance-map.md`
