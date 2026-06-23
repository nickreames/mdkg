---
id: task-449
type: task
title: author public alpha homepage quickstart safety origin and llms content
status: done
priority: 1
epic: epic-124
parent: goal-25
tags: [mdkg-dev, public-alpha, content, trust, llms]
owners: []
links: []
artifacts: []
relates: [task-446, task-448]
blocked_by: [task-448]
blocks: [task-450, task-452, test-202]
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [prd-4, prd-5, edd-25, edd-27, dec-30]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Author public-alpha content for the website and docs from shipped mdkg capabilities and canonical graph decisions.

# Acceptance Criteria

- Executed only after goal-25 is explicitly activated and the site/docs scaffolds exist.
- Homepage first viewport communicates product value and shows a CLI command.
- Quickstart uses a verified first-run path: `mdkg init --agent`, `mdkg index`, `mdkg status`, and `mdkg validate`.
- Trust page covers local-first posture, no hosted index, no daemon, no automatic work execution, no skill-script execution, read-only MCP, subgraph read-only context, visibility limitations, queue boundaries, and alpha caveats.
- Alpha page states developer preview/pre-v1 public alpha boundaries.
- `llms.txt`, robots, sitemap, and social metadata are present or explicitly stubbed with follow-up blockers.
- Claims evidence matrix maps every public homepage claim to evidence or softened wording.
- Nicholas Reames creator/origin content is a placeholder only unless a later request provides assets/copy.
- No public publish, deploy, push, tag, DNS change, analytics activation, or production promotion occurs.

# Files Affected

- `/mdkg-dev` public routes
- `/docs` public-alpha source
- claims evidence matrix path selected by task-445

# Implementation Notes

- Preferred headline: "Git-native project memory for AI-native software engineering."
- Avoid claims that mdkg is autonomous execution, secret-safe, fully secure, a hosted runtime, or guaranteed agent correctness.
- Record public copy/claims/trust proof checkpoint before closing.

# Implementation Summary

- Expanded the mdkg.dev homepage around Git-native project memory, agent workflow, validation gates, advanced-alpha boundaries, and project origin.
- Added evidence-backed public claims tracking in `mdkg-dev/CLAIMS.md` and `docs/project/claims-evidence-matrix.md`.
- Added static social metadata, JSON-LD structured data, `llms.txt`, `llms-full.txt`, robots, and sitemap coverage.
- Preserved alpha posture: the copy avoids claims about autonomous execution, hosted queues, comprehensive secret scanning, or public event/reducer/lease/materializer CLI surfaces.

# Test Plan

- Link check if available.
- no-secret scan selected by task-452.
- metadata/sitemap smoke selected by task-452.
- `node dist/cli.js validate --json`

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- checkpoint: chk-189
- parent: goal-25
- epic: epic-124
- context: prd-4
- context: mdkg.dev claims SEO and measurement contract
- context: mdkg.dev quality gate contract
