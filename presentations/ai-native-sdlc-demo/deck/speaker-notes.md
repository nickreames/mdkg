# AI-Native Software Development: Narrative, Slide Contract, and Timing

Status: V3 audience-facing stage-readiness revision  
Format: custom Ocean Flow 16:9 PowerPoint  
Audience: engineers and engineering leaders across enterprise and personal-project contexts  
Communication job: by the end, the audience should understand that capable coding agents still need durable specifications, guardrails, and evidence to form a dependable software-development lifecycle.

## Timing contract

- Segment A — narrated deck: 31:05 target; acceptable range 30:00–32:00.
- Segment B — live reveal plus CTA: 2:50 target; maximum 3:00.
- Total content target: 33:55; hard stop: 35:00.
- Audience Q&A begins only after the hard stop.
- If the narrated deck reaches 32:00, cut supporting examples from slides 6 and 9. Never cut the context-engineering conclusion, reveal, or CTA.
- The live coding goal is sent within the opening minute.

## Visual and editorial contract

- One primary claim and one narrative job per slide.
- Use the approved light-mode Ocean Flow system: a pale `#F7FBFD` canvas, navy typography, dark teal/blue structure, warm coral only for boundaries or contrast, one dark hierarchy anchor where needed, and generous negative space.
- Use 50 pt minimum for the deck title, 35 pt for slide titles, 24 pt for subheads, and 16 pt for body and evidence text.
- Show progression as accumulating capability, not six mutually exclusive eras.
- Use product names as anchors, not as competitors in a leaderboard.
- Put compact numbered source markers on claim-heavy slides.
- Put complete claim and asset provenance in each slide’s `[Sources]` block.
- Keep the final sources slide unspoken.

## Slide-by-slide contract

### Slide 1 — AI-Native Software Development

- Narrative job: establish the destination and dispatch the live demo before the first minute ends.
- Primary claim: the presentation will show how the unit of coding work changed—and why the SDLC must change with it.
- Visual: title over a single current line that enters as a cursor and exits as a durable graph path, with a concise audience-facing “Live coding goal starts now” cue.
- Time: 0:45
- Speaker cue: “Before we start, I’m giving a coding agent a goal. It will work while we talk; near the end we will inspect both the result and the evidence.”
- Live action: send the frozen Goal 7 prompt when that future event authority exists. For this offline rehearsal, start only the fixture-backed cue clock.

[Sources]
- No external factual claim. Presentation program contract: `presentations/ai-native-sdlc-demo/.mdkg/design/dec-2-use-a-source-backed-mixed-audience-ai-native-sdlc-narrative.md`.
[/Sources]

### Slide 2 — The unit of work kept expanding

- Narrative job: frame the talk as a capability progression, not a product-history lecture.
- Primary claim: AI coding moved from completing a token stream toward pursuing bounded goals across tools and time.
- Visual: one horizontal current widening from “line” to “goal”; six unlabeled capability ticks foreshadow the timeline.
- Time: 1:40
- Speaker cue: “These stages overlap. New capabilities accumulate; they do not invalidate autocomplete, chat, or direct editing.”

[Sources]
- Claim synthesis from claim matrix C01–C12: `deck/citations/claim-matrix.md`.
[/Sources]

### Slide 3 — 2021 · Autocomplete

- Narrative job: make the original interaction model concrete.
- Primary claim: GitHub Copilot brought whole-line and whole-function suggestions into the typing loop.
- Visual: editor-like line with a translucent suggestion completing into solid type.
- Unit of work: the next line or function.
- Human role: author and accept/reject.
- Remaining context constraint: mostly the code currently visible or retrieved by the editor.
- Time: 1:50
- Footnote marker: `[1]`

[Sources]
- [1] GitHub, “Introducing GitHub Copilot: your AI pair programmer,” 2021-06-29: https://github.blog/news-insights/product-news/introducing-github-copilot-ai-pair-programmer/
[/Sources]

### Slide 4 — 2022 · Prompt engineering / conversational coding

- Narrative job: show the jump from passive suggestion to iterative dialogue.
- Primary claim: conversational models let developers generate, explain, challenge, and refine code through follow-up turns.
- Visual: three short prompt/response turns arranged as a tightening spiral: generate → explain → refine.
- Unit of work: a requested snippet, explanation, or revision.
- Human role: prompt engineer, reviewer, and source of missing context.
- Remaining context constraint: the conversation is useful but ephemeral and easy to steer inconsistently.
- Time: 2:00
- Footnote marker: `[2]`

