export const prerender = true;

import { publicRelease } from "../data/publicRelease.mjs";

export function GET() {
  const body = publicRelease.site_noindex
    ? `User-agent: *
Disallow: /

Sitemap: https://mdkg.dev/sitemap.xml
`
    : `User-agent: *
Allow: /

Sitemap: https://mdkg.dev/sitemap.xml
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8"
    }
  });
}
