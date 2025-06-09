<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchAllLeads } from '@/lib/api'
import type { Lead } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Home, Wallet, Calendar, ArrowRight } from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
})

const leads = ref<Lead[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const router = useRouter()

const statusVariant = (status: string | undefined) => {
  if (!status) return 'secondary'
  switch (status) {
    case 'ACTIVE': return 'secondary'
    case 'PENDING': return 'outline'
    case 'CLOSED': return 'default'
    case 'REJECTED':return 'destructive'
    default: return 'secondary'
  }
}

const navigateToLead = (id: string) => {
  router.push(`/leads/${id}`)
}

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    leads.value = await fetchAllLeads()
  } catch (e: any) {
    error.value = e.message || 'Talepler yüklenirken bir hata oluştu.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
    <div class="flex items-center">
      <div>
        <h1 class="text-2xl font-bold">Alıcı Talepleri</h1>
        <p class="text-muted-foreground">Tüm aktif ve geçmiş alıcı taleplerini buradan yönetin.</p>
      </div>
    </div>

    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <p>Talepler yükleniyor...</p>
    </div>

    <div v-else-if="error">
       <Alert variant="destructive">
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>
            {{ error }}
          </AlertDescription>
        </Alert>
    </div>

    <div v-else-if="leads.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card v-for="lead in leads" :key="lead.id" class="flex flex-col">
          <CardHeader>
             <div class="flex items-start">
                <div class="flex-1">
                    <CardTitle class="text-lg">{{ lead.customer.name }}</CardTitle>
                    <CardDescription>Talep No: {{ lead.requestNo }}</CardDescription>
                </div>
                 <Badge :variant="statusVariant(lead.status)">{{ lead.status }}</Badge>
             </div>
          </CardHeader>
          <CardContent class="grid gap-4 text-sm flex-1">
            <div class="grid grid-cols-[25px_1fr] items-start pb-4 last:pb-0 last:border-0">
                <Home class="h-5 w-5" />
                <div class="grid gap-1">
                    <p class="font-medium"> {{ lead.transactionType === 'SALE' ? 'Satılık' : 'Kiralık' }} - {{ lead.details?.propertyTypes?.join(', ') || 'Belirtilmemiş' }}</p>
                    <p class="text-muted-foreground">{{ lead.details?.locations?.join(', ') || 'Konum Belirtilmemiş' }}</p>
                </div>
            </div>
             <div class="grid grid-cols-[25px_1fr] items-start pb-4 last:pb-0 last:border-0">
                <Wallet class="h-5 w-5" />
                <div class="grid gap-1">
                    <p class="font-medium">Bütçe</p>
                    <p class="text-muted-foreground">{{ lead.details?.minBudget && lead.details?.maxBudget ? `${new Intl.NumberFormat('tr-TR').format(lead.details.minBudget)} - ${new Intl.NumberFormat('tr-TR').format(lead.details.maxBudget)}` : 'Belirtilmemiş' }}</p>
                </div>
            </div>
            <div class="grid grid-cols-[25px_1fr] items-start">
                <Calendar class="h-5 w-5" />
                 <div class="grid gap-1">
                    <p class="font-medium">Tarih</p>
                    <p class="text-muted-foreground">{{ new Date(lead.createdAt).toLocaleDateString('tr-TR') }}</p>
                </div>
            </div>
          </CardContent>
          <div class="p-4 pt-0 mt-auto">
             <Button @click="navigateToLead(lead.id)" class="w-full">
                Detayları Gör <ArrowRight class="ml-2 h-4 w-4" />
             </Button>
          </div>
        </Card>
    </div>

    <div v-else class="text-center py-10 rounded-lg border-2 border-dashed border-gray-300">
      <h3 class="text-xl font-semibold">Henüz Alıcı Talebi Yok</h3>
      <p class="text-muted-foreground mt-2">Sisteme yeni alıcı talepleri eklendiğinde burada görünecektir.</p>
    </div>
  </div>
</template> 