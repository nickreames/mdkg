---
id: rule-guide
type: rule
title: Focused mdkg workflow
tags: [mdkg, guidance]
owners: []
links: []
artifacts: []
relates: []
refs: [rule-1, rule-2, rule-3]
aliases: []
created: 2026-09-09
updated: 2026-09-09
---

# Purpose

Find the smallest useful context, perform scoped work, and retain verified memory.

# Scope

Run commands from the project root. Compact agent setups route AGENTS.md and
CLAUDE.md through .mdkg/AGENT_START.md. Graph-only setups can use this guide
without those adapters or default skills.

# Requirements

1. Inspect supplied work with `mdkg show <qid>`. For a supplied goal use
   `mdkg goal show <qid>` and `mdkg goal next <qid>`.
2. Otherwise search with `mdkg search "<topic>"`.
3. Discover relevant procedures with `mdkg skill search "<topic>"` and
   `mdkg skill show <slug>`; missing optional skills are not implicit install authority.
4. Preview focused context with
   `mdkg pack <qid> --pack-profile concise --dry-run --stats`.
5. Under accepted ownership, record execution with `mdkg task start <qid>`,
   validate the work, and use `mdkg task done <qid>` with evidence.
6. Record unresolved findings without claiming completion.

# Validation

Use `mdkg validate` plus task-specific checks. For exact flags use
`mdkg help <command>`; do not load the entire command reference by default.
