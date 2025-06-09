<script lang="ts" setup>
import { useProperties, usePropertyFilters } from '@/composables/useProperties'

definePageMeta({
  layout: 'default',
})

const {
  properties,
  loading,
  error,
  total,
  currentPage,
  pageSize,
  searchQuery,
  statusFilter,
  transactionTypeFilter,
  fetchProperties,
  onPageChange,
  onSearch,
  onFilterChange,
  deleteProperty,
  updatePropertyStatus,
} = useProperties()

const { transactionTypes, listingStatuses } = usePropertyFilters()

const columns = [
  { key: 'listingNo', label: 'İlan No' },
  { key: 'title', label: 'Başlık' },
  { key: 'status', label: 'Durum' },
  { key: 'transactionType', label: 'İşlem Tipi' },
  { key: 'location', label: 'Konum' },
  { key: 'price', label: 'Fiyat' },
  { key: 'seller', label: 'Satıcı' },
  { key: 'actions', label: 'İşlemler' },
]

async function handleDelete(id: string) {
  if (confirm('Bu ilanı silmek istediğinizden emin misiniz?')) {
    await deleteProperty(id).catch((err) => {
      // Hata UI'da gösterilebilir, örneğin bir toast notification ile
      console.error('Silme işlemi başarısız oldu:', err.message)
    })
  }
}

onMounted(() => {
  fetchProperties()
})
</script>

<template>
  <div class="h-full flex flex-col p-4 sm:p-6">
    <div class="mb-4">
      <h1 class="text-2xl font-bold">
        Portföy
      </h1>
      <p class="text-muted-foreground">
        Tüm emlak ilanlarını buradan yönetebilirsiniz.
      </p>
    </div>

    <div class="mb-4 flex flex-wrap items-center justify-between gap-4">
      <Input
        class="max-w-sm"
        placeholder="Başlık, konum, ilan no ara..."
        :model-value="searchQuery"
        @update:model-value="(payload) => onSearch(String(payload))"
      />
      <div class="flex flex-wrap gap-4">
        <Select v-model="transactionTypeFilter" @update:model-value="onFilterChange">
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="İşlem Tipine Göre Filtrele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">
              Tümü
            </SelectItem>
            <SelectItem v-for="item in transactionTypes" :key="item.value" :value="item.value">
              {{ item.label }}
            </SelectItem>
          </SelectContent>
        </Select>
        <Select v-model="statusFilter" @update:model-value="onFilterChange">
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Duruma Göre Filtrele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">
              Tümü
            </SelectItem>
            <SelectItem v-for="item in listingStatuses" :key="item.value" :value="item.value">
              {{ item.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <p>Yükleniyor...</p>
    </div>
    <div v-else-if="error" class="flex-1 flex items-center justify-center text-red-500">
      <p>{{ error }}</p>
    </div>
    <div v-else class="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead v-for="column in columns" :key="column.key">
              {{ column.label }}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="properties.length">
            <TableRow v-for="prop in properties" :key="prop.id">
              <TableCell>{{ prop.listingNo }}</TableCell>
              <TableCell>{{ prop.title }}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" class="p-0 h-auto">
                      <UBadge :color="prop.status === 'SOLD' || prop.status === 'RENTED' ? 'red' : 'green'" variant="soft" class="cursor-pointer">
                        {{ prop.status }}
                      </UBadge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel>Durumu Değiştir</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem v-for="s in listingStatuses" :key="s.value" @click="updatePropertyStatus(prop.id, s.value as any)">
                      <span>{{ s.label }}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>{{ prop.transactionType }}</TableCell>
              <TableCell>{{ prop.location }}</TableCell>
              <TableCell>{{ new Intl.NumberFormat('tr-TR', { style: 'currency', currency: prop.currency }).format(prop.price) }}</TableCell>
              <TableCell>{{ prop.seller.name }}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" class="h-8 w-8 p-0">
                      <span class="sr-only">Menüyü aç</span>
                      <i class="i-lucide-ellipsis h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                    <DropdownMenuItem @click="handleDelete(prop.id)">
                      Sil
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </template>
          <TableRow v-else>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              Filtrelerinize uygun sonuç bulunamadı.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="mt-4 flex items-center justify-between">
      <p class="text-sm text-muted-foreground">
        Toplam {{ total }} ilan.
      </p>
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          :disabled="currentPage === 1"
          @click="onPageChange(currentPage - 1)"
        >
          Önceki
        </Button>
        <span>Sayfa {{ currentPage }}</span>
        <Button
          variant="outline"
          :disabled="currentPage * pageSize >= total"
          @click="onPageChange(currentPage + 1)"
        >
          Sonraki
        </Button>
      </div>
    </div>
  </div>
</template>
