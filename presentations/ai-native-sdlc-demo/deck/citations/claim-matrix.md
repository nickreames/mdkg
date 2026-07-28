# AI-Native SDLC Presentation Claim Matrix

Status: verified for the V2 full-deck build  
Research date: 2026-07-26  
Policy: externally checkable claims require a primary source. Product milestones overlap; the six stages are a pedagogical capability progression, not a claim that one era ended when another began.

## Claim policy

- Separate claims about model capability, reasoning, context length, tool access, harness behavior, task difficulty, and elapsed runtime.
- Use vendor sources for what a product launched or can do, not for cross-vendor superiority claims.
- Treat vendor demonstrations as demonstrations, benchmark horizons as probabilistic task-difficulty estimates, and runtime as elapsed agent activity. Never substitute one for another.
- Prefer durable wording that remains true if product packaging or benchmarks change.
- On slides, use compact numbered markers such as `[1]`. Put full URLs in the speaker-note `[Sources]` block, this matrix, and the unspoken sources appendix.
- The approved timeline label is “capabilities accumulated.” Dates identify representative milestones, not exclusive eras.

## Approved claims

### C01 — Inline autocomplete became a mainstream coding interaction

- Capability stage: Autocomplete
- Product anchor: GitHub Copilot
- Source owner: GitHub
- URL: https://github.blog/news-insights/product-news/introducing-github-copilot-ai-pair-programmer/
- Publication date: 2021-06-29; page updated 2022-02-23
- Milestone date: 2021-06-29 technical preview
- Exact support: GitHub introduced Copilot as an AI pair programmer that draws on the current code and suggests whole lines or functions while the developer types.
- Approved paraphrase: “2021: Copilot made code completion feel like an always-on pair programmer inside the editor.”
- Confidence: High
- Slide use: 3
- Limitations: This supports the interaction pattern and launch milestone, not a productivity percentage or the claim that Copilot invented code generation.

### C02 — Conversational coding enabled iterative generate, explain, and refine workflows

- Capability stage: Prompt engineering / conversational coding
- Product anchor: ChatGPT
- Source owner: OpenAI
- URL: https://openai.com/index/chatgpt/
- Publication date: 2022-11-30
- Milestone date: 2022-11-30 research preview
- Exact support: OpenAI introduced a dialogue model that accepts follow-up turns and illustrated a user iteratively diagnosing code by adding missing context.
- Approved paraphrase: “2022: coding assistance moved from accepting a completion to iterating through conversation—generate, explain, refine.”
- Confidence: High
- Slide use: 4
- Limitations: “Prompt engineering” predates ChatGPT. ChatGPT is the memorable product anchor for conversational coding, not the origin of the discipline.

### C03 — o1 made additional inference-time reasoning a visible capability shift

- Capability stage: Reasoning
- Product anchor: OpenAI o1
- Source owner: OpenAI
- URL: https://openai.com/index/learning-to-reason-with-llms/
- Publication date: 2024-09-12
- Milestone date: 2024-09-12 o1-preview
- Exact support: OpenAI reported that o1 performance improved with more test-time compute and described the model learning to break down difficult steps, recognize mistakes, and try alternate approaches.
- Approved paraphrase: “2024: o1 made deliberate reasoning—and spending more inference on hard problems—a first-class model capability.”
- Confidence: High
- Slide use: 5
- Limitations: Do not generalize specific benchmark results into universal engineering ability or claim that visible chain-of-thought is required.

### C04 — Agentic coding harnesses joined models to repository and terminal tools

- Capability stage: Tool-using agents
- Product anchor: Claude Code
- Source owner: Anthropic
- URL: https://www.anthropic.com/news/claude-3-7-sonnet
- Publication date: 2025-02-24
- Milestone date: 2025-02-24 limited research preview
- Exact support: Anthropic introduced Claude Code as an agentic coding tool that can search and read code, edit files, run tests, use command-line tools, and work with GitHub.
- Approved paraphrase: “2025: coding assistants became tool-using agents that could inspect a repo, edit files, run tests, and operate the terminal.”
- Confidence: High
- Slide use: 6
- Limitations: The source describes product capability, not safe autonomy in every repository or permission configuration.

### C05 — Cursor is a supporting example of the same harness shift

- Capability stage: Tool-using agents
- Product anchor: Cursor Agent, supporting only
- Source owner: Cursor
- URL: https://docs.cursor.com/en/agent/overview
- Publication date: Living documentation; accessed 2026-07-26
- Milestone date: Not used as a dated anchor
- Exact support: Cursor documents an Agent that can complete coding tasks independently, edit code, search the codebase, and run terminal commands.
- Approved paraphrase: “Cursor and other harnesses exposed a similar search–edit–run tool loop.”
- Confidence: Medium-high
- Slide use: 6
- Limitations: Living documentation does not establish a historical launch date. Do not place Cursor on the timeline with a precise date from this source.

