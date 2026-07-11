---
id: edd-71
type: edd
title: mdkg v0.5.0 public release experience planning contract
tags: [release, planning, design, mdkg-dev, docs]
owners: []
links: []
artifacts: []
relates: [goal-62, goal-63]
refs: [goal-56, goal-61, goal-62, goal-63, goal-64, edd-70, dec-67, dec-68, dec-73, prd-11, task-729, test-400]
aliases: [v0-5-0-public-release-experience-contract]
created: 2026-07-10
updated: 2026-07-10
---
# Overview

A collaborative, evidence-gated plan for announcing and teaching mdkg
`v0.5.0` loops across mdkg.dev and docs.mdkg.dev. Planning must translate
verified package behavior into useful public value without publishing internal
release operations or unsupported claims.

# Architecture

1. Clean local release-candidate baseline proven by `task-729` / `test-400`.
2. Capability truth packet from completed `goal-61`.
3. Evidence-labeled audience and value narrative routed through Sales.
4. Fresh desktop/mobile Product Design audit of both current sites.
5. Exactly three post-quickstart announcement-section directions and explicit
   operator choice, with no broader homepage redesign.
6. Accepted top-level Loops information architecture, exact copy,
   accessibility, SEO, public-alpha, and dormant activation decisions.
7. Fully populated local implementation handoff in `goal-63`.

# Data model

- Claim: text plus Known, Inferred, Assumed, or Missing classification and refs.
- Design evidence: fresh screenshots, findings, three concepts, and decision.
- Public surface: homepage, loop guide, CLI examples, upgrade guidance, release
  notes, metadata, and navigation.
- Homepage surface: existing hero and quickstart followed immediately by one
  incremental v0.5.0 loop announcement with a security-audit CTA.
- Documentation surface: top-level Loops group for overview, templates/forks,
  readiness/routing/evidence/closeout, and the security walkthrough.
- Example: purpose-built commands and representative output; no copied dogfood
  transcript or internal ids.
- Release activation: one shared source-controlled draft/published manifest for
  both Astro sites; draft is the default through Goal 3.
- Handoff: accepted EDD/DEC/PRD plus executable Goal 3 scope.

# APIs / interfaces

- Product Design `audit` is screenshot-first; `ideate` produces exactly three
  options and pauses for operator selection.
- Sales `index` routes the value-story workflow without requiring CRM data.
- mdkg.dev owns positioning; docs.mdkg.dev owns conceptual, procedural, and CLI
  truth; changelog/release notes own version facts.
- Generated CLI reference remains authoritative for exact syntax.
- A local-only preview override may render published state without changing the
  committed draft manifest.

# Failure modes

- Unverified capability claims remain Missing and cannot enter final copy.
- Design work cannot infer operator selection; unresolved options stay open.
- Public positioning cannot expose provider IDs, credentials, or internal
  release receipts.
- Draft production builds cannot expose release routes, navigation, metadata,
  sitemap/LLM entries, indexed content, or premature v0.5.0 version claims.
- Goal 3 remains empty if design, copy, or activation decisions are incomplete.

# Observability

The planning receipt records claim provenance, screenshot paths, audit findings,
three concept artifacts, operator decisions, accepted documents, and the Goal 3
pack dry-run.

# Security / privacy

Use only public-safe source facts and sanitized evidence. Do not put secrets,
tokens, private analytics, raw provider payloads, or unsupported customer claims
into public copy or design artifacts.

# Testing strategy

Tests verify claim provenance, evidence labels, screenshot-backed audit, exactly
three directions, explicit selection, complete IA and activation contract, and
an implementation-ready but non-executed Goal 3.

# Rollout plan

Planning begins only after Goal 1 and the clean local baseline test. Goal 3
implements locally with activation dormant. Goal 4 publishes npm first and
changes the shared release state only after package and consumer proof.
