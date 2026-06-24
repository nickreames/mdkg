---
id: task-492
type: task
title: build claims evidence matrix and soften unsupported public claims
status: todo
priority: 1
tags: [mdkg-dev, claims, trust, no-secret]
owners: []
links: []
artifacts: []
relates: [test-230]
blocked_by: [task-491]
blocks: [task-493]
refs: [archive://archive.mdkg-dev-feedback-user-stories-2026-06-23]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Create a real claims evidence matrix and ensure public copy does not overclaim deferred or unsafe capabilities.

# Acceptance Criteria

- Claims matrix includes page, claim, evidence source, shipped status, caveat/safe wording, and owner/status.
- Homepage and trust claims map to evidence or are softened.
- Copy blocks claims about hosted execution, hosted memory, hosted queues, arbitrary SQL, comprehensive secret scanning, production readiness, and universal agent compatibility unless verified.
- Safety copy warns against raw secrets, prompts, provider payloads, tokens, private keys, and sensitive data in graph nodes.

# Test Plan

- `npm run smoke:mdkg-dev-seo`
- No-secret scan in the relevant smoke.
- `test-230`

# Files Affected

# Implementation Notes

# Links / Artifacts
