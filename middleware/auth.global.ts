export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuth()
  const publicRoutes = ['/login', '/forgot-password', '/download']
  const isPublicRoute = publicRoutes.some(route => to.path.endsWith(route))

  // Eğer giriş yapılmamış ve anasayfadaysa
  if (!auth?.accessToken && to.path === '/') {
    return navigateTo('/login')
  }

  // Eğer giriş yapılmamış ve korumalı (public olmayan) bir route'taysa
  if (!auth?.accessToken && !isPublicRoute) {
    return navigateTo('/login')
  }

  // Eğer giriş yapılmış ve login sayfasındaysa
  if (auth?.accessToken && isPublicRoute) {
    return navigateTo('/dashboard')
  }
})
