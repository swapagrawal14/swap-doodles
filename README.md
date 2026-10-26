# Swap's Doodles

A gallery of doodles in several mediums. Bold, bouncy, and occasionally made of wool.

**110 pieces · 7 collections · a very fast page**

Live: https://swapagrawal14.github.io/swap-doodles/

## Collections

| Slug | Name | What it is |
|---|---|---|
| `characters` | Characters | Flat 2D vector people, bold shapes, no outlines |
| `creatures` | Creatures | Same style, animals and monsters |
| `moments` | Moments | Same style, little scenes with no protagonist |
| `cosplay` | Cosplay | Needle-felted wool puppets in silly costumes |
| `swap` | Swap | Comic-ink portraits of Swap in ridiculous situations |
| `redraw` | Redraws | Diptychs: a photo, plus a crude ballpoint doodle of it |
| `objects` | Objects | Mixed media: a real object + single-colour ink linework |

## Files

```
index.html              the whole site (one page)
assets/style.css        design system, responsive
assets/app.js           gallery rendering, filters, shuffle, lightbox
assets/gallery-data.js  GENERATED — array of pieces (title, palette, paths)
titles.json             hand-written titles + collection per piece
images/                 full-size artwork, WebP q85, 1024px
images/thumbs/          GENERATED 480px WebP squares used by the grid
tools/build.py          regenerates gallery-data.js + thumbnails
```

## Adding a doodle

1. Drop the image in `images/` as `111.webp` (or `.png` — the build converts nothing,
   so prefer saving as WebP yourself, or convert after).
2. Add an entry to `titles.json`:
   ```json
   "111": { "title": "Name Of Piece", "collection": "characters" }
   ```
3. Rebuild:
   ```bash
   python3 tools/build.py
   ```
   This writes `images/thumbs/111.webp`, extracts a 3–4 colour palette from the art,
   and appends it to `assets/gallery-data.js`. The grid, hero counter, filter chips,
   and lightbox all update automatically.
4. Adding a **new collection** also needs a chip in `index.html`
   (`data-filter="slug"`), a caption in the `NOTES` map in `assets/app.js`,
   and optionally a chip colour in `assets/style.css`.

## Performance

All artwork was converted from PNG to WebP q85 — a 96% size reduction
(136 MB → 5.2 MB) that is visually indistinguishable at viewing size.

- Thumbnails: 480px WebP, ~16 KB each
- First 8 cards load `eager` + `fetchpriority="high"`; the rest lazy/low
- Every grid image has `width`/`height` and `decoding="async"` to prevent layout shift
- Measured with cache disabled: **first screen 159 KB / 162 ms**, whole wall 1.57 MB

## Running locally

```bash
python3 -m http.server 8000
```

## Note on the in-app preview

The preview iframe has no network access. Everything here is local (images, CSS, JS),
so it renders fine — just don't add a webfont from a CDN without self-hosting it.