[Sources]
- [2] OpenAI, “Introducing ChatGPT,” 2022-11-30: https://openai.com/index/chatgpt/
[/Sources]

### Slide 5 — 2024 · Reasoning

- Narrative job: distinguish better problem solving from simply producing more text.
- Primary claim: o1 made additional test-time reasoning a visible capability lever for difficult problems.
- Visual: one problem enters a deliberate branching path that checks, revises, and converges.
- Unit of work: a multi-step problem.
- Human role: define the problem and validate the conclusion.
- Remaining context constraint: reasoning quality cannot recover requirements that were never supplied.
- Time: 2:10
- Footnote marker: `[3]`

[Sources]
- [3] OpenAI, “Learning to reason with LLMs,” 2024-09-12: https://openai.com/index/learning-to-reason-with-llms/
[/Sources]

### Slide 6 — 2025 · Tool-using coding agents

- Narrative job: explain why the harness matters as much as the model.
- Primary claim: Claude Code, Cursor, and comparable harnesses connected models to search, file editing, terminals, tests, and source control.
- Visual: model core surrounded by five tool ports; the terminal and test ports glow as the concrete examples.
- Unit of work: a repository change.
- Human role: grant boundaries, supervise decisions, and review the diff.
- Remaining context constraint: tools increase reach and blast radius; they do not define intent or acceptable evidence.
- Time: 2:10
- Optional cut: omit the supporting Cursor sentence if the deck is running long.
- Footnote markers: `[4] [5]`

[Sources]
- [4] Anthropic, “Claude 3.7 Sonnet and Claude Code,” 2025-02-24: https://www.anthropic.com/news/claude-3-7-sonnet
- [5] Cursor, “Agent Overview,” accessed 2026-07-26: https://docs.cursor.com/en/agent/overview
[/Sources]

### Slide 7 — 2025 · Conditional context

- Narrative job: introduce Agent Skills as a bridge from reusable prompts to task-triggered procedural knowledge.
- Primary claim: `SKILL.md` packages instructions and resources that an agent discovers and loads when relevant.
- Visual: a compact skill card entering the active context only after a matching task signal.
- Unit of work: a specialized workflow.
- Human role: encode and maintain reusable practice.
- Remaining context constraint: skill selection helps, but project state and cross-session evidence still need durable ownership.
- Time: 2:00
- Footnote marker: `[6]`

[Sources]
- [6] Anthropic, “Equipping agents for the real world with Agent Skills,” 2025-10-16; open-standard update 2025-12-18: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
[/Sources]

### Slide 8 — 2025–26 · Long-horizon, goal-driven work

- Narrative job: establish that the unit of work can now be a delegated engineering goal.
- Primary claim: current coding agents can iterate through tools and validation over multi-context-window work, while usage studies show requests with much larger human-equivalent task sizes.
- Visual: two concrete evidence panels. The first shows the 25.6% Codex usage-study result; the second shows durable state carrying one long-running goal across multiple context windows.
- Unit of work: a bounded goal that may span many agent turns or sessions.
- Human role: architect, specify, constrain, and evaluate.
- Remaining context constraint: continuity and completion criteria become system-design problems.
- Time: 2:20
- Footnote markers: `[8] [9] [12]`
- Mandatory caveat on slide: “Human-equivalent task size is not elapsed agent runtime.”

[Sources]
- [8] OpenAI, “How agents are transforming work,” 2026-06-25: https://openai.com/index/how-agents-are-transforming-work/
- [9] Anthropic, “Effective harnesses for long-running agents,” 2025-11-26: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- [12] METR, “Task-Completion Time Horizons of Frontier AI Models,” last updated 2026-05-08: https://metr.org/time-horizons/
[/Sources]

### Slide 9 — Four things improved together

- Narrative job: separate the capability dimensions that are often collapsed into “the model got better.”
- Primary claim: model capability, context capacity, harness/tool access, and task horizon are distinct and mutually reinforcing.
- Visual: four parallel currents feeding one wider channel.
- Time: 1:40
- Optional cut: present only the four labels and skip examples if the deck is running long.
- Footnote markers: `[3] [4] [8] [10]`

