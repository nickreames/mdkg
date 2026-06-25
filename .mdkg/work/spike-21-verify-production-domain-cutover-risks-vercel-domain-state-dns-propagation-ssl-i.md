---
id: spike-21
type: spike
title: verify production-domain cutover risks Vercel domain state DNS propagation SSL issuance and indexability controls
status: todo
priority: 1
parent: goal-36
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
# Research Question

What domain, DNS, SSL, Vercel, and indexability risks must be resolved before mdkg.dev and docs.mdkg.dev can be treated as production custom-domain surfaces?

# Context And Constraints

- `mdkg.dev` is the canonical marketing host.
- `www.mdkg.dev` redirects to apex.
- `docs.mdkg.dev` is the canonical docs host.
- Production domains are indexable immediately after verification.
- Preview `*.vercel.app` hosts remain noindex.
- Public announcement, analytics activation, npm publish, git tag, and GitHub settings mutation are out of scope.

# Search Plan

- Inspect Vercel project domain settings for `mdkg-dev` and `mdkg-docs`.
- Probe DNS through recursive and authoritative Vercel nameservers.
- Check HTTPS route headers and bodies for apex, www, and docs.
- Verify robots, sitemap, canonical, and metadata behavior after production deployment.
- Use Browser/Chrome screenshots for visible proof.

# Findings

- Pending.

# Options And Tradeoffs

- Use Vercel-managed DNS for all three production names; centralizes records and SSL issuance but requires Vercel domain status proof.
- Pause on unresolved DNS/SSL propagation; slower closeout but avoids recording a false launch-ready state.

# Recommendation

Verify or attach Vercel custom domains first, then make the minimal source changes required for `mdkg.dev/docs` redirect and production indexability.

# Follow-Up Nodes To Create

- Existing scoped tasks/tests under `goal-36` are the follow-up work queue.

# Skill Candidates

- If repeated, capture the Chrome/Vercel/DNS/Browser production cutover sequence as a future mdkg skill.

# Data Structures And Algorithms Notes

- Keep production-domain receipts as refs/checkpoints, not as source-level runtime state.

# UX Notes

- Browser proof must confirm users land on the marketing site at apex and docs at the docs host without preview-domain confusion.

# Security Notes

- Do not store Vercel tokens, DNS credentials, or private account screenshots in mdkg evidence.

# mdkg.dev Launch Implications

- Completion makes custom domains live and indexable, but launch announcement remains a separate action.

# Evidence And Sources

- Pending Vercel, DNS, Browser, Chrome, and route receipts.
