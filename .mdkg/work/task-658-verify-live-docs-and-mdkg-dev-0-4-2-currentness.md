---
id: task-658
type: task
title: verify live docs and mdkg.dev 0.4.2 currentness
status: done
priority: 2
parent: goal-54
tags: [docs, mdkg-dev, live-validation, 0.4.2, browser, vercel]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [https://mdkg.dev/, https://docs.mdkg.dev/project/changelog/, https://docs.mdkg.dev/reference/generated-cli-reference/]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-07-05
updated: 2026-07-05
---
# Overview

Verify the public web surfaces after the generated CLI reference fix and any
approved docs deployment. This task should prove that the live site remains
current for `mdkg@0.4.2` and that no stale docs page undercuts the release.

# Acceptance Criteria

- `https://mdkg.dev/` structured data reports `softwareVersion: "0.4.2"`.
- `https://mdkg.dev/` includes the 0.4.2 Git closeout public copy.
- `https://docs.mdkg.dev/project/changelog/` includes `0.4.2`, `mdkg git`,
  `push-ready`, and closeout details.
- `https://docs.mdkg.dev/reference/generated-cli-reference/` includes `mdkg git`,
  `closeout`, and `push-ready`.
- If deployment is needed, Vercel deploy/promotion happens only after explicit
  approval and records deployment id, commit SHA, build status, and live URL
  evidence.

# Files Affected

List files/directories expected to change.

- None for read-only verification.
- If live currentness fails, source/docs deployment fixes belong in
  `task-660` or a new child task.

# Implementation Notes

- As of 2026-07-05, live `mdkg.dev` and live changelog are already current for
  `0.4.2`; the live generated CLI reference is the known stale/missing surface.
- Keep checks read-only until explicit deploy approval is granted.

# Test Plan

- Fetch live HTML for the three public URLs.
- Search for `softwareVersion`, `0.4.2`, `Git closeout`, `mdkg git`,
  `closeout`, and `push-ready`.
- Use Browser/Chrome visual validation if copy or layout changes affect docs
  navigation or the homepage.

# Links / Artifacts

- `https://mdkg.dev/`
- `https://docs.mdkg.dev/project/changelog/`
- `https://docs.mdkg.dev/reference/generated-cli-reference/`
- `/private/tmp/mdkg-live-home-postpublish.html`
- `/private/tmp/mdkg-live-docs-changelog-postpublish.html`
- `/private/tmp/mdkg-live-docs-cli-reference-postpublish.html`
- `/private/tmp/mdkg-live-home-after-mdkg-git-push-closeout.html`
- `/private/tmp/mdkg-live-docs-changelog-after-mdkg-git-push-closeout.html`
- `/private/tmp/mdkg-live-docs-cli-reference-after-mdkg-git-push-closeout.html`

# Verification Evidence

2026-07-05 live read-only checks after the real `mdkg git push` passed:

- `https://mdkg.dev/` reports `softwareVersion":"0.4.2"` in structured data
  and includes `0.4.2 launch track`, `Git closeout`, and
  `mdkg git push-ready`.
- `https://docs.mdkg.dev/project/changelog/` includes the `0.4.2` release card
  and details for `mdkg git`, `push-ready`, and closeout receipts.
- `https://docs.mdkg.dev/reference/generated-cli-reference/` includes the new
  `Git lifecycle commands` section, `mdkg git inspect --json`,
  `mdkg git closeout --json`,
  `mdkg git push-ready --remote origin --branch main --json`,
  `authentication stays external`, and `system Git`.

The original stale generated CLI reference gap is closed.
