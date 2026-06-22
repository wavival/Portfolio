# DESIGN.md: Design System

Design tokens, typography, color, and utility classes for `wavival.dev`. Everything documented here lives in `src/styles/` and `tailwind.config.mjs`.

Related: [README.md](./README.md) · [COMPONENTS.md](./COMPONENTS.md) · [CLAUDE.md](./CLAUDE.md)

## Table of contents

- [Principles](#principles)
- [Tokens](#tokens)
  - [Brand](#brand)
  - [Backgrounds](#backgrounds)
  - [Typography colors](#typography-colors)
  - [Accent / interactive](#accent--interactive)
  - [Borders, shadows, radii](#borders-shadows-radii)
  - [Spacing](#spacing)
  - [Dark mode overrides](#dark-mode-overrides)
- [Typography](#typography)
- [Utility classes](#utility-classes)
- [Dark mode strategy](#dark-mode-strategy)
- [Motion](#motion)
- [Accessibility](#accessibility)

## Principles

- **Tokens over hardcoded values.** Every color, radius, and shadow lives in `src/styles/tokens.css` as a CSS custom property. Components reference them via `var(--token)`.
- **Tailwind for layout, utilities for repeats.** Tailwind classes handle one-off positioning; recurring patterns (`.section`, `.btn-primary`, `.card`) live in `src/styles/utilities.css` under `@layer utilities`.
- **`.dark` class, not media query.** Dark mode is toggled by the user. `tailwind.config.mjs` sets `darkMode: 'class'`.
- **Two fonts, two roles.** Raleway for display (headings, buttons, uppercase labels); Poppins for body.

## Tokens

All tokens live in `src/styles/tokens.css`. Defined on `:root`, overridden on `.dark`.

### Brand

| Token               | Light     | Dark      | Usage                                                                                         |
| ------------------- | --------- | --------- | --------------------------------------------------------------------------------------------- |
| `--brand-blue`      | `#407bff` | (same)    | Decorative only: fills, borders, shadows, large/display text (>=3:1). Fails AA for small text |
| `--brand-blue-text` | `#1565c0` | `#5b8cff` | Accessible blue for small text (subtitles, chips, labels) — >=4.5:1                           |
| `--brand-dark`      | `#1b1f28` | (same)    | Reserved dark surface                                                                         |
| `--brand-light`     | `#dee9ff` | (same)    | Reserved light surface                                                                        |

### Backgrounds

| Token        | Light                    | Dark                    | Usage                     |
| ------------ | ------------------------ | ----------------------- | ------------------------- |
| `--bg-page`  | `#f0f4ff`                | `#0f1117`               | Body background           |
| `--bg-card`  | `#ffffff`                | `#1a1f2e`               | Card hover background     |
| `--bg-blur`  | `rgba(64,123,255,0.06)`  | `rgba(64,123,255,0.08)` | Subtle blue tint surface  |
| `--nav-blur` | `rgba(240,244,255,0.85)` | `rgba(15,17,23,0.85)`   | NavBar backdrop blur fill |

### Typography colors

| Token            | Light     | Dark      | Usage                             |
| ---------------- | --------- | --------- | --------------------------------- |
| `--text-primary` | `#1a1a2e` | `#e8eaf6` | Headings, primary copy            |
| `--text-muted`   | `#4b5563` | `#9ca3af` | Secondary copy, descriptions      |
| `--text-button`  | `#ffffff` | (same)    | Text on `.btn-primary` background |

WCAG AA verified: muted on `--bg-page` ≈ 5.9:1 (light) and ≈ 7.4:1 (dark).

### Accent / interactive

| Token            | Light     | Dark      | Usage                                                                          |
| ---------------- | --------- | --------- | ------------------------------------------------------------------------------ |
| `--accent-link`  | `#1565c0` | `#5b8cff` | Link + icon-anchor text, focus rings, `.btn-ghost` border/text                 |
| `--accent-hover` | `#0f4c91` | `#82a8ff` | Link / ghost-button hover state                                                |
| `--btn-bg`       | `#1565c0` | (same)    | `.btn-primary` fill + `.btn-ghost` hover fill (white text >=4.5:1 both themes) |
| `--btn-bg-hover` | `#0f4c91` | (same)    | `.btn-primary` hover fill                                                      |

All interactive blue resolves to one value per theme — `#1565c0` (light) / `#5b8cff` (dark) — across buttons, links, icon anchors, and the UI SVGs (which hardcode `fill="#1565c0"`, recolor in-file). The previous brighter accent (a dodger-blue) was retired: white-on-it was only 3.24:1 and failed AA.

WCAG AA verified: button white-on-`#1565c0` = 5.67:1; link text on `--bg-page` = 5.13:1 (light) / 5.93:1 (dark).

### Borders, shadows, radii

| Token           | Light                              | Dark                         |
| --------------- | ---------------------------------- | ---------------------------- |
| `--border-base` | `#e2e8f0`                          | `#2d3748`                    |
| `--shadow-base` | `0 4px 24px rgba(64,123,255,0.08)` | `0 4px 24px rgba(0,0,0,0.3)` |
| `--radius-sm`   | `6px`                              | (same)                       |
| `--radius-md`   | `12px`                             | (same)                       |
| `--radius-lg`   | `20px`                             | (same)                       |

### Spacing

| Token             | Value  | Usage                |
| ----------------- | ------ | -------------------- |
| `--space-section` | `96px` | Vertical section gap |

Most layout spacing is Tailwind-driven (`gap-`, `py-`, `px-`). The token exists for one-off section rhythm.

### Dark mode overrides

Only the subset of tokens that need to invert live under `.dark` in `tokens.css`: `--bg-page`, `--bg-card`, `--bg-blur`, `--nav-blur`, `--text-primary`, `--text-muted`, `--border-base`, `--shadow-base`, plus the interactive blues `--brand-blue-text`, `--accent-link`, and `--accent-hover` (which lighten so blue text stays legible on the dark background). The shape is a normal selector block:

```css
.dark {
  --bg-page: #0f1117;
  --bg-card: #1a1f2e;
  --text-primary: #e8eaf6;
  /* ...remaining inverted tokens */
}
```

The decorative `--brand-blue` fill, radii, and spacing stay constant across themes; the interactive blues (`--brand-blue-text`, `--accent-link`, `--accent-hover`) and `--btn-bg`/`--btn-bg-hover` invert as noted above (`--btn-bg` stays constant so white button text passes AA in both themes).

## Typography

Configured in `tailwind.config.mjs`:

| Family  | Tailwind class | Stack                 |
| ------- | -------------- | --------------------- |
| Display | `font-display` | `Raleway, sans-serif` |
| Body    | `font-body`    | `Poppins, sans-serif` |

Self-hosted: latin-subset `woff2` in `public/fonts/`, declared via `@font-face` (`font-display: swap`) in `global.css`. Poppins ships as static weights; Raleway is a single variable `woff2` (`wght` 600-800, one `@font-face` with `font-weight: 600 800`). Critical weights (Poppins 400 + Raleway variable) are preloaded in `Layout.astro`. No Google Fonts request or `preconnect`.

**Weight palette:**

| Family  | Weights loaded                    |
| ------- | --------------------------------- |
| Poppins | 400, 500, 600 (static files)      |
| Raleway | 600-800 (single variable `woff2`) |

## Utility classes

All inside `@layer utilities` in `src/styles/utilities.css`, 2-space indentation.

| Class               | Purpose                                                                                                                                                              |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.section`          | Section container: `max-w-5xl mx-auto px-6 py-24`                                                                                                                    |
| `.section-title`    | `h2` heading (3xl, display, bold)                                                                                                                                    |
| `.section-subtitle` | Uppercase blue label above title (xs, tracked widest)                                                                                                                |
| `.btn-primary`      | Solid button, `px-[14px] py-[12px]`, `background-color: var(--btn-bg)`. Hover: `background-color: var(--btn-bg-hover)` + `translateX(4px)`. Has `focus-visible` ring |
| `.btn-ghost`        | Outline button (`--accent-link` border/text). Hover: fills `--btn-bg` + white text. Has `focus-visible` ring                                                         |
| `.chip`             | Pill badge for tech tags (rounded-full, border, xs)                                                                                                                  |
| `.card`             | Surface with 4px bottom border. Hover: `scale(1.02)` + `--bg-card` fill                                                                                              |
| `.card-plain`       | Borderless card. Hover: `translateX(6px)`                                                                                                                            |
| `.nav-link`         | Muted uppercase link, hover to `--accent-link`                                                                                                                       |
| `.link`             | Inline text link. Hover: `translateX(4px)`                                                                                                                           |
| `.icon`             | Base icon utility: `shrink-0`, transition                                                                                                                            |
| `.icon-sm/md/lg/xl` | `w-4/5/6/8` paired sizing                                                                                                                                            |

### Component coverage by class

| Class          | Where it's applied                                                            |
| -------------- | ----------------------------------------------------------------------------- |
| `.section`     | All section components (`Hero`, `Projects`, `Stack`, `About`, `Contact`)      |
| `.btn-primary` | `Button.astro` (single source)                                                |
| `.link`        | `Link.astro` (single source)                                                  |
| `.card`        | `Projects.astro` items                                                        |
| `.card-plain`  | `Stack.astro` items                                                           |
| `.chip`        | `Hero.astro` specialty tags, `Projects.astro` stack tags, `Stack.astro` tools |

## Dark mode strategy

- `tailwind.config.mjs` to `darkMode: 'class'`
- **Initial state applied pre-paint.** A synchronous `<script is:inline>` at the top of `<head>` (in `Layout.astro`) reads `localStorage["theme"]` (falling back to `prefers-color-scheme: dark`) and adds `.dark` to `<html>` before stylesheets load. This eliminates FOUC.
- **Post-paint behavior** is owned by `src/scripts/theme.ts`: it syncs the sun/moon icons to the already-applied state, then handles toggle clicks. Each click flips `.dark` on `<html>`, writes `localStorage["theme"]`, and re-syncs icons.
- Toggle swaps two icon `<img>` elements (sun/moon) via `.hidden` class, no JS-rendered SVG.
- Never use `@media (prefers-color-scheme)` in CSS for styling; the `.dark` class is the single source of truth.

## Motion

| Source                                        | Behavior                                                                                                                                                                              |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `global.css`                                  | Universal `*` selector transitions `border-color` (0.3s ease) only. `html` transitions `color` (0.3s); `body` transitions `background-color` and `color` (0.3s each).                 |
| `.card` (utilities + global)                  | Hover lift via `transform: scale(1.02)` on a bouncy `cubic-bezier(0.34, 1.56, 0.64, 1)` curve, plus `background-color`, `box-shadow`, and `opacity` transitions                       |
| Scroll reveal (`Layout.astro` + `global.css`) | Custom IntersectionObserver toggles `.aos-in` on `[data-aos]` elements as they enter; the fade/slide and timing live in `global.css`. Reveals once, then `unobserve`s. No AOS library |
| `prefers-reduced-motion`                      | All animations/transitions clamped to `0.01ms`; the scroll reveal shows elements immediately (no transition, observer skipped)                                                        |

The reduce-motion override lives in `global.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Accessibility

- All interactive elements have `aria-label`.
- Focus rings: `focus-visible:ring-2 focus-visible:ring-[var(--accent-link)]` on every interactive element — `.btn-primary`, `.btn-ghost`, `.link`/icon anchors (baked into the utility classes), plus the NavBar theme toggle, language toggle, hamburger, and the skip link.
- Skip link to `#main-content` (`Layout.astro`), visible only on focus.
- Heading hierarchy: single `h1` in `Hero`, one `h2` per section, `h3` inside cards.
- Decorative `<img>` always has `alt=""`. Content images have descriptive `alt`.
- Mobile menu (`src/scripts/nav.ts`): `aria-expanded` + `aria-controls`; `inert` while closed (links never tabbable), focus moves to the first link on open, Tab is trapped, Escape closes and restores focus to the hamburger. The hamburger `aria-label` is localized + state-aware.
- `aria-current="page"` on the active NavBar + Footer link, styled with an underline (not color alone).
- WCAG AA contrast verified in both themes: `--text-muted` over `--bg-page` (≈5.9:1 light / ≈7.4:1 dark), button white-on-`#1565c0` (5.67:1), and interactive blue text on `--bg-page` (5.13:1 light / 5.93:1 dark).
