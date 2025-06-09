<script setup lang="ts">
import { ref } from 'vue'
import { useNuxtApp } from '#app'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useAuth } from '@/composables/useAuth'
import { toast } from 'vue-sonner'

const emit = defineEmits(['close', 'success'])
const { $apiFetch } = useNuxtApp()
const authStore = useAuth()

const isLoading = ref(false)

const buyer = ref({
  name: '',
  email: '',
  phone: '',
})

const transactionType = ref('SALE')

const searchRequest = ref({
  propertyType: '',
  location: '',
  numberOfRooms: '',
  minPrice: undefined as number | undefined,
  maxPrice: undefined as number | undefined,
  minSize: undefined as number | undefined,
  maxSize: undefined as number | undefined,
  notes: '',
})

async function handleSubmit() {
  isLoading.value = true
  const payload = {
    ...searchRequest.value,
    transactionType: transactionType.value,
    buyer: {
      ...buyer.value,
    },
  }

  try {
    await $apiFetch('/api/property-search-requests', {
      method: 'POST',
      body: payload,
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    })

    toast.success('Alıcı talebi başarıyla oluşturuldu!')
    emit('success')
  }
  catch (error: any) {
    console.error('Alıcı talebi oluşturulurken hata:', JSON.stringify(error, null, 2))
    const errorMessage = error.data?.message || 'Bilinmeyen bir hata oluştu.'
    toast.error('Talep oluşturulamadı.', {
      description: Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage,
    })
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>Yeni Alıcı Talebi Oluştur</CardTitle>
      <CardDescription>Yeni bir mülk arayışında olan alıcı ve talebi için bilgileri girin.</CardDescription>
    </CardHeader>
    <CardContent>
      <form class="space-y-8" @submit.prevent="handleSubmit">
        <!-- Alıcı Bilgileri -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium">Alıcı Bilgileri</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="space-y-2">
              <Label for="name">Ad Soyad</Label>
              <Input id="name" v-model="buyer.name" placeholder="örn: Ahmet Yılmaz" required />
            </div>
            <div class="space-y-2">
              <Label for="email">E-posta Adresi</Label>
              <Input id="email" v-model="buyer.email" type="email" placeholder="örn: ahmet@ornek.com" required />
            </div>
            <div class="space-y-2">
              <Label for="phone">Telefon Numarası</Label>
              <Input id="phone" v-model="buyer.phone" placeholder="örn: 555 123 4567" />
            </div>
          </div>
        </div>

        <!-- Talep Bilgileri -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium">Talep Edilen Mülk Özellikleri</h3>
          <div class="space-y-2">
            <Label>İşlem Türü</Label>
            <RadioGroup v-model="transactionType" class="flex items-center gap-4">
              <div class="flex items-center space-x-2">
                <RadioGroupItem id="buy" value="SALE" />
                <Label for="buy">Satılık</Label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroupItem id="rent" value="RENT" />
                <Label for="rent">Kiralık</Label>
              </div>
            </RadioGroup>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <Label for="propertyType">Mülk Tipi</Label>
              <Select v-model="searchRequest.propertyType" required>
                <SelectTrigger id="propertyType">
                  <SelectValue placeholder="Mülk tipi seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Konut</SelectLabel>
                    <SelectItem value="daire">Daire</SelectItem>
                    <SelectItem value="mustakil">Müstakil Ev</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectLabel>Ticari</SelectLabel>
                    <SelectItem value="dukkan">Dükkan</SelectItem>
                    <SelectItem value="ofis">Ofis</SelectItem>
                    <SelectLabel>Arsa</SelectLabel>
                    <SelectItem value="imarli">İmarlı Arsa</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <Label for="numberOfRooms">Oda Sayısı</Label>
              <Input id="numberOfRooms" v-model="searchRequest.numberOfRooms" placeholder="örn: 3+1" />
            </div>
            <div class="space-y-2">
              <Label for="location">Konum</Label>
              <Input id="location" v-model="searchRequest.location" placeholder="örn: Beşiktaş, İstanbul" required />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="minPrice">Minimum Fiyat (₺)</Label>
                <Input id="minPrice" v-model.number="searchRequest.minPrice" type="number" placeholder="örn: 1.000.000" />
              </div>
              <div class="space-y-2">
                <Label for="maxPrice">Maksimum Fiyat (₺)</Label>
                <Input id="maxPrice" v-model.number="searchRequest.maxPrice" type="number" placeholder="örn: 2.000.000" />
              </div>
            </div>
             <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="minSize">Minimum Metrekare (m²)</Label>
                <Input id="minSize" v-model.number="searchRequest.minSize" type="number" placeholder="örn: 80" />
              </div>
              <div class="space-y-2">
                <Label for="maxSize">Maksimum Metrekare (m²)</Label>
                <Input id="maxSize" v-model.number="searchRequest.maxSize" type="number" placeholder="örn: 150" />
              </div>
            </div>
             <div class="col-span-full space-y-2">
                <Label for="notes">Ek Notlar</Label>
                <Textarea id="notes" v-model="searchRequest.notes" placeholder="Müşterinin özel istekleri veya notları..." />
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-4">
          <Button type="button" variant="outline" :disabled="isLoading" @click="$emit('close')">İptal</Button>
          <Button type="submit" :disabled="isLoading">
            <span v-if="isLoading">Kaydediliyor...</span>
            <span v-else>Alıcı Talebini Kaydet</span>
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template> 