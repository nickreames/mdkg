# US-038: Add “read-only vs mutating” labels across docs and command reference


**Priority:** P1
**Theme:** Agent safety / Docs
**Website URL / section to update:**
- https://mdkg-docs.vercel.app/guides/agent-workflow/
- https://mdkg-docs.vercel.app/reference/

### Description
Agents need to know which commands are safe discovery and which mutate repo/graph state. This is a key mdkg trust and agent-UX feature.

### Acceptance criteria
- [ ] Agent workflow guide labels `goal next` as read-only and `goal claim` as mutating.
- [ ] Command reference includes read-only/mutating status for commands where metadata is known.
- [ ] Docs include a “safe discovery commands” list and a “mutating lifecycle commands” list.
- [ ] MCP docs explain why exposed tools are read-only.
