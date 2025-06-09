<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLead } from '@/composables/useLead'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Home, Wallet, Calendar, ArrowRight } from 'lucide-vue-next'

const props = defineProps({
  leadId: {
    type: String,
    required: true,
  },
})

const router = useRouter()
const { lead, loading, error, fetchLead } = useLead(props.leadId)

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

const navigateToLead = (id: string) => {
  router.push(`/leads/${id}`)
}

onMounted(fetchLead)
</script>

<template>
  <Card v-if="lead" class="flex flex-col">
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
  <div v-else-if="loading" class="p-4 text-center">Yükleniyor...</div>
  <div v-else-if="error" class="p-4 text-red-500 text-center">Hata: {{ error }}</div>
</template> 