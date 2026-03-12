# CLI Command Matrix

This file is the canonical command reference for mdkg in this repository.

Verify live help with:
- `mdkg --help`
- `mdkg help <command>`

Primary commands:
- `mdkg init`
- `mdkg new`
- `mdkg show`
- `mdkg list`
- `mdkg search`
- `mdkg pack`
- `mdkg skill`
- `mdkg task`
- `mdkg validate`

Agent bootstrap:
- `mdkg init --llm`
- `mdkg init --agent`
- `mdkg init --llm --agent`

Skill discovery:
- `mdkg skill list --tags stage:plan --json`
- `mdkg skill search "<query>" --json`
- `mdkg skill show <slug> --json`
- `mdkg skill sync`
