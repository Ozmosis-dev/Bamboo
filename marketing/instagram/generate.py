#!/usr/bin/env python3
"""Generate Instagram launch slides (1080x1350) for Bamboo on Market.

Styled after the client's final menus and the site's market theme
(src/app/globals.css m-* voices): Faculty Glyphic display, Jost caps,
red prices, vermilion keyline lockup, tategaki strips, wave + paper
textures. Re-run after editing SLIDES; output lands in post{1,2,3}/.
"""
import pathlib
import subprocess
import tempfile

ROOT = pathlib.Path(__file__).resolve().parents[2]
PHOTOS = ROOT / "public/photos"
BRAND = ROOT / "public/brand"
WAVE = (ROOT / "public/textures/wave.webp").as_uri()
PAPER = (ROOT / "public/textures/paper.webp").as_uri()
OUT = pathlib.Path(__file__).resolve().parent
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

BASE_CSS = f"""
@import url('https://fonts.googleapis.com/css2?family=Faculty+Glyphic&family=Jost:wght@400;500;600;800&family=Hanken+Grotesk:ital,wght@0,400;0,500;1,400&family=Zen+Old+Mincho:wght@700;900&display=swap');
:root {{
  --char: #161514; --char-deep: #0f0e0d; --smoke: #232120;
  --verm: #b5341c; --price: #c8442b; --gold: #b08d3e; --gold-soft: #c8a858;
  --tatami: #c9b18c; --washi: #f3ede2; --seam: #363330;
}}
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
html, body {{ width: 1080px; height: 1350px; overflow: hidden; }}
body {{ background: var(--char); color: var(--washi); font-family: 'Hanken Grotesk', sans-serif; position: relative; }}

.display {{ font-family: 'Faculty Glyphic', Georgia, serif; font-weight: 400; color: var(--washi); letter-spacing: 0.01em; }}
.eyebrow {{ font-family: Jost; font-weight: 400; letter-spacing: 0.32em; text-transform: uppercase; color: var(--gold); }}
.caps {{ font-family: Jost; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; }}
.item-name {{ font-family: Jost; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--washi); }}
.price {{ font-family: Jost; font-weight: 500; color: var(--price); }}
.kanji {{ font-family: 'Zen Old Mincho', serif; font-weight: 700; }}

/* red tick + eyebrow, as on the site section intros */
.tick-row {{ display: flex; align-items: center; gap: 26px; }}
.tick {{ width: 72px; height: 2px; background: var(--verm); flex: none; }}

/* section title with hairlines running out, as on the menus */
.rule-title {{ display: flex; align-items: center; gap: 34px; }}
.rule-title::before, .rule-title::after {{ content: ""; height: 1px; flex: 1; background: var(--seam); }}

/* vermilion keyline lockup, after the printed logo */
.lockup {{ display: inline-flex; flex-direction: column; align-items: center; gap: 9px;
  border: 3px solid var(--verm); padding: 18px 30px 19px; line-height: 1; background: rgba(15,14,13,0.35); }}
.lockup-name {{ font-family: Jost; font-weight: 800; font-size: 56px; letter-spacing: 0.13em; text-indent: 0.13em; text-transform: uppercase; color: var(--washi); }}
.lockup-sub {{ display: flex; align-items: center; gap: 13px; font-family: Jost; font-weight: 600; font-size: 20px; letter-spacing: 0.36em; text-indent: 0.36em; text-transform: uppercase; color: var(--washi); }}
.lockup-sub::before, .lockup-sub::after {{ content: ""; width: 34px; height: 2px; background: currentColor; opacity: 0.9; }}

.tategaki {{ writing-mode: vertical-rl; font-family: 'Zen Old Mincho', serif; font-weight: 700; color: var(--verm); letter-spacing: 0.6em; }}
.ghost-kanji {{ position: absolute; font-family: 'Zen Old Mincho', serif; font-weight: 900; color: var(--tatami); opacity: 0.05; line-height: 1; pointer-events: none; }}

/* atmosphere: white wave line-art + paper mottle over the char ground */
.wave {{ position: absolute; pointer-events: none; opacity: 0.07; }}
.paper {{ position: absolute; inset: 0; pointer-events: none; background-image: url('{PAPER}'); background-size: 1100px; mix-blend-mode: soft-light; opacity: 0.55; }}

/* house photo grade (brand spec) */
.photo {{ filter: brightness(0.86) saturate(1.08) contrast(1.12) sepia(0.1); }}
"""


