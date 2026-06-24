---
id: edd-48
type: edd
title: preview docs URL and environment-aware external link contract
tags: [mdkg-dev, docs, vercel-preview, links]
owners: []
links: []
artifacts: [archive://archive.mdkg-dev-preview-audit-pass-5-2026-06-24]
relates: []
refs: [archive://archive.mdkg-dev-preview-audit-pass-5-2026-06-24]
aliases: []
created: 2026-06-24
updated: 2026-06-24
---
# Context

Preview users need working docs links today, while `docs.mdkg.dev` remains a future DNS/production launch action.

# Contract

- Preview CTAs, header links, footer links, and the marketing docs bridge target `https://mdkg-docs.vercel.app/`.
- Copy may mention that `docs.mdkg.dev` is the intended production docs host, but it must not send preview users to an unconfigured domain.
- External links open safely with clear labels and do not hide broken route behavior.
- Tests distinguish preview behavior from future production canonical behavior.

# Acceptance

`test-270` proves all public docs CTAs resolve to the preview docs host during this goal and records any future production redirect work as deferred.

# Overview

# Architecture

# Data model

# APIs / interfaces

# Failure modes

# Observability

# Security / privacy

# Testing strategy

# Rollout plan
