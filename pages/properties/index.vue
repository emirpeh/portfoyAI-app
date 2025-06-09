<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useProperties, usePropertyStatuses, useTransactionTypes } from '@/composables/useProperties'
import PropertyDetailSheet from '@/components/properties/PropertyDetailSheet.vue'

definePageMeta({
  layout: 'default',
})

const {
  properties,
  loading,
  error,
  fetchProperties,
  updatePropertyStatus,
} = useProperties()

const { propertyStatuses } = usePropertyStatuses()
const { transactionTypes } = useTransactionTypes()

const searchQuery = ref('')

const isSheetOpen = ref(false)
const selectedPropertyId = ref<string | null>(null)

function viewPropertyDetails(id: string) {
  selectedPropertyId.value = id
  isSheetOpen.value = true
}

const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'ACTIVE':
    case 'RENTED':
      return 'default'
    case 'INACTIVE':
    case 'PROCESSING':
      return 'secondary'
    case 'SOLD':
      return 'destructive'
    default:
      return 'outline'
  }
}

const filtered = computed(() => {
  let tempProperties = properties.value

  if (searchQuery.value) {
    tempProperties = tempProperties.filter(p =>
      (p.title?.toLowerCase() || '').includes(searchQuery.value.toLowerCase())
      || p.listingNo.toLowerCase().includes(searchQuery.value.toLowerCase())
      || p.seller.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  return tempProperties
})

onMounted(fetchProperties)
</script>

<template>
  <div class="flex flex-col gap-4">
    <header class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">
        İlanlar
      </h1>
      <Button>Yeni İlan Ekle</Button>
    </header>

    <Card>
      <CardHeader>
        <CardTitle>İlan Listesi</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="mb-4 flex gap-4">
          <Input v-model="searchQuery" placeholder="Ara (İlan No, Başlık, Satıcı)..." class="max-w-sm" />
          <!-- Diğer filtreler buraya eklenebilir -->
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>İlan No</TableHead>
              <TableHead>Başlık</TableHead>
              <TableHead>Satıcı</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Fiyat</TableHead>
              <TableHead class="text-right">
                İşlemler
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <tr v-if="loading">
              <td colspan="6" class="text-center">
                Yükleniyor...
              </td>
            </tr>
            <tr v-else-if="error">
              <td colspan="6" class="text-center text-red-500">
                Hata: {{ error }}
              </td>
            </tr>
            <tr v-else-if="properties.length === 0">
              <td colspan="6" class="text-center">
                Sonuç bulunamadı.
              </td>
            </tr>
            <TableRow v-for="p in filtered" :key="p.id">
              <TableCell>
                <span
                  class="cursor-pointer font-medium hover:underline"
                  @click="viewPropertyDetails(p.id)"
                >{{ p.listingNo }}</span>
              </TableCell>
              <TableCell>{{ p.title }}</TableCell>
              <TableCell>{{ p.seller.name }}</TableCell>
              <TableCell>
                <Badge :variant="getStatusVariant(p.status)">
                  {{ p.status }}
                </Badge>
              </TableCell>
              <TableCell>{{ new Intl.NumberFormat('tr-TR', { style: 'currency', currency: p.currency }).format(p.price) }}</TableCell>
              <TableCell class="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon">
                      <Icon name="lucide:more-horizontal" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem @click="viewPropertyDetails(p.id)">
                      Detayları Görüntüle
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                     <template v-for="status in propertyStatuses" :key="status.value">
                       <DropdownMenuItem
                         v-if="p.status !== status.value"
                         @click="updatePropertyStatus(p.id, status.value as 'ACTIVE' | 'INACTIVE' | 'SOLD' | 'RENTED' | 'PROCESSING')"
                       >
                         {{ status.label }} Olarak İşaretle
                       </DropdownMenuItem>
                     </template>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    <PropertyDetailSheet v-model:open="isSheetOpen" :property-id="selectedPropertyId || undefined" />
  </div>
</template>
