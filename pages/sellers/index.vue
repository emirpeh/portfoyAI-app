<script lang="ts" setup>
import { useSellers } from '@/composables/useSellers'

definePageMeta({
  layout: 'default',
})

const {
  sellers,
  loading,
  error,
  total,
  currentPage,
  pageSize,
  fetchSellers,
  onSearch,
  searchQuery,
  deleteSeller,
} = useSellers()

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Ad Soyad' },
  { key: 'email', label: 'E-posta' },
  { key: 'phone', label: 'Telefon' },
  { key: 'company', label: 'Şirket/Şehir' },
  { key: 'actions', label: 'İşlemler' },
]

async function handleDelete(id: string) {
  if (confirm('Bu satıcıyı silmek istediğinizden emin misiniz?')) {
    await deleteSeller(id)
    // Silme sonrası liste useSellers içinde otomatik yenileniyor
  }
}

onMounted(() => {
  fetchSellers()
})
</script>

<template>
  <div class="h-full flex flex-col p-4 sm:p-6">
    <div class="mb-4">
      <h1 class="text-2xl font-bold">
        Satıcılar
      </h1>
      <p class="text-muted-foreground">
        Potansiyel satıcıları buradan yönetebilirsiniz.
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
          <template v-if="sellers.length">
            <TableRow v-for="seller in sellers" :key="seller.id">
              <TableCell>{{ seller.id }}</TableCell>
              <TableCell>
                 <NuxtLink :to="`/sellers/${seller.id}`" class="text-primary hover:underline">
                  {{ seller.name }}
                 </NuxtLink>
              </TableCell>
              <TableCell>{{ seller.email }}</TableCell>
              <TableCell>{{ seller.phone || '-' }}</TableCell>
              <TableCell>{{ seller.company || '-' }}</TableCell>
              <TableCell>
                <div class="flex items-center gap-2">
                   <Button variant="outline" size="sm" as-child>
                    <NuxtLink :to="`/sellers/${seller.id}`">
                      Detay
                    </NuxtLink>
                  </Button>
                  <Button variant="destructive" size="sm" @click="handleDelete(seller.id)">
                    Sil
                  </Button>
                </div>
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
        Toplam {{ total }} satıcı.
      </p>
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          :disabled="currentPage === 1"
          @click="fetchSellers(currentPage - 1, pageSize)"
        >
          Önceki
        </Button>
        <span>Sayfa {{ currentPage }}</span>
        <Button
          variant="outline"
          :disabled="currentPage * pageSize >= total"
          @click="fetchSellers(currentPage + 1, pageSize)"
        >
          Sonraki
        </Button>
      </div>
    </div>
  </div>
</template>