### C06 — Agent Skills introduced conditional, portable procedural context

- Capability stage: Conditional context
- Product anchor: Agent Skills and `SKILL.md`
- Source owner: Anthropic
- URL: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- Publication date: 2025-10-16; open-standard update 2025-12-18
- Milestone date: 2025-10-16 introduction
- Exact support: Anthropic describes Skills as folders of instructions, scripts, and resources that agents discover and load dynamically; metadata is preloaded and the full `SKILL.md` body is read when relevant.
- Approved paraphrase: “2025: `SKILL.md` made specialized procedural context discoverable and loadable only when the task called for it.”
- Confidence: High
- Slide use: 7
- Limitations: The initial announcement was Anthropic-specific. Cross-platform portability should be attributed to the later open-standard update.

### C07 — Codex combined isolated execution, iteration, and inspectable evidence

- Capability stage: Goal-driven coding agent
- Product anchor: Codex
- Source owner: OpenAI
- URL: https://openai.com/index/introducing-codex/
- Publication date: 2025-05-16
- Milestone date: 2025-05-16 research preview
- Exact support: OpenAI introduced Codex as a cloud software-engineering agent running tasks in isolated environments, able to edit files and run tests, linters, and type checkers; the product exposed terminal logs and test outputs for review.
- Approved paraphrase: “Codex paired delegated execution with a sandbox, iterative validation, and evidence a developer could inspect.”
- Confidence: High
- Slide use: sources appendix
- Limitations: The launch article reported typical tasks of 1–30 minutes. Do not use it as evidence of 8-hour runtime.

### C08 — Codex usage includes requests estimated above eight hours of human work

- Capability stage: Long-horizon work
- Product anchor: Codex
- Source owner: OpenAI Economic Research
- URL: https://openai.com/index/how-agents-are-transforming-work/
- Publication date: 2026-06-25
- Milestone date: May 2026 measurement window
- Exact support: OpenAI reported that 25.6% of sampled individual users made at least one Codex request estimated to correspond to more than eight hours of human work.
- Approved paraphrase: “By May 2026, one quarter of sampled individual Codex users had submitted at least one request estimated above eight hours of human work.”
- Confidence: Medium-high
- Slide use: 8, 9
- Limitations: This is a vendor study and an estimate of equivalent human task size. It is not proof of eight hours of uninterrupted agent runtime, universal success, or eight hours saved.

### C09 — Long-running Claude harness work spans multiple context windows and hours or days

- Capability stage: Long-horizon work
- Product anchor: Claude Agent SDK / Claude Code teams
- Source owner: Anthropic
- URL: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- Publication date: 2025-11-26
- Milestone date: 2025-11-26 published harness pattern
- Exact support: Anthropic describes developers assigning tasks that span hours or days, identifies loss of continuity across context windows as an open problem, and demonstrates initializer plus incremental coding-agent patterns with durable feature and progress artifacts.
- Approved paraphrase: “Anthropic’s long-running harness work shows that multi-hour scope requires durable requirements, progress records, and verification across context windows.”
- Confidence: High
- Slide use: 8, 11
- Limitations: This is a harness demonstration and design pattern, not a guarantee that any high-level prompt yields a production-quality result.

### C10 — Model context windows grew substantially

- Capability stage: Model and context capacity
- Product anchor: GPT-4.1
- Source owner: OpenAI
- URL: https://openai.com/index/gpt-4-1/
- Publication date: 2025-04-14
- Milestone date: 2025-04-14 API release
- Exact support: OpenAI reported up to one million tokens of context for the GPT-4.1 family and published long-context evaluations, including lower scores on harder multi-item retrieval and graph tasks.
- Approved paraphrase: “Context windows expanded to as much as one million tokens in GPT-4.1, but capacity and reliable use are different claims.”
- Confidence: High
- Slide use: 9, 10
- Limitations: A maximum context size does not guarantee perfect retrieval, reasoning, or project memory.

### C11 — More context does not remove the need for context engineering

- Capability stage: Context engineering
- Product anchor: Anthropic context-engineering guidance
- Source owner: Anthropic
- URL: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Publication date: 2025-09-29
- Milestone date: 2025-09-29
- Exact support: Anthropic frames context as finite, reports diminishing attention as contexts grow, and recommends curating high-signal instructions, tools, external data, and history for multi-turn and long-horizon agents.
- Approved paraphrase: “Larger windows increase capacity; dependable agents still need deliberate context selection, maintenance, and recovery.”
- Confidence: High
- Slide use: 10, 11
- Limitations: This is engineering guidance from one vendor. Present it as a well-supported design principle, not a formal impossibility theorem.

### C12 — Benchmark time horizon is task difficulty, not elapsed agent runtime

