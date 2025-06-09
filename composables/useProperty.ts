import { ref } from 'vue'
import type { Property } from './useProperties'

interface PropertyFile {
  id: string
  name: string
  url: string
  type: string
  size: number
  createdAt: string
}

export function useProperty(id: string) {
  const { $apiFetch } = useNuxtApp()
  const property = ref<Property | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function fetchProperty() {
    loading.value = true
    error.value = null

    try {
      const encodedId = encodeURIComponent(id)
      const response = await $apiFetch<Property>(`/properties/${encodedId}`)
      property.value = response
    }
    catch (err) {
      error.value = err as Error
      console.error('Error fetching property:', err)
    }
    finally {
      loading.value = false
    }
  }

  async function getPropertyFiles() {
    try {
      const encodedId = encodeURIComponent(id)
      const files = await $apiFetch<PropertyFile[]>(`/properties/${encodedId}/files`)
      return files
    }
    catch (err) {
      console.error('Error fetching files:', err)
      return []
    }
  }

  async function downloadFile(fileUrl: string, fileName: string) {
    try {
      const response = await fetch(fileUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }
    catch (err) {
      console.error('Error downloading file:', err)
      throw err
    }
  }

  // Fetch property data on creation
  fetchProperty()

  return {
    property,
    loading,
    error,
    fetchProperty,
    getPropertyFiles,
    downloadFile,
  }
}
