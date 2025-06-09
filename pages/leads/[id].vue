<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLead } from '@/composables/useLead'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CircleUserRound, Home, Wallet, Tag, Calendar, NotebookText } from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const leadId = route.params.id as string

const { lead, loading, error, fetchLead } = useLead(leadId)

const statusVariant = (status: string | undefined) => {
  if (!status) return 'secondary'
  switch (status) {
    case 'ACTIVE': return 'secondary'
    case 'PENDING': return 'outline'
    case 'CLOSED': return 'default'
    case 'REJECTED': return 'destructive'
    default: return 'secondary'
  }
}

onMounted(fetchLead)
</script>

<template>
  <div class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <p>Talep detayları yükleniyor...</p>
    </div>
    <div v-else-if="error">
       <Alert variant="destructive">
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>
            Talep detayları yüklenirken bir sorun oluştu: {{ error }}
          </AlertDescription>
        </Alert>
    </div>
    <div v-else-if="lead" class="grid gap-6">
      <div class="flex items-center">
        <div>
          <h1 class="text-2xl font-bold">Talep Detayları</h1>
          <p class="text-muted-foreground">Talep No: {{ lead.requestNo }}</p>
        </div>
        <div class="ml-auto">
           <Badge :variant="statusVariant(lead.status)" class="text-base px-4 py-2">{{ lead.status }}</Badge>
        </div>
      </div>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Müşteri Bilgileri -->
        <Card>
          <CardHeader class="flex flex-row items-center gap-4">
            <CircleUserRound class="w-8 h-8" />
            <CardTitle>Müşteri Bilgileri</CardTitle>
          </CardHeader>
          <CardContent class="grid gap-2 text-sm">
            <div class="font-semibold">{{ lead.customer.name }}</div>
            <div>{{ lead.customer.email }}</div>
            <div>Telefon: {{ lead.customer.phone || 'Belirtilmemiş' }}</div>
          </CardContent>
        </Card>

        <!-- Talep Özeti -->
        <Card>
          <CardHeader class="flex flex-row items-center gap-4">
            <Home class="w-8 h-8" />
            <CardTitle>Talep Özeti</CardTitle>
          </CardHeader>
          <CardContent class="grid gap-2 text-sm">
             <div class="flex justify-between"><span>İşlem Tipi:</span> <span class="font-semibold">{{ lead.transactionType === 'SALE' ? 'Satılık' : 'Kiralık' }}</span></div>
             <div class="flex justify-between"><span>Mülk Tipi:</span> <span class="font-semibold">{{ lead.details?.propertyTypes?.join(', ') || 'Belirtilmemiş' }}</span></div>
             <div class="flex justify-between"><span>Oda Sayısı:</span> <span class="font-semibold">{{ lead.details?.roomCount?.join(', ') || 'Belirtilmemiş' }}</span></div>
          </CardContent>
        </Card>
        
        <!-- Konum ve Bütçe -->
         <Card>
          <CardHeader class="flex flex-row items-center gap-4">
            <Wallet class="w-8 h-8" />
            <CardTitle>Konum ve Bütçe</CardTitle>
          </CardHeader>
          <CardContent class="grid gap-2 text-sm">
             <div class="flex justify-between"><span>Konum:</span> <span class="font-semibold">{{ lead.details?.locations?.join(', ') || 'Belirtilmemiş' }}</span></div>
             <div class="flex justify-between"><span>Bütçe:</span> <span class="font-semibold">{{ lead.details?.minBudget }} - {{ lead.details?.maxBudget }}</span></div>
          </CardContent>
        </Card>

        <!-- Diğer Detaylar -->
         <Card class="lg:col-span-2">
          <CardHeader class="flex flex-row items-center gap-4">
            <Tag class="w-8 h-8" />
            <CardTitle>Diğer Kriterler</CardTitle>
          </CardHeader>
          <CardContent class="grid gap-2 text-sm">
             <p>{{ lead.details?.features?.join(', ') || 'Özel bir kriter belirtilmemiş.' }}</p>
          </CardContent>
        </Card>

        <!-- Talep Geçmişi -->
        <Card>
          <CardHeader class="flex flex-row items-center gap-4">
            <Calendar class="w-8 h-8" />
            <CardTitle>Talep Geçmişi</CardTitle>
          </CardHeader>
          <CardContent class="grid gap-2 text-sm">
            <div>Oluşturulma: {{ new Date(lead.createdAt).toLocaleDateString('tr-TR') }}</div>
            <div>Son Güncelleme: {{ new Date(lead.updatedAt).toLocaleDateString('tr-TR') }}</div>
          </CardContent>
        </Card>
        
        <!-- Notlar -->
        <Card class="md:col-span-2 lg:col-span-3">
          <CardHeader class="flex flex-row items-center gap-4">
            <NotebookText class="w-8 h-8" />
            <CardTitle>Notlar</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm">{{ lead.notes || 'Bu talep için özel bir not bulunmamaktadır.' }}</p>
          </CardContent>
        </Card>

      </div>
    </div>
     <div v-else class="text-center py-10">
      <p>Talep bulunamadı.</p>
    </div>
  </div>
</template>