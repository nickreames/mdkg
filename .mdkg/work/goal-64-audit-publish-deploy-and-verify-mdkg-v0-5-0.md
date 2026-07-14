---
id: goal-64
type: goal
title: Audit publish deploy and verify mdkg v0.5.0
status: progress
priority: 1
goal_state: active
goal_condition: mdkg v0.5.0 is released only after version and changelog finalization, complete local and security gates, one explicit bounded approval, a dormant first push with green CI, npm publication and registry proof, clean temporary and real global install verification, a second website activation push, production deployment and live browser validation, and a fix-forward release receipt with no Git tag by default.
scope_refs: [epic-232, epic-233, epic-234, epic-235, task-716, task-717, task-718, task-719, task-720, task-721, task-722, task-723, test-388, test-389, test-390, test-391, test-392, test-393, test-394]
active_node: task-722
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
required_checks: [git status --short --branch, git log --oneline origin/main..HEAD, git diff --name-status origin/main..HEAD, npm ci, npm run build, npm run test, npm run cli:check, npm run cli:contract, npm run docs:check, npm run smoke:loop, npm --prefix mdkg-dev run build, npm --prefix docs run build, npm run smoke:mdkg-dev, npm run smoke:mdkg-dev-docs, npm run smoke:mdkg-dev-seo, node scripts/assert-publish-ready.js, node scripts/verify-security-remediation.js, node dist/cli.js validate --json, node dist/cli.js validate --changed-only --json, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/, npm view mdkg version --registry=https://registry.npmjs.org/, npm view mdkg@0.5.0 version --registry=https://registry.npmjs.org/, manual source-backed security requalification under dec-81, required plugin skill product-design:audit, required plugin skill browser:control-in-app-browser, required plugin skill chrome:control-chrome, explicit single release approval, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [release, npm, publish, deploy, verification, 0.5.0]
owners: []
links: []
artifacts: []
relates: [goal-61, goal-62, goal-63, goal-69, dec-81]
blocked_by: []
blocks: []
refs: [goal-61, chk-426, goal-62, goal-63, chk-491, dec-73, dec-74, prop-8, goal-42, goal-50, goal-69, edd-75, dec-80, dec-81, chk-497]
context_refs: [goal-61, chk-426, goal-62, goal-63, chk-489, chk-490, chk-491, edd-70, dec-67, edd-71, dec-68, dec-73, dec-74, prd-11, prop-8, edd-72, dec-69, goal-42, goal-50, goal-69, edd-75, dec-80, dec-81, chk-497, chk-509, chk-510, test-434]
evidence_refs: [chk-491, chk-496, chk-497, chk-509, chk-510, chk-511, chk-512, chk-513, chk-514, chk-515]
aliases: [v0-5-0-publish-and-production-verification]
skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-10
updated: 2026-07-13
---
# Objective

Finalize, publish, and independently verify `mdkg@0.5.0`, then activate and
validate its public website and documentation release experience.

# End Condition

The goal closes only when npm `latest` and package integrity prove `0.5.0`, a
fresh temporary install and the real `/opt/homebrew` global install pass loop
and compatibility probes, mdkg.dev and docs.mdkg.dev are production-current,
and the final receipt records all side effects, evidence, and residual risks.

# Non-Goals

- Do not start before `goal-61` and `goal-63` are achieved.
- Do not publish, push, globally install, or deploy before one explicit bounded
  release approval is recorded.
- Do not create or push a Git tag unless a later explicit request changes
  `dec-69`.
- Do not roll back or unpublish a released npm version; fix forward.
- Do not run another Codex Security scan for v0.5.0. `dec-81`, `chk-511`, and
  `chk-512` are the accepted security requalification evidence for this release.

# Recursive Algorithm

1. Finalize `0.5.0` package versions, lockfile, changelog, release notes, and
   source-backed public references while website activation remains dormant.
2. Run every local package, graph, docs, website, tarball, upgrade, and browser
   preflight; prepare clean release commits.
3. Stop for one approval covering security/advisory network checks, first push,
   npm publish, global replacement, second push, and production deployment.
4. Run auth, registry-absence, advisory, and repository security gates.
5. Push the dormant release commit, require green CI, publish npm, and verify
   registry metadata and integrity.
6. Validate a fresh install, a `0.4.2` upgrade, and the real global install,
   including dry-run followed by real fork without ID consumption.
7. Activate the website release flag, push the second commit, verify production,
   and run live desktop/mobile accessibility, SEO, content, and no-secret checks.
8. Record a fix-forward receipt and evaluate the goal.

# Required Skills

- Local planning, ownership, pack, and release verification skills in frontmatter.
- Manual source-backed security requalification is complete under `dec-81` and
  must be consumed as accepted evidence; do not run another Codex Security scan.
- Product Design, Browser, and Chrome plugin verification remains required only
  for the live website lanes where specified by the scoped tasks.

# Required Checks

- Complete local prepublish and website preview gates before approval.
- Registry/auth/security/advisory evidence before first mutation.
- Origin commit and green CI evidence before npm publication.
- Registry, integrity, temporary install, upgrade, and real global install proof.
- Two-phase dormant/active website push and live production proof.

# Acceptance Criteria

- `task-716` through `task-723` and `test-388` through `test-394` close with
  evidence.
- `goal-69` and `test-434` close before `test-389` or `task-719` can proceed.
- Goal 4 alone owns the version bump and finalized changelog.
- One approval receipt enumerates every authorized external mutation.
- Npm publication precedes public release activation.
- No Git tag is created by default.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- Either prerequisite goal is incomplete.
- Local preflight, security, registry, CI, or auth evidence fails.
- Approval is absent or narrower than the requested mutation sequence.
- Before the authorized publication step, `mdkg@0.5.0` exists unexpectedly or
  does not match the candidate. After `chk-513`, registry existence is expected
  and must be verified rather than treated as a blocker.

# Current State

Active and unblocked at `task-722`. The dormant release commit
`7afbf6d8df58279f70c6257b65437791fec59e63` passed CI and was published once as
`mdkg@0.5.0`; `chk-513` records registry SHA-1, integrity, `latest`, approval,
and no-tag evidence. `chk-514` proves the registry-fetched package, fresh init,
SQLite, loop commands, non-consuming dry-run, packaged assets, idempotent
`0.4.2` upgrade, canonical MANIFEST migration, and legacy SPEC compatibility.
`chk-515` proves the real `/opt/homebrew` installation now resolves to registry
`0.5.0` and passes the complete loop command and non-consuming dry-run probe.
No additional Codex Security scan is required. Activation commit
`b337ff8d69664908ddf0690a7878cba0ec145a6d` is on `origin/main`, and the shared
release manifest is now `published`. The activation CI run exposed one stale
draft-state assertion in `tests/public-release.test.mjs`; its local fix is an
existing non-mdkg worktree change and is intentionally preserved for the next
execution pass. That pass starts by reviewing the diff, running the complete
release CI gate, committing and pushing the fix forward under `chk-496` and
`dec-69`, then proving the exact origin SHA and both production deployments
before closing `test-393`. `task-723` remains correctly sequenced after that
proof for the final live browser audit and release receipt.

# Iteration Log

- 2026-07-10: Created as the final gated lane of the v0.5.0 release program.
- 2026-07-10: Removed achieved `goal-61` from unresolved blockers; `goal-63`
  remains the sole prerequisite blocker.
- 2026-07-11: Goal 63 achieved with dormant handoff `chk-491`; cleared the final
  prerequisite while keeping Goal 64 paused for explicit release activation.
- 2026-07-12: Completed the security audit execution as a failed-closed gate,
  transferred 51 findings to `goal-69`, and paused release mutation until a clean
  immutable-revision rescan requalifies `task-719`.
- 2026-07-12: Operator selected manual source-backed requalification in `dec-81`
  instead of a second plugin scan; release remains paused until Goal 69 records
  exact closure and Goal 64 routing is revalidated.
- 2026-07-12: Goal 69 achieved, manual requalification and release approval
  evidence passed, `chk-512` completed the handoff, and Goal 64 was confirmed
  active and unblocked at `task-719`.
- 2026-07-13: Dormant commit `7afbf6d8` passed CI and published as
  `mdkg@0.5.0`; `chk-513` records immutable registry evidence. Goal 64 now routes
  unblocked to `task-720`, with later lanes intentionally sequenced.
- 2026-07-13: Registry consumer and `0.4.2` upgrade verification passed under
  `test-391` and `chk-514`; Goal 64 now routes to global-install proof in
  `task-721`.
- 2026-07-13: The real `/opt/homebrew` global installation and `test-392` passed;
  `chk-515` records absolute-path and dry-run ID evidence. Goal 64 now routes to
  website activation in `task-722`.
- 2026-07-13: Activation commit `b337ff8d` reached `origin/main` and the release
  manifest is published. A stale draft-state release test is the only known CI
  repair in the active lane; Goal 64 remains unblocked at `task-722`, with no
  additional security scan or approval cycle required for the accepted
  fix-forward sequence.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
