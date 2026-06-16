# CLAUDE.md — Project Context

## What this is

Personal portfolio of **Valentina Ramírez**, Full Stack Developer (Django · React), Founder of [Lúmina W](https://luminaw.co). Third iteration of the site, built to reflect real technical identity, not just a résumé.

**Production URL:** `https://wavival.dev`
**Repository:** `https://github.com/wavival/wavival.dev`

---

## Stack and versions

- **Astro 6** (static output — no SSR, no server functions; `compressHTML: true`)
- **Tailwind CSS v3** (`darkMode: 'class'`)
- **TypeScript** (client-side scripts only)
- **AOS** (Animate On Scroll)
- **`@astrojs/sitemap`** — generates `/sitemap-index.xml` + `/sitemap-0.xml` at build
- **Playwright** — E2E smoke tests (`tests/`)
- **Prettier** + `prettier-plugin-astro`
- **Node >= 22.12** (CI pins `22`)

Auto-deploy to **Netlify** on every push to `main`. CI (`.github/workflows/ci.yml`) gates with format check → build → Playwright E2E before Netlify publishes.

`.npmrc` sets `legacy-peer-deps=true` because `@astrojs/tailwind@6` declares an Astro 3/4/5 peer range while we run Astro 6.

---

## General architecture

Single-page site with section anchors. No dynamic routes. Only two pages:

- `/` → `src/pages/index.astro`
- `/404` → `src/pages/404.astro`

The base layout (`src/layouts/Layout.astro`) owns the entire `<head>`: meta tags, OG, JSON-LD, fonts, GA, skip link, NavBar, and Footer.

---

## File structure

```
src/
  components/
    sections/         # Hero, Projects, Stack, About, Contact
    ui/               # Button, Link, NavBar, Footer
  layouts/
    Layout.astro      # Base layout — full head, skip link, NavBar, Footer
  pages/
    index.astro       # Assembles all sections
    404.astro         # Error page with noindex
  scripts/
    nav.ts            # Mobile menu + Escape key handler
    theme.ts          # Dark/light toggle + localStorage (post-paint sync)
  styles/
    global.css        # Imports, body base, prefers-reduced-motion
    tokens.css        # CSS custom properties (design tokens)
    utilities.css     # @layer utilities — custom utility classes
public/
  brand/              # logo-w.webp, logo-w.ico
  icons/ui/           # Decorative SVGs (always alt="")
  images/             # profile.webp
  cv_valentina_ramirez.pdf
  llms.txt            # llmstxt.org descriptor for AI assistants
  robots.txt          # Allows indexing, references /sitemap-index.xml
tests/                # Playwright E2E smoke tests
.github/workflows/ci.yml  # quality + e2e gates
```

The pre-paint theme script is inlined synchronously at the top of `<head>` in `Layout.astro` — it reads `localStorage["theme"]` (or `prefers-color-scheme`) and adds `.dark` to `<html>` before first paint. `src/scripts/theme.ts` only handles toggle clicks and icon sync after hydration.

---

## Design system

### Tokens (`src/styles/tokens.css`)

All color, spacing, and shadow values live as CSS custom properties in `:root` and `.dark`. **Never hardcode colors in components** — always use `var(--token-name)`.

Key tokens:

- `--brand-blue: #407bff` — primary brand color
- `--bg-page` / `--bg-card` / `--bg-blur` — backgrounds
- `--text-primary` / `--text-muted` — typography
- `--accent-link` / `--accent-hover` — interactive elements
- `--border-base` — borders
- `--radius-sm/md/lg` — border radii
- `--space-section: 96px` — section spacing

### Typography

- `font-display` → Raleway (headings, buttons, uppercase labels)
- `font-body` → Poppins (body text, paragraphs)
- Configured in `tailwind.config.mjs`

### Utility classes (`src/styles/utilities.css`)

All inside `@layer utilities`, 2-space indentation throughout. Available classes:

- `.section` — section container (max-w-5xl, standard padding)
- `.section-title` — h2 section heading
- `.section-subtitle` — label above title (uppercase, blue)
- `.btn-primary` — blue button/link with hover translateX
- `.btn-ghost` — outline button
- `.chip` — technology badge/pill
- `.card` — card with 4px bottom border and hover scale
- `.card-plain` — borderless card with hover translateX
- `.nav-link` — navigation link
- `.link` — inline link with hover translateX
- `.icon`, `.icon-sm/md/lg/xl` — icon sizing classes

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

## SEO / A11Y — current state

### SEO

- Meta title, description, author, robots with extended directives
- Canonical URL generated from `Astro.url.pathname` + site base
- Full OpenGraph (og:image with dimensions, alt, locale `es_CO`)
- Twitter Card (`summary_large_image`)
- JSON-LD: `Person` + `WebSite` schemas using `@graph`
- `lang="es"` on `<html>`
- Google Site Verification: env-driven via `PUBLIC_GSV` (meta tag only emitted when set)
- Google Analytics: env-driven via `PUBLIC_GA_ID` (scripts only emitted when set)
- Sitemap auto-generated at `/sitemap-index.xml` by `@astrojs/sitemap`, referenced from `robots.txt`
- `llms.txt` at `/llms.txt` describes the site for AI assistants (llmstxt.org spec)

### A11Y

- Skip link to `#main-content` (visible on focus)
- Heading hierarchy: single h1 in Hero, h2 in each section, h3 in cards
- `aria-label` on all interactive elements
- `aria-expanded` + `aria-controls` on mobile menu button
- Escape key handler closes mobile menu
- All decorative icon `<img>` elements have `alt=""`
- `role="list"` on desktop nav `<ul>`
- `prefers-reduced-motion` respected in AOS init and `global.css`
- Theme toggle and hamburger buttons have `focus-visible:ring-2`
- WCAG AA contrast guaranteed: `--text-muted` light `#4b5563` (~5.9:1 on `#f0f4ff`), dark `#9ca3af` (~7.4:1 on `#0f1117`)

### Performance

- Pre-paint theme script (sync `is:inline` in `<head>`) avoids FOUC.
- Hero image: WebP, `fetchpriority="high"`, `decoding="async"`, explicit dimensions, plus `<link rel="preload" as="image">` for LCP.
- Google Fonts: async non-blocking load via `media="print"` + `onload` + `<noscript>` fallback.
- Google Analytics script: `is:inline async`, conditionally injected only when `PUBLIC_GA_ID` is set.
- All icon `<img>` elements have `width` and `height` to prevent CLS.
- AOS initialized with `once: true`, `duration: 0` when `prefers-reduced-motion` is set.
- Netlify cache: `/_astro/`, `/images/`, `/brand/`, `/icons/` served immutable (1y). CSP + HSTS + frame-deny baked in.

---

## Personal data locations

If used as a template, these are the files containing Valentina's personal information:

| File                                     | Data                                                                                    |
| ---------------------------------------- | --------------------------------------------------------------------------------------- |
| `src/layouts/Layout.astro`               | Default title, description, `site` constant, JSON-LD (name, jobTitle, worksFor, sameAs) |
| `.env` (`PUBLIC_GA_ID`, `PUBLIC_GSV`)    | GA Measurement ID + Google Site Verification token                                      |
| `src/components/sections/Hero.astro`     | Name, tagline, CV URL, social links                                                     |
| `src/components/sections/Projects.astro` | All projects (title, description, links)                                                |
| `src/components/sections/Stack.astro`    | Stack categories and tools                                                              |
| `src/components/sections/About.astro`    | Bio, personal quote, additional links                                                   |
| `src/components/sections/Contact.astro`  | Contact email                                                                           |
| `src/components/ui/NavBar.astro`         | CTA email, blog URL                                                                     |
| `src/components/ui/Footer.astro`         | Name in copyright, Lúmina W links                                                       |
| `public/robots.txt`                      | Sitemap absolute URL                                                                    |
| `public/llms.txt`                        | Personal description, projects, links (llmstxt.org spec)                                |
| `astro.config.mjs`                       | `site` URL                                                                              |
| `public/cv_valentina_ramirez.pdf`        | CV file                                                                                 |
| `public/images/profile.webp`             | Profile photo                                                                           |
| `public/brand/logo-w.*`                  | Brand logo                                                                              |

---

## Code conventions

- **Astro components:** Props typed with `interface Props` in frontmatter
- **No unnecessary comments** — code is documented via descriptive names
- **CSS:** always use `var()` for tokens; utility classes inside `@layer utilities` with 2-space indentation
- **Scripts:** vanilla TypeScript, no client-side frameworks
- **Images:** WebP for photos, SVG for icons. Always include `width`, `height`, and appropriate `alt`
- **External links:** always `target="_blank"` + `rel="noopener noreferrer"` (handled automatically by `Link.astro` and `Button.astro`)
- **Dark mode:** only via `.dark` class on `<html>`, never via `@media (prefers-color-scheme)`

---

## Available commands

```bash
npm run dev           # Dev server at localhost:4321
npm run build         # Static build to ./dist/
npm run preview       # Preview the build
npm run check         # astro check (type + diagnostic)
npm run format        # Format with Prettier
npm run format:check  # Check formatting without writing
npm test              # Playwright E2E (boots preview automatically)
npm run test:ui       # Playwright UI mode
npm run test:install  # One-time: download Chromium + system deps
```

---

## What NOT to do

- Do not add SSR or server endpoints — this is a pure static site
- Do not install client-side JS frameworks (React, Vue, etc.) without a real need
- Do not hardcode colors in components — use design tokens
- Do not use `@media (prefers-color-scheme)` for dark mode — the toggle uses the `.dark` class
- Do not omit `aria-label` on interactive elements with no visible text
- Do not set image dimensions via CSS only — always include HTML `width` and `height` attributes as well
- Do not commit a static `public/sitemap.xml` — the sitemap is generated by `@astrojs/sitemap` at build time
- Do not hardcode GA IDs or verification tokens — wire them through `PUBLIC_GA_ID` / `PUBLIC_GSV`
- Do not move the pre-paint theme `<script is:inline>` out of the top of `<head>` — it must execute before stylesheets load to avoid FOUC
