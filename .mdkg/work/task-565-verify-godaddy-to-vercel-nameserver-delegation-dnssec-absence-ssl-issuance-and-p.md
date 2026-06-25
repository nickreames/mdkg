---
id: task-565
type: task
title: verify GoDaddy to Vercel nameserver delegation DNSSEC absence SSL issuance and propagation
status: todo
priority: 1
epic: epic-190
parent: goal-36
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-564]
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Verify DNS delegation, DNSSEC/DS safety, Vercel DNS records, recursive propagation, and SSL health for the production names.

# Acceptance Criteria

- `mdkg.dev` NS records point to `ns1.vercel-dns.com` and `ns2.vercel-dns.com`.
- Vercel authoritative DNS returns expected records for apex, www, and docs.
- Recursive DNS agrees or remaining propagation variance is documented with TTLs.
- DNSSEC/DS state does not block Vercel-managed DNS.
- HTTPS certificates are valid for apex, www, and docs before the task closes.

# Files Affected

- mdkg checkpoints/evidence only.

# Implementation Notes

- Use `dig` against recursive DNS and Vercel authoritative nameservers.
- If SSL or DNS remains inconsistent, pause with exact failing domain evidence instead of forcing closeout.

# Test Plan

- DNS command receipts for `NS`, `SOA`, `A`, and `CNAME` checks.
- HTTPS `curl -I` receipts without `-k` for all production names.

# Links / Artifacts

- `test-282`
- `test-283`
