---
version: 1
slug: "apps-web-src-pages-pospage-tsx"
primary_target: "apps/web/src/pages/PosPage.tsx"
related_targets: ["apps/web/src/pages/HomePage.tsx","apps/web/src/components/shell/AppShell.tsx"]
---

# Surface: Niaga web app (redesign-1), lead surface /jual

Scope: whole `apps/web` visual world, replaced. Mode: Operate. Lead surface `/jual`; all other pages inherit the world.
Audience and task: food court stand cashier selling with a queue waiting (phone portrait, tablet landscape); owner managing catalog, cashiers, reports after hours. Constraints: 48px targets, WCAG AA, `prefers-reduced-motion`, 58 mm receipt print, plain CSS per CONVENTIONS.md.
Build path: code-led (no image generation).
Unresolved: quick-cash banknote colors dropped under the two-ink rule; revisit if cashiers miss color recognition.

## Direction contract

THESIS: Every sale is a sheet in a buku nota: written line by line, totalled under a double rule, stamped LUNAS. Refuses the SaaS POS default of white rounded cards with colored accent chips.

OWN-WORLD: White nota stock; printed ink near-black indigo; carbon blue-violet for everything written, entered, or active; pale blue ruling; stamp red only for BATAL and shortage. Archivo: condensed heavy for printed form heads, normal width for body, tabular numerals. 4px corners, 1px ruled lines, double rule above every total, rotated double-bordered rubber stamps for status.

STORY: The cashier reads a printed price list, taps, watches the nota fill in carbon, pays, sees LUNAS land, prints.

FIRST VIEWPORT: Tablet: left, price list as ruled grid cells; right 380px nota sheet with head "Nota" plus date and time, column heads Banyak / Nama barang / Jumlah, ruled lines, double-rule total at 44px condensed, payment and Bayar at its foot. Phone: folded nota strip above the bottom nav (item count, total) opening into the full sheet. Signature: the LUNAS stamp lands on the receipt after payment.

FORM: Buku Nota, position 5 of 7 on the grounded list, seed key 571991e4.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
