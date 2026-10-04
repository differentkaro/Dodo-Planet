# Dodo Planet content: one place for the menu so every page shows the same thing.
DISHES = [
  # new launch meals (from the 2026 relaunch deck); weights are placeholders until portions are weighed
  dict(id="rice-dodo-chicken", cat="new", img="dish-rice-chicken.webp", w=720, crop="", alt="Jollof rice with fried plantain and grilled chicken",
       name="Jollof Rice, Dodo &amp; Chicken", desc="Smoky party-style jollof rice with sweet fried plantain and a spicy grilled chicken leg.", price="₦7000", weight="600g"),
  dict(id="beans-dodo", cat="new", img="dish-beans.webp", w=720, crop="", alt="Stewed beans with fried plantain",
       name="Beans &amp; Dodo", desc="Soft honey beans stewed in palm-oil pepper sauce, with a generous side of golden dodo.", price="₦4500", weight="450g"),
  dict(id="bole-fish", cat="new", img="dish-bole-fish.webp", w=720, crop="", alt="Roasted plantain with grilled fish and pepper sauce",
       name="Bole &amp; Fish", desc="Roasted plantain (bole) with a whole grilled fish and a spicy pepper-and-onion sauce.", price="₦8000", weight="550g"),
  # classics (unchanged, except Dodo, Fish & Sauce repriced per the newer deck)
  dict(id="dodo-fried-eggs", cat="classic", img="dish-1.webp", w=720, crop="--s:118.04%;--l:-5.6%;--t:-10.24%", alt="Dodo and fried eggs",
       name="Dodo and Fried Eggs", desc="Sweet fried plantains served with soft, spiced scrambled eggs.", price="₦4500", weight="480g"),
  dict(id="dodo-chicken-sauce", cat="classic", img="dish-2.webp", w=720, crop="--s:107.75%;--l:-2.67%;--t:-3.56%", alt="Dodo, chicken and sauce",
       name="Dodo, Chicken &amp; Sauce", desc="Juicy grilled chicken paired with crispy fried plantains, served with rich, spicy vegetable or tomato sauce.", price="₦6500", weight="560g"),
  dict(id="dodo-fish-sauce", cat="classic", img="dish-3.webp", w=720, crop="--s:109.15%;--l:-6.26%;--t:-5.15%", alt="Dodo, fish and sauce",
       name="Dodo, Fish &amp; Sauce", desc="Grilled fish paired with crispy fried plantains, served with rich, spicy vegetable or tomato sauce.", price="₦8500", weight="560g"),
  dict(id="gizdodo", cat="classic", img="dish-4.webp", w=720, crop="--s:148.18%;--l:-20.62%;--t:-24.36%", alt="Gizdodo",
       name="Gizdodo", desc="A tasty mix of fried plantains and spiced gizzard in a pepper sauce.", price="₦4500", weight="585g"),
  dict(id="just-dodo", cat="classic", img="dish-5.webp", w=720, crop="--s:121.48%;--l:-12%;--t:-10.2%", alt="Just dodo",
       name="Just Dodo", desc="Crispy, golden fried plantains, perfect as a snack or side.", price="₦1500", weight="360g"),
  dict(id="vegetable-sauce", cat="classic", img="dish-6.webp", w=720, crop="--s:109.08%;--l:-2.59%;--t:-3.16%", alt="Vegetable sauce",
       name="Vegetable Sauce", desc="A flavorful sauce made with tomatoes, peppers, and leafy greens.", price="₦1500", weight="275g"),
  dict(id="large-chicken", cat="classic", img="dish-7.webp", w=450, crop="", alt="Large size chicken",
       name="Large Size Chicken", desc="Well-seasoned, grilled chicken portion.", price="₦4500", weight="300g"),
  dict(id="croaker-fish", cat="classic", img="dish-8.webp", w=720, crop="--s:107.86%;--l:-3.29%;--t:-5.99%", alt="Croaker fish",
       name="Crocker Fish", desc="Tender, grilled croaker fish with a smoky, spiced flavor.", price="₦4500", weight="250g"),
  dict(id="turkey-wings", cat="classic", img="dish-9.webp", w=720, crop="", alt="Turkey wings",
       name="Turkey Wings", desc="Succulent, well-marinated grilled turkey wings.", price="₦4000", weight="275g"),
]
SPECIAL = dict(id="loaded-plantain-fries", img="dish-loaded-fries.webp", alt="Loaded plantain fries topped with beef, sauce, onions and peppers",
  name="Loaded Plantain Fries", desc="Crispy plantain fries piled high with peppered beef, a creamy spiced sauce, onions and peppers. Our first rotating special, landing once our kitchen trials are done.")

