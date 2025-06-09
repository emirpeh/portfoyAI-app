import { defineNuxtPlugin } from '#app'
import { useAuth } from '~/composables/useAuth'

type $ApiFetch = ReturnType<typeof $fetch.create>

export default defineNuxtPlugin((nuxtApp) => {
  const auth = useAuth()
  const config = useRuntimeConfig()

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBaseUrl, // runtimeConfig'den baseURL'i al
    onRequest({ options }) {
      const headers: Record<string, string> = {}
      headers['Content-Type'] = 'application/json'

      if (auth.accessToken) {
        headers.Authorization = `Bearer ${auth.accessToken}`
      }

      options.headers = headers as any
    },
    onResponseError({ response }) {
      // 401 Unauthorized hatası gelirse, kullanıcıyı logout yap.
      // Bu, geçersiz token veya geçersiz giriş denemesi durumlarını kapsar.
      if (response.status === 401) {
        auth.logout()
      }
      // Diğer hataları normal şekilde fırlat
      throw response._data
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
