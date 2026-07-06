---
name: verify-close-and-checkpoint
description: Verify code and mdkg state, attach evidence, and close work cleanly when the single-writer AI agent or human orchestrator is ready to perform durable writes.
tags: [stage:review, writer:orchestrator, mdkg, validation, release]
version: 0.1.0
authors: [mdkg]
links: [README.md, AGENT_START.md]
---

# Goal

Finish work with evidence, validation, and minimal memory drift.

## When To Use

- After implementation
- Before commit
- Before marking a task done
- Before creating a checkpoint

## Inputs

- Active task id
- Test or build outputs
- Any new artifact references

## Steps

1. Run the relevant technical gates for the changed surface.
2. Run `mdkg validate` before closing the task.
3. For mdkg scaffold or release work, include `mdkg upgrade` dry-run/apply evidence and any package smoke that exercises upgrade behavior.
4. Use `mdkg task update <id> ...` for additive evidence and structured metadata changes; keep narrative/body edits in markdown.
5. When pursuing a goal, record evidence on the active node and summarize goal evidence before running `mdkg goal evaluate <goal-id>`.
6. Use `mdkg task done <id> --checkpoint "<title>"` when the task should close with milestone compression.
7. Batch durable mdkg writes at one boundary: task status, artifact refs, optional checkpoint, goal evidence, and commit.
8. Mark tasks done only after evidence exists.
9. Create a checkpoint only for milestone-level transitions, not every small step.
10. For feat or epic closeout, prefer a checkpoint body as the durable narrative summary of what changed and what is next.
11. Use feat closeout scope as direct children with `parent: <feat-id>` and epic closeout scope as descendant work with `epic: <epic-id>`.
12. Parent status edits remain manual; do not invent a hidden parent-closeout workflow.
13. If the latest checkpoint is relevant, use it as durable recall; treat raw events as provenance/debugging, not primary execution context.
14. If `events.jsonl` is missing, recreate it with `mdkg event enable` before expecting automatic JSONL provenance.

## Pre-Publish Release Gate

Use this local repo-only checklist before publishing mdkg:

1. Classify public surfaces before turning release evidence into copy work:
   package/runtime truth, docs/reference truth, public positioning, and
   internal operational evidence are different surfaces.
2. Confirm package intent and version in `package.json`, `package-lock.json`,
   `README.md`, `CLI_COMMAND_MATRIX.md`, generated docs, and `CHANGELOG.md`.
3. Map every publish-bound change in `origin/main..HEAD` to release notes. Treat
   missing changelog coverage, stale package/docs/reference version strings, and
   generated-doc drift as publish blockers, not cosmetic notes.
4. Treat public positioning surfaces such as `mdkg.dev` homepage, demo pages, and
   trust pages as copy/positioning surfaces, not automatic projections of
   internal release, npm, Vercel, or checkpoint evidence. Change them only when
   the current copy is objectively false for users, an active public-copy task
   explicitly owns the wording, or the user approves the positioning change.
5. Route current capability facts, command details, changelog entries, and
   release validation evidence to docs/reference/changelog surfaces first. Do
   not promote internal provider ids, postpublish state, or operator workflow
   details into homepage copy by default.
6. If a release audit finds ambiguous public copy, record it as an open question
   or docs/reference follow-up instead of a prescriptive homepage implementation
   task.
7. Confirm release-line intent before bumping: when a change crosses a
   capability-track boundary, prefer the next minor release line over patch-style
   continuation.
8. Use a clean npm cache path such as `/private/tmp/mdkg-npm-cache`.
9. Run `npm ci`, `npm run build`, `node scripts/assert-publish-ready.js`,
   `npm run test`, `npm run cli:check`, `npm run cli:contract`,
   `npm run docs:check`, `node dist/cli.js validate --json`,
   `node dist/cli.js validate --changed-only --json`, `npm run smoke:consumer`,
   `npm run smoke:matrix`, `npm run smoke:upgrade`, `npm run smoke:init`,
   `npm run smoke:capabilities`, `npm run smoke:archive-work`,
   `npm run smoke:bundle`, `npm run smoke:bundle-import`,
   `npm run smoke:subgraph`, and `npm run smoke:visibility`.
