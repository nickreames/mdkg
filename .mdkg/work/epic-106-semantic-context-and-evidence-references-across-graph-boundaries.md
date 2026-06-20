---
id: epic-106
type: epic
title: semantic context and evidence references across graph boundaries
status: todo
priority: 1
tags: [refs, subgraph, indexing]
owners: []
links: []
artifacts: []
relates: [goal-22, goal-18, goal-19]
blocked_by: [task-414]
blocks: [task-416, task-417, test-182, test-183]
refs: []
aliases: [semantic-refs, context-evidence-refs, cross-graph-refs]
skills: []
created: 2026-06-17
updated: 2026-06-17
---
# Goal

Add generic semantic reference lanes for planning context and evidence without overloading executable goal scope.

# Scope

- Add `context_refs` and `evidence_refs` to work-node parsing, indexing, search, show, pack, validation, and visibility behavior.
- Support local ids, qids, configured subgraph qids, and URI refs.
- Keep `scope_refs` as the executable queue for goals.
- Improve cross-subgraph blocker explanations and read-only reference summaries.

# Acceptance Criteria

- Context/evidence refs are valid on work nodes and are not treated as actionable scope.
- Configured subgraph refs can be inspected and packed but not mutated.
- Routing explains when work is blocked by a read-only external graph node.

# Milestones

- Add context/evidence ref parsing and indexing.
- Add graph reference summaries.
- Prove subgraph blocker messaging.

# Out of Scope

- Mutating imported subgraph nodes from the parent graph.

# Risks

- Reference traversal must not accidentally broaden public pack visibility.

# Related Work

- task-416
- task-417
- test-182
- test-183

# Links / Artifacts

- goal-22
