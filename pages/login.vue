<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'blank',
})

const { t } = useI18n()
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
    }
    else {
      error.value = t('auth.failed')
    }
  }
  catch {
    error.value = t('auth.error')
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <LayoutAuth :reverse="true">
    <Card class="mx-auto max-w-md overflow-hidden border border-gray-100 bg-white shadow-lg">
      <CardHeader class="pb-4 pt-6 text-center">
        <div class="mb-4 flex justify-center">
          <img
            src="/images/logo.png"
            alt="Maxi Logistics"
            class="h-20 w-auto"
          >
        </div>
        <CardTitle class="text-2xl text-gray-900 font-bold">
          {{ t('auth.login') }}
        </CardTitle>
        <CardDescription class="relative">
          <span class="animate-gradient-x from-primary via-primary/70 to-primary bg-gradient-to-r bg-clip-text text-base text-transparent">
            {{ t('auth.description') }}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent class="p-8">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <Label for="email" class="text-sm text-gray-700 font-medium">{{ t('auth.email') }}</Label>
            <Input
              id="email"
              v-model="form.email as string"
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
              v-model="form.password as string"
              type="password"
              required
              class="w-full border border-gray-300 rounded-lg bg-gray-100 px-4 py-2 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              placeholder="••••••••"
            />
          </div>

          <p v-if="error" class="mt-2 text-sm text-red-600 font-medium">
            {{ error }}
          </p>

          <Button
            type="submit"
            class="w-full rounded-lg bg-primary py-2.5 text-white font-medium transition-colors hover:bg-primary/90"
            :loading="loading"
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
