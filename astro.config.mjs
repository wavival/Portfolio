import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: "https://wavival.dev",
  integrations: [
    tailwind(),
    sitemap({
      changefreq: "monthly",
      priority: 1.0,
      lastmod: new Date(),
      i18n: {
        defaultLocale: "es",
        locales: { es: "es-CO", en: "en-US" },
      },
    }),
  ],
  compressHTML: true,
  build: {
    inlineStylesheets: "auto",
  },
  vite: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  },
});
