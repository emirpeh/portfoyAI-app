<template>
  <div class="min-h-screen bg-dark-space">
    <!-- Header -->
    <header class="w-full border-b border-blue-900/20 bg-dark-space/80 backdrop-blur-md sticky top-0 z-50">
      <div class="container flex h-16 items-center justify-between px-4 md:px-6 mx-auto max-w-7xl">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="text-xl font-bold text-blue-400">PortföyAI</span>
        </NuxtLink>
        <Button as="a" href="/login" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
          Giriş Yap
        </Button>
      </div>
    </header>

    <!-- Hero Section -->
    <main>
      <section class="container px-4 py-16 md:px-6 md:py-24 mx-auto max-w-7xl">
        <div class="mx-auto max-w-4xl text-center">
          <h1 class="mb-6 text-4xl font-bold text-white md:text-6xl lg:text-7xl">
            Emlak Deneyimini
            <span class="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Geleceğe Taşı
            </span>
          </h1>
          <p class="mb-8 text-lg text-blue-200 md:text-xl">
            PortföyAI, yapay zeka gücüyle alıcı ve satıcıları buluşturur, karmaşık süreçleri basitleştirir ve size en
            değerli varlığınızı geri verir: zaman.
          </p>
          <Dialog v-model:open="isDialogOpen">
            <DialogTrigger as-child>
              <button class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-md transition-colors">
                Hemen Başlayın
              </button>
            </DialogTrigger>
            <DialogContent class="bg-dark-space border-blue-900/50 text-white sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle class="text-blue-300">
                  Talep Oluştur
                </DialogTitle>
                <DialogDescription class="text-blue-200/80">
                  Hayalinizdeki mülkü veya satmak istediğiniz varlığı bize anlatın.
                </DialogDescription>
              </DialogHeader>
              <RequestForm @submit="handleFormSubmit" />
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <!-- Features Section -->
      <section class="container px-4 py-16 md:px-6 mx-auto max-w-7xl">
        <div class="mx-auto max-w-6xl">
          <h2 class="mb-4 text-center text-3xl font-bold text-white md:text-4xl">Neden PortföyAI?</h2>
          <p class="mb-12 text-center text-blue-200">Süreci basitleştirin, verimliliği artırın.</p>

          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="feature in features"
              :key="feature.id"
              class="bg-blue-950/40 border border-blue-900/50 hover:border-blue-700 hover:bg-blue-950/60 transition-all rounded-lg p-6 text-center"
            >
              <div class="mb-4 flex justify-center">
                <div class="rounded-full bg-blue-600/20 p-3">
                  <component :is="feature.icon" class="h-8 w-8 text-blue-400" />
                </div>
              </div>
              <h3 class="mb-2 text-lg font-semibold text-white">{{ feature.title }}</h3>
              <p class="text-sm text-blue-200">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section class="container px-4 py-16 md:px-6 mx-auto max-w-7xl">
        <div class="mx-auto max-w-6xl">
          <h2 class="mb-4 text-center text-3xl font-bold text-white md:text-4xl">Nasıl Çalışır?</h2>
          <p class="mb-12 text-center text-blue-200">Sadece bir e-posta ile tüm süreci başlatın.</p>

          <div class="grid gap-8 md:grid-cols-2">
            <!-- Alıcılar İçin -->
            <div class="bg-blue-950/40 border border-blue-900/50 rounded-lg p-8">
              <h3 class="mb-6 text-2xl font-bold text-blue-400">Alıcılar İçin</h3>
              <div class="space-y-4">
                <div
                  v-for="step in buyerSteps"
                  :key="step.id"
                  class="flex items-start gap-3"
                >
                  <CheckCircleIcon class="mt-1 h-5 w-5 text-blue-400 flex-shrink-0" />
                  <p class="text-blue-200">{{ step.text }}</p>
                </div>
              </div>
            </div>

            <!-- Satıcılar İçin -->
            <div class="bg-blue-950/40 border border-blue-900/50 rounded-lg p-8">
              <h3 class="mb-6 text-2xl font-bold text-blue-400">Satıcılar İçin</h3>
              <div class="space-y-4">
                <div
                  v-for="step in sellerSteps"
                  :key="step.id"
                  class="flex items-start gap-3"
                >
                  <CheckCircleIcon class="mt-1 h-5 w-5 text-blue-400 flex-shrink-0" />
                  <p class="text-blue-200">{{ step.text }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Brain,
  Clock,
  Settings,
  MessageSquare,
  CheckCircle as CheckCircleIcon,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import RequestForm from '~/components/RequestForm.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'vue-sonner'

definePageMeta({
  layout: 'blank',
  auth: false,
})

useHead({
  title: 'PortföyAI | Geleceğin Emlak Deneyimi',
  meta: [
    { name: 'description', content: 'PortföyAI ile emlak süreçlerinizi geleceğe taşıyın. AI destekli otomasyonla tanışın.' },
  ],
})

const isDialogOpen = ref(false)

async function handleFormSubmit(formData: any) {
  try {
    await $fetch('/api/requests', {
      method: 'POST',
      body: formData,
    })

    isDialogOpen.value = false
    toast.success('Talebiniz başarıyla alındı!', {
      description: 'En kısa sürede sizinle iletişime geçeceğiz.',
    })
  }
  catch (error) {
    toast.error('Bir hata oluştu.', {
      description: 'Talebiniz gönderilemedi. Lütfen daha sonra tekrar deneyin.',
    })
  }
}

// Features data
const features = ref([
  {
    id: 1,
    icon: Brain,
    title: 'Akıllı Eşleştirme',
    description: 'Yapay zeka, alıcı ve satıcılar için en doğru eşleşmeleri bularak başarı oranını artırır.',
  },
  {
    id: 2,
    icon: Clock,
    title: 'Zaman Tasarrufu',
    description: 'Otomatik süreçler manuel iş yükünü ortadan kaldırır, size en değerli varlığınızı geri kazandırır.',
  },
  {
    id: 3,
    icon: Settings,
    title: 'Kolay Yönetim',
    description: 'Tüm talepleri, portföyleri ve süreçleri tek bir merkezi dashboard\'dan kolayca takip edin.',
  },
  {
    id: 4,
    icon: MessageSquare,
    title: 'Verimli İletişim',
    description: 'Doğru alıcı ve satıcılar bir araya getirilir, gereksiz iletişim trafiği ortadan kalkar.',
  },
])

// Buyer steps
const buyerSteps = ref([
  {
    id: 1,
    text: 'Hayalinizdeki mülkün kriterlerini (konum, bütçe, tip) bir e-posta ile bize gönderin.',
  },
  {
    id: 2,
    text: 'Yapay zekamız gelen talebi analiz ederek size en uygun portföyleri anında belirlensin.',
  },
  {
    id: 3,
    text: 'Size özel hazırlanan mülk listeleri otomatik olarak e-posta kutunuza gelsin. Zamanınıza size kalsın.',
  },
])

// Seller steps
const sellerSteps = ref([
  {
    id: 1,
    text: 'Satmak veya kiralamak istediğiniz mülkün bilgilerini (konum, fiyat, özellikler) bir e-posta ile paylaşın.',
  },
  {
    id: 2,
    text: 'Yapay zeka, mülkünüzü analiz edip sistemdeki ilgili alıcılarla anında eşleştirsin.',
  },
  {
    id: 3,
    text: 'Mülkünüze, doğru alıcı adaylarına hızlı ve etkili bir şekilde sunulur, satış süreci hızlanır.',
  },
])
</script>

<style scoped>
.bg-dark-space {
  background: #0a0e1a;
  background-image:
    radial-gradient(2px 2px at 20px 30px, rgba(255, 255, 255, 0.1), transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255, 255, 255, 0.05), transparent),
    radial-gradient(1px 1px at 90px 40px, rgba(255, 255, 255, 0.1), transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(255, 255, 255, 0.05), transparent),
    radial-gradient(2px 2px at 160px 30px, rgba(255, 255, 255, 0.1), transparent);
  background-repeat: repeat;
  background-size: 200px 100px;
}
</style> 