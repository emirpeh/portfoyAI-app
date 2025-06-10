import { defineNuxtPlugin } from '#app'
import { useRoute } from 'vue-router'

export default defineNuxtPlugin(async () => {
  const auth = useAuth()

  // Eğer `localStorage`'da bir token yoksa, hiçbir şey yapma.
  if (!auth.accessToken) {
    return
  }

  // Eğer token varsa, kullanıcı bilgilerini getir.
  // Bu noktada $apiFetch gibi plugin'lerin yüklenmiş olduğu garanti altındadır.
  await auth.fetchUser()
})
