# PortfoyAI Ön Yüz Uygulaması (portfoyAI-app)

Bu proje, PortfoyAI emlak yönetimi ve analiz platformunun ön yüzüdür. Nuxt 3 ve Vue 3 kullanılarak geliştirilmiştir.

## Proje Amacı

PortfoyAI, emlak alıcıları, satıcıları ve danışmanları için akıllı çözümler sunmayı hedefler. Bu ön yüz uygulaması, kullanıcıların emlak ilanlarını yönetmelerine, alıcı taleplerini analiz etmelerine ve pazar verilerine dayalı içgörüler elde etmelerine olanak tanır.

## Kullanılan Teknolojiler

- Nuxt 3
- Vue 3
- Pinia (State Management)
- UnoCSS (CSS Framework)
- Shadcn-Nuxt (UI Bileşenleri)
- TypeScript
- ESLint, Prettier

## Kurulum

1.  **Bağımlılıkları Yükleyin:**
    ```bash
    pnpm install
    # veya npm install / yarn install
    ```

2.  **Geliştirme Sunucusunu Başlatın:**
    ```bash
    pnpm dev
    # veya npm run dev / yarn dev
    ```
    Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.

## Proje Yapısı

- `pages/`: Uygulama sayfaları
- `components/`: Tekrar kullanılabilir UI bileşenleri
- `layouts/`: Sayfa düzenleri
- `stores/`: Pinia state yönetimi
- `composables/`: Tekrar kullanılabilir Composition API fonksiyonları
- `assets/`: Statik varlıklar (CSS, resimler vb.)
- `public/`: Genel erişilebilir statik dosyalar
- `i18n/`: Uluslararasılaştırma ve çeviri dosyaları

## Katkıda Bulunma

Katkıda bulunmak isterseniz, lütfen önce bir issue açarak veya mevcut bir issue üzerinde tartışarak başlayın.

## Lisans

Bu proje MIT Lisansı altındadır. Detaylar için `LICENSE` dosyasına bakın.
