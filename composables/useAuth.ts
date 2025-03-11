import { defineStore } from 'pinia'

interface AuthUser {
  id: string
  email: string
  role: 'ADMIN' | 'CUSTOMER'
  isDefault?: boolean
}

interface LoginPayload {
  email: string
  password: string
}

interface LoginResponse {
  access_token: string
  refresh_token: string
  user: AuthUser
}

export const useAuth = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)

  async function login(payload: LoginPayload) {
    const { $apiFetch } = useNuxtApp()

    try {
      const response = await $apiFetch<LoginResponse>(`/auth/login`, {
        method: 'POST',
        body: payload,
      })

      accessToken.value = response.access_token
      refreshToken.value = response.refresh_token
      user.value = response.user

      return { success: true }
    }
    catch (error) {
      console.error('Login error:', error)
      return { success: false, error }
    }
  }

  async function fetchUser() {
    const { $apiFetch } = useNuxtApp()

    try {
      const response = await $apiFetch<{ user: AuthUser }>(`/auth/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      })
      user.value = response.user
      return response.user
    }
    catch (error) {
      logout()
      throw error
    }
  }

  async function logout() {
    user.value = null
    accessToken.value = null
    refreshToken.value = null

    navigateTo('/login')
  }

  async function refreshTokens() {
    const { $apiFetch } = useNuxtApp()

    try {
      const response = await $apiFetch<LoginResponse>(`/auth/refresh`, {
        method: 'POST',
        body: {
          refresh_token: refreshToken.value,
        },
      })

      accessToken.value = response.access_token
      return response.access_token
    }
    catch (error) {
      logout()
      throw error
    }
  }

  return {
    // State
    user,
    accessToken,
    refreshToken,
    // Actions
    login,
    fetchUser,
    logout,
    refreshTokens,
  }
}, {
  persist: {
    storage: localStorage,
    serializer: {
      serialize: JSON.stringify,
      deserialize: JSON.parse,
    },
  },
})

export type AuthStore = ReturnType<typeof useAuth>
