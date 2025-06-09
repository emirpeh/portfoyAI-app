import { defineStore } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
// import type { User } from '@prisma/client'
import { useStorage } from '@vueuse/core'

// Geçici olarak User tipini burada tanımlıyoruz
interface User {
  id: string
  email: string
  role: 'ADMIN' | 'USER' // Projenizdeki rollere göre güncelleyin
}

export type AuthUser = Pick<User, 'id' | 'email' | 'role'> & { isDefault?: boolean }

interface LoginPayload {
  email: string
  password: string
}

interface LoginResponse {
  access_token: string
  user: AuthUser
}

export const useAuth = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const accessToken = ref<string | null>(null)
  const router = useRouter()
  const route = useRoute()

  async function login(payload: LoginPayload) {
    const { $apiFetch } = useNuxtApp()

    try {
      const response = await $apiFetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: payload,
      })

      accessToken.value = response.access_token
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
    if (!accessToken.value)
      return

    try {
      const fetchedUser = await $apiFetch<AuthUser>('/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      })
      user.value = fetchedUser
      return fetchedUser
    }
    catch (error) {
      console.error('Fetch user error:', error)
      const publicRoutes = ['/login', '/register', '/forgot-password']
      const currentPath = route.path.replace(/^\/(tr|en)/, '')
      if (!publicRoutes.includes(currentPath)) {
        await logout()
      }
      return null
    }
  }

  async function logout() {
    user.value = null
    accessToken.value = null

    try {
      if (route.path !== '/login') {
        await router.push(`/login`)
      }
    }
    catch (error) {
      console.error('Navigation error:', error)
    }
  }

  return {
    // State
    user,
    accessToken,
    // Actions
    login,
    fetchUser,
    logout,
  }
})

export type AuthStore = ReturnType<typeof useAuth>
