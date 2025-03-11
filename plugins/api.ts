export default defineNuxtPlugin(() => {
  const token = useCookie('token')
  const refreshToken = useCookie('refresh_token')
  const config = useRuntimeConfig()

  const baseURL = config.public.apiBaseUrl

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
          if (error.response?.status === 401) {
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
              const router = useRouter()
              router.push('/login')
              throw refreshError
            }
          }
          throw error
        }
      },
    },
  }
})