def dish_card(d):
    style = f' style="{d["crop"]}"' if d["crop"] else ''
    badge = '<span class="sticker">New</span>' if d["cat"] == "new" else ''
    return f'''      <article class="dish reveal" id="{d["id"]}" data-cat="{d["cat"]}">
        {badge}<div class="dish-img"><span class="mask"><img src="/assets/img/{d["img"]}" alt="{d["alt"]}"{style} loading="lazy" width="{d["w"]}" height="{d["w"]}"></span></div>
        <div class="dish-body">
          <div><h3>{d["name"]}</h3><p>{d["desc"]}</p></div>
          <div class="price"><strong>{d["price"]}</strong><span>{d["weight"]}</span></div>
        </div>
      </article>'''

def special_card(tag="h3"):
    s = SPECIAL
    return f'''    <article class="special reveal" id="{s["id"]}">
      <div class="special-img"><span class="mask"><img src="/assets/img/{s["img"]}" alt="{s["alt"]}" loading="lazy" width="720" height="720"></span></div>
      <div class="special-text">
        <span class="sticker sticker-static">Rotating special</span>
        <{tag}>{s["name"]}</{tag}>
        <p>{s["desc"]}</p>
        <span class="soon">Coming soon</span>
      </div>
    </article>'''

def menu_grid():
    return '    <div class="menu-grid">\n' + '\n'.join(dish_card(d) for d in DISHES) + '\n    </div>'


# ------------------------------------------------------------------
# FAQ (homepage section + FAQPage structured data for search/AI engines)
# ------------------------------------------------------------------
FAQ = [
  ("What is Dodo Planet?",
   "Dodo Planet is Lagos’s plantain-first kitchen. We cook familiar Nigerian meals, like jollof rice, beans, grilled chicken and fish, with dodo (fried plantain) as the star of every plate."),
  ("Where is Dodo Planet located?",
   "We’re relaunching as a takeaway and pickup spot in Lekki, Lagos. The exact address will be announced soon. Until then, you can order on WhatsApp or Glovo."),
  ("What are your opening hours?",
   "Our Lekki takeaway and pickup spot will open from 9am to 9pm, every day of the week."),
  ("How do I order?",
   "Send us a WhatsApp message on 08032107954, or order through Glovo. Once our Lekki spot opens, you can also order ahead and pick up."),
  ("Do you deliver, and how much is delivery?",
   "Yes. When you order on WhatsApp, the delivery fee depends on where you are, and we agree it with you before you pay. Glovo also delivers our meals."),
  ("How much does a meal cost?",
   "Meals start at ₦1,500 for Just Dodo and go up to ₦8,500 for Dodo, Fish &amp; Sauce. Most full meals are between ₦4,000 and ₦8,500."),
  ("What is the difference between dodo and bole?",
   "Dodo is ripe plantain sliced and fried until golden and caramelised. Bole is ripe plantain roasted whole over a flame until smoky, a South-South favourite often eaten with grilled fish and pepper sauce."),
  ("Can I choose how my dodo is cut?",
   "Yes. Tell us if you prefer your dodo diced or in long slices when you order."),
]

