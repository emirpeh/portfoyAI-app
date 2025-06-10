export default defineNuxtPlugin(() => {
  const token = useCookie('token')
  const refreshToken = useCookie('refresh_token')
  const config = useRuntimeConfig()

  const baseURL = config.public.apiBaseUrl

  // Public routes that don't need token check
  const publicRoutes = ['/auth/login']

  // Create default headers
  const createHeaders = (authToken?: string | null) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`
    }
    return headers
  }

  // Handle unauthorized redirect
  const handleUnauthorized = () => {
    const router = useRouter()
    router.push(`/login`)
  }

  return {
    provide: {
      async customFetch<T = any>(request: string, opts: any = {}) {
        // Create options with default headers
        const options = {
          ...opts,
          baseURL,
          headers: createHeaders(token.value),
        }

        try {
          return await $fetch<T>(request, options)
        }
        catch (error: any) {
          // Skip token refresh for public routes
          if (error.response?.status === 401 && !publicRoutes.includes(request)) {
            try {
              // Try to refresh token
              if (!refreshToken.value) {
                throw new Error('No refresh token')
              }

              const result = await $fetch<{ access_token: string }>('/auth/refresh', {
                baseURL,
                method: 'POST',
                headers: createHeaders(),
                body: {
                  refresh_token: refreshToken.value,
                },
              })

              if (result.access_token) {
                token.value = result.access_token
                // Retry with new token
                return await $fetch<T>(request, {
                  ...options,
                  headers: createHeaders(result.access_token),
                })
              }
              else {
                throw new Error('Invalid refresh token response')
              }
            }
            catch (refreshError) {
              token.value = null
              refreshToken.value = null
              handleUnauthorized()
              throw refreshError
            }
          }
          throw error
        }
      },
    },
  }
})
