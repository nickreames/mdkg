---
id: spike-25
type: spike
title: Security audit loop for mdkg root grounding spike
status: done
priority: 1
parent: loop-1
tags: [loop-template, audit, security, loop-fork, loop-child, spike]
owners: []
links: []
artifacts: []
relates: [loop-1]
blocked_by: []
blocks: []
refs: [loop-1, template://loops/security-audit]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-06
updated: 2026-07-06
---
# Research Question

What source-grounded context, constraints, risks, and viable options should Security audit loop for mdkg root use for mdkg root repository?

# Search Plan

- Inspect mdkg context before broad source exploration.
- Use source and web grounding when the loop hits a blocker.

# Context And Constraints

- Read-only audit: do not make functional source, docs, template, generated, or runtime changes.
- Create or recommend future mdkg work nodes for any remediation or deeper investigation.
- Keep findings source-grounded and avoid storing secrets, raw prompts, raw provider payloads, or bulky traces.

# Options And Tradeoffs

- Option 1: static source and config audit only.
- Option 2: add dependency and package metadata review.
- Option 3: propose a later deeper security scan goal if source-only review finds enough risk.

# Findings

- Static parent-agent security audit pass completed for the mdkg root repository. This is not a formal exhaustive Codex Security multi-agent scan.
- No credential-shaped secrets were found with a tight local pattern scan for npm tokens, OpenAI-style keys, GitHub tokens, AWS access keys, or private-key block headers, excluding generated/vendor/binary surfaces.
- Root package dependency advisory check passed with `npm audit --json --omit=dev` and reported zero vulnerabilities. `docs/` and `mdkg-dev/` advisory checks require external registry access; the network escalation was rejected, so those remain pre-publish follow-up work.
- Shellout review found fixed command/argv usage rather than shell execution for the inspected surfaces. `scripts/postinstall.js` only calls `npm prefix -g` with fixed arguments; mdkg Git helpers use argv arrays, redact remote userinfo in output, and reject embedded URL credentials on relevant Git command inputs.
- Archive and bundle review found useful safety boundaries: archive IDs are portable, archive add copies a local file into a deterministic `.mdkg/archive/<id>/` sidecar with hashes and visibility metadata, and public pack/bundle paths have private-reference checks.
- One hardening gap should be investigated before relying on untrusted bundles at larger scale: `readZipEntries` inflates ZIP entries before an explicit maximum uncompressed-size, entry-count, or total-size policy is enforced. Bundle and subgraph parsing validate hashes and sizes after entries are read, but the resource ceiling should be made explicit.
- Public mdkg-dev rendering is static and Astro-escaped. The only `set:html` usage is JSON-LD generated from repo-owned structured data; harden JSON-LD escaping if that metadata ever becomes user-sourced.

# Recommendation

- Do not treat this loop as a blocker for local loop dogfooding; no critical or high-confidence source-grounded exploit was found in this parent-agent read-only pass.
- Before a public publish, run `task-688` for a formal Codex Security scan plus fresh package advisory checks with explicit approval for any external registry/security-provider calls.
- Triage `spike-27` as a security hardening follow-up for bundle/subgraph ZIP resource limits. Prefer a local first-party guardrail over adding a dependency unless a streaming parser becomes clearly worthwhile.

# Follow-Up Nodes To Create

- `task-688` - Run formal Codex Security and dependency advisory scan before publish.
- `spike-27` - Assess bundle and subgraph ZIP parsing resource limits.

# Skill Candidates

- `codex-security:security-scan` for the later formal pre-publish scan.
- `verify-close-and-checkpoint` for evidence-only loop closeout.
- `service-boundary-ownership-check` for keeping mdkg-owned security boundaries separate from runtime execution policy.

# Evidence And Sources

Template: template://loops/security-audit

- `git status --short --branch`: dirty worktree confirmed; unrelated functional/source changes were preserved and not reverted.
- `node dist/cli.js validate --summary --json --limit 20`: ok true, zero warnings, zero errors.
- `node dist/cli.js pack loop-1 --pack-profile concise --dry-run --stats`: passed, 5 nodes, no files written.
- Tight credential-shape scan: no matches for npm token, OpenAI-style key, GitHub token, AWS key, or private-key header patterns.
- `npm audit --json --omit=dev` at repo root: zero vulnerabilities.
- `npm audit --json --omit=dev` in `docs/` and `mdkg-dev/`: blocked by restricted network; escalation rejected because it would send package metadata externally.
- `scripts/postinstall.js:21-34`, `scripts/postinstall.js:54-83`: fixed `npm prefix -g` postinstall helper and informational output.
- `src/commands/git.ts:234-285`: remote credential redaction/rejection helpers and argv-based Git execution.
- `src/commands/subgraph.ts:811-865`: contained source path checks, child Git root requirement, `.mdkg` requirement, and tracked-dirty detection.
- `src/commands/archive.ts:374-440`: archive add copies local file into a deterministic archive sidecar with hashes and visibility.
- `src/commands/bundle.ts:629-644`: public bundle private-reference validation.
- `src/util/zip.ts:126-154`: ZIP entries are inflated before explicit resource limit enforcement.
- `src/commands/bundle.ts:693-707`, `src/graph/subgraphs.ts:105-107`, `src/graph/subgraphs.ts:251-260`: bundle/subgraph parsing relies on `readZipEntries`.
- `mdkg-dev/src/layouts/BaseLayout.astro:44`, `mdkg-dev/src/pages/demo/[id].astro:16-22`, `mdkg-dev/src/data/demoSnapshots.ts:34-148`: JSON-LD comes from repo-owned static metadata today.
