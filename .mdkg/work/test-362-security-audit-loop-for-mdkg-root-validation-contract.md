---
id: test-362
type: test
title: Security audit loop for mdkg root validation contract
status: done
priority: 1
parent: loop-1
tags: [loop-template, audit, security, loop-fork, loop-child, test]
owners: []
links: []
artifacts: []
relates: [loop-1]
blocked_by: []
blocks: []
refs: [loop-1, template://loops/security-audit]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-07-06
updated: 2026-07-06
---
# Test Contract

Validate that Security audit loop for mdkg root reaches its definition of done for mdkg root repository.

# Cases

- Loop and linked child nodes are discoverable.
- Evidence and follow-up work are linked back to the scoped loop.
- Blockers route to spike/proposal/recommendation guidance instead of early hard-stop.

# Evidence

Template: template://loops/security-audit

- Loop and linked child nodes were discoverable through direct `.mdkg/work` reads and pack dry-run.
- Evidence was recorded in `spike-25` and follow-up work was linked through `task-688` and `spike-27`.
- Blocked external advisory checks did not stop the loop; they were routed into `task-688` while static source review continued.
- `node dist/cli.js validate --summary --json --limit 20`: ok true, zero warnings, zero errors before closeout edits.
- `node dist/cli.js pack loop-1 --pack-profile concise --dry-run --stats`: passed, 5 nodes, no files written before closeout edits.
- Tight credential-shaped local scan returned no matches.
- Root `npm audit --json --omit=dev` returned zero vulnerabilities.
