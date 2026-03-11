---
id: test-11
type: test
title: 0.0.4 events jsonl redaction and index safety
status: done
priority: 1
epic: epic-4
tags: [v0_4, events, security]
owners: []
links: []
artifacts: [cmd:npm_run_test_ok_2026_03_05, cmd:mdkg_validate_ok_2026_03_05]
relates: [prd-1, dec-8, dec-9, edd-2, edd-3, edd-6, task-38]
blocked_by: []
blocks: []
refs: []
aliases: []
cases: [events-jsonl-format, events-kind-taxonomy-guidance, events-seeded-init-record, events-redaction-default, index-safety]
created: 2026-02-27
updated: 2026-03-05
---

# Overview

Validate planned 0.0.4 episodic logging constraints for JSONL format, seeded init event shape, redaction defaults, and index safety boundaries.

# Target / Scope

Covers event-log format expectations and safeguards so logs do not break deterministic indexing behavior.

# Preconditions / Environment

- event log fixtures exist under `.mdkg/work/events/`
- redaction guidance is implemented in logging path
- no markdown logs are required in event path

# Test Cases

- Verify accepted event log format is JSONL.
- Verify recommended event kind taxonomy is documented and deterministic.
- Verify seeded init event line matches documented canonical schema.
- Verify default redaction behavior for sensitive fields.
- Verify index and validation behavior remain stable with event logs present.
- Verify event-log guidance remains documentation-level until runtime behavior is implemented.

# Results / Evidence

Capture fixture logs, validation outputs, and regression checks on index generation.

# Notes / Follow-ups

- Add malformed JSONL handling tests.
- Add merge-conflict behavior checks under single-writer assumptions.
