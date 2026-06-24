---
id: epic-160
type: epic
title: local-first low-dependency trust and safety posture
status: backlog
priority: 1
tags: [mdkg-dev, trust, safety]
owners: []
links: []
artifacts: [mdkg_preview_polish_pass2]
relates: []
blocked_by: []
blocks: []
refs: [archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-23
updated: 2026-06-23
---
# Goal

Explain mdkg's local-first and low-dependency posture without overclaiming.

# Scope

- Security/trust page.
- Supply-chain-safe install guidance.
- What-mdkg-is-not boundaries.
- Queue/MCP/public-alpha caveats where relevant.

# Milestones

- Trust copy is concrete and conservative.
- Public examples avoid raw secrets, prompts, tokens, and provider payloads.

# Out of Scope

- Comprehensive secret scanning claims.

# Risks

- Security copy can easily imply guarantees the CLI does not provide.

# Links / Artifacts

- `P1-014`
- `P1-025`
- `P2-033`
