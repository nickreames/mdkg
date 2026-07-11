import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { publicRelease } from "./data/publicRelease.mjs";

const markdownPattern = "**/[^_]*.{markdown,mdown,mkdn,mkd,mdwn,md,mdx}";
const docsPattern = publicRelease.visible
  ? markdownPattern
  : [markdownPattern, "!loops/**"];

export const collections = {
  docs: defineCollection({
    loader: glob({ pattern: docsPattern, base: "./src/content/docs" }),
    schema: docsSchema(),
  }),
};
