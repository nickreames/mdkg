---
id: epic-196
type: epic
title: preserve manifest indexing pack search and reference compatibility
status: todo
priority: 1
tags: [manifest, index, pack, search, refs, compatibility]
owners: []
links: []
artifacts: []
relates: [goal-37, edd-54, dec-50]
blocked_by: [epic-195]
blocks: [task-577, task-578, task-579, test-292, test-293]
refs: [edd-54, task-276]
context_refs: []
evidence_refs: []
aliases: [manifest-index-pack-compatibility, manifest-search-compatibility, spec-reference-compatibility]
skills: []
created: 2026-06-25
updated: 2026-06-25
---
# Goal

Ensure all downstream graph, discovery, and transfer surfaces treat canonical
manifests and legacy specs consistently during the one-compatibility-release
window.

# Scope

- Capability index/search/show/resolve behavior.
- Canonical `mdkg manifest` behavior and legacy `mdkg spec` compatibility.
- Pack traversal and dependency/reference resolution.
- `WORK.md` relationships and `work trigger` behavior for manifest refs and
  legacy spec refs.
- Bundle, subgraph, visibility, and imported graph compatibility.

# Milestones

- `task-577`: work mirror and trigger compatibility.
- `task-578`: capability index/search/command output.
- `task-579`: pack, graph refs, bundles, subgraphs, and visibility.
- `test-292` and `test-293`: discovery and transfer compatibility.

# Out of Scope

- No production runtime execution.
- No ledger, marketplace, or hosted queue behavior.

# Risks

- Capability output changes could break tooling expecting `kind: spec`.
- Pack traversal could miss legacy files if aliases are handled only at CLI
  display time.

# Links / Artifacts

- `goal-37`
- `edd-54`
- external links
