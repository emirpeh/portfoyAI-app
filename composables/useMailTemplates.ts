import { useNuxtApp } from '#app'

interface SupplierContact {
  name: string
  email: string
  companyName: string
  gender: string
}

interface CalculatedPriceTemplateRequest {
  language: string
  offerNo: string
  supplierContact: SupplierContact
  details: {
    originalPrice: string
    calculatedPrice: string
    rate: string
    profitMargin: string
  }
}

interface RequestPriceTemplateRequest {
  language: string
  offerNo: string
  supplierContact: SupplierContact
  details?: Record<string, any>
  deadline?: string
}

interface TemplateResponse {
  title: string
  content: string
}

export function useMailTemplates() {
  const { $apiFetch } = useNuxtApp()
  async function getCalculatedPriceTemplate(params: CalculatedPriceTemplateRequest): Promise<TemplateResponse> {
    const data = await $apiFetch('/mails/templates/calculated-price', {
      method: 'POST',
      body: params,
    })
    return data as TemplateResponse
  }

  async function getRequestPriceTemplate(params: RequestPriceTemplateRequest): Promise<TemplateResponse> {
    const data = await $apiFetch('/mails/templates/request-price', {
      method: 'POST',
      body: params,
    })
    return data as TemplateResponse
  }

  return {
    getCalculatedPriceTemplate,
    getRequestPriceTemplate,
  }
}
