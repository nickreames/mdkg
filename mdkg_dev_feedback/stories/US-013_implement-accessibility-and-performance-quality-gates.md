# US-013: Implement accessibility and performance quality gates


**Priority:** P0
**Theme:** Quality / Launch readiness
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/
- https://mdkg-docs.vercel.app/

### Description
The sites should be fast, keyboard-friendly, and accessible because mdkg is positioning as a professional developer tool. Astro/Starlight are good foundations, but the project needs explicit gates so future visual work does not regress basics.

### Acceptance criteria
- [ ] Run and document Lighthouse or equivalent checks for product and docs previews.
- [ ] Keyboard navigation works for header, CTAs, docs nav, search, and footer links.
- [ ] Visible focus states exist for all interactive elements.
- [ ] Images/diagrams have useful alt text or are marked decorative.
- [ ] Color contrast meets baseline WCAG expectations.
- [ ] Reduced-motion behavior is respected for animations/transitions.
- [ ] Core Web Vitals targets are documented: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.
- [ ] No core content depends on client-only rendering.
