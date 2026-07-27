---
id: test-7
type: test
title: Verify every presentation claim and citation
status: backlog
priority: 1
epic: epic-3
parent: goal-3
prev: task-14
next: test-8
tags: [ai-native-sdlc, presentation-demo, phase-3, step-6]
owners: [program-orchestrator]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-3, epic-3, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-14]
context_refs: [goal-3, epic-3, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-14]
evidence_refs: []
aliases: [phase-3-step-6]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
cases: [github_copilot_autocomplete, conversational_prompt_engineering, openai_o1_reasoning, claude_code_cursor_tool_use, agent_skills_skill_md, long_horizon_multi_hour, context_engineering_claim, mdkg_maturity_wording]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Validate verify every presentation claim and citation as step 6 of Goal 3. A passing result must include exact commands or observations, reviewed outputs, and public-safe evidence.

# Target / Scope

- goal-3
- epic-3
- task-14

# Preconditions / Environment

- Goal 3 Activation Conditions and writer ownership are accepted.
- All predecessor nodes are done with evidence.
- The current source, Git, graph, artifact, and provider state has been re-read where applicable.

# Test Cases

- Every factual claim has a complete primary-source row and approved paraphrase.
- GitHub Copilot, conversational prompt engineering, OpenAI o1, Claude Code/Cursor, Agent Skills/`SKILL.md`, and multi-hour agents each have a directly supporting primary-source row.
- Any 8+ hour, context-length, reasoning, or capability claim is independently supported and does not overgeneralize.
- The story includes spec-driven requirements, architecture decisions, guardrails, Plan -> Work -> Evidence, what/why/next, creator motivation, public-alpha/pre-v1 active-improvement wording, and CTA.
- All slides render without overlap, clipping, low contrast, unreadable citations, or note drift.
- Timed kickoff, narrative, reveal, fallback, recovery, and CTA finish by 35 minutes.
- This test specifically proves: Verify every presentation claim and citation.
- Any skipped or unavailable check is a failure or explicit blocker, not an implicit pass.

# Results / Evidence

Pending activation. Record pass/fail per case, commands, hashes, routes, screenshots or receipts, warnings, and follow-up refs.

# Notes / Follow-ups

- Do not advance to test-8 until the required result is evidenced.
