# COMPONENTS.md — Component Reference

Inventory of every Astro component in `src/components/`. Props, behavior, and where each one lives in the page composition.

Related: [README.md](./README.md) · [DESIGN.md](./DESIGN.md) · [CLAUDE.md](./CLAUDE.md)

## Table of contents

- [Layout](#layout)
- [UI primitives](#ui-primitives)
  - [Button.astro](#buttonastro)
  - [Link.astro](#linkastro)
  - [NavBar.astro](#navbarastro)
  - [Footer.astro](#footerastro)
- [Sections](#sections)
  - [Hero.astro](#heroastro)
  - [Projects.astro](#projectsastro)
  - [Stack.astro](#stackastro)
  - [About.astro](#aboutastro)
  - [Contact.astro](#contactastro)
- [Pages](#pages)
- [Client scripts](#client-scripts)

## Layout

### `Layout.astro`

Path: `src/layouts/Layout.astro`. Wraps every page. Owns the full `<head>`, skip link, NavBar, Footer.

| Prop          | Type      | Default                                                                  |
| ------------- | --------- | ------------------------------------------------------------------------ |
| `title`       | `string`  | `"Valentina Ramírez \| Full Stack Developer · React & Django · Colombia"` |
| `description` | `string`  | `"Full Stack Developer especializada en Django y React. Construyo productos completos..."` |
| `image`       | `string`  | `"/images/profile.webp"`                                                 |
| `noindex`     | `boolean` | `false`                                                                  |

What it injects in `<head>` (in order):

- **Pre-paint theme script** (`is:inline`, synchronous) — first child of `<head>`. Reads `localStorage["theme"]` (falls back to `prefers-color-scheme`) and adds `.dark` to `<html>` before stylesheets load. Prevents FOUC.
- Title, description, author (`Valentina Ramírez`), robots directives
- Canonical URL from `Astro.url.pathname` against `https://wavival.dev`
- OpenGraph (image with 640×640 dimensions + alt, locale `es_CO`)
- Twitter Card (`summary_large_image`)
- Google Site Verification meta — emitted **only when `PUBLIC_GSV` is set**
- Theme color meta (light + dark variants)
- Favicons (`logo-w.ico`, `logo-w.webp`)
- `<link rel="preload" as="image">` for the hero portrait (LCP optimization)
- Google Fonts (Poppins + Raleway) — async via `media="print"` + `onload` + `<noscript>` fallback
- Google Analytics — emitted **only when `PUBLIC_GA_ID` is set**, `is:inline async`
- AOS init script with `prefers-reduced-motion` guard
- JSON-LD `@graph` with `Person` + `WebSite` schemas

Body contents:

- Skip link → `#main-content` (visible only on focus)
- `<NavBar />`
- `<main id="main-content">` with the page `<slot />`
- `<Footer />`

## UI primitives

### `Button.astro`

Path: `src/components/ui/Button.astro`. Renders an `<a>` if `href` is provided, otherwise a `<button>`. Always applies `.btn-primary`.

| Prop         | Type                              | Default    | Notes                                             |
| ------------ | --------------------------------- | ---------- | ------------------------------------------------- |
| `id`         | `string`                          | —          |                                                   |
| `href`       | `string`                          | —          | Presence determines `<a>` vs `<button>`           |
| `target`     | `"_blank" \| "_self"`             | `"_self"`  | `_blank` auto-applies `rel="noopener noreferrer"` |
| `type`       | `"button" \| "submit" \| "reset"` | `"button"` | Only relevant when rendered as `<button>`         |
| `class`      | `string`                          | `""`       | Appended to `.btn-primary`                        |
| `icon`       | `string`                          | —          | SVG filename in `public/icons/ui/` (no extension) |
| `download`   | `string`                          | —          | Forwarded to `<a download>`                       |
| `aria-label` | `string`                          | —          |                                                   |

Icon `<img>` is locked to `width="20" height="20"` and `alt=""`.

### `Link.astro`

Path: `src/components/ui/Link.astro`. Text link with optional icon. Applies `.link`.

| Prop         | Type                  | Default   | Notes                                             |
| ------------ | --------------------- | --------- | ------------------------------------------------- |
| `href`       | `string`              | required  |                                                   |
| `target`     | `"_blank" \| "_self"` | `"_self"` | `_blank` auto-applies `rel="noopener noreferrer"` |
| `class`      | `string`              | `""`      | Appended to `.link`                               |
| `icon`       | `string`              | —         | SVG filename in `public/icons/ui/` (no extension) |
| `aria-label` | `string`              | —         |                                                   |

Icon `<img>` is locked to `width="24" height="24"` and `alt=""`.

### `NavBar.astro`

Path: `src/components/ui/NavBar.astro`. Fixed header with backdrop blur.

Composition:

- Logo link → `/` (logo-w.webp, 72×40)
- Desktop nav (`md:` and up): `<ul role="list">` with Projects / Stack / About anchors, `Contáctame` button, theme toggle
- Mobile bar: `Contáctame` button, theme toggle, hamburger
- Mobile slide-down nav: `Inicio / Proyectos / Stack / Sobre mí / Contacto` + `Blog W` button

Interactive behaviors (wired by `src/scripts/nav.ts` and `src/scripts/theme.ts`, imported at bottom of file):

- `#menu-btn` toggles `#mobile-menu` opacity/translate + swaps open/close icon
- Clicking any mobile menu link closes the menu
- Escape key closes the menu
- `#theme-toggle-desktop` and `#theme-toggle-mobile` flip `.dark` on `<html>` + persist `localStorage["theme"]`

ARIA:

- `aria-label="Navegación principal"` on desktop `<nav>`
- `aria-label` on every Link / Button
- `aria-expanded` and `aria-controls="mobile-menu"` on `#menu-btn`; `aria-label` updates between open/close

### `Footer.astro`

Path: `src/components/ui/Footer.astro`. Three-column footer.

- **Left:** logo + tagline + social icons (LinkedIn, GitHub, Instagram)
- **Middle:** `Navegación` — anchors to Projects / Stack / About / Contact
- **Right:** `Recursos` — Blog W (luminaw.co)
- **Bottom strip:** CTA "Conoce Lúmina W" link + `© {year} Valentina Ramírez`

Year is rendered with `new Date().getFullYear()` at build time.

## Sections

All sections render inside `.section` and use `data-aos="fade-up"` for entry animation.

### `Hero.astro`

Path: `src/components/sections/Hero.astro`. `id="hero"`. `min-h-[calc(100dvh-64px)]`.

- Profile image (`fetchpriority="high"`, `decoding="async"`, 320×320, circular, brand-blue border)
- Specialty chips: React / Django / PostgreSQL
- Single `<h1>` headline with brand-blue accent line
- Body copy
- CV download button (`#btn-download-cv`) — fires `gtag("event", "file_download", ...)` on click
- Social Link icons: LinkedIn, GitHub, Blog (luminaw.co)

### `Projects.astro`

Path: `src/components/sections/Projects.astro`. `id="projects"`.

Data is a local `projects` array. Each project renders inside a `.card` with:

- Title (`h3`) + status tag (color from `tagStyles` map: `green` / `blue` / `orange` / `gray`)
- Stack chips
- Two-column "Problema / Solución" block
- Footer links (`Ver sitio` / `Ver repositorio` / `Ver writeup`)

Current projects: Lúmina W, TerraCore, NullBreach, Root, Forgotten Portal.

To edit a project: modify the `projects` array at the top of the file. No external CMS.

### `Stack.astro`

Path: `src/components/sections/Stack.astro`. `id="stack"`.

Grid of `.card-plain` items. Local `stack` array, four categories: Backend / Seguridad / IA & Herramientas / Frontend. Each category shows a heading, italic description, and tool chips.

### `About.astro`

Path: `src/components/sections/About.astro`. `id="about"`.

Two paragraphs of bio, a brand-blue accent quote (`<blockquote>`), and a row of icon Links: Instagram, WhatsApp (`wa.me/573116865766`), Platzi, Blog W.

### `Contact.astro`

Path: `src/components/sections/Contact.astro`. `id="contact"`.

Centered CTA heading + paragraph + `Contáctame` `<Button>` (`mailto:wavival.dev@luminaw.co`).

## Pages

### `src/pages/index.astro`

The only content page. Composes sections in order:

```
<Layout>
  <Hero />
  <Projects />
  <Stack />
  <About />
  <Contact />
</Layout>
```

### `src/pages/404.astro`

Renders inside `<Layout title="404 — Página no encontrada" noindex={true}>`. Centered 404 numeral, message, and a `Link` back to `/`.

## Client scripts

### `src/scripts/nav.ts`

Mobile menu controller. Imports nothing. Listens on:

- `#menu-btn` click → toggles `#mobile-menu` visibility + icon swap + `aria-expanded`
- Any `<a>` inside `#mobile-menu` → close
- `document` `keydown` `Escape` → close (only if menu is open)

### `src/scripts/theme.ts`

Theme controller for **post-paint** state. The initial `.dark` class is already applied by the pre-paint `is:inline` script in `Layout.astro` `<head>` (see Layout section above) — `theme.ts` only syncs the sun/moon icons to that initial state and wires the toggle buttons. On click it flips `.dark` on `<html>`, persists the new value to `localStorage["theme"]`, and re-syncs icons.

Both scripts are imported once from `NavBar.astro`:

```astro
<script>
  import "@/scripts/nav.ts";
  import "@/scripts/theme.ts";
</script>
```
