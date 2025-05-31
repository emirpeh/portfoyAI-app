import { defineNuxtPlugin } from '#app'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

export default defineNuxtPlugin(async (_nuxtApp) => {
  const auth = useAuth()
  const route = useRoute()

  // Public route'ları tanımla
  const publicPaths = ['/login', '/register', '/forgot-password']

  const currentPath = route.path.replace(/^\/[a-z]{2}/, '')

  // Eğer public route'taysa user fetch etme
  if (publicPaths.includes(currentPath)) {
    return
  }

  // Kullanıcı giriş yapmışsa ve user bilgisi yoksa profil bilgilerini al
  if (auth.accessToken && !auth.user) {
    try {
      await auth.fetchUser()
    }
    catch (error) {
      console.error('Error fetching user profile:', error)
      // Hata durumunda sessizce devam et, logout işlemini component'lere bırak
    }
  }
})
