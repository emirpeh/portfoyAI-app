export default defineNuxtRouteMiddleware((to, _from) => {
  const auth = useAuth()

  // Eğer login sayfasına gidiyorsa ve kullanıcı giriş yapmışsa, ana sayfaya yönlendir
  if (to.path.includes('/login') && auth.accessToken) {
    return navigateTo(to.path.includes('/tr') ? '/tr/' : '/')
  }

  // Eğer korumalı bir sayfaya gidiyorsa ve kullanıcı giriş yapmamışsa, login sayfasına yönlendir
  if (!to.path.includes('/login') && !auth.accessToken) {
    return navigateTo(to.path.includes('/tr') ? '/tr/login' : '/login')
  }
})
