---
title: Independent Graphs
description: Select an explicitly registered independent project root without federating or migrating existing graphs.
---

The unpublished 0.6.3 candidate adds `--graph <name>` for independent project
roots, each containing its own `.mdkg`. Without a selector, existing commands
continue using `.mdkg` under `--root` or the current directory. Config, node IDs,
memory, index/cache, state, events, DB/queues, working storage and mirrors belong
to the selected root; same-number nodes in separate graphs remain independent.

Every registry mutation requires a valid host Git work tree to verify its local
ignored/untracked policy. Non-Git and invalid-Git previews refuse before effects.

Initialize an empty sibling project root explicitly. Registration previews
host-local metadata and necessary ignore rules; review its actual `plan_hash`
before application:

```bash
mdkg init --root memory/personal
mdkg graph register personal --target memory/personal --json
mdkg graph register personal --target memory/personal --apply --plan-hash PLAN_HASH --json
mdkg --graph personal search "draft" --json
mdkg --graph personal show task-1 --json
mdkg --graph personal working list --json
mdkg graph registrations --json
```

`--graph` names are exact lowercase aliases. They map to an existing project
root such as `memory/personal`, not directly to its bare `.mdkg` directory. All
relative inputs/outputs use the selected root. JSON stdout keeps its command
shape; the selected name/root appears on stderr. MCP uses that root throughout
its session. No selector creates, discovers, migrates, merges, copies or deletes
graphs. Help/version remain graph-independent. Unknown/unsafe names refuse
before effects and never fall back.

The local registry `.mdkg-graphs.local.json` and its host lock are ignored and
untracked. Default commands never load it or scan private graph roots. Private
registration requires an untracked root and previews its ignore entry. A small
tracked team root can explicitly use `--visibility internal` or `public`; the
existing workspace/bundle visibility gates still apply. Collaborators register
their local mappings deliberately.

Bindings reuse canonical-v2 identity or the existing 0.6.2 working-host marker.
No path-derived identity or implicit legacy migration is introduced. Legacy
defaults remain usable. A legacy sibling without binding needs separate review
of the existing adoption flow; custom scratch/identity conflicts must be retained.
Copied identity, changed or missing binding, overlapping/nested roots, links,
shared mirrors and stale/busy registry operations refuse.

Private named selection permits local/private output, and refuses public/internal
scope, public bundles and graph transport. Named outputs stay inside the selected
root. Registration/ignore rules are operator safeguards, not access control or
backup. Git history/remotes remain shared at the host repository; direct `--root`
keeps its existing explicit operator semantics.

Unregister previews/applies metadata removal only and preserves all graph files
and ignore entries:

```bash
mdkg graph unregister personal --json
mdkg graph unregister personal --apply --plan-hash PLAN_HASH --json
```

An interrupted application can leave reviewed ignore additions before registry
replacement. Preserve a retained writer lock and review custody; no automatic
PID/age recovery is added. Review changed mappings explicitly; registration is
not foreign-working-store repair or migration permission.

See the [root guide](https://github.com/nickreames/mdkg/blob/cloud/goal90-independent-siblings/docs/guides/independent-graphs.md)
for the full boundary. This unpublished candidate still requires independent
review, owner-local acceptance and full release/platform qualification.
