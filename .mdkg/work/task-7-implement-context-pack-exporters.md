id: task-7
type: task
title: implement context pack traversal and exporters (md/json/toon)
status: todo
priority: 2
epic: epic-1
relates: [rule-2]
tags: [pack, export, agents]
created: 2026-01-06
updated: 2026-01-06

Overview

Implement the context pack feature: traversal, deterministic ordering, verbose pinned core inclusion, and exports.

Acceptance Criteria
	•	mdkg pack <id> --format md produces deterministic pack output
	•	--verbose includes pinned core from .mdkg/core/core.md
	•	depth and edge selection configurable
	•	truncation occurs safely when limits are reached and is recorded
	•	JSON and TOON exports include ordered nodes and metadata

Files Affected
	•	src/commands/pack.ts
	•	src/pack/pack.ts
	•	src/pack/export_md.ts
	•	src/pack/export_json.ts
	•	src/pack/export_toon.ts

Implementation Notes
	•	Implement ordering rules exactly per rule-2.
	•	Do not index templates; pack should include node markdown content.
	•	Consider default behavior: exclude frontmatter from body in pack md to reduce noise.

Test Plan
	•	run mdkg pack task-1 --verbose
	•	confirm pack includes rule-1..rule-6 via core list

Links / Artifacts
	•	rule-2
---
id: task-7
type: task
title: implement context pack traversal and exporters (md/json/toon)
status: todo
priority: 2
epic: epic-1
tags: [pack, export, agents]
links: [cmd:pack, format:md, format:json, format:toon]
artifacts: [pack-md, pack-json, pack-toon, verbose-core-inclusion, truncation-meta]
relates: [rule-2]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-06
updated: 2026-01-06
---

# Overview

Implement the context pack feature: traversal, deterministic ordering, verbose pinned core inclusion, and exports.

# Acceptance Criteria

- `mdkg pack <id> --format md` produces deterministic pack output
- `--verbose` includes pinned core from `.mdkg/core/core.md`
- depth and edge selection configurable
- truncation occurs safely when limits are reached and is recorded
- JSON and TOON exports include ordered nodes and metadata

# Files Affected

- src/commands/pack.ts
- src/pack/pack.ts
- src/pack/export_md.ts
- src/pack/export_json.ts
- src/pack/export_toon.ts

# Implementation Notes

- Implement ordering rules exactly per rule-2.
- Do not index templates; pack should include node markdown content.
- Default behavior: exclude raw frontmatter from body in pack md; surface `links`/`artifacts` in pack headers.

# Test Plan

- run `mdkg pack task-1 --verbose`
- confirm pack includes rule-1..rule-6 via core list

# Links / Artifacts

- rule-2