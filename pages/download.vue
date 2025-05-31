<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import LanguageSwitcher from '~/components/LanguageSwitcher.vue'
import { useAuth } from '~/composables/useAuth'

// Giriş yapmamış kullanıcılar için blank layout kullanılacak
definePageMeta({
  layout: 'blank',
})

const route = useRoute()
const router = useRouter()
const auth = useAuth()
const { t } = useI18n()
const fileId = route.query.id as string

// Durum değişkenleri
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)
const password = ref('')
const fileInfo = ref<{
  fileName: string
  positionId: string
  fileId: string
} | null>(null)

// Dosya bilgilerini getir
async function fetchFileInfo() {
  if (!fileId) {
    error.value = t('download.error.fileIdMissing')
    return
  }

  loading.value = true
  error.value = null

  try {
    const response = await fetch(`https://customer.maxitransport.net/api/download/${fileId}/info`)
    // HTTP durum koduna göre hata mesajı
    if (response.status === 404) {
      error.value = t('download.error.fileNotFoundServer')
      loading.value = false
      return
    }
    const data = await response.json()

    if (data.success) {
      fileInfo.value = {
        fileName: data.fileName,
        positionId: data.positionId,
        fileId: data.fileId,
      }

      // Kullanıcı giriş yapmışsa, pozisyon detay sayfasına yönlendir
      if (auth.accessToken && data.positionId) {
        router.push(`/positions/detail?id=${data.positionId}`)
      }
    }
    else {
      error.value = data.message || t('download.error.infoFailed')
    }
  }
  catch (err) {
    console.error('Dosya bilgileri alınamadı:', err)
    error.value = t('download.error.infoServerError')
  }
  finally {
    loading.value = false
  }
}

// Dosyayı indir
async function downloadFile() {
  if (!fileId || !password.value) {
    error.value = t('download.error.passwordRequired')
    return
  }

  loading.value = true
  error.value = null

  try {
    const response = await fetch(`https://customer.maxitransport.net/api/download/${fileId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: password.value }),
    })

    // HTTP durum koduna göre hata mesajı
    if (response.status === 401) {
      error.value = t('download.error.wrongPassword')
      loading.value = false
      return
    }
    if (response.status === 404) {
      error.value = t('download.error.fileNotFoundServer')
      loading.value = false
      return
    }

    if (response.ok) {
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileInfo.value?.fileName || `file-${fileId}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      success.value = true
    }
    else {
      const data = await response.json()
      error.value = data.message || t('download.error.downloadFailed')
    }
  }
  catch (err) {
    console.error('Dosya indirme hatası:', err)
    error.value = t('download.error.serverError')
  }
  finally {
    loading.value = false
  }
}

// Sayfa yüklendiğinde dosya bilgilerini getir
onMounted(() => {
  fetchFileInfo()
})
</script>

<template>
  <div class="relative min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <!-- Dil değiştirme butonu -->
    <div class="absolute right-4 top-4">
      <LanguageSwitcher />
    </div>

    <Card class="max-w-md w-full shadow-lg">
      <CardHeader class="bg-yellow-400 text-gray-800">
        <CardTitle class="text-xl">
          {{ t('download.title') }}
        </CardTitle>
        <CardDescription class="text-gray-700">
          {{ t('download.description') }}
        </CardDescription>
      </CardHeader>

      <CardContent class="pt-6">
        <!-- Yükleniyor durumu -->
        <div v-if="loading" class="flex justify-center py-8">
          <div class="h-8 w-8 animate-spin border-b-2 border-yellow-400 rounded-full" />
        </div>

        <!-- Hata durumu -->
        <Alert v-if="error" variant="destructive" class="mb-4">
          <AlertTitle>{{ t('download.error.title') }}</AlertTitle>
          <AlertDescription>{{ error }}</AlertDescription>
        </Alert>

        <!-- Başarı durumu -->
        <Alert v-if="success" variant="default" class="mb-4 border-green-200 bg-green-50 text-green-800">
          <AlertTitle>{{ t('download.success.title') }}</AlertTitle>
          <AlertDescription>{{ t('download.success.message') }}</AlertDescription>
        </Alert>

        <!-- Dosya bilgileri ve şifre formu -->
        <div v-if="fileInfo && !success" class="space-y-4">
          <div class="rounded-md bg-gray-50 p-4">
            <div class="text-sm text-gray-500">
              {{ t('download.fileInfo.fileName') }}
            </div>
            <div class="text-gray-800 font-medium">
              {{ fileInfo.fileName }}
            </div>

            <div class="mt-2 text-sm text-gray-500">
              {{ t('download.fileInfo.positionId') }}
            </div>
            <div class="text-gray-800 font-medium">
              {{ fileInfo.positionId }}
            </div>
          </div>

          <div class="space-y-2">
            <Label for="password" class="text-gray-700">{{ t('download.password') }}</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              :placeholder="t('download.passwordPlaceholder')"
              class="w-full border-gray-300 text-gray-800 focus:border-yellow-400 placeholder:text-gray-400 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
            />
            <p class="text-xs text-gray-500">
              {{ t('download.passwordHint') }}
            </p>
          </div>
        </div>

        <!-- Dosya bulunamadı -->
        <div v-if="!loading && !fileInfo && !success" class="py-8 text-center text-gray-500">
          {{ t('download.error.fileNotFound') }}
        </div>
      </CardContent>

      <CardFooter v-if="fileInfo && !success" class="flex justify-end">
        <Button
          :disabled="loading || !password"
          class="bg-yellow-400 text-gray-800 hover:bg-yellow-500"
          @click="downloadFile"
        >
          <span v-if="loading">{{ t('download.downloading') }}</span>
          <span v-else>{{ t('download.downloadButton') }}</span>
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