def atmosphere(wave_style="bottom:-120px; right:-170px; width:860px;"):
    return f"""
    <img class="wave" src="{WAVE}" style="{wave_style}">
    <div class="paper"></div>
    """


def lockup(scale=1.0):
    return f"""
    <div class="lockup" style="transform:scale({scale}); transform-origin:center top;">
      <div class="lockup-name">Bamboo</div>
      <div class="lockup-sub">On Market</div>
    </div>"""


def page(body, extra_css=""):
    return f"<!doctype html><html><head><meta charset='utf-8'><style>{BASE_CSS}{extra_css}</style></head><body>{body}</body></html>"


def cover_legacy():
    body = f"""
    <div class="ghost-kanji" style="font-size:1250px; top:-130px; left:-230px;">竹</div>
    {atmosphere()}
    <div class="tategaki" style="position:absolute; right:64px; top:120px; font-size:40px;">鮨 · 竹 · 灯</div>
    <div style="position:absolute; top:96px; left:0; right:0; display:flex; justify-content:center;">{lockup(0.82)}</div>
    <div style="position:absolute; left:104px; right:130px; top:430px;">
      <div class="tick-row" style="margin-bottom:46px;">
        <div class="tick"></div>
        <div class="eyebrow" style="font-size:27px;">Birmingham &middot; Est. 2011 <span class="kanji" style="letter-spacing:0; color:var(--gold);">&middot; 二号店</span></div>
      </div>
      <div class="display" style="font-size:94px; line-height:1.2; white-space:nowrap;">Fifteen years<br>on 2nd Avenue.</div>
      <div style="display:flex; align-items:center; gap:34px; margin:58px 0 0;">
        <div style="height:1px; background:var(--seam); width:140px;"></div>
        <div style="font-size:37px; line-height:1.6; color:var(--tatami); max-width:640px;">
          The next chapter of Bamboo is coming to <span style="color:var(--washi);">Market Street, Chattanooga.</span>
        </div>
      </div>
    </div>
    <div style="position:absolute; left:104px; right:104px; bottom:92px; display:flex; align-items:baseline; justify-content:space-between; border-top:1px solid var(--seam); padding-top:36px;">
      <div class="item-name" style="font-size:28px;">Bamboo on Market</div>
      <div class="price" style="font-size:30px;">Opening 2027</div>
    </div>
    """
    return page(body)


def photo_slide(img, name, desc, note="", tategaki="鮨 · 竹 · 灯"):
    uri = pathlib.Path(img).as_uri()
    note_html = f'<span class="price" style="font-size:28px; margin-left:26px; white-space:nowrap;">{note}</span>' if note else ""
    body = f"""
    <img class="photo" src="{uri}" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
    <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(15,14,13,0.96) 0%, rgba(15,14,13,0.55) 16%, rgba(15,14,13,0) 34%), linear-gradient(to bottom, rgba(15,14,13,0.45) 0%, rgba(15,14,13,0) 18%);"></div>
    <div class="tategaki" style="position:absolute; right:52px; top:96px; font-size:34px; text-shadow:0 1px 14px rgba(15,14,13,0.6);">{tategaki}</div>
    <div style="position:absolute; left:84px; right:84px; bottom:76px;">
      <div class="tick-row" style="margin-bottom:26px;">
        <div class="tick" style="width:56px;"></div>
        <div class="eyebrow" style="font-size:23px;">{desc}</div>
      </div>
      <div style="display:flex; align-items:baseline;">
        <span class="item-name" style="font-size:47px; line-height:1.3;">{name}</span>{note_html}
      </div>
    </div>
    """
    return page(body)


