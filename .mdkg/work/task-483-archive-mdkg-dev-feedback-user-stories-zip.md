---
id: task-483
type: task
title: archive mdkg_dev_feedback_user_stories zip
status: done
priority: 1
tags: [mdkg-dev, archive, feedback]
owners: []
links: []
artifacts: [mdkg_dev_feedback_user_stories.zip]
relates: [test-224]
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-feedback-user-stories-2026-06-23]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Archive the feedback zip as durable source evidence while preserving the readable `mdkg_dev_feedback/` folder for reviewable story mapping.

# Acceptance Criteria

- `archive://archive.mdkg-dev-feedback-user-stories-2026-06-23` exists.
- Archive verification passes.
- New PRD/EDD/goal records cite the archive URI.

# Files Affected

- `.mdkg/archive/archive.mdkg-dev-feedback-user-stories-2026-06-23/`
- `mdkg_dev_feedback/`
- `mdkg_dev_feedback_user_stories.zip`

# Test Plan

- `node dist/cli.js archive verify archive://archive.mdkg-dev-feedback-user-stories-2026-06-23 --json`
- `node dist/cli.js validate --summary --json --limit 20`

# Implementation Notes

# Links / Artifacts
