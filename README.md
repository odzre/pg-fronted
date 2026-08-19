# Payment Gateway Frontend (Next.js)

Frontend merchant dashboard untuk payment gateway, mengonsumsi REST API backend Laravel (lihat `../README.md`).

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui-style components · TanStack Query · iron-session · qrcode.react

## Arsitektur

- **Autentikasi:** login/register via Laravel Sanctum; token disimpan di cookie ter-enkripsi (iron-session), **tidak pernah** sampai ke browser.
- **Data:** Server Components / Route Handlers (`src/app/api/*`) memanggil backend Laravel dari sisi server (`src/lib/api.ts`). Client component memakai TanStack Query + route handlers (`src/lib/client.ts`).
- **API key (X-API-KEY)** untuk integrasi eksternal dikelola di halaman **Pengaturan**.

## Setup

```bash
cd frontend
cp .env.local.example .env.local
# isi PAYMENT_API_BASE_URL dan SESSION_SECRET (min 32 karakter)

npm install
npm run dev   # http://localhost:3000
```

## Struktur

```
src/
├── app/
│   ├── (dashboard)/          # halaman terproteksi (butuh login)
│   │   ├── page.tsx          # dashboard (saldo + mutasi)
│   │   ├── payment/new/      # form buat pembayaran
│   │   ├── payment/[ref]/    # QR + polling status
│   │   ├── transactions/     # riwayat transaksi
│   │   ├── settlements/      # riwayat settlement
│   │   └── settings/         # kelola API key
│   ├── login/ & register/
│   ├── api/                  # route handlers (proxy ke backend)
│   └── layout.tsx
├── components/               # ui (shadcn-style) + nav + qr
└── lib/                      # api, session, types, utils
```

## Catatan

- Pastikan backend berjalan dan CORS tidak diperlukan (semua panggilan server-to-server).
- `SESSION_SECRET` wajib diganti di production.
