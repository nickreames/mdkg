---
id: task-38
type: task
title: plan episodic events jsonl and checkpoint guidance
status: done
priority: 1
epic: epic-4
tags: [v0_4, events, checkpoint]
owners: []
links: []
artifacts: []
relates: [prd-1, dec-8, dec-9, edd-2, edd-3, edd-4, edd-6]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-02-27
updated: 2026-03-05
---

# Overview

Define v0.4 episodic memory conventions using append-only JSONL logs under `.mdkg/work/events/` and checkpoint guidance for compression summaries.

# Acceptance Criteria

- Event log format is locked to JSONL for v0.4 planning.
- Two-tier episodic model is explicit: high-frequency event logs + low-frequency checkpoint compression nodes.
- Redaction-by-default guidance is documented.
- Seeded init event example line is documented as a valid first `events.jsonl` record.
- Recommended event kind taxonomy is documented for replay/debug consistency.
- Relationship between event logs and checkpoint nodes is documented.
- Documentation explicitly treats this as docs-now, implementation-later for runtime behavior.
- Event guidance is documented outside `.mdkg/work/events/*.md` to avoid strict-node parse failures.

# Files Affected

- .mdkg/core/rule-2-context-pack-rules.md
- .mdkg/core/rule-4-repo-safety-and-ignores.md
- .mdkg/design/prd-1-mdkg-product-spec-v0-4-deterministic-agent-memory-and-skills.md
- .mdkg/design/edd-2-mdkg-v0-4-architecture-indexing-validation-packs-skills.md
- .mdkg/design/edd-6-mdkg-event-logs-and-checkpoints-guide-v0-4-episodic-memory-and-provenance.md
- .mdkg/design/edd-4-mdkg-init-omni-specification-v0-4.md

# Implementation Notes

- Avoid markdown event logs to prevent accidental strict-node parsing issues.
- Keep command surface decisions deferred for later architecture work.
- Keep event append/commit cadence rules scoped to external orchestrator guidance.

# Test Plan

Future implementation should verify JSONL format expectations, event-kind taxonomy guidance, redaction defaults, seeded event format, and checkpoint interoperability (`test-11`).

# Links / Artifacts

- prd-1
- dec-8
- dec-9
- edd-2
- edd-3
- edd-4
- edd-6
- epic-4
