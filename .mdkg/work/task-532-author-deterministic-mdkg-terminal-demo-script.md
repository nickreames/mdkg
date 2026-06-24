---
id: task-532
type: task
title: author deterministic mdkg terminal demo script
status: todo
priority: 3
epic: epic-170
tags: [demo, terminal, follow-up, mdkg-dev]
owners: []
links: []
artifacts: []
relates: [task-528, test-255]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Author a deterministic terminal demo script for mdkg.dev that shows the public Plan -> Work -> Evidence loop without relying on private repo state.

# Acceptance Criteria

- Demo starts in a disposable or template repo.
- Script uses current public commands: `mdkg init --agent`, `mdkg index`, `mdkg goal current`, `mdkg goal next`, `mdkg show`, `mdkg pack`, `mdkg handoff create`, `mdkg task done --checkpoint`, and `mdkg validate`.
- Script records expected outputs and failure handling.
- No secrets, raw prompts, provider payloads, or private repo paths are included.
- Demo remains separate from canonical public proof until Browser/Vercel validation accepts it.

# Test Plan

- Run the script against a temp repo.
- Verify output can be used in public docs or a live demo without leaking private state.

Describe what this task is and why it matters.

# Acceptance Criteria

- criterion 1
- criterion 2

# Files Affected

List files/directories expected to change.

- path 1
- path 2

# Implementation Notes

- note 1
- note 2

# Test Plan

How will we verify it works?

# Links / Artifacts

- related docs
- related issues
- references
