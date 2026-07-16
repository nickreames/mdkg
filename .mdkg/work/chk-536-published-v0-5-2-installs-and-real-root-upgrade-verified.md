---
id: chk-536
type: checkpoint
title: published v0.5.2 installs and real-root upgrade verified
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-789]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-789]
created: 2026-07-15
updated: 2026-07-15
---
# Summary

Installed registry mdkg@0.5.2 under isolated prefix /private/tmp/mdkg-0.5.2-postpublish and verified version/help/contract/provenance. Disposable consumer root /private/tmp/mdkg-0.5.2-installed-validation-4VIviC passed init, status, validate, goal next, concise pack dry-run, loop list/plan, git inspect, verified materialization acceptance, commit_mismatch, auth_unavailable, invalid_request containment, submodules_denied, legacy git clone compatibility, and safe upgrade preview/apply. Replaced the real global package: /opt/homebrew/bin/mdkg resolves to npm mdkg@0.5.2 and reports 0.5.2. Real-root baseline HEAD 7223d3a0 was clean. Upgrade preview and apply were safe with zero blocking conflicts, zero writes, zero side effects, 71 unchanged assets, and nine preserved customized docs/skills: .mdkg/README.md; pursue-mdkg-loop, select-work-and-ground-context, verify-close-and-checkpoint skills; AGENT_START.md; AGENTS.md; CLAUDE.md; CLI_COMMAND_MATRIX.md; llms.txt. Reindex, status, skill validation, full and changed-only validation, doctor, goal/loop/pack/Git probes, and diff checks passed. Doctor retained one accepted warning for the ignored healthy project runtime SQLite file. No push, tag, deployment, rollback, or unrelated root mutation occurred.

# Scope Covered

- Completed node: task-789 (validate published v0.5.2 installs and upgrade the real root graph)
- Node type: task
- Checkpoint source: `mdkg task done --checkpoint`

## Changed Surfaces

- Completed work node: task-789
- Attached artifacts are listed in checkpoint frontmatter and below.

## Boundaries

- in scope: structured task completion and checkpoint evidence
- out of scope: unrelated graph, runtime, provider, or release mutations
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded

# Decisions Captured

- See decision and approval refs on the completed node and checkpoint frontmatter.

# Implementation Summary

- Completion of task-789 was recorded through the structured task lifecycle.
- Detailed implementation or test evidence remains on the completed node and linked refs.

# Verification / Testing

## Command Evidence

- command: `mdkg task done --checkpoint`
- result: completed node and evidence checkpoint written

## Pass / Fail Status

- status: done

## Known Warnings

- warning: none recorded by the completion command

# Known Issues / Follow-ups

- Inspect the completed node and linked refs for any explicitly recorded residual work.

## Follow-up Refs

- task/test/goal refs: inspect the completed node and checkpoint frontmatter

# Links / Artifacts

- /private/tmp/mdkg-0.5.2-postpublish
- /private/tmp/mdkg-0.5.2-installed-validation-4VIviC

# Raw Content Safety

- This checkpoint stores the completion summary and artifact refs, not raw prompts, secrets, payloads, or bulky traces.
