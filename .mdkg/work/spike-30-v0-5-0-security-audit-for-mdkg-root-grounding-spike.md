---
id: spike-30
type: spike
title: v0.5.0 security audit for mdkg root grounding spike
status: done
priority: 1
parent: loop-5
tags: [loop-template, audit, security, loop-fork, loop-child, spike, release-candidate]
owners: []
links: []
artifacts: [local-secret-pattern-scan:no-hits, temp-symlink-repro:escaped-write-confirmed, npm-pack-dry-run:189-files, node24-ci-release:572-tests]
relates: [loop-5]
blocked_by: []
blocks: []
refs: [loop-5, template://loops/security-audit, dec-71, chk-415, task-726, test-397, task-727, test-398, spike-27, task-688, goal-64]
context_refs: [root:goal-61]
evidence_refs: [dec-71, chk-415, task-726, test-397, task-727, test-398]
aliases: []
skills: [pursue-mdkg-loop]
created: 2026-07-10
updated: 2026-07-10
---
# Research Question

What source-grounded context, constraints, risks, and viable options should v0.5.0 security audit for mdkg root use for goal-61?

# Search Plan

- Inspect process execution, filesystem write, archive/bundle parsing, Git auth,
  SQLite query, public-site, and npm package surfaces.
- Scan tracked/local files for private-key and common provider-token signatures
  without printing candidate secret values.
- Inspect all four package lockfiles locally; do not call registries because
  `dec-71` leaves external advisories approval-gated.
- Revalidate `spike-27` against current ZIP-reader and graph-import source.
- Use bounded temp repositories for path-containment proof and remove them after
  the check.

# Findings

## S-1: graph target containment follows directory symlinks

- Classification: validated local path-containment vulnerability; release
  candidate blocker until `task-726` / `test-397` close.
- Source: `src/commands/graph.ts:417-458` performs lexical containment, accepts
  an existing empty target, then writes through `path.join(targetRoot, ...)`.
  It does not reject a symbolic-link target or resolve existing ancestors.
- Safe temp proof: an in-root `clones/demo` symlink pointed to an empty directory
  outside the root. `graph clone source --target clones/demo --json` exited 0
  and wrote the cloned `.mdkg/config.json` under the outside directory.
- Impact: the public containment promise can be bypassed when an operator runs a
  graph clone/fork/import into a symlink prepared inside the repository. The
  precondition and local-user authority limit severity, but the behavior is not
  acceptable for a command that explicitly promises root containment.
- Remediation direction: reject symlinks in the existing target path/ancestry,
  compare real paths for existing ancestors, create the destination only after
  the containment proof, and add no-write regression coverage.

## S-2: ZIP reader inflates before enforcing resource limits

- Classification: validated resource-exhaustion hardening gap; release
  candidate work in `task-727` / `test-398`.
- Source: `src/util/zip.ts:126-154` calls synchronous inflate for each entry with
  no raw-byte, entry-count, name-length, per-entry output, total-output, or
  compression-ratio limit. Bundle, graph, and subgraph readers call this path
  before manifest integrity checks can reject the payload.
- Impact: a crafted or accidentally huge local bundle can consume excessive
  memory/CPU before validation. This is denial-of-service risk, not evidence of
  disclosure or code execution.
- Prior evidence: `spike-27` reached the same conclusion during failed dogfood;
  current source confirms the gap still exists.

## Clean local lanes

- Credential/secret exposure: no tracked private-key files or common AWS,
  GitHub, OpenAI, or Slack token signatures were found. Public/source paths did
  not expose `/Users/...` paths; documented `/private/tmp` examples and an
  `${NPM_TOKEN}` placeholder are intentional.
- Process execution: product commands invoke fixed `git` executables with
  argument arrays; no `shell: true`, `eval`, or dynamic-function sink was found.
- Git credentials: `src/commands/git.ts` rejects embedded URL credentials and
  sanitizes command output before receipts.
- SQL: dynamic identifiers are constrained/quoted and data values use prepared
  statements in reviewed queue/event/index paths; no direct user-value SQL
  interpolation finding was validated.
- Public exposure: the static Astro surfaces contain one JSON-LD `set:html`
  path fed by source-controlled structured data; no user-controlled HTML sink
  was identified.
- Package/export: the dry-run tarball contains 189 allowlisted entries, including
  loop modules/templates/skill, and excludes repo graph, websites, examples,
  credentials, and local caches. The only install script prints local setup
  guidance and makes no network request.
- Dependency inventory: root runtime dependencies remain empty; root, docs,
  mdkg-dev, and demo lockfiles are present. Current advisory status is unknown
  by design and is truthfully waived only for this loop through `dec-71` and
  `chk-415`.

# Recommendation

1. Complete `task-726` / `test-397` before calling `goal-61` a verified release
   candidate.
2. Complete `task-727` / `test-398` with bounded fail-closed ZIP parsing before
   publication, using conservative defaults that preserve normal bundles.
3. Keep the formal provider-backed scan and current registry advisories in
   `task-688` / `goal-64`; do not convert the local waiver into a release waiver.
4. Preserve current fixed-command spawning, URL-credential redaction,
   parameterized SQL, public-bundle visibility, and package allowlist tests.

For S-1, the viable paths are:

- reject symlink targets/ancestors and validate real-path containment
  (recommended, portable, small blast radius);
- redesign writes around platform-specific no-follow directory handles (stronger
  but significantly more complex in portable Node);
- document targets as trusted and keep lexical checks only (rejected because it
  contradicts the command's containment contract).

For S-2, retain the three options from `spike-27`: bounded first-party reader
(recommended), streaming ZIP dependency, or trusted-input documentation only.

# Follow-Up Nodes To Create

- `task-726`: harden graph target writes against symlink containment escape.
- `test-397`: prove symlink targets fail before any outside write.
- `task-727`: bound ZIP parsing before bundle/subgraph inflation.
- `test-398`: prove oversized and high-expansion payloads fail closed while
  normal deterministic bundles remain compatible.
- `task-688` / `goal-64`: run approval-gated external advisories and the formal
  security-provider workflow before npm publication.

# Skill Candidates

- Add a security-loop closeout example showing typed local-only waivers that do
  not waive the final release gate.

# Evidence And Sources

- `src/commands/graph.ts:417-458`
- `src/util/zip.ts:126-154`
- `src/commands/bundle.ts:693-707`
- `src/graph/subgraphs.ts:105-107`
- `src/commands/git.ts:240-286`
- `scripts/postinstall.js`
- `package.json` and `npm pack --dry-run --json --ignore-scripts`
- `dec-71`
- `chk-415`
- Template: `template://loops/security-audit`

# Context And Constraints

# Options And Tradeoffs
