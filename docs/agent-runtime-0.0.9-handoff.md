# Agent Runtime Handoff For mdkg 0.0.9

mdkg 0.0.9 treats `SPEC.md`, `WORK.md`, `WORK_ORDER.md`, `RECEIPT.md`, `FEEDBACK.md`, `DISPUTE.md`, and `PROPOSAL.md` documents as generic agent workflow files.

## Runtime-Side Changes

- Use agent workflow naming in public runtime docs, fixtures, and tests where the text refers to mdkg file standards.
- Keep the uppercase basenames and portable ids such as `agent.*`, `work.*`, `order.*`, `receipt.*`, `feedback.*`, `dispute.*`, and `proposal.*`.
- Emit skill proposal targets as `skill.<slug>`, for example `target_id: skill.review-loop`.
- It is valid for skill-update proposals to use `skill.<slug>` in `target_id`, `evidence_refs`, and `relates`.
- Keep or adopt `pricing_model: included` for bundled runtime work contracts.
- After updating the mdkg dependency or vendored copy, run the runtime fixture verification flow against mdkg 0.0.9.

## Legacy Migration Note

`omni-room-runtime` was the first consumer used to prove this handoff shape. Treat existing Omni naming in that repo as legacy runtime naming, not mdkg public standard language.

## Acceptance Check

Runtime fixtures should pass local verification after replacing the mdkg vendored copy or package dependency with mdkg 0.0.9.

Expected mdkg compatibility points:

- `mdkg validate` accepts `pricing_model: included`.
- `mdkg validate` accepts `proposal_kind: skill_update` with `target_id: skill.<slug>` when the referenced skill exists.
- `mdkg validate` rejects missing `skill.<slug>` proposal targets with a specific missing-skill error.
- `mdkg new spec|work ... --id <portable-id>` can scaffold docs with semantic ids for new runtime fixtures.
