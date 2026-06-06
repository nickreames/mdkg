# mdkg 0.1.8 DB And Queue Upgrade Megaprompt

Use this handoff after `mdkg@0.1.8` is published and installed as the global
latest CLI. It is written for upgrading another repo's `.mdkg` graph safely,
then optionally enabling and validating the new project DB foundation.

## Copy-Paste Megaprompt

You are upgrading this repository's `.mdkg` graph and mdkg-managed scaffolding
to the latest published `mdkg` CLI. Work one repo at a time. Preserve existing
source changes and graph work; do not publish, tag, push, or commit unless the
user explicitly asks.

Repository target:

- `<ABSOLUTE_REPO_PATH>`

Release target:

- `mdkg@0.1.8`
- npm registry latest should be `0.1.8`
- global binary should be the real machine binary, normally
  `/opt/homebrew/bin/mdkg` on this Mac

Hard boundaries:

- Treat markdown graph nodes, config, archive sidecars, bundle manifests, and
  committed receipts as source of truth.
- Treat `.mdkg/index` as a rebuildable graph access cache.
- Treat `.mdkg/db` as optional project application database state, not the graph
  source of truth.
- Do not commit `.mdkg/db/runtime/` or SQLite WAL/SHM/journal/lock/temp files.
- Queue support in `0.1.8` is internal local delivery infrastructure only. Do
  not add or expect public `mdkg db queue ...` commands.
- Do not store raw secrets, production ledger/payment state, live credentials,
  or canonical external system state in mdkg mirrors.

Execution plan:

1. Enter the repo and read local instructions first.
   - `cd <ABSOLUTE_REPO_PATH>`
   - Read `AGENTS.md`, `AGENT_START.md`, `.mdkg/core/SOUL.md`,
     `.mdkg/core/HUMAN.md`, `.mdkg/README.md`, and `CLI_COMMAND_MATRIX.md` when
     present.
   - If files disagree, trust source code and current CLI behavior first.

2. Capture preflight state without mutating.
   - `git status --short --branch`
   - `command -v mdkg`
   - `mdkg --version`
   - `npm view mdkg version --prefer-online`
   - `mdkg validate`
   - If validation fails before upgrade, record the exact failures as baseline
     graph issues. Do not blame the upgrade for pre-existing broken references.

3. Ensure the global CLI is `mdkg@0.1.8`.
   - If `mdkg --version` is not `0.1.8`, install the latest published package:
     `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm install -g mdkg@latest --registry=https://registry.npmjs.org/ --foreground-scripts`
   - If the global prefix requires OS approval, request it. Do not silently
     switch to a user-local npm prefix.
   - Re-check:
     - `command -v mdkg`
     - `mdkg --version`
     - `npm list -g mdkg --depth=0`

4. Preview the graph/scaffold upgrade.
   - `mdkg upgrade --json`
   - Inspect:
     - `version`
     - `safe_to_apply`
     - `will_write_paths`
     - `preserved_customizations`
     - `blocking_conflicts`
     - `apply_side_effects`
   - Continue only if `safe_to_apply` is true and `blocking_conflicts` is empty.
   - If local docs or skills are reported as preserved customizations, keep them
     and report the preservation. Do not overwrite hand-edited startup docs just
     to match seed text.

5. Apply the managed upgrade.
   - `mdkg upgrade --apply --json`
   - If this fails on managed skill mirror metadata such as
     `.agents/skills/.mdkg-managed.json` because of sandbox permissions, rerun
     the same command with the required filesystem approval. Do not hand-edit
     generated mirror metadata as a workaround.
   - Run `mdkg upgrade --json` again. Expected post-apply state:
     - `will_write_paths` is empty, or only contains intentionally deferred
       safe managed paths
     - `blocking_conflicts` is empty

6. Sync indexes and mirrors.
   - `mdkg skill sync` when mirrored skills are present or upgrade reports skill
     mirror side effects.
   - `mdkg index`
   - If the repo uses SQLite index mode, `.mdkg/index/mdkg.sqlite` is derived
     cache state and should remain ignored unless repo policy says otherwise.

7. Validate graph health.
   - `mdkg validate`
   - `mdkg doctor --json`
   - If validation fails, separate findings into:
     - pre-existing graph failures from the baseline
     - new upgrade-related failures
     - unrelated dirty worktree noise
   - Fix only the smallest mdkg-owned graph issue required for the upgrade
     unless the user broadens scope.

8. Optional project DB enablement and migration.
   - Only do this when the user or repo goal explicitly opts in to project DB.
   - `mdkg db init --json`
   - `mdkg db migrate --json`
   - `mdkg db verify --json`
   - `mdkg db stats --json`
   - Verify ignore policy:
     - `git check-ignore .mdkg/db/runtime/project.sqlite`
     - `git check-ignore .mdkg/db/schema/migrations/001_mdkg_project_db_foundation.sql` should fail
     - `git check-ignore .mdkg/db/schema/migrations/002_mdkg_project_db_queue.sql` should fail
   - The migration list should include:
     - `mdkg.project_db.foundation.v1`
     - `mdkg.project_db.queue.v1`

