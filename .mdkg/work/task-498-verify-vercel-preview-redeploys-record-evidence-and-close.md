---
id: task-498
type: task
title: verify Vercel preview redeploys record evidence and close
status: todo
priority: 1
tags: [mdkg-dev, vercel, preview, closeout]
owners: []
links: [https://mdkg-dev.vercel.app/, https://mdkg-docs.vercel.app/]
artifacts: []
relates: [test-233, test-234]
blocked_by: [task-497]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Verify the pushed implementation caused existing Vercel preview projects to redeploy and close Goal 30 without public launch side effects.

# Acceptance Criteria

- `mdkg-dev` and `mdkg-docs` latest deployments are `READY`.
- Preview URLs validate in Browser/Chrome and through Vercel deployment/log tools.
- Deployment IDs, commit SHAs, route checks, and screenshot/receipt evidence are recorded.
- DNS, production promotion, analytics activation, npm publish, git tag, and GitHub settings mutation remain deferred.

# Test Plan

- Vercel project/deployment inspection.
- Hosted Browser route checks.
- `node dist/cli.js validate --summary --json --limit 20`

# Files Affected

# Implementation Notes

# Links / Artifacts
