# US-005: Rewrite semantic-ref cards to remove misleading “Evidence:” labels


**Priority:** P0
**Theme:** Product clarity / Copy
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/ — Work, context, and evidence section

### Description
The current homepage uses “Evidence:” and “Caveat:” labels inside the scope/context/evidence cards. That makes the section feel like a claims matrix rather than product education, and it is especially confusing because `scope_refs` currently has a label that starts with “Evidence.”

### Acceptance criteria
- [ ] `scope_refs`, `context_refs`, and `evidence_refs` are explained in user-facing terms.
- [ ] The section clearly states: work is what to do, context is what to know, evidence is what proves the state.
- [ ] No card starts with the label “Evidence:” unless it is actually an evidence claim.
- [ ] A YAML example appears once and is visually readable.
- [ ] Docs concept page and homepage use the same definitions.

### Suggested copy / implementation notes
Suggested card copy:

- `scope_refs`: executable work scope — tasks, tests, bugs, features, and spikes a goal can route through.
- `context_refs`: background knowledge — decisions, PRDs, prior goals, plans, subgraph qids, or URI refs that inform the work.
- `evidence_refs`: proof — checkpoints, audits, receipts, archive sidecars, and artifacts that support the current state.
