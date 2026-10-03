# Dodo Planet — website

Static, dependency-free site built from the Figma file *Dodo Planet Website* (Desktop 1280, 1440, Tablet and Mobile frames).

- `index.html` — all page content
- `styles.css` — design tokens (colours, type) at the top, then each section; tablet/mobile rules at the bottom
- `main.js` — order links, stories slider, scroll animations
- `assets/` — optimised images (WebP/SVG) and the self-hosted Outfit font

**Edit order links:** change `WHATSAPP_NUMBER` and `GLOVO_URL` at the top of `main.js`.

**Run locally:** open `index.html`, or `python3 -m http.server` and visit http://localhost:8000.
Deploys as-is to any static host (Netlify, Vercel, GitHub Pages).
