<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/composables/useAuthStore'
import { useUserProfileStore } from '~/stores/userProfileStore'
import { storeToRefs } from 'pinia'

definePageMeta({
  layout: 'blank',
})

const { t } = useI18n()
const authStore = useAuthStore()
const userProfileStore = useUserProfileStore()
const router = useRouter()

const form = ref({
  email: 'buyer@portfoy.ai',
  password: 'password',
})

const { isLoading, error: authError } = storeToRefs(userProfileStore)

async function handleSubmit() {
  console.log('[LoginVue] Attempting login with form data:', JSON.parse(JSON.stringify(form.value)));
  try {
    const result = await authStore.login(form.value);
    console.log('[LoginVue] Login result from authStore:', JSON.parse(JSON.stringify(result || {})));

    if (result && result.success && result.user) {
      if (result.user.roles.includes('buyer') && !userProfileStore.userPreferences) {
        router.push('/my-profile/preferences')
      } else {
        router.push('/dashboard')
      }
    } else {
      console.error('[LoginVue] Login failed in component. Full result:', JSON.parse(JSON.stringify(result || {})), 'Result error part:', result?.error);
    }
  } catch (e) {
    console.error('[LoginVue] Error during handleSubmit execution:', e);
  }
}
</script>

<template>
  <LayoutAuth :reverse="true">
    <Card class="mx-auto max-w-md overflow-hidden border border-gray-100 bg-white shadow-lg">
      <CardHeader class="pb-4 pt-6 text-center">
        <div class="mb-4 flex justify-center">
          <img
            src="/images/logo-portfoyai.svg"
            alt="PortfoyAI"
            class="h-12 w-auto"
          >
        </div>
        <CardTitle class="text-2xl text-gray-900 font-bold">
          {{ t('auth.login') }}
        </CardTitle>
        <CardDescription class="relative">
          <span class="animate-gradient-x from-primary via-primary/70 to-primary bg-gradient-to-r bg-clip-text text-base text-transparent">
            PortfoyAI Emlak Platformu
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent class="p-8">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <Label for="email" class="text-sm text-gray-700 font-medium">{{ t('auth.email') }}</Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full border border-gray-300 rounded-lg bg-gray-100 px-4 py-2 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              placeholder="name@example.com"
            />
          </div>

          <div class="space-y-2">
            <Label for="password" class="text-sm text-gray-700 font-medium">{{ t('auth.password') }}</Label>
            <Input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="w-full border border-gray-300 rounded-lg bg-gray-100 px-4 py-2 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              placeholder="••••••••"
            />
          </div>

          <p v-if="authError" class="mt-2 text-sm text-red-600 font-medium">
            {{ typeof authError === 'object' ? JSON.stringify(authError) : authError }}
          </p>

          <Button
            type="submit"
            class="w-full rounded-lg bg-primary py-2.5 text-white font-medium transition-colors hover:bg-primary/90"
            :loading="isLoading"
            :disabled="isLoading"
          >
            {{ t('auth.login') }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </LayoutAuth>
</template>

<style scoped>
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
</style>
