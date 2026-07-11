---
id: edd-72
type: edd
title: mdkg v0.5.0 publish deployment and postpublish verification contract
tags: [release, publish, deploy, verification]
owners: []
links: []
artifacts: []
relates: [goal-64]
refs: [goal-61, goal-62, goal-63, goal-64, edd-70, dec-67, edd-71, dec-68, prd-11, dec-69, goal-42, goal-50]
aliases: [v0-5-0-publish-deploy-verify-contract]
created: 2026-07-10
updated: 2026-07-10
---
# Overview

A deterministic release runbook that turns verified loop and website work into
`mdkg@0.5.0`, proves the package from clean consumers, and only then activates
the public release experience.

# Architecture

1. Local release freeze: version, lockfile, changelog, generated references,
   graph, package, sites, tarball, upgrade, and browser preview.
2. One approval gate for all external checks and mutations.
3. External preflight: auth, version absence, advisories, and security scan.
4. First push with public promotion dormant; require green CI.
5. Npm publish and registry/integrity/temp-install/global-install proof.
6. Activation change, second push, production deployment, and live audit.
7. Final fix-forward receipt. No Git tag by default.

# Data model

- Release candidate commit contains package `0.5.0` and dormant site content.
- Approval receipt enumerates security network access, both pushes, npm publish,
  global replacement, and deployment.
- Npm receipt records version, dist-tag, integrity, and tarball.
- Consumer receipts cover fresh install, `0.4.2` upgrade, and real global binary.
- Activation receipt links the second commit and production deployments.

# APIs / interfaces

- Npm registry and authenticated publish.
- Origin push and required GitHub CI.
- `/opt/homebrew` global npm prefix.
- Vercel-backed mdkg.dev and docs.mdkg.dev production sites.
- Browser/Chrome desktop and mobile validation.

# Failure modes

- Existing `0.5.0`, auth failure, advisory finding, security finding, failed CI,
  or failed local gate stops before publication.
- Npm success followed by consumer/site failure is fixed forward; do not
  unpublish or rewrite the released artifact.
- Global-install failure may restore `0.4.2` locally while package investigation
  continues.
- Site activation waits for npm and global proof.

# Observability

Record command receipts, commit SHAs, CI checks, npm metadata/integrity, install
paths and versions, CLI probe outputs, deployment IDs/currentness, screenshots,
accessibility findings, and final residual risks.

# Security / privacy

Never print or commit npm/Vercel/Git credentials. Use temporary userconfig and
cache paths. Public-content and artifacts receive no-secret review before the
second push.

# Testing strategy

`test-388` through `test-394` prove local parity, approval boundaries,
origin/CI order, npm consumers, real global behavior, two-phase activation, and
live site quality.

# Rollout plan

Goal 64 remains paused until Goals 61 and 63 are achieved. It owns the version
bump and final changelog, requests one approval only after local dry-runs pass,
and publishes npm before activating public promotion.
