import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const toml = readFileSync(fileURLToPath(new URL("../netlify.toml", import.meta.url)), "utf8");

// Legacy English-word ES routes that MUST keep 301-ing to their Spanish slugs.
// Guards against silent removal after the slug rename.
const LEGACY_301 = [
  { from: "/projects/*", to: "/proyectos/:splat" },
  { from: "/projects", to: "/proyectos" },
  { from: "/services", to: "/servicios" },
  { from: "/about", to: "/sobre-mi" },
  { from: "/contact", to: "/contacto" },
  { from: "/uses", to: "/herramientas" },
];

test.describe("netlify legacy redirects", () => {
  for (const { from, to } of LEGACY_301) {
    test(`${from} -> ${to} is a 301`, () => {
      const block = new RegExp(
        `from\\s*=\\s*"${from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"\\s*\\n\\s*to\\s*=\\s*"${to.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"\\s*\\n\\s*status\\s*=\\s*301`
      );
      expect(toml, `redirect block for ${from}`).toMatch(block);
    });
  }
});
