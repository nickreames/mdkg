---
id: edd-49
type: edd
title: Starlight TOC code block copy button and accessibility contract
tags: [mdkg-dev, starlight, accessibility, docs]
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

The docs preview still has duplicated or noisy page outlines in places, and command-heavy docs need accessible, readable code blocks.

# Contract

- Each docs page exposes one coherent heading outline and avoids duplicated Starlight TOC output.
- Heading hierarchy is logical for screen readers and browser reader modes.
- Command/code blocks are responsive, readable on mobile, and copyable where the framework supports it.
- Focus states, skip navigation, reduced motion, and keyboard use remain intact after layout changes.

# Acceptance

`test-271` and `test-278` cover heading outline, TOC behavior, code-block usability, and accessibility regression checks.

# Overview

# Architecture

# Data model

# APIs / interfaces

# Failure modes

# Observability

# Security / privacy

# Testing strategy

# Rollout plan
