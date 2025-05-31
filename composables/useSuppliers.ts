import { ref } from 'vue'

interface Supplier {
  id: number
  name: string
  email: string
  gender: 'MALE' | 'FEMALE'
  companyName: string
  countries: string
  customs: string
  foreignTrades: string
  language: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

interface Pagination {
  total: number
  page: number
  limit: number
}

interface ApiResponse {
  data: Supplier[]
  pagination: Pagination
}

export function useSuppliers() {
  const suppliers = ref<Supplier[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
  })
  const { $apiFetch } = useNuxtApp()

  async function fetchSuppliers(page = 1, limit = 10) {
    try {
      loading.value = true
      error.value = null
      const response = await $apiFetch(`/suppliers?page=${page}&limit=${limit}`)
      suppliers.value = response.data
      pagination.value = response.pagination
    }
    catch (err: any) {
      console.error('Error fetching suppliers:', err)
      error.value = err.message
    }
    finally {
      loading.value = false
    }
  }

  async function addSupplier(supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>) {
    const { $apiFetch } = useNuxtApp()

    try {
      loading.value = true
      error.value = null
      await $apiFetch('/suppliers', {
        method: 'POST',
        body: {
          ...supplier,
          countries: Array.isArray(supplier.countries) ? supplier.countries : supplier.countries.split(','),
          foreignTrades: Array.isArray(supplier.foreignTrades) ? supplier.foreignTrades : supplier.foreignTrades.split(','),
          customs: Array.isArray(supplier.customs) ? supplier.customs : supplier.customs.split(','),
        },
      })
      await fetchSuppliers(pagination.value.page, pagination.value.limit)
    }
    catch (err: any) {
      console.error('Error adding supplier:', err)
      error.value = err.message
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function updateSupplier(id: number, supplier: Partial<Supplier>) {
    const { $apiFetch } = useNuxtApp()

    try {
      loading.value = true
      error.value = null
      await $apiFetch(`/suppliers/${id}`, {
        method: 'PATCH',
        body: {
          ...supplier,
          countries: supplier.countries ? (Array.isArray(supplier.countries) ? supplier.countries : supplier.countries.split(',')) : undefined,
          foreignTrades: supplier.foreignTrades ? (Array.isArray(supplier.foreignTrades) ? supplier.foreignTrades : supplier.foreignTrades.split(',')) : undefined,
          customs: supplier.customs ? (Array.isArray(supplier.customs) ? supplier.customs : supplier.customs.split(',')) : undefined,
        },
      })
      await fetchSuppliers(pagination.value.page, pagination.value.limit)
    }
    catch (err: any) {
      console.error('Error updating supplier:', err)
      error.value = err.message
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function deleteSupplier(id: number) {
    const { $apiFetch } = useNuxtApp()

    try {
      loading.value = true
      error.value = null
      await $apiFetch(`/suppliers/${id}`, {
        method: 'DELETE',
      })
      await fetchSuppliers(pagination.value.page, pagination.value.limit)
    }
    catch (err: any) {
      console.error('Error deleting supplier:', err)
      error.value = err.message
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function bulkAddSuppliers(suppliers: any[]) {
    const { $apiFetch } = useNuxtApp()
    try {
      loading.value = true
      error.value = null

      const response = await $apiFetch('/suppliers/bulk', {
        method: 'POST',
        body: JSON.stringify({ suppliers }),
        headers: { 'Content-Type': 'application/json' },
      })

      if (response) {
        await fetchSuppliers(pagination.value.page, pagination.value.limit)
      }
    }
    catch (err: any) {
      console.error('Error bulk adding suppliers:', err)
      error.value = err.message
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function fetchSupplier(id: number) {
    try {
      loading.value = true
      error.value = null
      const response = await $apiFetch(`/suppliers/${id}`)
      return response
    }
    catch (err: any) {
      console.error('Error fetching supplier:', err)
      error.value = err.message
      throw err
    }
    finally {
      loading.value = false
    }
  }

  return {
    suppliers,
    loading,
    error,
    pagination,
    fetchSuppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    bulkAddSuppliers,
    fetchSupplier,
  }
}
