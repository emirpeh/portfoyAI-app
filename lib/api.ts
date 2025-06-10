import type { DashboardData, PropertySearchRequest, Lead, DashboardStats, Property } from './types'

// Backend'den gelen PropertySearchRequest verisini Lead formatına dönüştüren adaptör
export function adaptRequestToLead(request: PropertySearchRequest | any): Lead {
  if (!request) {
    throw new Error('Invalid request format')
  }

  if (!request.customer) {
    throw new Error('PropertySearchRequest is missing customer data.')
  }

  return {
    id: request.id,
    requestNo: request.requestNo,
    status: request.status,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt || request.createdAt,
    transactionType: request.transactionType,
    customer: request.customer,
    notes: request.notes,
    mailLogs: [{ contentTitle: request.notes || 'Talep Notu' }],
    // Backend'den gelen düz veri yapısını frontend'in beklediği 'details' nesnesine dönüştür.
    details: {
      propertyTypes: request.propertyTypes,
      locations: request.locations,
      roomCount: request.minRooms ? [String(request.minRooms)] : undefined,
      minBudget: request.minPrice,
      maxBudget: request.maxPrice,
      features: request.requiredFeatures,
    },
  }
}

export async function fetchDashboardData(): Promise<{ leads: Lead[]; stats: DashboardStats; recentActivities: Property[] }> {
  const { $apiFetch } = useNuxtApp()
  try {
    const dashboardData = await $apiFetch<{ leads: Lead[]; stats: DashboardStats; recentActivities: Property[] }>('/api/real-estate/dashboard')

    if (!dashboardData) {
      console.error('Error fetching dashboard data: no data returned')
      throw new Error('Dashboard verileri alınamadı.')
    }
    
    // API'den gelen verinin formatını doğrulayıp döndürüyoruz.
    // Başarılı durumda dashboardData'nın doğrudan { leads, stats } yapısında olduğunu varsayıyoruz.
    return dashboardData
  }
  catch (err) {
    // Hata yönetimi
    console.error(err)
    // Boş veya varsayılan bir durum döndür
    return {
      leads: [],
      stats: { totalListings: 0, totalCustomers: 0, activeRequests: 0 },
      recentActivities: [],
    }
  }
}

export async function createBuyerRequest(payload: any) {
  const { $apiFetch } = useNuxtApp()
  try {
    const response = await $apiFetch('/api/property-search-requests', {
      method: 'POST',
      body: payload,
    })
    return response
  }
  catch (error) {
    console.error('Error creating buyer request:', error)
    throw error
  }
}

export async function fetchAllLeads(): Promise<Lead[]> {
  const { $apiFetch } = useNuxtApp()
  try {
    const response = await $apiFetch<{ data: any[] }>('/api/property-search-requests')
    // Gelen verinin ve 'data' alanının varlığını ve 'data'nın bir dizi olduğunu kontrol et
    if (!response || !Array.isArray(response.data)) {
      console.warn('fetchAllLeads received an unexpected response format:', response)
      return []
    }
    // Gelen her bir isteği Lead formatına çevir, müşterisi olmayanları atla
    return response.data
      .filter(request => request.customer) // Müşterisi olanları filtrele
      .map(request => adaptRequestToLead(request))
  }
  catch (error) {
    console.error('Error fetching all leads:', error)
    return []
  }
} 