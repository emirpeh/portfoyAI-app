<script lang="ts" setup>
import { useBuyers } from '@/composables/useBuyers'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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

async function handleDelete(id: string) {
  if (confirm('Bu alıcıyı silmek istediğinizden emin misiniz?')) {
    await deleteBuyer(id)
    fetchBuyers(currentPage.value)
  }
}

onMounted(() => {
  fetchBuyers()
})
</script>

<template>
  <div class="flex items-center gap-4">
    <h1 class="text-lg font-semibold md:text-2xl">
      Alıcılar
    </h1>
    <div class="ml-auto flex items-center gap-2">
      <Button>Yeni Alıcı Ekle</Button>
    </div>
  </div>

  <Card>
    <CardHeader>
      <CardTitle>Alıcı Listesi</CardTitle>
      <CardDescription>Potansiyel alıcıları buradan yönetebilirsiniz.</CardDescription>
      <div class="mt-4 flex items-center justify-end">
        <Input
          class="max-w-sm"
          placeholder="İsme, e-postaya göre ara..."
          :model-value="searchQuery"
          @update:model-value="(payload) => onSearch(String(payload))"
        />
      </div>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ad Soyad</TableHead>
            <TableHead>E-posta</TableHead>
            <TableHead class="hidden md:table-cell">Telefon</TableHead>
            <TableHead class="hidden md:table-cell">Şirket/Şehir</TableHead>
            <TableHead class="w-[100px] text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="loading">
            <TableCell colspan="5" class="py-12 text-center">
              <p>Yükleniyor...</p>
            </TableCell>
          </TableRow>
          <TableRow v-else-if="error">
            <TableCell colspan="5" class="py-12 text-center text-destructive">
              <p>Hata: {{ error }}</p>
            </TableCell>
          </TableRow>
          <TableRow v-else-if="buyers.length === 0">
            <TableCell colspan="5" class="py-12 text-center">
              <p class="font-semibold">Sonuç Bulunamadı</p>
              <p class="text-sm text-muted-foreground">Henüz sisteme eklenmiş bir alıcı yok.</p>
            </TableCell>
          </TableRow>
          <template v-else>
            <TableRow v-for="buyer in buyers" :key="buyer.id">
              <TableCell class="font-medium">{{ buyer.name }}</TableCell>
              <TableCell>{{ buyer.email }}</TableCell>
              <TableCell class="hidden md:table-cell">{{ buyer.phone || '-' }}</TableCell>
              <TableCell class="hidden md:table-cell">{{ buyer.company || '-' }}</TableCell>
              <TableCell class="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon">
                      <Icon name="lucide:more-horizontal" class="h-4 w-4" />
                      <span class="sr-only">Menüyü aç</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Eylemler</DropdownMenuLabel>
                    <DropdownMenuItem>Detayları Görüntüle</DropdownMenuItem>
                    <DropdownMenuItem @click="handleDelete(buyer.id)" class="text-destructive">
                      Alıcıyı Sil
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </CardContent>
    <CardFooter>
      <div class="flex w-full items-center justify-between">
        <p class="text-sm text-muted-foreground">
          Toplam {{ total }} alıcı.
        </p>
        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage === 1"
            @click="fetchBuyers(currentPage - 1, pageSize)"
          >
            Önceki
          </Button>
          <span class="text-sm">Sayfa {{ currentPage }}</span>
          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage * pageSize >= total"
            @click="fetchBuyers(currentPage + 1, pageSize)"
          >
            Sonraki
          </Button>
        </div>
      </div>
    </CardFooter>
  </Card>
</template>
