# Bamboo on Market — Brand Visual Identity

**Date:** 2026-10-18
**Status:** Locked (validated section-by-section with client)
**Mood board:** https://claude.ai/artifact/Qg4ahGd8NNKGbkbudz8Rg4
**Scope:** Governs the Chattanooga (Market Street) location's website, menus, and marketing assets. Birmingham (Bamboo on 2nd) keeps its existing orange identity.

## Concept — "Lacquer & Gold"

Bamboo on Market is Bamboo after dark. Birmingham's brand is daylight: bright safety orange, white wire chairs, raw brick, canvas. Market takes the same ingredients and lacquers them — orange deepens to vermilion, brick becomes charred wood, canvas becomes shadow, with burnished gold as the accent. Family resemblance comes from material honesty, red warmth, and the shared bamboo mark — not matching colors.

**Positioning:** refined but alive. Upscale izakaya / sushi-bar energy — dim, warm, buzzy. Date night and cocktails, not hushed omakase ceremony.

**Brand relationship:** elevated sibling. Clearly the same family as Bamboo on 2nd, clearly the premium one.

## Palette

| Role | Name | Hex | Usage |
|---|---|---|---|
| Primary | Lacquer Vermilion | `#B5341C` | CTAs, seals, the one bold plane per composition |
| Accent | Burnished Gold | `#B08D3E` | Hover, foil, kanji accents. Metallic gradient `#D6B86A → #B08D3E → #8F6F2B` for swatch/foil renders. Lighter `#C8A858` for small hover text on dark |
| Ground | Charred Wood | `#1A1714` | Dominant surface. Near-black brown, never pure black |
| Ground 2 | Smoke | `#2B2520` | Cards, elevated surfaces |
| Warm neutral | Tatami | `#C9B18C` | Secondary text, hairline rules |
| Light | Washi | `#F3EDE2` | Body text on dark; paper color in light contexts |
| Metal | Chrome | `#C7CCD1` | Fine rules, rare jewelry moments |
| Border | — | `#3A332C` / `#4A4138` | Card borders, dividers on charred |

Surface ratio ~60% charred / 20% washi-tatami / 15% vermilion / 5% chrome. Dark-first brand: website defaults dark, menus print dark.

Rules: vermilion is accent only, never body text. Gold and vermilion may touch via hairline but never blend in a gradient. One vermilion plane per composition.

## Logo

Supplied artwork (custom): stylized 竹 where the left radical's verticals are chopsticks crossing a circular plate, above heavy geometric sans "BAMBOO" with "— ON MARKET —" beneath.

- On dark grounds: reversed to washi/white (CSS: `filter: invert(1); mix-blend-mode: screen` over the black-on-white source until a transparent/white asset is produced)
- On light grounds: black on washi
- Never recolored, never stretched. A one-color vermilion stamp variant is a possible deliberate exception (not yet approved)
- Source file: `public/brand/logo.jpg` (black on white; needs vectorization/transparent versions as a follow-up)

## Typography

Three voices (all Google Fonts):

1. **Jost** 300/400/500 — eyebrows, nav, small caps labels. Tracked +0.25–0.4em. The wordmark itself is the supplied logo art, not set type.
2. **Zen Old Mincho** 400/700/900 — display serif. Headlines, dish names, prices. Renders kanji natively (竹 灯 味 粋).
3. **Hanken Grotesk** 400/500/600 — body, UI, menu descriptions.

Rules: headlines mincho in washi on charred; eyebrows Jost caps in tatami/chrome/gold; prices in mincho numerals with no ".00"; kanji ghosted at 5–8% opacity as background texture (one per surface, max).

Menu item hierarchy: Jost eyebrow (section) → mincho dish name + mincho price on shared baseline → Hanken description in tatami.

## Graphic language

1. **The mark (竹):** reversed on dark, black on light, ghost watermark at 5–8%
2. **Hairline rules:** 1px tatami/chrome flanking small caps; weight lives in type, never lines
3. **Ghost kanji:** oversized mincho kanji cropped off-edge, barely visible, one per surface
4. **Katagami nod:** fine-line stencil pattern (from 2nd's ceiling canvas) reserved for special surfaces — sake list cover, gift cards, loyalty cards. Vermilion on charred or blind-embossed. The strongest family thread back to Birmingham
5. **Vermilion threshold:** one bold red plane per composition (door, CTA, seal, web top-stripe)

Anti-rules: no bamboo-leaf clipart, no brush-stroke fonts, no dragon/wave clichés, no red-gold gradient blends.

## Photography

Dark-ambient, warm, single key light. Validated grade (from the Instagram mock, CSS equivalent):

- `brightness(1.08) saturate(1.22) contrast(1.26) sepia(0.1)`
- Warm amber key-light glow: radial `rgba(255,205,125,0.42)` overlay-blended over the subject
- Warm vignette toward charred at edges (`rgba(20,14,8,0.45)`)
- Text-protection gradient to `#1A1714` at bottom when type overlays

Subjects: food on dark ceramics/slate, hands and knife work, dusk interiors. Never bright-white catalog style. For production, bake the grade into assets (Adobe tools) rather than CSS where feasible.

## Voice

Short declarative sentences. Confident, a little dry, zero exclamation marks. "Fish arrives Tuesday and Friday. The menu changes when it does." Japanese terms unitalicized and unexplained on menus, explained warmly on web. Never "authentic," "exotic," or "Asian fusion."

## Applications

- **Web:** dark-first; 4px vermilion top-border stripe; mincho headlines; Reserve CTA always vermilion; gold hovers
- **Menus:** charred stock, 1px hairline frame, gold foil logo on covers, hanko-style section ordering
- **Social:** charred templates, graded photo full-bleed, logo reversed top-left, gold eyebrow + mincho headline bottom-left, "MARKET STREET · CHATTANOOGA" sign-off
- **Print/signage:** logo black on washi or reversed; vermilion plane reserved for the door and one-off moments

## Reference mockups

All on the mood-board canvas (artboards): Mark & Palette, Typography specimen, Menu Card, Web Hero, Instagram Post with photo treatment.
