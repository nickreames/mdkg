---
id: goal-64
type: goal
title: Audit publish deploy and verify mdkg v0.5.0
status: progress
priority: 1
goal_state: active
goal_condition: mdkg v0.5.0 is released only after version and changelog finalization, complete local and security gates, one explicit bounded approval, a dormant first push with green CI, npm publication and registry proof, clean temporary and real global install verification, a second website activation push, production deployment and live browser validation, and a fix-forward release receipt with no Git tag by default.
scope_refs: [epic-232, epic-233, epic-234, epic-235, task-716, task-717, task-718, task-719, task-720, task-721, task-722, task-723, test-388, test-389, test-390, test-391, test-392, test-393, test-394]
active_node: task-719
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
evidence_refs: [chk-491, chk-497, chk-509, chk-510, chk-511, chk-512]
aliases: [v0-5-0-publish-and-production-verification]
skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-10
updated: 2026-07-12
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
- Repository security scanning plus Product Design, Browser, and Chrome plugin
  verification where specified by the scoped tasks.

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
- `mdkg@0.5.0` already exists unexpectedly; stop and re-plan the version.

# Current State

Active at `task-719`. Goal 69 fixed and directly tested all 51 original
findings, `test-434` passed under the accepted manual requalification decision
`dec-81`, and `test-389` revalidated the bounded release approval and no-tag
policy. Checkpoint `chk-512` is the completed security closeout handoff. Goal 64
and `task-719` have no unresolved blockers; the next execution pass should claim
`task-719`, prepare one immutable dormant release commit, require green CI, and
then publish the identical package. No additional Codex Security scan is
required for v0.5.0. No push, publish, global install, activation, deployment,
or tag occurred during remediation.

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

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
