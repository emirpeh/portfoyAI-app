import type { User } from '~/components/users/data/schema'
import { computed, ref } from 'vue'

interface PaginatedResponse {
  data: User[]
  total: number
}

export function useUsers() {
  const { $apiFetch } = useNuxtApp()
  const users = ref<User[]>([])
  const loading = ref(false)
  const searching = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const currentOffset = ref(0)
  const pageSize = ref(10)
  const searchQuery = ref('')

  async function fetchUsers(offset = currentOffset.value, limit = pageSize.value, search = searchQuery.value, isSearching = false) {
    if (isSearching) {
      searching.value = true
    }
    else {
      loading.value = true
    }
    error.value = null

    try {
      const query: Record<string, any> = {
        offset,
        limit,
      }

      if (search?.trim()) {
        query.email = search.trim()
      }

      const response = await $apiFetch<PaginatedResponse>('/users', {
        query,
      })

      users.value = response.data
      total.value = response.total
      currentOffset.value = offset
      pageSize.value = limit
      searchQuery.value = search
    }
    catch (err: any) {
      console.error('Error fetching users:', err)
      error.value = err.message
    }
    finally {
      loading.value = false
      searching.value = false
    }
  }

  function onSearch(search: string) {
    searchQuery.value = search
    fetchUsers(0, pageSize.value, search, true)
  }

  function onPageChange(page: number) {
    const offset = (page - 1) * pageSize.value
    fetchUsers(offset, pageSize.value)
  }

  function onPageSizeChange(limit: number) {
    fetchUsers(0, limit)
  }

  async function createUser(data: {
    email: string
    password: string
    role: 'ADMIN' | 'CUSTOMER'
    externalId?: string
  }) {
    try {
      const response = await $apiFetch('/users', {
        method: 'POST',
        body: data,
      })
      await fetchUsers()
      return response
    }
    catch (error) {
      console.error('Create user error:', error)
      throw error
    }
  }

  async function updateUser(id: string, data: {
    email: string
    password?: string
  }) {
    try {
      const response = await $apiFetch(`/users/${id}`, {
        method: 'PATCH',
        body: data,
      })
      await fetchUsers() // Listeyi yenile
      return response
    }
    catch (error) {
      console.error('Update user error:', error)
      throw error
    }
  }

  async function deleteUser(id: string) {
    try {
      const response = await $apiFetch(`/users/${id}`, {
        method: 'DELETE',
      })
      await fetchUsers() // Refresh the list after deletion
      return response
    }
    catch (error) {
      console.error('Delete user error:', error)
      throw error
    }
  }

  async function getUser(id: string) {
    try {
      const response = await $apiFetch<User>(`/users/${id}`)
      return response
    }
    catch (error) {
      console.error('Get user error:', error)
      throw error
    }
  }

  return {
    users,
    loading,
    searching,
    error,
    total,
    currentPage: computed(() => Math.floor(currentOffset.value / pageSize.value) + 1),
    pageSize,
    searchQuery,
    fetchUsers,
    onPageChange,
    onPageSizeChange,
    onSearch,
    createUser,
    updateUser,
    deleteUser,
    getUser,
  }
}
