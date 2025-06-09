import type { DashboardData, PropertySearchRequest, Lead } from './types'

// Backend'den gelen PropertySearchRequest verisini Lead formatına dönüştüren adaptör
export function adaptRequestToLead(request: PropertySearchRequest): Lead {
  return {
    id: request.id,
    requestNo: request.requestNo,
    status: request.status,
    createdAt: request.createdAt,
    customer: {
      name: request.customer?.name || 'İsimsiz',
      email: request.customer?.email || 'E-posta Yok',
    },
    // mailLogs'u backend'den almadığımız için geçici bir başlık oluşturuyoruz
    mailLogs: [{ contentTitle: request.notes || 'Talep Notu' }],
  }
}

export async function fetchDashboardData() {
  const { data, error } = await useFetch<DashboardData>('/api/real-estate/dashboard')

  if (error.value) {
    console.error('Error fetching dashboard data:', error.value)
    // Hata durumunda boş veya varsayılan bir yapı döndürebiliriz
    return {
      stats: { totalListings: 0, totalCustomers: 0, activeRequests: 0 },
      leads: [],
    }
  }

  if (data.value) {
    // Gelen veriyi dashboard'un beklediği formata dönüştür
    const leads = data.value.recentRequests.map(adaptRequestToLead)
    return {
      stats: data.value.stats,
      leads,
    }
  }

  // Veri gelmezse varsayılan değerler
  return {
    stats: { totalListings: 0, totalCustomers: 0, activeRequests: 0 },
    leads: [],
  }
} 