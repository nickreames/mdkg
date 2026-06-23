---
id: epic-129
type: epic
title: mdkg.dev E2E remediation evidence and launch-boundary hardening
status: todo
priority: 1
tags: [mdkg-dev, remediation, launch-boundary]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: [edd-30, dec-32]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Goal

Resolve any local mdkg-dev defects discovered by Browser E2E and archive reviewed screenshot/receipt evidence without crossing public-launch boundaries.

# Scope

- Fix Browser-proven local mdkg-dev/docs/example defects inside this repo.
- Rerun focused Browser and smoke checks after fixes.
- Archive selected screenshots and E2E receipts after raw-marker review.
- Record remediation/no-remediation evidence in checkpoints.

# Milestones

- `task-460` fixes defects or records no-op remediation evidence.
- `task-461` archives selected Browser screenshots and receipts.
- `test-210` validates no-secret, launch-boundary, and demo-subgraph evidence.

# Out of Scope

- Broad redesign not tied to a Browser E2E defect.
- Public deploy, DNS, GitBook production sync, Vercel production promotion, publish, tag, push, or global install.

# Risks

- Fixes can drift from docs/smoke expectations unless focused checks are rerun.
- Evidence archives must stay sanitized and local.

# Links / Artifacts

- goal-25
- dec-32
