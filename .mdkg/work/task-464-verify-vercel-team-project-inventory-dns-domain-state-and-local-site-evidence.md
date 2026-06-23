---
id: task-464
type: task
title: verify Vercel team project inventory DNS domain state and local site evidence
status: done
priority: 1
epic: epic-131
parent: goal-27
tags: [mdkg-dev, vercel, dns, audit]
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
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Record the read-only state that the execution agent must confirm before creating Vercel resources.

# Acceptance Criteria

- Current Vercel team and project inventory is recorded.
- Current DNS and HTTP behavior for `mdkg.dev` and `www.mdkg.dev` is recorded.
- Local mdkg-dev source/build state is summarized.
- No external resource is created or changed.

# Files Affected

- `.mdkg/work/task-464-*`
- Optional checkpoint created by the execution pass.

# Implementation Notes

- Use read-only Vercel plugin list/inspect calls and DNS/HTTP probes.
- Treat DNS credentials and registrar UI access as manual-only.

# Test Plan

Evidence includes Vercel inventory, DNS/HTTP observations, and local path/build facts without deploy or DNS side effects.

# Links / Artifacts

- `epic-131`
- `epic-132`
- `test-213`
- `test-215`
