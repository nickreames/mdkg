# US-027: Summarize latest changelog on docs instead of placeholder only


**Priority:** P1
**Theme:** Docs / Release trust
**Website URL / section to update:**
- https://mdkg-docs.vercel.app/project/changelog/

### Description
The changelog page currently points to the root changelog. That is okay as a source-of-truth rule, but the public docs should summarize the current release so users can tell the project is active and understand what changed recently.

### Acceptance criteria
- [ ] Changelog page shows current package version and latest release summary.
- [ ] Page links to canonical root CHANGELOG.md.
- [ ] Page avoids duplicating the entire changelog manually unless generated.
- [ ] Docs check verifies displayed latest version matches package/changelog metadata.
- [ ] Public alpha caveats link from changelog.
