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

const emit = defineEmits(['close'])
const { $apiFetch } = useNuxtApp()
const authStore = useAuth()

const isLoading = ref(false)

const seller = ref({
  name: '',
  email: '',
  phone: '',
})

const property = ref({
  title: '',
  description: '',
  transactionType: 'SATILIK', // Changed from 'status' to match DTO
  propertyType: '',
  price: undefined as number | undefined,
  location: '',
  size: undefined as number | undefined,
  roomCount: '',
})

async function handleSubmit() {
  isLoading.value = true
  const payload = {
    seller: seller.value,
    ...property.value,
  }

  try {
    await $apiFetch('/api/real-estate-listings', {
      method: 'POST',
      body: payload,
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    })

    toast.success('Satıcı ve mülk başarıyla kaydedildi!')
    emit('close')
  } catch (error: any) {
    console.error('Satıcı ve mülk kaydedilirken hata:', error)
    const errorMessage = error.data?.message || 'Bilinmeyen bir hata oluştu.'
    toast.error('Kayıt oluşturulamadı.', {
      description: errorMessage,
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>Yeni Satıcı ve Mülk Ekle</CardTitle>
      <CardDescription>Mülkünü satmak veya kiralamak isteyen yeni bir satıcı ve mülk bilgilerini girin.</CardDescription>
    </CardHeader>
    <CardContent>
      <form class="space-y-8" @submit.prevent="handleSubmit">
        <!-- Satıcı Bilgileri -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium">Satıcı Bilgileri</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="space-y-2">
              <Label for="seller-name">Ad Soyad</Label>
              <Input id="seller-name" v-model="seller.name" placeholder="örn: Zeynep Kaya" required />
            </div>
            <div class="space-y-2">
              <Label for="seller-email">E-posta Adresi</Label>
              <Input id="seller-email" v-model="seller.email" type="email" placeholder="örn: zeynep@ornek.com" required/>
            </div>
            <div class="space-y-2">
              <Label for="seller-phone">Telefon Numarası</Label>
              <Input id="seller-phone" v-model="seller.phone" placeholder="örn: 555 987 6543" />
            </div>
          </div>
        </div>

        <!-- Mülk Bilgileri -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium">Mülk Bilgileri</h3>
           <div class="space-y-2">
              <Label for="property-title">İlan Başlığı</Label>
              <Input id="property-title" v-model="property.title" placeholder="örn: Sahil Kenarında 3+1 Lüks Villa" required />
            </div>
           <div class="space-y-2">
            <Label>İşlem Türü</Label>
            <RadioGroup v-model="property.transactionType" class="flex items-center gap-4">
              <div class="flex items-center space-x-2">
                <RadioGroupItem id="r1" value="SATILIK" />
                <Label for="r1">Satılık</Label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroupItem id="r2" value="KİRALIK" />
                <Label for="r2">Kiralık</Label>
              </div>
            </RadioGroup>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="space-y-2">
              <Label for="property-type-seller">Mülk Tipi</Label>
              <Select v-model="property.propertyType" required>
                <SelectTrigger id="property-type-seller">
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
              <Label for="room-count">Oda Sayısı</Label>
               <Select v-model="property.roomCount">
                <SelectTrigger id="room-count">
                  <SelectValue placeholder="Oda sayısı seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1+0">1+0 (Stüdyo)</SelectItem>
                  <SelectItem value="1+1">1+1</SelectItem>
                  <SelectItem value="2+1">2+1</SelectItem>
                  <SelectItem value="3+1">3+1</SelectItem>
                  <SelectItem value="4+1">4+1</SelectItem>
                  <SelectItem value="5+1">5+1 ve üzeri</SelectItem>
                  <SelectItem value="yok">Yok (Arsa/Dükkan vb.)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
                <Label for="property-price">Fiyat (₺)</Label>
                <Input id="property-price" v-model.number="property.price" type="number" placeholder="örn: 3.500.000" required />
            </div>
            <div class="space-y-2">
                <Label for="property-size">Metrekare (m²)</Label>
                <Input id="property-size" v-model.number="property.size" type="number" placeholder="örn: 150" />
            </div>
            <div class="space-y-2 col-span-full lg:col-span-2">
              <Label for="property-location">Konum</Label>
              <Input id="property-location" v-model="property.location" placeholder="örn: Kadıköy, İstanbul" required />
            </div>
          </div>
           <div class="col-span-full space-y-2">
              <Label for="property-description">Açıklama</Label>
              <Textarea id="property-description" v-model="property.description" placeholder="Mülk hakkındaki detaylı açıklamalar..." />
          </div>
        </div>

        <div class="flex justify-end gap-4">
          <Button type="button" variant="outline" :disabled="isLoading" @click="$emit('close')">İptal</Button>
          <Button type="submit" :disabled="isLoading">
            <span v-if="isLoading">Kaydediliyor...</span>
            <span v-else>Satıcı ve Mülkü Kaydet</span>
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template> 