---
id: spike-3
type: spike
title: Research the primary-source AI coding capability timeline and claim matrix
status: done
priority: 1
epic: epic-3
parent: goal-3
next: task-11
tags: [ai-native-sdlc, presentation-demo, phase-3, step-1]
owners: [program-orchestrator]
links: []
artifacts: [deck/citations/claim-matrix.md]
relates: []
blocked_by: []
blocks: []
refs: [goal-3, epic-3, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-2, chk-4, chk-5]
context_refs: [goal-3, epic-3, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, goal-2, chk-4]
evidence_refs: []
aliases: [phase-3-step-1]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Research Question

What evidence, options, tradeoffs, and recommendation are required to research the primary-source ai coding capability timeline and claim matrix under Goal 3?

# Context and Constraints

- Use primary sources and a claim matrix for all externally checkable claims.
- Use the accepted six-era narrative as a loose pedagogical capability progression with overlapping product dates, not a strict product chronology.
- Reserve Codex and Claude Code as the principal long-horizon anchors; use other products only where direct primary evidence supports the exact wording.
- Prototype three representative slides in one coherent visual direction before full-deck production.
- Retain editable source, notes, citations, PPTX, contact sheet, and QA report.
- Prove 30–32 minute delivery with a 35-minute hard stop and fallback cues.
- This is step 1 of 8; do not perform successor implementation while researching.

# Search Plan

- Read goal-3, epic-3, prd-1, edd-1, and dec-1 through dec-6.
- Build separate primary-source rows for GitHub Copilot autocomplete, conversational prompt engineering, OpenAI o1 reasoning, Claude Code and Cursor tool use, Agent Skills/`SKILL.md`, and long-horizon multi-hour agents.
- Record overlapping release and milestone dates directly; do not imply clean handoffs between capability eras.
- Treat model capability, context length, reasoning, tool use, demonstrated task horizon, and guaranteed elapsed runtime as independent claims that each require direct support and careful paraphrase.
- Record source owner, URL, publication date, milestone date, exact supported claim, approved paraphrase, confidence, slide usage, and any material limitation for every row.
- Remove, soften, or hold every 8+ hour statement that lacks direct primary support.
- Do not treat vendor demonstrations, benchmark task horizons, and guaranteed elapsed runtime as equivalent evidence.
- Inspect the current owning graph, source, Git, artifacts, and runtime receipts named by the goal.
- Prefer primary sources and current command output over prior summaries.
- Record contradictory evidence and ownership gaps instead of guessing.

# Findings

- The primary-source matrix is recorded at `deck/citations/claim-matrix.md` with fourteen approved rows, source owners, URLs, publication and milestone dates, exact support, approved paraphrases, confidence, slide use, and limitations.
- The defensible sequence is GitHub Copilot autocomplete (2021), ChatGPT conversational coding (2022), OpenAI o1 reasoning (2024), Claude Code tool use (2025), Agent Skills conditional context (2025), and Codex/Claude long-horizon work (2025–26).
- The dates identify representative milestones. Capabilities overlap and accumulate; the matrix explicitly rejects strict era boundaries.
- Model reasoning, context capacity, harness tools, and task horizon have separate rows and are not treated as interchangeable.
- OpenAI directly supports an eight-hour statement only as estimated human-equivalent task size in a usage study. METR separately confirms that benchmark time horizon is task difficulty rather than elapsed runtime. The general claim that coding agents “run autonomously for 8+ hours” is rejected.
- Anthropic’s long-running harness evidence directly supports multi-context-window work spanning hours or days and the need for durable requirements, progress records, and verification.
- Cursor remains a supporting harness example because current first-party documentation supports its search/edit/terminal capability but not a dated historical milestone.
- Current repository source at `580be1e6efffe852e9996186e85e2bcbcd3e3e3b` supports the pre-v1 public-alpha and Plan -> Work -> Evidence product wording.
- No contradictory primary evidence requires changing the six-stage narrative. The material risk is overclaiming chronology or horizon, and the approved caveats address it.

# Recommendation

Proceed to `task-11` using the overlapping six-stage capability progression. Use one memorable product anchor per stage, make the long-horizon evidence caveat visible on-slide, and use the capability progression as the hinge into durable specifications, guardrails, and evidence.

# Options And Tradeoffs

1. Strict product chronology: easy to scan, but implies false handoffs and invites disputes over overlapping releases. Reject.
2. Vendor comparison: recognizable, but dilutes the architecture and planning argument. Reject.
3. Benchmark-led story: quantitative, but collapses probabilistic task difficulty into apparent runtime or productivity. Reject.
4. Overlapping capability progression: slightly more nuanced, but directly supports the AI-native SDLC thesis and preserves evidence precision. Accept.

# Follow-Up Nodes To Create

- Continue to task-11 only after this spike records a supported recommendation.

# Skill Candidates

- Record a candidate only if execution reveals a genuinely reusable workflow gap.

# Security and Public-Safety Notes

- Retain no raw prompts, credentials, tokens, cookies, provider payloads, or unrelated private context.

# Evidence and Sources

- `deck/citations/claim-matrix.md`
- GitHub Copilot launch, OpenAI ChatGPT/o1/Codex/GPT-4.1 sources, Anthropic Claude Code/Agent Skills/context/harness sources, Cursor Agent documentation, and METR methodology are individually recorded in the matrix.
- Repository evidence: `package.json`, `docs/start-here/public-alpha-contract.md`, and `mdkg-dev/src/pages/index.astro` at `580be1e6efffe852e9996186e85e2bcbcd3e3e3b`.
