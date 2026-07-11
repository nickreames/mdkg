import { publicRelease } from "../data/publicRelease.mjs";

export const prerender = true;

export function GET() {
  const body = publicRelease.site_noindex
    ? `User-agent: *
Disallow: /

Sitemap: https://docs.mdkg.dev/sitemap-index.xml
`
    : `User-agent: *
Allow: /

Sitemap: https://docs.mdkg.dev/sitemap-index.xml
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
