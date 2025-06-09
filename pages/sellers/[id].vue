<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSeller } from '@/composables/useSellers'

const route = useRoute()
const sellerId = route.params.id as string

const { seller, loading, error, updateSeller } = useSeller(sellerId)

const showEditModal = ref(false)
const form = ref({
  name: '',
  email: '',
  phone: '',
  company: '',
})

// Satıcı verisi yüklendiğinde formu doldurmak için izleyici (watcher)
watch(seller, (newSeller) => {
  if (newSeller) {
    form.value = {
      name: newSeller.name,
      email: newSeller.email,
      phone: newSeller.phone || '',
      company: newSeller.company || '',
    }
  }
}, { immediate: true })

function formatDate(dateString: string | Date) {
  if (!dateString) return ''
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: tr,
  })
}

async function handleSubmit() {
  if (!seller.value) return

  try {
    await updateSeller({
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      company: form.value.company,
    })
    showEditModal.value = false
  }
  catch (err) {
    console.error('Error updating seller:', err)
    // İsteğe bağlı olarak kullanıcıya bir hata mesajı gösterebilirsiniz.
  }
}
</script>

<template>
  <div class="mx-auto p-4 container">
    <div v-if="loading" class="h-64 flex items-center justify-center">
      <p class="text-gray-500">
        Yükleniyor...
      </p>
    </div>

    <div v-else-if="error" class="h-64 flex items-center justify-center">
      <p class="text-red-500">
        {{ error }}
      </p>
    </div>

    <div v-else-if="seller" class="space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between rounded-lg from-primary/10 to-primary/5 bg-gradient-to-r p-4">
        <div>
          <h1 class="text-2xl text-primary font-bold">
            {{ seller.name }}
          </h1>
          <p class="text-sm text-muted-foreground">
            Kayıt: {{ formatDate(seller.createdAt) }}
          </p>
        </div>
        <Button @click="showEditModal = true">
          Düzenle
        </Button>
      </div>

      <Card class="border-none shadow-lg">
        <CardContent class="p-6">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="space-y-4">
              <h2 class="mb-2 text-lg text-primary font-semibold">
                İletişim Bilgileri
              </h2>
              <div class="flex items-center gap-2">
                <Icon name="i-heroicons-user" class="h-5 w-5 text-primary" />
                <div>
                  <h3 class="text-sm text-primary font-medium">
                    Ad Soyad
                  </h3>
                  <p class="text-sm font-medium">
                    {{ seller.name }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="i-heroicons-envelope" class="h-5 w-5 text-primary" />
                <div>
                  <h3 class="text-sm text-primary font-medium">
                    E-posta
                  </h3>
                  <a :href="`mailto:${seller.email}`" class="text-sm text-primary font-medium hover:underline">
                    {{ seller.email }}
                  </a>
                </div>
              </div>
               <div v-if="seller.phone" class="flex items-center gap-2">
                <Icon name="i-heroicons-phone" class="h-5 w-5 text-primary" />
                <div>
                  <h3 class="text-sm text-primary font-medium">
                    Telefon
                  </h3>
                  <p class="text-sm font-medium">
                    {{ seller.phone }}
                  </p>
                </div>
              </div>
              <div v-if="seller.company" class="flex items-center gap-2">
                <Icon name="i-heroicons-building-office" class="h-5 w-5 text-primary" />
                <div>
                  <h3 class="text-sm text-primary font-medium">
                    Şirket
                  </h3>
                  <p class="text-sm font-medium">
                    {{ seller.company }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Edit Modal -->
    <Dialog v-model:open="showEditModal">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Satıcı Düzenle</DialogTitle>
          <DialogDescription>
            Satıcı bilgilerini güncelleyin.
          </DialogDescription>
        </DialogHeader>
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <Label for="name">Ad Soyad</Label>
            <Input
              id="name"
              v-model="form.name"
              placeholder="Ad Soyad"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="email">E-posta</Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="E-posta"
              required
            />
          </div>
           <div class="space-y-2">
            <Label for="phone">Telefon</Label>
            <Input
              id="phone"
              v-model="form.phone"
              placeholder="Telefon"
            />
          </div>
           <div class="space-y-2">
            <Label for="company">Şirket</Label>
            <Input
              id="company"
              v-model="form.company"
              placeholder="Şirket"
            />
          </div>
          <div class="flex justify-end gap-2">
            <Button variant="outline" type="button" @click="showEditModal = false">
              İptal
            </Button>
            <Button type="submit">
              Kaydet
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>