10. Run `NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm pack --dry-run --json`
   and confirm the tarball includes `dist/cli.js`, compiled folders,
   `dist/init/`, release docs, and `scripts/postinstall.js`.
11. Run the publish dry-run before recommending publish readiness:

```bash
NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --dry-run --registry=https://registry.npmjs.org/
```

12. Confirm registry state with these checks; readiness requires latest below the
   target and the target version not already published:

```bash
npm view mdkg version --registry=https://registry.npmjs.org/
npm view mdkg@<version> version --registry=https://registry.npmjs.org/
```

13. Stop with either a publish-readiness recommendation or an exact gaps list.
   Do not run real `npm publish`, create a tag, or push release commits without
   explicit user approval after the dry-run gates.
14. When publishing with an exported `NPM_TOKEN`, create a temporary npm
   userconfig that references the environment variable literally, then verify
   auth before publish:

```bash
printf '//registry.npmjs.org/:_authToken=${NPM_TOKEN}\nregistry=https://registry.npmjs.org/\n' > /private/tmp/mdkg-npm-publish.npmrc
NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm whoami --registry=https://registry.npmjs.org/ --userconfig=/private/tmp/mdkg-npm-publish.npmrc
```

Do not print the token, do not write the expanded token into committed files,
and do not add unsupported `always-auth` config.
15. Publish only after explicit user approval, the registry still shows the
    previous version, and npm auth is known to have write access. Use the
    verified userconfig when relying on `NPM_TOKEN`:

```bash
NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --registry=https://registry.npmjs.org/ --userconfig=/private/tmp/mdkg-npm-publish.npmrc
```

16. If publishing fails with 2FA, token policy, or permission errors, do not
    commit; fix npm auth or package policy, then rerun publish.
17. After successful publish, verify `npm view mdkg version`, `npm view mdkg dist-tags`,
    and a temp-dir global install of the latest package before closing
    post-publish validation.

## Bundle-Aware Commit Gate

When a repo tracks mdkg archive caches or snapshot bundles, refresh and verify them before the final commit. This is recommended after validation and before staging so the committed semantic graph, compressed archive caches, and snapshot bundle describe the same source state.

```bash
mdkg archive compress --all
mdkg archive verify --json
mdkg bundle create --profile private
mdkg bundle verify .mdkg/bundles/private/all.mdkg.zip
```

Skip `mdkg archive compress --all` only when the repo has no `.mdkg/archive` sidecars. Skip bundle refresh only when the repo intentionally does not track `.mdkg/bundles/`. Use `--profile public` or `mdkg pack --visibility public` only for explicit export-safe output after public workspace, archive, and import visibility has been reviewed.

## Multi-Repo Closeout Gate

Use this order for root orchestration, child repo upgrades, and subgraph refresh work:

1. Gather read-only baselines for every involved repo before mutation.
2. Get one explicit approval matrix for which repos may be updated.
3. Apply and validate one repo at a time.
4. Commit accepted child repo mdkg-only changes locally before root subgraph sync.
5. Sync root-owned bundles only from clean child commits and record the child commit id in the root evidence.
6. Run root subgraph audit or verify after bundle refresh.
7. Keep handoffs refs-only and sanitized; never copy raw secrets, tokens, prompts, provider payloads, or unrelated raw runtime payloads into checkpoints or packs.

## Outputs

- Verified mdkg graph state
- Attached evidence and artifact refs
- Task ready for review, done, or checkpointing
- One durable writer action at the selected run or milestone boundary

## Safety

- Do not mark work done without validation.
- Do not create checkpoint spam.
- Keep commits event-driven and single-writer when agents are involved.
- Only the orchestrator performs durable mdkg writes or commit/push actions.
- Never commit on every tool call.
- mdkg indexes and discovers skills, but does not execute skill scripts.

## Failure Handling

- If validation fails, stop and return the task to active work instead of closing it.
- If artifact or evidence refs are missing, attach them before status changes or checkpoint creation.
- If writer ownership is unclear, stop and resolve it before any durable mdkg update or commit.
