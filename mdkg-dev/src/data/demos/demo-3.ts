import type { DemoSnapshot } from "./types";

const demo3Preview =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 980 620'%3E%3Crect width='980' height='620' fill='%23eef7fb'/%3E%3Cg fill='none' stroke='%237cc9d9' opacity='.55'%3E%3Cellipse cx='260' cy='260' rx='260' ry='130'/%3E%3Cellipse cx='260' cy='260' rx='340' ry='190'/%3E%3Cellipse cx='760' cy='470' rx='260' ry='150'/%3E%3C/g%3E%3Cpath d='M130 455L490 350L840 190' stroke='%230f5fd6' stroke-width='12' stroke-linecap='round'/%3E%3Cg font-family='system-ui,sans-serif' text-anchor='middle'%3E%3Cg transform='translate(130 455)'%3E%3Ccircle r='58' fill='%23102033' stroke='white' stroke-width='8'/%3E%3Ctext y='6' fill='white' font-size='24' font-weight='800'%3EPLAN%3C/text%3E%3C/g%3E%3Cg transform='translate(490 350)'%3E%3Ccircle r='58' fill='%230f5fd6' stroke='white' stroke-width='8'/%3E%3Ctext y='6' fill='white' font-size='24' font-weight='800'%3EWORK%3C/text%3E%3C/g%3E%3Cg transform='translate(840 190)'%3E%3Ccircle r='64' fill='%23087b72' stroke='white' stroke-width='8'/%3E%3Ctext y='6' fill='white' font-size='20' font-weight='800'%3EEVIDENCE%3C/text%3E%3C/g%3E%3C/g%3E%3Ctext x='56' y='70' font-family='system-ui,sans-serif' font-size='30' font-weight='850' fill='%23102033'%3EGIVE EVERY CODING AGENT THE MAP%3C/text%3E%3Ctext x='56' y='108' font-family='system-ui,sans-serif' font-size='18' font-weight='700' fill='%2343586b'%3Egoal-1 / demo-003 / live rehearsal%3C/text%3E%3C/svg%3E";

