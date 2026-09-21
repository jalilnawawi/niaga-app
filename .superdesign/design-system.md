# Niaga design system

## Product context

Niaga is a point-of-sale web app for Indonesian street-food stands (one tenant = one stand). UI language: Bahasa Indonesia. Two roles:

- **Kasir** (cashier): sells all day at the counter. Uses a phone in portrait or a tablet in landscape, often outdoors under bright light, with a queue waiting. Needs speed and big targets, not information density.
- **Owner**: manages catalog, cashiers, and reads sales reports, usually on the same devices after hours.

Core flow on `/jual`: tap products into the cart, adjust qty, pay cash (quick-cash buttons or typed amount, change shown) or QRIS (cashier checks the notification and marks paid), then show and print the receipt.

## Direction: Gerobak stand + Uang rupiah

The frame comes from the painted street-food cart (gerobak): solid toska body, yellow price boards, chili-red lettering on white. Colors are flat, confident, and legible in sunlight. Buttons read like price boards: big, bold, one clear label.

Rupiah banknote colors appear in one place only: the quick-cash buttons on the payment step. Each button uses the color of the real note, so a cashier recognises it without reading. This is the one memorable element; everything around it stays quiet.

## Color

| Token | Hex | Use |
|---|---|---|
| `--putih` | `#FFFFFF` | page background, cards |
| `--abu` | `#EEF2F1` | secondary surface, table stripes, disabled |
| `--tinta` | `#16302E` | text, icons |
| `--toska` | `#0B7A75` | primary action, active nav, links (white text on it: 5.2:1) |
| `--kuning` | `#FFC928` | total/price board highlight, always with `--tinta` text |
| `--cabai` | `#C62828` | danger: void, kurang bayar, errors (white text on it: 5.6:1) |

Banknote colors, quick-cash buttons only, white bold text:

| Token | Hex | Note |
|---|---|---|
| `--rp100` | `#C2185B` | Rp100.000, pink-red, kept apart from `--cabai` |
| `--rp50` | `#1F5FAE` | Rp50.000 |
| `--rp20` | `#23784A` | Rp20.000 |
| `--rp10` | `#7B3FA0` | Rp10.000 |

Rules:

- Danger states always carry text ("Kurang Rp5.000", "VOID"), never color alone, because `--cabai` and `--rp100` are both red.
- Banknote colors never appear outside quick-cash buttons.
- No gradients, no drop shadows as decoration. Separation comes from flat fills and 2px `--tinta` or `--abu` borders.

## Type

- Family: **Plus Jakarta Sans** (made for Jakarta's city identity), weights 500, 700, 800. Fallback `system-ui, sans-serif`.
- Money always `font-variant-numeric: tabular-nums` so rupiah columns align.
- Scale (px): 14 meta, 16 body, 20 button and product name, 24 section heading, 32 cart total, 44 total on payment step.
- Sentence case everywhere. No all-caps labels, no eyebrow labels above headings.

## Layout

- Touch targets at least 48px; product tiles and quick-cash buttons at least 64px tall.
- Radius: 12px on buttons and tiles, 0 on tables. Borders 2px.
- Spacing scale: 4, 8, 12, 16, 24, 32.
- **HP portrait (360–430px)**: product grid 2 columns, full width. Cart is a sticky bottom bar showing item count and total on `--kuning`; tapping it opens the cart and payment as a full-height sheet. Navigation: bottom bar with Jual, Riwayat, Shift, and Lainnya (owner pages).
- **Tablet landscape (≥ 900px)**: product grid left (3–4 columns), cart and payment in a fixed right column (~360px). Navigation: narrow left rail.
- Content left-aligned. Rupiah amounts right-aligned in tables and cart.

## Principles

1. Speed over density: the next tap is always the biggest thing on screen.
2. One loud element per screen. On payment it is the quick-cash row; elsewhere the `--kuning` total board.
3. Readable in sunlight: high contrast, flat color, no thin weights below 500.
4. States speak plainly: empty, loading, and error messages say what happened and what to tap next.
5. Receipt prints at 58 mm thermal width, black on white, no color.