[Sources]
- [3] OpenAI, “Learning to reason with LLMs,” 2024-09-12: https://openai.com/index/learning-to-reason-with-llms/
- [4] Anthropic, “Claude 3.7 Sonnet and Claude Code,” 2025-02-24: https://www.anthropic.com/news/claude-3-7-sonnet
- [8] OpenAI, “How agents are transforming work,” 2026-06-25: https://openai.com/index/how-agents-are-transforming-work/
- [10] OpenAI, “Introducing GPT-4.1 in the API,” 2025-04-14: https://openai.com/index/gpt-4-1/
[/Sources]

### Slide 10 — Bigger context is capacity, not continuity

- Narrative job: overturn the assumption that a larger window is a project-memory system.
- Primary claim: one-million-token capacity and long-context improvements coexist with retrieval limits and the need to curate high-signal context.
- Visual: a large translucent reservoir feeding a deliberately narrow, labeled working channel.
- Time: 2:10
- Footnote markers: `[10] [11]`

[Sources]
- [10] OpenAI, “Introducing GPT-4.1 in the API,” 2025-04-14: https://openai.com/index/gpt-4-1/
- [11] Anthropic, “Effective context engineering for AI agents,” 2025-09-29: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
[/Sources]

### Slide 11 — Context engineering becomes SDLC engineering

- Narrative job: land the central takeaway before introducing mdkg.
- Primary claim: capable coding agents still need durable specifications, guardrails, and evidence to form a dependable SDLC.
- Visual: three durable anchors—specification, guardrail, evidence—holding an agent current on course.
- Time: 1:50
- Do not cut.
- Footnote markers: `[9] [11]`

[Sources]
- [9] Anthropic, “Effective harnesses for long-running agents,” 2025-11-26: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- [11] Anthropic, “Effective context engineering for AI agents,” 2025-09-29: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
[/Sources]

### Slide 12 — Why I built mdkg

- Narrative job: provide a brief, personal transition without turning the talk into a founder story.
- Primary claim: the creator wanted to close gaps in AI coding tools and increase personal-project velocity by spending more human attention on architecture and planning.
- Visible section label: “WHY MDKG.”
- Visual: noisy operational fragments recede; “architecture” and “planning” remain crisp at center.
- Time: 1:10
- Speaker cue: “I wanted to move faster on personal projects, but the part I cared about was not typing more code. It was making the architecture and planning decisions—and giving agents enough durable structure to execute them.”

[Sources]
- First-person creator account; no external factual claim.
[/Sources]

### Slide 13 — The missing layer is durable project state

- Narrative job: define the problem mdkg addresses without presenting a CLI feature list.
- Primary claim: chat transcripts and large prompts do not, by themselves, preserve scope, decisions, authority, accepted evidence, and next work as reviewable project state.
- Visual: five project-state cards escaping a fading chat bubble and locking into a repository.
- Time: 1:50

[Sources]
- Product-design claim and program requirements: `presentations/ai-native-sdlc-demo/.mdkg/design/prd-1-ai-native-sdlc-presentation-and-live-demo-program-requirements.md`.
[/Sources]

### Slide 14 — Plan → Work → Evidence

- Narrative job: introduce the smallest memorable mdkg operating model.
- Primary claim: dependable agentic work connects an explicit plan to bounded execution and inspectable proof.
- Visual prototype candidate: three asymmetric current pools connected by a single verified flow; “requirements,” “bounded node,” and “receipts” are the concrete examples. The closing band states that accepted evidence—not output alone—is the finish line.
- Time: 2:00
- Footnote marker: `[14]`

[Sources]
- [14] mdkg repository, canonical landing-page source at inspected commit `580be1e6efffe852e9996186e85e2bcbcd3e3e3b`: https://github.com/nickreames/mdkg/blob/580be1e6efffe852e9996186e85e2bcbcd3e3e3b/mdkg-dev/src/pages/index.astro
[/Sources]

### Slide 15 — Three context questions

- Narrative job: make the operating model useful to engineers and leaders immediately.
- Primary claim: durable project state should answer what completed, why it was done, and what comes next.
- Visible section label: “RECOVERABLE PROJECT STATE.”
- Visual: a vertical evidence ledger with the three questions as oversized labels.
- Time: 1:40
- Footnote marker: `[14]`

[Sources]
- [14] mdkg program requirements and canonical product source: https://github.com/nickreames/mdkg/blob/580be1e6efffe852e9996186e85e2bcbcd3e3e3b/mdkg-dev/src/pages/index.astro
[/Sources]

### Slide 16 — mdkg keeps the human at the architecture layer

