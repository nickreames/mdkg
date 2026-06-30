---
id: goal-44
type: goal
title: Complete forkable mdkg website demo template and short path demo integration
status: progress
priority: 1
goal_state: active
goal_condition: A canonical website demo template exists at examples/website-demo-template, the first run at examples/demo-runs/demo-001 is validated, accepted Demo 1 is integrated into the existing mdkg-dev Astro source plan at /demos, /demo/1, and /demo/1/output using sanitized graph/filesystem/output snapshots, local mdkg-dev build plus Browser/Chrome validation passes, and no push, deploy, DNS, tag, npm publish, analytics activation, or provider mutation occurs without explicit approval.
scope_refs: [epic-205, task-618, task-619, task-620, task-621, task-622, task-628, task-629, task-630, test-321, test-322, test-323, test-324, test-325, test-329]
active_node: task-628
required_skills: [select-work-and-ground-context, build-pack-and-execute-task, verify-close-and-checkpoint]
required_checks: [node dist/cli.js index, node dist/cli.js validate --json, node dist/cli.js validate --changed-only --json, mdkg graph fork examples/website-demo-template --target examples/demo-runs/demo-001 --start-goal goal-1 --json, mdkg goal next goal-1 --json from forked run, mdkg pack <first-node> --profile concise --dry-run --stats from forked run, generated demo local build, npm --prefix mdkg-dev run build, npm run smoke:mdkg-dev, Browser desktop and mobile local validation for /demos /demo/1 /demo/1/output, Chrome desktop and mobile local validation for /demos /demo/1 /demo/1/output, no-secret and public-claims audit, homepage and docs route lazy-load isolation proof, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [demo, template, website, creative-production, mdkg-dev, astro]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-20, goal-46, goal-47, dec-58, dec-59, edd-60, edd-61]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-29
updated: 2026-06-29
---
# Objective

Build a reusable mdkg demo lane where this repo can fork one canonical website
template graph into repeated demo runs, let an agent build a differentiated
website from the selected goal, and publish accepted demo proof into mdkg-dev
source routes after local validation without mutating Vercel or production
state.

# End Condition

The goal is achieved when:

- `examples/website-demo-template/` is the canonical forkable website demo
  template.
- The template includes `DESIGN.md` with the Ocean Flow visual system and an
  explicit Astro plus React Islands stack decision.
- Creative Production handoff guidance gives the LLM freedom over website
  structure, animation, art direction, and interaction while preserving public
  claim safety and no-secret boundaries.
- A first demo run can be forked to `examples/demo-runs/demo-001/` from this
  repo using existing mdkg graph movement commands.
- An agent can start from one selected goal in the forked run, inspect
  `goal next`, build a concise pack, create the site, validate locally, and
  close with evidence.
- Demo 1 is planned and implemented in the existing mdkg-dev Astro app using
  `/demos`, `/demo/1`, and `/demo/1/output`.
- Demo 1 uses a committed sanitized snapshot derived from
  `examples/demo-runs/demo-001` for graph, filesystem, and final output proof.
- Local mdkg-dev build, Browser validation, Chrome validation, no-secret audit,
  public-claims audit, and homepage/docs lazy-load isolation checks pass.
- No dedicated Vercel project, durable `demo-N.mdkg.dev` hosting, DNS, custom
  domain, Vercel alias, production promotion, git push, tag, npm publish,
  analytics activation, or provider mutation occurs in this goal without
  explicit approval.

# Non-Goals

- Do not publish a new mdkg npm version unless implementation proves the
  current CLI cannot support the workflow.
- Do not mutate Vercel, deploy, create projects, push, change DNS, add custom
  domains, or promote demos without explicit approval during execution.
- Do not re-open `goal-42` or revive archived `goal-20`; use them only as
  historical context.
- Do not add embedded VS Code-style workspace behavior in this goal; keep that
  as `goal-47`.

# Recursive Algorithm

1. Claim `task-618` and create the canonical template graph and handoff prompt.
2. Add Creative Production intake and freedom constraints from `task-619`.
3. Prove branch-path fork/run mechanics through `task-620`, `test-321`,
   `test-322`, and `test-323`.
4. Use `task-628` to plan mdkg-dev `/demos`, `/demo/1`, and `/demo/1/output`
   source integration.
5. Use `task-629` to create the sanitized Demo 1 graph/filesystem/output
   snapshot.
