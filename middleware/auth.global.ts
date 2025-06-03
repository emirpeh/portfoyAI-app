import { useAuthStore } from '~/composables/useAuthStore'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const publicRoutes = ['/login', '/forgot-password', '/download']
  const isPublicRoute = publicRoutes.some(route => to.path.endsWith(route))

  // Eğer giriş yapılmamış ve anasayfadaysa
  if (!authStore.accessToken && to.path === '/') {
    return navigateTo('/login')
  }

  // Eğer giriş yapılmamış ve korumalı (public olmayan) bir route'taysa
  if (!authStore.accessToken && !isPublicRoute) {
    return navigateTo('/login')
  }

  // Eğer giriş yapılmış ve login gibi public bir route'taysa (to.path === '/login' daha spesifik olabilir)
  if (authStore.accessToken && (to.path === '/login' || to.path === '/register')) { // Sadece login/register için dashboard'a yönlendir
    return navigateTo('/dashboard')
  }
})