- Narrative job: position mdkg as Git-native context engineering, not an agent harness or replacement for engineering judgment.
- Primary claim: structured Markdown can keep goals, requirements, decisions, work, and checkpoints addressable in the repository while coding agents use their existing tools.
- Visual: human decisions above a repo-owned graph; Codex, Claude Code, and other harnesses attach below as interchangeable execution surfaces.
- Time: 2:15
- Footnote markers: `[13] [14]`

[Sources]
- [13] mdkg repository, “Public Alpha Contract,” inspected at `580be1e6efffe852e9996186e85e2bcbcd3e3e3b`: https://github.com/nickreames/mdkg/blob/580be1e6efffe852e9996186e85e2bcbcd3e3e3b/docs/start-here/public-alpha-contract.md
- [14] mdkg repository, canonical landing-page source: https://github.com/nickreames/mdkg/blob/580be1e6efffe852e9996186e85e2bcbcd3e3e3b/mdkg-dev/src/pages/index.astro
[/Sources]

### Slide 17 — A reusable specification becomes bounded execution

- Narrative job: prepare the audience to read the reveal as source-to-execution proof.
- Primary claim: the value is visible in the contrast between a reusable starting specification and a specialized execution contract containing audience, requirements, bounded work, and evidence.
- Visual: source `goal-1` on the left and specialized `goal-1` on the right. The accepted Goal 2 interface supplies the fixed and variable fields without claiming that Demo 2 or Demo 3 has completed.
- Time: 1:35
- Speaker cue: “I am not asking you to learn graph mechanics. Read this as a reusable starting specification becoming a bounded, specialized execution.”

[Sources]
- Demo architecture contract: `presentations/ai-native-sdlc-demo/.mdkg/design/edd-1-ai-native-sdlc-presentation-demo-program-architecture-and-execution.md`.
[/Sources]

### Slide 18 — Live reveal

- Narrative job: provide a clean transition from the deck to the browser-based proof without exposing the presenter’s branch decision tree.
- Visible slide: “Let’s inspect the run,” followed by “Source specification → specialized goal → output → evidence” and the three context questions.
- Time: 2:05 target; 2:15 maximum.
- Success branch: show canonical source `goal-1`, specialized Demo 3 `goal-1`, landing page, Plan → Work → Evidence, and exact-SHA/live-route receipts.
- Still-running branch: show current goal progress and the sealed Demo 2 fallback; state plainly that Demo 3 is still running.
- Hard-blocker branch: show the blocker receipt, explain the stopped authority boundary, and reveal sealed Demo 2; do not claim Demo 3 succeeded.
- Offline Goal 3 rehearsal: use only Goal 2 fixtures and interface contracts. Do not imply Demo 2 or Demo 3 exists.

[Sources]
- Event and fallback contract: `presentations/ai-native-sdlc-demo/.mdkg/work/goal-7-execute-and-reveal-the-live-demo-3-goal.md`.
[/Sources]

### Slide 19 — Try mdkg on one real project

- Narrative job: close with a bounded, honest invitation.
- Primary claim: mdkg is a pre-v1 public alpha; the requested next step is to try the quickstart and send improvement feedback.
- Visual: two local QR placeholders in the final deck—Quickstart and GitHub Issues—with readable text URLs.
- Time: 0:45 target; 0:45 maximum.
- Spoken close: “Try mdkg on one real project and send me feedback.”
- URLs:
  - https://docs.mdkg.dev/start-here/quickstart/
  - https://github.com/nickreames/mdkg/issues
- Footnote marker: `[13]`

[Sources]
- [13] mdkg repository, “Public Alpha Contract,” inspected at `580be1e6efffe852e9996186e85e2bcbcd3e3e3b`: https://github.com/nickreames/mdkg/blob/580be1e6efffe852e9996186e85e2bcbcd3e3e3b/docs/start-here/public-alpha-contract.md
[/Sources]

### Slide 20 — Sources

- Narrative job: provide an unspoken appendix index for the numbered markers.
- Primary claim: none.
- Visible section label: “REFERENCE.”
- Visual: compact two-column source index `[1]` through `[14]`; full URLs remain in these notes and `deck/citations/claim-matrix.md`.
- Time: 0:00

[Sources]
- Complete source list: `deck/citations/claim-matrix.md`.
[/Sources]

## Offline reveal rehearsal cues

### Frozen event sendoff

This text is reserved for Goal 7 after Goal 6 has established the frozen allowlist, current origin state, provider visibility, and event quiet window. Goal 3 rehearses the cue but does not send it.

