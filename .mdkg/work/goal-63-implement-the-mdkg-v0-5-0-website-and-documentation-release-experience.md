---
id: goal-63
type: goal
title: Implement the mdkg v0.5.0 website and documentation release experience
status: progress
priority: 1
goal_state: active
goal_condition: The accepted v0.5.0 release experience is implemented locally with exact content design accessibility SEO responsive and browser evidence from goal-62 while release promotion remains dormant and no push or production deployment occurs.
scope_refs: [epic-236, epic-237, epic-238, epic-239, epic-240, task-730, task-731, task-732, task-733, task-734, task-735, task-736, task-737, task-738, task-739, task-740, task-741, task-742, test-401, test-402, test-403, test-404, test-405, test-406, test-407]
active_node: task-742
required_skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
required_checks: [git status --short --branch, npm run build, npm run test, npm run cli:check, npm run cli:contract, npm run docs:check, npm run smoke:mdkg-dev, npm run smoke:mdkg-dev-docs, npm run smoke:mdkg-dev-seo, npm run smoke:mdkg-dev-a11y, node dist/cli.js validate --changed-only --json, node dist/cli.js validate --summary --json --limit 20, node dist/cli.js goal show goal-63 --json, node dist/cli.js goal next goal-63 --json, node dist/cli.js pack task-730 --profile concise --dry-run --stats, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [release, implementation, mdkg-dev, docs, 0.5.0]
owners: []
links: []
artifacts: [.mdkg/artifacts/goal-62/announcement-directions/01-process-rail.png, .mdkg/artifacts/goal-62/product-design-audit-2026-07-10]
relates: [goal-61, goal-62, goal-64]
blocked_by: []
blocks: [goal-64]
refs: [goal-61, goal-62, chk-440, goal-64, edd-71, dec-68, dec-73, dec-74, prd-11, prop-7, prop-8, test-387, chk-439]
context_refs: [goal-61, goal-62, goal-64, edd-70, edd-71, dec-67, dec-68, dec-73, dec-74, prd-11, prop-7, prop-8, task-710, task-711, task-712, task-713, task-714, task-715, test-387]
evidence_refs: [chk-439, chk-440]
aliases: [v0-5-0-release-experience-implementation]
skills: [select-work-and-ground-context, service-boundary-ownership-check, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-10
updated: 2026-07-11
---
# Objective

Implement the accepted v0.5.0 loop release experience locally across mdkg.dev
and docs.mdkg.dev: one strict dormant release-state contract, the selected
Process Rail announcement, first-class Loops documentation, a purpose-built
security walkthrough, truthful upgrade/release facts, and complete browser and
accessibility proof.

# End Condition

All scoped tasks and `test-401` through `test-407` are complete; both Astro sites
pass draft and active-preview verification; exact accepted copy, routes, CLI
examples, responsive/accessibility behavior, SEO/indexing gates, and no-secret
checks have evidence; package version remains 0.4.2; the shared manifest remains
byte-for-byte `draft`; a scoped local commit leaves a clean worktree; and Goal 64
receives the dormant implementation without any push, deployment, publication,
global install, or production activation.

# Non-Goals

- Do not push, deploy, publish, activate the release flag, change DNS, or enable
  analytics.
- Do not bump package/lockfile versions to 0.5.0 or finalize public availability
  language; Goal 64 owns those mutations.
- Do not create or push a Git tag.
- Do not redesign the homepage hero, generic quickstart, marketing navigation,
  docs sidebar generally, or the broader brand system.
- Do not add a dedicated release marketing page, runtime execution capability,
  CocoIndex work, semantic search, or generic CLI redesign.
- Do not copy internal dogfood output or unsupported commands into public docs.

# Recursive Algorithm

1. Start with `task-730`: add the strict shared draft/published release manifest
   and projection, then gate both sites before adding release content.
2. Implement the accepted Process Rail after quickstart and prove its responsive,
   semantic, contrast, keyboard, focus, zoom, and overflow behavior.
3. Add the conditional top-level Loops documentation group, lifecycle pages, and
   purpose-built read-only security walkthrough using generated CLI truth.
4. Update existing install/upgrade and release-fact surfaces while package and
   public availability truth remain 0.4.2/dormant.
5. Run four-mode build and leak-prevention smoke, then desktop/mobile browser,
   accessibility, theme, reflow, and link verification.
6. Continue fixing in-scope failures until every required test passes. Record
   unrelated audit follow-ups separately rather than widening this release.
7. Review and commit the dormant local implementation, leave a clean worktree,
   create the closeout checkpoint, and return control to Goal 64.

# Required Skills

- Local planning, ownership, deterministic pack, and verification skills in
  frontmatter.
- Product Design Image-to-Code/design QA against the selected Process Rail
  artifact for the announcement implementation.
- In-app Browser for local desktop/mobile and interaction verification.

# Required Checks

- Run every command in `required_checks` and attach results to task/test
  checkpoints; these are report-only instructions, not mdkg-executed checks.
- Build marketing and docs in canonical draft plus local active-preview modes.
- Record manifest hashes, forbidden-content scans, generated-doc parity, and
  browser/accessibility evidence.

# Acceptance Criteria

- `task-730` through `task-742` and `test-401` through `test-407` close with
  evidence.
- `release/public-release.json` implements the exact `prop-8` schema and remains
  committed as `draft`; local preview never mutates it and production overrides
  fail closed.
- Draft builds expose no loop announcement, Loops navigation/routes/content,
  metadata, sitemap, Pagefind, LLM text, or premature v0.5.0 claims.
- Active preview renders the exact Process Rail copy and four Loops routes while
  remaining noindex/nofollow and not claiming npm availability.
- The security walkthrough uses supported list/show/fork/plan/pack/next/runs
  syntax, placeholders, typed question refs, and explicit read-only, approval,
  routing, and runtime boundaries.
- WCAG AA, keyboard/focus, 320px reflow, 200% zoom, reduced motion, forced
  colors, Starlight themes, links, and no-secret checks pass.
- Root package version remains 0.4.2 and no release side effect occurs.
- A scoped local implementation commit and clean worktree are recorded for Goal
  64; no remote mutation occurs.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- `goal-62` is incomplete or accepted `dec-74` is superseded without a
  replacement contract.
- Shared state cannot fail closed, draft output leaks release content, or package
  metadata would claim 0.5.0 before Goal 64.
- Exact CLI examples cannot be reconciled with generated descriptors/reference.
- Browser/accessibility evidence cannot satisfy audit blockers B1 through B5.
- Work would push, deploy, publish, tag, globally install, activate production,
  or widen into deferred audit findings F1 through F4.

# Current State

Fully seeded by achieved Goal 62 with five epics, thirteen implementation tasks,
and seven acceptance tests. `test-387`, `chk-439`, and `chk-440` prove the
handoff. The prerequisite blocker is cleared; Goal 63 is active and has claimed
`task-730` as the first implementation node. No Goal 63 functional work has
started yet.

# Iteration Log

- 2026-07-10: Created empty so the collaborative design goal can seed it rather
  than allowing premature website implementation.
- 2026-07-11: Process Rail plus the explicit mdkg/harness runtime boundary was
  accepted in `dec-74`; `task-715` populated all implementation and proof lanes.
- 2026-07-11: Goal 62 achieved with `chk-440`; cleared the prerequisite and made
  Goal 63 ready for explicit activation at `task-730`.
- 2026-07-11: Activated Goal 63 and claimed `task-730`; implementation remains
  untouched until the next execution pass.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Planning handoff: passed `test-387`, `chk-439`, and Goal 62 closeout `chk-440`.
