"""Builds every page of dodoplanet.ng from shared pieces.

Run:  python3 tools/site.py
- index.html is the source for the shared header and footer
- page bodies for menu / our-story / privacy are read back from their own files
- blog posts, FAQ and menu items live in tools/content.py
Each page gets a full <head> (title, description, canonical, social cards, structured data).
"""
import json, re, sys, os
from datetime import date

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE) + '/'
sys.path.insert(0, HERE)
from content import DISHES, SPECIAL, FAQ, POSTS, dish_card, special_card, menu_grid  # noqa: E402

SITE = 'https://dodoplanet.ng'
TODAY = date.today().isoformat()
PHONE = '+2348032107954'
EMAIL = 'hello@dodoplanet.ng'


# ---------------------------------------------------------------- helpers
def absolutize(html):
    """Root-absolute paths so pages work from any folder (e.g. /blog/...)."""
    for a, b in [('src="assets/', 'src="/assets/'), ('href="assets/', 'href="/assets/'),
                 ('href="styles.css"', 'href="/styles.css"'), ('src="main.js"', 'src="/main.js"'),
                 ('href="index.html#', 'href="/#'), ('href="index.html"', 'href="/"'),
                 ('href="menu.html', 'href="/menu.html'), ('href="our-story.html', 'href="/our-story.html'),
                 ('href="privacy.html', 'href="/privacy.html'), ('href="blog.html', 'href="/blog.html')]:
        html = html.replace(a, b)
    return html


def between(s, a, b):
    i = s.index(a) + len(a)
    return s[i:s.index(b, i)]


def ld(obj):
    return '  <script type="application/ld+json">' + json.dumps(obj, ensure_ascii=False, separators=(',', ':')) + '</script>\n'


def naira(p):
    return int(re.sub(r'\D', '', p))


def strip_tags(s):
    return re.sub(r'<[^>]+>', '', s).replace('&amp;', '&')


# ---------------------------------------------------------------- shared parts from index.html
src = absolutize(open(ROOT + 'index.html').read())
HEADER = src[src.index('<!-- ============ HEADER ============ -->'):src.index('<main id="top">')]
HEADER = HEADER.replace(' aria-current="page"', '')
FOOTER = src[src.index('  <!-- ============ FOOTER ============ -->'):src.index('</main>')]
FOOTER = FOOTER.replace('<li><a href="#">Blog</a></li>', '<li><a href="/blog.html">Blog</a></li>')
FOOTER = re.sub(r'© \d{4}', f'© {date.today().year}', FOOTER)   # copyright year stays current on every rebuild
HOME_BODY = between(src, '<main id="top">\n', '  <!-- ============ FOOTER ============ -->')
TAIL = '</main>\n\n<script src="/main.js" defer></script>\n</body>\n</html>\n'


def body_of(fname):
    return between(absolutize(open(ROOT + fname).read()), '<main id="top">\n', '  <!-- ============ FOOTER ============ -->')


# ---------------------------------------------------------------- minified CSS
import hashlib
_css = open(ROOT + 'styles.css').read()
_min = re.sub(r'/\*.*?\*/', '', _css, flags=re.S)
_min = re.sub(r'\s+', ' ', _min)
_min = re.sub(r'\s*([{};,>])\s*', r'\1', _min).replace(';}', '}')
open(ROOT + 'styles.min.css', 'w').write(_min.strip() + '\n')
CSS_V = hashlib.md5(_min.encode()).hexdigest()[:8]

