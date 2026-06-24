import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://docs.mdkg.dev",
  output: "static",
  integrations: [
    starlight({
      title: "mdkg Docs",
      description: "Documentation for Markdown Knowledge Graph, a git-native project memory CLI for AI-assisted software work.",
      editLink: {
        baseUrl: "https://github.com/nickreames/mdkg/edit/main/docs/src/content/docs/",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/nickreames/mdkg",
        },
      ],
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
            { label: "Repository Layout", slug: "concepts/repository-layout" },
            { label: "Work, Context, And Evidence", slug: "concepts/work-context-evidence" },
            { label: "Glossary", slug: "concepts/glossary" },
          ],
        },
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
            { label: "Claims Evidence Matrix", slug: "project/claims-evidence-matrix" },
            { label: "Roadmap", slug: "project/roadmap" },
          ],
        },
      ],
    }),
  ],
});
