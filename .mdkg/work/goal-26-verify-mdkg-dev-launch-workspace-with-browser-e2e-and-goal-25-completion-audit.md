---
id: goal-26
type: goal
title: Verify mdkg.dev launch workspace with Browser E2E and goal-25 completion audit
status: blocked
priority: 1
goal_state: paused
goal_condition: The goal is complete when goal-25 has been independently re-audited as achieved, mdkg-dev has passed local Browser desktop/mobile E2E with selected screenshot and receipt evidence archived, any local defects found by E2E are fixed or explicitly deferred with evidence, full pre-release gates pass through npm publish dry-run, and no public publish, deploy, tag, push, global install, DNS, Vercel production promotion, GitBook production sync, or public launch occurs.
scope_refs: [epic-127, epic-128, epic-129, epic-130, task-456, task-457, task-458, task-459, task-460, task-461, task-462, test-207, test-208, test-209, test-210, test-211]
active_node: task-462
required_skills: [select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [git status --short --branch, node dist/cli.js index, node dist/cli.js validate --summary --json --limit 20, node dist/cli.js doctor --strict --json, node dist/cli.js goal show goal-25 --json, node dist/cli.js goal next goal-25 --json, npm --prefix mdkg-dev run build, Browser E2E receipt with desktop/mobile screenshots archived, npm run smoke:mdkg-dev, npm run smoke:mdkg-dev-docs, npm run smoke:mdkg-dev-seo, npm run smoke:demo-graph, npm run build, npm run test, npm run cli:check, npm run cli:contract, npm run prepublishOnly, node scripts/assert-publish-ready.js, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json, NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [mdkg-dev, browser-e2e, goal-verification, launch-readiness]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: [chk-194, prd-4, prd-5, edd-24, edd-25, edd-26, edd-27, edd-28, edd-29, edd-30, dec-30, dec-31, dec-32]
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-06-22
updated: 2026-06-22
---
# Objective

Independently verify the completed goal-25 mdkg.dev launch workspace with current graph evidence and real local Browser E2E. This goal is audit plus fix: local mdkg.dev defects discovered during Browser testing may be fixed inside the mdkg repo, but public launch, deploy, publish, tag, push, global install, DNS, Vercel production promotion, and GitBook production sync stay out of scope.

# End Condition

This goal is achieved when:

- goal-25 is proven `done` / `achieved` with `last_active_node: task-454`.
- `goal next goal-25 --json` returns `node: null` with no warnings.
- No selected current goal remains except transient selection of goal-26 while it is being worked.
- Required goal-25 implementation nodes and checkpoints exist and are coherent.
- mdkg-dev builds locally and passes Browser E2E at desktop and mobile viewport sizes.
- Browser evidence covers routes, navigation, metadata, LLM docs, no-secret posture, and demo graph discoverability.
- Selected screenshots and an E2E receipt are archived as mdkg evidence after review for raw secret-like content.
- Full local release gates pass through `npm publish --dry-run`.
- The final closeout explicitly confirms no publish, deploy, tag, push, global install, DNS change, Vercel production promotion, GitBook production sync, or public launch occurred.

# Non-Goals

- No real npm publish, deploy, DNS change, Vercel production promotion, GitBook production sync, tag, push, global install, or public launch.
- No external child-repo mutation.
- No Browser navigation that clicks external links or transmits data.
- No launch-claim expansion beyond the current public-alpha boundaries.
- No broad refactor outside defects proven by local Browser E2E.

# Execution Plan

1. Align scope and current dirty-tree boundaries in `task-456`.
2. Re-index and audit goal-25 completion, selected-goal state, checkpoint coverage, doctor state, and subgraph freshness in `task-457`.
3. Build mdkg-dev, run local Browser E2E at `1440x900` and `390x844`, and capture screenshot evidence in `task-458`.
4. Verify route inventory, metadata, LLM docs, sitemap/robots, no-secret posture, and demo graph discoverability in `task-459`.
5. Fix local mdkg.dev defects found by E2E in `task-460`, or mark it done with explicit no-defect evidence.
6. Archive selected Browser screenshots and receipt evidence in `task-461`.
7. Run the full release gate chain through dry-run pack/publish and close the goal in `task-462`.

# Required Browser Route Inventory

- `/`
- `/quickstart/`
- `/trust/`
- `/alpha/`
- `/docs/`
- `/llms.txt`
- `/llms-full.txt`
- `/robots.txt`
- `/sitemap.xml`

# Context Inventory

Goal-level `context_refs` intentionally excludes completed/paused goal records because the current goal traversal command warns when non-actionable goals appear there. Historical and roadmap goal context remains linked through `relates` and this inventory:

- goal-25
- goal-21
- chk-194
- prd-4
- prd-5
- edd-24
- edd-25
- edd-26
- edd-27
- edd-28
- edd-29
- edd-30
- dec-30
- dec-31
- dec-32

# Browser E2E Assertions

- No page-level console errors.
- No broken local route navigation.
- Visible headings and page-specific content render on every route.
- HTML is crawlable without client-only blank states.
- Header, nav, and footer links are functional for local routes.
- Canonical, Open Graph, Twitter, and JSON-LD metadata are present where expected.
- Sitemap has no preview-only URLs.
- Pages and artifacts do not expose raw secret, prompt, token, credential, or payload markers.
- Desktop and mobile layouts have no incoherent overlap, obvious text overflow, or unreadable code blocks.
- First viewport makes the mdkg product/brand signal clear.

# Checkpoint Requirements

Goal-26 cannot close unless checkpoints exist for:

- Baseline goal-25 audit after `task-457`.
- Browser E2E after `task-458` and `test-208`.
- Route/metadata/no-secret proof after `task-459`.
- Remediation proof if defects are fixed; otherwise a no-defect/no-op remediation note.
- Final closeout after `task-462`.

Each checkpoint must record commands run, pass/fail state, route/docs inventory where relevant, known warnings, archived evidence refs, stop-condition confirmation, and follow-up refs.

# Required Checks

- `git status --short --branch`
- `node dist/cli.js index`
- `node dist/cli.js validate --summary --json --limit 20`
- `node dist/cli.js doctor --strict --json`
- `node dist/cli.js goal show goal-25 --json`
- `node dist/cli.js goal next goal-25 --json`
- `npm --prefix mdkg-dev run build`
- Browser E2E receipt with desktop/mobile screenshots archived
- `npm run smoke:mdkg-dev`
- `npm run smoke:mdkg-dev-docs`
- `npm run smoke:mdkg-dev-seo`
- `npm run smoke:demo-graph`
- `npm run build`
- `npm run test`
- `npm run cli:check`
- `npm run cli:contract`
- `npm run prepublishOnly`
- `node scripts/assert-publish-ready.js`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
- `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run`
- `git diff --check`

# Acceptance Criteria

- `goal-25` is objectively complete and not hiding actionable scoped work.
- mdkg-dev local preview behaves correctly in desktop and mobile Browser E2E.
- Screenshot and receipt evidence is archived after raw-marker review.
- Any Browser-discovered local defect is fixed in the mdkg repo and re-tested.
- Required launch-boundary and no-public-side-effect constraints are preserved.

# Stop Conditions

- A required action would publish, deploy, change DNS, promote Vercel production, sync GitBook production, tag, push, globally install, or mutate an external child repo.
- Browser testing requires submitting data, authenticating externally, accepting permissions, or clicking external destinations.
- A Browser-discovered issue requires scope beyond local mdkg-dev/source/docs/example fixes.
- A required gate fails and cannot be corrected without violating this goal's boundaries.

# Current State

Created as the active verification goal after goal-25 implementation. The tree is expected to be dirty with uncommitted goal-25 implementation and mdkg-dev source changes. `active_node` starts at `task-456`.

Paused on 2026-06-22 when `goal-27` became the active Vercel/Starlight preview-hosting alignment lane. Local Browser E2E and evidence archiving were completed; the remaining gate was the already-published package-version dry-run condition recorded in `chk-200`.

# Iteration Log

- 2026-06-22: Created goal-26 as an independent Browser E2E and goal-25 completion audit lane.
- 2026-06-22: Paused after local evidence was accepted so hosting planning could proceed under `goal-27` without violating the one-active-goal invariant.

# Skill Improvement Candidates

- Consider a future mdkg skill for Browser-backed local site launch proof once this goal's evidence pattern is stable.

# Completion Evidence

- Pending.
