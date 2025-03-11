import { defineNuxtPlugin } from '#app'
import { useAuth } from '~/composables/useAuth'

export default defineNuxtPlugin(async (_nuxtApp) => {
  const auth = useAuth()

  // Kullanıcı giriş yapmışsa profil bilgilerini al
  if (auth.accessToken && !auth.user) {
    try {
      await auth.fetchUser()
    }
    catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }
})
