# CLAUDE.md: Project Context

## What this is

Personal portfolio of **Valentina Ramírez**, Full Stack Developer (Django · React), Founder of [Lúmina W](https://luminaw.co). Third iteration of the site, built to reflect real technical identity, not just a résumé.

**Production URL:** `https://wavival.dev`
**Repository:** `https://github.com/wavival/wavival.dev`

---

## Stack and versions

- **Astro 6** (static output, no SSR, no server functions; `compressHTML: true`)
- **Tailwind CSS v3** (`darkMode: 'class'`)
- **TypeScript** (client-side scripts only)
- **AOS** (Animate On Scroll)
- **web-vitals**: Core Web Vitals RUM, reports LCP/INP/CLS/FCP/TTFB to Umami as custom events (only when Umami env is set)
- **`@astrojs/sitemap`**: generates `/sitemap-index.xml` + `/sitemap-0.xml` at build
- **Playwright**: E2E smoke tests (`tests/`)
- **Lighthouse CI** (`@lhci/cli`, config in `lighthouserc.json`): asserts perf/a11y/best-practices/SEO category scores against the built `dist/` per commit
- **linkinator**: crawls the built `dist/` for broken internal links (catches dead routes after slug renames)
- **Prettier** + `prettier-plugin-astro`
- **ESLint** (flat config `eslint.config.mjs`: `eslint-plugin-astro` + `typescript-eslint` + `eslint-config-prettier`)
- **husky** + **lint-staged**: `.husky/pre-commit` runs `lint-staged` (ESLint `--fix` + Prettier on staged files)
- **Dependabot** (`.github/dependabot.yml`): weekly npm + github-actions update PRs
- **Node >= 22.12** (repo pins `.nvmrc` → `22`; all CI jobs read it via `node-version-file: ".nvmrc"`)

Auto-deploy to **Netlify** on every push to `main`. CI (`.github/workflows/ci.yml`) has four jobs: `quality` (dependency audit (`npm audit --audit-level=high --omit=dev`) → format check → lint (`npm run lint`) → type check (`astro check`) → build) gates the rest, then `e2e` (Playwright), `lighthouse` (Lighthouse CI), and `links` (linkinator) run after it before Netlify publishes.

`.npmrc` sets `legacy-peer-deps=true` because `@astrojs/tailwind@6` declares an Astro 3/4/5 peer range while we run Astro 6.

---

## General architecture

Multi-page static site with a bilingual (ES default, EN) routing scheme. The home is a single-page assembly of sections; the rest are standalone pages plus one dynamic route (`proyectos/[slug]`).

### Routing and i18n

- **Spanish (default)** lives at the root with Spanish slugs:
  - `/` (home), `/proyectos`, `/proyectos/[slug]`, `/servicios`, `/sobre-mi`, `/contacto`, `/herramientas`, `/privacidad`, `/404`
- **English** mirrors it under `/en/` with English slugs:
  - `/en`, `/en/projects`, `/en/projects/[slug]`, `/en/services`, `/en/about`, `/en/contact`, `/en/uses`, `/en/privacy`, `/en/404`
- The ES↔EN slug mapping (e.g. `/proyectos` ↔ `/en/projects`) is the single source of truth in `src/i18n/utils.ts` (`EN_PAGE_MAP`, its reverse `ES_PAGE_MAP`, and the `/proyectos/<slug>` ↔ `/en/projects/<slug>` special-case in `getAltLangUrl`). The language toggle reads from here, and `astro.config.mjs` imports the exported `EN_PAGE_MAP` for its sitemap `serialize` hook, so any new page or slug rename MUST update this map. `getAltLangUrl` also special-cases `/404` and `/en/404`: both redirect to the opposite locale's home instead of trying to find a translated 404 page.
- Shared section components (`Hero`, `Projects`, `Stack`, `Contact`, `About`) take a `lang` prop and pick targets with a ternary (`isEn ? "/en/..." : "/<es-slug>"`). NavBar/Footer do the same. Never hardcode a route that ignores `lang`.
- Per-locale assets resolve through helpers in `src/i18n/utils.ts`: `cvHref(lang)` returns `cv_valentina_ramirez_<es|en>.pdf`. UI strings come from `src/i18n/ui.ts` via `useTranslations(lang)`.
- Legacy English-word ES routes (`/projects`, `/services`, `/about`, `/contact`, `/uses`) are 301-redirected to the Spanish slugs in `netlify.toml`. Content stays Spanish; only the URL changed.
- EN pages declare `hreflang` alternates (es / en / x-default) in their `Layout` call; the `es`/`x-default` hrefs point at the Spanish slugs.

The base layout (`src/layouts/Layout.astro`) owns the entire `<head>`: meta tags, OG, JSON-LD, fonts, Umami, skip link, NavBar, and Footer. It accepts `lang` (default `es`) which drives `<html lang>`, `og:locale`, JSON-LD `inLanguage`, and translations.

---

## File structure

```
src/
  components/
    sections/         # Hero, Projects, Stack, About, Contact
    ui/               # Button, Link, NavBar, Footer
  layouts/
    Layout.astro      # Base layout: full head, skip link, NavBar, Footer
  pages/
    index.astro       # ES home: assembles all sections
    404.astro         # ES error page with noindex
    proyectos/        # ES: index.astro + [slug].astro (dynamic case studies)
    servicios.astro   # ES services
    sobre-mi.astro    # ES about
    contacto.astro    # ES contact
    herramientas.astro # ES uses
    privacidad.astro  # ES privacy
    en/               # EN mirror: index, 404, projects/, services, about, contact, uses, privacy
  scripts/
    nav.ts            # Mobile menu: inert/focus management, Escape, focus trap
    theme.ts          # Dark/light toggle + localStorage (post-paint sync)
    vitals.ts         # Core Web Vitals RUM, reports to Umami (only when Umami env set)
  styles/
    global.css        # Imports, body base, prefers-reduced-motion
    tokens.css        # CSS custom properties (design tokens)
    utilities.css     # @layer utilities: custom utility classes
public/
  brand/              # logo-w.webp, logo-w.ico (visible brand logo in NavBar/Footer)
  icons/ui/           # Decorative SVGs (always alt="")
  images/             # profile.webp
  favicon.ico         # Favicon (16/32/48 multi-res, generated from logo-w.webp)
  apple-touch-icon.png # 180x180 iOS home-screen icon
  icon-192.png        # PWA/manifest icon (purpose any)
  icon-512.png        # PWA/manifest icon (purpose any)
  icon-maskable-512.png # PWA/manifest icon (purpose maskable, dark safe-zone bg)
  site.webmanifest    # Web app manifest (icons, theme/background color, lang es)
  cv_valentina_ramirez_es.pdf   # Spanish CV (served on ES pages)
  cv_valentina_ramirez_en.pdf   # English CV (served on EN pages)
  llms.txt            # llmstxt.org descriptor for AI assistants
  robots.txt          # Allows indexing, references /sitemap-index.xml
  .well-known/
    security.txt      # RFC 9116 security contact (Contact, Expires, Canonical)
tests/                # Playwright E2E smoke tests + pure-unit specs (redirects, i18n-utils)
lighthouserc.json     # Lighthouse CI config (staticDistDir + category assertions)
.nvmrc                # Node version pin (22)
.github/dependabot.yml    # Weekly npm + github-actions update PRs
.github/workflows/ci.yml  # quality gate → e2e + lighthouse + links jobs
eslint.config.mjs     # ESLint flat config (astro + typescript-eslint + prettier)
.husky/pre-commit     # Runs lint-staged (ESLint --fix + Prettier on staged files)
CHANGELOG.md          # Keep a Changelog format, SemVer; update on every release
```

The favicon/manifest icon set in `public/` is generated from `public/brand/logo-w.webp` (square canvas, contained logo; maskable variant gets a dark `#0f1117` safe-zone background). Regenerate with `sharp` if the logo changes. The visible brand logo (`brand/logo-w.*`) is separate and unchanged.

The pre-paint theme script is inlined synchronously at the top of `<head>` in `Layout.astro`: it reads `localStorage["theme"]` (or `prefers-color-scheme`) and adds `.dark` to `<html>` before first paint. `src/scripts/theme.ts` only handles toggle clicks and icon sync after hydration.

---

## Design system

### Tokens (`src/styles/tokens.css`)

All color, spacing, and shadow values live as CSS custom properties in `:root` and `.dark`. **Never hardcode colors in components**: always use `var(--token-name)`.

Key tokens:

- `--brand-blue: #407bff`: primary brand color (use for fills, borders, and large/display text only; at ~3.4:1 on `--bg-page` it fails AA for small text)
- `--brand-blue-text: #1d4ed8` light / `#5b8cff` dark: accessible blue for small text (>=4.5:1). Use this token, never `--brand-blue`, for `text-xs`/`text-sm` and other sub-large blue text (section subtitles, chips, card labels, filter buttons)
- `--bg-page` / `--bg-card` / `--bg-blur`: backgrounds
- `--text-primary` / `--text-muted`: typography
- `--accent-link` / `--accent-hover`: interactive elements
- `--border-base`: borders
- `--radius-sm/md/lg`: border radii
- `--space-section: 96px`: section spacing

### Typography

- `font-display` → Raleway (headings, buttons, uppercase labels)
- `font-body` → Poppins (body text, paragraphs)
- Configured in `tailwind.config.mjs`

### Utility classes (`src/styles/utilities.css`)

All inside `@layer utilities`, 2-space indentation throughout. Available classes:

- `.section`: section container (max-w-5xl, standard padding)
- `.section-title`: h2 section heading
- `.section-subtitle`: label above title (uppercase, blue)
- `.btn-primary`: blue button/link with hover translateX
- `.btn-ghost`: outline button
- `.chip`: technology badge/pill
- `.card`: card with 4px bottom border and hover scale
- `.card-plain`: borderless card with hover translateX
- `.nav-link`: navigation link
- `.link`: inline link with hover translateX
- `.icon`, `.icon-sm/md/lg/xl`: icon sizing classes

---

## UI Components

### `Button.astro`

Renders `<a>` or `<button>` depending on whether `href` is provided. Props: `id`, `href`, `target`, `type`, `class`, `icon`, `download`, `aria-label`. Applies `.btn-primary`. Icon images always have `width="20" height="20"`.

### `Link.astro`

Text link with optional icon. Props: `href`, `target`, `class`, `icon`, `aria-label`. Applies `.link`. Icon images always have `width="24" height="24"`.

### `NavBar.astro`

Fixed header with backdrop blur. Includes desktop nav (`<ul role="list">`), animated mobile nav with opacity/translate, theme toggle, and hamburger button. All interactive buttons have `focus-visible:ring-2 focus-visible:ring-[var(--accent-link)]`.

### `Footer.astro`

Three columns: logo + social links, site navigation, resources. Year generated with `new Date().getFullYear()`.

---

## SEO / A11Y: current state

### SEO

- Meta title, description, author, robots with extended directives
- Canonical URL generated from `Astro.url.pathname` + site base
- Reciprocal `hreflang` (es / en / x-default) on every page via the `alternates` prop passed to `Layout`: the ES and EN pair point at each other, `x-default` points at the Spanish slug
- Full OpenGraph (og:image with dimensions, alt, `og:locale` plus `og:locale:alternate` for the other locale); `og:image:type` is derived from the OG image file extension (`.webp` yields `image/webp`, otherwise `image/png`)
- Twitter Card (`summary_large_image`)
- JSON-LD `@graph` in `Layout.astro`: `Person` (with `knowsAbout`, `knowsLanguage`, `nationality`, `alumniOf`, `worksFor` referencing the Organization by `@id`, a `sameAs` of identity profiles only, `image` as an `ImageObject` with `@id`/`url`/`width`/`height`/`caption`, and a stable `description` constant independent of the page meta description), `Organization` (Lúmina W, own `@id`, `logo` as an `ImageObject`), and `WebSite` (fixed `name`; no `inLanguage` to avoid per-locale mutation under the shared `@id`)
- Per-page JSON-LD: `BreadcrumbList` on section/index pages, `/proyectos/[slug]`, `/contacto`, and `/en/contact`; `Service` (with `@id` and `priceRange`) + `FAQPage` on `/servicios` and `/en/services`; `ContactPage` on `/contacto` and `/en/contact`; case studies emit `SoftwareApplication` | `WebSite` | `CreativeWork` per `project.schemaType` with `datePublished`/`dateModified`
- All hreflang `href` values and BreadcrumbList/Service `item`/`url` values use trailing slashes to match canonical URLs
- `lang` on `<html>` driven by the `lang` prop (`es` default, `en` on `/en/` pages)
- Google Site Verification: env-driven via `PUBLIC_GSV` (meta tag only emitted when set)
- Analytics: Umami, env-driven via `PUBLIC_UMAMI_SRC` + `PUBLIC_UMAMI_ID` (cookieless; script only emitted when both are set; no Google Analytics)
- Real User Monitoring: `src/scripts/vitals.ts` reports Core Web Vitals (LCP/INP/CLS/FCP/TTFB) to Umami as `web-vitals` custom events; bundled and emitted only when the Umami env vars are set (same gate as analytics), sent to `cloud.umami.is` (already in CSP `connect-src`)
- Sitemap auto-generated at `/sitemap-index.xml` by `@astrojs/sitemap` with both locales (`es-CO`, `en-US`); referenced from `robots.txt`. A `serialize` hook in `astro.config.mjs` emits reciprocal `xhtml:link` alternates (`es-CO` / `en-US` / `x-default`) on every bilingual URL by pairing ES↔EN from the exported `EN_PAGE_MAP` plus the `/proyectos/<slug>` ↔ `/en/projects/<slug>` rule (Astro's built-in i18n only pairs URLs sharing a locale path prefix, which the Spanish slugs do not). Alternate hrefs use trailing slashes to match the canonical.
- `llms.txt` at `/llms.txt` describes the site for AI assistants (llmstxt.org spec)

### A11Y

- Skip link to `#main-content` (visible on focus)
- Heading hierarchy: single h1 in Hero, h2 in each section, h3 in cards. Footer group titles ("Navegación"/"Recursos") are real `<h2>` elements (not `aria-hidden` spans)
- `aria-label` on all interactive elements, respecting Label-in-Name (WCAG 2.5.3): when a control has visible text, its `aria-label` must contain that text verbatim (e.g. nav email CTA, blog link, Stack "Criterio técnico"/"Technical criteria")
- `aria-expanded` + `aria-controls` on mobile menu button
- Mobile menu focus management (`src/scripts/nav.ts`): the menu carries `inert` while closed (set in markup + JS, so closed links are never tabbable, also correct without JS); opening moves focus to the first link, Escape and link-clicks close it, Escape restores focus to the hamburger, and Tab is trapped within the open menu
- `aria-current="page"` on the active NavBar + Footer link (computed via `isCurrent()` from `Astro.url.pathname`, hash-only links excluded); styled with an underline (not color alone) via `.link[aria-current="page"]`
- Theme toggle exposes the current state: `theme.ts` sets a dynamic `aria-label` ("Cambiar a tema claro/oscuro" per locale) on each toggle in `syncIcons`
- All decorative icon `<img>` elements have `alt=""` (including the NavBar/Footer brand logo, whose link is named by `aria-label`)
- Icon-only links get a >=44x44 px hit target via `.link:has(> img:only-child)` (WCAG 2.5.8)
- `role="list"` on desktop nav `<ul>`
- `prefers-reduced-motion` respected in AOS init, `global.css`, the `proyectos/[slug]` accordion, project filters, and the Loader. The accordion cancels any in-flight animation on re-click (no dropped Enter presses)
- The `Loader` overlay is hidden via `<noscript>` so a no-JS / failed-JS load never blocks the page (plus a 1200ms JS safety-net `hide()`)
- Theme toggle and hamburger buttons have `focus-visible:ring-2`
- WCAG AA contrast: `--text-muted` light `#4b5563` (~5.9:1 on `#f0f4ff`), dark `#9ca3af` (~7.4:1 on `#0f1117`). Small blue text uses `--brand-blue-text` (>=4.5:1); `--brand-blue` is reserved for fills, borders, and large/display text (>=3:1). Project tag chips use `text-blue-900` (light) / `text-blue-300` (dark) for the `blue` variant

### Performance

- Pre-paint theme script (sync `is:inline` in `<head>`) avoids FOUC.
- Hero image: WebP, `fetchpriority="high"`, `decoding="async"`, explicit dimensions, plus `<link rel="preload" as="image">` for LCP.
- Google Fonts: async non-blocking load via `media="print"` + `onload` + `<noscript>` fallback.
- Umami analytics: cookieless, script injected only when `PUBLIC_UMAMI_SRC` + `PUBLIC_UMAMI_ID` are set.
- Core Web Vitals RUM (`web-vitals` via `src/scripts/vitals.ts`): bundled and run only when the Umami env vars are set; reports field LCP/INP/CLS/FCP/TTFB to Umami.
- All icon `<img>` elements have `width` and `height` to prevent CLS.
- AOS initialized with `once: true`, `duration: 0` when `prefers-reduced-motion` is set.
- Netlify cache: `/_astro/`, `/images/`, `/brand/`, `/icons/` served immutable (1y). CSP + HSTS + frame-deny baked in.

---

## Personal data locations

If used as a template, these are the files containing Valentina's personal information:

| File                                                         | Data                                                                                                                                        |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/layouts/Layout.astro`                                   | Default title, description, `site` constant, JSON-LD (Person + Organization + WebSite `@graph`: name, jobTitle, alumniOf, worksFor, sameAs) |
| `.env` (`PUBLIC_UMAMI_SRC`, `PUBLIC_UMAMI_ID`, `PUBLIC_GSV`) | Umami script URL + website ID + Google Site Verification token                                                                              |
| `src/components/sections/Hero.astro`                         | Name, tagline, CV URL, social links                                                                                                         |
| `src/components/sections/Projects.astro`                     | All projects (title, description, links)                                                                                                    |
| `src/components/sections/Stack.astro`                        | Stack categories and tools                                                                                                                  |
| `src/components/sections/About.astro`                        | Bio, personal quote, additional links                                                                                                       |
| `src/components/sections/Contact.astro`                      | Contact email                                                                                                                               |
| `src/components/ui/NavBar.astro`                             | CTA email, blog URL                                                                                                                         |
| `src/components/ui/Footer.astro`                             | Name in copyright, Lúmina W links                                                                                                           |
| `public/robots.txt`                                          | Sitemap absolute URL                                                                                                                        |
| `public/llms.txt`                                            | Personal description, projects, links (llmstxt.org spec)                                                                                    |
| `astro.config.mjs`                                           | `site` URL                                                                                                                                  |
| `public/cv_valentina_ramirez_es.pdf`                         | Spanish CV (resolved per-locale via `cvHref()` in `src/i18n/utils.ts`)                                                                      |
| `public/cv_valentina_ramirez_en.pdf`                         | English CV (resolved per-locale via `cvHref()` in `src/i18n/utils.ts`)                                                                      |
| `public/images/profile.webp`                                 | Profile photo                                                                                                                               |
| `public/brand/logo-w.*`                                      | Brand logo                                                                                                                                  |
| `public/site.webmanifest`                                    | App name + description (personal); icons derived from `brand/logo-w.webp`                                                                   |

---

## Code conventions

- **Astro components:** Props typed with `interface Props` in frontmatter
- **No unnecessary comments**: code is documented via descriptive names
- **CSS:** always use `var()` for tokens; utility classes inside `@layer utilities` with 2-space indentation
- **Scripts:** vanilla TypeScript, no client-side frameworks
- **Images:** WebP for photos, SVG for icons. Always include `width`, `height`, and appropriate `alt`
- **External links:** always `target="_blank"` + `rel="noopener noreferrer"` (handled automatically by `Link.astro` and `Button.astro`)
- **Dark mode:** only via `.dark` class on `<html>`, never via `@media (prefers-color-scheme)`
- **No em dashes:** never use the em-dash character (Unicode U+2014) anywhere in this repo (copy, comments, docs, commits, code). Use normal punctuation instead: colon for explanations, comma for asides, parentheses for parentheticals, hyphen for ranges/separators. Do not substitute an en-dash (U+2013) either; plain ASCII only. This applies to generated and edited content alike.
- **No emojis:** never use emoji characters anywhere in this repo: data files, copy, comments, docs, commits, or code. This rule applies to Claude and all subagents without exception.
- **Keep docs in sync (ALWAYS, mandatory):** ALWAYS update both `CLAUDE.md` and `AGENTS.md` in the same change whenever ANY important change happens in the repository. This is non-negotiable, with no exceptions. "Important" includes (but is not limited to): infrastructure, dependencies, tooling, repo structure/file layout, build or deploy config, routing/i18n conventions, SEO / schema / JSON-LD / metadata, analytics, design-system or token decisions, accessibility behavior, and any other structural or behavioral decision. Treat the docs as part of the change, never a follow-up: if a change makes any statement in either file wrong or incomplete, fix it before finishing. This applies to Claude and all subagents, every time.

---

## Available commands

```bash
npm run dev           # Dev server at localhost:4321
npm run build         # Static build to ./dist/
npm run preview       # Preview the build
npm run check         # astro check (type + diagnostic)
npm run format        # Format with Prettier
npm run format:check  # Check formatting without writing
npm run lint          # ESLint (flat config, eslint-plugin-astro + typescript-eslint)
npm run lint:fix      # ESLint with --fix
npm test              # Playwright E2E (builds nothing; runs `astro preview` on port 4329)
npm run test:ui       # Playwright UI mode
npm run test:install  # One-time: download Chromium + system deps
npm run lhci          # Lighthouse CI against ./dist (run `npm run build` first)
npm run links         # linkinator: check ./dist for broken internal links (build first)
```

> Run `npm run build` before `npm test`: the suite serves the static `dist/` via preview, it does not build for you.
> Playwright runs its own preview on **port 4329** with `reuseExistingServer: false`, so a `npm run dev` server on 4321 never gets reused for tests (a dev server emits no sitemap and uses localhost canonicals, which would fail SEO/i18n specs). Coverage: home, all ES + EN routes and project case studies, mobile menu, theme, i18n (lang attrs, per-locale CV, hreflang, language toggle), and SEO (robots, sitemap, localized `<loc>` entries).

---

## What NOT to do

- Do not add SSR or server endpoints: this is a pure static site
- Do not install client-side JS frameworks (React, Vue, etc.) without a real need
- Do not hardcode colors in components: use design tokens
- Do not use `@media (prefers-color-scheme)` for dark mode: the toggle uses the `.dark` class
- Do not omit `aria-label` on interactive elements with no visible text
- Do not set image dimensions via CSS only: always include HTML `width` and `height` attributes as well
- Do not commit a static `public/sitemap.xml`: the sitemap is generated by `@astrojs/sitemap` at build time
- Do not hardcode analytics or verification tokens: wire them through `PUBLIC_UMAMI_SRC` / `PUBLIC_UMAMI_ID` / `PUBLIC_GSV`
- Do not move the pre-paint theme `<script is:inline>` out of the top of `<head>`: it must execute before stylesheets load to avoid FOUC
- Do not use the em-dash character (Unicode U+2014): use a colon, comma, parentheses, or hyphen instead (see Code conventions)
- Do not use emoji characters anywhere: data files, copy, comments, docs, commits, or code
- Do not add arrows (`←`, `→`, `↑`, `↓`) or decorative icons to buttons or links unless explicitly requested by Valentina: `Button` and `Link` already communicate direction/action through their styling and `icon=` prop
