# assets/

README-only assets. Referenced from the root `README.md`. **Not shipped to production** (Astro only publishes `public/`).

| File         | Used as                                 | Replace with                                    |
| ------------ | --------------------------------------- | ----------------------------------------------- |
| `icon.svg`   | Inline icon next to the H1 title        | Final brand icon (32×32 SVG)                    |
| `banner.png` | Hero banner under the H1                | Wide marketing banner (≈ 1280×400 PNG/WebP)     |
| `footer.png` | Banner above the contact section        | Wide footer banner (≈ 1280×400 PNG/WebP)        |
| `logo-w.png` | Inline logo next to the contact heading | Brand logo (≈ 96×96 PNG/WebP with transparency) |

Current files are 1×1 transparent PNG placeholders + a quick SVG so the README renders without broken images. Swap them in place: keep the same filenames or update `README.md` references.
