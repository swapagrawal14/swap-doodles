# Swap's Doodles

A flat-2D vector cartoon gallery. Bold, bouncy, zero outlines.

**50 doodles, 3 collections, zero outlines.**

## What's here

```
index.html              the whole site (one page)
assets/style.css        bold flat design system, responsive
assets/app.js           gallery rendering, filters, shuffle, lightbox
assets/gallery-data.js  generated — array of pieces (title, palette, paths)
titles.json             hand-written titles + collection per piece
images/                 full-size artwork (1024×1024 PNG)
images/thumbs/          generated 560×560 squares used by the grid
tools/build.py          regenerates gallery-data.js + thumbnails
```

## Adding a doodle

1. Drop `images/51.png` (square PNG).
2. Add an entry to `titles.json`:
   ```json
   "51": { "title": "Name Of Piece", "collection": "characters" }
   ```
   Collections: `characters`, `creatures`, `moments`.
3. Rebuild:
   ```bash
   python3 tools/build.py
   ```
   That writes `images/thumbs/51.jpg`, extracts a 3–4 colour palette from the
   art, and appends it to `assets/gallery-data.js`. The grid, the counter in the
   hero, the filter chips and the lightbox all update automatically.

## Running locally

```bash
python3 -m http.server 8000
```

## Note on the in-app preview

The preview iframe has no network access. Everything here is local (images,
CSS, JS), so it renders fine — just don't add a webfont from a CDN without
self-hosting it or the preview will fall back to system type.
