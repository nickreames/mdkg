---
id: test-341
type: test
title: 0.4.2 docs generated reference and changelog consistency
status: progress
priority: 1
parent: goal-54
tags: [docs, generated-cli-reference, changelog, 0.4.2]
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
cases: []
created: 2026-07-05
updated: 2026-07-05
---
# Overview

Validate that `0.4.2` release documentation is internally consistent across the
root changelog, docs changelog, generated CLI reference, and public homepage.

# Target / Scope

List the work items or areas covered (use `relates` for tickets).

- `goal-54`
- `task-660`
- `task-658`
- `CHANGELOG.md`
- `CLI_COMMAND_MATRIX.md`
- `docs/src/content/docs/project/changelog.md`
- `docs/src/content/docs/reference/generated-cli-reference.md`
- live `mdkg.dev` and `docs.mdkg.dev`

# Preconditions / Environment

Document environment, data, and setup requirements.

- `mdkg@0.4.2` is already published to npm.
- Live page fetches are read-only unless explicit deployment approval is given.

# Test Cases

- Local source docs mention `0.4.2` and `mdkg git` in changelog surfaces.
- Local generated CLI reference build output mentions `mdkg git`, `closeout`,
  and `push-ready`.
- Live docs changelog mentions `0.4.2` and the Git lifecycle command family.
- Live generated CLI reference mentions `mdkg git`, `closeout`, and `push-ready`.
- Live homepage structured data reports `softwareVersion: "0.4.2"`.

# Results / Evidence

Record outcomes and link evidence in `artifacts` or `links`.

- 2026-07-05 local source check passed:
  `CHANGELOG.md`, `CLI_COMMAND_MATRIX.md`, `README.md`,
  `docs/src/content/docs/project/changelog.md`, and
  `docs/src/content/docs/reference/generated-cli-reference.md` include the
  expected `0.4.2`, `mdkg git`, `push-ready`, and closeout markers.
- 2026-07-05 local rendered docs check passed:
  `docs/dist/reference/generated-cli-reference/index.html` includes
  `Git lifecycle commands`, `mdkg git inspect`, `mdkg git closeout`, and
  `mdkg git push-ready`.
- 2026-07-05 live `mdkg.dev` check passed:
  `/private/tmp/mdkg-live-home-goal54.html` includes
  `softwareVersion":"0.4.2"` and the `Git closeout` card.
- 2026-07-05 live docs changelog check passed:
  `/private/tmp/mdkg-live-docs-changelog-goal54.html` includes `0.4.2`,
  `mdkg git`, `push-ready`, and closeout content.
- 2026-07-05 live generated CLI reference check failed as expected before
  push/deploy:
  `/private/tmp/mdkg-live-docs-cli-reference-goal54.html` does not include
  `Git lifecycle commands`, `mdkg git`, `push-ready`, or closeout markers.

# Notes / Follow-ups

- Drift hardening was added in `scripts/smoke-mdkg-dev-docs.js` for the public
  route source and generated backing reference.
- Remaining work: push/deploy the docs source change after explicit approval,
  then rerun live generated-reference verification.
