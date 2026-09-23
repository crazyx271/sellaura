# AURA — Design System

Marketplace for verified MAX and Telegram accounts. Visual language: **Apple Liquid Glass** (iOS 26 / macOS Tahoe material) — a physical refractive glass UI, not a slogan and not dark glassmorphism.

Russian UI. Product copy never mentions glass, «жидкое стекло», transparency-as-metaphor, or design jargon.

## Product

- **Name:** AURA
- **Job:** Buy a ready MAX or Telegram account quickly, with escrow and a replacement guarantee.
- **Audience:** Russian-speaking buyers comparing platform, country, age, trust, price.
- **Primary surface:** Desktop homepage = wallpaper + floating glass chrome + catalog.

### JTBD

Scan platforms → filter → compare → buy with escrow.

## Liquid Glass = STYLE (not copy)

Liquid Glass is Apple’s UI material. It must be visible in every control:

1. **Wallpaper first.** A vivid, photographic, iOS-like abstract wallpaper fills the viewport. Glass only exists because color and light sit *behind* it. A flat black/obsidian page with 5% white overlays is the wrong style.
2. **Glass is a lens.** Bars, cards, pills, and buttons are thick rounded glass: they blur, saturate, and slightly magnify/warp the wallpaper; they pick up nearby color; they have a bright specular rim.
3. **Adaptive type.** On this wallpaper, glass is light/translucent, so primary text is dark (`#1C1C1E`), secondary is `#3A3A3C`. White-on-black cyber type is forbidden.
4. **Floating chrome, no dark app shell.** No full-page `#0B0D16` rounded “device” wrapping the site. Nav is a floating island. Cards float on the wallpaper with space around them.

### What this is NOT

- Dark glassmorphism / “obsidian + neon orbs + grid + grain”
- Generic `backdrop-filter` gray cards on `#05060C`
- Neon lime, crypto glow, cyberpunk
- Headline or body copy that says «жидкое стекло» / glass / crystal / aura-of-glass

## Wallpaper

Full-bleed, edge-to-edge, no letterboxed dark frame.

Compose with large soft fields (use CSS gradients + blurred ellipses, not stock photos of people):

- Upper-left: warm peach `#FFC4A8`
- Center: sky `#7EC8FF` → lavender `#C5B4FF`
- Lower-right: MAX violet `#8B6CFF` and Telegram cyan `#2AABEE` as *environment light only* (they tint the glass, they are not UI chrome)
- Soft white bloom behind the hero headline
- Very subtle lens flares, no hard grid, no film-grain overlay as a “tech” texture

The wallpaper must stay bright enough that frosted glass reads as glass, not as a dark panel.

## Color

| Token | Value | Use |
| --- | --- | --- |
| `--text` | `#1C1C1E` | Primary text on glass |
| `--text-2` | `#3A3A3C` | Secondary |
| `--text-3` | `#6E6E73` | Captions / mono labels |
| `--glass` | `rgba(255,255,255,0.42)` | Panel fill start |
| `--glass-end` | `rgba(255,255,255,0.14)` | Panel fill end |
| `--rim` | `rgba(255,255,255,0.82)` | Specular edge |
| `--stroke` | `rgba(255,255,255,0.55)` | Outer hairline |
| `--shadow` | `rgba(40, 50, 80, 0.18)` | Soft elevation |
| `--tg` | `#229ED9` | Telegram badge only |
| `--max` | `#6E56CF` | MAX badge only |
| `--ok` | `#248A3D` | In stock (readable on light glass) |
| `--warn` | `#C93400` | Limited |

Primary CTA is still *glass*, not a flat gradient slab: same liquid-glass recipe with a slightly denser white fill and a 1px inner highlight. Label `#1C1C1E`. Optional 8% cyan–violet tint from the wallpaper, never a neon fill.

## Typography

Apple-adjacent, not tech display.

- UI and headings: **Manrope** (400–700). Tracking `-0.03em` on large titles, `0` on body. Title sizes 56–72px, body 16–18px.
- Meta (SKU, status): **Manrope** 500, 11–12px, letter-spacing `0.04em` — not a coder mono face.
- No Space Grotesk, no JetBrains Mono, no Inter, no serif.

## Liquid Glass recipe (mandatory)

Apply to nav island, buttons, filters, account cards, stats, step cards, footer island.

Glass must **refract**, not just blur. Wallpaper color has to bend through every panel: peach/cyan/violet should visibly pool in corners of cards. A uniform milky-white frosted card is a fail.

Stack three layers per control:

