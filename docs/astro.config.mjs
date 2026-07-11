import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { loadPublicReleaseProjection } from "../release/public-release.mjs";

const publicRelease = loadPublicReleaseProjection({ env: process.env });
const loopsContentReady = [
  "./src/content/docs/loops/index.md",
  "./src/content/docs/loops/templates-and-forks.md",
  "./src/content/docs/loops/readiness-routing-evidence-closeout.md",
  "./src/content/docs/loops/security-audit.md",
].every((path) => existsSync(fileURLToPath(new URL(path, import.meta.url))));
const loopsSidebar = publicRelease.visible && loopsContentReady
  ? [
      {
        label: "Loops",
        items: [
          { label: "Overview", slug: "loops" },
          { label: "Templates And Forks", slug: "loops/templates-and-forks" },
          {
            label: "Readiness, Routing, Evidence, And Closeout",
            slug: "loops/readiness-routing-evidence-closeout",
          },
          { label: "Security Audit Walkthrough", slug: "loops/security-audit" },
        ],
      },
    ]
  : [];

export default defineConfig({
  site: "https://docs.mdkg.dev",
  output: "static",
  integrations: [
    starlight({
      title: "mdkg Docs",
      description: "Documentation for Markdown Knowledge Graph, git-native project memory for AI coding agents.",
      customCss: ["./src/styles/release.css"],
      head: publicRelease.site_noindex
        ? [
            {
              tag: "meta",
              attrs: {
                name: "robots",
                content: "noindex, nofollow",
              },
            },
          ]
        : [],
      editLink: {
        baseUrl: "https://github.com/nickreames/mdkg/edit/main/",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/nickreames/mdkg",
        },
      ],
      components: {
        Footer: "./src/components/Footer.astro",
        PageSidebar: "./src/components/PageSidebar.astro",
      },
      sidebar: [
        {
          label: "Start Here",
          items: [
            { label: "Overview", slug: "" },
            { label: "Install", slug: "start-here/install" },
            { label: "Quickstart", slug: "start-here/quickstart" },
            { label: "Safety Boundaries", slug: "start-here/safety-boundaries" },
            { label: "Public Alpha Contract", slug: "start-here/public-alpha-contract" },
            { label: "Troubleshooting", slug: "start-here/troubleshooting" },
          ],
        },
        {
          label: "Concepts",
          items: [
            { label: "Source Of Truth", slug: "concepts/source-of-truth" },
            { label: "Local-first And Low-dependency", slug: "concepts/local-first-low-dependency" },
            { label: "Repository Layout", slug: "concepts/repository-layout" },
            { label: "Plan -> Work -> Evidence", slug: "concepts/plan-work-evidence" },
            { label: "Work Node Types", slug: "concepts/work-node-types" },
            { label: "Reference Types", slug: "concepts/work-context-evidence" },
            { label: "Glossary", slug: "concepts/glossary" },
          ],
        },
        ...loopsSidebar,
        {
          label: "Guides",
          items: [
            { label: "Agent Workflow", slug: "guides/agent-workflow" },
            { label: "Packs And Handoffs", slug: "guides/packs-and-handoffs" },
            { label: "Research Spikes", slug: "guides/research-spikes" },
          ],
        },
        {
          label: "Advanced Alpha",
          items: [
            { label: "Overview", slug: "advanced-alpha/overview" },
            { label: "Project DB And Queues", slug: "advanced-alpha/project-db-queues" },
            { label: "Read-only MCP", slug: "advanced-alpha/read-only-mcp" },
            { label: "Subgraphs And Bundles", slug: "advanced-alpha/subgraphs-and-bundles" },
            { label: "Graph Movement", slug: "advanced-alpha/graph-movement" },
            { label: "Demo Graphs", slug: "advanced-alpha/demo-graphs" },
          ],
        },
        {
          label: "Reference",
          items: [
            { label: "Reference Home", slug: "reference" },
            { label: "Command Contract", slug: "reference/command-contract" },
            { label: "Generated CLI Reference", slug: "reference/generated-cli-reference" },
          ],
        },
        {
          label: "Project",
          items: [
            { label: "Changelog", slug: "project/changelog" },
            { label: "Roadmap", slug: "project/roadmap" },
          ],
        },
      ],
    }),
  ],
});
