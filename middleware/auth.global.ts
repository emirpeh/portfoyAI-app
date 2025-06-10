import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  // `auth: false` olarak işaretlenmiş sayfaları atla
  if (to.meta.auth === false) {
    return
  }

  // Herkese açık olması gereken yolları (path) burada tanımlayın.
  // Not: meta-tabanlı yaklaşımla bu diziye olan ihtiyaç azalır veya ortadan kalkar.
  const publicRoutes = ['/login'] 

  // Eğer gidilmek istenen yol herkese açık yollardan biriyse, hiçbir şey yapma.
  if (publicRoutes.includes(to.path)) {
    return
  }

  const auth = useAuth()
  
  // Eğer kullanıcı giriş yapmışsa ve token varsa, devam etmesine izin ver.
  if (auth.accessToken) {
    // İsteğe bağlı: Kullanıcı bilgilerini her sayfa geçişinde doğrula/yenile
    if (!auth.user) {
      await auth.fetchUser()
    }
    return
  }
  
  // Eğer kullanıcı giriş yapmamışsa ve sayfa korumalıysa, login sayfasına yönlendir.
  return navigateTo('/login')
})
