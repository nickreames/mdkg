---
id: edd-44
type: edd
title: Starlight TOC responsive docs content and accessibility contract
tags: [mdkg-dev, docs, accessibility]
owners: []
links: []
artifacts: []
relates: [goal-34, task-536, task-541, task-545, test-260, test-264, test-266]
refs: [archive://archive.mdkg-dev-preview-audit-pass-4-2026-06-24, edd-40]
aliases: []
created: 2026-06-24
updated: 2026-06-24
---
# Overview

Pass-4 identifies duplicated "On this page" output, cramped tables, weak heading outlines, and unmeasured accessibility as major docs professionalism and accessibility blockers.

# Architecture

- Keep Starlight as the docs framework.
- Tune page structure and TOC behavior per page.
- Remove hand-authored TOC sections when Starlight already generates TOC.
- Disable or simplify TOC on short pages.
- Replace dense tables with responsive sections or cards when mobile and crawled text become unreadable.
- Add automated and manual accessibility checks for key docs and marketing routes.

# Data model

Page QA record: route, H1 count, useful H2/H3 outline, TOC policy, table/component policy, code-block accessibility, focus behavior, mobile overflow status, and known exceptions.

# APIs / interfaces

Future a11y/perf smoke commands report key route status, violations, budgets, screenshots, and known exceptions.

# Failure modes

- Starlight defaults change or content disables useful navigation.
- Tables look acceptable on desktop but collapse in crawled/mobile text.
- Automated a11y passes while keyboard flow remains poor, so manual keyboard checks remain required.

# Observability

Record route-level a11y findings, focus-order notes, viewport sizes, and screenshot refs in checkpoints.

# Security / privacy

QA artifacts must not include secrets, private prompt payloads, tokens, or unpublished credentials.

# Testing strategy

Browser/Chrome checks run at desktop, tablet, and mobile widths. Automated a11y uses axe, pa11y, Lighthouse CI, or Playwright plus axe. Reduced-motion and high-contrast behavior are checked on homepage and docs theme.

# Rollout plan

Fix structural docs issues first, then introduce gates once route output is stable enough to avoid noisy failures.
