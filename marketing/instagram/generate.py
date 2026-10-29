#!/usr/bin/env python3
"""Generate Instagram launch slides (1080x1350) for Bamboo on Market.

Renders brand-styled HTML through headless Chrome. Re-run after editing
SLIDES below; output lands in marketing/instagram/post{1,2,3}/.
"""
import pathlib
import subprocess
import tempfile

ROOT = pathlib.Path(__file__).resolve().parents[2]
PHOTOS = ROOT / "public/photos"
BRAND = ROOT / "public/brand"
OUT = pathlib.Path(__file__).resolve().parent
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

BASE_CSS = """
@import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&family=Zen+Old+Mincho:wght@400;700&family=Hanken+Grotesk:wght@400;500&display=swap');
:root {
  --vermilion: #B5341C; --gold: #B08D3E; --gold-soft: #C8A858;
  --charred: #1A1714; --smoke: #2B2520; --tatami: #C9B18C; --washi: #F3EDE2;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1080px; height: 1350px; overflow: hidden; }
body { background: var(--charred); color: var(--washi); font-family: 'Hanken Grotesk', sans-serif; position: relative; }
.eyebrow { font-family: Jost, sans-serif; font-weight: 500; letter-spacing: 0.32em; text-transform: uppercase; color: var(--gold); }
.serif { font-family: 'Zen Old Mincho', serif; font-weight: 400; }
.hairline { height: 1px; background: color-mix(in srgb, var(--gold) 55%, transparent); }
.kanji-ghost { position: absolute; font-family: 'Zen Old Mincho', serif; color: var(--washi); opacity: 0.045; line-height: 1; pointer-events: none; }
.corner { position: absolute; width: 54px; height: 54px; border-color: color-mix(in srgb, var(--gold) 60%, transparent); border-style: solid; border-width: 0; }
.corner.tl { top: 48px; left: 48px; border-top-width: 1px; border-left-width: 1px; }
.corner.tr { top: 48px; right: 48px; border-top-width: 1px; border-right-width: 1px; }
.corner.bl { bottom: 48px; left: 48px; border-bottom-width: 1px; border-left-width: 1px; }
.corner.br { bottom: 48px; right: 48px; border-bottom-width: 1px; border-right-width: 1px; }
"""


def corners():
    return '<div class="corner tl"></div><div class="corner tr"></div><div class="corner bl"></div><div class="corner br"></div>'


def page(body, extra_css=""):
    return f"<!doctype html><html><head><meta charset='utf-8'><style>{BASE_CSS}{extra_css}</style></head><body>{body}</body></html>"


def cover_legacy():
    mark = (BRAND / "logo-mark-white.png").as_uri()
    body = f"""
    <div class="kanji-ghost" style="font-size:1500px; top:-160px; right:-290px;">竹</div>
    {corners()}
    <div style="position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; padding:0 110px;">
      <div class="eyebrow" style="font-size:30px; margin-bottom:38px;">Birmingham &middot; Est. 2011</div>
      <div class="serif" style="font-size:118px; line-height:1.14; letter-spacing:0.01em;">
        Fifteen years<br>on 2nd Avenue.
      </div>
      <div class="hairline" style="width:180px; margin:54px 0;"></div>
      <div style="font-size:40px; line-height:1.55; color:var(--tatami); max-width:780px;">
        The next chapter of Bamboo is coming to
        <span style="color:var(--washi);">Market Street, Chattanooga.</span>
      </div>
    </div>
    <img src="{mark}" style="position:absolute; bottom:84px; right:96px; width:150px; opacity:0.9;">
    <div class="eyebrow" style="position:absolute; bottom:104px; left:110px; font-size:24px; color:var(--gold-soft);">Bamboo on Market</div>
    """
    return page(body)


def photo_slide(img, label, sublabel):
    uri = pathlib.Path(img).as_uri()
    body = f"""
    <img src="{uri}" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
    <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(26,23,20,0.92) 0%, rgba(26,23,20,0.25) 22%, rgba(26,23,20,0) 40%);"></div>
    <div style="position:absolute; left:84px; right:84px; bottom:72px;">
      <div class="hairline" style="margin-bottom:34px;"></div>
      <div class="eyebrow" style="font-size:26px; margin-bottom:14px;">{sublabel}</div>
      <div class="serif" style="font-size:54px; color:var(--washi);">{label}</div>
    </div>
    """
    return page(body)


def review_slide(quotes, footer="4.6 &#9733; &middot; 878 Google reviews &middot; Bamboo on 2nd, Birmingham"):
    cards = ""
    for q, name, meta in quotes:
        cards += f"""
        <div style="background:var(--smoke); border:1px solid color-mix(in srgb, var(--gold) 35%, transparent); padding:64px 68px; margin-bottom:44px;">
          <div style="color:var(--gold-soft); font-size:34px; letter-spacing:0.28em; margin-bottom:30px;">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
          <div class="serif" style="font-size:46px; line-height:1.42; color:var(--washi);">&ldquo;{q}&rdquo;</div>
          <div style="margin-top:34px; display:flex; align-items:baseline; gap:22px;">
            <span style="font-family:Jost; font-weight:500; font-size:27px; letter-spacing:0.18em; text-transform:uppercase; color:var(--tatami);">{name}</span>
            <span style="font-size:24px; color:color-mix(in srgb, var(--tatami) 60%, transparent);">{meta}</span>
          </div>
        </div>"""
    body = f"""
    <div class="kanji-ghost" style="font-size:1200px; bottom:-300px; left:-240px;">竹</div>
    {corners()}
    <div style="position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; padding:0 96px;">
      <div class="eyebrow" style="font-size:28px; margin-bottom:46px; text-align:center;">From our Google reviews</div>
      {cards}
      <div style="text-align:center; margin-top:10px; font-family:Jost; font-size:26px; letter-spacing:0.14em; color:var(--gold);">{footer}</div>
    </div>
    """
    return page(body)


