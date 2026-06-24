# US-002: Repair llms.txt placeholders and command examples


**Priority:** P0
**Theme:** AI-agent-readable surface
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/llms.txt

### Description
The current llms.txt appears to lose placeholder values such as `<id>` because angle brackets are not escaped or represented safely. Since this file is explicitly for AI agents, it needs clean, literal, copyable instructions.

### Acceptance criteria
- [ ] Every command example in llms.txt includes valid placeholder text such as WORK_ID instead of swallowed angle-bracket placeholders.
- [ ] The file has readable line breaks and short sections instead of one long paragraph.
- [ ] llms.txt links to quickstart, trust, alpha, docs, GitHub, npm, and command reference once available.
- [ ] Agents are explicitly told to prefer `mdkg pack WORK_ID` over ad hoc file lists.
- [ ] The file states public-alpha boundaries and safety caveats in concise language.

### Suggested copy / implementation notes
Use placeholder names that survive plain-text rendering:

```text
mdkg pack WORK_ID
mdkg handoff create WORK_ID
```

Avoid raw `<id>` in `llms.txt` unless escaped and verified.
