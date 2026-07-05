---
id: test-341
type: test
title: 0.4.2 docs generated reference and changelog consistency
status: todo
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

- Pending implementation.
- Known post-publish gap: live generated CLI reference fetched to
  `/private/tmp/mdkg-live-docs-cli-reference-postpublish.html` omitted `mdkg git`
  and `push-ready` markers on 2026-07-05.

# Notes / Follow-ups

- If this test finds the generated CLI reference can drift from
  `CLI_COMMAND_MATRIX.md`, harden docs automation or SKILL.md closeout guidance
  so new CLI command families cannot ship without generated docs coverage.
