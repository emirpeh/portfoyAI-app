<script lang="ts" setup>
import { useBuyers } from '@/composables/useBuyers'

definePageMeta({
  layout: 'default',
})

const {
  buyers,
  loading,
  error,
  total,
  currentPage,
  pageSize,
  fetchBuyers,
  onSearch,
  searchQuery,
  deleteBuyer,
} = useBuyers()

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Ad Soyad' },
  { key: 'email', label: 'E-posta' },
  { key: 'phone', label: 'Telefon' },
  { key: 'company', label: 'Şirket/Şehir' },
  { key: 'actions', label: 'İşlemler' },
]

async function handleDelete(id: string) {
  if (confirm('Bu alıcıyı silmek istediğinizden emin misiniz?')) {
    await deleteBuyer(id)
    fetchBuyers()
  }
}

onMounted(() => {
  fetchBuyers()
})
</script>

<template>
  <div class="h-full flex flex-col p-4 sm:p-6">
    <div class="mb-4">
      <h1 class="text-2xl font-bold">
        Alıcılar
      </h1>
      <p class="text-muted-foreground">
        Potansiyel alıcıları buradan yönetebilirsiniz.
      </p>
    </div>

    <div class="mb-4 flex items-center justify-between gap-4">
      <Input
        class="max-w-sm"
        placeholder="İsme göre ara..."
        :model-value="searchQuery"
        @update:model-value="(payload) => onSearch(String(payload))"
      />
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
          <template v-if="buyers.length">
            <TableRow v-for="buyer in buyers" :key="buyer.id">
              <TableCell>{{ buyer.id }}</TableCell>
              <TableCell>{{ buyer.name }}</TableCell>
              <TableCell>{{ buyer.email }}</TableCell>
              <TableCell>{{ buyer.phone || '-' }}</TableCell>
              <TableCell>{{ buyer.company || '-' }}</TableCell>
              <TableCell>
                <Button variant="destructive" size="sm" @click="handleDelete(buyer.id)">
                  Sil
                </Button>
              </TableCell>
            </TableRow>
          </template>
          <TableRow v-else>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              Sonuç bulunamadı.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="mt-4 flex items-center justify-between">
      <p class="text-sm text-muted-foreground">
        Toplam {{ total }} alıcı.
      </p>
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          :disabled="currentPage === 1"
          @click="fetchBuyers(currentPage - 1, pageSize)"
        >
          Önceki
        </Button>
        <span>Sayfa {{ currentPage }}</span>
        <Button
          variant="outline"
          :disabled="currentPage * pageSize >= total"
          @click="fetchBuyers(currentPage + 1, pageSize)"
        >
          Sonraki
        </Button>
      </div>
    </div>
  </div>
</template>
