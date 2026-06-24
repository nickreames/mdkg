# US-015: Add a product architecture diagram to the homepage hero or first-scroll section


**Priority:** P1
**Theme:** Design / Product education
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/ — hero / core loop

### Description
The homepage currently relies mostly on text and small step blocks. A concise architecture diagram would make the product legible in seconds: repo Markdown → mdkg CLI → packs/handoffs → human/agent work.

### Acceptance criteria
- [ ] Diagram communicates `.mdkg/` Markdown as source of truth.
- [ ] Diagram shows mdkg CLI producing deterministic packs/handoffs.
- [ ] Diagram shows humans and agents consuming the same project memory.
- [ ] Diagram is accessible with alt text and does not rely on animation.
- [ ] Diagram uses mdkg design tokens and restrained Ocean Flow accents.

### Suggested copy / implementation notes
Diagram label suggestion:

> Markdown + Git stay authoritative. mdkg builds bounded context for humans and agents.
