<template>
  <div class="relative min-h-screen w-full flex flex-col justify-center items-center bg-dark-space p-4 overflow-hidden">
    <canvas ref="canvasRef" class="absolute top-0 left-0 w-full h-full z-0"></canvas>
    <div class="relative z-10 flex flex-col items-center justify-center text-center w-full">
      <!-- Header -->
      <header class="fixed top-0 left-0 right-0 z-20 bg-black/30 backdrop-blur-lg">
        <div class="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <h1 class="text-2xl font-bold text-white">PortföyAI</h1>
          <NuxtLink to="/login">
            <Button variant="outline" class="bg-transparent text-white border-white/50 hover:bg-white hover:text-black transition-all">
              Giriş Yap
            </Button>
          </NuxtLink>
        </div>
      </header>
      
      <!-- Main Content -->
      <main class="flex flex-col items-center justify-center gap-12 px-4 w-full">
        <!-- Hero Section -->
        <section class="max-w-4xl">
          <h2 class="text-5xl md:text-7xl font-bold text-white [text-shadow:0_0_15px_rgba(59,130,246,0.5)]">
            Emlak Deneyimini <span class="text-blue-400">Geleceğe Taşı</span>
          </h2>
          <p class="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto [text-shadow:0_0_5px_rgba(255,255,255,0.3)]">
            PortföyAI, yapay zeka gücüyle alıcı ve satıcıları buluşturur, karmaşık süreçleri basitleştirir ve size en değerli varlığınızı geri verir: zaman.
          </p>
          <div class="mt-8">
            <Dialog v-model:open="isDialogOpen">
              <DialogTrigger as-child>
                 <Button size="lg" class="bg-blue-500 hover:bg-blue-600 text-white">
                  Hemen Başlayın
                </Button>
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
        <section class="w-full max-w-6xl">
          <h3 class="text-3xl md:text-4xl font-bold text-white [text-shadow:0_0_12px_rgba(59,130,246,0.4)]">Neden PortföyAI?</h3>
          <p class="mt-2 text-md text-gray-400 [text-shadow:0_0_5px_rgba(255,255,255,0.3)]">Süreci basitleştirin, verimliliği artırın.</p>
          <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <!-- Feature 1 -->
            <div class="bg-black/20 backdrop-blur-md p-6 rounded-lg border border-gray-700/50">
              <Icon name="lucide:bot" class="w-8 h-8 mx-auto text-blue-400" />
              <h4 class="mt-4 text-xl font-semibold text-white">Akıllı Eşleştirme</h4>
              <p class="mt-2 text-gray-400">
                Yapay zeka, alıcı ve satıcılar için en doğru eşleşmeleri bularak başarı oranını artırır.
              </p>
            </div>
            <!-- Feature 2 -->
            <div class="bg-black/20 backdrop-blur-md p-6 rounded-lg border border-gray-700/50">
              <Icon name="lucide:clock" class="w-8 h-8 mx-auto text-blue-400" />
              <h4 class="mt-4 text-xl font-semibold text-white">Zaman Tasarrufu</h4>
              <p class="mt-2 text-gray-400">
                Otomatik süreçler manuel iş yükünü ortadan kaldırır, size en değerli varlığınızı geri kazandırır.
              </p>
            </div>
            <!-- Feature 3 -->
            <div class="bg-black/20 backdrop-blur-md p-6 rounded-lg border border-gray-700/50">
              <Icon name="lucide:layout-dashboard" class="w-8 h-8 mx-auto text-blue-400" />
              <h4 class="mt-4 text-xl font-semibold text-white">Kolay Yönetim</h4>
              <p class="mt-2 text-gray-400">
                Tüm talepleri, portföyleri ve süreçleri tek bir merkezi dashboard'dan kolayca takip edin.
              </p>
            </div>
            <!-- Feature 4 -->
            <div class="bg-black/20 backdrop-blur-md p-6 rounded-lg border border-gray-700/50">
              <Icon name="lucide:arrow-right-left" class="w-8 h-8 mx-auto text-blue-400" />
              <h4 class="mt-4 text-xl font-semibold text-white">Verimli İletişim</h4>
              <p class="mt-2 text-gray-400">
                Doğru alıcı ve satıcılar bir araya getirilir, gereksiz iletişim trafiği ortadan kalkar.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
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

// Three.js background animation
const canvasRef = ref<HTMLCanvasElement | null>(null)
let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let animationFrameId: number

onMounted(() => {
  if (!canvasRef.value) return
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 5
  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  
  const particlesGeometry = new THREE.BufferGeometry()
  const particlesCount = 5000
  const posArray = new Float32Array(particlesCount * 3)
  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10
  }
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
  
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: 0x3b82f6,
  })
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particlesMesh)
  
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)
    particlesMesh.rotation.y += 0.0005
    renderer.render(scene, camera)
  }
  animate()

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
  })
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<style scoped>
.bg-dark-space {
  background-color: #0a0e1a;
}
</style> 