9. Optional sealed snapshot proof.
   - Run only if the repo wants an explicit project DB checkpoint:
     - `mdkg db snapshot seal --json`
     - `mdkg db snapshot verify --json`
     - `mdkg db snapshot status --json`
   - Use `mdkg db snapshot dump` and `mdkg db snapshot diff` for deterministic
     review aids instead of reviewing raw SQLite binary bytes.

10. Optional queue capability smoke.
    - There is no public queue CLI in `0.1.8`.
    - Queue testing should use the installed package's internal helper module
      only when the repo has a clear need to prove queue primitives.
    - Exercise enqueue, duplicate dedupe, claim, wrong-owner ack/fail rejection,
      retry delay, expired lease reclaim, ack, dead-letter, and stats.
    - Keep queue state as delivery infrastructure, not canonical event history.
    - Do not run long-lived worker logic inside SQLite transactions.

11. Closeout report.
    - Report:
      - repo path
      - pre-upgrade and post-upgrade `mdkg --version`
      - `mdkg upgrade --json` post-apply summary
      - validation and doctor results
      - whether project DB was left disabled or initialized/migrated
      - any preserved customizations
      - any remaining baseline graph issues
      - exact files changed
      - explicit note that no publish, tag, push, or commit occurred unless the
        user requested one

Suggested repo-specific emphasis:

- `/Users/nick/git/omni-web`: preserve JSON index mode unless the user opts into
  SQLite; separate upgrade work from any existing graph validation holes.
- `/Users/nick/git/ochatr-ai-go`: preserve backend semantic mirror boundaries;
  keep raw secrets, live provider tokens, and runtime observability state out of
  mdkg.
- `/Users/nick/omni-chat-rooms/projects/omni-room-runtime`: preserve runtime
  contract fixtures and generated artifacts; validate mdkg graph health without
  rewriting runtime-owned state.
- `/Users/nick/omni-chat-rooms`: apply root repo changes conservatively and do
  not mutate child repo submodules unless explicitly requested.

## Changelog For Consumer Repos

### mdkg 0.1.8

- Added internal local `node:sqlite` queue foundations for project DB delivery
  state.
- Added the built-in project DB migration `mdkg.project_db.queue.v1`, emitted as
  `002_mdkg_project_db_queue.sql` after the existing foundation migration.
- Added internal queue table support through `project_queue_message`.
- Added internal helper support for:
  - enqueue with optional dedupe key
  - duplicate enqueue returning the existing message
  - oldest-ready transactional claim
  - lease owner validation for ack/fail/dead-letter
  - retry delay
  - max-attempt dead-letter behavior
  - expired lease release and reclaim
  - queue stats
- Added packed smoke coverage through `npm run smoke:db-queue`.
- Kept queue support internal only. There is no public `mdkg db queue ...` CLI
  and no arbitrary SQL exposure.

### mdkg 0.1.7 DB foundation context

- Added the `mdkg db` namespace for project database work.
- Added `mdkg db init` to create `.mdkg/db/{schema,runtime,state,receipts}`,
  write `.mdkg/db/project-db.json`, and enable `db.enabled` without creating an
  active runtime SQLite database.
- Added `mdkg db migrate` using Node's built-in `node:sqlite`.
- Added foundation migration metadata with migration keys, order, checksums, and
  applied timestamps.
- Added `mdkg db verify` for non-mutating config, layout, SQLite integrity,
  migration metadata, receipt policy, and transient-file checks.
- Added `mdkg db stats` for deterministic table counts, database size,
  migration state, transient runtime files, receipt-file count, and state
  snapshot presence.
- Added `mdkg db snapshot seal/verify/status/dump/diff` for opt-in sealed
  project DB checkpoints and deterministic review aids.
- Clarified the boundary between `.mdkg/index` and `.mdkg/db`:
  - `.mdkg/index` is rebuildable graph access cache.
  - `.mdkg/db` is project application database state.
  - Markdown graph files remain canonical.

## Release Evidence From mdkg CLI Repo

- `mdkg@0.1.8` was published on 2026-06-04.
- `npm view mdkg version --prefer-online` returned `0.1.8`.
- Global latest installed at `/opt/homebrew/bin/mdkg`.
- `mdkg --version` returned `0.1.8`.
- Temp global smoke passed in
  `/private/tmp/mdkg-global-0.1.8-smoke.ILUSqM/repo`.
- The temp smoke covered project DB init, migrate, verify, stats, snapshot
  seal/verify, graph task create/index/validate/search/show, ignore policy, no
  public queue CLI exposure, and packaged internal queue helper lifecycle proof.
