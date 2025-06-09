export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuth()
  const publicRoutes = ['/', '/login', '/forgot-password', '/download']

  // Rotaların tam eşleşmesini veya alt yolunu kontrol et
  const isPublicRoute = publicRoutes.some(route => to.path === route || (route !== '/' && to.path.startsWith(route)))

  // Eğer giriş yapılmamış ve rota public değilse, login'e yönlendir
  if (!auth?.accessToken && !isPublicRoute) {
    return navigateTo('/login')
  }

  // Eğer giriş yapılmış ve login/şifremi unuttum sayfasındaysa, dashboard'a yönlendir
  if (auth?.accessToken && (to.path === '/login' || to.path === '/forgot-password')) {
    return navigateTo('/dashboard')
  }
})