6. Use `task-630`, `test-324`, and `test-329` to implement and validate the
   local short-path routes.
7. Use `task-622` and `test-325` to classify the route proof as accepted,
   rejected, or needs-polish and decide whether `goal-47` can proceed.
8. Re-evaluate the goal after every claimed node until the end condition is met
   or blockers are explicit.

# Required Skills

- `select-work-and-ground-context`
- `build-pack-and-execute-task`
- `verify-close-and-checkpoint`
- required plugin skill `creative-production:explore`
- required plugin skill `browser:control-in-app-browser`
- required plugin skill `chrome:control-chrome`

# Required Checks

- `node dist/cli.js validate --json`
- `node dist/cli.js validate --changed-only --json`
- fresh fork validation for `examples/website-demo-template`
- `mdkg goal next goal-1 --json` in the forked run
- `mdkg pack <first-node> --profile concise --dry-run --stats`
- local Astro plus React Islands build for the generated demo
- Browser and Chrome desktop/mobile local validation
- no-secret and public-claims audit
- Browser/Chrome local route validation for `/demos`, `/demo/1`, and
  `/demo/1/output`
- homepage/docs lazy-load isolation proof
- `git diff --check`

# Acceptance Criteria

- `node dist/cli.js goal next goal-44 --json` selects `task-628` after the
  completed template/fork/local proof work.
- The canonical template path is `examples/website-demo-template/`.
- The first run path is `examples/demo-runs/demo-001/`.
- Accepted public demo URLs are `/demo/1`, `/demo/2`, etc., with `/demos` as
  the directory page.
- The first run is forkable and repeatable without hidden chat context.
- Local route evidence is sufficient to decide accept/reject/polish.
- `goal-47` remains blocked until `test-325` records an accepted short-path
  demo checkpoint.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.

# Current State

- Created on 2026-06-29 as the replacement demo-template and preview lane.
- `goal-20` remains archived and historical.
- `goal-42` is achieved and should not be reopened for this work.
- Context decisions/design records are `dec-56`, `dec-57`, `dec-58`, `dec-59`,
  `edd-58`, `edd-59`, `edd-60`, and `edd-61`; `dec-58` and `dec-59` supersede
  the default dedicated-preview/subdomain model for this lane.
- Canonical template creation, Creative Production intake, branch-path fork
  proof, local website implementation, Browser/Chrome validation, and
  no-secret/public-claims audit are complete.
- `examples/demo-runs/demo-001` is the first completed local proof run and is
  ready to become the Demo 1 source/snapshot input.
- The old Vercel preview project lane is superseded at `task-621`; the current
  selected node is `task-628` for mdkg-dev `/demos` and `/demo/1` source
  planning.
- No Vercel provider mutation, DNS, custom domain, alias, durable hosting,
  production promotion, git push, tag, npm publish, or analytics activation has
  occurred in this goal.

# Iteration Log

- 2026-06-29: Created by graph-only enhancement pass after `mdkg@0.4.0` launch.
- 2026-06-29: Seeded `examples/website-demo-template` with Ocean Flow design,
  Astro plus React Islands stack guidance, Creative Production intake, and
  preview/no-secret boundaries.
- 2026-06-29: Forked and completed `examples/demo-runs/demo-001`; local build,
  Browser/Chrome screenshots, mdkg validation, demo graph smoke, and
  no-secret/public-claims audit passed.
- 2026-06-29: Prepared `task-621` pack and local preflight, then blocked on the
  explicit Vercel preview approval boundary.
- 2026-06-29: Re-aligned the goal on short mdkg-dev paths after the operator
  chose `/demo/1`, `/demo/2`, and `/demos`; created `task-628`, `task-629`,
  `task-630`, `test-329`, and follow-up `goal-47`.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Planning checkpoint: `chk-327`.
- Template seed and graph proof: `task-618`, `task-619`, `task-620`,
  `test-321`.
- Local demo build and Browser/Chrome validation: `test-322`, `chk-332`,
  `examples/demo-runs/demo-001/.mdkg/work/chk-3-demo-001-astro-react-website-built.md`,
  `examples/demo-runs/demo-001/.mdkg/work/chk-4-demo-001-validation-passed-and-preview-approval-recommended.md`.
- No-secret and public-claims audit: `test-323`, `chk-333`.
- Vercel preview evidence from the old lane is superseded at `task-621`.
- mdkg-dev short-path source integration is pending at `task-628`.
