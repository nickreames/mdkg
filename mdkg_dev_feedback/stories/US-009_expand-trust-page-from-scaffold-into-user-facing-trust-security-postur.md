# US-009: Expand trust page from scaffold into user-facing trust/security posture


**Priority:** P0
**Theme:** Trust / Safety
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/trust/
- https://mdkg-docs.vercel.app/start-here/safety-boundaries/

### Description
The trust pages have the right skeleton, but the product-site page still reads like a note to the launch team. The public trust page should be plain-spoken, slightly technical, and confidence-building.

### Acceptance criteria
- [ ] Trust page opens with a direct user promise: local-first project memory, not a hosted runtime.
- [ ] Sections distinguish “What mdkg stores,” “What mdkg does not do,” “MCP boundary,” “Queue boundary,” “Secret/prompt guidance,” and “Public alpha caveats.”
- [ ] The page explicitly says users should not store raw secrets, raw prompts, provider payloads, tokens, private keys, or sensitive production data in graph nodes.
- [ ] The page states handoff warnings are safety aids, not comprehensive DLP.
- [ ] The page links to safety docs and public alpha contract.
