# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Stall tenants inside Indonesian food courts. One tenant = one stand. The gerobak (street-food cart) look in the design system is a visual theme, not the target market.

- **Kasir** (cashier): sells all day at the stand's counter with a queue waiting. Uses a phone in portrait or a tablet in landscape. Needs speed and big touch targets, not information density.
- **Owner**: manages catalog and cashiers, opens reports, voids orders. Usually on the same devices, after hours.

## Product Purpose

A point-of-sale app for a single food court stand: sell, take payment, print a receipt, run cashier shifts, and read sales. Success means a cashier finishes a sale in a few taps and the owner trusts the cash count and reports at the end of the day.

## Positioning

Simpler, cheaper, and hardware-free compared with Moka, Majoo, Pawoon, and Qasir:

- Only what one stand needs: sell, shift, report. No inventory, loyalty, or multi-outlet.
- Runs in the browser on the cashier's own phone or tablet. No POS terminal or thermal printer required.
- Priced below the incumbents for tiny sellers (price not yet decided).

## Operating Context

- Core flow on `/jual`: tap products into the cart, adjust quantity, pay cash (quick-cash buttons or typed amount, change shown) or static QRIS (cashier checks the payment notification and marks the order paid), then show and print the receipt.
- Receipt shows on screen and prints through `window.print()`, sized for 58 mm thermal paper.
- Shifts open with an opening float and close with a cash count. The difference is recorded per shift per cashier.
- Reports by day or date range (Asia/Jakarta time zone), by product and by cashier, with CSV export.
- UI language: Bahasa Indonesia. Currency: rupiah, stored as integers.

## Capabilities and Constraints

- Multi-tenant SaaS. Hono API on Cloudflare Workers, Neon Postgres, Vite + React web app.
- Online only. No offline mode.
- Payments: cash and static QRIS only. No payment gateway.
- Roles: owner and kasir. Owner-only: catalog, cashier management, reports, void/refund with reason.
- Stock tracking: deferred.
- Undecided: pricing, thermal printer integration beyond `window.print()`.

## Brand Commitments

- Name: Niaga.
- The visual system in `.superdesign/design-system.md` (gerobak stand + rupiah banknote quick-cash buttons, Plus Jakarta Sans) was chosen in phase 6a and is implemented in `apps/web`.

## Evidence on Hand

None. Pre-launch: no tenants, customers, testimonials, pricing, or usage data. Future work must not fabricate any of these.

## Product Principles

1. The sale comes first. Nothing on `/jual` may slow a cashier with a queue waiting.
2. Fewer features, done fully. Add a feature only when a single stand needs it.
3. The devices the seller already owns are enough. Never require extra hardware.
4. Money must reconcile. Receipts, shifts, and reports must agree to the rupiah.

## Accessibility & Inclusion

WCAG AA contrast, visible focus, touch targets at least 44px (design system uses 48px), `prefers-reduced-motion` respected. Danger states always carry text, never color alone.
