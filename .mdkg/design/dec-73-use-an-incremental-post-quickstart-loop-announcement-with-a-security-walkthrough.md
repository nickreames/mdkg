---
id: dec-73
type: dec
title: Use an incremental post-quickstart loop announcement with a security walkthrough and dormant public routes
status: accepted
tags: [release, design, loops, mdkg-dev, docs, activation, public-alpha, pre-v1]
owners: []
links: []
artifacts: []
relates: [goal-62, goal-63, goal-64]
refs: [dec-68, edd-71, prd-11, goal-62, goal-63, goal-64, test-393]
aliases: [pre-v1-public-alpha-loop-release]
created: 2026-07-10
updated: 2026-07-10
---
# Context

The verified v0.5.0 loop release needs a clear public introduction without
reopening the broader mdkg.dev design or allowing website claims to outrun npm.
The current homepage already has a useful hero and quickstart, while the docs do
not yet give first-class loops a coherent conceptual and procedural home.

# Decision

- Keep the existing homepage hero and quickstart substantially unchanged.
- Add one incremental v0.5.0 loop announcement section immediately after the
  homepage quickstart. The generic quickstart remains the primary first-use path.
- Use `Run a security audit loop` as the announcement CTA to a purpose-built
  security walkthrough. Include a secondary text link to the loop overview.
- Use security as the first public example because it is understandable across
  codebases. Keep backend/API/CLI bloat as a secondary example.
- Use purpose-built commands and representative output derived from verified
  CLI contracts. Do not publish copied dogfood transcripts or internal ids.
- Preserve the exact `Pre-v1 public alpha` qualifier.
- Product Design produces exactly three incremental announcement-section
  variants grounded in the current homepage, not three homepage redesigns.
- Add a top-level `Loops` documentation group with overview, templates and
  forks, readiness/routing/evidence/closeout, and security walkthrough pages.
- A read-only audit makes no functional source changes, but may write mdkg
  findings, tasks, decisions, checkpoints, receipts, and other evidence nodes.
- Use one shared source-controlled draft/published release manifest across both
  Astro sites. Draft production builds must omit or make release routes
  unavailable and exclude release content from navigation, metadata, sitemaps,
  LLM files, and indexing. Hiding links alone is insufficient.
- Local preview may opt into the active release state without changing the
  committed draft state. Public version metadata must not advertise v0.5.0
  before npm verification.
- Do not add a dedicated marketing release page or broaden this release into a
  general site redesign.

# Alternatives considered

- Replace or substantially redesign the homepage hero. Rejected because the
  release needs a focused capability announcement and broader design work can
  proceed separately.
- Use backend/API/CLI bloat as the first walkthrough. Rejected as the primary
  example; it remains useful secondary proof, but security is more immediately
  legible across codebases.
- Split loop material across existing Concepts and Guides navigation. Rejected
  because a top-level group makes a first-class node type easier to learn.
- Hide dormant links while leaving routes and metadata public. Rejected because
  it can leak pre-publication claims and search indexing before npm proof.

# Consequences

Goal 62 audits and ideates only the new announcement section, then specifies the
top-level loop docs and shared activation contract. Goal 63 implements the
accepted direction locally with the release dormant. Goal 64 publishes npm
before changing the shared release state and verifying both production sites.

# Links / references

- `dec-68`
- `edd-71`
- `prd-11`
- `goal-62`
- `goal-63`
- `goal-64`
- `test-393`
