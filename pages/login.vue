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
      router.push('/')
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
  <LayoutAuth>
    <div class="grid mx-auto max-w-sm gap-6">
      <!-- Logo -->
      <div class="flex justify-center">
        <img
          src="/images/logo.png"
          alt="Maxi Lojistik"
          class="h-16 w-auto"
        >
      </div>

      <div class="grid gap-2 text-center">
        <h1 class="text-2xl font-semibold tracking-tight">
          {{ t('auth.login') }}
        </h1>
        <p class="text-muted-foreground">
          {{ t('auth.description') }}
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="space-y-2">
          <Label for="email">{{ t('auth.email') }}</Label>
          <Input
            id="email"
            v-model="form.email as string"
            type="email"
            required
          />
        </div>

        <div class="space-y-2">
          <Label for="password">{{ t('auth.password') }}</Label>
          <Input
            id="password"
            v-model="form.password as string"
            type="password"
            required
          />
        </div>

        <p v-if="error" class="text-sm text-red-500">
          {{ error }}
        </p>

        <Button
          type="submit"
          class="w-full"
          :loading="loading"
        >
          {{ t('auth.login') }}
        </Button>
      </form>
    </div>
  </LayoutAuth>
</template>
