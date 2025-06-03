import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import type { User } from '~/stores/userProfileStore'
import { useUserProfileStore } from '~/stores/userProfileStore'

interface LoginPayload {
  email: string
  password: string
}

interface LoginResponse {
  access_token: string
  refresh_token?: string
  user: User
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const router = useRouter()

  const userProfile = useUserProfileStore()

  async function login(payload: LoginPayload) {
    const { $apiFetch } = useNuxtApp()
    userProfile.setLoading(true)
    userProfile.setError(null)

    try {
      console.log('[AuthStore] Attempting login with payload:', payload);
      const response = await $apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: payload,
      })
      console.log('[AuthStore] Login API call successful, response:', response);

      accessToken.value = response.access_token
      if (response.refresh_token) {
        refreshToken.value = response.refresh_token
      }
      userProfile.setUser(response.user)

      return { success: true, user: response.user }
    }
    catch (error: any) {
      console.error('Login error (raw):', error);
      console.log('Login error data message:', error.data?.message);
      const errorMessage = error.data?.message || 'Login failed from store';
      console.log('Error message to be set:', errorMessage);
      userProfile.setError(errorMessage);
      userProfile.setUser(null);
      return { success: false, error };
    }
    finally {
      userProfile.setLoading(false)
    }
  }

  async function fetchUser() {
    if (!accessToken.value) {
      return null
    }
    const { $apiFetch } = useNuxtApp()
    userProfile.setLoading(true)

    try {
      const fetchedUser = await $apiFetch<User>('/auth/profile', {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      })
      userProfile.setUser(fetchedUser)
      return fetchedUser
    }
    catch (error: any) {
      console.warn('Fetch user error:', error.data?.message || error)
      if (error.response?.status === 401) {
        await logout(false)
      }
      return null
    }
    finally {
      userProfile.setLoading(false)
    }
  }

  async function logout(shouldRedirect: boolean = true) {
    console.log('logout action in useAuthStore, redirect:', shouldRedirect)
    const { $apiFetch } = useNuxtApp()
    try {
      // Opsiyonel: Backend'e logout isteği gönderme (örn: token'ı invalidate etme)
      // await $apiFetch('/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${accessToken.value}` } });
    }
    catch (e) {
      console.warn('Error during API logout:', e)
    }
    
    accessToken.value = null
    refreshToken.value = null
    userProfile.setUser(null)

    if (shouldRedirect) {
      try {
        await router.push('/login')
      }
      catch (error) {
        console.error('Logout navigation error:', error)
        // Acil durum: Eğer router.push çalışmazsa window.location ile yönlendirme
        // if (process.client) window.location.pathname = '/login';
      }
    }
  }

  async function refreshTokens() {
    if (!refreshToken.value) return null
    const { $apiFetch } = useNuxtApp()
    try {
      const response = await $apiFetch<LoginResponse>('/auth/refresh', {
        method: 'POST',
        body: {
          refresh_token: refreshToken.value,
        },
      })

      accessToken.value = response.access_token
      userProfile.setUser(response.user)
      return response.access_token
    }
    catch (error) {
      console.error('Token refresh error:', error)
      await logout()
      throw error
    }
  }

  return {
    accessToken,
    refreshToken,
    login,
    fetchUser,
    logout,
    refreshTokens,
  }
}, {
  persist: true,
})
