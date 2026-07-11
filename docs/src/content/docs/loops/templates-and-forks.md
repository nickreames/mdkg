---
title: Templates And Forks
description: Choose a bundled loop, create a scoped fork, control child materialization, and preserve template provenance.
---

mdkg ships reusable loop templates for common read-only audits and planning
work. A fork receives a new loop identity and project-specific state while
retaining its source template identity and content hash.

## Bundled templates

| Template | Mode | Use it to |
| --- | --- | --- |
| `security-audit` | `readonly` | Review source, secret exposure, dependencies, public surfaces, and finding triage |
| `design-frontend-ux-audit` | `readonly` | Review a frontend against its design system, product intent, accessibility, and responsive behavior |
| `backend-api-cli-bloat-audit` | `readonly` | Find sprawling flags, mixed ownership, duplicated command logic, and avoidable backend complexity |
| `tech-stack-best-practices-audit` | `readonly` | Compare the detected stack with current project conventions and source-backed best practices |
| `duplicate-code-and-linting-audit` | `readonly` | Find meaningful duplication, lint gaps, and consolidation opportunities |
| `test-ci-skill-infrastructure-audit` | `readonly` | Review tests, CI gates, automation, and `SKILL.md` infrastructure |
| `user-story-audit-and-recommendations` | `planning` | Review user stories, flows, acceptance criteria, and unresolved requirements |

List the catalog and inspect one template before forking it:

```bash
mdkg loop list
mdkg loop show security-audit
```

The catalog reports both bundled templates and existing loop nodes so you can
compare mode, role, materialization, and lineage before creating more graph
state.

## Raw loop or template fork?

Create a raw loop when no bundled process fits and you want to author the
operating model yourself:

```bash
mdkg new loop "Review release support policy"
```

This creates a deterministic `loop` scaffold. It does not prompt for a template
or run an agent. Review `mdkg loop list` before creating a raw loop because an
existing template may already encode the evidence lanes and safety boundary you
need.

Fork a template when you want a reusable process specialized to a scope:

```bash
mdkg loop fork security-audit --scope . --dry-run --json
mdkg loop fork security-audit --scope . --json
```

Run the observational `--dry-run` first. It plans identities and output without
writing files, events, caches, or SQLite reservations. If graph state stays
unchanged, the real fork receives the same available identities.

## Child materialization

Choose how much graph structure the fork creates:

| Mode | Behavior |
| --- | --- |
| `default_children` | Creates the scoped loop plus a grounding spike, execution-plan task, and validation-contract test |
| `planning_only` | Creates only the scoped loop shell; `--planning-only` and `--no-children` select this mode |
| `manual` | Creates the scoped loop without automatic children and records that child structure will be managed explicitly |

Examples:

```bash
mdkg loop fork security-audit --scope packages/api
mdkg loop fork user-story-audit-and-recommendations --scope docs --planning-only
mdkg loop fork backend-api-cli-bloat-audit --scope src/commands --materialization manual
```

`default_children` is the default because a reusable loop should normally have
actionable research, work, and validation lanes immediately. Use a no-child
mode deliberately, not as a way to avoid defining the process.

## Provenance and stale forks

A fork records:

- `template_refs`, such as `template://loops/security-audit`;
- the source template path;
- the template content hash at fork time; and
- the scoped loop's own identity and local specialization.

`mdkg loop list`, `show`, and `plan` compare that stored provenance with the
current template. When the content changed, they report a stale warning.

mdkg never rewrites the fork automatically. Review the differences, then either
re-fork for the new scope or explicitly promote/adopt reusable improvements.
This preserves project-specific decisions and gives template changes an
auditable review boundary.

## Next step

After forking, inspect [readiness, routing, evidence, and closeout](/loops/readiness-routing-evidence-closeout/).
For a complete example, follow the [security audit walkthrough](/loops/security-audit/).

The [generated CLI reference](/reference/generated-cli-reference/) is the
authority for every fork flag and JSON field.