- Capability stage: Evidence literacy
- Product anchor: METR time-horizon methodology
- Source owner: METR
- URL: https://metr.org/time-horizons/
- Publication date: Living research page; last updated 2026-05-08
- Milestone date: Time Horizon 1.1, 2026-05-08
- Exact support: METR defines a task-completion time horizon using human expert completion time at a chosen predicted success rate and explicitly states that it is not the duration an agent acts autonomously.
- Approved paraphrase: “A benchmark ‘8-hour horizon’ describes probabilistic task difficulty measured in human time—not eight hours of agent runtime.”
- Confidence: High
- Slide use: 8, sources appendix
- Limitations: The evaluated task distribution is concentrated in software engineering, ML, and cybersecurity and does not represent all professional work.

### C13 — mdkg is a pre-v1 public alpha

- Capability stage: Product positioning
- Product anchor: mdkg
- Source owner: mdkg repository
- URL: https://github.com/nickreames/mdkg/blob/580be1e6efffe852e9996186e85e2bcbcd3e3e3b/docs/start-here/public-alpha-contract.md
- Publication date: Repository state inspected 2026-07-26
- Milestone date: Commit `580be1e6efffe852e9996186e85e2bcbcd3e3e3b`
- Exact support: The canonical public-alpha contract calls Markdown Knowledge Graph a developer preview and pre-v1 public alpha; package metadata at the inspected commit reports version 0.5.2.
- Approved paraphrase: “mdkg is usable today as a pre-v1 public alpha, with active improvement still underway.”
- Confidence: High
- Slide use: 16, 19
- Limitations: Do not promise roadmap dates, stability guarantees, or behavior absent from the current quickstart and command contract.

### C14 — mdkg’s public operating model is Plan → Work → Evidence

- Capability stage: AI-native SDLC
- Product anchor: mdkg
- Source owner: mdkg repository
- URL: https://github.com/nickreames/mdkg/blob/580be1e6efffe852e9996186e85e2bcbcd3e3e3b/mdkg-dev/src/pages/index.astro
- Publication date: Repository state inspected 2026-07-26
- Milestone date: Commit `580be1e6efffe852e9996186e85e2bcbcd3e3e3b`
- Exact support: The canonical landing-page source describes a repo-owned Plan → Work → Evidence loop with bounded work, checkpoints, receipts, handoffs, and validation.
- Approved paraphrase: “mdkg keeps the plan, bounded work, and evidence together in the repository so the next human or agent can recover what completed, why, and what comes next.”
- Confidence: High
- Slide use: 14, 15, 16
- Limitations: This is the product’s declared operating model, not an externally benchmarked productivity claim.

## Held or rejected claims

### H01 — “Coding agents can autonomously run for 8+ hours”

- Disposition: Reject as a general claim.
- Reason: Available evidence mixes estimated human task duration, aggregate daily agent turns, harness demonstrations, and elapsed runtime. Those are not equivalent.
- Safe replacement: Use C08 with its human-equivalent-task caveat, and C09 for multi-context-window hours-or-days harness work.

### H02 — “Longer context solves project memory”

- Disposition: Reject.
- Reason: C10 supports larger capacity; C11 supports continued attention and curation constraints.
- Safe replacement: “Bigger windows help, but durable external state and intentional context selection still matter.”

### H03 — “One vendor won the agentic coding era”

- Disposition: Reject.
- Reason: The presentation explains accumulated capabilities, not a vendor ranking.
- Safe replacement: Use one memorable anchor per stage, with adjacent products only where a primary source supports the exact capability.

### H04 — “Benchmark horizon equals time saved”

- Disposition: Reject.
- Reason: C12 defines horizon as probabilistic task difficulty in human expert time, not elapsed agent runtime or labor savings.

## Slide source-number map

1. GitHub Copilot launch — C01
2. ChatGPT launch — C02
3. OpenAI o1 reasoning — C03
4. Claude Code launch — C04
5. Cursor Agent documentation — C05
6. Agent Skills — C06
7. Introducing Codex — C07
8. Codex long-horizon usage study — C08
9. Anthropic long-running harness — C09
10. GPT-4.1 context — C10
11. Anthropic context engineering — C11
12. METR time-horizon methodology — C12
13. mdkg public-alpha contract — C13
14. mdkg Plan → Work → Evidence source — C14

## Research recommendation

Use a six-stage, overlapping capability progression with one product anchor per stage. Make the visual progression cumulative: each stage adds a capability without deleting earlier interaction modes. Use long-horizon evidence as the hinge into the SDLC argument, and place the evidence caveat directly on the timeline instead of hiding it in notes.

This option is preferred over:

1. A strict product chronology, which would imply false boundaries and invite date disputes.
2. A vendor comparison, which would dilute the architecture and planning message.
3. A benchmark-led narrative, which would over-index on contested numbers instead of the changed unit of work.

Consequence: the deck makes a smaller set of claims, but each claim is defensible and directly supports the central takeaway.
