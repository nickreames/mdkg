# US-022: Add a dedicated guide: Give an AI agent a goal ID


**Priority:** P1
**Theme:** Docs / Agent workflow
**Website URL / section to update:**
- https://mdkg-docs.vercel.app/guides/agent-workflow/

### Description
The agent workflow guide currently lists commands and rules, but a more concrete guide should show the exact workflow a human uses when handing an agent a goal or work ID.

### Acceptance criteria
- [ ] Guide explains when to use `goal current`, `goal next`, `goal claim`, `pack`, `handoff`, and `task done`.
- [ ] Guide shows a human prompt template for an agent using mdkg.
- [ ] Guide clearly distinguishes read-only discovery commands from mutating lifecycle commands.
- [ ] Guide tells agents to prefer packs over ad hoc file lists.
- [ ] Guide includes closeout expectations: run checks, record evidence, validate.

### Suggested copy / implementation notes
Prompt snippet:

> Start by reading `AGENT_START.md`. Use `mdkg goal current`, `mdkg goal next`, and `mdkg pack WORK_ID` before editing. Do not browse files ad hoc unless the pack points you there. Run required checks manually, record evidence, and finish with `mdkg validate`.
