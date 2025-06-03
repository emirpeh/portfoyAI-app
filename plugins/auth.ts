import { defineNuxtPlugin } from '#app'
import { useRoute } from 'vue-router'
// import { useAuth } from '~/composables/useAuth' // Eski import
import { useAuthStore } from '~/composables/useAuthStore'
import { useUserProfileStore } from '~/stores/userProfileStore'

export default defineNuxtPlugin(async (_nuxtApp) => {
  const authStore = useAuthStore()
  const userProfileStore = useUserProfileStore()
  const route = useRoute()

  // Public route'ları tanımla
  const publicPaths = ['/login', '/register', '/forgot-password']

  // Tarayıcıda çalışıp çalışmadığını kontrol et, çünkü route.path sunucuda farklı olabilir
  let currentPath = ''
  if (process.client) {
    currentPath = window.location.pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') // Dil kodunu kaldır (örn: /tr/login -> /login)
    if (currentPath === '') currentPath = '/'; // Ana sayfa için
  }

  // Eğer public route'taysa user fetch etme
  if (publicPaths.includes(currentPath)) {
    return
  }

  // Kullanıcı giriş yapmışsa ve user bilgisi yoksa profil bilgilerini al
  if (authStore.accessToken && !userProfileStore.currentUser) {
    try {
      await authStore.fetchUser()
    }
    catch (error) {
      console.error('Error fetching user profile in auth plugin:', error)
      // Hata durumunda sessizce devam et, logout işlemini component'lere veya $apiFetch onResponseError'a bırak
    }
  }
})
