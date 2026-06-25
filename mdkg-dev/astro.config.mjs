import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://mdkg.dev",
  output: "static",
  redirects: {
    "/docs": {
      status: 308,
      destination: "https://docs.mdkg.dev/"
    }
  }
});