export const demo3: DemoSnapshot = {
  id: "3",
  title: "Give every coding agent the map",
  summary: "A live mdkg goal turned durable requirements, routed work, and inspectable evidence into a differentiated static Astro landing page.",
  status: "Live rehearsal execution",
  sourcePath: "presentations/ai-native-sdlc-demo/runs/demo-003",
  outputRoute: "/demo/3/output/",
  listed: false,
  noindex: true,
  outputComponent: "demo-3",
  image: demo3Preview,
  imageAlt: "Ocean Flow route connecting Plan, Work, and Evidence for Demo 3.",
  stack: ["Reusable goal", "Static Astro", "Zero client JavaScript", "Ocean Flow"],
  validation: [
    "the specialized Demo 3 graph validates with no errors",
    "the portable Astro output builds from warm dependencies",
    "desktop and mobile checks show no horizontal overflow",
    "output contains zero client JavaScript, remote fonts, forms, trackers, or raster assets"
  ],
  sourceGoal: {
    id: "goal-1",
    title: "Build a complete differentiated website demo from the canonical mdkg template",
    status: "reusable source",
    condition: "Build a complete differentiated static Astro candidate while preserving fixed architecture, accessibility, safety, and evidence boundaries.",
    summary: "The source goal fixes the execution contract while leaving audience, offer, composition, and bounded copy to the implementing agent.",
    requirements: ["Choose positioning before implementation.", "Use static Astro, Ocean Flow, and zero client JavaScript.", "Validate locally before caller-owned integration."],
    authority: ["Local implementation and validation only.", "No publication without explicit external authority."],
    tests: ["Deterministic routing and pack coverage.", "Static build and responsive browser review.", "Public-safety, accessibility, and transfer-budget checks."],
    checkpoint: { id: "chk-3", title: "fork-ready semantic source release accepted", status: "recorded" },
    sourceHash: "sha256:cc033b466d9326d09da6576b27c5f48acf70debc89215f069e0f8526a1c39aba"
  },
  executedGoal: {
    id: "goal-1",
    title: "Build a complete differentiated website demo from the canonical mdkg template",
    status: "executing authorized live chain",
    condition: "Produce The Current Map, prove local and canonical output, publish only the allowlisted range, and verify exact-SHA production routes.",
    summary: "The executed specification selected engineering teams, a navigation-chart metaphor, a complete Plan → Work → Evidence story, and explicit publication gates.",
    requirements: ["Show source-to-execution contrast.", "Answer what completed, why, and what comes next.", "Keep routes unlisted, noindexed, static, accessible, and public-safe."],
    authority: ["One serialized writer.", "Frozen allowlist, bounded repairs, and one normal non-force push.", "Read-only provider and public-route verification."],
    tests: ["Portable local output.", "Canonical detail and output routes.", "Exact-SHA deployments and live URLs."],
    checkpoint: { id: "test-2", title: "canonical Demo 3 routes accepted locally", status: "recorded" },
    sourceHash: "sha256:00e479735d68c5bc5f966a048b9934d00a4aef0d0a9eb33852fbe5f239e48658"
  },
  work: [
    { id: "spike-1", type: "spike", title: "Choose The Current Map direction", status: "done", why: "Turn the reusable brief into a clear position for engineers and technical leaders." },
    { id: "task-1", type: "task", title: "Build the portable Astro output", status: "done", why: "Express the selected position as a complete static landing page." },
    { id: "test-1", type: "test", title: "Verify the local candidate", status: "done", why: "Prove static output, responsive behavior, accessibility, and public safety." },
    { id: "task-2", type: "task", title: "Integrate the canonical adapter", status: "in progress", why: "Expose sanitized graph evidence and the portable output through mdkg.dev." },
    { id: "test-2", type: "test", title: "Verify canonical routes", status: "next", why: "Prove both public surfaces before publication." }
  ],
  evidence: [
    { label: "Deterministic source", status: "recorded", detail: "The immutable run binding preserves source goal-1 and the authored work chain." },
    { label: "Creative decision", status: "recorded", detail: "The Current Map targets engineers and technical leaders with a navigation-chart visual system." },
    { label: "Local candidate", status: "pass", detail: "The 21 KB static output has zero scripts, hydration, remote runtime assets, or raster images." },
    { label: "Authority", status: "recorded", detail: "Publication is limited to the frozen allowlist, normal push, and read-only production verification." }
  ],
  graphNodes: [
    { id: "goal-1", type: "goal", title: "Build the complete Demo 3 website", status: "active", detail: "The goal owns positioning through exact-SHA public verification." },
    { id: "spike-1", type: "spike", title: "Choose audience and creative direction", status: "done", detail: "Selected The Current Map." },
    { id: "task-1", type: "task", title: "Build the static Astro candidate", status: "done", detail: "Created the portable self-contained output." },
    { id: "test-1", type: "test", title: "Verify local output", status: "done", detail: "Passed build, responsive, budget, and public-safety checks." },
    { id: "task-2", type: "task", title: "Integrate canonical routes", status: "in progress", detail: "Registers Demo 3 through the generalized adapter." },
    { id: "test-2", type: "test", title: "Verify canonical routes", status: "next", detail: "Build and inspect detail and output routes." },
    { id: "task-3", type: "task", title: "Publish the bounded range", status: "backlog", detail: "Runs only under the accepted external authority." },
    { id: "test-3", type: "test", title: "Verify exact-SHA production", status: "backlog", detail: "Requires the pushed SHA and existing production deployments." }
  ],
  files: [
    { path: "RUN_BINDING.json", kind: "binding", role: "Immutable run identity", excerpt: "Binds Demo 3 to the accepted source release, routes, and output component key." },
    { path: "artifacts/creative-direction.md", kind: "decision", role: "Public-safe positioning", excerpt: "Give every coding agent the map." },
    { path: "artifacts/local-validation.json", kind: "test receipt", role: "Portable-output proof", excerpt: "Static build, browser, accessibility, budget, and public-safety checks pass." },
    { path: ".mdkg/work/goal-1-build-a-complete-differentiated-website-demo-from-the-canonical-mdkg-template.md", kind: "goal", role: "Executed specification", excerpt: "The complete local-to-public chain remains inspectable as one goal." }
  ],
  workflow: ["Start from reusable goal-1.", "Choose a public-safe creative direction.", "Build and validate the portable output.", "Integrate and validate canonical routes.", "Publish and verify the exact public result."],
  safety: ["Unlisted and noindexed.", "Static Astro with zero client JavaScript.", "No credentials, private prompts, provider payloads, forms, analytics, or remote runtime assets.", "Publication remains externally authorized and bounded."],
  outputHighlights: ["high-contrast light Ocean Flow system", "Current Map route visual", "Plan → Work → Evidence", "source-versus-executed specification", "what completed, why, and what comes next", "quickstart and feedback CTA"]
};
