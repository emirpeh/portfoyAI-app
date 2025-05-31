import { ref } from 'vue'

interface Configuration {
  rate: string
  profitMargin: string
  isEnabled: boolean
}

export function useConfiguration() {
  const configuration = ref<Configuration | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchConfiguration() {
    try {
      loading.value = true
      const { $apiFetch } = useNuxtApp()

      const response = await $apiFetch<Configuration>('/offers/configuration')
      configuration.value = response
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : 'An error occurred'
    }
    finally {
      loading.value = false
    }
  }

  async function updateConfiguration(newConfig: Configuration) {
    try {
      loading.value = true
      const { $apiFetch } = useNuxtApp()

      const response = await $apiFetch<Configuration>('/offers/configuration', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConfig),
      })
      configuration.value = response
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : 'An error occurred'
    }
    finally {
      loading.value = false
    }
  }

  async function calculateFinalPrice(price: string) {
    const { $apiFetch } = useNuxtApp()
    return await $apiFetch('/offers/calculate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ price }),
    })
  }

  return {
    configuration,
    loading,
    error,
    fetchConfiguration,
    updateConfiguration,
    calculateFinalPrice,
  }
}