# ------------------------------------------------------------------
# Blog posts
# ------------------------------------------------------------------
def dish_plug(dish_id, line):
    d = next(x for x in DISHES if x["id"] == dish_id)
    return f'''      <aside class="inline-dish">
        <span class="mask"><img src="/assets/img/{d["img"]}" alt="{d["alt"]}" loading="lazy" width="120" height="120"></span>
        <div><span class="eyebrow">Try it at Dodo Planet</span><b>{d["name"]}</b><p>{line}</p></div>
        <div class="inline-dish-side"><strong>{d["price"]}</strong><a class="btn btn-sm btn-primary" data-order="whatsapp" href="#">Order</a></div>
      </aside>'''

POSTS = [
 dict(slug="what-is-bole", tag="Food guide", date="2026-10-04", read="4 min read",
      img="dish-bole-fish.webp", img_alt="Roasted plantain (bole) with grilled fish and pepper sauce",
      title="What is bole? Nigeria’s favourite roasted plantain, explained",
      excerpt="Smoky, sweet and roasted over an open flame: here’s everything you need to know about bole, and how it differs from dodo.",
      body=lambda: f'''
      <p class="lede">If you’ve walked past a roadside grill in Port Harcourt, you’ve probably smelt bole before you saw it. Sweet, smoky and charred at the edges, it’s one of Nigeria’s most loved ways to eat plantain.</p>

      <h2>Bole, in one sentence</h2>
      <p>Bole is ripe plantain roasted whole over an open flame until the skin chars and the inside turns soft, smoky and sweet.</p>

      <h2>Where bole comes from</h2>
      <p>Bole is a street-food favourite of Nigeria’s South-South, especially Rivers State and Port Harcourt, where roadside grillers roast plantain, yam and fish over charcoal. The most famous combination is <b>bole and fish</b>: roasted plantain with a whole grilled fish and a spicy pepper sauce.</p>

      <h2>Bole vs dodo: what’s the difference?</h2>
      <div class="table-wrap"><table>
        <thead><tr><th></th><th>Bole</th><th>Dodo</th></tr></thead>
        <tbody>
          <tr><th>How it’s cooked</th><td>Roasted whole over a flame</td><td>Sliced and fried in oil</td></tr>
          <tr><th>Texture</th><td>Firm outside, soft and smoky inside</td><td>Soft, golden and caramelised</td></tr>
          <tr><th>Oil</th><td>Little or none</td><td>Fried, so more oil</td></tr>
          <tr><th>Usually eaten with</th><td>Grilled fish and pepper sauce</td><td>Rice, beans, eggs, stews</td></tr>
        </tbody>
      </table></div>

      <blockquote>Same plantain, two completely different moods. Dodo is comfort; bole is a party by the roadside.</blockquote>

      <h2>What goes well with bole?</h2>
      <ul>
        <li><b>Grilled fish:</b> the classic. Croaker, mackerel or catfish all work.</li>
        <li><b>Pepper sauce:</b> fresh pepper, onions and palm oil spooned over the top.</li>
        <li><b>Roasted yam:</b> for a bigger, even more filling plate.</li>
        <li><b>Groundnuts:</b> a crunchy, salty contrast to the sweet plantain.</li>
      </ul>

{dish_plug("bole-fish", "Roasted plantain with a whole grilled fish and our spicy pepper-and-onion sauce.")}
'''),
 dict(slug="how-to-pick-plantain-for-dodo", tag="Kitchen tips", date="2026-10-04", read="4 min read",
      img="story-market.webp", img_alt="A smiling plantain seller at a Nigerian market",
      title="How to pick the perfect plantain for dodo",
      excerpt="Green, yellow, spotted or black? A simple guide to choosing plantain at the market, and what each stage is best for.",
      body=lambda: f'''
      <p class="lede">Great dodo starts long before the frying pan. It starts at the market, with the right plantain. Here’s how we choose ours, and how you can too.</p>

      <h2>The four stages of plantain</h2>
      <div class="stages">
        <div class="stage"><span class="dot" style="--c:#6F9A3A"></span><b>Green</b><p>Hard and starchy, not sweet. Best for plantain chips, boiling or porridge.</p></div>
        <div class="stage"><span class="dot" style="--c:#F2C200"></span><b>Yellow</b><p>Ripe and lightly sweet, holds its shape well. Good dodo.</p></div>
        <div class="stage is-best"><span class="dot" style="--c:#E0A800;--s:#3B2A12"></span><b>Yellow with black spots</b><p>The sweet spot for dodo: soft, sweet and it caramelises beautifully.</p></div>
        <div class="stage"><span class="dot" style="--c:#2E2418"></span><b>Mostly black</b><p>Very sweet and very soft. Fry gently, as it can fall apart.</p></div>
      </div>

      <h2>Five tips for buying plantain</h2>
      <ul>
        <li><b>Press gently.</b> Ripe plantain should give a little, like a ripe avocado.</li>
        <li><b>Check the skin.</b> Avoid mould, deep cracks or a sour smell.</li>
        <li><b>Buy for the week.</b> Mix ripeness levels so you have perfect dodo every few days.</li>
        <li><b>Speed it up.</b> Keep green plantain in a paper bag at room temperature to ripen faster.</li>
        <li><b>Don’t refrigerate unripe plantain.</b> The cold blackens the skin and stops it ripening properly.</li>
      </ul>

      <h2>How to cut it</h2>
      <p>Slice on a diagonal for longer pieces with more surface to caramelise, or dice into cubes for quick, crispy bites. Not too thin: about the thickness of your finger keeps the inside soft.</p>

      <blockquote>Medium heat, a pinch of salt and a little patience. Turn once, when the edges are deep gold.</blockquote>

{dish_plug("just-dodo", "No market run needed: crispy, golden dodo, fried fresh for you.")}
'''),
 dict(slug="what-to-eat-with-dodo", tag="Food guide", date="2026-10-04", read="5 min read",
      img="dish-rice-chicken.webp", img_alt="Jollof rice with fried plantain and grilled chicken",
      title="Jollof, beans or fish? 7 delicious things to eat with dodo",
      excerpt="Dodo goes with almost everything. These are the seven pairings Lagos keeps coming back to, from Saturday beans to party jollof.",
      body=lambda: f'''
      <p class="lede">Dodo might be the most versatile food on a Nigerian table. Sweet, soft and golden, it makes almost any meal better. Here are seven pairings we can’t get enough of.</p>

      <h2>1. Jollof rice</h2>
      <p>Smoky party jollof and sweet dodo is a match made in Lagos. The pepper in the rice and the sweetness of the plantain balance each other perfectly. Add grilled chicken and you have a full Sunday plate.</p>
{dish_plug("rice-dodo-chicken", "Smoky jollof, golden dodo and a spicy grilled chicken leg.")}

      <h2>2. Beans</h2>
      <p>Beans and dodo is a classic for a reason: soft honey beans stewed in palm-oil pepper sauce, with sweet plantain on the side. Filling, comforting and great any time of day.</p>
{dish_plug("beans-dodo", "Soft honey beans stewed in pepper sauce, with a generous side of dodo.")}

      <h2>3. Eggs</h2>
      <p>Dodo and eggs is the ultimate Saturday breakfast. Scramble the eggs with onions, tomatoes and pepper, and serve them next to warm dodo.</p>

      <h2>4. Grilled fish</h2>
      <p>Fish, plantain and a rich sauce make a lighter but satisfying meal. Croaker is our favourite for its tender, flaky texture.</p>

      <h2>5. Gizzard (gizdodo)</h2>
      <p>Gizdodo mixes fried plantain and peppered gizzard in one bowl. Chewy, sweet and spicy all at once, it’s a party favourite.</p>

      <h2>6. Chicken or turkey</h2>
      <p>Well-seasoned grilled chicken or turkey wings with dodo on the side is simple, and it never disappoints.</p>

      <h2>7. A good sauce</h2>
      <p>Even on its own, dodo shines with a spoonful of vegetable or pepper sauce for dipping.</p>

      <blockquote>There’s no wrong way to eat dodo. There’s just more dodo, or not enough.</blockquote>
'''),
]
