<script setup lang="ts">
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import LanguageSwitcher from '~/components/LanguageSwitcher.vue'

defineProps<{
  reverse?: boolean
}>()

const { locale, t } = useI18n({
  useScope: 'global',
})
const router = useRouter()
const switchLocalePath = useSwitchLocalePath()

// Dil değiştiğinde route'u güncelle
watch(locale, (newLocale) => {
  const newPath = switchLocalePath(newLocale)
  if (newPath) {
    router.push(newPath).then(() => {
      router.go(0) // Sayfayı yenile
    })
  }
})
</script>

<template>
  <div
    class="relative flex items-center justify-center bg-[#f5c518] px-4 h-dvh lg:max-w-none lg:px-0"
    :class="{ 'flex-row-reverse': reverse }"
  >
    <!-- Dil Seçici -->
    <div class="absolute right-4 top-4 z-50">
      <LanguageSwitcher />
    </div>

    <!-- Copyright bilgisi -->
    <div class="absolute bottom-4 left-0 right-0 flex items-center justify-center">
      <span class="text-xs text-gray-900">© 2025 Ma</span>
      <span class="text-xs text-gray-900">xi Logistics</span>
    </div>

    <!-- Tünel efekti için gradient overlay -->
    <div class="absolute right-0 top-0 h-full w-1/3 overflow-hidden from-zinc-900 via-zinc-900 to-black bg-gradient-radial">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_var(--tw-gradient-to)_100%)] from-zinc-800/20 to-transparent" />
      <div class="absolute inset-0 animate-pulse bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_var(--tw-gradient-to)_100%)] from-zinc-700/10 to-transparent" />
      <!-- Yol efekti -->
      <div class="animate-road-pulse absolute bottom-[20%] left-0 right-0 h-1 from-transparent via-zinc-600 to-transparent bg-gradient-to-r" />
      <div class="animate-road-pulse absolute bottom-[20%] left-0 right-0 h-px from-transparent via-white to-transparent bg-gradient-to-r opacity-50" />
    </div>

    <!-- Sol taraf - Logo ve slogan -->
    <div class="relative hidden h-full w-1/2.5 flex-col p-10 lg:flex">
      <div class="relative top-1/4 flex flex-1 flex-col items-center justify-end pb-48">
        <blockquote class="text-center">
          <p class="animate-gradient-x from-[#f5c518] via-white to-[#f5c518] bg-gradient-to-r bg-clip-text text-3xl text-transparent font-bold leading-relaxed tracking-wide">
            {{ t('auth.slogan') }}
          </p>
          <footer class="relative mt-6 text-lg font-medium">
            <span class="animate-pulse-slow from-[#f5c518] to-white bg-gradient-to-r bg-clip-text text-transparent">
              {{ t('auth.customer') }}
            </span>
          </footer>
        </blockquote>
      </div>
    </div>

    <img
      src="/images/maxi.svg"
      alt="Maxi Logistics"
      class="animate-truck-enter absolute top-1/2 hidden w-auto object-contain brightness-200 filter lg:block -translate-y-1/2"
      :class="{ 'right-[-480px]': !reverse, 'left-[480px]': reverse }"
    >

    <!-- Sağ taraf - Form -->
    <div class="relative w-1/2 flex-1 lg:p-8">
      <div class="relative z-10">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter {
  filter: brightness(0.75) contrast(1);
}

@keyframes gradient-x {
  0%,
  100% {
    background-position: 200% center;
  }
  50% {
    background-position: -200% center;
  }
}

.animate-gradient-x {
  animation: gradient-x 10s linear infinite;
  background-size: 200% auto;
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

@keyframes truck-enter {
  0% {
    transform: translateX(100vw) translateY(-50%);
    opacity: 0;
  }
  50% {
    transform: translateX(50vw) translateY(-50%);
    opacity: 1;
  }
  100% {
    transform: translateX(0) translateY(-50%);
    opacity: 0.8;
  }
}

.animate-truck-enter {
  animation: truck-enter 3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes road-pulse {
  0%,
  100% {
    opacity: 0.3;
    transform: scaleX(0.95);
  }
  50% {
    opacity: 0.7;
    transform: scaleX(1);
  }
}

.animate-road-pulse {
  animation: road-pulse 2s ease-in-out infinite;
}
</style>