def closer_slide():
    mark = (BRAND / "logo-mark-white.png").as_uri()
    body = f"""
    {corners()}
    <div style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:0 100px;">
      <img src="{mark}" style="width:300px; margin-bottom:70px;">
      <div class="serif" style="font-size:96px; line-height:1.2;">Bamboo<br>on Market</div>
      <div class="hairline" style="width:160px; margin:56px 0;"></div>
      <div class="eyebrow" style="font-size:30px; margin-bottom:26px;">Opening</div>
      <div class="serif" style="font-size:62px; color:var(--gold-soft);">February 1, 2027</div>
      <div style="margin-top:44px; font-size:34px; color:var(--tatami);">Market Street &middot; Downtown Chattanooga</div>
    </div>
    """
    return page(body)


def food_cover():
    uri = (PHOTOS / "rolls-platter.webp").as_uri()
    body = f"""
    <img src="{uri}" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">
    <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(26,23,20,0.95) 8%, rgba(26,23,20,0.35) 42%, rgba(26,23,20,0.15) 100%);"></div>
    {corners()}
    <div style="position:absolute; left:90px; right:90px; bottom:110px; text-align:center;">
      <div class="eyebrow" style="font-size:28px; margin-bottom:28px;">Sushi &middot; Wok &middot; Fire</div>
      <div class="serif" style="font-size:100px; line-height:1.16;">A taste of<br>what&rsquo;s coming.</div>
      <div class="hairline" style="width:170px; margin:44px auto 0;"></div>
    </div>
    """
    return page(body)


def mockup_slide():
    uri = (BRAND / "floor-model-poster.jpg").as_uri()
    body = f"""
    {corners()}
    <div style="position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; padding:0 86px;">
      <div class="eyebrow" style="font-size:28px; text-align:center; margin-bottom:40px;">The room we&rsquo;re building</div>
      <div style="border:1px solid color-mix(in srgb, var(--gold) 55%, transparent); padding:14px; background:var(--smoke);">
        <img src="{uri}" style="display:block; width:100%; height:auto;">
      </div>
      <div style="text-align:center; margin-top:48px;">
        <div class="serif" style="font-size:56px; line-height:1.3;">Dining room, sushi counter,<br>twin patios &mdash; drawn to scale.</div>
        <div class="hairline" style="width:160px; margin:36px auto;"></div>
        <div class="eyebrow" style="font-size:27px; margin-bottom:18px;">Opening</div>
        <div class="serif" style="font-size:54px; color:var(--gold-soft);">February 1, 2027</div>
      </div>
    </div>
    """
    return page(body)


SLIDES = {
    # Post 1 — legacy carousel
    "post1/01-cover.png": cover_legacy(),
    "post1/02-dining-room.png": photo_slide(PHOTOS / "dining-room.webp", "The room that started it all.", "Bamboo on 2nd &middot; Birmingham"),
    "post1/03-counter.png": photo_slide(PHOTOS / "counter.webp", "Fifteen years behind the counter.", "Bamboo on 2nd &middot; Birmingham"),
    "post1/04-chefs.png": photo_slide(PHOTOS / "chefs.webp", "Same hands. Same standards.", "Bamboo on 2nd &middot; Birmingham"),
    "post1/05-reviews-a.png": review_slide([
        ("The best sushi in Birmingham, hands down! You cannot have a bad time here.", "M. H. S.", "Local Guide"),
        ("Amazing service, impeccable food, great ambience. You can really tell that everyone really cares.", "Serena F.", "Google review"),
    ]),
    "post1/06-reviews-b.png": review_slide([
        ("Maybe the best ribs I&rsquo;ve had in a decade or two.", "Samuel T.", "Google review"),
        ("We&rsquo;ve been eating here quarterly since they opened, and they never disappoint.", "Steve S.", "Local Guide"),
    ]),
    "post1/07-closer.png": closer_slide(),
    # Post 2 — food carousel
    "post2/01-cover.png": food_cover(),
    "post2/02-nigiri.png": photo_slide(PHOTOS / "nigiri.webp", "Cut to order.", "From the sushi counter"),
    "post2/03-ramen.png": photo_slide(PHOTOS / "ramen-close.webp", "Broth, built slow.", "From the kitchen"),
    "post2/04-ribs.png": photo_slide(PHOTOS / "ribs.webp", "Glazed over fire.", "From the wok &amp; grill"),
    "post2/05-skewers.png": photo_slide(PHOTOS / "skewers.webp", "Charred &amp; skewered.", "From the wok &amp; grill"),
    "post2/06-glazed-bowl.png": photo_slide(PHOTOS / "glazed-bowl.webp", "Bowls with backbone.", "From the kitchen"),
    "post2/07-sashimi.png": photo_slide(PHOTOS / "sashimi-board.webp", "The quiet flex.", "From the sushi counter"),
    # Post 3 — the building + open date
    "post3/01-storefront.png": photo_slide(BRAND / "visit-storefront.png", "Market Street, Chattanooga.", "Render &middot; Coming 2027"),
    "post3/02-floor-model.png": mockup_slide(),
    "post3/03-door.png": photo_slide(BRAND / "hero-door.webp", "See you at the red door.", "Opening February 1, 2027"),
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
                "--virtual-time-budget=9000", src.as_uri(),
            ], check=True, capture_output=True)
            print("wrote", rel)


if __name__ == "__main__":
    main()
