import type { Customer } from '~/components/customers/data/schema'
import { computed, ref } from 'vue'

interface PaginatedResponse {
  data: Customer[]
  total: number
}

export function useCustomers() {
  const { $apiFetch } = useNuxtApp()
  const customers = ref<Customer[]>([])
  const loading = ref(false)
  const searching = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const currentOffset = ref(0)
  const pageSize = ref(10)
  const searchQuery = ref('')

  async function fetchCustomers(offset = currentOffset.value, limit = pageSize.value, search = searchQuery.value, isSearching = false) {
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
        query.companyName = search.trim()
      }

      const response = await $apiFetch<PaginatedResponse>('/customers', {
        query,
      })

      customers.value = response.data
      total.value = response.total
      currentOffset.value = offset
      pageSize.value = limit
      searchQuery.value = search
    }
    catch (err: any) {
      console.error('Error fetching customers:', err)
      error.value = err.message
    }
    finally {
      loading.value = false
      searching.value = false
    }
  }

  function onSearch(search: string) {
    searchQuery.value = search
    fetchCustomers(0, pageSize.value, search, true)
  }

  function onPageChange(page: number) {
    const offset = (page - 1) * pageSize.value
    fetchCustomers(offset, pageSize.value)
  }

  function onPageSizeChange(limit: number) {
    fetchCustomers(0, limit)
  }

  async function getCustomerMailList(id: string) {
    loading.value = true
    error.value = null

    const response = await $apiFetch(`/customers/${id}/mail-list`)
    loading.value = false

    return response
  }

  async function deleteCustomer(id: string) {
    loading.value = true
    error.value = null
    await $apiFetch(`/api/customers/${id}`, {
      method: 'DELETE',
    })
    loading.value = false
  }

  return {
    customers,
    loading,
    searching,
    error,
    total,
    currentPage: computed(() => Math.floor(currentOffset.value / pageSize.value) + 1),
    pageSize,
    searchQuery,
    fetchCustomers,
    onPageChange,
    onPageSizeChange,
    onSearch,
    getCustomerMailList,
    deleteCustomer,
  }
}