def review_slide(quotes, tategaki="近日開店"):
    items = ""
    for q, name, stars in quotes:
        items += f"""
        <div style="margin-bottom:74px;">
          <div style="display:flex; align-items:baseline; gap:30px; margin-bottom:26px;">
            <span class="item-name" style="font-size:33px;">{name}</span>
            <span style="flex:1; height:1px; background:var(--seam); position:relative; top:-8px;"></span>
            <span class="price" style="font-size:31px; letter-spacing:0.22em;">{stars}</span>
          </div>
          <div style="font-size:39px; line-height:1.56; color:var(--tatami); font-weight:400;">&ldquo;{q}&rdquo;</div>
        </div>"""
    body = f"""
    <div class="ghost-kanji" style="font-size:1150px; bottom:-260px; right:-260px;">灯</div>
    {atmosphere("top:-60px; left:-200px; width:760px; transform:scaleY(-1);")}
    <div class="tategaki" style="position:absolute; right:64px; top:420px; font-size:36px;">{tategaki}</div>
    <div style="position:absolute; left:104px; right:160px; top:118px;">
      <div class="rule-title" style="margin-bottom:30px;">
        <div class="display" style="font-size:66px; letter-spacing:0.12em; text-transform:uppercase; white-space:nowrap;">Google Reviews</div>
      </div>
      <div class="caps" style="text-align:center; font-size:24px; color:var(--tatami); margin-bottom:96px;">Bamboo on 2nd &middot; Birmingham</div>
      {items}
    </div>
    <div style="position:absolute; left:104px; right:104px; bottom:92px; display:flex; align-items:baseline; justify-content:space-between; border-top:1px solid var(--seam); padding-top:36px;">
      <div class="item-name" style="font-size:26px;">878 reviews on Google</div>
      <div class="price" style="font-size:30px;">4.6 &#9733;</div>
    </div>
    """
    return page(body)


def closer_slide():
    body = f"""
    <div class="ghost-kanji" style="font-size:1300px; top:-180px; right:-300px;">竹</div>
    {atmosphere()}
    <div class="tategaki" style="position:absolute; left:64px; top:120px; font-size:40px;">近日開店</div>
    <div style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:0 110px;">
      {lockup(1.3)}
      <div class="display" style="font-size:86px; line-height:1.24; margin-top:110px;">See you on<br>Market Street.</div>
      <div style="display:flex; align-items:baseline; gap:30px; margin-top:92px; width:640px;">
        <span class="item-name" style="font-size:30px;">Opening</span>
        <span style="flex:1; height:1px; background:var(--seam); position:relative; top:-8px;"></span>
        <span class="price" style="font-size:34px;">February 1, 2027</span>
      </div>
      <div style="margin-top:40px; font-size:30px; color:var(--tatami);">Downtown Chattanooga &middot; a short walk from the riverfront</div>
    </div>
    """
    return page(body)


def food_cover():
    uri = (PHOTOS / "rolls-platter.webp").as_uri()
    body = f"""
    <img class="photo" src="{uri}" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
    <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(15,14,13,0.97) 6%, rgba(15,14,13,0.5) 30%, rgba(15,14,13,0.18) 55%, rgba(15,14,13,0.4) 100%);"></div>
    <div style="position:absolute; top:88px; left:0; right:0; display:flex; justify-content:center;">{lockup(0.66)}</div>
    <div class="tategaki" style="position:absolute; right:56px; top:330px; font-size:36px; text-shadow:0 1px 14px rgba(15,14,13,0.6);">書き初め</div>
    <div style="position:absolute; left:96px; right:96px; bottom:104px;">
      <div class="rule-title" style="margin-bottom:34px;">
        <div class="display" style="font-size:88px; letter-spacing:0.1em; text-transform:uppercase; white-space:nowrap;">The Menu</div>
      </div>
      <div style="display:flex; justify-content:center; gap:44px; align-items:baseline;">
        <span class="item-name" style="font-size:28px;">Sushi</span><span class="price" style="font-size:26px;">&middot;</span>
        <span class="item-name" style="font-size:28px;">Wok</span><span class="price" style="font-size:26px;">&middot;</span>
        <span class="item-name" style="font-size:28px;">Fire</span>
      </div>
    </div>
    """
    return page(body)


