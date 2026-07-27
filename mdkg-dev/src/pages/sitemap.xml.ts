import { indexableDemos } from "../data/demos";

export const prerender = true;

const staticRoutes = [
  "/",
  "/quickstart/",
  "/demos/",
  "/trust/",
  "/alpha/",
  "/llms.txt",
  "/llms-full.txt"
];

export function GET() {
  const demoRoutes = indexableDemos.map((demo) => `/demo/${demo.id}/`);
  const urls = [...staticRoutes, ...demoRoutes]
    .map((route) => `  <url><loc>https://mdkg.dev${route}</loc></url>`)
    .join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8"
    }
  });
}
