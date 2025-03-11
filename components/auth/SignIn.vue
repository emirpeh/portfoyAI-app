<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { z } from 'zod'
import PasswordInput from '~/components/PasswordInput.vue'
import { useAuth } from '~/composables/useAuth'

const email = ref('info@maxitransport.net')
const password = ref('MAXI2023')
const isLoading = ref(false)
const error = ref('')

const { t } = useI18n({
  useScope: 'global',
})
const auth = useAuth()

async function onSubmit(event: Event) {
  event.preventDefault()
  if (!email.value || !password.value)
    return

  isLoading.value = true
  error.value = ''

  try {
    await auth.login({
      email: email.value,
      password: password.value,
    })

    navigateTo('/')
  }
  catch (err: any) {
    console.error('Login error:', err)
    error.value = err.message || t('auth.failed')
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form class="grid gap-6" @submit="onSubmit">
    <Separator />
    <div class="grid gap-2">
      <Label for="email">
        {{ t('auth.email') }}
      </Label>
      <Input
        id="email"
        v-model="email"
        type="email"
        placeholder="name@example.com"
        :disabled="isLoading"
        auto-capitalize="none"
        auto-complete="email"
        auto-correct="off"
      />
    </div>
    <div class="grid gap-2">
      <Label for="password">
        {{ t('auth.password') }}
      </Label>
      <PasswordInput id="password" v-model="password" />
    </div>
    <p v-if="error" class="text-sm text-red-500">
      {{ error }}
    </p>
    <Button type="submit" class="w-full" :disabled="isLoading">
      <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
      {{ t('auth.login') }}
    </Button>
    <!-- Yardım metni -->
    <p class="text-center text-xs text-muted-foreground">
      {{ t('auth.help_text_prefix') }}
      <a
        href="mailto:info@maxitransport.net"
        class="text-primary hover:underline"
      >
        info@maxitransport.net
      </a>
      {{ t('auth.help_text_suffix') }}
    </p>
  </form>
</template>

<style scoped>

</style>
