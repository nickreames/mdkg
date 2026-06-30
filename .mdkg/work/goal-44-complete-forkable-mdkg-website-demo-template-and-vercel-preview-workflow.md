---
id: goal-44
type: goal
title: Complete forkable mdkg website demo template and Vercel preview workflow
status: progress
priority: 1
goal_state: active
goal_condition: A canonical website demo template exists at examples/website-demo-template, a first branch-path run can be forked into examples/demo-runs/demo-001, an agent can start from one selected goal and build a complete differentiated Astro plus React Islands website with Ocean Flow design guidance and Creative Production freedom, local validation passes, and an explicitly approved Vercel preview workflow records preview evidence without DNS, durable demo-N hosting, production promotion, push, tag, or npm publish side effects.
scope_refs: [epic-205, task-618, task-619, task-620, task-621, task-622, test-321, test-322, test-323, test-324, test-325]
active_node: task-621
required_skills: [select-work-and-ground-context, build-pack-and-execute-task, verify-close-and-checkpoint]
required_checks: [node dist/cli.js index, node dist/cli.js validate --json, node dist/cli.js validate --changed-only --json, mdkg graph fork examples/website-demo-template --target examples/demo-runs/demo-001 --start-goal goal-1 --json, mdkg goal next goal-1 --json from forked run, mdkg pack <first-node> --profile concise --dry-run --stats from forked run, generated demo local build, Browser desktop and mobile local validation, Chrome desktop and mobile local validation, no-secret and public-claims audit, Vercel preview project and deployment evidence only after explicit approval, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [demo, template, vercel, preview, website, creative-production, mdkg-dev]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-20]
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
website from the selected goal, and validate a Vercel preview workflow without
turning preview work into durable hosting.

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
- A dedicated Vercel preview project named `mdkg-demo-previews` is created or
  verified only after explicit approval, and a preview deployment records URL,
  project/deployment ids, build logs, commit SHA, screenshots, noindex state,
  and an accept/reject/polish recommendation.
- No durable `demo-N.mdkg.dev` hosting, DNS, custom domain, Vercel alias,
  production promotion, git push, tag, npm publish, or analytics activation
  occurs in this goal.

# Non-Goals

- Do not publish a new mdkg npm version unless implementation proves the
  current CLI cannot support the workflow.
- Do not mutate Vercel, deploy, create projects, push, change DNS, add custom
  domains, or promote previews without explicit approval during execution.
- Do not re-open `goal-42` or revive archived `goal-20`; use them only as
  historical context.
- Do not make accepted demos canonical mdkg.dev content in this goal.

# Recursive Algorithm

1. Claim `task-618` and create the canonical template graph and handoff prompt.
2. Add Creative Production intake and freedom constraints from `task-619`.
3. Prove branch-path fork/run mechanics through `task-620`, `test-321`,
   `test-322`, and `test-323`.
4. Only after explicit approval, use `task-621` and `test-324` to create or
   verify the dedicated Vercel preview project and record preview deployment
   evidence.
5. Use `task-622` and `test-325` to classify the preview as accepted,
   rejected, or needs-polish and decide whether the follow-up hosting goal can
   proceed.
6. Re-evaluate the goal after every claimed node until the end condition is met
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
- Vercel preview evidence only after explicit approval
- `git diff --check`

# Acceptance Criteria

- `node dist/cli.js goal next goal-44 --json` selects `task-618` first.
- The canonical template path is `examples/website-demo-template/`.
- The first run path is `examples/demo-runs/demo-001/`.
- The dedicated preview project name is `mdkg-demo-previews`.
- The first run is forkable and repeatable without hidden chat context.
- Preview evidence is sufficient to decide accept/reject/polish.
- `goal-46` remains blocked until `test-325` records an accepted preview
  checkpoint.

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
- The next actionable node is `task-618`.
- Context decisions/design records are `dec-56`, `dec-57`, `edd-58`, and
  `edd-59`; they are linked from concrete nodes to keep goal routing focused on
  actionable work.

# Iteration Log

- 2026-06-29: Created by graph-only enhancement pass after `mdkg@0.4.0` launch.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Planning checkpoint: `chk-327`.
- Implementation evidence pending.
