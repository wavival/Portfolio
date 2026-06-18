# AGENTS.md

Guidance for AI coding agents working in this repo. See `CLAUDE.md` for full project context, stack, and conventions.

## Rules

- **No em dashes.** Never use the em-dash character (Unicode U+2014) anywhere in this repo: copy, code, comments, docs, commit messages, or PR descriptions. Use normal punctuation instead:
  - colon (`:`) when the second part explains the first,
  - comma (`,`) for a light aside,
  - parentheses (`( )`) for a parenthetical (especially when the aside already contains commas),
  - hyphen (`-`) for ranges or simple separators.
  - This applies to both generated and edited content. Do not substitute an en-dash (`–`) or any other fancy dash either; plain ASCII punctuation only.

- **No arrows or icons in buttons/links unless asked.** Never add `←`, `→`, `↑`, `↓`, or any decorative icon to a `Button` or `Link` component unless Valentina explicitly requests it. The components communicate action through their design; adding unsolicited arrows is a style override she will revert.

- **Keep docs in sync (ALWAYS, mandatory).** ALWAYS update both `CLAUDE.md` and `AGENTS.md` in the same change whenever ANY important change happens in the repository. Non-negotiable, no exceptions. "Important" includes (but is not limited to): infrastructure, dependencies, tooling, repo structure/file layout, build or deploy config (`netlify.toml`, CI), routing/i18n conventions, SEO / schema / JSON-LD / metadata, analytics, design-system or token decisions, and accessibility behavior. Treat the docs as part of the change, never a follow-up: if a change makes any statement in either file wrong or incomplete, fix it before finishing. Applies to Claude and all subagents, every time.

- **Bilingual routing.** ES is the default at root with Spanish slugs (`/proyectos`, `/servicios`, `/sobre-mi`, `/contacto`, `/herramientas`, `/privacidad`); EN mirrors under `/en/` with English slugs. Never hardcode a route that ignores language: use the `isEn ? "/en/..." : "/<es-slug>"` ternary in components, and update the slug map in `src/i18n/utils.ts` (`EN_PAGE_MAP` + `getAltLangUrl`) whenever you add a page or rename a slug. Legacy English-word ES routes 301-redirect to the Spanish slugs in `netlify.toml`. `getAltLangUrl` special-cases `/404` and `/en/404`: both redirect to the opposite locale's home rather than a translated error page.

- **SEO and JSON-LD conventions.** All hreflang `href` values and BreadcrumbList/Service `item`/`url` values must carry trailing slashes to match canonical URLs. `Person.image` is an `ImageObject` node (not a bare URL string). `Organization.logo` is an `ImageObject` node. `Person.description` in the `@graph` is a stable Spanish bio constant, not the page-level meta description. The `WebSite` node omits `inLanguage` (shared `@id` must not mutate per locale). `og:image:type` is derived from the OG image file extension (`.webp` yields `image/webp`). Service nodes carry `@id` and `priceRange`. Both `ContactPage` pages (`/contacto` and `/en/contact`) also emit a `BreadcrumbList`.

- **Testing.** Run `npm run build` then `npm test`. Playwright serves `dist/` via its own `astro preview` on port **4329** with `reuseExistingServer: false`, so a dev server on 4321 is never reused (a dev server has no sitemap and uses localhost canonicals, breaking the SEO/i18n specs). Every standalone page needs exactly one `<h1>`: section components reused as full pages (e.g. `Projects`) take a `heading="h1"` prop, since their default top heading is `h2` for the homepage where `Hero` owns the `h1`. The route-coverage spec asserts this. Some specs are pure unit tests (no browser): `redirects.spec.ts` parses `netlify.toml` to lock the legacy 301s, `i18n-utils.spec.ts` tests `getAltLangUrl` directly. Update these when you change redirects or the slug map.

- **CI gates (`.github/workflows/ci.yml`).** `quality` (dependency audit via `npm audit --audit-level=high --omit=dev` → format check → type check via `astro check` → build) gates three downstream jobs: `e2e` (Playwright), `lighthouse` (`npm run lhci`, asserts perf/a11y/best-practices/SEO via `lighthouserc.json`), and `links` (`npm run links`, linkinator over `dist/` for broken internal links). Run `npm run build` before `lhci`/`links` locally. All four jobs pin Node via `node-version-file: ".nvmrc"` (→ `22`). Favicon/manifest icons in `public/` are generated from `brand/logo-w.webp` with `sharp`; regenerate them if the logo changes. Dependabot opens weekly dependency PRs. Security contact lives at `public/.well-known/security.txt` (RFC 9116); bump its `Expires` date before it lapses. `CHANGELOG.md` follows Keep a Changelog + SemVer: add entries under `[Unreleased]` as you ship, and cut a version section on release.

- Follow all conventions in `CLAUDE.md` (design tokens, dark-mode via `.dark` class, static-only Astro, accessibility, etc.).
