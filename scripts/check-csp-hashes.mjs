// Verifies that every inline <script> emitted into dist/ has a matching sha256
// hash in the script-src directive of the Content-Security-Policy header in
// netlify.toml. This guards the hash-based CSP: if an inline script changes or a
// new one is added, its hash drifts and the browser would block it in production
// (silent FOUC / broken nav). Run after `npm run build`. Exits non-zero on any miss.
//
// External scripts (src=...) are covered by host allow-lists, not hashes.
// JSON-LD (type=application/ld+json) is a CSP data block, not gated by script-src.

import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const distDir = path.join(root, "dist");

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return walk(full);
    return e.name.endsWith(".html") ? [full] : [];
  });

const toml = readFileSync(path.join(root, "netlify.toml"), "utf8");
const cspMatch = toml.match(/Content-Security-Policy\s*=\s*"([^"]*)"/);
if (!cspMatch) {
  console.error("check-csp-hashes: no Content-Security-Policy found in netlify.toml");
  process.exit(1);
}
const csp = cspMatch[1];
const scriptSrc = csp.split(";").find((d) => d.trim().startsWith("script-src")) ?? "";
const allowedHashes = new Set(
  [...scriptSrc.matchAll(/'(sha256-[A-Za-z0-9+/=]+)'/g)].map((m) => m[1])
);

let htmlFiles = [];
try {
  htmlFiles = walk(distDir);
} catch {
  console.error("check-csp-hashes: dist/ not found (run `npm run build` first)");
  process.exit(1);
}
if (htmlFiles.length === 0) {
  console.error("check-csp-hashes: no HTML in dist/ (run `npm run build` first)");
  process.exit(1);
}

// Inline <script> with no src= and not a data block (ld+json / json / importmap).
const tag = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g;
const isDataBlock = (attrs) =>
  /type\s*=\s*["'](application\/(ld\+json|json)|importmap)["']/i.test(attrs);

const misses = [];
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const [, attrs, body] of html.matchAll(tag)) {
    if (isDataBlock(attrs)) continue;
    const hash = "sha256-" + createHash("sha256").update(body, "utf8").digest("base64");
    if (!allowedHashes.has(hash)) {
      misses.push({ file: path.relative(root, file), hash, attrs: attrs.trim() });
    }
  }
}

if (misses.length) {
  console.error(`check-csp-hashes: ${misses.length} inline script(s) missing a CSP hash:\n`);
  const seen = new Set();
  for (const m of misses) {
    if (seen.has(m.hash)) continue;
    seen.add(m.hash);
    console.error(`  '${m.hash}'  (e.g. ${m.file}${m.attrs ? `, <script ${m.attrs}>` : ""})`);
  }
  console.error(`\nAdd the hash(es) above to script-src in netlify.toml.`);
  process.exit(1);
}

console.log(
  `check-csp-hashes: OK (${htmlFiles.length} pages, ${allowedHashes.size} hashes in CSP).`
);
