---
id: task-799
type: task
title: Separate package release authority into a repository local skill
status: done
priority: 1
epic: epic-254
tags: [release-authority, skills, local-only]
owners: [goal-60-mdkg-child-writer]
links: []
artifacts: [.mdkg/skills/release-mdkg-package/SKILL.md, .agents/skills/release-mdkg-package/SKILL.md, .claude/skills/release-mdkg-package/SKILL.md, .mdkg/skills/registry.md]
relates: [goal-74, goal-75, edd-79, dec-85]
blocked_by: [task-798]
blocks: [test-458, test-460]
refs: [goal-74, goal-75, edd-79, dec-85]
context_refs: [edd-79, dec-85]
evidence_refs: [chk-540]
aliases: []
skills: [author-mdkg-skill, service-boundary-ownership-check]
created: 2026-07-16
updated: 2026-07-16
---
# Overview

Add a repository-local package release workflow with a narrow positive trigger
and explicit negative trigger so ordinary goal closeout cannot become package
publication work.

# Acceptance Criteria

- The release skill requires an explicit release goal QID and current package
  publication approval before any release action.
- Push, tag, deploy, and downstream upgrade remain separate authority levels.
- The skill is registered and mirrored only to configured local agent targets.
- No public default seed contains the release skill or its instructions.
- No registry credential inspection or package action occurs in this lane.

# Files Affected

- `.mdkg/skills/release-mdkg-package/SKILL.md`
- `.agents/skills/release-mdkg-package/SKILL.md`
- `.claude/skills/release-mdkg-package/SKILL.md`
- `.mdkg/skills/registry.md`
- configured managed metadata for the two local mirror targets

# Implementation Notes

- Use the existing skill authoring standard and no scripts.
- Keep `goal-75` paused with no current publication approval.

# Test Plan

Run release skill validation, registry and mirror checks, public-default absence
assertions, and the negative-trigger checks in `test-460`.

# Links / Artifacts

- `edd-79`
- `dec-85`
- `goal-75`

# Verification Evidence

- `release-mdkg-package` validates with 0 warnings and 0 errors.
- Canonical and both configured local mirrors are exact matches.
- Public default absence checks passed.
- No registry authentication, package, push, tag, deploy, or provider action
  occurred.
