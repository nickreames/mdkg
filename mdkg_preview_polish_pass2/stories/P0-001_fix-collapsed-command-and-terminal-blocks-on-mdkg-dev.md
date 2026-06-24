# P0-001: Fix collapsed command and terminal blocks on mdkg.dev

**Priority:** P0

## URL / Section To Update

- https://mdkg-dev.vercel.app/
- https://mdkg-dev.vercel.app/quickstart/

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The marketing site currently collapses multi-line CLI examples into one dense line. This is trust-breaking for a CLI product because first-time users must be able to visually inspect and copy commands precisely.

## Acceptance Criteria

- [ ] All terminal/code blocks preserve line breaks, indentation, and prompt formatting.
- [ ] Setup commands and operating-loop commands are split into separate blocks.
- [ ] Copyable blocks either omit `$` prompts or copy logic strips prompts safely.
- [ ] Mobile code blocks remain readable without breaking layout; horizontal scroll is acceptable for long commands but not for normal setup blocks.
- [ ] At least the homepage and quickstart page are manually checked in desktop and mobile viewport widths.

## Copy / Implementation Guidance

Prefer separate blocks for setup and operating loop:

```bash
npm install -g mdkg
mdkg init --agent
mdkg index
mdkg status
mdkg validate
```

```bash
mdkg goal current
mdkg goal next
mdkg pack WORK_ID
mdkg task done WORK_ID --checkpoint "Meaningful milestone"
mdkg validate
```

## Notes

This should be the first fix before any marketing copy polish.
