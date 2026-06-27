---
id: goal-42
type: goal
title: Complete mdkg 0.4.0 public docs launch and release notes surface
status: todo
priority: 2
goal_state: paused
goal_condition: 0.4.0 is ready for explicit npm publish and public launch approval decisions after mdkg.dev and docs.mdkg.dev expose a polished public launch surface, release notes/changelog pages with per-release cards and details, validated public examples, browser/SEO/accessibility/no-secret proof, article announcement support, full change audit, full pre-publish gates, npm pack/publish dry-run, and a final recommendation that states publish/launch-ready or lists remaining gaps.
scope_refs: [epic-202, epic-203, epic-204, spike-22, task-601, task-602, task-603, task-604, task-605, task-606, test-307, test-308, test-309, test-310, test-311, test-312]
active_node: spike-22
required_skills: [select-work-and-ground-context, build-pack-and-execute-task, verify-close-and-checkpoint]
required_checks: [git status --short --branch, git log --oneline origin/main..HEAD, git diff --name-status origin/main..HEAD, changelog and release notes mapping for every publish-bound change, visible version-reference drift audit, npm view mdkg version --registry=https://registry.npmjs.org/, npm view mdkg@0.4.0 version --registry=https://registry.npmjs.org/, node dist/cli.js index, node dist/cli.js validate --json, npm --prefix mdkg-dev run build, npm --prefix docs run build, npm run build, npm run test, npm run cli:check, npm run cli:contract, npm run docs:check, node scripts/assert-publish-ready.js, npm run smoke:mdkg-dev, npm run smoke:mdkg-dev-docs, npm run smoke:mdkg-dev-seo, npm run smoke:demo-graph, Browser desktop/mobile E2E receipts for mdkg.dev and docs.mdkg.dev, no-secret public content audit, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/, publish and launch readiness recommendation or remaining-gaps report, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [release, 0.4.0, mdkg-dev, docs, release-notes, launch]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-26
updated: 2026-06-26
---
# Objective

Consolidate public launch work into one `0.4.0` lane for mdkg.dev and
docs.mdkg.dev. This goal replaces the stale broad launch lane (`goal-21`) while
preserving its useful docs, SEO, trust, and public-example context.

# End Condition

`0.4.0` is ready for explicit npm publish and public launch approval decisions
when:

- release notes and `CHANGELOG.md` content are available as a public docs or
  site page with per-release cards and detailed entries;
- mdkg.dev explains config overlays, arbitrary skill mirrors, `COLLABORATION.md`,
  and the Plan -> Work -> Evidence model using the finalized `0.3.9` facts;
- docs.mdkg.dev onboarding, command references, upgrade guides, and public
  examples validate against the current CLI;
- browser, SEO, accessibility, and no-secret checks pass for the launch surface;
- article announcement support is ready for the June 28, 2026 release post;
- the final audit maps every publish-bound change to release notes/changelog,
  version references, tests, docs/site changes, package payload, and browser
  proof;
- npm pack and publish dry-run pass, and the final checkpoint recommends either
  "publish/launch ready pending explicit approval" or lists exact remaining
  gaps.

# Non-Goals

- Do not implement CLI kernel/config behavior here; `goal-41` owns that.
- Do not run real `npm publish`, tag git, push, deploy, change DNS, or activate
  analytics unless a later request explicitly approves that side effect.
- Do not invent claims that are not backed by current source, CLI behavior,
  changelog entries, examples, or mdkg evidence.

# Recursive Algorithm

1. Start with `spike-22` to map release notes IA, docs IA, and article support.
2. Build the release notes/changelog surface before final launch polish.
3. Update mdkg.dev and docs.mdkg.dev with only source-backed `0.3.9` facts.
4. Validate public examples and deterministic demo proof against the latest CLI.
5. Close with browser, SEO, accessibility, no-secret, and article-readiness
   evidence.

# Required Skills

- `select-work-and-ground-context`
- `build-pack-and-execute-task`
- `verify-close-and-checkpoint`

# Required Checks

- Local mdkg graph validation.
- Marketing and docs builds.
- Docs check and mdkg.dev smoke suite.
- Browser desktop/mobile receipts for public launch pages.
- No-secret public content audit.
- Full package pre-publish gates, registry checks, pack dry-run, and publish
  dry-run before any publish-ready recommendation.

# Acceptance Criteria

- `node dist/cli.js goal next goal-42 --json` selects `spike-22` first.
- The release notes page is derived from or reconciled with `CHANGELOG.md`.
- Public copy reflects config overlays as the primary customization path and
  avoids presenting forked starter repos as the default enterprise path.
- Launch pages document the `COLLABORATION.md` bridge and MANIFEST/SPEC
  compatibility accurately.
- Final validation records public examples, SEO, accessibility, browser, and
  no-secret evidence.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence in a checkpoint.
- Public deploy/publish/tag/push boundaries are either explicitly approved or
  recorded as not performed.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.

# Current State

- Created by the graph-only 0.3.9/0.4.0 consolidation pass.
- Paused and unclaimed; first actionable node is `spike-22`.
- Depends on stable `0.3.9` CLI facts from `goal-41` before final launch proof,
  but docs/content planning may begin immediately.

# Context Refs

- `goal-41`
- `goal-21`
- `edd-57`
- `dec-51`
- `dec-52`
- `dec-53`
- `chk-282`
- `chk-283`

# Iteration Log

- 2026-06-26: Seeded from source-grounded analysis after `mdkg@0.3.8` publish
  validation (`chk-282`).

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