> Execute the active specialized Demo 3 goal. Continue until that goal is achieved, the approved commit is non-force pushed to `origin/main`, both existing production deployments for that exact SHA are `READY`, and the public Demo 3 detail and output URLs pass verification. Do not stop at a local build or commit. Work only inside the frozen allowlist and the Demo 3 run directory. Run local validation and production-safe smoke tests, and fix transient in-scope failures forward with bounded commits. Stop and record precise evidence if origin advances after final preflight, a push would require force or unrelated integration, credentials or provider visibility are unavailable, an unresolved provider or production failure exceeds three fix-forward attempts or twenty minutes, or success would require DNS, project configuration, manual redeploy, analytics, package publication, or any out-of-scope change.

Presenter cue at `00:15`:

- Action: send the frozen prompt once.
- Expected state: the specialized goal becomes visibly active.
- Time budget: 30 seconds; return to slide 1 by `00:45`.
- Offline rehearsal substitute: start the fixture cue clock and say, “In the event run, this is where the preflighted goal starts.”
- Failure branch: if the send action itself cannot be verified, say so once and continue the talk. Do not spend presentation time debugging access.

### Success simulation

- At 31:05, switch from slide 17 to the fixture-backed source goal.
- At 31:35, show the specialized fixture and identify the changed requirements.
- At 32:10, show the fixture output and the What / Why / Next evidence.
- At 32:40, show the simulated exact-SHA and route receipt layout.
- At 33:10, switch to the CTA.
- Finish by 33:55.

Expected evidence before using this branch at the event:

- specialized goal is achieved;
- approved commit SHA is visible;
- both existing production deployments report `READY` for that exact SHA;
- detail and output routes pass the frozen verification contract.

If any receipt is missing, use the still-running or hard-blocker branch instead.

### Still-running simulation

- At 31:05, show the fixture status as “running.”
- Say: “The live goal is still running, so I’m not going to call it complete.”
- At 31:35, switch to the labeled fallback fixture and show the same source-to-execution proof. At the real event, that fallback may be called “sealed Demo 2” only after Goal 5 has actually produced and verified it.
- At 33:10, switch to the CTA.
- Finish by 33:55.

### Hard-blocker simulation

- At 31:05, show the fixture blocker receipt and name the authority boundary.
- Say: “The agent stopped at the boundary we set. That is a controlled outcome, not a successful Demo 3 deployment.”
- At 31:35, switch to the labeled fallback fixture. “Sealed Demo 2” is a future Goal 5 production fallback, not evidence that exists during Goal 3.
- At 33:10, switch to the CTA.
- Finish by 33:55.

## Recovery cue matrix

| Condition at the event | What the presenter says | Evidence or fallback shown | Maximum time |
|---|---|---|---:|
| Provider visibility unavailable | “I cannot verify the production state, so I will not call the live run complete.” | Provider-access receipt, then the Goal 5 sealed Demo 2 fallback if it exists | 30 sec |
| Origin advanced after preflight | “The repository moved after preflight. The agent stopped instead of integrating unrelated work live.” | Origin-drift receipt, then sealed fallback | 30 sec |
| Detail or output URL fails | “The commit may exist, but the public route has not passed verification.” | Failed-route receipt; use still-running unless the goal recorded a hard blocker | 30 sec |
| Exact SHA is missing or deployments do not match it | “A ready deployment without the approved SHA is not proof of this run.” | Exact-SHA comparison receipt, then sealed fallback | 30 sec |
| Presentation display or browser handoff fails | “I will use the retained evidence capture rather than improvise a success claim.” | Local slide render, fallback screenshot, and readable URLs | 20 sec |
| Narrated deck reaches 32:00 | Omit the supporting Cursor sentence on slide 6 and the examples on slide 9 | Preserve slides 10–19 and all reveal branches | No added time |
| Reveal begins after 32:15 | Show source, executed goal, and the single consolidated receipt view; omit supporting route narration | Preserve the evidence contrast and CTA | Reveal <= 2:00 |

Real Demo 2 production verification and a production rehearsal remain exclusively owned by Goal 5. Goal 3 proves only that these cues and fixture-backed branches fit the presentation budget.

## Timing arithmetic

| Segment | Target |
|---|---:|
| Slides 1–17 narrated deck | 31:05 |
| Slide 18 reveal | 2:05 |
| Slide 19 CTA | 0:45 |
| Total content | 33:55 |
| Hard-stop margin | 1:05 |
| Slide 20 sources appendix | Unspoken |
| Audience Q&A | After 35:00 |