1. **Lens body** (the element itself):
```
background:
  linear-gradient(165deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.08) 42%, rgba(255,255,255,0.22) 100%);
backdrop-filter: blur(48px) saturate(260%) contrast(1.08) brightness(1.06);
-webkit-backdrop-filter: blur(48px) saturate(260%) contrast(1.08) brightness(1.06);
border: 1px solid rgba(255,255,255,0.72);
border-radius: 28px; /* pills: 999px */
box-shadow:
  inset 0 1.5px 1px rgba(255,255,255,0.95),
  inset 0 -12px 24px rgba(110,86,207,0.12),
  inset 18px 0 28px rgba(34,158,217,0.10),
  inset 0 -1px 1px rgba(255,255,255,0.25),
  0 18px 50px rgba(40,50,80,0.16);
isolation: isolate;
```
2. **Specular film** (`::before`, pointer-events:none): elliptical white highlight at 12% 8%, plus a thin top rim `linear-gradient(180deg, rgba(255,255,255,0.7), transparent 36%)`.
3. **Chromatic fringe** (`::after` or extra box-shadow): `0 0 0 1px rgba(34,158,217,0.22), 0 0 0 2px rgba(196,92,255,0.12)`.

Include an inline SVG filter `id="liquid-refract"` (`feTurbulence` + `feDisplacementMap`, scale 18–28) and apply `filter: url(#liquid-refract)` only to the wallpaper blobs behind glass, not to text. Optional `mix-blend-mode: plus-lighter` on the sheen layer at 40% opacity.

Hover: translateY(-4px), saturate 1.15, inner tint strengthens. 200ms ease.

## Catalog data (mandatory)

Filter island is two rows inside one glass bar:

- Platforms: Все / MAX / Telegram (Все selected)
- Country chips: РФ · КЗ · УЗ · EU
- Age chips: от 30 дней · от 1 года · от 3 лет

Exactly **6** product cards in 3×2:

| Platform | Place | Age | Trust | Stock | Price |
| --- | --- | --- | --- | --- | --- |
| Telegram | Москва | 2019 · 7 лет | 97% | 8 | 2 190 ₽ |
| MAX | Алматы | 8 мес. | 91% | 14 | 1 640 ₽ |
| Telegram | СПб | 2021 · 5 лет | 94% | 4 | 3 200 ₽ |
| MAX | Москва | 2024 · 2 года | 88% | 6 | 2 780 ₽ |
| Telegram | EU | 2020 · 6 лет | 96% | 3 | 4 100 ₽ |
| MAX | Казань | 4 мес. | 84% | 22 | 1 290 ₽ |

## Layout

1. **Floating nav island** — centered or inset 24px from top, rounded-full / 28px, logo + links + Войти + Купить. Glass. Not a full-width dark header stuck to a shell.
2. **Hero** — large dark title on the wallpaper (not inside a dark box): «Готовые аккаунты MAX и Telegram». Sub: escrow / country / age. CTAs are glass capsules. Right: two overlapping glass product tiles (MAX + Telegram) that clearly refract the wallpaper.
3. **Trust** — four compact glass capsules in a row.
4. **Catalog** — glass filter island + 6 glass product cards (3×2). Each: platform badge, city, age, trust, stock, price ₽, Купить.
5. **How it works** — three glass tiles: Выбрать · Оплатить в эскроу · Получить доступ.
6. **Footer** — slim glass island: © AURA 2026 · Оферта · Политика · Поддержка.

Max content width ~1200–1320px, generous breathing room, lots of wallpaper visible between modules.

## Copy (Russian) — product only

- H1: «Готовые аккаунты MAX и Telegram»
- Sub: «Страна, возраст и траст видны до оплаты. Эскроу и замена в течение 24 часов.»
- CTA: «Смотреть витрину» / «Как это работает» / «Купить» / «Войти»
- Nav: Витрина · MAX · Telegram · Гарантии · Поддержка
- Never use: жидкое стекло, стекло, crystal, glass, «прозрачно как…»

## Motion

Wallpaper blobs drift slowly (20–28s). Glass tiles lift on hover. No rainbow spin, no pulse-neon.

## Must / must not

MUST: bright iOS-like wallpaper; refractive light glass chrome; dark text; Manrope; Russian product copy; both MAX and Telegram; prices in ₽; 40px+ blur + saturate 220%.
MUST NOT: dark void page; obsidian shell; white-on-black glassmorphism; Space Grotesk / JetBrains Mono; the words «жидкое стекло» anywhere in the UI; lime; stock people photos; lorem ipsum.
