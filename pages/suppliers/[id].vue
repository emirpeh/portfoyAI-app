<script lang="ts" setup>
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
import { useSuppliers } from '@/composables/useSuppliers'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { locale, t } = useI18n()
const { fetchSupplier, updateSupplier } = useSuppliers()

const supplier = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const showEditModal = ref(false)
const form = ref({
  name: '',
  email: '',
  gender: 'MALE' as 'MALE' | 'FEMALE',
  companyName: '',
  countries: '',
  foreignTrades: '',
  language: 'turkish',
})

onMounted(async () => {
  try {
    const data = await fetchSupplier(Number(route.params.id))
    supplier.value = data
    form.value = {
      name: data.name,
      email: data.email,
      gender: data.gender,
      companyName: data.companyName,
      countries: data.countries,
      foreignTrades: data.foreignTrades,
      language: data.language,
    }
  }
  catch {
    error.value = 'Tedarikçi bilgileri yüklenirken bir hata oluştu.'
  }
  finally {
    loading.value = false
  }
})

function formatDate(date: Date) {
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: locale.value === 'tr' ? tr : undefined,
  })
}

function formatCountries(countries: string | string[]) {
  const countriesArray = Array.isArray(countries) ? countries : countries.split(',')
  return countriesArray.map(country => country.trim()).join(', ')
}

function formatForeignTrades(trades: string | string[]) {
  const tradesArray = Array.isArray(trades) ? trades : trades.split(',')
  return tradesArray.map((trade) => {
    switch (trade.trim()) {
      case 'IM':
        return 'İthalat'
      case 'EX':
        return 'İhracat'
      case 'TRN':
        return 'Transit'
      default:
        return trade
    }
  }).join(', ')
}

function formatLanguage(language: string) {
  return t(`language.${language.toLowerCase()}`) || language.toUpperCase()
}

async function handleSubmit() {
  try {
    await updateSupplier(supplier.value.id, form.value)
    const data = await fetchSupplier(Number(route.params.id))
    supplier.value = data
    showEditModal.value = false
  }
  catch (error) {
    console.error('Error updating supplier:', error)
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

    <div v-else-if="supplier" class="space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between rounded-lg from-primary/10 to-primary/5 bg-gradient-to-r p-4">
        <div>
          <h1 class="text-2xl text-primary font-bold">
            {{ supplier.name }}
          </h1>
          <p class="text-sm text-muted-foreground">
            {{ formatDate(new Date(supplier.createdAt)) }}
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
                Kişisel Bilgiler
              </h2>
              <div class="flex items-center gap-2">
                <Icon name="i-heroicons-user" class="h-5 w-5 text-primary" />
                <div>
                  <h3 class="text-sm text-primary font-medium">
                    Ad Soyad
                  </h3>
                  <p class="text-sm font-medium">
                    {{ supplier.name }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="i-heroicons-envelope" class="h-5 w-5 text-primary" />
                <div>
                  <h3 class="text-sm text-primary font-medium">
                    E-posta
                  </h3>
                  <a :href="`mailto:${supplier.email}`" class="text-sm text-primary font-medium hover:underline">
                    {{ supplier.email }}
                  </a>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="i-heroicons-user" class="h-5 w-5 text-primary" />
                <div>
                  <h3 class="text-sm text-primary font-medium">
                    Cinsiyet
                  </h3>
                  <p class="text-sm font-medium">
                    {{ supplier.gender === 'MALE' ? 'Erkek' : 'Kadın' }}
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <h2 class="mb-2 text-lg text-primary font-semibold">
                Firma Bilgileri
              </h2>
              <div class="flex items-center gap-2">
                <Icon name="i-heroicons-building-office" class="h-5 w-5 text-primary" />
                <div>
                  <h3 class="text-sm text-primary font-medium">
                    Firma Adı
                  </h3>
                  <p class="text-sm font-medium">
                    {{ supplier.companyName }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="i-heroicons-globe-americas" class="h-5 w-5 text-primary" />
                <div>
                  <h3 class="text-sm text-primary font-medium">
                    Ülkeler
                  </h3>
                  <p class="text-sm font-medium">
                    {{ formatCountries(supplier.countries) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="i-heroicons-globe-americas" class="h-5 w-5 text-primary" />
                <div>
                  <h3 class="text-sm text-primary font-medium">
                    Dış Ticaret
                  </h3>
                  <p class="text-sm font-medium">
                    {{ formatForeignTrades(supplier.foreignTrades) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="i-heroicons-globe-americas" class="h-5 w-5 text-primary" />
                <div>
                  <h3 class="text-sm text-primary font-medium">
                    Dil
                  </h3>
                  <p class="text-sm font-medium">
                    {{ formatLanguage(supplier.language) }}
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
          <DialogTitle>Tedarikçi Düzenle</DialogTitle>
          <DialogDescription>
            Tedarikçi bilgilerini güncelleyin.
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
            <Label for="gender">Cinsiyet</Label>
            <select
              id="gender"
              v-model="form.gender"
              class="w-full border rounded bg-background px-3 py-2 text-foreground"
              required
            >
              <option value="MALE">
                Erkek
              </option>
              <option value="FEMALE">
                Kadın
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <Label for="companyName">Firma Adı</Label>
            <Input
              id="companyName"
              v-model="form.companyName"
              placeholder="Firma Adı"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="countries">Ülkeler</Label>
            <Input
              id="countries"
              v-model="form.countries"
              placeholder="Ülkeler"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="foreignTrades">Dış Ticaret</Label>
            <select
              id="foreignTrades"
              v-model="form.foreignTrades"
              class="w-full border rounded bg-background px-3 py-2 text-foreground"
              required
              multiple
            >
              <option value="IM">
                İthalat
              </option>
              <option value="EX">
                İhracat
              </option>
              <option value="TRN">
                Transit
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <Label for="language">Dil</Label>
            <select
              id="language"
              v-model="form.language"
              class="w-full border rounded bg-background px-3 py-2 text-foreground"
              required
            >
              <option value="tr">
                Türkçe
              </option>
              <option value="en">
                İngilizce
              </option>
              <option value="hr">
                Hırvatça
              </option>
              <option value="sl">
                Slovence
              </option>
              <option value="bs">
                Boşnakça
              </option>
              <option value="mk">
                Makedonca
              </option>
            </select>
          </div>
          <div class="flex justify-end gap-2">
            <Button variant="outline" @click="showEditModal = false">
              İptal
            </Button>
            <Button type="submit">
              Güncelle
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>
