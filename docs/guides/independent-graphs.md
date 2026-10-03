# Independent graph selection

The unpublished 0.6.3 candidate adds optional `--graph <name>`. Existing commands
without a selector keep using `.mdkg` under `--root` or the current directory.
Names select independent project roots, each containing its own `.mdkg`; they
do not join workspaces or federate graphs. Node numbers can repeat independently.

For example, keep a tracked small team graph at `.mdkg` and an ignored private
graph at `memory/personal/.mdkg`. Initialize an empty independent root explicitly,
then preview its host-local registration:

```bash
mdkg init --root memory/personal
mdkg graph register personal --target memory/personal --json
```

Review the requested root, proven binding, visibility, ignore additions and
`plan_hash`. Apply exactly that current plan using its actual hash:

```bash
mdkg graph register personal --target memory/personal --apply --plan-hash PLAN_HASH --json
mdkg --graph personal search "draft" --json
mdkg --graph personal show task-1 --json
mdkg --graph personal working list --json
mdkg graph registrations --json
```

The registry `.mdkg-graphs.local.json` and its host writer lock stay ignored and
untracked. Registration defaults to private and previews any required ignore
entries. Every registration visibility requires a valid host Git work tree;
non-Git/invalid-Git previews refuse before effects. Private registration refuses
tracked graph files. For a deliberately tracked
team root, explicitly choose `--visibility internal` or `public`; existing bundle
and workspace visibility rules still apply. Registry names/paths are local
metadata, so collaborators opt in to their own mappings explicitly.

All named-command relative paths, config, IDs, indexes, locks, state, events,
DB/queues, working storage, packs and native skill mirrors belong to the selected
project root. Named init/upgrade therefore preserve the host's instructions and
mirrors. The selected name/root appears on stderr; JSON stdout retains its
existing command shape. MCP binds to that selected root for its whole session.

Registration needs an already proven canonical-v2 graph ID or 0.6.2 working-host
binding. It does not assign graph identity from a path or migrate legacy nodes.
Legacy defaults remain usable without adoption. A legacy sibling without a
binding requires separate review of the existing working-host adoption flow;
preserve any custom scratch/identity conflict rather than forcing it to register.
Copying identity bytes does not make an independent graph: collisions refuse.

Unknown names, malformed registries, changed bindings, overlapping/nested roots,
links and shared host mirrors fail before command effects. There is no implicit
creation, numeric/UUID selector, sticky selection, automatic migration, merging,
copying or graph deletion. Help/version validate syntax but remain independent
of graphs and do not load a registry. Default operations never scan private
siblings; named admission reads the requested graph plus bounded host ownership
and ignore/index metadata, without indexing any other graph.

Private named selection permits local/private output. Public/internal pack or
archive/capability scope, public bundles and graph transport refuse. Named output
files stay in the selected project root. Ignoring and registration are local
operator safeguards, not filesystem or Git access control. Git history/remotes
belong to the host repository; selecting a graph does not create a separate Git
branch. Direct `--root` remains the existing explicit operator root selection.

Mapping removal also previews/applies an exact current hash:

```bash
mdkg graph unregister personal --json
mdkg graph unregister personal --apply --plan-hash PLAN_HASH --json
```

Unregister preserves graph files and ignore rules. Review a changed identity or
path by removing/re-registering only the mapping; this never repairs foreign
working storage or supplies migration authority. Busy/stale registry writers
refuse. An interrupted apply may have added reviewed ignore entries before its
atomic registry replacement; preserve any retained lock, review custody, then
preview fresh inputs. No PID/age rule removes another writer's lock.

Installed source checks and cloud CI do not supply owner/platform acceptance or
publication approval. This candidate remains unpublished and NOT_READY until
all required independent/local/full release gates are satisfied.
