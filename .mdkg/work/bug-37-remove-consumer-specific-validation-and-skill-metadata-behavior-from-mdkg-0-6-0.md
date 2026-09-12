---
id: bug-37
type: bug
title: Remove consumer-specific validation and skill metadata behavior from mdkg 0.6.0
status: backlog
priority: 1
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [task-833]
blocks: []
refs: [goal-84, dec-95, edd-82, test-484]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-09-11
updated: 2026-09-11
---
# Overview

Goal: Ship generic-only mdkg agent/memory contracts in 0.6.0. Context: dec-95
requires complete removal of consumer-specific tooling, not a compatibility
adapter. Owner mdkg-project-agent; product-boundary blocker, not a security finding.

# Reproduction Steps

1. Inspect validate.ts normalizeValidationProfile/collectContractProfileErrors.
2. Inspect skills_indexer.ts extractOchatr and skill/pack/query_output consumers.
3. Inspect agent_file_types.ts room_orchestrated and required pricing_model;
   work.ts supplies quoted by default. Inventory all seed/schema/test/doc copies.
Static source at cd0eb6fcc3f5945cfa3c29fe0cb356d9805e518c; no fresh execution.

# Expected vs Actual

- Expected: portable contracts and consumer-neutral discovery; runtime policy is
  external. Existing authored data is never silently rewritten or discarded.
- Actual: named product validation and privileged metadata projection; additional
  marketplace/topology assumptions need semantic classification under edd-82.

# Suspected Cause

Earlier consumer integrations were encoded as core profile/metadata conventions.

# Fix Plan

Capture task-833 export first. Remove omni-room profile execution/known-profile
special casing and ochatr-specific extraction/search/render/JSON adapters. Do not
replace them with aliases or weaken generic safety validation. Old raw fields
may survive untouched in authored documents only under the same generic unknown
field rules as any consumer; no privileged interpretation or compatibility API.
Edd-82 recommends generic orchestrated vocabulary and removal of mandatory
commercial pricing/defaults. Generic manifests, work mirrors and structural
receipt verification remain. Inventory the final field/command migration and
explicit refusal diagnostics before implementing schema changes.
Allowed future paths: owning src, schemas/templates/seeds, direct tests/scripts,
generated references and release guidance plus mdkg evidence. No canonical graph
migration, historical receipt rewriting, root/consumer edits or runtime behavior.

# Test Plan

Test-484 checks fresh installed seeds, generic noncommercial contracts, removed
profile rejection before writes, neutral metadata behavior, retained generic
receipt/ref/visibility safeguards, package/MCP/docs parity and byte-preserved user
inputs. Task-828 independently verifies the exact diff and export completeness.
Before/after snapshots prove no canonical migration or consumer execution.

# Links / Artifacts

- dec-95; edd-82; task-833; test-484; task-828. Future implementation unclaimed.
