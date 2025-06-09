<script lang="ts" setup>
import { ref, watch } from 'vue'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useProperties } from '@/composables/useProperties'
import type { Property } from '@/lib/types'

const props = defineProps({
  propertyId: {
    type: String,
    default: null,
  },
  open: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:open'])

const localOpen = ref(props.open)
const property = ref<Property | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const { fetchPropertyById } = useProperties()

watch(() => props.propertyId, async (newId) => {
  if (newId) {
    loading.value = true
    error.value = null
    try {
      property.value = await fetchPropertyById(newId)
    } catch (e: any) {
      error.value = 'İlan detayları yüklenirken bir hata oluştu.'
      console.error(e);
    } finally {
      loading.value = false
    }
  }
}, { immediate: true })

watch(() => props.open, (newVal) => {
  localOpen.value = newVal
})

function onUpdateOpen(value: boolean) {
  emit('update:open', value)
  if (!value) {
    property.value = null
    error.value = null
  }
}

const statusMap: { [key: string]: { text: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } } = {
  ACTIVE: { text: 'Aktif', variant: 'secondary' },
  INACTIVE: { text: 'Pasif', variant: 'outline' },
  SOLD: { text: 'Satıldı', variant: 'destructive' },
  RENTED: { text: 'Kiralandı', variant: 'default' },
  PROCESSING: { text: 'İşleniyor', variant: 'outline' },
}

const getStatusInfo = (status: string) => statusMap[status] || { text: status, variant: 'secondary' }
</script>

<template>
  <Sheet :open="localOpen" @update:open="onUpdateOpen">
    <SheetContent class="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl overflow-y-auto">
      <SheetHeader>
        <SheetTitle>İlan Detayları</SheetTitle>
        <SheetDescription>
          Seçilen ilanın tüm detaylarını burada görebilirsiniz.
        </SheetDescription>
      </SheetHeader>
      
      <div v-if="loading" class="py-10 text-center">
        <p>Yükleniyor...</p>
      </div>
      <div v-else-if="error" class="py-10 text-center text-red-500">
        <p>{{ error }}</p>
      </div>
      <div v-else-if="property" class="grid gap-6 py-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <h3 class="text-lg font-bold">{{ property.title }}</h3>
              <div class="flex items-center gap-2">
                <Badge :variant="getStatusInfo(property.status).variant">{{ getStatusInfo(property.status).text }}</Badge>
                <span class="text-muted-foreground">·</span>
                <span class="font-semibold">{{ property.transactionType === 'SALE' ? 'Satılık' : 'Kiralık' }}</span>
              </div>
              <p class="text-muted-foreground">{{ property.description || 'Açıklama mevcut değil.' }}</p>
            </div>
            <div class="bg-muted/40 p-4 rounded-lg space-y-2">
              <div class="flex justify-between">
                <span class="text-muted-foreground">İlan No:</span>
                <span class="font-mono">{{ property.listingNo }}</span>
              </div>
               <div class="flex justify-between">
                <span class="text-muted-foreground">Fiyat:</span>
                <span class="font-semibold text-lg">{{ new Intl.NumberFormat('tr-TR', { style: 'currency', currency: property.currency }).format(property.price) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Konum:</span>
                <span>{{ property.location }}</span>
              </div>
            </div>
        </div>

        <div class="border-t pt-6">
            <h4 class="font-semibold mb-4">Satıcı Bilgileri</h4>
            <div class="flex items-center gap-4">
                 <div>
                    <p class="font-medium">{{ property.seller?.name || 'İsim Belirtilmemiş' }}</p>
                    <p class="text-sm text-muted-foreground">{{ property.seller?.email || 'E-posta Belirtilmemiş' }}</p>
                 </div>
            </div>
        </div>
      </div>
       <SheetFooter class="mt-4">
          <Button variant="outline" @click="onUpdateOpen(false)">
            Kapat
          </Button>
       </SheetFooter>
    </SheetContent>
  </Sheet>
</template> 