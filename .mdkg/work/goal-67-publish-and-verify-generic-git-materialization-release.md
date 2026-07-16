---
id: goal-67
type: goal
title: publish and verify mdkg v0.5.2 generic Git materialization release
status: progress
priority: 1
goal_state: active
goal_condition: mdkg v0.5.2 is complete only after goal-66 supplies a clean locally publish-ready implementation, version changelog generated contract and docs release metadata agree, all final gates pass, the pre-approved npm publication succeeds, registry integrity and temporary global and real-root upgrade behavior are verified, the exact published commit is pushed without force to origin main, post-push CI and Vercel production health pass, docs.mdkg.dev exposes current materialization documentation, mdkg.dev receives no authored source changes, and the final receipt confirms fix-forward and no-tag state.
scope_refs: [task-753, task-754, test-416, test-417, task-755, task-756, task-789, test-418, task-790, test-451, task-757, test-419]
active_node: test-417
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
required_checks: [goal-66 achieved with publish-readiness checkpoint, git status --short --branch, git fetch origin main, git rev-list --left-right --count origin/main...HEAD, npm ci, npm run prepublishOnly, npm run security:verify, npm run cli:check, npm run cli:contract, npm run docs:check, node scripts/assert-publish-ready.js, node dist/cli.js validate --json, node dist/cli.js validate --changed-only --json, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/, npm view mdkg version --registry=https://registry.npmjs.org/, npm view mdkg@0.5.2 version --registry=https://registry.npmjs.org/, npm whoami through temporary npmrc, npm postpublish registry dist-tag shasum integrity and time proof, isolated temporary install of mdkg@0.5.2, real global mdkg@0.5.2 install, real-root upgrade preview safe apply index status skill validation graph validation doctor and diff proof, non-force git push origin main after npm verification, post-push GitHub CI, Vercel deployment SHA and READY proof, docs.mdkg.dev HTTP content link SEO robots and sitemap proof, basic mdkg.dev deployment health only, no Browser or Chrome, no Git tag, git diff --check]
max_iterations: 30
blocked_after_attempts: 3
tags: [git, materialization, release, npm, verification, 0.5.2, docs]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [goal-66]
blocks: []
refs: [edd-73, dec-75, dec-76, dec-77, dec-78, goal-66]
context_refs: [goal-66, goal-71, edd-73, dec-69, dec-75, dec-76, dec-77, dec-78, bug-2, test-452, bug-3, test-453, task-791, test-454]
evidence_refs: [chk-530, chk-531, chk-532]
aliases: [generic-git-materialization-release, mdkg-v0-5-2-release]
skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-11
updated: 2026-07-15
---

# Objective

Finalize, publish, install, upgrade, push, and independently verify
`mdkg@0.5.2` after `goal-66` proves the local generic materialization release
candidate.

# End Condition

Npm metadata and integrity identify `0.5.2`; temporary and real global installs
pass materialize/clone/init/loop/pack/upgrade probes; the real root graph is
safely upgraded and validated; the exact published commit is on `origin/main`;
CI and Vercel are healthy; docs.mdkg.dev is current; and the final checkpoint
records every approved side effect and no-tag/fix-forward state.

# Approved Release Boundary

The operator pre-approved these actions after all gates pass:

- publish `mdkg@0.5.2` to npm;
- install it in an isolated prefix and replace the real global mdkg install;
- preview and apply the real-root managed upgrade only when `safe_to_apply` is
  true and no blocking conflicts exist;
- push the exact published commit and final closeout commit directly to
  `origin/main` without force;
- allow the resulting Vercel deployments and verify them through provider,
  CI, HTTP, and repository smoke evidence.

No additional approval prompt is required for those bounded actions. This does
not authorize tags, force pushes, PRs, Browser/Chrome use, npm unpublish,
rollback, unrelated provider mutation, or authored mdkg-dev changes.

# Recursive Algorithm

1. Wait for achieved `goal-66` and consume its immutable readiness checkpoint.
2. In `task-753`, move `Unreleased` materialization notes into `0.5.2`, bump
   package/lock and source-visible version metadata, refresh generated release
   data and docs changelog, set the release manifest to published `0.5.2`, and
   create one local release commit on `main`.
3. In `task-754`, replay final version-specific local, security, pack, and
   publish dry-run gates; close `test-416` and `test-417`.
4. In `task-755`, verify the recorded approval, remote freshness, npm auth,
   latest `0.5.1`, and expected `0.5.2` absence immediately before mutation.
5. In `task-756`, publish npm and verify registry metadata and artifact
   integrity before any push.
6. In `task-789`, validate a clean temporary install, replace the real global
   install, preview/apply the safe root upgrade, and close `test-418`.
7. In `task-790`, push the exact published commit to `origin/main`, verify CI
   and Vercel, validate docs.mdkg.dev without Browser/Chrome, and close
   `test-451`.
8. In `task-757`, record the downstream handoff and final checkpoint; close
   `test-419`, push the closeout commit, and evaluate the goal.

# Release Ordering

- Work directly on local `main`; create no branch or PR.
- Publish npm before the first release push so production documentation cannot
  claim an unpublished version.
- Local exhaustive gates are the prepublish authority. GitHub CI is mandatory
  post-publish confirmation because the main-only sequence cannot provide
  remote exact-SHA CI without deploying production early.
- If remote drift appears before publish, stop, reconcile, and rerun all gates.
  If it appears after publish, preserve the published commit and reconcile only
  with a normal fix-forward commit; never force-push or rewrite history.
- After publication, never unpublish or roll back. Package-affecting failures
  require a new fix-forward release lane.

# Documentation Boundary

- Goal-66 owns the materialization guide and command/reference/safety docs.
- Goal-67 owns the `0.5.2` changelog card/detail, generated release notes, and
  shared published release metadata.
- Do not edit mdkg-dev source or copy. Its automatic deployment and
  package-derived version metadata change are accepted; validate basic health
  only.
- Verify docs.mdkg.dev through CI, Vercel deployment state, HTTP, link, SEO,
  robots, sitemap, and existing smoke checks. Do not use Browser or Chrome.

# Definition Of Done

- Every scoped task and test is done with mutually consistent evidence.
- npm, installs, root upgrade, origin, CI, Vercel, docs, no-tag, and
  fix-forward evidence are recorded in one final checkpoint.
- The downstream handoff names only generic command/schema/receipt capability
  and compatibility facts.

# Stop Conditions

- Stop before publication on any implementation, security, naming, auth,
  registry, package, docs, validation, or remote-freshness failure.
- The failed partial scan in `chk-530` is historical discovery evidence, not a
  clean audit and not a release gate. Do not enter `task-753` until Goal 66
  closes both validated candidate families, fixes generated command-contract
  parity, passes its local security/prepublish contract, and records the release
  handoff.
- After publication, keep the goal open and fix forward if registry, install,
  root upgrade, push, CI, deployment, or docs evidence fails.

# Current State

Paused pending Goal-67 execution. Goal 66 is achieved with implementation
commit `f657a1b3e82388050aeeef39a188d4eaca0a2bf9` and handoff `chk-532`.
The two candidate families and command-contract fidelity gap recorded by
`chk-530` are remediated, and Goal 66's local
security, prepublish, pack, publish-dry-run, and installed-consumer ladder
passes. Codex Security is explicitly out of scope after its runtime failed.
The handoff recommendation is `ready for goal-67 v0.5.2 release execution`.
Target version remains fixed at `0.5.2`;
publication and approved post-publish mutations remain gated until this goal is
activated and its ordered checks pass. First release node remains `task-753`.

# Completion Evidence

- Pending `goal-66` handoff and release execution.
