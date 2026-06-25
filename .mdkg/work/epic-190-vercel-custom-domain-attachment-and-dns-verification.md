---
id: epic-190
type: epic
title: Vercel custom-domain attachment and DNS verification
status: todo
priority: 1
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Goal

Verify Vercel custom-domain ownership, DNS delegation, DNS records, SSL issuance, and propagation for all production names.

# Scope

- `mdkg.dev` and `www.mdkg.dev` on `mdkg-dev`.
- `docs.mdkg.dev` on `mdkg-docs`.
- Vercel UI/tooling evidence, GoDaddy-to-Vercel delegation proof, DNSSEC/DS absence, and HTTPS certificate checks.

# Milestones

- `task-564` verifies Vercel domain attachment.
- `task-565` verifies DNS and SSL health.
- `test-282` and `test-283` prove the contract.

# Out of Scope

- Public announcement and production analytics activation.
- Using non-Vercel DNS records unless the Vercel-managed path is blocked.

# Risks

- DNS propagation can be mixed across resolvers.
- SSL issuance may lag domain attachment.

# Links / Artifacts

- Vercel project `mdkg-dev`
- Vercel project `mdkg-docs`