# ---------------------------------------------------------------- <head>
ORG_ID = SITE + '/#restaurant'
RESTAURANT = {
    '@context': 'https://schema.org', '@type': 'Restaurant', '@id': ORG_ID,
    'name': 'Dodo Planet', 'legalName': 'Dodo Planet Ltd', 'alternateName': 'Dodo Planet Lagos',
    'url': SITE + '/', 'logo': SITE + '/assets/img/apple-touch-icon.png', 'image': SITE + '/assets/img/og.jpg',
    'description': 'Lagos’s plantain-first kitchen: Nigerian meals like jollof rice, beans, grilled chicken and fish, built around dodo (fried plantain). Takeaway and pickup coming soon to Lekki.',
    'slogan': 'For Dodo Lovers', 'servesCuisine': ['Nigerian', 'West African', 'Plantain dishes'],
    'priceRange': '₦1,500–₦8,500', 'currenciesAccepted': 'NGN', 'telephone': PHONE, 'email': EMAIL,
    'address': {'@type': 'PostalAddress', 'addressLocality': 'Lekki', 'addressRegion': 'Lagos', 'addressCountry': 'NG'},
    'areaServed': {'@type': 'City', 'name': 'Lagos'}, 'hasMenu': SITE + '/menu.html',
    'acceptsReservations': False, 'foundingDate': '2023-02-28',
}


def head(path, title, desc, og_img, extra_ld='', preload_hero=False, robots=None, og_type='website'):
    url = SITE + path
    img = SITE + '/assets/img/' + og_img
    pre = '  <link rel="preload" as="image" href="/assets/img/hero-plate.webp" imagesrcset="/assets/img/hero-plate-700.webp 700w, /assets/img/hero-plate-1000.webp 1000w, /assets/img/hero-plate.webp 1400w" imagesizes="(max-width: 767px) min(161vw, 789px), min(86vw, 1112px)" fetchpriority="high">\n' if preload_hero else ''
    rob = f'  <meta name="robots" content="{robots}">\n' if robots else ''
    canon = '' if robots else f'  <link rel="canonical" href="{url}">\n'
    return f'''<!doctype html>
<html lang="en-NG" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{desc}">
{canon}{rob}  <meta name="theme-color" content="#FFC700">
  <meta property="og:site_name" content="Dodo Planet">
  <meta property="og:locale" content="en_NG">
  <meta property="og:type" content="{og_type}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{img}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/png" href="/assets/img/favicon.png">
  <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/outfit-700.woff2" crossorigin>
  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/outfit-600.woff2" crossorigin>
{pre}  <link rel="stylesheet" href="/styles.min.css?v={CSS_V}">
  <script>document.documentElement.classList.replace('no-js','js')</script>
{extra_ld}</head>
'''


def header_for(active):
    h = HEADER
    if active:
        h = h.replace(f'<a href="{active}">', f'<a href="{active}" aria-current="page">', 1)
        h = h.replace(f'<a href="{active}" class="hide-sm">', f'<a href="{active}" class="hide-sm" aria-current="page">', 1)
    return h


def write(fname, head_html, body, active=None, sub=True):
    html = head_html + ('<body class="subpage">\n\n' if sub else '<body>\n\n') + header_for(active) + '<main id="top">\n' + body + FOOTER + TAIL
    os.makedirs(os.path.dirname(ROOT + fname), exist_ok=True)
    open(ROOT + fname, 'w').write(html)
    print('wrote', fname)


