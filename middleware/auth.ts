export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuth()

  setTimeout(() => {
    if (to.path === '/login' && auth.user) {
      return navigateTo('/')
    }

    if (to.path !== '/login' && !auth.user) {
      return navigateTo('/login')
    }
  }, 2000)
})
