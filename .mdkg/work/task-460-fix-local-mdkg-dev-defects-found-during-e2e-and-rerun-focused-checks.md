---
id: task-460
type: task
title: fix local mdkg-dev defects found during E2E and rerun focused checks
status: done
priority: 1
epic: epic-129
parent: goal-26
tags: [mdkg-dev, remediation, browser-e2e]
owners: []
links: []
artifacts: []
relates: [goal-26, task-458, task-459]
blocked_by: [task-459]
blocks: []
refs: []
context_refs: [edd-30]
evidence_refs: [chk-198]
aliases: []
skills: [verify-close-and-checkpoint]
created: 2026-06-22
updated: 2026-06-22
---
# Overview

Fix local mdkg-dev defects discovered by Browser E2E and rerun focused checks. If no defects are found, close this task as a no-op with evidence.

# Acceptance Criteria

- Every Browser-discovered defect has a fix or an explicit defer rationale and follow-up ref.
- Focused Browser checks and relevant npm smokes are rerun after any fix.
- If no defects are found, the task records no-op remediation evidence.
- No broad redesign or unrelated functional work is introduced.

# Files Affected

- `mdkg-dev/**` only when Browser E2E proves a site defect.
- `docs/**` or `examples/**` only when Browser E2E proves a docs/demo defect.
- `.mdkg/work/chk-*` for remediation evidence.

# Implementation Notes

- Keep fixes scoped to local Browser-visible defects.
- Do not deploy or change public infrastructure.

# Test Plan

- Focused Browser rerun for changed route(s).
- Relevant smoke scripts for changed surface.
- `git diff --check`

# Links / Artifacts

- task-458
- task-459
- chk-198

# Closeout Evidence

- Remediation checkpoint: chk-198.
- Fixed secondary page h1 semantics, canonical local links, raw-marker wording, and screenshot evidence capture mode.
- Rerun evidence: Browser receipt `ok: true`, `npm --prefix mdkg-dev run build` pass, `npm run smoke:mdkg-dev-seo` pass, and `npm run smoke:demo-graph` pass.
