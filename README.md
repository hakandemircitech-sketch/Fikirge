# Fikirge

> Fikrinden markana — AI destekli proje ve marka oluşturma motoru.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Veritabanı + Auth**: Supabase (PostgreSQL + Auth + RLS)
- **AI**: Anthropic Claude API
- **Ödeme**: Stripe
- **Hosting**: Vercel

---

## Kurulum

### 1. Repoyu klonla

```bash
git clone https://github.com/kullaniciadi/fikirge.git
cd fikirge
npm install
```

### 2. Environment variables

`.env.local` dosyasını oluştur ve doldur:

```bash
cp .env.example .env.local
```

Doldurman gereken değerler:
- `NEXT_PUBLIC_SUPABASE_URL` → Supabase → Project Settings → API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Supabase → Project Settings → API
- `SUPABASE_SERVICE_ROLE_KEY` → Supabase → Project Settings → API
- `ANTHROPIC_API_KEY` → console.anthropic.com
- `STRIPE_SECRET_KEY` → Stripe Dashboard → Developers → API Keys
- `STRIPE_WEBHOOK_SECRET` → Stripe Dashboard → Webhooks
- `STRIPE_PRICE_BUILDER` → Stripe Dashboard → Products
- `STRIPE_PRICE_STUDIO` → Stripe Dashboard → Products

### 3. Supabase veritabanını kur

Supabase SQL Editor'da şunu çalıştır:

```sql
-- supabase/migrations/001_initial_schema.sql içeriğini kopyalayıp yapıştır
```

### 4. Google OAuth kur

1. [Google Cloud Console](https://console.cloud.google.com) → New Project
2. APIs & Services → Credentials → Create OAuth 2.0 Client ID
3. Authorized redirect URIs: `https://[SUPABASE_PROJECT_ID].supabase.co/auth/v1/callback`
4. Client ID ve Secret'ı Supabase → Authentication → Providers → Google'a ekle

### 5. Stripe Webhook kur

```bash
# Stripe CLI ile local test:
stripe listen --forward-to localhost:3000/api/billing/webhook
```

Vercel'e deploy ettikten sonra:
- Stripe Dashboard → Webhooks → Add endpoint
- URL: `https://fikirge.com/api/billing/webhook`
- Events: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_succeeded`

### 6. Geliştirme sunucusunu başlat

```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışır.

---

## Proje Yapısı

```
fikirge/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── callback/route.ts       # OAuth callback
│   ├── dashboard/page.tsx
│   ├── projects/page.tsx
│   ├── stats/page.tsx
│   ├── account/page.tsx
│   └── api/
│       ├── generate/route.ts       # ⭐ Ana AI endpoint
│       ├── projects/route.ts
│       ├── export/route.ts
│       └── billing/
│           ├── checkout/route.ts
│           ├── webhook/route.ts    # Stripe webhook
│           └── portal/route.ts
├── components/
│   ├── ui/                         # Temel UI bileşenleri
│   ├── layout/                     # Navbar, Sidebar, Footer
│   ├── dashboard/                  # Dashboard bileşenleri
│   └── landing/                    # Landing page bileşenleri
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser client
│   │   ├── server.ts               # Server client
│   │   └── middleware.ts           # Auth middleware
│   └── utils.ts
├── hooks/
│   ├── useUser.ts
│   ├── useProjects.ts
│   └── useGenerate.ts
├── types/
│   ├── database.ts                 # Supabase tip tanımları
│   └── index.ts
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Veritabanı şeması
├── public/
│   └── (static dosyalar)
├── middleware.ts                   # Route koruması
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── .env.example
└── .env.local                      # GİTİGNORE — commit etme!
```

---

## API Endpoint'leri

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/generate` | Fikri analiz et, proje paketi üret |
| GET | `/api/projects` | Kullanıcının projelerini listele |
| DELETE | `/api/projects` | Proje sil |
| POST | `/api/export` | Projeyi dışa aktar (PDF/Notion/ZIP/Link) |
| POST | `/api/billing/checkout` | Stripe checkout başlat |
| POST | `/api/billing/webhook` | Stripe webhook handler |
| POST | `/api/billing/portal` | Stripe müşteri portalı |

---

## Geliştirme Sırası (Önerilen)

1. ✅ Proje iskelet yapısı
2. [ ] Supabase kurulumu + SQL migration
3. [ ] Google OAuth
4. [ ] Landing page HTML → Next.js bileşenlerine dönüştür
5. [ ] Dashboard HTML → Next.js bileşenlerine dönüştür
6. [ ] `/api/generate` endpoint'ini test et
7. [ ] Stripe entegrasyonu
8. [ ] Export sistemi (PDF → Notion → ZIP)
9. [ ] Vercel deploy

---

## Çevre Değişkenleri

`.env.example` dosyasını referans al. `.env.local` asla commit edilmemeli.
