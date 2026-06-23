export const prerender = true;

export function GET() {
  const body = `User-agent: *
Allow: /

Sitemap: https://mdkg.dev/sitemap.xml
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8"
    }
  });
}
