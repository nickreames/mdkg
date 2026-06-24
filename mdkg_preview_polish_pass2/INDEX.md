# mdkg.dev + docs.mdkg.dev Preview Polish Pass 2

Generated for the next implementation pass after reviewing the current Vercel previews and aligning on the new direction.

## Target Preview URLs

- Landing/product site: https://mdkg-dev.vercel.app/
- Documentation site: https://mdkg-docs.vercel.app/

## Top Outcomes

1. mdkg.dev becomes crisp, concise, and public-facing.
2. docs.mdkg.dev stops sounding like a preview scaffold.
3. Plan → Work → Evidence becomes the main operating model.
4. Work node types and low-dependency security posture get first-class explanation.
5. First-run commands become visually trustworthy and copy-pasteable.

## Files

1. `IMPLEMENTATION_BRIEF_mdkg_dev_docs_pass_2.md` — overall direction and locked decisions.
2. `USER_STORIES_mdkg_dev_docs_pass_2.md` — master implementation backlog.
3. `COPY_UPDATES_mdkg_dev_pass_2.md` — recommended public-facing copy replacements.
4. `DOCS_IA_AND_CONTENT_REWRITE_PLAN.md` — docs navigation and page rewrite plan.
5. `QA_CHECKLIST_mdkg_dev_docs_pass_2.md` — launch-readiness checks for this polish pass.
6. `stories/` — individual story files for agent ingestion.

## Recommended Implementation Order

1. P0 trust-breaking polish.
2. P1 core messaging and docs structure.
3. P2 professional polish.
4. P3 future docs/demo/reference expansion.

## Core Messaging Decision

Replace internal/external “golden loop” language with:

> **Plan → Work → Evidence**

Supporting sentence:

> Plan the goal. Execute one work node. Record evidence. Validate before moving on.

## Public Site Boundary

- `mdkg.dev` should be concise, polished, product-facing, and mostly one page.
- `docs.mdkg.dev` should be professional developer documentation.
- Internal roadmap, claims matrix, docs renderer decisions, and preview deployment details should stay out of public navigation.
