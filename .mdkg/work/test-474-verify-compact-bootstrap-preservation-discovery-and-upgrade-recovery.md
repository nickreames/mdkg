---
id: test-474
type: test
title: Verify compact bootstrap preservation discovery and upgrade recovery
status: done
priority: 1
parent: goal-81
tags: [alignment-002, execution-authorized]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [task-818]
blocks: []
refs: [edd-80, goal-81, dec-93]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: []
created: 2026-09-05
updated: 2026-09-05
---

# Overview

Acceptance contract for compact initialization and safe instruction discovery.
Executed under the user's explicit Goal 81 Run authorization on 2026-09-05.

# Target / Scope

task-816 through task-818 and edd-80. Use disposable repositories and seeded
fixtures only; canonical project/user documentation remains outside test mutation.

# Preconditions / Environment

Current built CLI, source-controlled legacy seed fixtures and temp Git repos.
Capture complete filesystem and Git-index fingerprints before each preview.
No network, provider or fleet access is required.

# Test Cases

| Case | Required result |
| --- | --- |
| Fresh default and --agent | Equivalent compact entrypoints, focused router, canonical skills and native adapters |
| --graph-only | Graph scaffold without agent guidance/skills/mirrors |
| Conflicting mode flags | Failure before first write |
| Existing graph-only upgrade | No implicit agent-mode adoption |
| Custom AGENTS/CLAUDE | Bytes outside managed units unchanged |
| Edited/duplicate/broken managed markers | Preserve content and report conflict |
| Known legacy seed | Previewed managed relocation with supported redirects |
| Missing/modified provenance | No filename-based adoption or overwrite |
| Repeated upgrade | Idempotent, no new semantic changes |
| Interrupted apply/recovery | Exact completed writes reported; bounded resume or recovery preserves later user edits |
| Links and resource paths | Resolve from both root wrappers and canonical/mirrored skills; no mandatory cycle |
| Project docs and website discovery | README/LICENSE/maintained docs/public llms assets remain unchanged unless separately owned |
| Ignore flags and custom mirrors | Existing ignore intent and configured targets preserved |
| Package output | Seed assets and command help agree with runtime behavior |

# Results / Evidence

All cases above passed. Runtime proof is in tests/commands/compact_bootstrap.test.ts,
upgrade_safety.test.ts, upgrade.test.ts, init.test.ts, cli_runtime.test.ts,
security_containment.test.ts and skills.test.ts, plus packaged init/upgrade smokes.
Fixtures compute complete file SHA-256 maps (including sentinel Git-index bytes),
bind upgrade plans to observed inputs and before/after operation hashes, compare
unowned bytes, and inject failures after each write in the bounded end-to-end
operation. Recovery tests cover completion and original-byte restoration,
including refusal after later user edits. Preview creates no lock, cache or journal.

- npm run test: 678/678 TypeScript tests and 26/26 public-release contract tests.
- Focused init/upgrade/CLI/containment run: 65/65.
- npm run build, npm run cli:check, npm run docs:check: passed; 474 checked
  documentation examples, zero failed examples.
- npm run smoke:upgrade: passed for packaged 0.5.2 in disposable fixtures.
- npm_config_offline=true npm run smoke:init: passed; compact default,
  explicit graph-only, --agent compatibility, manifests, mirrors and repeat init.
- Skill validation: 8 skills, zero warnings/errors; exact public/native parity.
- Graph validation: zero errors; three existing stale imported-bundle warnings
  remain outside scope. Final index/changed-only/diff checks are in closeout.
- No canonical checkout upgrade, source Git staging, commit, push, bundle
  refresh, provider action, deployment or package publication.

Local transient logs: /private/tmp/mdkg-goal81-final-tests.log,
/private/tmp/mdkg-goal81-focused-tests.log, /private/tmp/mdkg-goal81-smoke-upgrade.log
and /private/tmp/mdkg-goal81-smoke-init.log. These logs are not durable graph
authority; the source fixtures, command outcomes and checkpoint are the receipt.

# Notes / Follow-ups

Future gates: focused init/upgrade/skill tests, build, CLI parity, docs checks,
smoke:upgrade, skill validation and full graph validation. No release or fleet
migration dependency. Reject a larger mandatory handbook disguised as a router.
