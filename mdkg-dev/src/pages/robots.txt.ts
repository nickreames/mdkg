export const prerender = true;

const previewNoindex =
  import.meta.env.VERCEL_ENV === "preview" ||
  String(import.meta.env.PUBLIC_MDKG_PREVIEW_NOINDEX || "").toLowerCase() === "true";

export function GET() {
  const body = previewNoindex
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
