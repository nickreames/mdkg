---
id: spike-3
type: spike
title: research mdkg.dev security trust and no secret posture
status: done
priority: 2
epic: epic-81
parent: goal-15
tags: [mdkg-dev, security, trust, no-secrets, spike]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-15
updated: 2026-06-15
---
# Research Question

What trust posture should `mdkg.dev` publish so users understand mdkg's
local-first boundaries, no-secret policy, generated state, and security
responsibilities without overclaiming?

# Context And Constraints

- mdkg stores durable project memory in local files and optional local SQLite
  project DB state. Public docs must explain what is commit-eligible, ignored,
  generated, runtime-only, or private.
- mdkg does not execute workers in the current public surface. Docs must avoid
  implying automatic execution or hosted queue behavior.
- Website implementation is out of scope; this spike feeds security/trust docs.

# Search Plan

- Review mdkg README, command matrix, project DB docs, no-secret boundaries, and
  visibility/subgraph behavior.
- Use OWASP and NIST secure development sources for baseline language around
  secure practices and secrets management.

# Findings

- The strongest trust message is simple: mdkg is local-first project memory,
  not a hosted control plane.
- Public docs should distinguish committed graph memory, generated caches,
  optional runtime DB files, sealed state, archive sidecars, and materialized
  subgraph inspection trees.
- Security posture should emphasize no secrets in mdkg graph files, explicit
  visibility controls for packs/bundles, dry-run-first repair/upgrade planning,
  and no-cross-repo mutation.
- `mdkg.dev` should include a "What mdkg will not do" trust section: no worker
  execution, no arbitrary SQL exposure, no automatic web search, no automatic
  `SKILL.md` creation, and no hidden publish/tag/push.

# Options And Tradeoffs

- Short trust page: easier to read, but may miss important state-policy details.
- Deep security appendix: complete, but many users will skip it.
- Layered trust docs: concise trust page plus detailed state-policy reference.
  This is the best fit for launch.

# Recommendation

Create a layered trust section:

- Trust overview: local-first, explicit mutation, no worker execution, no
  secret storage.
- State policy: graph files, generated indexes, project DB runtime, sealed DB
  snapshots, archive sidecars, subgraphs, materialized trees.
- Operator safety: dry-run commands, strict doctor, fix plan receipts,
  visibility-safe packs, no-cross-repo mutation.
- Security checks: public docs no-secret audit, example redaction, and release
  gates.

# Follow-Up Nodes To Create

- `task-358`: require a local-state policy table and "not a hosted worker"
  section.
- `test-149`: scan public docs/examples for token-like strings, private paths,
  and unsupported execution claims.
- `task-362`: include final security posture and no-secret audit in launch
  readiness.
- `task-370`, `task-371`, and `test-157`: connect trust claims to state-boundary
  proof.

# Skill Candidates

- Public no-secret docs audit skill for examples, generated docs, and launch
  pages.
- Trust-posture writing skill for local-first CLI tools with generated state and
  optional runtime DBs.

# Data Structures And Algorithms Notes

- A public state-policy table should include `path`, `owner`, `generated`,
  `commit_policy`, `contains_secrets`, `validation_command`, and `redaction`.
- Pack visibility enforcement should remain a graph traversal and filtering
  problem, not copy-editing.

# UX Notes

- Trust docs should be concrete enough to answer "can I commit this file?" and
  "will this command mutate another repo?" quickly.
- Use caution labels only where they change behavior; avoid a page full of
  generic warnings.

# Security Notes

- Treat secrets management as a hard doc boundary: mdkg examples should use
  placeholders or redacted refs, never live tokens.
- Document NPM_TOKEN publish auth as a release-process concern, not an mdkg
  graph artifact.

# mdkg.dev Launch Implications

- Launch should block on `test-149` and no-secret docs audit evidence.
- Trust copy must be reviewed before SEO/marketing pages, because positioning
  depends on these boundaries.

# Evidence And Sources

- Local evidence: README state policy sections, `CLI_COMMAND_MATRIX.md`,
  `scripts/assert-publish-ready.js`, `scripts/smoke-visibility.js`,
  `scripts/smoke-subgraph.js`, `scripts/smoke-db-snapshot.js`.
- OWASP Secrets Management Cheat Sheet:
  https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
- OWASP Top Ten project:
  https://owasp.org/www-project-top-ten/
- NIST SSDF SP 800-218:
  https://csrc.nist.gov/pubs/sp/800/218/final
