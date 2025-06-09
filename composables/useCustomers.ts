import { ref, computed } from 'vue'
import type { Customer } from '~/lib/types' // Genel Customer tipini import ediyoruz

// Yerel, tutarsız interfaceler kaldırıldı.

interface BackendResponse {
  data: Customer[]
  pagination: {
    total: number
    limit: number
    offset: number
  }
}

export function useCustomers() {
  const { $apiFetch } = useNuxtApp()
  const customers = ref<Customer[]>([])
  const loading = ref(false)
  const searching = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const searchQuery = ref('')

  async function fetchCustomers(page = currentPage.value, limit = pageSize.value, search = searchQuery.value, isSearching = false) {
    if (isSearching) {
      searching.value = true
    }
    else {
      loading.value = true
    }
    error.value = null

    try {
      const offset = (page - 1) * limit
      const query: Record<string, any> = {
        limit,
        offset,
      }

      if (search?.trim()) {
        query.name = search.trim()
      }

      const response = await $apiFetch<BackendResponse>('/api/customers', { // Endpoint güncellendi
        query,
      })

      customers.value = response.data
      total.value = response.pagination.total // Yanıt yapısı güncellendi
      currentPage.value = page
      pageSize.value = limit
      searchQuery.value = search
    }
    catch (err: any) {
      console.error('Error fetching customers:', err)
      error.value = err.message || 'Müşteriler getirilirken bir hata oluştu.'
    }
    finally {
      loading.value = false
      searching.value = false
    }
  }

  function onSearch(search: string) {
    searchQuery.value = search
    fetchCustomers(1, pageSize.value, search, true)
  }

  function onPageChange(page: number) {
    fetchCustomers(page, pageSize.value, searchQuery.value)
  }

  function onPageSizeChange(limit: number) {
    pageSize.value = limit
    fetchCustomers(1, limit, searchQuery.value)
  }

  async function deleteCustomer(id: string) {
    try {
      await $apiFetch(`/api/customers/${id}`, { // Endpoint güncellendi
        method: 'DELETE',
      })
      await fetchCustomers(currentPage.value, pageSize.value, searchQuery.value)
    }
    catch (err: any) {
      console.error('Error deleting customer:', err)
      throw err
    }
  }

  // createCustomer fonksiyonu projenin DTO'su ile uyumlu hale getirilmeli.
  // Şimdilik genel bir Customer objesi alacak şekilde basitleştiriyoruz.
  // Not: Backend'deki CreateCustomerDto, frontend'deki Customer tipinden farklı olabilir.
  async function createCustomer(customer: Partial<Customer>) {
    return $apiFetch('/api/customers', { // Endpoint güncellendi
      method: 'POST',
      body: customer,
    })
  }

  return {
    customers,
    loading,
    searching,
    error,
    total,
    currentPage: computed(() => currentPage.value),
    pageSize: computed(() => pageSize.value),
    searchQuery,
    fetchCustomers,
    onPageChange,
    onPageSizeChange,
    onSearch,
    deleteCustomer,
    createCustomer,
  }
} 