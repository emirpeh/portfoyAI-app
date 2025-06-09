<script lang="ts" setup>
import { useProperty, type Property } from '@/composables/useProperty'

const route = useRoute()
const {
  property,
  loading,
  error,
  fetchProperty,
  getPropertyFiles,
  downloadFile,
} = useProperty(route.params.id as string)

const files = ref<any[]>([])

onMounted(async () => {
  await fetchProperty()
  files.value = await getPropertyFiles()
})
</script>

<template>
  <div class="container mx-auto p-4 sm:p-6">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <p>Yükleniyor...</p>
    </div>
    <div v-else-if="error" class="text-red-500 text-center">
      <p>İlan yüklenirken bir hata oluştu: {{ error.message }}</p>
    </div>
    <div v-else-if="property">
      <div class="bg-card shadow-lg rounded-lg overflow-hidden">
        <div class="p-6">
          <h1 class="text-3xl font-bold mb-2">{{ property.title }}</h1>
          <p class="text-muted-foreground mb-4">{{ property.city }}, {{ property.address }}</p>

          <div class="flex items-center justify-between mb-4">
            <span class="text-2xl font-bold text-primary">{{ new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(property.price) }}</span>
            <Badge :variant="property.status === 'SALE' ? 'default' : 'secondary'">
              {{ property.status === 'SALE' ? 'Satılık' : 'Kiralık' }}
            </Badge>
          </div>

          <p class="text-card-foreground mb-6">{{ property.description }}</p>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-6">
            <div class="bg-muted p-3 rounded-md">
              <p class="text-sm text-muted-foreground">Oda Sayısı</p>
              <p class="font-bold">{{ property.bedrooms }}</p>
            </div>
            <div class="bg-muted p-3 rounded-md">
              <p class="text-sm text-muted-foreground">Banyo Sayısı</p>
              <p class="font-bold">{{ property.bathrooms }}</p>
            </div>
            <div class="bg-muted p-3 rounded-md">
              <p class="text-sm text-muted-foreground">Alan</p>
              <p class="font-bold">{{ property.area }} m²</p>
            </div>
            <div class="bg-muted p-3 rounded-md">
              <p class="text-sm text-muted-foreground">Tür</p>
              <p class="font-bold">{{ property.type }}</p>
            </div>
          </div>

          <div v-if="files.length > 0">
            <h2 class="text-xl font-semibold mb-3">Dosyalar</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Card v-for="file in files" :key="file.id">
                <CardHeader>
                  <CardTitle class="text-base">{{ file.name }}</CardTitle>
                </CardHeader>
                <CardFooter>
                  <Button @click="downloadFile(file.url, file.name)">İndir</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