def mockup_slide():
    uri = (BRAND / "floor-model-poster.jpg").as_uri()
    body = f"""
    {atmosphere("top:-80px; right:-200px; width:760px; transform:scale(-1);")}
    <div style="position:absolute; left:96px; right:96px; top:104px;">
      <div class="tick-row" style="margin-bottom:40px;">
        <div class="tick"></div>
        <div class="eyebrow" style="font-size:26px;">The room we&rsquo;re building</div>
      </div>
      <div style="border:1px solid var(--seam); outline:1px solid rgba(181,52,28,0.5); outline-offset:10px; background:var(--char-deep);">
        <img src="{uri}" style="display:block; width:100%; height:auto; filter:saturate(1.05);">
      </div>
      <div class="display" style="font-size:62px; line-height:1.32; margin-top:72px;">Dining room, sushi counter,<br>twin patios &mdash; drawn to scale.</div>
      <div style="display:flex; align-items:baseline; gap:30px; margin-top:64px;">
        <span class="item-name" style="font-size:29px;">Opening</span>
        <span style="flex:1; height:1px; background:var(--seam); position:relative; top:-8px;"></span>
        <span class="price" style="font-size:33px;">February 1, 2027</span>
      </div>
    </div>
    """
    return page(body)


STARS = "&#9733;&#9733;&#9733;&#9733;&#9733;"

SLIDES = {
    # Post 1 — legacy carousel
    "post1/01-cover.png": cover_legacy(),
    "post1/02-dining-room.png": photo_slide(PHOTOS / "dining-room.webp", "The room that started it all", "Bamboo on 2nd &middot; Birmingham"),
    "post1/03-counter.png": photo_slide(PHOTOS / "counter.webp", "Fifteen years behind the counter", "Bamboo on 2nd &middot; Birmingham"),
    "post1/04-chefs.png": photo_slide(PHOTOS / "chefs.webp", "Same hands &middot; Same standards", "Bamboo on 2nd &middot; Birmingham"),
    "post1/05-reviews-a.png": review_slide([
        ("The best sushi in Birmingham, hands down! You cannot have a bad time here.", "M. H. S.", STARS),
        ("Amazing service, impeccable food, great ambience. You can really tell that everyone really cares.", "Serena F.", STARS),
    ]),
    "post1/06-reviews-b.png": review_slide([
        ("Maybe the best ribs I&rsquo;ve had in a decade or two.", "Samuel T.", STARS),
        ("We&rsquo;ve been eating here quarterly since they opened, and they never disappoint.", "Steve S.", STARS),
    ]),
    "post1/07-closer.png": closer_slide(),
    # Post 2 — food carousel, captioned like menu items
    "post2/01-cover.png": food_cover(),
    "post2/02-nigiri.png": photo_slide(PHOTOS / "nigiri.webp", "Nigiri", "From the sushi counter", note="Cut to order"),
    "post2/03-ramen.png": photo_slide(PHOTOS / "ramen-close.webp", "Ramen", "From the kitchen", note="Broth built slow"),
    "post2/04-ribs.png": photo_slide(PHOTOS / "ribs.webp", "Baby back ribs", "From the wok &amp; grill", note="Hoisin glaze"),
    "post2/05-skewers.png": photo_slide(PHOTOS / "skewers.webp", "Skewers", "From the wok &amp; grill", note="Over fire"),
    "post2/06-glazed-bowl.png": photo_slide(PHOTOS / "glazed-bowl.webp", "Bowls", "From the kitchen", note="With backbone"),
    "post2/07-sashimi.png": photo_slide(PHOTOS / "sashimi-board.webp", "Sashimi", "From the sushi counter", note="The quiet flex"),
    # Post 3 — the building + open date
    "post3/01-storefront.png": photo_slide(BRAND / "visit-storefront.png", "Market Street, Chattanooga", "Render &middot; Coming 2027", tategaki="近日開店"),
    "post3/02-floor-model.png": mockup_slide(),
    "post3/03-door.png": photo_slide(BRAND / "hero-door.webp", "See you at the red door", "Opening February 1, 2027", tategaki="鮨 · 竹 · 灯"),
}


def main():
    with tempfile.TemporaryDirectory() as td:
        for rel, html in SLIDES.items():
            out = OUT / rel
            out.parent.mkdir(parents=True, exist_ok=True)
            src = pathlib.Path(td) / (rel.replace("/", "-") + ".html")
            src.write_text(html)
            subprocess.run([
                CHROME, "--headless", "--disable-gpu", "--hide-scrollbars",
                f"--screenshot={out}", "--window-size=1080,1350",
                "--virtual-time-budget=10000", src.as_uri(),
            ], check=True, capture_output=True)
            print("wrote", rel)


if __name__ == "__main__":
    main()
