---
id: chk-6
type: checkpoint
title: release cut and readiness audit
status: done
priority: 1
tags: [0_0_7, release, readiness]
owners: []
links: []
artifacts: [npm-run-build, npm-run-test, node-dist-cli-skill-sync, node-dist-cli-validate, npm-run-cli-check, npm-run-smoke-consumer]
relates: [epic-17, task-116, dec-20]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: []
created: 2026-03-12
updated: 2026-03-12
---
# Summary

This phase fixed the published workspace-config leak, removed the accidental `polish` and `smoke` live subgraphs, and added XML / TOON / Markdown output for node and skill discovery/show commands. The source tree is now release-ready for a `0.0.7` cut, but the version bump, tag, and publish have not been executed yet.

# Scope Covered

- published init seed config is now a dedicated root-only asset
- live repo no longer tracks or indexes `polish` / `smoke`
- `mdkg list|search|show` support `--json|--xml|--toon|--md`
- `mdkg skill list|search|show` support `--json|--xml|--toon|--md`
- active docs and startup artifacts match the new output surface

# Decisions Captured

- `dec-20` locked the bootstrap config cleanup and discovery/show export parity contract

# Implementation Summary

- added `assets/init/config.json` as the published init seed instead of copying the live repo config
- removed leaked workspace directories and root config entries for `polish` and `smoke`
- extended shared discovery/show output handling in `src/commands/query_output.ts`
- kept text mode as the default and made structured output flags mutually exclusive
- aligned the command matrix, startup docs, and init assets to the new surface

# Verification / Testing

- `npm run build`
- `npm run test`
- `node dist/cli.js skill sync`
- `node dist/cli.js validate`
- `npm run cli:check`
- `npm_config_cache=/tmp/mdkg-npm-cache npm run smoke:consumer`

# Known Issues / Follow-ups

- structured output expansion beyond discovery/show remains deferred in `epic-11` follow-up history but is now superseded by this implementation
- residual coverage hardening remains deferred under `epic-13`

# Links / Artifacts

- `assets/init/config.json`
- `.mdkg/config.json`
- `src/commands/query_output.ts`
- `src/commands/list.ts`
- `src/commands/search.ts`
- `src/commands/show.ts`
- `src/commands/skill.ts`
- `README.md`
- `CLI_COMMAND_MATRIX.md`
