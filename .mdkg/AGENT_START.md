# mdkg startup

Use this router when a task involves project memory. Run commands from the
repository root. Existing user instructions and project-specific constraints
remain in force; this generated guide does not override them.

## Authority and custody

An explicit user instruction or UI action to run a fully planned goal authorizes
its declared implementation, validation, ownership/lifecycle and evidence work.
Do not ask for that same scope again. Merely selecting a goal or reading a node
does not grant authority; continuations inherit the approved run scope.
Respect explicit exclusions. Git commits/pushes, releases, providers,
deployments, bundles and cross-project writes require inclusion in the approved
contract or separate approval. Re-inventory before writes; stop on conflicting
writers, unowned changes or material scope/decision changes.

## Find the focused context

1. Read the supplied work item with `mdkg show <qid>`. For an explicit goal use
   `mdkg goal show <qid>` then `mdkg goal next <qid>`; neither claims work.
2. If no work was supplied, use `mdkg search "<topic>"` and inspect a candidate.
   `mdkg goal current` reports local selection, not an assignment.
3. Discover skills with `mdkg skill list` or `mdkg skill search "<topic>"`,
   then load only relevant bodies using `mdkg skill show <slug>`.
4. Use `mdkg pack <qid> --pack-profile concise` for focused linked context.
   Claim/start work only under the accepted run scope and single-writer ownership.
5. Verify the requested outcome, record evidence and run `mdkg validate` before
   closing work. Validation alone proves neither publication nor deployment.

## Read more only when needed

- [Workspace layout](README.md).
- [Command reference](CLI_COMMAND_MATRIX.md), or `mdkg help <command>`.
- [Collaboration preferences](core/COLLABORATION.md) for local constraints;
  [legacy preferences](core/HUMAN.md) only when unmigrated notes are relevant.
- [Memory conventions](core/SOUL.md) for deeper retrieval and evidence guidance.

Canonical skills live in `.mdkg/skills/`; native mirrors are outputs. mdkg
discovers skills but does not execute their scripts. Never load the whole command
reference or every skill as a mandatory startup step.
