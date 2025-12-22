# HydroMetInsight

Hydrometallurgy News and Content Platform

## Son Güncelleme Tarihi
Son çalışan versiyon - Tüm özellikler tamamlandı

## Özellikler

### ✅ Tamamlanan Özellikler

1. **Ana Sayfa**
   - Latest News bölümü
   - TechInsight bölümü
   - All News bölümü
   - Events bölümü
   - AdSense reklam entegrasyonu

2. **Sayfalar**
   - News listesi ve detay sayfaları
   - TechInsight listesi ve detay sayfaları
   - Events sayfası
   - Sponsors sayfası
   - Calculations sayfası
   - About sayfası
   - Questions/Contact sayfası

3. **Admin Panel**
   - Dashboard
   - News yönetimi
   - Categories yönetimi
   - TechInsight yönetimi
   - Events yönetimi
   - Statistics sayfası
   - JWT authentication

4. **API Routes**
   - Admin API routes (CRUD operations)
   - Analytics tracking
   - Newsletter subscription
   - Comments API

5. **UI/UX**
   - Responsive design
   - Modern navbar
   - Footer with newsletter
   - Image placeholders
   - Loading states

6. **Entegrasyonlar**
   - Google AdSense
   - Analytics tracking
   - Newsletter system

## Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn
- SQLite (Prisma ile)

### Adımlar

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Veritabanını hazırlayın:**
```bash
npx prisma generate
npx prisma db push
```

3. **Environment değişkenlerini ayarlayın:**
`.env` dosyası oluşturun:
```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXT_PUBLIC_GOOGLE_ADSENSE_ID="ca-pub-XXXXXXXXXXXXXXXX"
```

4. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

5. **Tarayıcıda açın:**
```
http://localhost:3000
```

## Admin Panel

Admin paneline erişim:
```
http://localhost:3000/admin
```

**Not:** İlk admin kullanıcısını oluşturmak için bir script çalıştırmanız gerekebilir.

## Proje Yapısı

```
├── app/
│   ├── admin/          # Admin panel sayfaları
│   ├── api/            # API routes
│   ├── about/          # About sayfası
│   ├── news/           # News sayfaları
│   ├── techinsight/    # TechInsight sayfaları
│   └── ...
├── components/         # React components
├── lib/                # Utility functions
├── prisma/             # Database schema
└── public/             # Static files
```

## Teknolojiler

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** SQLite (Prisma ORM)
- **Styling:** Tailwind CSS
- **Authentication:** JWT
- **Ads:** Google AdSense

## Önemli Notlar

1. **Veritabanı:** SQLite kullanılıyor, production için PostgreSQL önerilir
2. **Environment Variables:** `.env` dosyasını oluşturmayı unutmayın
3. **AdSense:** Reklamları görmek için `NEXT_PUBLIC_GOOGLE_ADSENSE_ID` ayarlanmalı
4. **Admin Kullanıcı:** İlk admin kullanıcısını oluşturmak için script gerekebilir

## Git Kullanımı

Bu proje Git ile versiyon kontrolü altında. Değişiklikleri geri almak için:

```bash
# Son commit'e geri dön
git reset --hard HEAD

# Belirli bir commit'e dön
git log
git reset --hard <commit-hash>
```

## Lisans

Bu proje özel bir projedir.