def crumbs(*items):
    return {'@context': 'https://schema.org', '@type': 'BreadcrumbList',
            'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'name': n, 'item': SITE + u} for i, (n, u) in enumerate(items)]}


def band(word, n=7, cls='page-band'):
    return f'''    <div class="{cls} band" aria-hidden="true">
      <span class="outline band-row">{" ".join([word] * n)}</span>
      <span class="solid band-word">{word}</span>
    </div>'''


BTNS = '''        <a class="btn btn-primary btn-wide" data-order="whatsapp" href="#"><img src="/assets/img/whatsapp.svg" alt="" width="20" height="20">Order on Whatsapp</a>
        <a class="btn btn-soft btn-wide" data-order="glovo" href="#"><img src="/assets/img/pin.svg" alt="" width="13" height="20">Order on Glovo</a>'''

# ---------------------------------------------------------------- HOME (+ FAQ section)
FAQ_HTML = '''  <!-- ============ FAQ ============ -->
  <section class="faq" id="faq" aria-labelledby="faq-title">
    <div class="faq-side reveal">
      <span class="eyebrow">Good to know</span>
      <h2 id="faq-title">Questions? We’ve got answers.</h2>
      <p>Can’t find what you need? Send us a message on WhatsApp and a real person will reply.</p>
      <a class="btn btn-sm btn-primary" href="https://wa.me/2348032107954" target="_blank" rel="noopener"><img src="/assets/img/whatsapp.svg" alt="" width="18" height="18">Chat with us</a>
    </div>
    <div class="faq-list reveal">
''' + '\n'.join(f'''      <details{" open" if i == 0 else ""}>
        <summary>{q}</summary>
        <p>{a}</p>
      </details>''' for i, (q, a) in enumerate(FAQ)) + '''
    </div>
  </section>

'''
home_body = HOME_BODY
if 'id="faq"' in home_body:
    home_body = home_body[:home_body.index('  <!-- ============ FAQ ============ -->')]
home_body = home_body.rstrip() + '\n\n' + FAQ_HTML
home_body = home_body.replace('<h1 id="hero-title" class="sr-only">For Dodo Lovers</h1>',
                              '<h1 id="hero-title" class="sr-only">Dodo Planet: For Dodo Lovers. Lagos’s plantain-first kitchen</h1>')

FAQ_LD = {'@context': 'https://schema.org', '@type': 'FAQPage',
          'mainEntity': [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': strip_tags(a)}} for q, a in FAQ]}
WEBSITE_LD = {'@context': 'https://schema.org', '@type': 'WebSite', '@id': SITE + '/#website', 'url': SITE + '/',
              'name': 'Dodo Planet', 'publisher': {'@id': ORG_ID}, 'inLanguage': 'en-NG'}

write('index.html',
      head('/', 'Dodo Planet | Lagos’s Plantain-First Kitchen',
           'Dodo Planet is Lagos’s plantain-first kitchen: jollof rice, beans, fish and chicken served with golden dodo. Takeaway &amp; pickup coming soon to Lekki. Order on WhatsApp or Glovo.',
           'og.jpg', ld(RESTAURANT) + ld(WEBSITE_LD) + ld(FAQ_LD), preload_hero=True),
      home_body, sub=False)

# ---------------------------------------------------------------- MENU
MENU_LD = {'@context': 'https://schema.org', '@type': 'Menu', 'name': 'Dodo Planet menu', 'url': SITE + '/menu.html',
           'inLanguage': 'en-NG', 'provider': {'@id': ORG_ID},
           'hasMenuSection': [{'@type': 'MenuSection', 'name': sec,
                               'hasMenuItem': [{'@type': 'MenuItem', 'name': strip_tags(d['name']), 'description': d['desc'],
                                                'image': SITE + '/assets/img/' + d['img'],
                                                'offers': {'@type': 'Offer', 'price': naira(d['price']), 'priceCurrency': 'NGN'}}
                                               for d in DISHES if d['cat'] == cat]}
                              for sec, cat in [('New', 'new'), ('Classics', 'classic')]]}
write('menu.html',
      head('/menu.html', 'Menu &amp; Prices | Dodo Planet',
           'The full Dodo Planet menu with prices: Jollof Rice, Dodo &amp; Chicken, Beans &amp; Dodo, Bole &amp; Fish, Dodo, Fish &amp; Sauce, Gizdodo and more, from ₦1,500.',
           'og-menu.jpg', ld(MENU_LD) + ld(crumbs(('Home', '/'), ('Menu', '/menu.html')))),
      body_of('menu.html'), '/menu.html')

# ---------------------------------------------------------------- OUR STORY
ABOUT_LD = {'@context': 'https://schema.org', '@type': 'AboutPage', 'url': SITE + '/our-story.html', 'name': 'Our Story', 'about': {'@id': ORG_ID}}
write('our-story.html',
      head('/our-story.html', 'Our Story | Dodo Planet',
           'How Dodo Planet went from a small Shomolu kitchen in 2025 to Lagos’s plantain-first kitchen, now coming soon to Lekki.',
           'og-story.jpg', ld(ABOUT_LD) + ld(crumbs(('Home', '/'), ('Our Story', '/our-story.html')))),
      body_of('our-story.html'), '/our-story.html')

# ---------------------------------------------------------------- PRIVACY
write('privacy.html',
      head('/privacy.html', 'Privacy | Dodo Planet', 'How Dodo Planet handles your information, in plain words.', 'og.jpg'),
      body_of('privacy.html'), '/privacy.html')

# ---------------------------------------------------------------- BLOG
def nice_date(iso):
    d = date.fromisoformat(iso)
    return f'{d.day} {d.strftime("%B %Y")}'


def post_card(p, featured=False):
    cls = 'post-card post-featured' if featured else 'post-card'
    return f'''      <article class="{cls} reveal">
        <a href="/blog/{p["slug"]}.html" class="post-card-img{" is-plate" if p["img"].startswith("dish-") else ""}" tabindex="-1" aria-hidden="true"><img src="/assets/img/{p["img"]}" alt="{p["img_alt"]}" loading="lazy" width="720" height="720"></a>
        <div class="post-card-body">
          <span class="tag">{p["tag"]}</span>
          <h{"2" if featured else "3"}><a href="/blog/{p["slug"]}.html">{p["title"]}</a></h{"2" if featured else "3"}>
          <p>{p["excerpt"]}</p>
          <span class="meta">{nice_date(p["date"])} · {p["read"]}</span>
        </div>
      </article>'''


blog_body = f'''
  <section class="page-hero">
{band("Blog", 11)}
    <div class="page-intro reveal">
      <h1>Stories, tips &amp; everything plantain</h1>
      <p>Food guides, kitchen tips and news from the Dodo Planet kitchen in Lagos.</p>
    </div>
  </section>

  <section class="blog-list" aria-label="All posts">
{post_card(POSTS[0], True)}
    <div class="post-grid">
{chr(10).join(post_card(p) for p in POSTS[1:])}
    </div>
  </section>

  <section class="cta-band reveal">
    <h2>All this talk of dodo…</h2>
    <p>Hungry yet? Order in a few taps.</p>
    <div class="btn-row">
{BTNS}
    </div>
  </section>

'''
BLOG_LD = {'@context': 'https://schema.org', '@type': 'Blog', 'name': 'Dodo Planet Blog', 'url': SITE + '/blog.html', 'publisher': {'@id': ORG_ID},
           'blogPost': [{'@type': 'BlogPosting', 'headline': p['title'], 'url': f'{SITE}/blog/{p["slug"]}.html', 'datePublished': p['date']} for p in POSTS]}
write('blog.html',
      head('/blog.html', 'Blog | Dodo Planet', 'Food guides, kitchen tips and plantain stories from Dodo Planet, Lagos’s plantain-first kitchen.',
           'og-blog.jpg', ld(BLOG_LD) + ld(crumbs(('Home', '/'), ('Blog', '/blog.html')))),
      blog_body, '/blog.html')

for p in POSTS:
    others = [o for o in POSTS if o is not p]
    body = f'''
  <article class="post">
    <header class="post-hero">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/blog.html">Blog</a><span aria-hidden="true">/</span><span>{p["tag"]}</span></nav>
      <h1 class="reveal">{p["title"]}</h1>
      <p class="post-meta">By the Dodo Planet kitchen · <time datetime="{p["date"]}">{nice_date(p["date"])}</time> · {p["read"]}</p>
    </header>
    <figure class="post-cover reveal{" is-plate" if p["img"].startswith("dish-") else ""}"><img src="/assets/img/{p["img"]}" alt="{p["img_alt"]}" width="1000" height="1000" fetchpriority="high"></figure>
    <div class="article">
{p["body"]()}
    </div>
  </article>

  <section class="related" aria-labelledby="related-title">
    <h2 id="related-title" class="section-title reveal">Keep reading</h2>
    <div class="post-grid">
{chr(10).join(post_card(o) for o in others)}
    </div>
  </section>

  <section class="cta-band reveal">
    <h2>Ready for some dodo?</h2>
    <p>Twelve meals, all built around plantain.</p>
    <div class="btn-row">
{BTNS}
    </div>
    <a class="link-arrow" href="/menu.html">See the full menu</a>
  </section>

'''
    post_ld = {'@context': 'https://schema.org', '@type': 'BlogPosting', 'headline': p['title'], 'description': p['excerpt'],
               'image': SITE + '/assets/img/og-' + p['slug'] + '.jpg', 'datePublished': p['date'], 'dateModified': p['date'],
               'author': {'@type': 'Organization', 'name': 'Dodo Planet', 'url': SITE + '/'}, 'publisher': {'@id': ORG_ID},
               'mainEntityOfPage': f'{SITE}/blog/{p["slug"]}.html', 'inLanguage': 'en-NG'}
    write(f'blog/{p["slug"]}.html',
          head(f'/blog/{p["slug"]}.html', f'{p["title"]} | Dodo Planet', p['excerpt'], f'og-{p["slug"]}.jpg',
               ld(post_ld) + ld(crumbs(('Home', '/'), ('Blog', '/blog.html'), (strip_tags(p['title']), f'/blog/{p["slug"]}.html'))),
               og_type='article'),
          body, '/blog.html')

# ---------------------------------------------------------------- 404
nf_body = f'''
  <section class="page-hero nf">
{band("Oops", 13)}
    <div class="page-intro reveal">
      <img class="nf-plate" src="/assets/img/hero-plate.webp" alt="" width="1400" height="1400">
      <h1>This plate is empty</h1>
      <p>The page you’re looking for has been eaten, moved or never existed. Let’s get you back to the good stuff.</p>
      <div class="btn-row">
        <a class="btn btn-primary btn-wide" href="/menu.html">See the menu</a>
        <a class="btn btn-soft btn-wide" href="/">Go to homepage</a>
      </div>
    </div>
  </section>

'''
write('404.html', head('/404.html', 'Page not found | Dodo Planet', 'This page doesn’t exist.', 'og.jpg', robots='noindex'), nf_body)

# ---------------------------------------------------------------- sitemap, robots, llms.txt
pages = ['/', '/menu.html', '/our-story.html', '/blog.html'] + [f'/blog/{p["slug"]}.html' for p in POSTS] + ['/privacy.html']
prio = {'/': '1.0', '/menu.html': '0.9', '/our-story.html': '0.7', '/blog.html': '0.6', '/privacy.html': '0.2'}
open(ROOT + 'sitemap.xml', 'w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    ''.join(f'  <url><loc>{SITE}{u}</loc><lastmod>{TODAY}</lastmod><priority>{prio.get(u, "0.6")}</priority></url>\n' for u in pages) + '</urlset>\n')
open(ROOT + 'robots.txt', 'w').write(f'User-agent: *\nAllow: /\nDisallow: /tools/\n\nSitemap: {SITE}/sitemap.xml\n')

menu_lines = '\n'.join(f'- {strip_tags(d["name"])} ({d["price"].replace("₦", "₦")}): {d["desc"]}' for d in DISHES)
open(ROOT + 'llms.txt', 'w').write(f'''# Dodo Planet

> Dodo Planet is Lagos’s plantain-first kitchen. We cook familiar Nigerian meals (jollof rice, beans, grilled chicken and fish) with dodo, fried plantain, as the star of every plate. Dodo Planet Ltd (RC 6892497), Lagos, Nigeria.

## Key facts
- Location: relaunching as a takeaway and pickup spot in Lekki, Lagos (address to be announced). Started in Shomolu, Lagos, on 10 March 2025.
- Opening hours (Lekki): 9am to 9pm, every day.
- How to order: WhatsApp +234 803 210 7954, or Glovo. Delivery fees on WhatsApp are agreed before payment.
- Prices: ₦1,500 to ₦8,500 per meal.
- Email: {EMAIL}

## Menu
{menu_lines}
- {SPECIAL["name"]} (coming soon): {SPECIAL["desc"]}

## Pages
- [Menu and prices]({SITE}/menu.html)
- [Our story]({SITE}/our-story.html)
- [Blog]({SITE}/blog.html)
''' + ''.join(f'- [{strip_tags(p["title"])}]({SITE}/blog/{p["slug"]}.html)\n' for p in POSTS) + f'''- [Privacy]({SITE}/privacy.html)
''')
print('wrote sitemap.xml, robots.txt, llms.txt')
