---
target: sidebar dan home page
total_score: 22
max_score: 36
na_heuristics: 9
p0_count: 0
p1_count: 2
target_identity: "file:/mnt/data/Coding/saas/niaga-app/apps/web/src/pages/HomePage.tsx"
target_fingerprint: "sha256:91db41219608e1843f68dca4e8078974f7b465d0009bb552e85a06cfc0dd3566"
target_path: /mnt/data/Coding/saas/niaga-app/apps/web/src/pages/HomePage.tsx
timestamp: 2026-09-22T10-08-27Z
slug: apps-web-src-pages-homepage-tsx
---
Method: DEGRADED single-context (sub-agents only on explicit user request); detector 0 findings; no browser (DB required), judged from user screenshot (tablet, owner).

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of System Status | 1 | Home shows no status: shift open or not, today's sales |
| 2 | Match System / Real World | 3 | "Logout" still English |
| 3 | User Control and Freedom | 2 | Logout only on Home |
| 4 | Consistency and Standards | 2 | Rail vs tile order and labels differ |
| 5 | Error Prevention | 3 | |
| 6 | Recognition Rather Than Recall | 3 | Rail does not separate kasir and owner pages |
| 7 | Flexibility and Efficiency | 2 | On tablet Home duplicates rail |
| 8 | Aesthetic and Minimalist Design | 3 | Clean, but duplicate content |
| 9 | Error Recovery | n/a | No error flow |
| 10 | Help and Documentation | 3 | Tile hints |
| Total | | 22/36 | |

Priority issues:
- [P1] Home has no today status. Fix: kuning board with shift status + today's sales; "Buka shift" primary when no shift.
- [P1] Rail and tiles inconsistent (order, "Riwayat" vs "Riwayat hari ini", "Kasir" vs "Kelola kasir"; "Kasir" collides with role name). Fix: one source list, workflow order, one label per page.
- [P2] Rail does not group owner pages. Fix: 24px gap + "Pemilik" label before Katalog.
- [P2] Logout hard to reach and English. Fix: "Keluar" as link under user in rail; keep on Home for phone.
- [P3] Name and role shown twice. Fix: Home header shows today's status instead.

Personas: kasir morning (hits Jual before learning shift closed); owner evening (today's total needs Laporan); new owner ("Kasir" nav ambiguous).
