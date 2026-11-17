# Bjärke landing page — project context

Bjärke is a female-safety wearable: an AI-powered pendant with a tiny camera that notices when
something is off, records, alerts an emergency contact, and flashes a bright light. The hardware
core is small enough to sit inside interchangeable shells, so the wearer picks the look.

**Read `PRODUCT.md` before writing or changing any copy.** It holds the product facts, audience,
tone, pricing, competitor notes, tester feedback and the open decisions that are not settled yet.

## Where things live
- **Live site (Vercel):** https://bjarke-landing-v2.vercel.app — auto-deploys on every push to `main`
- **Repo:** https://github.com/opederso-code/Bjarke-Landing-V2
- **Local folder:** `~/Bjarke Landing page` (preview with `python3 -m http.server 8000` → http://localhost:8000)
- **Figma file:** https://www.figma.com/design/uKpIK5OjRqCvCKQmpr8vjY
  - Homepage frame: "Editorial layout — Lorem (Desktop 1440)" (node 5:38)
  - How It Works frame: "Device page (Desktop 1440)" (node 31:16)
  - Shared "Media" placeholder component: node 5:36

## Files
- `index.html` — homepage (concept): hero carousel, statement, three body paragraphs, image grid, footer
- `device.html` — "How It Works" page (nav link still points to `device.html`)
- `transition.js` — page transition for links marked `data-transition` (panel rises, page drifts up)
- `index-original.html` — previous live site with the reservation form (Google Apps Script) and Meta Pixel
- `styles.css`, `main.js`, `silk-cloth.js`, `priority-confirmed.html` — from the original site
- `images/` — all images as WebP; carousel uses `images/hero-1..3.webp`
- `vercel.json` — cache headers for `/images/`

## Design system (keep consistent)
- Layout scales from a 1440px design: `--u: calc(100vw / 1440)`; margins 54, two 657px columns, 7px gutter
- Type: Geist (display 283/230, statement 75, body 27, tight negative tracking); Archivo 12px uppercase labels
- Colors: ink #070707, muted #8c8c8c, placeholder grey #ededed, white background; image radius 4px
- Smooth scroll: Lenis (`duration: 1.1`, quartic ease-out, native touch); exposed as `window.__lenis`
- Menu hover: letter-by-letter fade wave (`.wave` / `wave-fade` keyframes)
- Carousel: auto-plays (6.5s per slide), starts on first scroll or after 3s, loops forward seamlessly, no click/hover controls

## Copy decisions
- Tone: short, plain language, product-first; avoid jargon (say "tiny camera", "built-in AI")
- How It Works rows: 01 Watches / 02 Notices / 03 Records & alerts / 04 Lights up

## Open items before sharing widely
- Replace `images/hero-3.webp` (black clover pendant) — closely resembles Van Cleef & Arpels' Alhambra
- Verify the "smaller than a fingertip" size claim against the real module (prefer a measurement)
- Clarify automatic recording / consent (state recording laws, e.g. California) in the copy
- Footer still has lorem ipsum; reservation form only exists on `index-original.html`
- `styles.css` header comment references the 14islands/Cartier365 inspiration — remove if desired
