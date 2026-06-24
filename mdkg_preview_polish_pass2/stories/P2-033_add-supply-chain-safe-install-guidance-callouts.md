# P2-033: Add supply-chain-safe install guidance callouts

**Priority:** P2

## URL / Section To Update

- Install docs
- Trust docs

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

Add small but explicit callouts about safe CLI installation and secrets hygiene.

## Acceptance Criteria

- [ ] Install docs remind users to verify package source and avoid storing package tokens in graph nodes.
- [ ] Trust docs explain mdkg warnings are not a secret scanner.
- [ ] Copy does not create fear; it presents boring hygiene.
- [ ] Package-manager-specific claims are accurate.

## Copy / Implementation Guidance

`Do not store npm tokens, provider credentials, private keys, raw prompts, or production payloads in mdkg graph nodes. mdkg can warn on obvious raw markers in some flows, but it is not a DLP system.`

## Notes

This aligns with local-first/low-dependency security philosophy.
