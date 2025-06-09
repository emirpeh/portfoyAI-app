<template>
  <div class="relative min-h-screen w-full flex items-center justify-center bg-dark-space p-4">
    <canvas ref="canvasRef" class="absolute top-0 left-0 w-full h-full z-0"></canvas>
    
    <div class="relative z-10 w-full max-w-md bg-black/40 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden">
      <div class="p-8">
        <div class="text-center mb-6">
           <NuxtLink to="/" class="inline-block">
              <h1 class="text-4xl font-bold gradient-text">PortföyAI</h1>
          </NuxtLink>
          <p class="text-gray-400 mt-2">Yönetim paneline erişmek için giriş yapın.</p>
        </div>
        
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <Label for="email" class="text-gray-300">E-posta</Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full bg-gray-800/50 border-gray-700 rounded-lg px-4 py-2 text-white focus:border-teal-500 focus:ring-teal-500"
              placeholder="name@example.com"
            />
          </div>

          <div class="space-y-2">
            <Label for="password" class="text-gray-300">Şifre</Label>
            <Input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="w-full bg-gray-800/50 border-gray-700 rounded-lg px-4 py-2 text-white focus:border-teal-500 focus:ring-teal-500"
              placeholder="••••••••"
            />
          </div>

          <p v-if="error" class="text-sm text-red-400">
            {{ error }}
          </p>

          <Button
            type="submit"
            class="w-full cta-button-primary text-white font-bold py-3 rounded-lg text-lg"
            :loading="loading"
          >
            Giriş Yap
          </Button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'blank',
  auth: false,
})

const auth = useAuth()
const router = useRouter()

const form = ref({
  email: '',
  password: '',
})

const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  loading.value = true
  error.value = ''
  try {
    const { success } = await auth.login(form.value)
    if (success) {
      router.push(`/dashboard`)
    } else {
      error.value = 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.'
    }
  } catch {
    error.value = 'Bir hata oluştu. Lütfen tekrar deneyin.'
  } finally {
    loading.value = false
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

<style>
.bg-dark-space {
  background: #0a0e1a;
}

.gradient-text {
    background: -webkit-linear-gradient(45deg, #3b82f6, #14b8a6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.cta-button-primary {
    background-image: linear-gradient(to right, #3b82f6 0%, #14b8a6 51%, #3b82f6 100%);
    background-size: 200% auto;
    transition: 0.5s;
}

.cta-button-primary:hover {
    background-position: right center;
}
</style>
