# Dodo Planet — website

Static, dependency-free site for dodoplanet.ng, built from the Figma file *Dodo Planet Website*.

## Pages
- `index.html` — homepage (hero, Lekki ribbon, menu, how to order, stories, FAQ)
- `menu.html`, `our-story.html`, `privacy.html`, `blog.html`, `blog/*.html`, `404.html`
- `sitemap.xml`, `robots.txt`, `llms.txt` — for search engines and AI assistants

## Editing
- Menu items, FAQ and blog posts: `tools/content.py`
- Colours, type and layout: `styles.css` (design tokens at the top)
- Order links, Google Analytics ID: top of `main.js` (`WHATSAPP_NUMBER`, `GLOVO_URL`, `GA_ID`)
- After editing, run `python3 tools/site.py` to rebuild every page, the minified CSS, sitemap and llms.txt.

## Run locally
`python3 -m http.server` in this folder, then open http://localhost:8000 (paths are root-absolute, so open via a server, not as a file).
