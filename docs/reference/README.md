# Reference

Use this section to choose the mdkg command family for the job.

Reference entry points:

- [Command Contract](command-contract.md)
- [Generated CLI Reference](../_generated/cli-reference.md)
- [Verified Git Materialization](../advanced-alpha/git-materialization.md)
- `dist/command-contract.json`
- `CLI_COMMAND_MATRIX.md`

Common command families include graph work (`mdkg goal`, `mdkg task`, `mdkg pack`), repo coordination (`mdkg bundle`, `mdkg subgraph`), verified Git source acceptance (`mdkg git materialize`), and Git-backed closeout/push readiness (`mdkg git`).

Most users should start with the generated CLI reference. The command contract and matrix are integration metadata for maintainers and tool authors.
