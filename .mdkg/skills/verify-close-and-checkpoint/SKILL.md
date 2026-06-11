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

1. Confirm package intent and version in `package.json`, `package-lock.json`, `README.md`, `CLI_COMMAND_MATRIX.md`, and `CHANGELOG.md`.
2. Confirm release-line intent before bumping: when a change crosses a capability-track boundary, prefer the next minor release line over patch-style continuation. For the current project DB track, follow `0.1.9 -> 0.2.0` rather than naming the next planned source line `0.1.10`.
3. Use a clean npm cache: `export NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache`.
4. Run `npm ci`, `npm run build`, `node scripts/assert-publish-ready.js`, `npm run test`, `npm run cli:check`, `node dist/cli.js validate`, `npm run smoke:consumer`, `npm run smoke:matrix`, `npm run smoke:upgrade`, `npm run smoke:init`, `npm run smoke:capabilities`, `npm run smoke:archive-work`, `npm run smoke:bundle`, `npm run smoke:bundle-import`, and `npm run smoke:visibility`.
5. Run `npm pack --dry-run --json` and confirm the tarball includes `dist/cli.js`, compiled folders, `dist/init/`, release docs, and `scripts/postinstall.js`.
6. Confirm registry state with `npm view mdkg version --registry=https://registry.npmjs.org/`.
7. When publishing with an exported `NPM_TOKEN`, create a temporary npm userconfig that references the environment variable literally, then verify auth before publish:

```bash
printf '//registry.npmjs.org/:_authToken=${NPM_TOKEN}\nregistry=https://registry.npmjs.org/\n' > /private/tmp/mdkg-npm-publish.npmrc
NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm whoami --registry=https://registry.npmjs.org/ --userconfig=/private/tmp/mdkg-npm-publish.npmrc
```

Do not print the token, do not write the expanded token into committed files,
and do not add unsupported `always-auth` config.
8. Publish only after the registry still shows the previous version and npm auth is known to have write access. Use the verified userconfig when relying on `NPM_TOKEN`:

```bash
NPM_CONFIG_CACHE=/private/tmp/mdkg-npm-cache npm publish --registry=https://registry.npmjs.org/ --userconfig=/private/tmp/mdkg-npm-publish.npmrc
```

9. If publishing fails with 2FA, token policy, or permission errors, do not commit; fix npm auth or package policy, then rerun publish.
10. After successful publish, verify `npm view mdkg version` and `npm view mdkg dist-tags`, then commit the release changes.

## Bundle-Aware Commit Gate

When a repo tracks mdkg archive caches or snapshot bundles, refresh and verify them before the final commit. This is recommended after validation and before staging so the committed semantic graph, compressed archive caches, and snapshot bundle describe the same source state.

```bash
mdkg archive compress --all
mdkg archive verify --json
mdkg bundle create --profile private
mdkg bundle verify .mdkg/bundles/private/all.mdkg.zip
```

Skip `mdkg archive compress --all` only when the repo has no `.mdkg/archive` sidecars. Skip bundle refresh only when the repo intentionally does not track `.mdkg/bundles/`. Use `--profile public` or `mdkg pack --visibility public` only for explicit export-safe output after public workspace, archive, and import visibility has been reviewed.

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
