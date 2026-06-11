---
id: task-357
type: task
title: define SEO positioning and content architecture
status: todo
priority: 2
epic: epic-79
parent: goal-15
tags: [mdkg-dev, seo, positioning, content-architecture]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-354]
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Overview

Define mdkg.dev positioning and content architecture after spike-backed guide
planning exists. SEO should be outcome-focused and technically accurate, not
inflated beyond shipped behavior.

# Acceptance Criteria

- Define target audiences and search intents for local project memory,
  agent-readable task graphs, CLI workflows, and repo-native planning.
- Map primary pages to search intent, proof artifacts, and supporting examples.
- State prohibited claims: no hosted service dependency, no public worker
  execution until shipped, no secret handling promises beyond documented policy.
- Produce follow-up nodes for content gaps that need research spikes.

# Files Affected

- future mdkg.dev content strategy docs
- launch roadmap work nodes

# Implementation Notes

- Treat SEO as clarity and findability, not as a license to overclaim.
- Use generated command docs and tested examples as proof anchors.
- Keep version-specific claims attached to release notes.

# Test Plan

- Review page map against generated command contract and validated examples.
- Validate no launch page depends on unimplemented deferred features.
- Run mdkg validation after new nodes or docs are added.

# Links / Artifacts

- Depends on `task-354`.
