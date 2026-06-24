# US-030: Improve Project DB/Queues copy so it cannot be mistaken for hosted execution


**Priority:** P1
**Theme:** Docs / Advanced alpha safety
**Website URL / section to update:**
- https://mdkg-docs.vercel.app/advanced-alpha/project-db-queues/

### Description
Project DB and queues are powerful but muddy the value proposition if framed too centrally. The docs should repeatedly clarify that queues are local delivery state and advanced alpha infrastructure, not hosted execution history or canonical runtime state.

### Acceptance criteria
- [ ] Page opens with “advanced alpha local infrastructure.”
- [ ] Page distinguishes `.mdkg/index` from `.mdkg/db`.
- [ ] Page states queue payloads should be compact refs/redacted envelopes, not raw secrets/prompts/provider payloads.
- [ ] Page explains snapshot queue policies at a high level if documented.
- [ ] Page links back to trust/safety and alpha contract.
