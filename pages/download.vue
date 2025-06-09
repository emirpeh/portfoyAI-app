<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '~/composables/useAuth'

// Giriş yapmamış kullanıcılar için blank layout kullanılacak
definePageMeta({
  layout: 'blank',
})

const route = useRoute()
const router = useRouter()
const auth = useAuth()
const fileId = route.query.id as string

// Durum değişkenleri
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)
const password = ref('')
const fileInfo = ref<{
  fileName: string
  fileId: string
} | null>(null)

// Dosya bilgilerini getir
async function fetchFileInfo() {
  if (!fileId) {
    error.value = 'Dosya kimliği eksik.'
    return
  }

  loading.value = true
  error.value = null

  // try {
  //   const response = await fetch(`/api/download/${fileId}/info`) // Kendi API adresinizle değiştirin
  //   // HTTP durum koduna göre hata mesajı
  //   if (response.status === 404) {
  //     error.value = 'Dosya sunucuda bulunamadı.'
  //     loading.value = false
  //     return
  //   }
  //   const data = await response.json()

  //   if (data.success) {
  //     fileInfo.value = {
  //       fileName: data.fileName,
  //       fileId: data.fileId,
  //     }
  //   }
  //   else {
  //     error.value = data.message || 'Dosya bilgileri alınamadı.'
  //   }
  // }
  // catch (err) {
  //   console.error('Dosya bilgileri alınamadı:', err)
  //   error.value = 'Dosya bilgileri alınırken sunucu hatası.'
  // }
  // finally {
  //   loading.value = false
  // }

  // Örnek veri - API bağlantısı yapılana kadar
  setTimeout(() => {
    fileInfo.value = { fileName: 'ornek-dosya.pdf', fileId }
    loading.value = false
  }, 1000)
}

// Dosyayı indir
async function downloadFile() {
  if (!fileId || !password.value) {
    error.value = 'Şifre gerekli.'
    return
  }

  loading.value = true
  error.value = null

  // try {
  //   const response = await fetch(`/api/download/${fileId}`, { // Kendi API adresinizle değiştirin
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ password: password.value }),
  //   })

  //   // HTTP durum koduna göre hata mesajı
  //   if (response.status === 401) {
  //     error.value = 'Yanlış şifre.'
  //     loading.value = false
  //     return
  //   }
  //   if (response.status === 404) {
  //     error.value = 'Dosya sunucuda bulunamadı.'
  //     loading.value = false
  //     return
  //   }

  //   if (response.ok) {
  //     const blob = await response.blob()
  //     const url = window.URL.createObjectURL(blob)
  //     const link = document.createElement('a')
  //     link.href = url
  //     link.download = fileInfo.value?.fileName || `file-${fileId}`
  //     document.body.appendChild(link)
  //     link.click()
  //     document.body.removeChild(link)
  //     window.URL.revokeObjectURL(url)
  //     success.value = true
  //   }
  //   else {
  //     const data = await response.json()
  //     error.value = data.message || 'Dosya indirilemedi.'
  //   }
  // }
  // catch (err) {
  //   console.error('Dosya indirme hatası:', err)
  //   error.value = 'Sunucu hatası.'
  // }
  // finally {
  //   loading.value = false
  // }
  // Örnek davranış - API bağlantısı yapılana kadar
  setTimeout(() => {
    if (password.value === '1234') {
      success.value = true
      error.value = null
    }
    else {
      error.value = 'Yanlış şifre.'
    }
    loading.value = false
  }, 1500)
}

// Sayfa yüklendiğinde dosya bilgilerini getir
onMounted(() => {
  fetchFileInfo()
})
</script>

<template>
  <div class="relative min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <Card class="max-w-md w-full shadow-lg">
      <CardHeader class="bg-yellow-400 text-gray-800">
        <CardTitle class="text-xl">
          Dosya İndirme
        </CardTitle>
        <CardDescription class="text-gray-700">
          Dosyayı indirmek için lütfen şifreyi girin.
        </CardDescription>
      </CardHeader>

      <CardContent class="pt-6">
        <!-- Yükleniyor durumu -->
        <div v-if="loading" class="flex justify-center py-8">
          <div class="h-8 w-8 animate-spin border-b-2 border-yellow-400 rounded-full" />
        </div>

        <!-- Hata durumu -->
        <Alert v-if="error" variant="destructive" class="mb-4">
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>{{ error }}</AlertDescription>
        </Alert>

        <!-- Başarı durumu -->
        <Alert v-if="success" variant="default" class="mb-4 border-green-200 bg-green-50 text-green-800">
          <AlertTitle>Başarılı</AlertTitle>
          <AlertDescription>Dosya başarıyla indirildi.</AlertDescription>
        </Alert>

        <!-- Dosya bilgileri ve şifre formu -->
        <div v-if="fileInfo && !success" class="space-y-4">
          <div class="rounded-md bg-gray-50 p-4">
            <div class="text-sm text-gray-500">
              Dosya Adı
            </div>
            <div class="text-gray-800 font-medium">
              {{ fileInfo.fileName }}
            </div>
          </div>

          <div class="space-y-2">
            <Label for="password" class="text-gray-700">Şifre</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="Şifrenizi girin"
              class="w-full border-gray-300 text-gray-800 focus:border-yellow-400 placeholder:text-gray-400 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
            />
            <p class="text-xs text-gray-500">
              Dosyayı indirmek için size verilen şifreyi kullanın.
            </p>
          </div>
        </div>

        <!-- Dosya bulunamadı -->
        <div v-if="!loading && !fileInfo && !success" class="py-8 text-center text-gray-500">
          Dosya bulunamadı veya bilgi alınamadı.
        </div>
      </CardContent>

      <CardFooter v-if="fileInfo && !success" class="flex justify-end">
        <Button
          :disabled="loading || !password"
          class="bg-yellow-400 text-gray-800 hover:bg-yellow-500"
          @click="downloadFile"
        >
          <span v-if="loading">İndiriliyor...</span>
          <span v-else>İndir</span>
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<style scoped>
/* Input stillerini özelleştir */
:deep(.input) {
  color: #333 !important;
  background-color: white !important;
}

:deep(.input::placeholder) {
  color: #9ca3af !important;
}

/* Şifre input alanı için ek stiller */
:deep(#password) {
  color: #333 !important;
  -webkit-text-fill-color: #333 !important;
  opacity: 1 !important;
}
</style>
