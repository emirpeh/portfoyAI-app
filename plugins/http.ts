import { defineNuxtPlugin } from '#app'
import { useAuth } from '~/composables/useAuth'

type $ApiFetch = ReturnType<typeof $fetch.create>

export default defineNuxtPlugin((nuxtApp) => {
  const auth = useAuth()

  // API base URL'ini belirle - aynı portta /api yoluna istek at
  const baseURL = 'https://localhost:4000/api'

  // Refresh token için ayrı bir fetch instance
  const refreshFetch = $fetch.create({
    baseURL,
  })

  const apiFetch = $fetch.create({
    baseURL,
    onRequest({ options }) {
      // Yeni bir headers objesi oluştur
      const headers: Record<string, string> = {}

      // Content-Type ekle
      headers['Content-Type'] = 'application/json'

      // Token varsa Authorization header'ı ekle
      if (auth.accessToken) {
        headers.Authorization = `Bearer ${auth.accessToken}`
      }

      // Headers'ı ayarla
      // @ts-expect-error - Headers tipi uyumsuzluğu
      options.headers = headers
    },
    async onResponseError({ response, request, options }) {
      // 401 dışındaki hataları normal şekilde fırlat
      if (response.status !== 401) {
        throw response._data
      }

      // Refresh token yoksa çıkış yap
      if (!auth.refreshToken) {
        auth.logout()
        throw new Error('No refresh token available')
      }

      try {
        // Token'ı yenile
        const result = await refreshFetch<{ access_token: string }>('/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: { refresh_token: auth.refreshToken },
        })

        if (!result.access_token) {
          throw new Error('Invalid refresh token response')
        }

        // Auth store'daki token'ı güncelle
        auth.accessToken = result.access_token

        // Yeni token ile isteği tekrar gönder
        const newOptions = { ...options }
        newOptions.headers = {
          // @ts-expect-error - Headers tipi uyumsuzluğu
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${result.access_token}`,
        }

        // İsteği tekrar gönder ve sonucu döndür
        // @ts-expect-error - Fetch options tipi uyumsuzluğu
        return await $fetch(request, newOptions)
      }
      catch {
        // Herhangi bir hata durumunda çıkış yap
        auth.logout()
        throw new Error('Authentication failed. Please login again.')
      }
    },
  }) as $ApiFetch

  nuxtApp.provide('apiFetch', apiFetch)
})

declare module '#app' {
  interface NuxtApp {
    $apiFetch: $ApiFetch
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $apiFetch: $ApiFetch
  }
}
